# Deploy

Este repositório está preparado para deploy no Netlify usando Netlify Functions para proxy seguro da API Gemini (evita expor a chave no frontend).

Passos rápidos:

1. No painel do Netlify, crie um site e conecte ao repositório `carlospiquet2023/tjrj_2025` (ou use `netlify init`).
2. Defina a variável de ambiente `GEMINI_API_KEY` no site (Site settings → Build & deploy → Environment).
3. Opcional: para deploy automático via GitHub Actions, adicione os segredos no repositório GitHub:
    - `NETLIFY_AUTH_TOKEN` — token pessoal (Netlify) com permissão de deploy.
    - `NETLIFY_SITE_ID` — ID do site Netlify.

O workflow GitHub Actions `.github/workflows/deploy-netlify.yml` fará deploy automático quando houver push para `main`.

Testes locais:

- Instale Netlify CLI: `npm install -g netlify-cli` (ou use `npx netlify-cli`).
- Rode `netlify dev` para testar funções localmente.
- Teste o endpoint local:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:8888/api/gemini" -Method Post -ContentType "application/json" -Body (@{userPrompt="Teste";} | ConvertTo-Json)
   ```

Segurança:
- Nunca comite `GEMINI_API_KEY` no repositório. Use variáveis de ambiente no Netlify.

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
