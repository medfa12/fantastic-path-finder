
import {
    getCoordinates,
    getTileFromCoordinates,
    getUntraversedNeighbors,
    isEqual
} from '../../../utils/helpers';

import { GridType, TileType, Coordinates, AlgorithmResults } from '../../../utils/types';
import { PriorityQueue } from '../../../utils/HeapClass';

export const runDijkstraAlgorithm = ({
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

    const waitlist: PriorityQueue<Coordinates, number> = new PriorityQueue('Min');
    waitlist.push({ value: getCoordinates(base), priority: 0 });

    while(!waitlist.isEmpty()){
        const coords = waitlist.pop();
        if(coords !== undefined){
            const currentTile = getTileFromCoordinates(coords.value,grid);
            if(currentTile.isWall) continue;
            if(currentTile.distance === Infinity) break;

            currentTile.isTraversed = true;
            traversedTiles.push(currentTile);

            if(isEqual(currentTile,endTile)) {
                break;
            }

            const untraversedNeighbors = getUntraversedNeighbors(currentTile,grid)
                                           .filter(n => n.isWall === false);
            for (let neighbor of untraversedNeighbors) {
                const newDistance = currentTile.distance + 1;
                if(newDistance < neighbor.distance){
                    neighbor.distance = newDistance;
                    neighbor.parent = currentTile;

                    const coordsNeighbor = getCoordinates(neighbor);

                    // If not in the queue, push it
                    if(!waitlist.contains(coordsNeighbor)) {
                        waitlist.push({value: coordsNeighbor, priority: neighbor.distance});
                    }
                    else {
                        // otherwise update its priority
                        waitlist.updatePriority(coordsNeighbor, neighbor.distance);
                    }
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
