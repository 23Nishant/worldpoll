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
  } catch (error) {
    console.error('Error fetching frames:', error);
    return NextResponse.json({ error: 'Error fetching frames' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pollId } = await request.json();

    // Check if poll exists
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
    });

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    // Check if frame already exists for this poll
    const existingFrame = await prisma.frame.findFirst({
      where: { pollId },
    });

    if (existingFrame) {
      return NextResponse.json(
        { error: 'Frame already exists for this poll' },
        { status: 400 }
      );
    }

    // Create the frame
    const frame = await prisma.frame.create({
      data: {
        pollId,
        imageUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/frames/${pollId}/image`,
        postUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/frames/${pollId}/vote`,
        totalVotes: 0,
      },
      include: {
        poll: true, // Include the poll data in the response
      },
    });

    return NextResponse.json(frame, { status: 201 });
  } catch (error) {
    console.error('Error creating frame:', error);
    return NextResponse.json(
      { error: 'Error creating frame' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { frameId, votes } = await request.json();

    const updatedFrame = await prisma.frame.update({
      where: { id: frameId },
      data: {
        totalVotes: votes,
      },
      include: {
        poll: true,
      },
    });

    return NextResponse.json(updatedFrame);
  } catch (error) {
    console.error('Error updating frame votes:', error);
    return NextResponse.json(
      { error: 'Error updating frame votes' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { frameId } = await request.json();

    await prisma.frame.delete({
      where: { id: frameId },
    });

    return NextResponse.json(
      { message: 'Frame deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting frame:', error);
    return NextResponse.json(
      { error: 'Error deleting frame' },
      { status: 500 }
    );
  }
}