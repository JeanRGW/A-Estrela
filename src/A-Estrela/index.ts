import { IEstado } from "./types/types";

function listaContem<T extends IEstado<T>>(lista: T[], estado: T): boolean {
    for (const item of lista) {
        if (item.equals(estado)) {
            return true;
        }
    }
    return false;
}

function ordenarAbertos<T extends IEstado<T>>(listaAbertos: T[]) {
    listaAbertos.sort((a, b) => (a.f < b.f ? -1 : 1));
}

export default function A_Estrela<T extends IEstado<T>>(estadoInicial: T, estadoFinal: T): T[] | null {
    const listaAbertos: T[] = [estadoInicial];
    const listaFechados: T[] = [];

    while (listaAbertos.length > 0) {
        const estadoAtual = listaAbertos.shift() as T;

        if (estadoAtual.equals(estadoFinal)) {
            return estadoAtual.caminho();
        }

        listaFechados.push(estadoAtual);

        for (const vizinho of estadoAtual.vizinhos()) {
            if (!listaContem(listaFechados, vizinho)) {
                const gTentativa = estadoAtual.g + estadoAtual.distancia(vizinho);

                if (!listaContem(listaAbertos, vizinho)) {
                    listaAbertos.push(vizinho);
                } else if (gTentativa >= vizinho.g) {
                    // Novo caminho não é melhor que o antigo
                    continue;
                }

                vizinho.pai = estadoAtual;
                vizinho.g = gTentativa;
                vizinho.h = vizinho.heuristica(estadoFinal);
                vizinho.f = vizinho.g + vizinho.h;
            }
        }

        ordenarAbertos(listaAbertos);
    }

    return null;
}