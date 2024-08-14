import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  
  try {
    const response = await fetch(
      'https://developer.worldcoin.org/api/v1/verify/app_staging_129259332fd6f93d4fabaadcc5e4ff9d',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...body, action: "trial-world-poll"}),
      }
    );

    if (response.ok) {
      const { verified } = await response.json();
      return NextResponse.json({ verified });
    } else {
      const { code, detail } = await response.json();
      return NextResponse.json({ error: `Error Code ${code}: ${detail}` }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify proof' }, { status: 500 });
  }
}