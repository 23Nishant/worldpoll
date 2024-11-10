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
  pollId: number;
  imageUrl: string;
  postUrl: string;
  totalVotes: number;
  createdAt: string;
}

const PollPage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  
  // New state for frame creation
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const [frameImageUrl, setFrameImageUrl] = useState("");
  const [framePostUrl, setFramePostUrl] = useState("");

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
    if (!selectedPollId || !frameImageUrl || !framePostUrl) {
      alert("Please fill in all frame fields and select a poll.");
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
          imageUrl: frameImageUrl,
          postUrl: framePostUrl,
        }),
      });

      if (response.ok) {
        const newFrame = await response.json();
        setFrames((prevFrames) => [newFrame, ...prevFrames]);
        setSelectedPollId(null);
        setFrameImageUrl("");
        setFramePostUrl("");
      }
    } catch (error) {
      console.error("Error creating frame:", error);
    }
  };

  const handleAddOption = () => {
    setOptions((prevOptions) => [...prevOptions, ""]);
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
            value={frameImageUrl}
            onChange={(e) => setFrameImageUrl(e.target.value)}
            className={styles.inputField}
          />
          <input
            type="text"
            placeholder="Enter post URL"
            value={framePostUrl}
            onChange={(e) => setFramePostUrl(e.target.value)}
            className={styles.inputField}
          />
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
              <img 
                src={frame.imageUrl} 
                alt="Frame" 
                className={styles.frameImage}
              />
              <a 
                href={frame.postUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.frameLink}
              >
                View Post
              </a>
              <p>Total Votes: {frame.totalVotes}</p>
              <p>Created: {new Date(frame.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
};

export default PollPage;