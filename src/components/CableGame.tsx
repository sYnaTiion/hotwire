import React, { useState, useRef, useEffect, useCallback } from "react";
import { GAME_CONFIG } from "../config/gameConfig";

interface Connection {
  from: number;
  to: number;
}

interface DragState {
  isDragging: boolean;
  startIndex: number | null;
  currentPos: { x: number; y: number } | null;
}

interface Cable {
  color: string;
  originalIndex: number;
}

interface GameState {
  timeLeft: number;
  isGameActive: boolean;
  failedAttempts: number;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const CableGame: React.FC = () => {
  const [lostRounds, setLostRounds] = useState<number>(0);

  const [gameState, setGameState] = useState<GameState>({
    timeLeft: GAME_CONFIG.timePerRound,
    isGameActive: true,
    failedAttempts: 0,
  });

  const [connections, setConnections] = useState<Connection[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startIndex: null,
    currentPos: null,
  });
  const [dragOverTarget, setDragOverTarget] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const timerRef = useRef<number | null>(null);

  const [leftCables, setLeftCables] = useState<Cable[]>([]);
  const [rightCables, setRightCables] = useState<Cable[]>([]);

  const [failFlashConnector, setFailFlashConnector] = useState<{from: number|null, to: number|null}>({from: null, to: null});
  const [permanentFail, setPermanentFail] = useState(false);

  const generateCables = useCallback(() => {
    const colors = GAME_CONFIG.cableColors.slice(0, GAME_CONFIG.numberOfCables);
    const leftCablesArray = shuffleArray(
      colors.map((color, index) => ({ color, originalIndex: index }))
    );
    const rightCablesArray = shuffleArray(
      colors.map((color, index) => ({ color, originalIndex: index }))
    );
    setLeftCables(leftCablesArray);
    setRightCables(rightCablesArray);
  }, []);

  useEffect(() => {
    if (gameState.isGameActive && gameState.timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.isGameActive) {
      setGameState((prev) => ({
        ...prev,
        isGameActive: false,
      }));
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameState.isGameActive, gameState.timeLeft]);

  useEffect(() => {
    if (
      connections.length === GAME_CONFIG.numberOfCables &&
      gameState.isGameActive
    ) {
      setGameState((prev) => ({
        ...prev,
        isGameActive: false,
      }));
    }
  }, [connections.length, gameState.isGameActive]);

  useEffect(() => {
    if (
      gameState.failedAttempts >= GAME_CONFIG.maxFailedAttempts &&
      gameState.isGameActive
    ) {
      setGameState((prev) => ({
        ...prev,
        isGameActive: false,
      }));
    }
  }, [gameState.failedAttempts, gameState.isGameActive]);

  const startGame = () => {
    setGameState({
      timeLeft: GAME_CONFIG.timePerRound,
      isGameActive: true,
      failedAttempts: 0,
    });
    setConnections([]);
    generateCables();
  };

  useEffect(() => {
    const maxLostRounds = GAME_CONFIG.maxLostRounds;
    if (
      !gameState.isGameActive &&
      (gameState.timeLeft === 0 ||
        gameState.failedAttempts >= GAME_CONFIG.maxFailedAttempts)
    ) {
      if (!permanentFail) {
        if (lostRounds + 1 >= maxLostRounds) {
          setPermanentFail(true);
        } else {
          const timeout = setTimeout(() => {
            setLostRounds((prev) => prev + 1);
            startGame();
          }, 1500);
          return () => clearTimeout(timeout);
        }
      }
    }
  }, [
    gameState.isGameActive,
    gameState.timeLeft,
    gameState.failedAttempts,
    lostRounds,
  ]);

  const handleMouseDown = (index: number, event: React.MouseEvent) => {
    if (!gameState.isGameActive) return;
    event.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setDragState({
        isDragging: true,
        startIndex: index,
        currentPos: {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        },
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (dragState.isDragging && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setDragState((prev) => ({
        ...prev,
        currentPos: {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        },
      }));
    }
  };

  const handleMouseUp = () => {
    if (
      dragState.isDragging &&
      typeof dragState.startIndex === "number" &&
      typeof dragOverTarget === "number"
    ) {
      const leftColor = leftCables[dragState.startIndex].color;
      const rightColor = rightCables[dragOverTarget].color;
      if (leftColor === rightColor) {
        if (
          typeof dragState.startIndex === "number" &&
          typeof dragOverTarget === "number"
        ) {
          setConnections((prev) => [
            ...prev.filter(
              (conn) =>
                conn.from !== dragState.startIndex && conn.to !== dragOverTarget
            ),
            {
              from: dragState.startIndex as number,
              to: dragOverTarget as number,
            },
          ]);
        }
      } else {
        setGameState((prev) => ({
          ...prev,
          failedAttempts: prev.failedAttempts + 1,
        }));
  setFailFlashConnector({from: dragState.startIndex, to: dragOverTarget});
      }
    }
    setDragState({
      isDragging: false,
      startIndex: null,
      currentPos: null,
    });
    setDragOverTarget(null);
  };
  useEffect(() => {
    if (failFlashConnector.from !== null || failFlashConnector.to !== null) {
      const timeout = setTimeout(() => setFailFlashConnector({from: null, to: null}), 500);
      return () => clearTimeout(timeout);
    }
  }, [failFlashConnector]);

  const handleRightCableMouseEnter = (index: number) => {
    if (dragState.isDragging) {
      setDragOverTarget(index);
    }
  };

  const handleRightCableMouseLeave = () => {
    setDragOverTarget(null);
  };

  const getLeftCablePosition = (index: number) => {
    const total = GAME_CONFIG.numberOfCables;
    const half = Math.ceil(total / 2);
    if (index < half) {
      const count = half;
      return {
        x: count === 1 ? 300 : 100 + (400 / (count - 1)) * index,
        y: 40,
      };
    } else {
      const count = total - half;
      return {
        x: 40,
        y: count === 1 ? 300 : 100 + (400 / (count - 1)) * (index - half),
      };
    }
  };

  const getRightCablePosition = (index: number) => {
    const total = GAME_CONFIG.numberOfCables;
    const half = Math.ceil(total / 2);
    if (index < half) {
      const count = half;
      return {
        x: count === 1 ? 300 : 100 + (400 / (count - 1)) * index,
        y: 560,
      };
    } else {
      const count = total - half;
      return {
        x: 560,
        y: count === 1 ? 300 : 100 + (400 / (count - 1)) * (index - half),
      };
    }
  };

  const getProgressColor = () => {
    const progressPercentage =
      (gameState.timeLeft / GAME_CONFIG.timePerRound) * 100;
    if (progressPercentage > 60) return "progress-green";
    if (progressPercentage > 30) return "progress-yellow";
    return "progress-red";
  };

  useEffect(() => {
    generateCables();
  }, [generateCables]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "600px", position: "relative" }}>
        <svg
          ref={svgRef}
          width="600"
          height="600"
          className={[
            "game-svg",
            permanentFail ? "game-board-animate-fail" : "",
            (!permanentFail && connections.length === GAME_CONFIG.numberOfCables && gameState.isGameActive === false && gameState.timeLeft > 0 && gameState.failedAttempts < GAME_CONFIG.maxFailedAttempts) ? "game-board-animate-success" : ""
          ].filter(Boolean).join(" ")}
          style={{
            display: "block",
            background: "#1f2937",
            borderRadius: "12px",
            border: "4px solid #000000"
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <g>
            {" "}
            F
            <circle
              cx="20"
              cy="20"
              r="12"
              fill="#888"
              stroke="#222"
              strokeWidth="3"
            />
            <rect x="13" y="18" width="14" height="4" rx="2" fill="#222" />
          </g>
          <g>
            <circle
              cx="570"
              cy="20"
              r="12"
              fill="#888"
              stroke="#222"
              strokeWidth="3"
            />{" "}
            F
            <rect x="563" y="18" width="14" height="4" rx="2" fill="#222" />
          </g>
          <g>
            <circle
              cx="20"
              cy="570"
              r="12"
              fill="#888"
              stroke="#222"
              strokeWidth="3"
            />
            <rect x="13" y="568" width="14" height="4" rx="2" fill="#222" />
          </g>
          <g>
            <circle
              cx="570"
              cy="570"
              r="12"
              fill="#888"
              stroke="#222"
              strokeWidth="3"
            />
            <rect x="563" y="568" width="14" height="4" rx="2" fill="#222" />
          </g>
          <foreignObject x="0" y="0" width="600" height="8">
            <div
              style={{
                width: "600px",
                height: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${
                    (gameState.timeLeft / GAME_CONFIG.timePerRound) * 100
                  }%`,
                  background:
                    getProgressColor() === "progress-green"
                      ? "#22c55e"
                      : getProgressColor() === "progress-yellow"
                      ? "#eab308"
                      : "#ef4444",
                  borderRadius: "12px 0 0 12px",
                  transition: "width 0.3s",
                }}
              />
            </div>
          </foreignObject>
          {connections.map((connection, index) => {
            const startPos = getLeftCablePosition(connection.from);
            const endPos = getRightCablePosition(connection.to);
            const color = leftCables[connection.from]?.color;
            const center = { x: 300, y: 300 };
            const t = 0.5;
            const curveStrength = 0.22;
            const wobble = () => (Math.random() - 0.5) * 4;
            const ctrl = {
              x:
                (1 - t) * startPos.x +
                t * endPos.x +
                (center.x - ((1 - t) * startPos.x + t * endPos.x)) *
                  curveStrength +
                wobble(),
              y:
                (1 - t) * startPos.y +
                t * endPos.y +
                (center.y - ((1 - t) * startPos.y + t * endPos.y)) *
                  curveStrength +
                wobble(),
            };
            return (
              <path
                key={index}
                d={`M${startPos.x},${startPos.y} Q${ctrl.x},${ctrl.y} ${endPos.x},${endPos.y}`}
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
              />
            );
          })}
          {dragState.isDragging &&
            dragState.startIndex !== null &&
            dragState.currentPos &&
            (() => {
              const startPos = getLeftCablePosition(dragState.startIndex);
              const endPos = dragState.currentPos;
              const center = { x: 300, y: 300 };
              const t = 0.5;
              const curveStrength = 0.22;
              const wobble = () => (Math.random() - 0.5) * 4;
              const ctrl = {
                x:
                  (1 - t) * startPos.x +
                  t * endPos.x +
                  (center.x - ((1 - t) * startPos.x + t * endPos.x)) *
                    curveStrength +
                  wobble(),
                y:
                  (1 - t) * startPos.y +
                  t * endPos.y +
                  (center.y - ((1 - t) * startPos.y + t * endPos.y)) *
                    curveStrength +
                  wobble(),
              };
              return (
                <path
                  d={`M${startPos.x},${startPos.y} Q${ctrl.x},${ctrl.y} ${endPos.x},${endPos.y}`}
                  stroke={leftCables[dragState.startIndex]?.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="8,6"
                  opacity="0.7"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
                />
              );
            })()}
          {leftCables.map((cable, index) => {
            const pos = getLeftCablePosition(index);
            const isConnected = connections.some((conn) => conn.from === index);
            const isFail = failFlashConnector.from === index;
            return (
              <g key={`left-${index}`}>
                <defs>
                  <radialGradient
                    id={`start-grad-${index}`}
                    cx="50%"
                    cy="50%"
                    r="50%"
                  >
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
                    <stop
                      offset="100%"
                      stopColor={cable.color}
                      stopOpacity="1"
                    />
                  </radialGradient>
                  <filter
                    id={`glow-start-${index}`}
                    x="-40%"
                    y="-40%"
                    width="180%"
                    height="180%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="6"
                      floodColor={cable.color}
                      floodOpacity="0.7"
                    />
                  </filter>
                </defs>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="18"
                  fill={`url(#start-grad-${index})`}
                  filter={`url(#glow-start-${index})`}
                  opacity={isConnected ? 0.7 : 1}
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="13"
                  fill={cable.color}
                  stroke="#fff"
                  strokeWidth="2"
                  style={{
                    filter: isConnected ? "brightness(0.8)" : "none",
                    transition: "filter 0.2s",
                  }}
                  className={[
                    "cable-connector",
                    isFail ? "cable-connector-fail" : ""
                  ].filter(Boolean).join(" ")}
                  onMouseDown={(e) => handleMouseDown(index, e)}
                  pointerEvents={gameState.isGameActive ? "auto" : "none"}
                  cursor={gameState.isGameActive ? "pointer" : "default"}
                />
                {/* Kabel mit Drähten Icon */}
                <g pointerEvents="none">
                  <rect
                    x={pos.x - 7}
                    y={pos.y - 5}
                    width="14"
                    height="10"
                    rx="3"
                    fill="#222"
                    stroke="#fff"
                    strokeWidth="1.5"
                    className={isFail ? "cable-rect-fail" : ""}
                  />
                  <line
                    x1={pos.x - 7}
                    y1={pos.y - 2}
                    x2={pos.x - 13}
                    y2={pos.y - 7}
                    stroke="#f87171"
                    strokeWidth="2"
                  />
                  <line
                    x1={pos.x - 7}
                    y1={pos.y + 2}
                    x2={pos.x - 13}
                    y2={pos.y + 7}
                    stroke="#34d399"
                    strokeWidth="2"
                  />
                  <line
                    x1={pos.x + 7}
                    y1={pos.y - 2}
                    x2={pos.x + 13}
                    y2={pos.y - 7}
                    stroke="#60a5fa"
                    strokeWidth="2"
                  />
                  <line
                    x1={pos.x + 7}
                    y1={pos.y + 2}
                    x2={pos.x + 13}
                    y2={pos.y + 7}
                    stroke="#fbbf24"
                    strokeWidth="2"
                  />
                </g>
              </g>
            );
          })}
          {rightCables.map((cable, index) => {
            const pos = getRightCablePosition(index);
            const isHighlighted = dragOverTarget === index;
            const isFail = failFlashConnector.to === index;
            return (
              <g
                key={`right-${index}`}
                onMouseEnter={() => handleRightCableMouseEnter(index)}
                onMouseLeave={handleRightCableMouseLeave}
                style={{ cursor: "pointer" }}
              >
                <defs>
                  <radialGradient
                    id={`end-grad-${index}`}
                    cx="50%"
                    cy="50%"
                    r="50%"
                  >
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
                    <stop
                      offset="100%"
                      stopColor={cable.color}
                      stopOpacity="1"
                    />
                  </radialGradient>
                  <filter
                    id={`glow-end-${index}`}
                    x="-40%"
                    y="-40%"
                    width="180%"
                    height="180%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="6"
                      floodColor={cable.color}
                      floodOpacity="0.7"
                    />
                  </filter>
                </defs>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="18"
                  fill={`url(#end-grad-${index})`}
                  filter={`url(#glow-end-${index})`}
                  opacity={isHighlighted ? 0.7 : 1}
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="13"
                  fill="#374151"
                  stroke={cable.color}
                  strokeWidth={isHighlighted ? "4" : "2"}
                  className={isFail ? "cable-connector-fail" : ""}
                  style={{
                    transition: "all 0.2s",
                    filter: isHighlighted
                      ? `drop-shadow(0 0 10px ${cable.color})`
                      : "none",
                  }}
                />
                {/* Anschluss Icon */}
                <g pointerEvents="none">
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="6.5"
                    fill="#fff"
                    stroke="#222"
                    strokeWidth="2"
                    className={isFail ? "cable-circle-fail" : ""}
                  />
                  <rect
                    x={pos.x - 3.5}
                    y={pos.y + 6.5}
                    width="7"
                    height="6"
                    rx="2"
                    fill="#222"
                    stroke="#fff"
                    strokeWidth="1.2"
                  />
                  <circle cx={pos.x} cy={pos.y} r="2.5" fill={cable.color} />
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default CableGame;
