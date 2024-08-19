export function getFrameHtmlResponse(question: string, option1: string, option2: string, voteCount: { option1: number; option2: number }): string {
    const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${NEXT_PUBLIC_URL}/api/image" />
          <meta property="fc:frame:button:1" content="${option1} (${voteCount.option1})" />
          <meta property="fc:frame:button:2" content="${option2} (${voteCount.option2})" />
          <meta property="fc:frame:post_url" content="${NEXT_PUBLIC_URL}/api/vote" />
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
  