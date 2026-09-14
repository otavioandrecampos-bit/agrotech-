/* =========================
EXEMPLOS
========================= */

function verificarExemplo(tipo) {

    if (tipo === "fake") {

        document.getElementById(
            "resultado-fake"
        ).textContent =
            "⚠️ A afirmação é generalizada. O manejo de plantas daninhas depende da cultura, da espécie e das condições da lavoura.";

    }

    if (tipo === "true") {

        document.getElementById(
            "resultado-true"
        ).textContent =
            "✅ A informação está correta. A rotação de culturas pode contribuir para a conservação do solo.";

    }

}

/* =========================
IA
========================= */

async function perguntarIA() {

    const input =
        document.getElementById("pergunta");

    const mensagens =
        document.getElementById("chat-messages");

    const botao =
        document.getElementById("enviar-ia");

    const pergunta =
        input.value.trim();

    if (!pergunta) {
        return;
    }

    /* Mensagem do usuário */

    const usuario =
        document.createElement("div");

    usuario.className =
        "user-message";

    usuario.textContent =
        pergunta;

    mensagens.appendChild(usuario);

    input.value = "";

    botao.disabled = true;

    botao.textContent =
        "Pesquisando...";

    /* Carregamento */

    const carregando =
        document.createElement("div");

    carregando.className =
        "ai-message";

    carregando.textContent =
        "🔎 Pesquisando e analisando fontes...";

    mensagens.appendChild(carregando);

    mensagens.scrollTop =
        mensagens.scrollHeight;

    try {

        const resposta =
            await fetch("/api/chat", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    mensagem: pergunta
                })

            });


        const dados =
            await resposta.json();


        carregando.remove();


        if (!resposta.ok) {

            throw new Error(
                dados.erro ||
                "Erro ao consultar a IA."
            );

        }


        /* Resposta */

        const mensagemIA =
            document.createElement("div");

        mensagemIA.className =
            "ai-message";


        const titulo =
            document.createElement("div");

        titulo.className =
            "message-title";

        titulo.textContent =
            "🤖 IA AgroVerdade";

        mensagemIA.appendChild(titulo);


        const texto =
            document.createElement("div");

        texto.textContent =
            dados.resposta ||
            "Não consegui gerar uma resposta.";

        mensagemIA.appendChild(texto);


        /* Fontes */

        if (
            Array.isArray(dados.fontes) &&
            dados.fontes.length > 0
        ) {

            const tituloFontes =
                document.createElement("strong");

            tituloFontes.textContent =
                "🔎 Fontes consultadas:";

            tituloFontes.style.display =
                "block";

            tituloFontes.style.marginTop =
                "15px";

            mensagemIA.appendChild(
                tituloFontes
            );


            const lista =
                document.createElement("ul");


            dados.fontes.forEach(
                fonte => {

                    if (
                        !fonte ||
                        !fonte.url
                    ) {
                        return;
                    }


                    const item =
                        document.createElement("li");


                    const link =
                        document.createElement("a");

                    link.href =
                        fonte.url;

                    link.textContent =
                        fonte.titulo ||
                        "Abrir fonte";

                    link.target =
                        "_blank";

                    link.rel =
                        "noopener noreferrer";


                    item.appendChild(link);

                    lista.appendChild(item);

                }
            );


            mensagemIA.appendChild(lista);

        }


        mensagens.appendChild(
            mensagemIA
        );

    } catch (erro) {

        console.error(erro);

        carregando.remove();


        const erroMensagem =
            document.createElement("div");

        erroMensagem.className =
            "ai-message";

        erroMensagem.textContent =
            "❌ Não foi possível consultar a IA. Verifique sua configuração no Vercel e tente novamente.";

        mensagens.appendChild(
            erroMensagem
        );

    }

    botao.disabled =
        false;

    botao.textContent =
        "Enviar";

    mensagens.scrollTop =
        mensagens.scrollHeight;

}

/* ENTER */

document
    .getElementById("pergunta")
    ?.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                perguntarIA();

            }

        }

    );

/* =========================
QUIZ
========================= */

const perguntasQuiz = [

    {
        pergunta:
            "Qual atitude ajuda a identificar uma fake news?",

        opcoes: [

            "Compartilhar imediatamente",

            "Verificar a informação em fontes confiáveis",

            "Acreditar porque muitas pessoas enviaram",

            "Ignorar a fonte da notícia"

        ],

        resposta: 1

    }

];

let perguntaAtual = 0;

function iniciarQuiz() {

    document.getElementById(
        "quiz-start"
    ).style.display = "none";

    document.getElementById(
        "quiz-content"
    ).style.display = "block";

    mostrarPergunta();

}

function mostrarPergunta() {

    const pergunta =
        perguntasQuiz[
        perguntaAtual
        ];

    document.getElementById(
        "pergunta-quiz"
    ).textContent =
        pergunta.pergunta;

    const opcoes =
        document.getElementById(
            "opcoes"
        );

    opcoes.innerHTML = "";

    document.getElementById(
        "resultado-quiz"
    ).textContent = "";

    pergunta.opcoes.forEach(
        (opcao, indice) => {

            const botao =
                document.createElement(
                    "button"
                );

            botao.className =
                "opcao";

            botao.textContent =
                opcao;

            botao.onclick =
                () => responder(indice);

            opcoes.appendChild(
                botao
            );

        }

    );

}

function responder(indice) {

    const pergunta =
        perguntasQuiz[
        perguntaAtual
        ];

    const resultado =
        document.getElementById(
            "resultado-quiz"
        );

    if (
        indice === pergunta.resposta
    ) {

        resultado.textContent =
            "✅ Resposta correta!";

    } else {

        resultado.textContent =
            "❌ Resposta incorreta. Procure sempre verificar as informações em fontes confiáveis.";

    }

    document
        .querySelectorAll(".opcao")
        .forEach(botao => {

            botao.disabled = true;

        });

}



