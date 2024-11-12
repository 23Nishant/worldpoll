// src/app/framespage/page.tsx
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
}

export default function FramesPage() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleCreateFrame = async () => {
    if (!selectedPollId || !imageUrl || !postUrl) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("/api/frames", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pollId: selectedPollId,
          imageUrl,
          postUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create frame');
      }

      const newFrame = await response.json();
      setFrames(prevFrames => [newFrame, ...prevFrames]);
      setSelectedFrame(newFrame);
      
      // Reset form
      setSelectedPollId(null);
      setImageUrl("");
      setPostUrl("");
      setError(null);

      // Show success message
      alert("Frame created successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating frame');
      console.error("Error creating frame:", err);
    }
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

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main className={styles.framesPage}>
        <h1 className={styles.title}>Frames</h1>

        {error && (
          <div className={styles.error}>
            {error}
            <button onClick={() => setError(null)} className={styles.closeError}>
              ×
            </button>
          </div>
        )}

        {/* Frame Creation Section */}
        <section className={styles.createFrameSection}>
          <h2>Create a New Frame</h2>
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
          <input
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={styles.inputField}
          />
          <input
            type="text"
            placeholder="Enter post URL"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            className={styles.inputField}
          />
          <button 
            onClick={handleCreateFrame} 
            className={styles.createButton}
            disabled={!selectedPollId || !imageUrl || !postUrl}
          >
            Create Frame
          </button>
        </section>

        {/* Frame Preview Section */}
        {selectedFrame && selectedFrame.frameHtml && (
          <section className={styles.framePreviewSection}>
            <h2>Frame Preview</h2>
            <div className={styles.preview}>
              <img 
                src={selectedFrame.imageUrl} 
                alt="Frame Preview" 
                className={styles.previewImage}
              />
              <div className={styles.previewContent}>
                <h3>Frame HTML:</h3>
                <pre className={styles.codeBlock}>
                  {selectedFrame.frameHtml}
                </pre>
                <button
                  onClick={() => copyFrameHtml(selectedFrame.frameHtml || "")}
                  className={styles.copyButton}
                >
                  Copy HTML
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Existing Frames Section */}
        <section className={styles.framesSection}>
          <h2>Existing Frames</h2>
          <div className={styles.framesGrid}>
            {frames.map((frame) => (
              <div key={frame.id} className={styles.frame}>
                <img 
                  src={frame.imageUrl} 
                  alt="Frame" 
                  className={styles.frameImage}
                />
                <div className={styles.frameContent}>
                  {frame.poll && (
                    <div className={styles.pollInfo}>
                      <h3>Poll: {frame.poll.question}</h3>
                      <div className={styles.pollOptions}>
                        <h4>Options:</h4>
                        <ul>
                          {frame.poll.options.map((option, index) => (
                            <li key={index}>{option}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  <div className={styles.frameStats}>
                    <p>Total Votes: {frame.totalVotes}</p>
                    <p>Created: {new Date(frame.createdAt).toLocaleDateString()}</p>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}