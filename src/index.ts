import EntradaIA from "./Jogo/model/EntradaIA";
import EntradaJogador from "./Jogo/model/EntradaJogador";
import Jogo from "./Jogo";

let conc = 0;

for (let i = 0; i < 1; i++) {
    const jogo = new Jogo(25, new EntradaIA());
    jogo.iniciarJogo().then(() => {
        const [x, y] = jogo.getPosicao();
        const tC = jogo.getTesourosColetados();
        const tT = jogo.getTesourosTotais();

        if (x !== 24 || y !== 24 || tC !== tT)
            throw new Error("Solução inválida");
        else console.log("Concluídos:" + ++conc);
    });
}
