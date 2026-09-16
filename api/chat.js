import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido." });
  }

  try {
    const { mensagem } = req.body || {};

    if (!mensagem || typeof mensagem !== "string") {
      return res.status(400).json({ erro: "Digite uma pergunta válida." });
    }

    if (mensagem.length > 4000) {
      return res.status(400).json({ erro: "A pergunta é muito grande." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        erro: "GEMINI_API_KEY não configurada na Vercel."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: mensagem,
      config: {
        systemInstruction: `
Você é a IA do AgroTech.

Responda em português do Brasil, de forma clara e objetiva.
Ajude principalmente com agricultura, agronomia, pecuária,
solo, plantas, pragas, doenças, fertilizantes, defensivos,
meio ambiente, alimentos, máquinas e tecnologia agrícola.

Quando a pergunta precisar de informação atual, notícias,
números recentes ou verificação de uma afirmação, use a
Pesquisa Google disponível nesta solicitação.

Não invente fontes, estudos, números ou leis.
Quando não for possível confirmar uma informação, diga isso.
`,
        tools: [{ googleSearch: {} }]
      }
    });

    const fontes = [];
    const chunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    for (const chunk of chunks) {
      if (chunk.web?.uri && chunk.web?.title) {
        if (!fontes.some(f => f.url === chunk.web.uri)) {
          fontes.push({
            titulo: chunk.web.title,
            url: chunk.web.uri
          });
        }
      }
    }

    return res.status(200).json({
      resposta: response.text || "Não consegui gerar uma resposta.",
      fontes: fontes.slice(0, 8)
    });
  } catch (erro) {
    console.error("Erro Gemini:", erro);
    return res.status(500).json({
      erro: erro?.message || "Erro ao consultar a inteligência artificial."
    });
  }
}
