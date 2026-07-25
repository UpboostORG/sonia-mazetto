# Sonia Mazetto — 1ª Gestora de Potencial Humano do Brasil

Site institucional em HTML, CSS e JavaScript puros — sem frameworks, sem build, pronto para hospedar em qualquer serviço estático (Netlify, Vercel, GitHub Pages, Hostinger etc.).

## Páginas

```
index.html          Página principal (hero, sobre, serviços, palestras, projetos, mídia, contato)
artigos.html        Hub de artigos (Sonia publica toda semana)
css/styles.css      Design tokens e estilos compartilhados
js/main.js          Header, menu móvel, revelação ao rolar
assets/             Logo, favicon e fotos renomeadas (originais do WhatsApp preservados na raiz)
```

## Identidade

Design clean: fundos claros, muito espaço em branco e fotos de estúdio em fundo claro.

| Token | Cor | Uso |
|---|---|---|
| `--ink` | `#16333e` | títulos e rodapé (azul-tinta da logo) |
| `--teal` | `#1e7c8e` | cor da marca — CTAs, destaques |
| `--teal-soft` | `#eaf3f5` | lavagens de fundo (hero, contato) |
| `--gold` | `#c9963f` | acento quente, usado com parcimônia |
| `--bg-soft` | `#f7fafb` | seções alternadas |

Tipografia: **Plus Jakarta Sans** (títulos) + **Figtree** (texto), via Google Fonts — suaves e limpas.

## Como adicionar um artigo novo (toda semana)

Em `artigos.html`, há um comentário `COMO ADICIONAR UM NOVO ARTIGO` acima da grade.
Copie um bloco `<a class="article-card">…</a>`, cole no início da grade e ajuste link, fonte, título e tema. Para trocar o destaque, edite o bloco `<a class="featured-article">`.

## Antes de publicar

1. **Domínio** — ajustar `<link rel="canonical">` e `og:image` (URL absoluta) nas duas páginas.
2. **WhatsApp** — o botão usa (65) 9982-6370 (wa.me/556599826370), extraído da conversa. Confirmar se é o número comercial desejado.
3. **Depoimentos** — não incluídos de propósito (nunca inventar). Adicionar quando houver depoimentos reais autorizados.

## Visualizar localmente

```bash
npx -y http-server -p 4519 -c-1 .
```
