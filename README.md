Projeto: Painel de Aprovação TJ-RJ

Estrutura:
- index.html (frontend)
- netlify/functions/gemini.js (serverless function que proxya a API Gemini)
- netlify.toml (config Netlify redirects)

Passos para rodar localmente (desenvolvimento):
1. Rodar Netlify Dev (recomendado):
   - instale o Netlify CLI: npm install -g netlify-cli
   - configure .env na raiz com: GEMINI_API_KEY=your_key_here
   - executar: netlify dev
   - acessar: http://localhost:8888 (Netlify Dev serve o frontend e as funções)

2. Alternativa (não recomendada):
   - Se preferir rodar um backend Node local, mantenha suas chaves fora do repositório e implemente um proxied endpoint parecido com a função em `netlify/functions/gemini.js`.

Deploy no Netlify (recomendado):
- Crie um novo site no Netlify a partir do repositório.
- Adicione a variável de ambiente GEMINI_API_KEY nas configurações do site (Settings > Build & Deploy > Environment > Environment variables).
- Netlify irá construir e expor a função em /.netlify/functions/gemini e o redirect /api/gemini já está configurado.

Notas de segurança:
- Nunca coloque a chave no frontend. Use funções serverless ou backend protegido.
- No Netlify, configure limites de uso e monitore requests para evitar abuso.

Teste rápido da função (com Netlify Dev ou após deploy):
- curl -X POST http://localhost:8888/.netlify/functions/gemini -H "Content-Type: application/json" -d '{"userPrompt":"Explique a separação dos poderes"}'

---
Desenvolvimento: Carlos Antonio de Oliveira Piquet
