const OLLAMA_API_URL = process.env.NEXT_PUBLIC_OLLAMA_API_URL || 'http://localhost:11434';

export async function getEmbedding(input: string): Promise<number[]> {
  const res = await fetch(`${OLLAMA_API_URL}/api/embeddings`, {
    method: 'POST',
    body: JSON.stringify({
      model: 'nomic-embed-text',
      prompt: input
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await res.json();

  if (!data.embedding) throw new Error('Failed to embed input');
  return data.embedding;
}
