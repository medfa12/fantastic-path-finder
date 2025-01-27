export type AlgorithmType = 'DIJKSTRA' | 'A_STAR' | 'BFS' | 'DFS'; 
export type MazeType = 'BINARY_TREE'| 'NONE' | "RECURSIVE_DIVISION";
export type GridType = TileType[][];
export type TileType = {
    row:number;
    col:number;
    isWall:boolean;
    isStart:boolean;
    isEnd:boolean;
    isPath:boolean;
    distance:number;
    isTraversed:boolean;
    parent ?: TileType;}

export type SpeedRate = 2 | 1 | 0.5
export type PreferedType = 'dark' | 'light'

export interface speedNameInterface   {
    name:string,
    value:SpeedRate
}

export interface mazeNameInterface {
    name:string,
    value:MazeType
}

export interface algorithmsNameInterface {
    name:string,
    value:AlgorithmType
}

export interface PriorityQueueValue<T,V> {
    value: T,
    priority : V
}
export type PriorityQueueType = "Min" | "Max"

export interface Coordinates  {
    row:number, col:number}
    export interface AlgorithmResults {
        path: TileType[];
        traversedTiles: TileType[];
        nodeCount: number;    // new
        timeInMs: number;     // new
      }