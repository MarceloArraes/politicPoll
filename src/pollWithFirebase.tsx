import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, onValue } from "firebase/database";

const firebaseConfig = {
  // Replace with your Firebase project configuration
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  databaseURL: "YOUR_DATABASE_URL",
};

const PollApp = () => {
  const [poll, setPoll] = useState({
    question: "What's your favorite programming language?",
    options: [
      { text: "JavaScript", votes: 0 },
      { text: "Python", votes: 0 },
      { text: "Java", votes: 0 },
    ],
  });
  const [hasVoted, setHasVoted] = useState(false);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const pollRef = ref(database, "polls/currentPoll");

  // Generate a unique identifier for this user/device
  const getVoterIdentifier = () => {
    // Combine IP and local storage for more robust validation
    const localStorageKey = "poll_vote_" + window.location.hostname;

    // Check if already voted in local storage
    const storedVote = localStorage.getItem(localStorageKey);
    if (storedVote) {
      return null;
    }

    // Store vote in local storage
    localStorage.setItem(localStorageKey, "voted");

    return localStorageKey;
  };

  useEffect(() => {
    // Listen for real-time updates
    const unsubscribe = onValue(pollRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setPoll(data);
    });

    return () => unsubscribe();
  }, []);

  const handleVote = (index) => {
    // Check if user has already voted
    const voterIdentifier = getVoterIdentifier();

    if (!voterIdentifier) {
      alert("You can only vote once!");
      return;
    }

    // Create a copy of the current poll
    const updatedPoll = { ...poll };

    // Increment votes for selected option
    updatedPoll.options[index].votes += 1;

    // Update Firebase with new vote count
    update(pollRef, updatedPoll)
      .then(() => {
        setHasVoted(true);
        alert("Thanks for voting!");
      })
      .catch((error) => {
        console.error("Vote failed:", error);
        alert("Voting failed. Please try again.");
      });
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>
      {hasVoted ? (
        <div className="text-center text-green-600">Thanks for your vote!</div>
      ) : (
        poll.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleVote(index)}
            className="w-full p-3 mb-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            {option.text} ({option.votes} votes)
          </button>
        ))
      )}

      {/* Optional: Voting Results Visualization */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Poll Results</h3>
        {poll.options.map((option, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between">
              <span>{option.text}</span>
              <span>{option.votes} votes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${
                    (option.votes /
                      Math.max(...poll.options.map((o) => o.votes), 1)) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollApp;
