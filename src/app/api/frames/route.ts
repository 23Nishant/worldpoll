import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const frames = await prisma.frame.findMany({
      include: {
        poll: true, // Include the associated poll data
      },
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
    const { pollId, imageUrl, postUrl } = await request.json();

    if (!pollId || !imageUrl || !postUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if a frame already exists for this poll
    const existingFrame = await prisma.frame.findUnique({
      where: { pollId: Number(pollId) },
    });

    if (existingFrame) {
      return NextResponse.json(
        { error: 'A frame already exists for this poll' },
        { status: 400 }
      );
    }

    const frame = await prisma.frame.create({
      data: {
        pollId: Number(pollId),
        imageUrl,
        postUrl,
        totalVotes: 0,
      },
      include: {
        poll: true,
      },
    });

    return NextResponse.json(frame, { status: 201 });
  } catch (error) {
    console.error('Error creating frame:', error);
    return NextResponse.json(
      { error: 'Failed to create frame' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { frameId } = await request.json();

    const frame = await prisma.frame.findUnique({
      where: { id: frameId },
    });

    if (!frame) {
      return NextResponse.json(
        { error: 'Frame not found' },
        { status: 404 }
      );
    }

    const updatedFrame = await prisma.frame.update({
      where: { id: frameId },
      data: { 
        totalVotes: frame.totalVotes + 1 
      },
      include: {
        poll: true,
      },
    });

    return NextResponse.json(updatedFrame);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update vote' },
      { status: 500 }
    );
  }
}