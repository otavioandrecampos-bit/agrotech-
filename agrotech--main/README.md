# AgroTech

Projeto AgroTech usando Gemini API com backend serverless na Vercel.

## Estrutura

- `index.html` — página principal
- `script.js` — lógica do navegador
- `style.css` — estilos
- `api/chat.js` — endpoint da Gemini API
- `package.json` — dependência da Gemini
- `.env.example` — exemplo da variável de ambiente

## Configuração na Vercel

Crie uma Environment Variable:

`GEMINI_API_KEY`

Use a sua chave da Gemini como valor.

A chave não deve ser colocada no `index.html`, `script.js` ou commitada no GitHub.

## Endpoint

O frontend deve enviar as perguntas para:

`POST /api/chat`

com JSON:

```json
{
  "mensagem": "Sua pergunta"
}
```
