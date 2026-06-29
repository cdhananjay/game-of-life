import { useEffect, useRef, useState } from "react";

function neighbourCount(
  grid: boolean[][],
  r: number,
  c: number,
  rows: number,
  cols: number,
) {
  let count = 0;
  //top
  if (r - 1 >= 0 && r - 1 < rows) {
    if (grid[r - 1][c]) count++;
    // top right
    if (c + 1 >= 0 && c + 1 < cols && grid[r - 1][c + 1]) count++;
    // top left
    if (c - 1 >= 0 && c - 1 < cols && grid[r - 1][c - 1]) count++;
  }
  //bottom
  if (r + 1 >= 0 && r + 1 < rows) {
    if (grid[r + 1][c]) count++;
    // bottom right
    if (c + 1 >= 0 && c + 1 < cols && grid[r + 1][c + 1]) count++;
    // bottom left
    if (c - 1 >= 0 && c - 1 < cols && grid[r + 1][c - 1]) count++;
  }
  //left
  if (c - 1 >= 0 && c - 1 < cols && grid[r][c - 1]) count++;
  //right
  if (c + 1 >= 0 && c + 1 < cols && grid[r][c + 1]) count++;
  return count;
}

function getNextGen(grid: boolean[][], rows: number, cols: number) {
  const temp = grid.map((row) => [...row]);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const neighbours = neighbourCount(grid, r, c, rows, cols);
      if (grid[r][c]) {
        if (neighbours <= 1 || neighbours >= 4) {
          temp[r][c] = false;
        }
      } else {
        if (neighbours === 3) {
          temp[r][c] = true;
        }
      }
    }
  }
  return temp;
}

function App() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [grid, setGrid] = useState<boolean[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(false)),
  );
  const [isRunning, setIsRunning] = useState(false);
  const isPainting = useRef(false);
  const paintValue = useRef(false);

  function setCell(r: number, c: number, value: boolean) {
    setGrid((prev) => {
      if (prev[r][c] === value) return prev;
      const copy = prev.map((row) => [...row]);
      copy[r][c] = value;
      return copy;
    });
  }

  function toggleCell(r: number, c: number) {
    setGrid((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[r][c] = !prev[r][c];
      return copy;
    });
  }

  function stopPainting() {
    isPainting.current = false;
  }

  useEffect(() => {
    window.addEventListener("mouseup", stopPainting);
    return () => window.removeEventListener("mouseup", stopPainting);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setGrid((prev) => getNextGen(prev, rows, cols));
    }, 500);

    return () => clearInterval(id);
  }, [isRunning, rows, cols]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-4xl font-bold tracking-tight text-white/90">
        Game of Life
      </h1>

      <div
        className="grid gap-px rounded-lg bg-white/10 p-px shadow-[0_0_40px_rgba(255,255,255,0.05)]"
        onMouseUp={stopPainting}
        onMouseLeave={stopPainting}
      >
        {grid.map((row, r) => (
          <div key={r} className="flex">
            {row.map((alive, c) => (
              <Cell
                key={`${r}-${c}`}
                alive={alive}
                onMouseDown={() => {
                  toggleCell(r, c);
                  isPainting.current = true;
                  paintValue.current = !grid[r][c];
                }}
                onMouseEnter={() => {
                  if (isPainting.current) setCell(r, c, paintValue.current);
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          className="rounded-lg bg-zinc-600 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-500 active:bg-zinc-700 disabled:opacity-40"
          onClick={() => setIsRunning(true)}
          disabled={isRunning}
        >
          Start
        </button>
        <button
          className="rounded-lg bg-zinc-700 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-600 active:bg-zinc-800 disabled:opacity-40"
          onClick={() => setIsRunning(false)}
          disabled={!isRunning}
        >
          Stop
        </button>
      </div>
      <div className="flex gap-4">
        <input
          className="rounded-lg bg-zinc-600 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-500 active:bg-zinc-700 disabled:opacity-40"
          disabled={isRunning}
          type="number"
          placeholder="rows"
          onChange={(e) => {
            if (Number(e.target.value) >= 1) setRows(Number(e.target.value));
          }}
        />
        <input
          className="rounded-lg bg-zinc-600 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-500 active:bg-zinc-700 disabled:opacity-40"
          disabled={isRunning}
          type="number"
          placeholder="cols"
          onChange={(e) => {
            if (Number(e.target.value) >= 1) setCols(Number(e.target.value));
          }}
        />
      </div>
      <div className="flex gap-4">
        <button
          className="rounded-lg bg-zinc-600 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-500 active:bg-zinc-700 disabled:opacity-40"
          onClick={() =>
            setGrid(Array.from({ length: rows }, () => Array(cols).fill(false)))
          }
          disabled={isRunning}
        >
          Apply
        </button>
      </div>
    </main>
  );
}

interface cellProps {
  alive: boolean;
  onMouseDown: () => void;
  onMouseEnter: () => void;
}

function Cell({ alive, onMouseDown, onMouseEnter }: cellProps) {
  return (
    <button
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      className={`h-10 w-10 rounded-sm transition-colors ${
        alive
          ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]"
          : "bg-zinc-900 hover:bg-zinc-700"
      }`}
    />
  );
}

export default App;
