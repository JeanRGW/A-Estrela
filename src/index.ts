import EntradaIA from "./Jogo/model/EntradaIA";
import EntradaJogador from "./Jogo/model/EntradaJogador";
import Jogo from "./Jogo";

const jogo = new Jogo(25, new EntradaIA());
jogo.iniciarJogo();

// Utilizado para benchmarks

// const jogos: Jogo[] = [];

// for (let i = 0; i < 1000; i++) {
//     jogos.push(new Jogo(25, new EntradaIA(), true));
// }

// const promessas = [];

// console.time("executando");

// for (const jogo of jogos) {
//     promessas.push(jogo.iniciarJogo());
// }

// Promise.all(promessas).then(() => {
//     console.log("Todos os jogos foram executados.");
//     console.timeEnd("executando");
// });
