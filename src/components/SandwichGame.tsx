import { useState } from 'react';
import './SandwichGame.css';

interface Sandwich {
  id: number;
  name: string;
  image: string;
}

const sandwiches: Sandwich[] = [
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
];

const SandwichGame = () => {
  const [winningId, setWinningId] = useState<number>(() => 
    Math.floor(Math.random() * sandwiches.length) + 1
  );
  const [message, setMessage] = useState<string>('Pick a sandwich!');
  const [gameWon, setGameWon] = useState(false);

  const handleSandwichClick = (id: number) => {
    if (gameWon) return;
    
    if (id === winningId) {
      setMessage('Congratulations! You found the right sandwich! 🎉');
      setGameWon(true);
    } else {
      setMessage('Wrong sandwich! Try again! 🤔');
    }
  };

  const resetGame = () => {
    setWinningId(Math.floor(Math.random() * sandwiches.length) + 1);
    setMessage('Pick a sandwich!');
    setGameWon(false);
  };

  return (
    <div className="sandwich-game">
      <h1>Guess the Sandwich!</h1>
      <p className="game-message">{message}</p>
      <div className="sandwiches-container">
        {sandwiches.map((sandwich) => (
          <div
            key={sandwich.id}
            className={`sandwich-card ${gameWon && sandwich.id === winningId ? 'winner' : ''}`}
            onClick={() => handleSandwichClick(sandwich.id)}
          >
            <img src={sandwich.image} alt={sandwich.name} />
            <p>{sandwich.name}</p>
          </div>
        ))}
      </div>
      {gameWon && (
        <button className="reset-button" onClick={resetGame}>
          Play Again
        </button>
      )}
    </div>
  );
};

export default SandwichGame; 