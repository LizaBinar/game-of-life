import "./game-of-life.css"
import React, { useState, useRef, useEffect } from 'react';
import Rules from "../rules/rules";
import Modal from "../modal/modal";

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

const createEmptyGrid = () => {
    return Array.from({ length: HEIGHT / CELL_SIZE }, () =>
        Array.from({ length: WIDTH / CELL_SIZE }, () => false)
    );
};

const randomizeGrid = () => {
    return Array.from({ length: HEIGHT / CELL_SIZE }, () =>
        Array.from({ length: WIDTH / CELL_SIZE }, () => Math.random() > 0.5)
    );
};

const Cell = ({ x, y, alive, toggleCell }) => (
    <div
        className={`cell ${alive ? 'alive' : ''}`}
        onClick={() => toggleCell(x, y)}
    />
);

const Grid = ({ cells, toggleCell }) => (
    <div className="grid">
        {cells.map((row, y) => (
            <div key={y} className="row">
                {row.map((cell, x) => (
                    <Cell
                        key={`${x},${y}`}
                        x={x}
                        y={y}
                        alive={cell}
                        toggleCell={toggleCell}
                    />
                ))}
            </div>
        ))}
    </div>
);

const Controls = ({ generation, running, handleStart, handleStop, handleClear, handleRandom }) => (
    <div className="controls">
        <div>Generation: {generation}</div>
        <div>
            {running ? (
                <button onClick={handleStop}>Stop</button>
            ) : (
                <button onClick={handleStart}>Start</button>
            )}
            <button onClick={handleClear}>Clear</button>
            <button onClick={handleRandom}>Randomize</button>
        </div>
    </div>
);

const SpeedControls = ({ speed, setSpeed }) => (
    <div className="speed-controls">
        <label>Speed:</label>
        <input
            type="range"
            min="1"
            max="15"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
        />
    </div>
);

const GameOfLife = () => {
    const [showRules, setShowRules] = useState(false);
    const [cells, setCells] = useState(randomizeGrid());
    const [generation, setGeneration] = useState(0);
    const [running, setRunning] = useState(false);
    const [speed, setSpeed] = useState(5);

    const runningRef = useRef(running);
    runningRef.current = running;

    const handleToggleCell = (x, y) => {
        if (!runningRef.current) {
            const newCells = [...cells];
            newCells[y][x] = !newCells[y][x];
            setCells(newCells);
        }
    };

    const handleRandom = () => {
        setCells(randomizeGrid());
        setGeneration(0);
    };

    const handleToggleRules = () => {
        setShowRules(!showRules);
    };

    const handleCloseRules = () => {
        setShowRules(false);
    };


    const handleStart = () => {
        setRunning(true);
    };

    const handleStop = () => {
        setRunning(false);
    };

    const handleClear = () => {
        setCells(createEmptyGrid());
        setGeneration(0);
    };

    useEffect(() => {
        if (running) {
            const interval = setInterval(() => {
                setGeneration((prevGeneration) => prevGeneration + 1);
                setCells((prevCells) => generateNextGrid(prevCells));
            }, 1000 / speed);

            return () => {
                clearInterval(interval);
            };
        }
    }, [running, speed]);

    const countNeighbors = (grid, x, y) => {
        const numRows = grid.length;
        const numCols = grid[0].length;
        let count = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;

                let neighborX = x + j;
                let neighborY = y + i;

                // Обрабатываем замкнутую границу поля
                if (neighborX < 0) neighborX = numCols - 1;
                if (neighborX >= numCols) neighborX = 0;
                if (neighborY < 0) neighborY = numRows - 1;
                if (neighborY >= numRows) neighborY = 0;

                count += grid[neighborY][neighborX] ? 1 : 0;
            }
        }

        return count;
    };

    const generateNextGrid = (grid) => {
        return grid.map((row, y) =>
            row.map((cell, x) => {
                const neighbors = countNeighbors(grid, x, y);
                if (cell) {
                    return neighbors === 2 || neighbors === 3;
                } else {
                    return neighbors === 3;
                }
            })
        );
    };

    return (
        <div className="game-of-life">
            <button onClick={handleToggleRules}>
                {showRules ? 'Свернуть правила' : 'Развернуть правила'}
            </button>
            <Modal isOpen={showRules} onClose={handleCloseRules}>
                <Rules />
            </Modal>
            <Grid cells={cells} toggleCell={handleToggleCell} />
            <Controls
                generation={generation}
                running={running}
                handleStart={handleStart}
                handleStop={handleStop}
                handleClear={handleClear}
                handleRandom={handleRandom}
            />
            <SpeedControls speed={speed} setSpeed={setSpeed} />
        </div>
    );
};

export default GameOfLife;
