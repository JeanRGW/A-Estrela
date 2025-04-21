import Estado from "./Estado";
import type { LabirintoEstados } from "../types/types";

export default function adicionarEstados(
    labirinto: number[][]
): LabirintoEstados {
    const labirintoEstados: LabirintoEstados = [];

    labirinto.forEach((linha, i) => {
        const row = linha.map((valor, j) => ({
            valor,
            estado: new Estado([i, j], labirintoEstados),
        }));
        labirintoEstados.push(row);
    });

    return labirintoEstados;
}
