export interface IEstado<T extends IEstado<T>> {
    g: number; // Cost from start
    h: number; // Estimated cost to the goal
    f: number; // Total estimated cost
    pai: T | null; // Parent node for path reconstruction
    vizinhos: () => T[]; // Returns neighboring states
    equals: (estado: T) => boolean; // Compares two states
    distancia: (vizinho: T) => number; // Distance to a neighbor
    heuristica: (meta: T) => number; // Heuristic cost to the goal
    caminho: () => T[]; // Reconstructs the path
}

export type LabirintoEstados = {
    valor: number;
    estado: Estado;
}[][];