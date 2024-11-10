"use client";

import React, { useState, useEffect } from "react";
import styles from "./framespage.module.css";
import Navbar from "../../components/navbar";

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
  poll?: Poll;  // Include related poll data
}

const FramesPage: React.FC = () => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  
  // State for new frame
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [postUrl, setPostUrl] = useState("");

  useEffect(() => {
    fetchFrames();
    fetchPolls();
  }, []);

  const fetchFrames = async () => {
    try {
      const response = await fetch("/api/frames");
      if (response.ok) {
        const fetchedFrames = await response.json();
        setFrames(fetchedFrames);
      }
    } catch (error) {
      console.error("Error fetching frames:", error);
    }
  };

  const fetchPolls = async () => {
    try {
      const response = await fetch("/api/polls");
      if (response.ok) {
        const fetchedPolls = await response.json();
        setPolls(fetchedPolls);
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  };

  const handleCreateFrame = async () => {
    if (!selectedPollId || !imageUrl || !postUrl) {
      alert("Please fill in all fields.");
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

      if (response.ok) {
        const newFrame = await response.json();
        setFrames((prevFrames) => [newFrame, ...prevFrames]);
        // Reset form
        setSelectedPollId(null);
        setImageUrl("");
        setPostUrl("");
      }
    } catch (error) {
      console.error("Error creating frame:", error);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.framesPage}>
        <h1 className={styles.title}>Frames</h1>

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
          >
            Create Frame
          </button>
        </section>

        {/* Displaying Frames */}
        <div className={styles.framesSection}>
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
                    <h3>Associated Poll: {frame.poll.question}</h3>
                  </div>
                )}
                <a 
                  href={frame.postUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.frameLink}
                >
                  View Post
                </a>
                <div className={styles.frameStats}>
                  <p>Total Votes: {frame.totalVotes}</p>
                  <p>Created: {new Date(frame.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default FramesPage;