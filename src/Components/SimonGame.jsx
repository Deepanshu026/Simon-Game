import React, { useState, useRef, useEffect } from "react";
import GameBtn from "./GameBtn";

const colors = ["green", "red", "yellow", "blue"];

function SimonGame() {
  const [sequence, setSequence] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [playingIdx, setPlayingIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // refs
  const greenRef = useRef(null);
  const redRef = useRef(null);
  const yellowRef = useRef(null);
  const blueRef = useRef(null);

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem("highScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Reset the game
  const resetGame = () => {
    // Check if current score is greater than high score
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score); // Save the high score in localStorage
    }
    setScore(0); // Reset the score
    setSequence([]);
    setPlaying(false);
    setPlayingIdx(0);
  };

  // Add new random color to the sequence
  const addNewColor = () => {
    const color = colors[Math.floor(Math.random() * 4)];
    const newSequence = [...sequence, color];
    setSequence(newSequence);
    setPlayingIdx(0); // Reset the index to start the next round
    setScore(newSequence.length); // Update score based on the sequence length
  };

  // Start the next level by adding a new color
  const handleNextLevel = () => {
    if (!playing) {
      setPlaying(true);
      addNewColor();
    }
  };

  // Handle the player's color click
  const handleColorClick = (e) => {
    if (playing) {
      e.target.classList.add("opacity-50");

      setTimeout(() => {
        e.target.classList.remove("opacity-50");

        const clickColor = e.target.getAttribute("color");

        // Check if the clicked color matches the current step in the sequence
        if (sequence[playingIdx] === clickColor) {
          if (playingIdx === sequence.length - 1) {
            // Player completed the current sequence
            setTimeout(() => {
              setPlayingIdx(0);
              addNewColor();
            }, 250); // Delay before the next level starts
          } else {
            // Player clicked the correct color, move to the next step
            setPlayingIdx(playingIdx + 1);
          }
        } else {
          // Player clicked the wrong color, reset the game
          resetGame();
        }
      }, 250);
    }
  };

  // Show the sequence by highlighting the buttons
  useEffect(() => {
    if (sequence.length > 0) {
      const showSequence = (idx = 0) => {
        let ref = null;

        // Select the corresponding ref based on the color in the sequence
        if (sequence[idx] === "green") ref = greenRef;
        if (sequence[idx] === "red") ref = redRef;
        if (sequence[idx] === "yellow") ref = yellowRef;
        if (sequence[idx] === "blue") ref = blueRef;

        if (ref && ref.current) {
          // Highlight the button
          setTimeout(
            () => {
              ref.current.classList.add("brightness-[2.5]");

              setTimeout(() => {
                ref.current.classList.remove("brightness-[2.5]");
                if (idx < sequence.length - 1) {
                  showSequence(idx + 1); // Move to the next color in the sequence
                }
              }, 250); // Keep the button highlighted for 250ms
            },
            idx === 0 ? 250 : 500
          ); // Delay to highlight each button
        }
      };

      showSequence(); // Start showing the sequence
    }
  }, [sequence]);

  return (
    <div className="flex justify-center items-center bg-neutral-600 text-white w-screen h-screen">

      {/* Game Container */}
      <div className="relative flex flex-col justify-center items-center">
        {/* green and red */}
        <div>
          <GameBtn
            color="green"
            bg="bg-green-500"
            ref={greenRef}
            onClick={handleColorClick}
          />
          <GameBtn
            color="red"
            bg="bg-red-500"
            ref={redRef}
            onClick={handleColorClick}
          />
        </div>
        {/* yellow and blue */}
        <div>
          <GameBtn
            color="yellow"
            bg="bg-yellow-500"
            ref={yellowRef}
            onClick={handleColorClick}
          />
          <GameBtn
            color="blue"
            bg="bg-blue-500"
            ref={blueRef}
            onClick={handleColorClick}
          />
        </div>

        {/* Play Button */}
        <button
          className="relative bg-neutral-900 text-white text-xl sm:text-2xl font-bold rounded-full w-[50px] sm:w-[75px] h-[50px] sm:h-[75px] duration-200 hover:scale-105"
          onClick={handleNextLevel}
        >
          {sequence.length === 0 ? "Play" : sequence.length}
        </button>

        {/* Display current score and high score */}
        <div className="relative  text-center">
          <p>Score: {score}</p>
          <p>High Score: {highScore}</p>
        </div>
      </div>
    </div>
  );
}

export default SimonGame;
