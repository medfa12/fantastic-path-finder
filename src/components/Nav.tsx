// src/components/Nav.tsx

import { MutableRefObject, useState } from 'react';
import { usePathProvider } from '../hooks/usePathFinding';
import { useSpeed } from '../hooks/useSpeed';
import { useTile } from '../hooks/useTile';
import { AlgorithmType, MazeType } from '../utils/types';
import Select from './Select';
import { ALGORITHM_TYPES, EXTENDED_SPEED, MAZE_TYPES, SPEED, SPEEDS } from '../utils/constants';
import { resetGrid } from '../utils/resetGrid';
import { runMazeAlgorithm } from '../utils/runMazeAlgorithm';
import PlayButton from './PlayButton';
import { runPathFindingAlgorithm } from '../utils/runPathFindingAlgorithm'; // <-- import here
import { setAnimatePath } from '../utils/setAnimatePath';
import { clearGrid } from '../utils/clearGrid';
import ThemeToggle from './ThemeToggle';

const Nav = ({isVisualizationRunningRef} : {isVisualizationRunningRef:MutableRefObject<Boolean>}) => {
  const { speedRate, setSpeedRate } = useSpeed();
  const { algorithm, setAlgorithm, maze, setMaze, grid, setGrid,
          isGraphVisualized, setIsGraphVisualized } = usePathProvider();
  const { startTile, endTile } = useTile();

  const [disabled, setDisabled] = useState(false);
  const [runDisabled, setRunDisabled] = useState(false);

  // 1) add these states for displaying results
  const [nodeCount, setNodeCount] = useState<number>(0);
  const [timeMs, setTimeMs] = useState<number>(0);

  const handleMazeChange = (mazeType: MazeType) => {
    resetGrid({ grid, startTile, endTile });
    if(mazeType === 'NONE'){
      setMaze(mazeType);
      return;
    }
    setMaze(mazeType);
    runMazeAlgorithm({ maze: mazeType, grid, startTile, endTile, setIsDisabled: setDisabled, speed: speedRate });
    const newGrid = grid.slice();
    setGrid(newGrid);
    setIsGraphVisualized(false);
  };

  const handleRunVisualizer = () => {
    // if it's already visualized, we reset
    if(isGraphVisualized){
      setIsGraphVisualized(false);
      clearGrid({ grid: grid.slice(), startTile, endTile });
      setDisabled(false);
      return;
    }

    // run the chosen pathfinding algorithm
    const result = runPathFindingAlgorithm({ grid, startTile, endTile, algorithm });
    if(!result) return;

    const { traversedTiles, path, timeInMs, nodeCount } = result;
    // store results in state so we can display them
    setNodeCount(nodeCount);
    setTimeMs(timeInMs);

    // animate
    setDisabled(true);
    setRunDisabled(true);
    isVisualizationRunningRef.current = true;

    setAnimatePath({
      startTile,
      endTile,
      traversedTiles,
      path,
      speedRate
    });

    setTimeout(()=>{
      isVisualizationRunningRef.current=false;
      const newGrid = grid.slice();
      setGrid(newGrid);
      setRunDisabled(false);
      setIsGraphVisualized(true);
    }, (SPEEDS.find(s=>s.value===speedRate)!.value * SPEED * traversedTiles.length)
       + SPEEDS.find(s=>s.value===speedRate)!.value * EXTENDED_SPEED * path.length);
  };

  const handleAlgorithmChange = (algoType: AlgorithmType) => {
    setAlgorithm(algoType);
  };

  const handleSpeedChange = (speed: number) => {
    setSpeedRate(speed as any); // SpeedRate is 2 | 1 | 0.5
  };

  return (
    <section className="border-sky-800 border-b-4">
      <div className="containerlg">
        <ThemeToggle/>
      </div>
      <div className="containerlg flex items-center justify-center gap-5 min-w-[764px] ">
        <h1 className='w-1/2 dark:text-white lg:text-[50px] md:text-[38px] text-[30px] lg:leading-9 leading-6'>
          PathFinder <span className='text-purple-500 font-bold lg:text-[30px] md:text-[20px] text-[17px]'>
            Visualizer
          </span>
        </h1>
        <div className='flex flex-start gap-5  items-center lg:gap-8'>
          <Select
            label='Maze Type'
            isDisabled={disabled}
            value={maze}
            onChange={(e)=>{handleMazeChange(e.target.value as MazeType)}}
            options={MAZE_TYPES}
          />
          <Select
            label='Algorithm'
            isDisabled={disabled}
            value={algorithm}
            onChange={(e)=>{handleAlgorithmChange(e.target.value as AlgorithmType)}}
            options={ALGORITHM_TYPES}
          />
          <Select
            label='Speed'
            isDisabled={disabled}
            value={speedRate}
            onChange={(e)=>{handleSpeedChange(parseFloat(e.target.value))}}
            options={SPEEDS}
          />
          <PlayButton
            isGraphVisualized={isGraphVisualized}
            handleRunVisualizer={handleRunVisualizer}
            isDisabled={disabled && runDisabled}
          />
        </div>
      </div>

      {/* 2) Display node count and time in ms here: */}
      <div className="mt-4 text-center">
        <p className="dark:text-white">
          Nodes visited: <span className="font-semibold">{nodeCount}</span>
        </p>
        <p className="dark:text-white">
          Time: <span className="font-semibold">{timeMs.toFixed(2)} ms</span>
        </p>
      </div>
    </section>
  );
};

export default Nav;
