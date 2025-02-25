"use client";

import React, { useState, useEffect } from "react";
import styles from "./framespage.module.css";
import Navbar from "@/components/navbar";

interface Poll {
  id: number;
  question: string;
  options: string[];
  votes: number[];
}

interface Frame {
  id: number;
  pollId: number;
  imageUrl: string;
  postUrl: string;
  totalVotes: number;
  createdAt: string;
  poll?: Poll;
  frameHtml?: string;
<<<<<<< HEAD
  farcasterCastHash?: string;
=======
  frameUrl?: string;
>>>>>>> 6a3cc18 (frames added)
}

export default function FramesPage() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
<<<<<<< HEAD
  const [isPublishing, setIsPublishing] = useState(false);
=======
  const [isGenerating, setIsGenerating] = useState(false);
>>>>>>> 6a3cc18 (frames added)

  useEffect(() => {
    Promise.all([fetchFrames(), fetchPolls()])
      .finally(() => setIsLoading(false));
  }, []);

  const fetchFrames = async () => {
    try {
      const response = await fetch("/api/frames");
      if (!response.ok) throw new Error('Failed to fetch frames');
      const data = await response.json();
      setFrames(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch frames');
      console.error("Error fetching frames:", err);
    }
  };

  const fetchPolls = async () => {
    try {
      const response = await fetch("/api/polls");
      if (!response.ok) throw new Error('Failed to fetch polls');
      const data = await response.json();
      setPolls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch polls');
      console.error("Error fetching polls:", err);
    }
  };

  const handleGenerateFrame = async () => {
    if (!selectedPollId) {
      setError("Please select a poll.");
      return;
    }

    setIsGenerating(true);
    try {
      // 1. Get the selected poll
      const selectedPoll = polls.find(poll => poll.id === selectedPollId);
      if (!selectedPoll) {
        throw new Error("Selected poll not found");
      }

      // 2. Generate image with poll question via API
      const imageResponse = await fetch("/api/generate-poll-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: selectedPoll.question,
        }),
      });

      if (!imageResponse.ok) {
        throw new Error("Failed to generate poll image");
      }

      const { imageUrl } = await imageResponse.json();

      // 3. Create the frame with the API endpoint URL as the postUrl
      const postUrl = `${window.location.origin}/api/frame-poll/${selectedPollId}`;

      // 4. Save the frame
      const frameResponse = await fetch("/api/frames", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pollId: selectedPollId,
          imageUrl,
          postUrl,
          options: selectedPoll.options.slice(0, 2) // Only use first two options for Farcaster buttons
        }),
      });

      if (!frameResponse.ok) {
        const errorData = await frameResponse.json();
        throw new Error(errorData.error || 'Failed to create frame');
      }

      const newFrame = await frameResponse.json();

      // 5. Generate the frame URL
      const frameUrl = `${window.location.origin}/api/frame/${newFrame.id}`;
      newFrame.frameUrl = frameUrl;

      // 6. Generate the Farcaster Frame HTML
      const frameHtml = generateFarcasterFrameHtml(
        imageUrl, 
        postUrl, 
        selectedPoll.options.slice(0, 2)
      );
      newFrame.frameHtml = frameHtml;

      setFrames(prevFrames => [newFrame, ...prevFrames]);
      setSelectedFrame(newFrame);
      setSelectedPollId(null);
      setError(null);

      // Show success message
      alert("Frame generated and published successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating frame');
      console.error("Error generating frame:", err);
    } finally {
      setIsGenerating(false);
    }
  };

<<<<<<< HEAD
  const publishToFarcaster = async (frame: Frame) => {
    if (!frame.frameHtml) {
      setError("No frame HTML available to publish");
      return;
    }

    setIsPublishing(true);
    try {
      const response = await fetch("/api/publish-frame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          frameId: frame.id,
          frameHtml: frame.frameHtml,
          imageUrl: frame.imageUrl,
          postUrl: frame.postUrl
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish frame');
      }

      const { castHash } = await response.json();
      
      // Update the frame with the cast hash
      setFrames(prevFrames => 
        prevFrames.map(f => 
          f.id === frame.id 
            ? { ...f, farcasterCastHash: castHash } 
            : f
        )
      );

      alert("Frame published successfully to Farcaster!");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error publishing to Farcaster');
      console.error("Error publishing to Farcaster:", err);
    } finally {
      setIsPublishing(false);
    }
=======
  const generateFarcasterFrameHtml = (
    imageUrl: string, 
    postUrl: string, 
    options: string[]
  ) => {
    // Create Farcaster Frame HTML based on the first two options
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    <meta property="fc:frame:post_url" content="${postUrl}" />
    <meta property="fc:frame:button:1" content="${options[0] || 'Option 1'}" />
    <meta property="fc:frame:button:2" content="${options[1] || 'Option 2'}" />
    <title>Poll Frame</title>
  </head>
  <body>
    <div>View this in Farcaster</div>
  </body>
</html>`;
>>>>>>> 6a3cc18 (frames added)
  };

  const copyFrameHtml = async (html: string) => {
    try {
      await navigator.clipboard.writeText(html);
      alert("Frame HTML copied to clipboard!");
    } catch (err) {
      setError('Failed to copy to clipboard');
      console.error("Error copying to clipboard:", err);
    }
  };

  const copyFrameUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Frame URL copied to clipboard!");
    } catch (err) {
      setError('Failed to copy to clipboard');
      console.error("Error copying to clipboard:", err);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main className={styles.framesPage}>
        <h1 className={styles.title}>Farcaster Poll Frames</h1>

        {error && (
          <div className={styles.error}>
            {error}
            <button onClick={() => setError(null)} className={styles.closeError}>
              ×
            </button>
          </div>
        )}

        {/* Frame Generation Section */}
        <section className={styles.createFrameSection}>
          <h2>Generate a Poll Frame</h2>
          <p className={styles.infoText}>
            Create a Farcaster Frame with your poll question as an image and the first two options as interactive buttons.
          </p>
          <select
            value={selectedPollId || ""}
            onChange={(e) => setSelectedPollId(Number(e.target.value))}
            className={styles.inputField}
          >
            <option value="">Select a Poll</option>
            {polls.map((poll) => (
              <option key={poll.id} value={poll.id}>
                {poll.question}
              </option>
            ))}
          </select>
          <button 
            onClick={handleGenerateFrame} 
            className={styles.createButton}
            disabled={!selectedPollId || isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Farcaster Frame"}
          </button>
        </section>

        {/* Frame Preview Section */}
        {selectedFrame && selectedFrame.frameHtml && (
          <section className={styles.framePreviewSection}>
            <h2>Frame Preview</h2>
            <div className={styles.preview}>
              <div className={styles.previewImageContainer}>
                <img 
                  src={selectedFrame.imageUrl} 
                  alt="Frame Preview" 
                  className={styles.previewImage}
                />
                <div className={styles.frameButtons}>
                  {selectedFrame.poll?.options.slice(0, 2).map((option, index) => (
                    <button key={index} className={styles.frameButton}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.previewContent}>
                <h3>Frame URL:</h3>
                <div className={styles.frameUrlContainer}>
                  <input
                    type="text"
                    value={selectedFrame.frameUrl || ""}
                    readOnly
                    className={styles.frameUrlInput}
                  />
                  <button
                    onClick={() => copyFrameUrl(selectedFrame.frameUrl || "")}
                    className={styles.copyButton}
                  >
                    Copy URL
                  </button>
                </div>
                
                <h3>Frame HTML:</h3>
                <pre className={styles.codeBlock}>
                  {selectedFrame.frameHtml}
                </pre>
                <div className={styles.previewActions}>
                  <button
                    onClick={() => copyFrameHtml(selectedFrame.frameHtml || "")}
                    className={styles.copyButton}
                  >
                    Copy HTML
                  </button>
                  <button
                    onClick={() => publishToFarcaster(selectedFrame)}
                    className={styles.publishButton}
                    disabled={isPublishing}
                  >
                    {isPublishing ? "Publishing..." : "Publish to Farcaster"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Existing Frames Section */}
        <section className={styles.framesSection}>
          <h2>Existing Frames</h2>
          <div className={styles.framesGrid}>
            {frames.length === 0 ? (
              <p className={styles.noFrames}>No frames created yet. Generate your first frame above!</p>
            ) : (
              frames.map((frame) => (
                <div key={frame.id} className={styles.frame}>
                  <div className={styles.frameImageContainer}>
                    <img 
                      src={frame.imageUrl} 
                      alt="Frame" 
                      className={styles.frameImage}
                    />
                    <div className={styles.frameButtonsPreview}>
                      {frame.poll?.options.slice(0, 2).map((option, index) => (
                        <span key={index} className={styles.buttonPreview}>
                          {option}
                        </span>
                      ))}
                    </div>
<<<<<<< HEAD
                  )}
                  <div className={styles.frameStats}>
                    <p>Total Votes: {frame.totalVotes}</p>
                    <p>Created: {new Date(frame.createdAt).toLocaleDateString()}</p>
                    {frame.farcasterCastHash && (
                      <p>
                        <a 
                          href={`https://warpcast.com/~/cast/${frame.farcasterCastHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.castLink}
                        >
                          View on Farcaster
                        </a>
                      </p>
                    )}
                  </div>
                  <div className={styles.frameActions}>
                    <a 
                      href={frame.postUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.frameLink}
                    >
                      View Post
                    </a>
                    <button
                      onClick={() => setSelectedFrame(frame)}
                      className={styles.viewFrameButton}
                    >
                      View Frame HTML
                    </button>
                    {!frame.farcasterCastHash && (
                      <button
                        onClick={() => publishToFarcaster(frame)}
                        className={styles.publishButton}
                        disabled={isPublishing}
                      >
                        {isPublishing ? "Publishing..." : "Publish to Farcaster"}
                      </button>
                    )}
=======
                  </div>
                  <div className={styles.frameContent}>
                    {frame.poll && (
                      <div className={styles.pollInfo}>
                        <h3>Poll: {frame.poll.question}</h3>
                      </div>
                    )}
                    <div className={styles.frameStats}>
                      <p>Total Votes: {frame.totalVotes}</p>
                      <p>Created: {new Date(frame.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.frameActions}>
                      {frame.frameUrl && (
                        <button
                          onClick={() => copyFrameUrl(frame.frameUrl || "")}
                          className={styles.copyUrlButton}
                        >
                          Copy Frame URL
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedFrame(frame)}
                        className={styles.viewFrameButton}
                      >
                        View Frame Details
                      </button>
                    </div>
>>>>>>> 6a3cc18 (frames added)
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}