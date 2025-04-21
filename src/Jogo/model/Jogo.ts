import gerarLabirinto from "./Labirinto";

export default class Jogo {
    private labirinto: number[][];
    private posicao: [number, number] = [0, 0];
    private tesourosColetados: number = 0;
    private tesourosTotais: number = 0;

    // Símbolos em base 2 para visualização mais proporcional.
    private readonly simboloJogador: string = '👤';
    private readonly simboloTesouro: string = '💰';
    private readonly simboloParede: string = '⬛';
    private readonly simboloCaminho: string = '⬜';
    private readonly simboloMeta: string = '🏁';

    constructor(tamanho: number) {
        this.labirinto = gerarLabirinto(tamanho);
        this.tesourosTotais = this.contarTesouros();
    }

    private contarTesouros(): number {
        let contador = 0;
        for (let i = 0; i < this.labirinto.length; i++) {
            for (let j = 0; j < this.labirinto[0].length; j++) {
                if (this.labirinto[i][j] === 2) { // Tesouro
                    contador++;
                }
            }
        }
        return contador;
    }

    public mover(direcao: string): boolean {
        const [x, y] = this.posicao;
        let novoX = x;
        let novoY = y;

        switch (direcao) {
            case 'cima':
                novoX--;
                break;
            case 'baixo':
                novoX++;
                break;
            case 'esquerda':
                novoY--;
                break;
            case 'direita':
                novoY++;
                break;
            default:
                throw new Error('Direção inválida');
        }

        if (this.labirinto[novoX]?.[novoY] !== undefined && this.labirinto[novoX][novoY] !== 1) { // Verifica se não é parede
            this.posicao = [novoX, novoY];

            if (this.labirinto[novoX][novoY] === 2) { // Se é tesouro
                this.tesourosColetados++;
                this.labirinto[novoX][novoY] = 0; // Remove o tesouro do labirinto
            }

            if (this.labirinto[novoX][novoY] === 3 && this.tesourosColetados === this.tesourosTotais) {
                return true;
            }

            return false;
        } else {
            throw new Error('Movimento inválido');
        }
    }

    public getPosicao(): [number, number] {
        return this.posicao;
    }

    public getTesourosColetados(): number {
        return this.tesourosColetados;
    }

    public getTesourosTotais(): number {
        return this.tesourosTotais;
    }

    public printJogo(): void {
        let quadro = ""; // String para armazenar a representação do labirinto

        quadro += this.simboloParede.repeat(this.labirinto[0].length + 2) + "\n"; // Borda no inicio do labirinto

        for (let i = 0; i < this.labirinto.length; i++) {
            quadro += this.simboloParede; // Borda no  inicio da linha
            for (let j = 0; j < this.labirinto[i].length; j++) {
                if (this.posicao[0] === i && this.posicao[1] === j) {
                    quadro += this.simboloJogador; // Adiciona o símbolo do jogador na posição atual
                } else if (this.labirinto[i][j] === 1) {
                    quadro += this.simboloParede; // Adiciona o símbolo da parede
                } else if (this.labirinto[i][j] === 2) {
                    quadro += this.simboloTesouro; // Adiciona o símbolo do tesouro
                } else if (this.labirinto[i][j] === 3) {
                    quadro += this.simboloMeta; // Adiciona o símbolo da meta
                } else {
                    quadro += this.simboloCaminho; // Adiciona o símbolo do caminho
                }
            }
            quadro += this.simboloParede + "\n"; // Borda e nova linha após cada linha do labirinto
        }

        quadro += this.simboloParede.repeat(this.labirinto[0].length + 2); // Borda no final do labirinto

        console.clear(); // Limpa o terminal
        console.log(quadro); // Imprime o labirinto no terminal
    }
}