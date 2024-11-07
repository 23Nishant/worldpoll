"use client";

import React from "react";
import styles from "./frameCard.module.css";
import dynamic from "next/dynamic";

const DynamicPieChart = dynamic(() => import("./DynamicPieChart"), {
  ssr: false,
});

interface Frame {
  id: number;
  question: string;
  options: string[];
  votes: number[];
}

interface FrameCardProps {
  frame: Frame;
  onVote: (frameId: number, optionIndex: number) => Promise<void>;
}

const FrameCard: React.FC<FrameCardProps> = ({ frame, onVote }) => {
  const totalVotes = frame.votes.reduce((a, b) => a + b, 0);

  return (
    <div className={styles.frame}>
      <h3 className={styles.frameQuestion}>{frame.question}</h3>
      <div className={styles.frameContent}>
        <div className={styles.voteButtons}>
          {frame.options.map((option, index) => (
            <button
              key={index}
              className={styles.voteButton}
              onClick={() => onVote(frame.id, index)}
            >
              {option} ({frame.votes[index]} votes)
            </button>
          ))}
        </div>
        <div className={styles.totalVotes}>
          Total votes: {totalVotes}
        </div>
        <div className={styles.chartContainer}>
          <DynamicPieChart labels={frame.options} votes={frame.votes} />
        </div>
      </div>
    </div>
  );
};

export default FrameCard;
