export interface IEstado<T extends IEstado<T>> {
    g: number; // Custo do início até o estado atual
    h: number; // Custo estimado até o objetivo
    f: number; // Custo total estimado
    pai: T | null; // Estado pai
    vizinhos: () => T[]; // Retorna os vizinhos do estado atual
    equals: (estado: T) => boolean; // Compara dois estados
    distancia: (vizinho: T) => number; // Distância (custo) para um vizinho
    heuristica: (meta: T) => number; // Função heurística
    caminho: () => T[]; // Reconstrói o caminho do estado atual até o inicial
}

export type LabirintoEstados = {
    valor: number;
    estado: Estado;
}[][];
