"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./pollpage.module.css";
import Navbar from "./navbar";

const DynamicPieChart = dynamic(() => import("./DynamicPieChart"), {
  ssr: false,
});

interface Poll {
  id: number;
  question: string;
  options: string[];
  votes: number[];
  frame?: {
    id: number;
    imageUrl: string;
    postUrl: string;
  };
}

interface Frame {
  id: number;
  pollId: number;
  imageUrl: string;
  postUrl: string;
  totalVotes: number;
  poll: Poll;
}

const PollPage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");

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

  const createPoll = async () => {
    if (question && option1 && option2) {
      const newPoll = {
        question,
        options: [option1, option2],
      };

      try {
        const response = await fetch("/api/polls", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPoll),
        });

        if (!response.ok) throw new Error("Failed to create poll");
        
        await fetchPolls(); // Refresh polls after creation
        setQuestion("");
        setOption1("");
        setOption2("");
      } catch (error) {
        console.error("Error creating poll:", error);
      }
    }
  };

  const createFrame = async (pollId: number) => {
    try {
      const response = await fetch("/api/frames", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pollId }),
      });

      if (!response.ok) throw new Error("Failed to create frame");
      await fetchFrames();
    } catch (error) {
      console.error("Error creating frame:", error);
    }
  };

  const handleVote = async (
    type: "poll" | "frame",
    pollId: number,
    optionIndex: number
  ) => {
    const updateStateVotes = (
      data: Poll[],
      setData: React.Dispatch<React.SetStateAction<Poll[]>>
    ) => {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === pollId
            ? {
                ...item,
                votes: item.votes.map((vote, index) =>
                  index === optionIndex ? vote + 1 : vote
                ),
              }
            : item
        )
      );
    };

    // Update state immediately
    if (type === "poll") {
      updateStateVotes(polls, setPolls);
    } else {
      updateStateVotes(frames, setFrames);
    }

    // Send updated vote to the server
    const endpoint = type === "poll" ? "/api/polls" : "/api/frames";
    try {
      await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pollId, optionIndex }),
      });

      if (!response.ok) throw new Error("Failed to vote");
      await fetchPolls(); // Refresh polls after voting
    } catch (error) {
      console.error(`Error voting on ${type}:`, error);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.pollPage}>
        <h1 className={styles.title}>Community Polls</h1>
        
        <div className={styles.createPollSection}>
          <h2 className={styles.subtitle}>Create a New Poll</h2>
          <input
            type="text"
            placeholder="Poll question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Option 1"
            value={option1}
            onChange={(e) => setOption1(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Option 2"
            value={option2}
            onChange={(e) => setOption2(e.target.value)}
            className={styles.input}
          />
          <button
            onClick={createPoll}
            className={styles.createButton}
            disabled={!question || !option1 || !option2}
          >
            Create Poll
          </button>
          <button
            onClick={() => {
              const lastCreatedPoll = polls[polls.length - 1];
              if (lastCreatedPoll) {
                createFrame(lastCreatedPoll.id);
              }
            }}
            className={styles.createFrameButton}
            disabled={polls.length === 0}
          >
            Create Frame for Latest Poll
          </button>
        </div>

        <div className={styles.pollsSection}>
          <h2 className={styles.subtitle}>Existing Polls</h2>
          <div className={styles.pollContainer}>
            {polls.map((poll) => (
              <div key={poll.id} className={styles.poll}>
                <h3 className={styles.pollQuestion}>{poll.question}</h3>
                <div className={styles.pollContent}>
                  <div className={styles.voteButtons}>
                    {poll.options.map((option, index) => (
                      <button
                        key={index}
                        className={styles.voteButton}
                        onClick={() => handleVote("poll", poll.id, index)}
                      >
                        {option} ({poll.votes[index]} votes)
                      </button>
                    ))}
                  </div>
                  <div className={styles.totalVotes}>
                    Total votes: {poll.votes.reduce((a, b) => a + b, 0)}
                  </div>
                  <div className={styles.chartContainer}>
                    <DynamicPieChart poll={poll} />
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

export default PollPage;
