

export function generateFrameHTML(poll: {
    id: string;
    question: string;
    options: string[];
    votes: number[];
  }) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="utf-8" />
      <title>${poll.question}</title>
      
      <!-- Frame Meta Tags -->
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_API_URL}/api/frames/${poll.id}/image" />
      <meta property="fc:frame:button:1" content="🔵 ${poll.options[0]}" />
      <meta property="fc:frame:button:2" content="🔴 ${poll.options[1]}" />
      <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_API_URL}/api/frames/${poll.id}/vote" />
      
      <!-- OpenGraph Tags -->
      <meta property="og:title" content="${poll.question}" />
      <meta property="og:description" content="Cast your vote!" />
      <meta property="og:image" content="${process.env.NEXT_PUBLIC_API_URL}/api/frames/${poll.id}/image" />
      
      <style>
          body {
              margin: 0;
              padding: 20px;
              background: #f5f5f5;
              font-family: system-ui, -apple-system, sans-serif;
          }
          
          .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          h1 {
              text-align: center;
              color: #333;
              margin-bottom: 20px;
          }
          
          .options {
              display: flex;
              justify-content: space-around;
              margin-top: 20px;
          }
          
          .option {
              padding: 10px 20px;
              border: 2px solid #ddd;
              border-radius: 8px;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>${poll.question}</h1>
          <div class="options">
              <div class="option">🔵 ${poll.options[0]} (${poll.votes[0]} votes)</div>
              <div class="option">🔴 ${poll.options[1]} (${poll.votes[1]} votes)</div>
          </div>
      </div>
  </body>
  </html>
    `;
  }