
import { PriorityQueue } from '../../../utils/HeapClass';
import {
  getCoordinates,
  getTileFromCoordinates,
  isEqual,
  getUntraversedNeighbors
} from '../../../utils/helpers';
import { initHeuristicCosts } from '../../../utils/heuristics';

import {
  GridType,
  TileType,
  Coordinates,
  PriorityQueueValue,
  AlgorithmResults
} from '../../../utils/types';

interface AStarCostInterface {
  distance: number;
  fonctionCost: number;
}

export const runAStarAlgorithm = ({
    grid,
    startTile,
    endTile,
}:{
    grid:GridType,
    startTile:TileType,
    endTile:TileType,
}): AlgorithmResults => {

    // Start timer
    const startTime = performance.now();

    const traversedTiles : TileType[] = [];
    const heuristicCost = initHeuristicCosts({ grid, endTile });

    const base = grid[startTile.row][startTile.col];
    base.distance = 0;
    base.isTraversed = true;

    // PriorityQueue comparator => smallest fonctionCost first
    const comparator = (
      a: PriorityQueueValue<Coordinates, AStarCostInterface>,
      b: PriorityQueueValue<Coordinates, AStarCostInterface>
    ) => {
        if(a.priority.fonctionCost === b.priority.fonctionCost){
            // if same function cost, break tie by distance
            return a.priority.distance > b.priority.distance;
        }
        return a.priority.fonctionCost < b.priority.fonctionCost;
    };

    // Initialize queue
    const untraversedTiles: PriorityQueue<Coordinates, AStarCostInterface> = new PriorityQueue(undefined, comparator);
    untraversedTiles.push({
        value: getCoordinates(base),
        priority: {
            distance: base.distance,
            fonctionCost: base.distance + heuristicCost[base.row][base.col],
        }
    });

    while(!untraversedTiles.isEmpty()){
        const coords = untraversedTiles.pop();
        if(!coords) break;

        const currentTile = getTileFromCoordinates(coords.value, grid);
        if(currentTile.isWall) continue;
        if(currentTile.distance === Infinity) break;

        currentTile.isTraversed = true;
        traversedTiles.push(currentTile);

        if(isEqual(currentTile, endTile)) {
            break;
        }

        const neighbors = getUntraversedNeighbors(currentTile, grid).filter(n => !n.isWall);
        for (let neighbor of neighbors){
            const distanceToNeighbor = currentTile.distance + 1;
            if(distanceToNeighbor < neighbor.distance){
                neighbor.distance = distanceToNeighbor;
                neighbor.parent = currentTile;

                const coordsNeighbor = getCoordinates(neighbor);
                const newPriority = {
                    distance: distanceToNeighbor,
                    fonctionCost: distanceToNeighbor + heuristicCost[neighbor.row][neighbor.col]
                };

                if(!untraversedTiles.contains(coordsNeighbor)){
                    untraversedTiles.push({ value: coordsNeighbor, priority: newPriority });
                } else {
                    untraversedTiles.updatePriority(coordsNeighbor, newPriority);
                }
            }
        }
    }

    // Reconstruct path
    const path: TileType[] = [];
    let tile = grid[endTile.row][endTile.col]!;
    while(tile){
        tile.isPath = true;
        path.unshift(tile);
        tile = tile.parent!;
    }

    // End timer
    const endTime = performance.now();
    const timeInMs = endTime - startTime;
    const nodeCount = traversedTiles.length;

    return { path, traversedTiles, timeInMs, nodeCount };
};
