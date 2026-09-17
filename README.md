# Carmelita Restaurante & Bistrô

Site institucional do Carmelita Bistrô (Praia da Costa, Vila Velha/ES): landing page, cardápio dinâmico (jantar e almoço de fim de semana, por categoria), página de reservas e um painel administrativo simples para editar o cardápio.

## Tecnologias

- **React 18** + **ReactDOM**, carregados via CDN (sem bundler/`npm install`)
- **Babel Standalone** para compilar o JSX no navegador (`<script type="text/babel" src="app.jsx">`)
- **Supabase** (Auth + Postgres) para login do admin e para o cardápio publicado (tabela `site_menus`, RLS ligado — leitura pública, escrita só autenticado). `menu.json` e o bloco `#menu-data` do `index.html` viram fallback caso o banco esteja fora do ar
- CSS puro, com fontes customizadas (DM Serif Display, Great Vibes, Pinyon Script, Oswald, Cormorant Garamond, Raleway)

## Estrutura

```
index.html            shell + tags <script> (React/Babel) + dados iniciais do cardápio (#menu-data)
app.jsx                Landing, Sobre, Cardápio, Reservas e painel Admin
menu.json              cardápio (menus, categorias, itens)
assets/                logos e imagens
PALETA-ALTERNATIVA-DOURADO.txt   nota de design (paleta de cores alternativa)
RECOMENDACOES.txt      decisões de conteúdo (ex.: por que o cardápio ainda não tem fotos)
SEGURANCA.txt          plano de migração do login do admin para Supabase Auth
```

## Como rodar localmente

```bash
npx serve .
```

Ou abra `index.html` diretamente no navegador.

## Segurança do painel Admin

O login usa **Supabase Auth** (e-mail + senha, verificado no servidor — a
senha nunca aparece no código do site). O cardápio fica numa tabela
(`site_menus`) protegida por Row Level Security: qualquer visitante lê,
só quem estiver logado grava. Detalhes e checklist de segurança em
`SEGURANCA.txt`.
