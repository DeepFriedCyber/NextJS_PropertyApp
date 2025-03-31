'use client';

import { useState } from 'react';

interface PropertyChatProps {
  propertyId: string;
}

export default function PropertyChat({ propertyId }: PropertyChatProps) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, propertyId }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setResponse((prev) => prev + chunk);
        }
      }

    } catch (err) {
      console.error('Chat error:', err);
      setResponse('Sorry, something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Ask about this property</h2>

      <form onSubmit={askQuestion} className="flex flex-col gap-3">
        <textarea
          rows={3}
          className="p-3 border border-gray-300 rounded"
          placeholder="e.g. How far is the nearest Waitrose?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      {response && (
        <div className="mt-6 bg-white p-4 border border-gray-300 rounded shadow-sm">
          <strong>Answer:</strong>
          <p className="mt-1 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
}
