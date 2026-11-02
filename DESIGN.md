---
name: Carolina Décaillet
description: Sistema visual existente para curadoria de experiências na Suíça.
colors:
  brown-950: "#2a1815"
  brown-900: "#3d2521"
  brown-800: "#4b2d27"
  brown-700: "#5b3425"
  cream-50: "#fbf8f4"
  cream-100: "#f4eee7"
  cream-200: "#e6dbd0"
  sand-400: "#c8b4a0"
  sand-500: "#a8917b"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: "0.015em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.8
  action:
    fontFamily: "Manrope, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.12em"
rounded:
  photograph: "24px"
  gallery: "2px"
  action: "9999px"
spacing:
  small: "16px"
  medium: "24px"
  large: "32px"
components:
  button-light:
    backgroundColor: "{colors.cream-100}"
    textColor: "{colors.brown-900}"
    rounded: "{rounded.action}"
  button-dark:
    backgroundColor: "{colors.brown-700}"
    textColor: "{colors.cream-50}"
    rounded: "{rounded.action}"
---

## Overview

Identidade existente preservada: tons quentes, contraste entre serifas editoriais e interface sem serifa, fotografias reais e abertura alpina imersiva. O refinamento melhora a leitura e a navegação sem substituir essa linguagem. A fonte normativa dos tokens implementados é `src/app/globals.css`; as fontes locais são configuradas em `src/app/layout.tsx`.

## Colors

Marrom profundo sustenta a página; creme destaca a seção sobre a profissional e as ações. Areia diferencia texto secundário e linhas divisórias. Os tokens acima reproduzem as cores existentes, sem novas cores de marca. Transparências e misturas usam esses mesmos tokens.

**Regra do contraste.** Texto pequeno requer contraste mínimo de 4,5:1; títulos grandes, 3:1. Indicadores de foco devem contrastar com a superfície atual. Não reduzir opacidade apenas para aparentar sofisticação.

## Typography

Cormorant Garamond identifica títulos, nomes e legendas. Manrope sustenta parágrafos, navegação e controles. Preservar famílias e arquivos locais; não importar novas fontes.

Nos blocos editoriais, títulos usam escala fluida entre 2,2 e 4,6 rem; títulos de serviço, entre 1,9 e 2,8 rem. Manter os títulos em maiúsculas conforme a identidade existente, com espaçamento moderado e quebras balanceadas. Textos têm entrelinha generosa e largura limitada, sem justificar ou comprimir para caber.

## Layout

Contêiner principal de 1280 px com margens internas fluidas. Serviços usam linhas abertas: título à esquerda e descrição com ação à direita a partir de 768 px. Abaixo disso, cada serviço forma uma sequência vertical de título, descrição e ação.

Galeria usa duas colunas a partir de 640 px e uma abaixo disso. Fotografias preservam proporções reservadas e legendas ficam no fluxo abaixo da imagem. Filtros podem quebrar em linhas sem ocultar opções; a contagem de resultados permanece visível.

**Regra da proximidade.** A ação pertence à descrição que explica seu propósito. Separar serviços por espaço e linha, sem envelopar cada item em um card.

## Elevation & Depth

Usar superfícies e hierarquia tipográfica para distinguir conteúdo. Os serviços e pilares não precisam de sombras, vidro ou elevação no hover. A profundidade da abertura 3D permanece sob responsabilidade de seus componentes existentes.

## Shapes

Fotografias institucionais mantêm o arredondamento original; fotos da galeria usam cantos discretos. Pílulas ficam reservadas aos controles e ações. A composição de serviços é aberta, sem cantos ou caixas decorativas.

## Components

- `Button`: variantes clara e escura, estados de hover, foco e pressão; tamanho pequeno com mínimo de 44 px e padrão com mínimo de 48 px. Texto pode quebrar sem cortar a ação.
- Serviços: título, descrição original e mensagem de WhatsApp específica; não numerar ofertas que não formam uma sequência.
- Galeria: imagem ampliável, legenda persistente, filtro com `aria-pressed` e contagem com `role="status"`.
- Lightbox: diálogo nativo, fechar por Escape, navegar por setas e devolver foco ao cartão de origem.
- Navegação: mesmas seções no cabeçalho, menu e rodapé, incluindo Paisagens.
- Contato: CTA principal visível antes da fotografia; links sociais com ícone e nome textual.

**Regra do movimento.** Preservar a abertura autoral e o suporte à redução de movimento. Nas áreas editoriais, reutilizar o comportamento existente e evitar animações de elevação em conteúdo que não é clicável.

## Do's and Don'ts

- Preservar marca, conteúdo factual, imagens, cores e famílias tipográficas.
- Usar fotos reais, legendas legíveis, hierarquia clara e espaços consistentes.
- Validar teclado, foco, diálogo, contraste e telas pequenas.
- Não inventar métricas, preços, avaliações, depoimentos ou números de contato.
- Não transformar este site institucional em um dashboard por associação com referências SaaS.
- Não adicionar gradientes, cards ou efeitos de vidro para preencher espaço.
