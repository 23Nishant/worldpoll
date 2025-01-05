// src/app/api/publish-frame/route.ts
import { NextResponse } from 'next/server';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY!);

export async function POST(request: Request) {
  try {
    const { frameHtml, imageUrl } = await request.json();

    if (!frameHtml || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Publish the frame to Farcaster using the Neynar SDK
    const response = await client.publishCast({
      signer_uuid: process.env.NEYNAR_SIGNER_UUID!,
      text: "New Frame Poll", // You can customize this text
      embeds: [{ url: imageUrl }],
      frames: [{ html: frameHtml }]
    });

    return NextResponse.json({
      castHash: response.hash,
      success: true
    });

  } catch (error) {
    console.error('Error publishing to Farcaster:', error);
    return NextResponse.json(
      { error: 'Failed to publish frame to Farcaster' },
      { status: 500 }
    );
  }
}