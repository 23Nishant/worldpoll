// src/app/framespage/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./framespage.module.css";
import Navbar from "../../components/navbar";

const DynamicPieChart = dynamic(() => import("../../components/DynamicPieChart"), {
  ssr: false,
});

interface Frame {
  id: number;
  question: string;
  options: string[];
  votes: number[];
}

const FramesPage: React.FC = () => {
  const [frames, setFrames] = useState<Frame[]>([]);

  useEffect(() => {
    fetchFrames();
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

  const handleVote = async (frameId: number, optionIndex: number) => {
    try {
      const response = await fetch("/api/frames", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frameId, optionIndex }),
      });

      if (response.ok) {
        fetchFrames(); // Refresh frames after voting
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.framesPage}>
        <h1 className={styles.title}>Frames</h1>

        <div className={styles.framesSection}>
          <div className={styles.frameContainer}>
            {frames.map((frame) => (
              <div key={frame.id} className={styles.frame}>
                <h3 className={styles.frameQuestion}>{frame.question}</h3>
                <div className={styles.frameContent}>
                  <div className={styles.voteButtons}>
                    {frame.options.map((option, index) => (
                      <button
                        key={index}
                        className={styles.voteButton}
                        onClick={() => handleVote(frame.id, index)}
                      >
                        {option} ({frame.votes[index]} votes)
                      </button>
                    ))}
                  </div>
                  <div className={styles.totalVotes}>
                    Total votes: {frame.votes.reduce((a, b) => a + b, 0)}
                  </div>
                  <div className={styles.chartContainer}>
                    <DynamicPieChart labels={frame.options} votes={frame.votes} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default FramesPage;
