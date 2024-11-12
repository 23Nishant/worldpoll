// src/app/api/frames/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

interface Frame {
  id: number;
  pollId: number;
  imageUrl: string;
  postUrl: string;
  totalVotes: number;
  createdAt: string;
  poll?: {
    id: number;
    question: string;
    options: string[];
    votes: number[];
  };
}

const generateFrameHtml = (frame: Frame): string => {
  if (!frame.poll) return '';
  
  return `<!DOCTYPE html>
<html>
<head>
  <title>${frame.poll.question}</title>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${frame.imageUrl}" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:post_url" content="${frame.postUrl}" />
  ${frame.poll.options.map((option: string, index: number) => `
  <meta property="fc:frame:button:${index + 1}" content="${option}" />
  <meta property="fc:frame:button:${index + 1}:action" content="post" />`).join('')}
</head>
<body>
  <h1>${frame.poll.question}</h1>
</body>
</html>`;
};

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
    
    const framesWithHtml = frames.map(frame => ({
      ...frame,
      frameHtml: generateFrameHtml(frame as Frame)
    }));
    
    return NextResponse.json(framesWithHtml);
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
    const { pollId, imageUrl, postUrl } = await request.json();

    if (!pollId || !imageUrl || !postUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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

    const frameWithHtml = {
      ...frame,
      frameHtml: generateFrameHtml(frame as Frame)
    };

    return NextResponse.json(frameWithHtml, { status: 201 });
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

    const frameWithHtml = {
      ...updatedFrame,
      frameHtml: generateFrameHtml(updatedFrame as Frame)
    };

    return NextResponse.json(frameWithHtml);
  } catch (error) {
    console.error('Error updating vote:', error);
    return NextResponse.json(
      { error: 'Failed to update vote' },
      { status: 500 }
    );
  }
}