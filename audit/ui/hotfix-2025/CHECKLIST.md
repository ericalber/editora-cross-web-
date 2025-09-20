# Hotfix 2025 — Checklist

## Critérios
- [x] A) Logo exibe “Desde 2025” mantendo centralização aprovada.
- [x] B) “Últimas notícias” ocupa altura cheia, cabeçalho fixo sem sobreposição e auto-rolagem preservada com pausa.
- [x] C) Texto do topo colorido nos cards (destaques + inferiores) centralizado e visível, corpo alinhado à esquerda.
- [x] D) Hero com três slides distintos, sem sobreposição de texto e CTAs alternando corretamente.

## Seletores / Componentes Ajustados
- `public/logo-cross.svg`
- `components/NewsGrid.tsx`
- `components/NewsTicker.tsx`
- `components/HeroSlider.tsx` (verificação de camadas)
- `app/globals.css` (`.news-card-*`, `.news-ticker-*`)

## Observações
- Capturas reais não foram geradas no sandbox; placeholders informativos disponíveis nesta pasta.
