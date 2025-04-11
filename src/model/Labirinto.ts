import Estado from "./Estado";

export type LabirintoEstados = {
    valor: number;
    estado: Estado;
}[][];

const labirinto =
    [
        [1, 1, 1, 0, 1, 1, 1],
        [1, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 0, 0, 0, 1]
    ]

const labiritoEstados: LabirintoEstados = [];

labirinto.forEach((linha, i) => {
    const row = linha.map((valor, j) => ({ valor, estado: new Estado([i, j], labiritoEstados) }));
    labiritoEstados.push(row);
});

export default labiritoEstados;