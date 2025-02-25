// app/api/frame/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const frame = await prisma.frame.findUnique({
      where: { id: Number(params.id) },
      include: {
        poll: true,
      },
    });

    if (!frame) {
      return NextResponse.json(
        { error: 'Frame not found' },
        { status: 404 }
      );
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>${frame.poll?.question}</title>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${frame.imageUrl}" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:post_url" content="${frame.postUrl}" />
  ${frame.poll?.options.slice(0, 2).map((option: string, index: number) => `
  <meta property="fc:frame:button:${index + 1}" content="${option}" />
  <meta property="fc:frame:button:${index + 1}:action" content="post" />`).join('')}
</head>
<body>
  <h1>${frame.poll?.question}</h1>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error fetching frame:', error);
    return NextResponse.json(
      { error: 'Failed to fetch frame' },
      { status: 500 }
    );
  }
}