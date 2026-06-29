import { Fragment, useEffect, useState } from "react";

const rows = 10;
const cols = 10;

function neighbourCount(grid: boolean[][], r: number, c: number) {
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

function getNextGen(grid: boolean[][]) {
  const temp = grid.map((row) => [...row]);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const neighbours = neighbourCount(grid, r, c);
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
  const [grid, setGrid] = useState<boolean[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(false)),
  );
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setGrid((prev) => getNextGen(prev));
    }, 500);

    return () => clearInterval(id);
  }, [isRunning]);

  return (
    <main>
      {grid.map((row, r) => {
        return (
          <Fragment key={r}>
            {" "}
            {row.map((alive, c) => (
              <Cell
                key={`${r}-${c}`}
                grid={grid}
                setGrid={setGrid}
                alive={alive}
                r={r}
                c={c}
              />
            ))}{" "}
            <br />
          </Fragment>
        );
      })}
      <div>
        game of life{" "}
        <button
          className="border bg-green-500"
          onClick={() => {
            setIsRunning(true);
          }}
        >
          start
        </button>{" "}
        <button
          className="border bg-red-500"
          onClick={() => setIsRunning(false)}
        >
          stop
        </button>
      </div>
    </main>
  );
}

interface cellProps {
  alive: boolean;
  r: number;
  c: number;
  grid: boolean[][];
  setGrid: React.Dispatch<React.SetStateAction<boolean[][]>>;
}

function Cell({ alive, r, c, grid, setGrid }: cellProps) {
  return (
    <button
      onClick={() => {
        const temp = grid.map((row) => [...row]);
        temp[r][c] = !grid[r][c];
        setGrid(temp);
      }}
      className={`h-10 w-10 border ${alive ? "bg-black" : "bg-gray-400"}`}
    ></button>
  );
}

export default App;
