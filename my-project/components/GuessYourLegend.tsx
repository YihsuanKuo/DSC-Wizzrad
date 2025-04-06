"use client";
import React, { useState, useEffect } from "react";
import { setGameData } from "@/lib/actions";

const GuessYourLegend = () => {
  // States for the game
  const [gameState, setGameState] = useState("intro"); // intro, playing, result
  const [conference, setConference] = useState(null); // east, west
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [playersRemaining, setPlayersRemaining] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [guessedPlayer, setGuessedPlayer] = useState("");
  const [logMessages, setLogMessages] = useState<any[]>([]);
  const [nbaData, setNbaData] = useState<any[]>([]);

  // Helper function to convert cm to feet and inches
  const cmToInches = (cm: any) => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const inchesRemainder = Math.round(inches % 12);
    return `${feet}'${inchesRemainder}"`;
  };

  // Helper function to clean position
  const cleanPosition = (pos: any) => {
    pos = String(pos).toLowerCase();
    if (pos.includes("guard") && pos.includes("forward")) {
      return "G-F";
    }
    if (
      (pos.includes("forward") && pos.includes("center")) ||
      (pos.includes("center") && pos.includes("forward"))
    ) {
      return "F-C";
    }
    if (pos.includes("forward")) {
      return "F";
    }
    if (pos.includes("center")) {
      return "C";
    }
    if (pos.includes("guard")) {
      return "G";
    }
    return "Unknown";
  };

  // Add log message
  const addLog = (message: any) => {
    setLogMessages((prev) => [...prev, message]);
  };

  // Mock NBA player data
  useEffect(() => {
    // This is just sample data. In a real application, you'd load from an API or file
    const setGameData = async () => {
      const data = await setGameData();
      setNbaData(data as any);
    };

    setGameData();
  }, []);

  // Start the game by choosing conference
  const selectConference = (conf: any) => {
    setConference(conf);
    setGameState("playing");
    setPlayersRemaining(
      nbaData.filter((p: any) => p.conference === conf).length
    );
    setQuestionsAsked(0);
    addLog(
      `🔮 Think of an active NBA player from the ${conf}ern Conference...`
    );
    askNextQuestion(nbaData.filter((p: any) => p.conference === conf));
  };

  // Main game logic
  const askNextQuestion = (currentPlayers: any) => {
    if (currentPlayers.length <= 0) {
      addLog("No players match these criteria. Something went wrong.");
      setGameState("result");
      setGuessedPlayer("Error: No matching players");
      return;
    }

    setPlayersRemaining(currentPlayers.length);

    // If we're down to 5 or fewer players, ask directly
    if (currentPlayers.length <= 5) {
      const playerNames = currentPlayers
        .map((p: any) => p.full_name)
        .join(", ");
      setCurrentQuestion(`Is your player one of these: ${playerNames}?`);
      return;
    }

    if (currentPlayers.length === 1) {
      // We've found the player
      setGameState("result");
      setGuessedPlayer(currentPlayers[0].full_name);
      addLog(`🏀 My guess is... **${currentPlayers[0].full_name}**!`);
      return;
    }

    // Find the best column for splitting the players
    let bestColumn = null;
    let bestThreshold = null;
    let bestBalance = Infinity;

    // Try team-based questions
    const teams = [...new Set(currentPlayers.map((p: any) => p.team))];
    if (teams.length > 1) {
      for (const team of teams) {
        const teamCount = currentPlayers.filter(
          (p: any) => p.team === team
        ).length;
        const nonTeamCount = currentPlayers.length - teamCount;
        const balance = Math.abs(teamCount - nonTeamCount);

        if (balance < bestBalance) {
          bestBalance = balance;
          bestColumn = "team";
          bestThreshold = team;
        }
      }
    }

    // Handle position questions
    const positionGroups = {
      pure_guard: currentPlayers.filter((p: any) => p.position === "G").length,
      pure_forward: currentPlayers.filter((p: any) => p.position === "F")
        .length,
      pure_center: currentPlayers.filter((p: any) => p.position === "C").length,
      guard_forward: currentPlayers.filter((p: any) => p.position === "G-F")
        .length,
      forward_center: currentPlayers.filter((p: any) => p.position === "F-C")
        .length,
    };

    for (const [posType, posCount] of Object.entries(positionGroups)) {
      const nonPosCount = currentPlayers.length - posCount;
      const balance = Math.abs(posCount - nonPosCount);

      if (balance < bestBalance && posCount > 0) {
        bestBalance = balance;
        bestColumn = "position_specific";
        bestThreshold = posType;
      }
    }

    // Try awards
    const awardCount = currentPlayers.filter(
      (p: any) => p.awards_count > 0
    ).length;
    const noAwardCount = currentPlayers.length - awardCount;
    const awardBalance = Math.abs(awardCount - noAwardCount);

    if (awardBalance < bestBalance) {
      bestBalance = awardBalance;
      bestColumn = "awards";
      bestThreshold = null;
    }

    // Try numeric columns
    const numericCols = [
      "age",
      "height",
      "weight",
      "average_points",
      "average_assists",
      "average_rebounds",
      "average_steals",
      "average_blocks",
    ];

    for (const col of numericCols) {
      const values = [...new Set(currentPlayers.map((p: any) => p[col]))].sort(
        (a: any, b: any) => a - b
      );

      if (values.length > 1) {
        for (let i = 0; i < values.length - 1; i++) {
          const threshold =
            ((values[i] as number) + (values[i + 1] as number)) / 2;

          const leftCount = currentPlayers.filter(
            (p: any) => p[col] <= threshold
          ).length;
          const rightCount = currentPlayers.length - leftCount;
          const balance = Math.abs(leftCount - rightCount);

          if (balance < bestBalance) {
            bestBalance = balance;
            bestColumn = col;
            bestThreshold = threshold;
          }
        }
      }
    }

    // Construct the question based on the best dividing attribute
    if (bestColumn === "team") {
      setCurrentQuestion(`Is your player on the ${bestThreshold}?`);
    } else if (bestColumn === "position_specific") {
      if (bestThreshold === "pure_guard") {
        setCurrentQuestion(
          "Is your player strictly a Guard (G), not a Guard-Forward hybrid?"
        );
      } else if (bestThreshold === "pure_forward") {
        setCurrentQuestion(
          "Is your player strictly a Forward (F), not a hybrid position?"
        );
      } else if (bestThreshold === "pure_center") {
        setCurrentQuestion(
          "Is your player strictly a Center (C), not a Forward-Center hybrid?"
        );
      } else if (bestThreshold === "guard_forward") {
        setCurrentQuestion("Is your player a Guard-Forward (G-F) hybrid?");
      } else if (bestThreshold === "forward_center") {
        setCurrentQuestion("Is your player a Forward-Center (F-C) hybrid?");
      }
    } else if (bestColumn === "awards") {
      setCurrentQuestion("Has your player received any awards?");
    } else if (bestColumn === "age") {
      setCurrentQuestion(
        `Is your player older than ${parseInt(bestThreshold as string)} years?`
      );
    } else if (bestColumn === "height") {
      setCurrentQuestion(
        `Is your player taller than ${cmToInches(bestThreshold)}?`
      );
    } else if (bestColumn === "weight") {
      setCurrentQuestion(
        `Is your player heavier than ${parseInt(bestThreshold as string)} lbs?`
      );
    } else if (
      [
        "average_points",
        "average_assists",
        "average_rebounds",
        "average_steals",
        "average_blocks",
      ].includes(bestColumn as string)
    ) {
      const statName = bestColumn?.replace("average_", "");
      setCurrentQuestion(
        `Does your player average more than ${(bestThreshold as any).toFixed(
          1
        )} ${statName}?`
      );
    } else {
      // Fallback question with a simple split
      const halfIndex = Math.floor(currentPlayers.length / 2);
      const firstHalf = currentPlayers.slice(0, halfIndex);
      const playerNames = firstHalf.map((p: any) => p.full_name).join(", ");
      setCurrentQuestion(`Is your player one of these: ${playerNames}?`);
    }
  };

  // Handle user's answer
  const handleAnswer = (answer: any) => {
    setQuestionsAsked((prev) => prev + 1);
    addLog(
      `Q${questionsAsked + 1}: ${currentQuestion} ${answer ? "Yes" : "No"}`
    );

    let currentPlayers = nbaData.filter(
      (p: any) => p.conference === conference
    );

    if (currentQuestion.includes("Is your player one of these:")) {
      const mentionedPlayers = currentQuestion
        .replace("Is your player one of these: ", "")
        .replace("?", "")
        .split(", ");
      if (answer) {
        currentPlayers = currentPlayers.filter((p: any) =>
          mentionedPlayers.includes(p.full_name)
        );
      } else {
        currentPlayers = currentPlayers.filter(
          (p: any) => !mentionedPlayers.includes(p.full_name)
        );
      }
    } else if (currentQuestion.includes("Is your player on the")) {
      const team = currentQuestion
        .replace("Is your player on the ", "")
        .replace("?", "");
      if (answer) {
        currentPlayers = currentPlayers.filter((p: any) => p.team === team);
      } else {
        currentPlayers = currentPlayers.filter((p: any) => p.team !== team);
      }
    } else if (currentQuestion.includes("strictly a Guard")) {
      if (answer) {
        currentPlayers = currentPlayers.filter((p: any) => p.position === "G");
      } else {
        currentPlayers = currentPlayers.filter((p: any) => p.position !== "G");
      }
    } else if (currentQuestion.includes("strictly a Forward")) {
      if (answer) {
        currentPlayers = currentPlayers.filter((p: any) => p.position === "F");
      } else {
        currentPlayers = currentPlayers.filter((p: any) => p.position !== "F");
      }
    } else if (currentQuestion.includes("strictly a Center")) {
      if (answer) {
        currentPlayers = currentPlayers.filter((p: any) => p.position === "C");
      } else {
        currentPlayers = currentPlayers.filter((p: any) => p.position !== "C");
      }
    } else if (currentQuestion.includes("Guard-Forward")) {
      if (answer) {
        currentPlayers = currentPlayers.filter(
          (p: any) => p.position === "G-F"
        );
      } else {
        currentPlayers = currentPlayers.filter(
          (p: any) => p.position !== "G-F"
        );
      }
    } else if (currentQuestion.includes("Forward-Center")) {
      if (answer) {
        currentPlayers = currentPlayers.filter(
          (p: any) => p.position === "F-C"
        );
      } else {
        currentPlayers = currentPlayers.filter(
          (p: any) => p.position !== "F-C"
        );
      }
    } else if (currentQuestion.includes("received any awards")) {
      if (answer) {
        currentPlayers = currentPlayers.filter((p: any) => p.awards_count > 0);
      } else {
        currentPlayers = currentPlayers.filter(
          (p: any) => p.awards_count === 0
        );
      }
    } else if (currentQuestion.includes("older than")) {
      const ageMatch = currentQuestion.match(/older than (\d+)/);
      const age = ageMatch ? parseInt(ageMatch[1]) : 0;
      if (answer) {
        currentPlayers = currentPlayers.filter((p: any) => p.age > age);
      } else {
        currentPlayers = currentPlayers.filter((p: any) => p.age <= age);
      }
    } else if (currentQuestion.includes("taller than")) {
      const heightMatch = currentQuestion.match(/taller than (\d+'\d+")/);
      const heightStr = heightMatch ? heightMatch[1] : "";
      const feet = parseInt(heightStr.split("'")[0]);
      const inches = parseInt(heightStr.split("'")[1].replace('"', ""));
      const heightInCm = (feet * 12 + inches) * 2.54;

      if (answer) {
        currentPlayers = currentPlayers.filter(
          (p: any) => p.height > heightInCm
        );
      } else {
        currentPlayers = currentPlayers.filter(
          (p: any) => p.height <= heightInCm
        );
      }
    } else if (currentQuestion.includes("heavier than")) {
      const weightMatch = currentQuestion.match(/heavier than (\d+)/);
      const weight = weightMatch ? parseInt(weightMatch[1]) : 0;
      if (answer) {
        currentPlayers = currentPlayers.filter((p: any) => p.weight > weight);
      } else {
        currentPlayers = currentPlayers.filter((p: any) => p.weight <= weight);
      }
    } else if (currentQuestion.includes("average more than")) {
      const statMatch = currentQuestion.match(
        /average more than (\d+\.\d+) (\w+)/
      );
      const value = statMatch ? parseFloat(statMatch[1]) : 0;
      const stat = statMatch ? "average_" + statMatch[2] : "";

      if (answer) {
        currentPlayers = currentPlayers.filter((p) => p[stat] > value);
      } else {
        currentPlayers = currentPlayers.filter((p) => p[stat] <= value);
      }
    }

    // If we have exactly one player left, we've found them
    if (currentPlayers.length === 1) {
      setGameState("result");
      setGuessedPlayer(currentPlayers[0].full_name as string);
      addLog(`🏀 My guess is... **${currentPlayers[0].full_name}**!`);
    }
    // Otherwise ask the next question
    else {
      askNextQuestion(currentPlayers);
    }
  };

  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setConference(null);
    setCurrentQuestion("");
    setPlayersRemaining(0);
    setQuestionsAsked(0);
    setGuessedPlayer("");
    setLogMessages([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
        NBA Legend Guesser
      </h2>

      {/* Intro Screen */}
      {gameState === "intro" && (
        <div className="space-y-4 text-center">
          <p className="text-lg">
            🔮 Think of an active NBA player and I'll try to guess who it is!
          </p>
          <p className="text-gray-600">Select your player's conference:</p>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => selectConference("East")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Eastern Conference
            </button>
            <button
              onClick={() => selectConference("West")}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Western Conference
            </button>
          </div>
        </div>
      )}

      {/* Game Playing Screen */}
      {gameState === "playing" && (
        <div className="space-y-4">
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-medium">
              Players remaining: {playersRemaining}
            </span>
            <span className="font-medium">
              Questions asked: {questionsAsked}
            </span>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg border mb-4">
            <p className="text-lg font-medium">{currentQuestion}</p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-lg font-medium"
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg font-medium"
            >
              No
            </button>
          </div>

          <div className="mt-4">
            <h3 className="font-medium text-gray-700 mb-1">Game Log:</h3>
            <div className="bg-gray-50 p-3 rounded-lg border h-32 overflow-y-auto text-sm">
              {logMessages.map((msg, idx) => (
                <p key={idx} className="mb-1">
                  {msg}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result Screen */}
      {gameState === "result" && (
        <div className="space-y-4 text-center">
          <div className="py-3">
            <h2 className="text-xl font-bold mb-2">🏀 Your player is:</h2>
            <p className="text-2xl font-bold text-blue-600">{guessedPlayer}</p>
          </div>

          <div className="py-2">
            <p className="text-gray-700">
              It took me {questionsAsked} questions to guess your player!
            </p>
          </div>

          <button
            onClick={resetGame}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium mt-4"
          >
            Play Again
          </button>

          <div className="mt-4">
            <h3 className="font-medium text-gray-700 mb-1">Game Log:</h3>
            <div className="bg-gray-50 p-3 rounded-lg border h-32 overflow-y-auto text-sm">
              {logMessages.map((msg, idx) => (
                <p key={idx} className="mb-1">
                  {msg}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuessYourLegend;
