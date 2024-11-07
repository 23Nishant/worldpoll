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
  const [newFrameQuestion, setNewFrameQuestion] = useState("");
  const [newFrameOptions, setNewFrameOptions] = useState(["", ""]);
  
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
    setFrames((prevFrames) =>
      prevFrames.map((frame) =>
        frame.id === frameId
          ? {
              ...frame,
              votes: frame.votes.map((vote, idx) =>
                idx === optionIndex ? vote + 1 : vote
              ),
            }
          : frame
      )
    );

    try {
      await fetch("/api/frames", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frameId, optionIndex }),
      });
    } catch (error) {
      console.error("Error voting:", error);
      fetchFrames();
    }
  };

  const handleCreateFrame = async () => {
    const newFrame = {
      question: newFrameQuestion,
      options: newFrameOptions,
      votes: new Array(newFrameOptions.length).fill(0),
    };

    try {
      const response = await fetch("/api/frames", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFrame),
      });

      if (response.ok) {
        fetchFrames(); // Refresh frames after creation
        setNewFrameQuestion("");
        setNewFrameOptions(["", ""]);
      } else {
        console.error("Error creating frame");
      }
    } catch (error) {
      console.error("Error creating frame:", error);
    }
  };

  // Handle adding new options
  const handleAddOption = () => {
    setNewFrameOptions((prevOptions) => [...prevOptions, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newFrameOptions];
    updatedOptions[index] = value;
    setNewFrameOptions(updatedOptions);
  };

  // Handle adding new options for each frame
  const handleAddFrameOption = (frameId: number) => {
    setFrames((prevFrames) =>
      prevFrames.map((frame) =>
        frame.id === frameId
          ? {
              ...frame,
              options: [...frame.options, ""],
              votes: [...frame.votes, 0],
            }
          : frame
      )
    );
  };

  return (
    <>
      <Navbar />
      <main className={styles.framesPage}>
        <h1 className={styles.title}>Frames</h1>

        {/* Frame Creation Section */}
        <section className={styles.createFrameSection}>
          <h2>Create a New Frame</h2>
          <input
            type="text"
            placeholder="Enter question"
            value={newFrameQuestion}
            onChange={(e) => setNewFrameQuestion(e.target.value)}
            className={styles.inputField}
          />
          {newFrameOptions.map((option, index) => (
            <div key={index} className={styles.optionContainer}>
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className={styles.inputField}
              />
            </div>
          ))}
          <button
            onClick={handleAddOption}
            className={styles.addOptionButton}
          >
            Add Option
          </button>
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
                <button
                  onClick={() => handleAddFrameOption(frame.id)}
                  className={styles.addOptionButton}
                >
                  Add Option to Frame
                </button>
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
      </main>
    </>
  );
};

export default FramesPage;
