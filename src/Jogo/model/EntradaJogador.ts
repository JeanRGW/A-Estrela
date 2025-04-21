import { EventEmitter } from "stream";
import IInput from "../types/types";

export default class EntradaJogador extends EventEmitter implements IInput {
    constructor() {
        super();

        process.stdin.on("data", (data) => {
            const key = data.toString();

            // Map key inputs to actions
            if (key === "\u001B[A" || key.toLowerCase() === "w") {
                this.emit("teclaPressionada", "cima");
            } else if (key === "\u001B[B" || key.toLowerCase() === "s") {
                this.emit("teclaPressionada", "baixo");
            } else if (key === "\u001B[D" || key.toLowerCase() === "a") {
                this.emit("teclaPressionada", "esquerda");
            } else if (key === "\u001B[C" || key.toLowerCase() === "d") {
                this.emit("teclaPressionada", "direita");
            }
        });
    }

    public getEntrada(): string {
        return "Entrada do jogador";
    }

    public setOn(){
        process.stdin.setRawMode(true);
        process.stdin.resume();

        // process.stdin.removeAllListeners("data");
    }

    public setOff(){
        process.stdin.setRawMode(false);
        process.stdin.resume();
    }
}

// Example usage
const entrada = new EntradaJogador();
console.log("Use as setas ou WASD para mover. Pressione Ctrl+C para sair.");