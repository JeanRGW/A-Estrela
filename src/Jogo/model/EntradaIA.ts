import { EventEmitter } from "stream";
import A_Estrela from "../../A-Estrela";
import adicionarEstados from "../../A-Estrela/model/LabirintoEstados";
import IInput from "../types/types";
import Estado from "../../A-Estrela/model/Estado";

export default class EntradaIA extends EventEmitter implements IInput {
    public setOn(labirinto: number[][]) {
        const labEstados = adicionarEstados(labirinto);

        const estadoInicial = labEstados[0][0].estado;
        const estadoFinal =
            labEstados[labEstados.length - 1][labEstados[0].length - 1].estado;
        const estadosTesouros = labEstados.flatMap((linha) =>
            linha
                .filter((celula) => celula.valor === 2)
                .map((celula) => celula.estado)
        );

        if (!estadoFinal) {
            throw new Error("Estado final inválido.");
        }

        const melhorCaminho = this.encontrarMelhorCaminho(
            estadoInicial,
            estadosTesouros,
            estadoFinal
        );

        if (!melhorCaminho) {
            throw new Error("Não foi possível encontrar um caminho válido.");
        }

        const direcoes = this.traduzirDirecoes(melhorCaminho);
        this.executarMovimentos(direcoes);
    }

    public setOff() {
        this.removeAllListeners();
    }

    private executarMovimentos(direcoes: string[]): void {
        const intervalo = setInterval(() => {
            const direcao = direcoes.shift();
            if (direcao) {
                this.emit("teclaPressionada", direcao);
            }

            if (direcoes.length === 0) {
                clearInterval(intervalo);
            }
        }, 300);
    }

    private encontrarMelhorCaminho(
        inicio: Estado,
        tesouros: Estado[],
        fim: Estado
    ): Estado[] | null {
        const permutacoes = this.gerarPermutacoes(tesouros);
        let melhorCusto = Infinity;
        let melhorCaminho: Estado[] | null = null;

        for (const ordem of permutacoes) {
            let estadoAtual = inicio;
            let custoTotal = 0;
            let caminhoAtual: Estado[] = [];

            for (const tesouro of ordem) {
                const caminho = A_Estrela(estadoAtual, tesouro);
                if (!caminho) {
                    custoTotal = Infinity;
                    break;
                }

                custoTotal += caminho.length;
                caminhoAtual.push(...caminho.slice(1)); // evita duplicar o ponto anterior
                estadoAtual = tesouro;
            }

            const caminhoFinal = A_Estrela(estadoAtual, fim);
            if (!caminhoFinal) continue;

            custoTotal += caminhoFinal.length;
            caminhoAtual.push(...caminhoFinal.slice(1));

            if (custoTotal < melhorCusto) {
                melhorCusto = custoTotal;
                melhorCaminho = [inicio, ...caminhoAtual];
            }
        }

        return melhorCaminho;
    }

    private gerarPermutacoes(array: Estado[]): Estado[][] {
        if (array.length === 0) return [[]];
        const resultado: any[][] = [];
        for (let i = 0; i < array.length; i++) {
            const resto = array.slice(0, i).concat(array.slice(i + 1));
            for (const permutacao of this.gerarPermutacoes(resto)) {
                resultado.push([array[i], ...permutacao]);
            }
        }
        return resultado;
    }

    private traduzirDirecoes(caminho: Estado[]): string[] {
        const direcoes = [];

        for (let i = 0; i < caminho.length - 1; i++) {
            const estadoAtual = caminho[i];
            const proximoEstado = caminho[i + 1];

            if (estadoAtual.pos[1] < proximoEstado.pos[1]) {
                direcoes.push("direita");
            } else if (estadoAtual.pos[1] > proximoEstado.pos[1]) {
                direcoes.push("esquerda");
            } else if (estadoAtual.pos[0] < proximoEstado.pos[0]) {
                direcoes.push("baixo");
            } else if (estadoAtual.pos[0] > proximoEstado.pos[0]) {
                direcoes.push("cima");
            }
        }

        return direcoes;
    }
}
