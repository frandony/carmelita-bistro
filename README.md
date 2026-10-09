# Carmelita Restaurante & Bistrô

Site institucional do Carmelita Bistrô (Praia da Costa, Vila Velha/ES): landing page, cardápio dinâmico (jantar e almoço de fim de semana, por categoria), página de reservas e um painel administrativo simples para editar o cardápio.

## Tecnologias

- **React 18** + **ReactDOM**, carregados via CDN (sem bundler/`npm install`)
- JSX pré-compilado: o código-fonte é o `app.jsx`, mas o site carrega o `app.js`. **Depois de editar o `app.jsx`, rode `compilar.cmd`** (usa `npx esbuild`, precisa de Node) e faça commit dos dois arquivos
- **Supabase** (Auth + Postgres) para login do admin e para o cardápio publicado (tabela `site_menus`, RLS ligado — leitura pública, escrita só autenticado). `menu.json` e o bloco `#menu-data` do `index.html` viram fallback caso o banco esteja fora do ar
- CSS puro, com fontes customizadas (DM Serif Display, Great Vibes, Pinyon Script, Oswald, Cormorant Garamond, Raleway)

## Estrutura

```
index.html            shell + tags <script> (React) + dados iniciais do cardápio (#menu-data)
app.jsx                Landing, Sobre, Cardápio, Reservas e painel Admin (código-fonte)
app.js                 app.jsx compilado — gerado pelo compilar.cmd, não editar à mão
compilar.cmd           recompila app.jsx -> app.js
menu.json              cardápio (menus, categorias, itens)
assets/                logos e imagens
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
só quem estiver logado grava. O cadastro público de usuários fica
desligado no Supabase — contas de admin são criadas só pelo painel.

Regras: a chave `anon` pode ficar no site (é pública por natureza); a
`service_role` e qualquer senha **nunca** entram no código nem no git.
Anotações internas ficam na pasta `notas-internas/`, que é ignorada pelo
git e não vai para o site.
