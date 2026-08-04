# Carmelita Restaurante & Bistrô

Site institucional do Carmelita Bistrô (Praia da Costa, Vila Velha/ES): landing page, cardápio dinâmico (jantar e almoço de fim de semana, por categoria), página de reservas e um painel administrativo simples para editar o cardápio.

## Tecnologias

- **React 18** + **ReactDOM**, carregados via CDN (sem bundler/`npm install`)
- **Babel Standalone** para compilar o JSX no navegador (`<script type="text/babel" src="app.jsx">`)
- Dados do cardápio em `menu.json` (carregado em runtime; ver `loadMenusData()` em `app.jsx`)
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

## ⚠️ Segurança do painel Admin

O login do painel administrativo hoje usa uma senha fixa no código-fonte
(`ADMIN_PASS` em `app.jsx`), visível para qualquer pessoa que inspecione o
site. O arquivo `SEGURANCA.txt` já documenta o problema e o plano de migração
para Supabase Auth — vale priorizar essa migração antes de divulgar o painel
em produção.
