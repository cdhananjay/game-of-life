import { useState } from "react";

const rows = 10;
const cols = 10;

function start(){}

function stop(){}

function App() {
  const [grid, setGrid] = useState(Array.from({ length: rows }, () =>
    Array(cols).fill(false)))
  return <main>
    {grid.map((row, r) => {
      return (<> {row.map((alive,c) => <Cell key={`${r}-${c}`} grid={grid} setGrid={setGrid} alive={alive} r={r} c={c} />)} <br/></>)
    })}
    <div>
      game of life {" "}
      <button className="border bg-green-500" onClick={start}>start</button>
      {" "}
      <button className="border bg-red-500" onClick={stop}>stop</button>
    </div>
  </main>
}

interface cellProps {
  alive: boolean,
  r: number,
  c: number,
  grid: boolean[][],
  setGrid: React.Dispatch<React.SetStateAction<any[][]>>
}

function Cell({alive, r, c, grid, setGrid}: cellProps){ 
  return <button onClick={()=>{ 
    const temp = [...grid];
    temp[r][c] = !grid[r][c];
    setGrid(temp);
   }} className={`h-10 w-10 border ${alive ? "bg-black" : "bg-gray-400"}`}></button>
}

export default App
