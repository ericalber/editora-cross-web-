# Hotfix Hero / Notícias / Logo — Checklist

## Critérios
- [x] A) Cards “Notícias em Destaque” – texto superior centralizado, pill preservada, corpo alinhado à esquerda.
- [x] B) Coluna “Últimas notícias” – cabeçalho sem sobreposição, foco visível, rolagem suave.
- [x] C) Logo – logo visível, centralizada, sem artefatos, espaçamento com o hero mantido.

## Seletores / Componentes Ajustados
- `components/NewsGrid.tsx` (mapeamento de tags `educacao`→`Educação`, `lancamentos`→`Lançamentos`)
- `components/NewsTicker.tsx`
- `components/Navbar.tsx`
- `app/globals.css`
- `style/logo-fix.css`
- `public/logo-cross.svg`
  - seletor `.news-card-media`, `.news-card-pill`, `.news-card-title`, `.news-card-excerpt`, `.news-ticker-*`
