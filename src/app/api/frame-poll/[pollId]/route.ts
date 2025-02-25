// app/api/frame-poll/[pollId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(request: NextRequest, { params }: { params: { pollId: string } }) {
  try {
    const body = await request.json();
    const pollId = Number(params.pollId);
    
    // Get the button index (1-based) from Farcaster
    const buttonIndex = body.untrustedData?.buttonIndex || 1;
    
    // Find the poll
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        frame: true,
      },
    });

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    // Update the vote count for the selected option
    const optionIndex = buttonIndex - 1;
    if (optionIndex >= 0 && optionIndex < poll.votes.length) {
      const updatedVotes = [...poll.votes];
      updatedVotes[optionIndex]++;
      
      // Update poll votes
      await prisma.poll.update({
        where: { id: pollId },
        data: {
          votes: updatedVotes,
        },
      });
      
      // Update total votes on the frame
      if (poll.frame) {
        await prisma.frame.update({
          where: { id: poll.frame.id },
          data: {
            totalVotes: { increment: 1 },
          },
        });
      }
    }

    // Return an updated frame
    const frameId = poll.frame?.id;
    const frame = await prisma.frame.findUnique({
      where: { id: frameId },
      include: { poll: true },
    });

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>${poll.question}</title>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${frame?.imageUrl}" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:post_url" content="${frame?.postUrl}" />
  ${poll.options.slice(0, 2).map((option: string, index: number) => `
  <meta property="fc:frame:button:${index + 1}" content="${option}" />
  <meta property="fc:frame:button:${index + 1}:action" content="post" />`).join('')}
  <meta property="fc:frame:state" content="${JSON.stringify({ voted: buttonIndex })}" />
</head>
<body>
  <h1>${poll.question}</h1>
  <p>Thanks for voting! Current results: ${poll.votes.join(', ')}</p>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}