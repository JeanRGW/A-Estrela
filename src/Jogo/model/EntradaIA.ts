import { EventEmitter } from "stream";
import A_Estrela from "../../A-Estrela";
import adicionarEstados from "../../A-Estrela/model/LabirintoEstados";
import IInput from "../types/types";
import Estado from "../../A-Estrela/model/Estado";

export default class EntradaIA extends EventEmitter implements IInput {
    public setOn(labirinto: number[][]) {
        const labEstados = adicionarEstados(labirinto);

        const estadoInicial = labEstados[0][0].estado;
        const estadoFinal = labEstados[labEstados.length - 1][labEstados[0].length - 1].estado;
        const estadosTesouros = labEstados
            .flatMap(linha => linha.filter(celula => celula.valor === 2).map(celula => celula.estado));

        const melhorCaminho = this.encontrarMelhorCaminho(estadoInicial, estadosTesouros, estadoFinal);

        if (!melhorCaminho) {
            throw new Error("Não foi possível encontrar um caminho válido.");
        }

        const direcoes = this.traduzirDirecoes(melhorCaminho);


        const intervalo = setInterval(() => {
            const direcao = direcoes.shift();

            switch (direcao) {
                case "cima":
                    this.emit("teclaPressionada", "cima");
                    break;
                case "baixo":
                    this.emit("teclaPressionada", "baixo");
                    break;
                case "esquerda":
                    this.emit("teclaPressionada", "esquerda");
                    break;
                case "direita":
                    this.emit("teclaPressionada", "direita");
                    break;
            }

            if(direcoes.length === 0){
                clearInterval(intervalo);
            }
        }, 10)
    }

    public setOff() {
    // Apenas para cumprir a interface
}

    private encontrarMelhorCaminho(estadoInicial: Estado, estadosTesouros: Estado[], estadoFinal: Estado): Estado[] | null {
    const permutacoes = this.gerarPermutacoes(estadosTesouros);

    let menorCusto = Infinity;
    let melhorCaminho: any[] | null = null;

    for (const ordemTesouros of permutacoes) {
        let custoAtual = 0;
        let caminhoAtual: any[] = [];
        let estadoAtual = estadoInicial;

        // Find the path to each treasure in the current order
        for (const tesouro of ordemTesouros) {
            const caminho = A_Estrela(estadoAtual, tesouro);
            if (!caminho) {
                custoAtual = Infinity;
                break;
            }
            custoAtual += caminho.length;
            caminhoAtual = caminhoAtual.concat(caminho); // Avoid duplicating the starting point
            estadoAtual = tesouro;
        }

        // Find the path to the final state
        const caminhoParaFinal = A_Estrela(estadoAtual, estadoFinal);
        if (!caminhoParaFinal) {
            custoAtual = Infinity;
            continue;
        }

        custoAtual += caminhoParaFinal.length;
        caminhoAtual = caminhoAtual.concat(caminhoParaFinal);

        // Update the best path if the current one is cheaper
        if (custoAtual < menorCusto) {
            menorCusto = custoAtual;
            melhorCaminho = caminhoAtual;
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