// app/api/generate-poll-image/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;
    
    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }
    
    // Generate a placeholder image URL with the question text
    // In a real implementation, you'd generate an actual image
    const encodedQuestion = encodeURIComponent(question);
    const imageUrl = `https://placehold.co/1920x1005/grey/white?text=${encodedQuestion}`;
    
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating poll image:', error);
    return NextResponse.json(
      { error: 'Failed to generate poll image' },
      { status: 500 }
    );
  }
}