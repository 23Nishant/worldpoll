// app/api/frames/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const frames = await prisma.frame.findMany({
      include: {
        poll: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(frames);
  } catch (error) {
    console.error('Error fetching frames:', error);
    return NextResponse.json(
      { error: 'Failed to fetch frames' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pollId, imageUrl, postUrl } = body;

    // Validate required fields
    if (!pollId || !imageUrl || !postUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new frame
    const frame = await prisma.frame.create({
      data: {
        pollId,
        imageUrl,
        postUrl,
        totalVotes: 0,
      },
      include: {
        poll: true,
      },
    });

    return NextResponse.json(frame);
  } catch (error) {
    console.error('Error creating frame:', error);
    return NextResponse.json(
      { error: 'Failed to create frame' },
      { status: 500 }
    );
  }
}