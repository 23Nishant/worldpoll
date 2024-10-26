// app/api/polls/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET: Fetch all polls from the database
export async function GET() {
  try {
    const polls = await prisma.poll.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(polls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch polls' },
      { status: 500 }
    );
  }
}

// POST: Create a new poll in the database
export async function POST(request: NextRequest) {
  try {
    const { question, options } = await request.json();

    // Validate input
    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        { error: 'Invalid poll data' },
        { status: 400 }
      );
    }

    // Create poll in database
    const poll = await prisma.poll.create({
      data: {
        question,
        options,
        votes: Array(options.length).fill(0), // Initialize votes array
      },
    });

    return NextResponse.json(poll, { status: 201 });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    );
  }
}

// Optional: Add vote functionality
export async function PUT(request: NextRequest) {
  try {
    const { pollId, optionIndex } = await request.json();

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
    });

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    const newVotes = [...poll.votes];
    newVotes[optionIndex] += 1;

    const updatedPoll = await prisma.poll.update({
      where: { id: pollId },
      data: { votes: newVotes },
    });

    return NextResponse.json(updatedPoll);
  } catch (error) {
    console.error('Error updating votes:', error);
    return NextResponse.json(
      { error: 'Failed to update vote' },
      { status: 500 }
    );
  }
}