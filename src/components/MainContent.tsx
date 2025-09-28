'use client';

import { FC, useState, Dispatch, SetStateAction } from 'react';
import { WheelIcon, RaceIcon, MoreIcon, CloseIcon, PlusIcon, PointerIcon } from './icons';

const WHEEL_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766", "#2AB7CA",
  "#F0C419", "#FF8C42", "#A2DED0", "#FE4A49", "#3498DB",
  "#F7CAC9", "#92A8D1", "#88B04B", "#E8A87C", "#C38D9E",
  "#41B3A3", "#E27D60", "#FAD02C", "#6A4C93", "#B5EAD7"
];

// --- A more visually appealing (but static) wheel placeholder --- //
const StaticWheel: FC<{ 
  participants: { name: string; color: string }[]; 
  onSpin: () => void; 
  rotation: number;
  isSpinning: boolean;
}> = ({ participants, onSpin, rotation, isSpinning }) => {
  const numSegments = participants.length > 1 ? participants.length : 8;
  const segments = participants.length > 1 ? participants : Array.from({ length: numSegments }).map((_, i) => ({ name: '', color: WHEEL_COLORS[i % WHEEL_COLORS.length] }));
  const angle = 360 / numSegments;

  return (
    <div className="relative w-[450px] h-[450px] flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <g 
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 10s ease-out' : 'none'
          }}
          transform-origin="50 50"
        >
          {segments.map((p, i) => {
            const startAngle = i * angle;
            const endAngle = (i + 1) * angle;
            const largeArcFlag = angle > 180 ? 1 : 0;

            const startX = 50 + 50 * Math.cos(Math.PI * startAngle / 180);
            const startY = 50 + 50 * Math.sin(Math.PI * startAngle / 180);
            const endX = 50 + 50 * Math.cos(Math.PI * endAngle / 180);
            const endY = 50 + 50 * Math.sin(Math.PI * endAngle / 180);

            const pathData = `M 50,50 L ${startX},${startY} A 50,50 0 ${largeArcFlag},1 ${endX},${endY} Z`;

            // For Text
            const midAngle = startAngle + angle / 2;
            const textRadius = 35;
            const textX = 50 + textRadius * Math.cos(Math.PI * midAngle / 180);
            const textY = 50 + textRadius * Math.sin(Math.PI * midAngle / 180);

            return (
              <g key={i}>
                <path d={pathData} fill={p.color} stroke="#4a4e69" strokeWidth="0.5" />
                <text
                  x={textX}
                  y={textY}
                  transform={`rotate(${midAngle + 180}, ${textX}, ${textY})`}
                  fontFamily="Tahoma, sans-serif"
                  textAnchor="middle"
                  alignmentBaseline="central"
                  fill="white"
                  fontSize="5"
                  fontWeight="bold"
                >
                  {p.name.length > 10 ? `${p.name.substring(0, 9)}...` : p.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      
      {/* Center Spin Button */}
      <button 
        onClick={onSpin}
        disabled={isSpinning}
        className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-2xl font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-400/50 border-4 border-gray-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
      >
        {isSpinning ? '...' : 'Spin'}
      </button>

      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-5 w-10 z-10 drop-shadow-lg">
        <PointerIcon className="w-full h-full" />
      </div>
    </div>
  );
};


// --- Options Panel (Far Left) --- //
const OptionItem: FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`relative flex flex-col items-center justify-center space-y-1 p-3 w-full rounded-lg transition-colors ${active ? 'text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
    {active && <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"></div>}
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const OptionsPanel: FC = () => (
  <aside className="bg-gray-800 text-gray-300 p-2 flex flex-col space-y-2 w-20">
    <OptionItem icon={<WheelIcon className="w-6 h-6" />} label="Wheel" active />
    <OptionItem icon={<RaceIcon className="w-6 h-6" />} label="Race" />
    <OptionItem icon={<MoreIcon className="w-6 h-6" />} label="More" />
  </aside>
);

// --- Left Panel Components --- //
type Tab = 'Participants' | 'History';

const NameCard: FC<{ name: string; color: string; onRemove: () => void }> = ({ name, color, onRemove }) => (
  <div style={{ backgroundColor: color }} className="flex items-center justify-between px-3 py-2 rounded-lg text-white font-semibold shadow-md">
    <span>{name}</span>
    <button 
      onClick={onRemove} 
      className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-900/40 hover:bg-gray-900/60 transition-colors"
    >
      <CloseIcon className="w-3 h-3" />
    </button>
  </div>
);

const ParticipantsSection: FC<{participants: {name: string, color: string}[], setParticipants: Dispatch<SetStateAction<{ name: string; color: string }[]>>}> = ({participants, setParticipants}) => {
  const [newName, setNewName] = useState('');

  const addParticipant = () => {
      if (newName.trim()) {
          const nextColor = WHEEL_COLORS[participants.length % WHEEL_COLORS.length];
          setParticipants([...participants, { name: newName, color: nextColor }]);
          setNewName('');
      }
  };

  const removeParticipant = (index: number) => {
      setParticipants(participants.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow space-y-2 overflow-y-auto p-1 pr-2">
        {participants.map((p, i) => (
          <NameCard key={i} name={p.name} color={p.color} onRemove={() => removeParticipant(i)} />
        ))}
      </div>
      <div className="flex items-center mt-4 space-x-2">
        <input 
          type="text" 
          placeholder="Add new name..." 
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
          className="flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={addParticipant} className="p-2 bg-blue-600 rounded-md hover:bg-blue-700 flex-shrink-0">
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};

const HistorySection: FC<{history: string[], setHistory: Dispatch<SetStateAction<string[]>>}> = ({history, setHistory}) => (
  <div className="p-1 pr-2 flex flex-col h-full">
    {history.length === 0 ? (
      <p className="text-center text-gray-500 mt-8">No winners yet.</p>
    ) : (
      <>
        <div className="flex-grow space-y-2 overflow-y-auto">
          {history.map((winner, index) => (
            <div key={index} className="bg-gray-700 p-3 rounded-md flex justify-between items-center shadow-md">
              <span className="font-semibold">{winner}</span>
              <span className="text-xs text-gray-400">Round #{history.length - index}</span>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setHistory([])}
          className="mt-4 w-full py-2 bg-red-800/80 text-white/80 rounded-lg font-semibold text-sm hover:bg-red-700 hover:text-white transition-colors"
        >
          Clear History
        </button>
      </>
    )}
  </div>
);

// --- Main Content Assembly --- //
export const MainContent: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Participants');
  const [participants, setParticipants] = useState([
    { name: 'player1', color: WHEEL_COLORS[0] },
    { name: 'player2', color: WHEEL_COLORS[1] },
    { name: 'player3', color: WHEEL_COLORS[2] },
    { name: 'player4', color: WHEEL_COLORS[3] },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<{ name: string; color: string } | null>(null);

  const handleSpin = () => {
    if (isSpinning || participants.length === 0) return;

    setWinner(null);
    setIsSpinning(true);
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winnerInfo = participants[winnerIndex];
    const sliceAngle = 360 / participants.length;
    
    const targetAngle = 270 - (winnerIndex * sliceAngle + sliceAngle / 2);

    const newRotation = rotation + (8 * 360) + targetAngle - (rotation % 360);

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(winnerInfo);
      setHistory([winnerInfo.name, ...history]);
    }, 10000); // Must match the CSS transition duration
  }

  return (
    <div className="flex flex-grow bg-gray-700 text-white overflow-hidden">
      <OptionsPanel />
      <main className="flex flex-grow p-4 gap-4">
        {/* Left Panel */}
        <div className="w-full max-w-sm bg-gray-800 rounded-lg p-4 flex flex-col shadow-lg">
          <div className="flex-shrink-0 mb-4 border-b-2 border-gray-700">
            <button 
              onClick={() => setActiveTab('Participants')} 
              className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${activeTab === 'Participants' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-600'}`}>
              Participants ({participants.length})
            </button>
            <button 
              onClick={() => setActiveTab('History')} 
              className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${activeTab === 'History' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-600'}`}>
              History ({history.length})
            </button>
          </div>
          <div className="flex-grow overflow-hidden">
            {activeTab === 'Participants' ? <ParticipantsSection participants={participants} setParticipants={setParticipants} /> : <HistorySection history={history} setHistory={setHistory} />}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-grow bg-gray-800 rounded-lg flex flex-col items-center justify-center p-4 shadow-lg">
          <StaticWheel participants={participants} onSpin={handleSpin} rotation={rotation} isSpinning={isSpinning} />
          <div className="h-24 mt-4 text-center">
            {winner && !isSpinning && (
              <div className="animate-fade-in">
                <p className="text-lg text-gray-400">Congratulate</p>
                <p style={{ color: winner.color }} className="text-4xl font-bold drop-shadow-lg">
                  {winner.name}!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};