import IEstado from "../types/IEstado";
import { LabirintoEstados } from "./Labirinto";

const directions = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1]
];

export default class Estado implements IEstado<Estado> {
    mapa: LabirintoEstados;
    pos: [number, number];
    g: number;
    h: number;
    f: number;
    pai: Estado | null;

    constructor(pos: [number, number], mapa: LabirintoEstados) {
        this.pos = pos;
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.pai = null;
        this.mapa = mapa;
    }

    vizinhos(): Estado[] {
        const vizinhos: Estado[] = [];

        for (const [dx, dy] of directions) {
            const x = this.pos[0] + dx;
            const y = this.pos[1] + dy;

            if (x >= 0 && x < this.mapa.length && y >= 0 && y < this.mapa[0].length) {
                if (this.mapa[x][y].valor === 0) {
                    vizinhos.push(this.mapa[x][y].estado);
                }
            }
        }

        return vizinhos;
    }

    equals(estado: Estado): boolean {
        return this.pos[0] === estado.pos[0] && this.pos[1] === estado.pos[1];
    }

    distancia(vizinho: Estado): number {
        return Math.abs(vizinho.pos[0] - this.pos[0]) + Math.abs(vizinho.pos[1] - this.pos[1]);
    }

    heuristica(meta: Estado): number {
        return Math.abs(this.pos[0] - meta.pos[0]) + Math.abs(this.pos[1] - meta.pos[1]);
    }

    caminho(): Estado[] {
        const caminho: Estado[] = [this];
        let estadoC = this.pai;

        while (estadoC !== null) {
            caminho.unshift(estadoC);
            estadoC = estadoC.pai;
        }

        return caminho;
    }
}