
import { runAStarAlgorithm } from '../lib/algorithms/pathFinding/Astar';
import { runBFSAlgorithm } from '../lib/algorithms/pathFinding/BFS';
import { runDFSAlgorithm } from '../lib/algorithms/pathFinding/DFS';
import { runDijkstraAlgorithm } from '../lib/algorithms/pathFinding/Dijkstra';
import { AlgorithmType, GridType, TileType, AlgorithmResults } from './types';

export const runPathFindingAlgorithm = ({
    grid,
    startTile,
    endTile,
    algorithm
}:{
    grid:GridType,
    startTile:TileType,
    endTile:TileType,
    algorithm: AlgorithmType,
}): AlgorithmResults | null => {
    switch (algorithm) {
        case 'DIJKSTRA': 
            return runDijkstraAlgorithm({ grid, startTile, endTile });

        case 'A_STAR':
            return runAStarAlgorithm({ grid, startTile, endTile });

        case 'BFS':
            return runBFSAlgorithm({ grid, startTile, endTile });

        case 'DFS':
            return runDFSAlgorithm({ grid, startTile, endTile });

        default:
            // fallback to BFS
            return runBFSAlgorithm({ grid, startTile, endTile });
    }
};
