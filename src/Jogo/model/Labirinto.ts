type Labirinto = number[][];

enum ELEMENTOS {
    CAMINHO = 0,
    PAREDE = 1,
    TESOURO = 2,
    META = 3
}

function embaralharPilha(arr: [number, number][]): void {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function colocarTesouro(labirinto: Labirinto): void {
    const caminhos: [number, number][] = [];
    for (let i = 0; i < labirinto.length; i++) {
        for (let j = 0; j < labirinto[0].length; j++) {
            if (labirinto[i][j] === ELEMENTOS.CAMINHO && (i !== 0 || j !== 0) && (i !== labirinto.length - 1 || j !== labirinto[0].length - 1)) {
                caminhos.push([i, j]);
            }
        }
    }

    let nTesouros = Math.floor(Math.random() * 3) + 1; // Número aleatório de tesouros entre 1 e 3

    while(nTesouros > 0 && caminhos.length > 0) {
        const selecionado = Math.floor(Math.random() * caminhos.length);
        const [x, y] = caminhos.splice(selecionado, 1)[0]; // Remove o tesouro da lista de caminhos
        labirinto[x][y] = ELEMENTOS.TESOURO;
        nTesouros--;
    }
}

export default function gerarLabirinto(size: number): Labirinto {
    function criarCaminho(labirinto: Labirinto): void {
        const stack: [number, number][] = [[0, 0]];
        const direcoes = [
            [0, 1], [1, 0], [0, -1], [-1, 0]
        ];

        while (stack.length > 0) {
            const [x, y] = stack.pop()!;

            // Embaralha direções para criar caminhos mais aleatórios
            for (let i = direcoes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [direcoes[i], direcoes[j]] = [direcoes[j], direcoes[i]];
            }

            for (const [dx, dy] of direcoes) {
                const nx = x + dx * 2; // Multiplica por 2 para pular uma célula (celulas de parede)
                const ny = y + dy * 2;

                if (
                    nx >= 0 && ny >= 0 &&
                    nx < labirinto.length && ny < labirinto[0].length &&
                    (labirinto[nx][ny] === ELEMENTOS.PAREDE || Math.random() < 0.04)
                ) {
                    if(stack.length < 5 || Math.random() > 0.5) { // Possívelmente ignora o caminho, mais randômico
                        labirinto[x + dx][y + dy] = ELEMENTOS.CAMINHO;
                        labirinto[nx][ny] = ELEMENTOS.CAMINHO;
                        stack.push([nx, ny]);
                    }
                    
                    embaralharPilha(stack);
                }
            }
        }
    }

    if(size % 2 === 0) {
        throw new Error("O tamanho do labirinto deve ser um número ímpar.");
        size += 1;
    }

    const labirinto: Labirinto = Array.from({ length: size }, () => Array(size).fill(ELEMENTOS.PAREDE));
    labirinto[0][0] = ELEMENTOS.CAMINHO; // Start point

    criarCaminho(labirinto);
    colocarTesouro(labirinto);
    labirinto[size - 1][size - 1] = ELEMENTOS.META;

    if(labirintoSolucionavel(labirinto))
        return labirinto;
    else
        return gerarLabirinto(size); // Gera um novo labirinto se o atual não for solucionável
}

export function labirintoSolucionavel(labirinto: Labirinto): boolean {
    const size = labirinto.length;
    const visited = Array.from({ length: size }, () => Array(size).fill(false));
    let tesourosColetados = 0;
    let saidaEncontrada = false;
    let totalTreasures = 0;

    // Contar numero de tesouros
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (labirinto[i][j] === ELEMENTOS.TESOURO) {
                totalTreasures++;
            }
        }
    }

    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

    function floodFill(x: number, y: number): boolean {
        if (x < 0 || y < 0 || x >= size || y >= size || visited[x][y] || labirinto[x][y] === ELEMENTOS.PAREDE) {
            return false;
        }

        visited[x][y] = true;

        if (labirinto[x][y] === ELEMENTOS.TESOURO) {
            tesourosColetados++;
        } else if (labirinto[x][y] === ELEMENTOS.META) {
            saidaEncontrada = true;
        }

        if (saidaEncontrada && tesourosColetados === totalTreasures) {
            return true;
        }

        for (const [dx, dy] of directions) {
            if (floodFill(x + dx, y + dy)) {
                return true;
            }
        }

        return false;
    }

    return floodFill(0, 0);
}