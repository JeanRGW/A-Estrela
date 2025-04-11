import IEstado from "./types/IEstado";
import labirinto from "./model/Labirinto";

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

function A_Estrela<T extends IEstado<T>>(estadoInicial: T, estadoFinal: T): T[] | null {
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

const meta = labirinto[0][3].estado;
const inicial = labirinto[3][3].estado;

const caminho = A_Estrela(inicial, meta);

if (caminho) {
    console.log("Caminho encontrado:");
    for (const estado of caminho) {
        console.log(`Posição: (${estado.pos[0]}, ${estado.pos[1]})`);
    }
} else {
    console.log("Nenhum caminho encontrado.");
}