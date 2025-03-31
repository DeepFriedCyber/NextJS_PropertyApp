// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getXataClient } from '@/lib/xata';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Add this to your .env
});

export async function POST(req: Request) {
  try {
    const { question, propertyId } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'No question provided' }, { status: 400 });
    }

    if (!propertyId) {
      return NextResponse.json({ error: 'No property ID provided' }, { status: 400 });
    }

    const xata = getXataClient();

    // Fetch property data
    const property = await xata.db.properties.read(propertyId);

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Create a context for the AI with property details
    const propertyContext = `
      Property Information:
      Title: ${property.title}
      Location: ${property.location}
      Price: £${property.price?.toLocaleString()}
      Bedrooms: ${property.bedrooms}
      Bathrooms: ${property.bathrooms}
      Square Feet: ${property.squareFeet}
      Type: ${property.propertyType}
      Tenure: ${property.tenure}
      Listing Agent: ${property.listingAgent}
      Description: ${property.description}
    `;

    // Call OpenAI Chat API with property context
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo', // or 'gpt-3.5-turbo' for cheaper option
      messages: [
        {
          role: 'system',
          content: 'You are a helpful real estate assistant. Answer questions about the property using the provided information. If you don\'t know something specific about the property that wasn\'t included in the context, be honest about it.'
        },
        {
          role: 'user',
          content: `${propertyContext}\n\nQuestion about this property: ${question}`
        }
      ],
      temperature: 0.7,
      stream: true, // Enables streaming
    });

    // Create a proper ReadableStream that can be used with Response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        // Process the stream from OpenAI
        for await (const chunk of stream) {
          // Extract the content from the chunk
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            // Send the content as a server-sent event
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
          }
        }
        // Signal the end of the stream
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    // Return the properly formatted stream
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch AI response' }, { status: 500 });
  }
}
