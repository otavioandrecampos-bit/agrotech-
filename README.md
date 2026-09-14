# AgroVerdade + IA

## Estrutura

- `index.html` — página do projeto
- `style.css` — estilos
- `script.js` — funções do site e chat
- `api/chat.js` — backend que conversa com a OpenAI
- `.env.example` — exemplo da variável da chave

## Segurança

NÃO coloque a chave da OpenAI em `index.html` ou `script.js`.

A variável deve existir somente no ambiente do servidor:

`OPENAI_API_KEY`

O frontend chama apenas `/api/chat`. A chave nunca é enviada ao navegador.

## Publicação com Vercel

1. Suba estes arquivos para um repositório GitHub.
2. Importe o repositório na Vercel.
3. Em Settings > Environment Variables, crie:
   - Name: `OPENAI_API_KEY`
   - Value: sua chave da OpenAI
4. Faça um novo deploy.

Não publique um arquivo `.env` com a chave no GitHub.

O projeto usa a Responses API no backend e `store: false` para não solicitar o armazenamento da resposta.
