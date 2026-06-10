import { useState, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import { MapTheme, Difficulty } from './config';
import { audio } from './audio';

type View = 'MENU' | 'PLAYING' | 'SKINS' | 'MAPS' | 'DIFFICULTY' | 'GAMEOVER';

const SKINS = [
  { id: 'classic', color: '#00FF00', name: 'Classic Green' },
  { id: 'fire', color: '#FF3300', name: 'Fire Engine' },
  { id: 'ice', color: '#00FFFF', name: 'Ice Cyan' },
  { id: 'neon_pink', color: '#FF00FF', name: 'Neon Pink' },
  { id: 'yellow', color: '#FFFF00', name: 'Electric Yellow' },
  { id: 'white', color: '#FFFFFF', name: 'Ghost White' },
];

const MAP_OPTIONS: { id: MapTheme, name: string }[] = [
  { id: 'NEON', name: 'Neon Grid' },
  { id: 'LAVA', name: 'Volcanic Lava' },
  { id: 'GREENERY', name: 'Mountain Greenery' },
];

const DIFFICULTY_OPTIONS: { id: Difficulty, name: string }[] = [
  { id: 'EASY', name: 'Easy' },
  { id: 'NORMAL', name: 'Normal' },
  { id: 'HARD', name: 'Hard' },
];

export default function App() {
  const [view, setView] = useState<View>('MENU');
  const [skin, setSkin] = useState<string>(SKINS[0].color);
  const [mapTheme, setMapTheme] = useState<MapTheme>('NEON');
  const [difficulty, setDifficulty] = useState<Difficulty>('NORMAL');
  const [score, setScore] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    // Attempt to start BGM on any click interaction
    const handleInteraction = () => {
      audio.init();
      if (view !== 'GAMEOVER') {
        audio.playBgm();
      }
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction, { passive: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [view]);

  useEffect(() => {
    if (view === 'GAMEOVER') {
      audio.stopBgm();
    } else {
      audio.playBgm();
    }
  }, [view]);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audio.setMuted(nextMuted);
  };

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setView('GAMEOVER');
  };

  return (
    <>
      <div className="crt-overlay" />
      <div className="min-h-screen flex items-center justify-center p-4">
        
        {view === 'MENU' && (
          <div className="w-full max-w-md animate-fade-in">
            <h1 className="text-4xl md:text-5xl text-center mb-12 uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              SNAKE<br />
              <span className="text-2xl pt-4 block text-green-400 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">RETRO</span>
            </h1>
            
            <div className="space-y-4">
              <button 
                className="retro-btn"
                onClick={() => setView('PLAYING')}
              >
                Start Game
              </button>
              <button 
                className="retro-btn"
                onClick={() => setView('SKINS')}
              >
                Select Skin
              </button>
              <button 
                className="retro-btn"
                onClick={() => setView('MAPS')}
              >
                Select Map
              </button>
              <button 
                className="retro-btn"
                onClick={() => setView('DIFFICULTY')}
              >
                Difficulty: {difficulty}
              </button>
            </div>
          </div>
        )}

        {view === 'PLAYING' && (
          <GameCanvas 
            skin={skin} 
            mapTheme={mapTheme} 
            difficulty={difficulty}
            onGameOver={handleGameOver} 
          />
        )}

        {view === 'GAMEOVER' && (
          <div className="w-full max-w-md text-center animate-fade-in">
            <h2 className="text-4xl text-red-500 mb-6 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">GAME OVER</h2>
            <div className="text-2xl mb-10">
              FINAL SCORE
              <div className="text-4xl mt-4 text-white">{score}</div>
            </div>
            
            <div className="space-y-4 mt-8">
              <button 
                className="retro-btn text-green-400 border-green-400 hover:bg-green-400 hover:text-black"
                onClick={() => setView('PLAYING')}
              >
                Play Again
              </button>
              <button 
                className="retro-btn"
                onClick={() => setView('MENU')}
              >
                Main Menu
              </button>
            </div>
          </div>
        )}

        {view === 'SKINS' && (
          <div className="w-full max-w-md animate-fade-in">
            <h2 className="text-2xl text-center mb-8">SELECT SKIN</h2>
            <div className="space-y-3 mb-8">
              {SKINS.map((s) => (
                <button
                  key={s.id}
                  className={`retro-btn flex items-center justify-between text-left ${skin === s.color ? 'active text-black bg-white' : ''}`}
                  onClick={() => setSkin(s.color)}
                  style={{ borderColor: skin === s.color ? s.color : 'white' }}
                >
                  <span className="text-xs md:text-sm">{s.name}</span>
                  <div 
                    className="w-6 h-6 border-2 border-black rounded-sm shadow-sm"
                    style={{ backgroundColor: s.color }}
                  />
                </button>
              ))}
            </div>
            <button 
              className="retro-btn border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-black"
              onClick={() => setView('MENU')}
            >
              Back
            </button>
          </div>
        )}

        {view === 'MAPS' && (
          <div className="w-full max-w-md animate-fade-in">
            <h2 className="text-2xl text-center mb-8">SELECT MAP</h2>
            <div className="space-y-3 mb-8">
              {MAP_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  className={`retro-btn text-sm ${mapTheme === m.id ? 'active' : ''}`}
                  onClick={() => setMapTheme(m.id)}
                >
                  {m.name}
                </button>
              ))}
            </div>
            <button 
              className="retro-btn border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-black"
              onClick={() => setView('MENU')}
            >
              Back
            </button>
          </div>
        )}

        {view === 'DIFFICULTY' && (
          <div className="w-full max-w-md animate-fade-in">
            <h2 className="text-2xl text-center mb-8">DIFFICULTY</h2>
            <div className="space-y-3 mb-8">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d.id}
                  className={`retro-btn text-sm ${difficulty === d.id ? 'active' : ''}`}
                  onClick={() => setDifficulty(d.id)}
                >
                  {d.name}
                </button>
              ))}
            </div>
            <button 
              className="retro-btn border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-black"
              onClick={() => setView('MENU')}
            >
              Back
            </button>
          </div>
        )}

      </div>
      
      {/* Global Mute Toggle */}
      <button 
        onClick={handleToggleMute}
        className="fixed bottom-4 right-4 z-50 p-3 bg-black border-2 border-gray-600 text-gray-400 text-xs hover:border-white hover:text-white transition-colors"
      >
        {isMuted ? 'AUDIO: OFF' : 'AUDIO: ON'}
      </button>
    </>
  );
}
