

import { getUntraversedNeighbors, isEqual } from '../../../utils/helpers';
import { isInQueue } from '../../../utils/isInQueue';
import { GridType, TileType, AlgorithmResults } from '../../../utils/types';

export const runDFSAlgorithm = ({
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

    const traversedTiles: TileType[] = [];
    const base = grid[startTile.row][startTile.col];
    base.distance = 0;
    base.isTraversed = true;

    const untraversedTiles: TileType[] = [base];

    while(untraversedTiles.length){
        const currentTile = untraversedTiles.pop()!;
        if(currentTile.isWall) continue;
        if(currentTile.distance === Infinity) break;

        currentTile.isTraversed = true;
        traversedTiles.push(currentTile);

        // If you prefer to break upon reaching endTile:
        if(isEqual(currentTile,endTile)) {
            break;
        }

        const untraversedNeighbors = getUntraversedNeighbors(currentTile,grid);
        for (let neighbor of untraversedNeighbors) {
            if(!isInQueue(neighbor, untraversedTiles)) {
                neighbor.parent = currentTile;
                neighbor.distance = currentTile.distance + 1;
                untraversedTiles.push(neighbor);
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

    return { traversedTiles, path, timeInMs, nodeCount };
};
