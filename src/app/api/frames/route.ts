import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const frames = await prisma.frame.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(frames);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch frames' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question, options } = await request.json();

    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        { error: 'Invalid frame data' },
        { status: 400 }
      );
    }

    const frame = await prisma.frame.create({
      data: {
        question,
        options,
        votes: Array(options.length).fill(0),
      },
    });

    return NextResponse.json(frame, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create frame' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { frameId, optionIndex } = await request.json();

    const frame = await prisma.frame.findUnique({
      where: { id: frameId },
    });

    if (!frame) {
      return NextResponse.json(
        { error: 'Frame not found' },
        { status: 404 }
      );
    }

    const newVotes = [...frame.votes];
    newVotes[optionIndex] += 1;

    const updatedFrame = await prisma.frame.update({
      where: { id: frameId },
      data: { votes: newVotes },
    });

    return NextResponse.json(updatedFrame);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update vote' },
      { status: 500 }
    );
  }
}
