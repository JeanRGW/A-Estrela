import A_Estrela from "./A-Estrela";
import adicionarEstados from "./A-Estrela/model/LabirintoEstados";
import EntradaIA from "./Jogo/model/EntradaIA";
import Jogo from "./Jogo/model/Jogo";
import gerarLabirinto from "./Jogo/model/Labirinto";

// const labirinto = gerarLabirinto(11);

// const LabirintoEstados = adicionarEstados(labirinto);

// const caminho = A_Estrela(LabirintoEstados[0][0].estado, LabirintoEstados[LabirintoEstados.length - 1][LabirintoEstados.length -1 ].estado);

// console.log(caminho);

for(let i=0; i < 100; i++){
    const jogo = new Jogo(11, new EntradaIA());
    jogo.iniciarJogo().then(() => {
        if(!jogo.jogoEncerrado())
            throw new Error("Erro resolvendo o jogo.")
    })
}

