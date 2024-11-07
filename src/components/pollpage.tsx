"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./pollpage.module.css";
import Navbar from "../components/navbar";

const DynamicPieChart = dynamic(() => import("../components/DynamicPieChart"), {
  ssr: false,
});

interface Poll {
  id: number;
  question: string;
  options: string[];
  votes: number[];
}

interface Frame {
  id: number;
  title: string;
  description: string;
  options: string[];
  votes: number[];
}

const PollPage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [frameTitle, setFrameTitle] = useState("");
  const [frameDescription, setFrameDescription] = useState("");
  const [frameOptions, setFrameOptions] = useState<string[]>(["", ""]);

  useEffect(() => {
    fetchPolls();
    fetchFrames();
  }, []);

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

  const handleVote = async (pollId: number, optionIndex: number) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              votes: poll.votes.map((vote, idx) =>
                idx === optionIndex ? vote + 1 : vote
              ),
            }
          : poll
      )
    );

    try {
      await fetch("/api/polls", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pollId, optionIndex }),
      });
    } catch (error) {
      console.error("Error voting:", error);
      fetchPolls();
    }
  };

  const handleFrameVote = async (frameId: number, optionIndex: number) => {
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
      console.error("Error voting on frame:", error);
      fetchFrames();
    }
  };

  const handleCreatePoll = async () => {
    if (!question || options.some((opt) => opt.trim() === "")) {
      alert("Please fill in the question and all options.");
      return;
    }

    try {
      const response = await fetch("/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, options }),
      });

      if (response.ok) {
        const newPoll = await response.json();
        setPolls((prevPolls) => [newPoll, ...prevPolls]);
        setQuestion("");
        setOptions(["", ""]);
      }
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  const handleCreateFrame = async () => {
    if (!frameTitle || !frameDescription || frameOptions.some((opt) => opt.trim() === "")) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("/api/frames", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: frameTitle, description: frameDescription, options: frameOptions }),
      });

      if (response.ok) {
        const newFrame = await response.json();
        setFrames((prevFrames) => [newFrame, ...prevFrames]);
        setFrameTitle("");
        setFrameDescription("");
        setFrameOptions(["", ""]);
      }
    } catch (error) {
      console.error("Error creating frame:", error);
    }
  };

  // Add option feature for polls
  const handleAddOption = () => {
    setOptions((prevOptions) => [...prevOptions, ""]);
  };

  // Add option feature for frames
  const handleAddFrameOption = () => {
    setFrameOptions((prevOptions) => [...prevOptions, ""]);
  };

  return (
    <>
      <Navbar />
      <main className={styles.pollPage}>
        <h1 className={styles.title}>Create and Vote on Polls and Frames</h1>

        {/* Poll Creation Section */}
        <section className={styles.createPollSection}>
          <h2>Create a New Poll</h2>
          <input
            type="text"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={styles.inputField}
          />
          {options.map((option, index) => (
            <div key={index} className={styles.optionContainer}>
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                className={styles.inputField}
              />
            </div>
          ))}
          <button onClick={handleAddOption} className={styles.addOptionButton}>
            Add Option
          </button>
          <button onClick={handleCreatePoll} className={styles.createButton}>
            Create Poll
          </button>
        </section>

        {/* Frame Creation Section */}
        <section className={styles.createPollSection}>
          <h2>Create a New Frame</h2>
          <input
            type="text"
            placeholder="Enter frame title"
            value={frameTitle}
            onChange={(e) => setFrameTitle(e.target.value)}
            className={styles.inputField}
          />
          <textarea
            placeholder="Enter frame description"
            value={frameDescription}
            onChange={(e) => setFrameDescription(e.target.value)}
            className={styles.inputField}
          />
          {frameOptions.map((option, index) => (
            <div key={index} className={styles.optionContainer}>
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...frameOptions];
                  newOptions[index] = e.target.value;
                  setFrameOptions(newOptions);
                }}
                className={styles.inputField}
              />
            </div>
          ))}
          <button onClick={handleAddFrameOption} className={styles.addOptionButton}>
            Add Option
          </button>
          <button onClick={handleCreateFrame} className={styles.createButton}>
            Create Frame
          </button>
        </section>

        {/* Polls Section */}
        <section className={styles.pollsSection}>
          <h2>Polls</h2>
          {polls.map((poll) => (
            <div key={poll.id} className={styles.pollContainer}>
              <h3>{poll.question}</h3>
              {poll.options.map((option, index) => (
                <div key={index} className={styles.option}>
                  <button onClick={() => handleVote(poll.id, index)}>
                    {option} ({poll.votes[index]} votes)
                  </button>
                </div>
              ))}
              <div className={styles.chartContainer}>
                <DynamicPieChart labels={poll.options} votes={poll.votes} />
              </div>
            </div>
          ))}
        </section>

        {/* Frames Section */}
        <section className={styles.framesSection}>
          <h2>Frames</h2>
          {frames.map((frame) => (
            <div key={frame.id} className={styles.frameContainer}>
              <h3>{frame.title}</h3>
              <p>{frame.description}</p>
              {frame.options.map((option, index) => (
                <div key={index} className={styles.option}>
                  <button onClick={() => handleFrameVote(frame.id, index)}>
                    {option} ({frame.votes[index]} votes)
                  </button>
                </div>
              ))}
              <div className={styles.chartContainer}>
                <DynamicPieChart labels={frame.options} votes={frame.votes} />
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
};

export default PollPage;
