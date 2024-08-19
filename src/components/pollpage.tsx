"use client";

import React, { useState } from 'react';
import styles from './pollpage.module.css';
import { getFrameHtmlResponse } from '../components/frameUtils'; 

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
  const [question, setQuestion] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');

  const handleVote = (pollIndex: number, optionIndex: number) => {
    setPolls(prevPolls => {
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
      setQuestion('');
      setOption1('');
      setOption2('');
    }
  };

  const createAndPostAsFrame = async () => {
    if (question && option1 && option2) {
      const voteCount = { option1: 0, option2: 0 };

      // Create frame HTML
      const frameHtml = getFrameHtmlResponse(question, option1, option2, voteCount);

      // Save the frame to a folder (call your backend API)
      const response = await fetch('/api/saveFrame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ frameHtml }),
      });

      if (response.ok) {
        // Handle success (e.g., show a success message)
        alert('Frame created and saved successfully!');
      } else {
        // Handle failure (e.g., show an error message)
        alert('Failed to save frame.');
      }

      // Reset the form
      setQuestion('');
      setOption1('');
      setOption2('');
    }
  };

  return (
    <div className={styles.pollPage}>
      <h1>Create Poll</h1>
      <div className={styles.createPollSection}>
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
        <div className={styles.buttonGroup}>
          <button onClick={createPoll}>Create Poll</button>
          <button onClick={createAndPostAsFrame}>Create and Post as Frame</button>
        </div>
      </div>

      <h2>Existing Polls</h2>
      <div className={styles.pollContainer}>
        {polls.map((poll, pollIndex) => (
          <div key={pollIndex} className={styles.poll}>
            <h2>{poll.question}</h2>
            {poll.options.map((option, optionIndex) => (
              <button
                key={optionIndex}
                onClick={() => handleVote(pollIndex, optionIndex)}
                className={styles.voteButton}
              >
                {option} ({poll.votes[optionIndex]})
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollPage;
