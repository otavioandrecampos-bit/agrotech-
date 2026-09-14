import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    const noticia = typeof req.body?.noticia === "string"
      ? req.body.noticia.trim()
      : "";

    if (!noticia) {
      return res.status(400).json({ error: "Envie uma notícia ou afirmação." });
    }

    if (noticia.length > 3000) {
      return res.status(400).json({ error: "O texto é muito longo." });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions:
        "Você é o verificador do projeto educacional AgroVerdade. " +
        "Analise a notícia ou afirmação enviada pelo estudante. " +
        "Não diga que algo é definitivamente verdadeiro ou falso apenas com base no texto. " +
        "Procure sinais de exagero, generalização, falta de fonte, linguagem sensacionalista " +
        "e afirmações que precisem de confirmação externa. " +
        "Responda em português do Brasil. " +
        "Comece com uma classificação: 'Provavelmente falsa/enganosa', " +
        "'Provavelmente verdadeira' ou 'Não é possível confirmar apenas pelo texto'. " +
        "Depois explique os sinais encontrados e indique que informações importantes " +
        "devem ser verificadas em fontes confiáveis.",
      input: noticia,
      max_output_tokens: 600,
      store: false
    });

    return res.status(200).json({
      resposta: response.output_text
    });
  } catch (error) {
    console.error("Erro na API:", error);
    return res.status(500).json({
      error: "Erro ao analisar a notícia."
    });
  }
}
