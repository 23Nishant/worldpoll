"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./pollpage.module.css";
import Navbar from "./navbar";

const DynamicPieChart = dynamic(() => import("./DynamicPieChart"), {
  ssr: false,
});

interface Poll {
  question: string;
  options: string[];
  votes: number[];
}

const initialPolls: Poll[] = [
  {
    question: "Favorite Programming Language",
    options: ["JavaScript", "Python"],
    votes: [0, 0],
  },
  {
    question: "Preferred Frontend Framework",
    options: ["React", "Vue"],
    votes: [0, 0],
  },
  {
    question: "Best Cloud Provider",
    options: ["AWS", "Azure"],
    votes: [0, 0],
  },
  {
    question: "Most Exciting Tech Trend",
    options: ["AI", "Blockchain"],
    votes: [0, 0],
  },
];

const PollPage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleVote = (pollIndex: number, optionIndex: number) => {
    setPolls((prevPolls) => {
      const newPolls = [...prevPolls];
      newPolls[pollIndex].votes[optionIndex]++;
      return newPolls;
    });
  };

  const createPoll = () => {
    if (question && option1 && option2) {
      const newPoll: Poll = {
        question,
        options: [option1, option2],
        votes: [0, 0],
      };

      setPolls([...polls, newPoll]);
      setQuestion("");
      setOption1("");
      setOption2("");
    }
  };

  const calculatePercentage = (votes: number, total: number): string => {
    if (total === 0) return "0%";
    return `${((votes / total) * 100).toFixed(1)}%`;
  };

  return (
    <>
      <Navbar />
      <main className={styles.pollPage}>
        <h1 className={styles.title}>Community Polls</h1>
        <p className={styles.description}>
          Create a new poll or vote on existing ones. Share your opinion!
        </p>
        <div className={styles.createPollSection}>
          <h2 className={styles.subtitle}>Create a New Poll</h2>
          <input
            type="text"
            placeholder="Poll question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <input
            type="text"
            placeholder="Option 1"
            value={option1}
            onChange={(e) => setOption1(e.target.value)}
          />
          <input
            type="text"
            placeholder="Option 2"
            value={option2}
            onChange={(e) => setOption2(e.target.value)}
          />
          <button onClick={createPoll}>Create Poll</button>
        </div>

        <h2 className={styles.subtitle}>Existing Polls</h2>
        <div className={styles.pollContainer}>
          {polls.map((poll, pollIndex) => {
            const totalVotes = poll.votes.reduce(
              (sum, current) => sum + current,
              0
            );
            return (
              <div key={pollIndex} className={styles.poll}>
                <h3 className={styles.pollQuestion}>{poll.question}</h3>
                <div className={styles.pollContent}>
                  <div className={styles.voteButtons}>
                    {poll.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleVote(pollIndex, optionIndex)}
                        className={styles.voteButton}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className={styles.voteResults}>
                    {poll.options.map((option, optionIndex) => (
                      <div key={optionIndex} className={styles.voteResult}>
                        <span className={styles.optionName}>{option}:</span>
                        <span className={styles.voteCount}>
                          {poll.votes[optionIndex]} votes
                        </span>
                        <span className={styles.votePercentage}>
                          (
                          {calculatePercentage(
                            poll.votes[optionIndex],
                            totalVotes
                          )}
                          )
                        </span>
                      </div>
                    ))}
                    <div className={styles.totalVotes}>
                      Total votes: {totalVotes}
                    </div>
                  </div>
                  {isClient && (
                    <div className={styles.chartContainer}>
                      <DynamicPieChart poll={poll} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default PollPage;
