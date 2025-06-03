import { useState, useEffect } from 'react';
import './SandwichGame.css';

interface Sandwich {
  id: number;
  name: string;
  image: string;
}

interface HighScore {
  name: string;
  score: number;
  date: string;
}

const MAX_HIGH_SCORES = 5;

const allSandwiches: Sandwich[] = [
  {
    id: 1,
    name: 'Club Sandwich',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format',
  },
  {
    id: 2,
    name: 'Grilled Cheese',
    image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=500&auto=format',
  },
  {
    id: 3,
    name: 'BLT',
    image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=500&auto=format',
  },
  {
    id: 4,
    name: 'Pastrami',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format',
  },
  {
    id: 5,
    name: 'Veggie',
    image: 'https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?w=500&auto=format',
  },
  {
    id: 6,
    name: 'Chicken',
    image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=500&auto=format',
  },
  {
    id: 7,
    name: 'Tuna',
    image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=500&auto=format',
  },
  {
    id: 8,
    name: 'Turkey',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=500&auto=format',
  }
];

const SandwichGame = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [currentSandwiches, setCurrentSandwiches] = useState<Sandwich[]>(() => {
    const shuffled = [...allSandwiches].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });
  const [winningId, setWinningId] = useState<number>(() => 
    currentSandwiches[Math.floor(Math.random() * 3)].id
  );
  const [message, setMessage] = useState<string>('Pick a sandwich!');
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  useEffect(() => {
    // Load high scores from localStorage when component mounts
    const savedScores = localStorage.getItem('sandwichGameHighScores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  const checkHighScore = (currentScore: number) => {
    if (highScores.length < MAX_HIGH_SCORES || currentScore > highScores[highScores.length - 1]?.score) {
      setIsNewHighScore(true);
      setShowNameInput(true);
    }
  };

  const saveHighScore = () => {
    if (!playerName.trim()) return;

    const newHighScore: HighScore = {
      name: playerName.trim(),
      score,
      date: new Date().toLocaleDateString()
    };

    const newHighScores = [...highScores, newHighScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_HIGH_SCORES);

    setHighScores(newHighScores);
    localStorage.setItem('sandwichGameHighScores', JSON.stringify(newHighScores));
    setShowNameInput(false);
    setPlayerName('');
  };

  const handleSandwichClick = (id: number) => {
    if (gameOver || showNameInput) return;
    
    if (id === winningId) {
      const newScore = score + 1;
      setScore(newScore);
      setMessage('Congratulations! You found the right sandwich! 🎉');
      setTimeout(nextRound, 1500);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setMessage(`Game Over! Final score: ${score} 🏆`);
        setGameOver(true);
        checkHighScore(score);
      } else {
        setMessage(`Wrong sandwich! ${newLives} ${newLives === 1 ? 'life' : 'lives'} left! 🤔`);
      }
    }
  };

  const nextRound = () => {
    const shuffled = [...allSandwiches].sort(() => Math.random() - 0.5);
    const newSandwiches = shuffled.slice(0, 3);
    setCurrentSandwiches(newSandwiches);
    setWinningId(newSandwiches[Math.floor(Math.random() * 3)].id);
    setMessage('Pick a sandwich!');
  };

  const resetGame = () => {
    setScore(0);
    setLives(5);
    setGameOver(false);
    setIsNewHighScore(false);
    nextRound();
  };

  return (
    <div className="sandwich-game">
      <div className="game-header">
        <h1>Guess the Sandwich!</h1>
        <div className="game-stats">
          <span className="score">Score: {score}</span>
          <span className="lives">Lives: {'❤️'.repeat(lives)}</span>
        </div>
      </div>
      <p className="game-message">{message}</p>
      <div className="sandwiches-container">
        {currentSandwiches.map((sandwich) => (
          <div
            key={sandwich.id}
            className={`sandwich-card ${gameOver && sandwich.id === winningId ? 'winner' : ''}`}
            onClick={() => handleSandwichClick(sandwich.id)}
          >
            <img src={sandwich.image} alt={sandwich.name} />
            <p>{sandwich.name}</p>
          </div>
        ))}
      </div>
      
      {showNameInput && (
        <div className="name-input-container">
          <h2>🎉 New High Score: {score}! 🎉</h2>
          <input
            type="text"
            maxLength={20}
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="name-input"
          />
          <button className="submit-button" onClick={saveHighScore}>
            Save Score
          </button>
        </div>
      )}

      {(gameOver && !showNameInput) && (
        <div className="game-over-container">
          <button className="reset-button" onClick={resetGame}>
            Play Again
          </button>
          
          {highScores.length > 0 && (
            <div className="high-scores">
              <h2>High Scores</h2>
              <div className="scores-list">
                {highScores.map((highScore, index) => (
                  <div key={index} className="score-entry">
                    <span className="score-rank">#{index + 1}</span>
                    <span className="score-name">{highScore.name}</span>
                    <span className="score-value">{highScore.score}</span>
                    <span className="score-date">{highScore.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SandwichGame; 