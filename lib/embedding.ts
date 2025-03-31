const OLLAMA_API_URL = process.env.NEXT_PUBLIC_OLLAMA_API_URL || 'http://localhost:11434';

export async function getEmbedding(input: string): Promise<number[]> {
  const res = await fetch(`${OLLAMA_API_URL}/api/embeddings`, {
    method: 'POST',
    body: JSON.stringify({
      model: 'llama2',
      prompt: input
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await res.json();

  if (!data.embedding) throw new Error('Failed to embed input');
  
  // Duplicate the 768-dimension vector to create a 1536-dimension vector
  const originalEmbedding = data.embedding;
  const duplicatedEmbedding = [...originalEmbedding, ...originalEmbedding];
  
  // Ensure exactly 1536 dimensions
  if (duplicatedEmbedding.length > 1536) {
    return duplicatedEmbedding.slice(0, 1536);
  } else if (duplicatedEmbedding.length < 1536) {
    return [...duplicatedEmbedding, ...new Array(1536 - duplicatedEmbedding.length).fill(0)];
  }
  
  return duplicatedEmbedding;
}
