
import { getUntraversedNeighbors } from '../../../utils/helpers';
import { isInQueue } from '../../../utils/isInQueue';
import { GridType, TileType, AlgorithmResults } from '../../../utils/types';

export const runBFSAlgorithm = ({
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

    const base :TileType= grid[startTile.row][startTile.col];
    base.distance = 0;
    base.isTraversed = true;

    const traversedTiles: TileType[] = [];
    const untraversedTiles : TileType[] = [base];

    while(untraversedTiles.length){
        const tile = untraversedTiles.shift()!;
        if(tile.isWall) continue;
        if(tile.distance === Infinity ) continue;

        tile.isTraversed = true;
        traversedTiles.push(tile);

        if(tile.row === endTile.row && tile.col === endTile.col) {
            // If BFS stops upon reaching the endTile, break here:
            break;
        }

        const untraversedNeighbors = getUntraversedNeighbors(tile,grid);
        for (let neighbour of untraversedNeighbors){
            if(!isInQueue(neighbour, untraversedTiles)) {
                neighbour.parent = tile;
                neighbour.distance = tile.distance + 1;
                untraversedTiles.push(neighbour);
            }
        }
    }

    // Reconstruct path
    const path: TileType[] = [];
    let cursor = grid[endTile.row][endTile.col];

    while(cursor){
        cursor.isPath = true;
        path.unshift(cursor);
        cursor = cursor.parent!;
    }

    // End timer
    const endTime = performance.now();
    const timeInMs = endTime - startTime;
    const nodeCount = traversedTiles.length;

    return { traversedTiles, path, timeInMs, nodeCount };
};
