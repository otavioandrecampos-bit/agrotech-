import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({
      erro: "Método não permitido."
    });

  }

  try {

    const { mensagem } = req.body;


    if (
      !mensagem ||
      typeof mensagem !== "string"
    ) {

      return res.status(400).json({
        erro: "Digite uma pergunta válida."
      });

    }


    if (mensagem.length > 4000) {

      return res.status(400).json({
        erro: "A pergunta é muito grande."
      });

    }


    const response =
      await ai.models.generateContent({

        model: "gemini-3.8-flash",

        contents: `

Você é a IA do projeto AgroVerdade.

O AgroVerdade é um projeto educacional que combate fake news
relacionadas ao agronegócio.

Responda em português do Brasil.

Ajude principalmente com:

- agricultura;
- agronomia;
- pecuária;
- solo;
- plantas;
- pragas;
- doenças;
- fertilizantes;
- defensivos agrícolas;
- meio ambiente;
- alimentos;
- tecnologia agrícola;
- máquinas agrícolas;
- notícias relacionadas ao agro;
- ciência relacionada ao agro.

Você possui acesso à Pesquisa Google.

Quando a pergunta precisar de informações atuais,
notícias, leis, números recentes ou verificação de uma
afirmação, utilize a Pesquisa Google.

Ao pesquisar:

- compare as informações encontradas;
- dê preferência a órgãos públicos, universidades,
  instituições científicas e fontes confiáveis;
- não considere uma única fonte como prova absoluta;
- não invente fontes;
- não invente estudos;
- não invente números;
- não invente leis;
- deixe claro quando uma informação não puder ser confirmada;
- explique quando fontes diferentes apresentarem informações
  conflitantes.

Quando o usuário perguntar se uma informação é verdadeira
ou falsa, procure apresentar:

VEREDITO:
Verdadeiro, Falso, Parcialmente verdadeiro ou Não comprovado.

EXPLICAÇÃO:
Explique de forma simples o motivo.

Não diga que pesquisou uma fonte se ela não tiver sido
realmente utilizada.

A pergunta do usuário é:

${mensagem}
`,

        config: {

          tools: [
            {
              googleSearch: {}
            }
          ]

        }

      });


    const fontes = [];


    const candidatos =
      response.candidates || [];


    for (
      const candidato of candidatos
    ) {

      const metadata =
        candidato.groundingMetadata;


      if (!metadata) {
        continue;
      }


      const chunks =
        metadata.groundingChunks || [];


      for (
        const chunk of chunks
      ) {

        const web =
          chunk.web;


        if (
          web &&
          web.uri &&
          web.title
        ) {

          const jaExiste =
            fontes.some(
              fonte =>
                fonte.url === web.uri
            );


          if (!jaExiste) {

            fontes.push({

              titulo:
                web.title,

              url:
                web.uri

            });

          }

        }

      }

    }


    return res.status(200).json({

      resposta:
        response.text ||
        "Não consegui gerar uma resposta.",

      fontes:
        fontes.slice(0, 8)

    });

  } catch (erro) {

    console.error(
      "Erro Gemini:",
      erro
    );


    return res.status(500).json({

      erro:
        "Erro ao consultar o Gemini."

    });

  }

}