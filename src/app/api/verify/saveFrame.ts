import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const SAVE_PATH = path.join(process.cwd(), 'Frames');
const COUNTER_FILE = path.join(process.cwd(), 'fileCounter.json'); // Path to the counter file

// Function to get the next file number
const getNextFileNumber = (): number => {
  if (!fs.existsSync(COUNTER_FILE)) {
    fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count: 0 }), 'utf8');
  }

  const data = fs.readFileSync(COUNTER_FILE, 'utf8');
  const { count } = JSON.parse(data);
  const nextCount = count + 1;

  fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count: nextCount }), 'utf8');
  return nextCount;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { question, option1, option2, voteCount } = req.body;

    if (!question || !option1 || !option2) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const htmlContent = getFrameHtmlResponse(question, option1, option2, voteCount);

    try {
      const fileNumber = getNextFileNumber();
      const filePath = path.join(SAVE_PATH, `frame${fileNumber}.html`);
      fs.writeFileSync(filePath, htmlContent);
      res.status(200).json({ message: 'Frame saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save frame' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function getFrameHtmlResponse(question: string, option1: string, option2: string, voteCount: { option1: number; option2: number }): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/image" />
        <meta property="fc:frame:button:1" content="${option1} (${voteCount.option1})" />
        <meta property="fc:frame:button:2" content="${option2} (${voteCount.option2})" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/vote" />
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
          }
          h1 {
            font-size: 24px;
            text-align: center;
            margin-bottom: 20px;
          }
          .button-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            width: 100%;
          }
          .vote-button {
            padding: 10px 20px;
            font-size: 18px;
            cursor: pointer;
            background-color: #000000;
            color: white;
            border: none;
            border-radius: 5px;
            transition: background-color 0.3s;
          }
          .vote-button:hover {
            background-color: #333333;
          }
        </style>
      </head>
      <body>
        <h1>${question}</h1>
        <div class="button-container">
          <button class="vote-button">${option1} (${voteCount.option1})</button>
          <button class="vote-button">${option2} (${voteCount.option2})</button>
        </div>
      </body>
    </html>
  `;
}
