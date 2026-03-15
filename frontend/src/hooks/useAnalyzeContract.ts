import { useState, useCallback, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import type { AnalysisState } from '../types';

export const useAnalyzeContract = () => {
  const { user } = useUser();
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    summary: '',
    result: null,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const analyze = useCallback(async (payload: { text?: string; file?: File }) => {
    // Reset state and cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setState({
      status: 'analyzing',
      summary: '',
      result: null,
      error: null,
    });

    try {
      const formData = new FormData();
      if (payload.file) {
        formData.append('file', payload.file);
      } else if (payload.text) {
        formData.append('text', payload.text);
      } else {
        throw new Error('Please provide either text or a PDF file.');
      }

      const headers: Record<string, string> = {};
      if (user?.id) headers['X-User-Id'] = user.id;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
        method: 'POST',
        headers,
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        let errorMsg = 'Failed to analyze contract';
        if (response.status === 429) {
           errorMsg = 'Too many requests. Please try again in a minute.';
        } else if (response.status === 422) {
           errorMsg = 'Invalid contract (must be between 50 and 50,000 characters).';
        } else {
           try {
             const data = await response.json();
             if (data.detail) errorMsg = data.detail;
           } catch {
             // Ignore JSON parse errors for non-JSON responses
           }
        }
        throw new Error(errorMsg);
      }

      if (!response.body) {
        throw new Error('ReadableStream not yet supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process line by line
        const lines = buffer.split('\n');
        // Keep the last partial line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          
          try {
            const jsonStr = trimmed.substring(6); // remove 'data: '
            const event = JSON.parse(jsonStr);

            if (event.section === 'summary_chunk') {
              setState(prev => ({ ...prev, summary: prev.summary + event.data }));
            } else if (event.section === 'result') {
              setState(prev => ({ ...prev, result: event.data }));
            } else if (event.section === 'done') {
              setState(prev => ({ ...prev, status: 'completed' }));
            } else if (event.section === 'error') {
              throw new Error(event.data.message || 'Analysis failed unexpectedly.');
            }
          } catch (e) {
            console.error('Error parsing SSE event:', e, 'Line:', trimmed);
            // Don't throw here, continue reading other chunks
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') {
         console.log('Analysis aborted');
      } else {
         setState(prev => ({
           ...prev,
           status: 'error',
           error: (err as Error).message || 'An unexpected error occurred.',
         }));
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [user?.id]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      status: 'idle',
      summary: '',
      result: null,
      error: null,
    });
  }, []);

  return { ...state, analyze, reset };
};
