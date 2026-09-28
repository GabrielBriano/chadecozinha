# Chá de Cozinha da Giovanna

Convite virtual responsivo em React + Vite, com identidade visual preto, branco e dourado.

## Executar

```bash
npm install
npm run dev
```

## Gerar versão de produção

```bash
npm run build
npm run preview
```

## Personalização

Os dados principais ficam no início de `src/App.jsx`, dentro de `EVENT`, `PIX_KEY` e `GIFTS`.

As imagens da decoração ficam em `public/images`.

## Banco de dados

Esta versão funciona imediatamente usando `localStorage` para testes. O arquivo `supabase.sql` já contém as três tabelas para a próxima etapa de conexão com o Supabase.

## Abertura em envelope de luxo
A tela inicial usa `public/images/envelope-luxo.png`, com envelope marfim, relevo botânico e selo preto com monograma dourado. O clique no selo inicia a animação e libera o site.
