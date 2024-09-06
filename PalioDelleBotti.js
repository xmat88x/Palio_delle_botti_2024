import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

// Costanti del gioco
const GRID_SIZE = 21;
const CELL_SIZE = 30;
const ROAD_WIDTH = 3;

// Definizione dei personaggi
const CHARACTERS = [
  { name: "Piane San Donato", colors: ['white', 'red'] },
  { name: "Colle Mejulano", colors: ['white', 'orange'] },
  { name: "Accattapane", colors: ['red', 'darkblue'] },
  { name: "Montagnola", colors: ['white', 'black'] },
  { name: "Centro storico", colors: ['yellow', 'black'] },
  { name: "Ravigliano", colors: ['yellow', 'red'] },
  { name: "Vibrata", colors: ['gray', 'darkgreen'] },
  { name: "Gabbiano", colors: ['white', 'lightblue'] }
];

const GameMap = () => {
  // Stati del gioco
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [barrelPosition, setBarrelPosition] = useState({ x: 1, y: 0 });
  const [direction, setDirection] = useState('down');
  const [barrelAttached, setBarrelAttached] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Funzione per verificare se una cella è parte della strada
  const isRoadCell = (x, y) => {
    const innerBorder = ROAD_WIDTH - 1;
    const outerBorder = GRID_SIZE - ROAD_WIDTH;
    return (
      (y <= innerBorder && x >= 1 && x <= outerBorder) ||
      (x >= outerBorder && y >= 1 && y <= outerBorder) ||
      (y >= outerBorder && x >= 1 && x <= outerBorder) ||
      (x <= innerBorder && y >= 1 && y <= outerBorder)
    );
  };

  // Funzione per verificare se una cella è la cella di arrivo
  const isFinishCell = (x, y) => x === GRID_SIZE - ROAD_WIDTH && y === GRID_SIZE - ROAD_WIDTH;

  // Funzione per muovere il giocatore
  const movePlayer = useCallback((dx, dy, newDirection) => {
    if (gameWon) return;

    setDirection(newDirection);

    const newBarrelPos = { 
      x: Math.max(0, Math.min(GRID_SIZE - 1, barrelPosition.x + dx)),
      y: Math.max(0, Math.min(GRID_SIZE - 1, barrelPosition.y + dy))
    };

    if (isRoadCell(newBarrelPos.x, newBarrelPos.y)) {
      setBarrelPosition(newBarrelPos);

      if (!barrelAttached && 
          Math.abs(newBarrelPos.x - playerPosition.x) <= 1 && 
          Math.abs(newBarrelPos.y - playerPosition.y) <= 1) {
        setBarrelAttached(true);
      }

      if (barrelAttached) {
        setPlayerPosition(barrelPosition);
      }

      if (isFinishCell(newBarrelPos.x, newBarrelPos.y)) {
        setGameWon(true);
      }
    }
  }, [barrelPosition, playerPosition, barrelAttached, gameWon]);

  // Gestione degli input da tastiera
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key) {
        case 'ArrowUp': movePlayer(0, -1, 'up'); break;
        case 'ArrowDown': movePlayer(0, 1, 'down'); break;
        case 'ArrowLeft': movePlayer(-1, 0, 'left'); break;
        case 'ArrowRight': movePlayer(1, 0, 'right'); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  // Funzioni di rendering per i vari elementi del gioco
  const renderPlayer = (color1, color2) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="headGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#ffddbb" />
          <stop offset="100%" stopColor="#ffccaa" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="30" r="20" fill="url(#headGradient)" />
      <path d="M30,30 Q50,0 70,30" fill="#8B4513" />
      <rect x="40" y="50" width="10" height="30" fill={color1} />
      <rect x="50" y="50" width="10" height="30" fill={color2} />
      <rect x="40" y="80" width="20" height="20" fill="#000000" />
      <rect x="30" y="55" width="10" height="20" fill="#ffccaa" />
      <rect x="60" y="55" width="10" height="20" fill="#ffccaa" />
      <rect x="40" y="100" width="8" height="10" fill="#ffccaa" />
      <rect x="52" y="100" width="8" height="10" fill="#ffccaa" />
      <circle cx="45" cy="25" r="4" fill="#000000" />
      <circle cx="55" cy="25" r="4" fill="#000000" />
      <path d="M 45 40 Q 50 45 55 40" fill="none" stroke="#000000" strokeWidth="2" />
    </svg>
  );

  const renderBarrel = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g transform={direction === 'up' || direction === 'down' ? 'rotate(90 50 50)' : ''}>
        <ellipse cx="50" cy="20" rx="40" ry="15" fill="#8B4513" />
        <rect x="10" y="20" width="80" height="60" fill="#A0522D" />
        <ellipse cx="50" cy="80" rx="40" ry="15" fill="#8B4513" />
        <line x1="10" y1="35" x2="90" y2="35" stroke="#8B4513" strokeWidth="2" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="#8B4513" strokeWidth="2" />
        <line x1="10" y1="65" x2="90" y2="65" stroke="#8B4513" strokeWidth="2" />
      </g>
    </svg>
  );

  const renderFountain = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#87CEFA" />
      <circle cx="50" cy="50" r="35" fill="#1E90FF" />
      <circle cx="50" cy="50" r="25" fill="#87CEFA" />
      <circle cx="50" cy="50" r="15" fill="#1E90FF" />
      <circle cx="50" cy="50" r="5" fill="white" />
      <path d="M50,5 Q70,25 50,45 Q30,25 50,5" fill="#87CEFA" />
      <path d="M20,50 Q50,80 80,50" fill="none" stroke="white" strokeWidth="2" />
      <path d="M30,30 Q50,60 70,30" fill="none" stroke="white" strokeWidth="2" />
    </svg>
  );

  const renderFinish = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <pattern id="checkerPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="10" height="10" fill="white"/>
          <rect x="10" y="0" width="10" height="10" fill="black"/>
          <rect x="0" y="10" width="10" height="10" fill="black"/>
          <rect x="10" y="10" width="10" height="10" fill="white"/>
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#checkerPattern)" />
    </svg>
  );

  const renderGrass = () => (
    <div className="w-full h-full bg-green-200">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M10,90 Q30,60 50,90 T90,90" fill="none" stroke="#228B22" strokeWidth="2" />
        <path d="M30,90 Q50,40 70,90" fill="none" stroke="#228B22" strokeWidth="2" />
      </svg>
    </div>
  );

  const renderPath = () => (
    <div className="w-full h-full bg-yellow-200">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="25" cy="25" r="5" fill="#D2B48C" />
        <circle cx="75" cy="75" r="5" fill="#D2B48C" />
        <circle cx="50" cy="50" r="3" fill="#D2B48C" />
      </svg>
    </div>
  );

  const renderRoad = () => (
    <div className="w-full h-full bg-gray-400">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="2" strokeDasharray="10,10" />
      </svg>
    </div>
  );

  const renderCell = (x, y) => {
    if (x === barrelPosition.x && y === barrelPosition.y) {
      return renderBarrel();
    } else if (x === playerPosition.x && y === playerPosition.y) {
      return renderPlayer(selectedCharacter.colors[0], selectedCharacter.colors[1]);
    } else if (isFinishCell(x, y)) {
      return renderFinish();
    } else if (isRoadCell(x, y)) {
      return renderRoad();
    } else if ((x + y) % 2 === 0) {
      return renderGrass();
    } else if (x >= 7 && x <= 13 && y >= 7 && y <= 13) {
      return renderFountain();
    }
    return renderPath();
  };

  if (!selectedCharacter) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-100">
        <h2 className="text-2xl font-bold mb-4">Seleziona il tuo personaggio</h2>
        <div className="grid grid-cols-2 gap-4">
          {CHARACTERS.map((character, index) => (
            <button
              key={index}
              onClick={() => setSelectedCharacter(character)}
              className="p-4 bg-white rounded shadow hover:bg-gray-100"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 mr-2">
                  {renderPlayer(character.colors[0], character.colors[1])}
                </div>
                <span>{character.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100 relative">
      <div className="mb-4 text-2xl font-bold">Palio delle botti 2024 - {selectedCharacter.name}</div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        gap: '1px',
        backgroundColor: '#ccc',
        padding: '1px',
      }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <div key={i} style={{
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '20px'
          }}>
            {renderCell(i % GRID_SIZE, Math.floor(i / GRID_SIZE))}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button onClick={() => movePlayer(-1, 0, 'left')} className="p-2 bg-blue-500 text-white rounded"><ArrowLeft /></button>
        <button onClick={() => movePlayer(0, -1, 'up')} className="p-2 bg-blue-500 text-white rounded"><ArrowUp /></button>
        <button onClick={() => movePlayer(1, 0, 'right')} className="p-2 bg-blue-500 text-white rounded"><ArrowRight /></button>
        <div></div>
        <button onClick={() => movePlayer(0, 1, 'down')} className="p-2 bg-blue-500 text-white rounded"><ArrowDown /></button>
      </div>
      {gameWon && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Ha vinto {selectedCharacter.name}!</h2>
            <button onClick={() => window.location.reload()} className="bg-blue-500 text-white px-4 py-2 rounded">
              Gioca di nuovo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameMap;
