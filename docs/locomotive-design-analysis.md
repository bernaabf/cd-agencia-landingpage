# Inspiração estrutural — Locomotive → Carolina Décaillet

Auditoria em 14/10/2026. Referência: [home do Locomotive](https://locomotive.ca/en).
Nenhuma cor da referência foi coletada para este relatório. Não foram importados textos, fontes, imagens, marcas, SVGs ou código-fonte. As medidas abaixo descrevem o comportamento observado, sem presumir a implementação interna.

## 1. Auditoria do projeto, antes de editar

- Next.js 16.4, React 19, TypeScript 6, Tailwind 4 via `@tailwindcss/postcss`. Não existe `tailwind.config`: o tema está no bloco `@theme` de `src/app/globals.css`.
- `src/app`: layout, home, CSS global, metadata, imagens sociais, robots e sitemap.
- `src/components`: navegação, Button, MediaFrame, MotionRoot e quatro seções em `sections/`.
- `src/components/world` e `src/lib/world`: mundo procedural, câmera, atmosfera, rota, terreno, worker, shaders, qualidade e telemetria.
- `src/fonts`: Cormorant Garamond local (300, 400, 500 e italic 300) e Manrope variável local (200–800). Fontes carregadas por `next/font/local`, com `display: swap`.
- `public/images`: fotografias e símbolo originais. Nenhum asset novo é necessário.
- Home: Navbar → hero imersivo de quatro atos → Sobre → Serviços → fotografia de rota → Contato/rodapé.
- Layout original: conteúdo até 1280 px, margens 20/32 px; Sobre assimétrico em 12 colunas; três fotos com proporções reservadas; três cards de serviços; fechamento centralizado.
- Glassmorphism, foco global, redução de movimento, imagens com `sizes` e espaço reservado já existem.

### Paleta congelada

Snapshot completo, HSL, literais e hashes: [palette-before.json](design-system/palette-before.json).

| Token | Hex original | HSL original (H S L) |
| --- | --- | --- |
| brown-950 | `#2a1815` | 8.571 33.333% 12.353% |
| brown-900 | `#3d2521` | 8.571 29.787% 18.431% |
| brown-800 | `#4b2d27` | 10.000 31.579% 22.353% |
| brown-700 | `#5b3425` | 16.667 42.188% 25.098% |
| cream-50 | `#fbf8f4` | 34.286 46.667% 97.059% |
| cream-100 | `#f4eee7` | 32.308 37.143% 93.137% |
| cream-200 | `#e6dbd0` | 30.000 30.556% 85.882% |
| sand-400 | `#c8b4a0` | 30.000 26.667% 70.588% |
| sand-500 | `#a8917b` | 29.333 20.548% 57.059% |

Também foram congelados os valores rgba, os hex com alpha e as classes de cor já existentes. Há branco, preto e sombras literais anteriores à tarefa. Corrigi-los mudaria a aparência, contrariando a regra de diferença zero; foram preservados.

### ZONA PROTEGIDA — nenhum destes arquivos pode mudar

Lista integral, acompanhada de SHA-256 no snapshot:

```text
src/components/world/AlpineWorld.tsx
src/components/world/AlpineWorldLoader.tsx
src/components/world/Atmosphere.tsx
src/components/world/CameraRig.tsx
src/components/world/DepthLayers.tsx
src/components/world/HeroStage.tsx
src/components/world/Route.tsx
src/components/world/Terrain.tsx
src/lib/world/journey.ts
src/lib/world/performance.ts
src/lib/world/progress.ts
src/lib/world/quality.ts
src/lib/world/shaders/terrain.glsl.ts
src/lib/world/terrain.ts
src/lib/world/terrain.worker.ts
src/lib/world/tokens.ts
src/components/MotionRoot.tsx
src/lib/motion.ts
src/lib/scroll.ts
src/components/Navbar.tsx
src/components/MediaFrame.tsx
src/components/Button.tsx
src/components/sections/Hero.tsx
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/lib/site.ts
```

Proteção ampliada aos componentes compartilhados com o hero, às regras globais do canvas e ao conteúdo da marca. Configurações, dependências, assets e fontes também não são alterados.

`MotionRoot` é o proprietário de Lenis (`lerp: 0.09`), de `lenis.on('scroll', ScrollTrigger.update)` e do callback `lenis.raf(time * 1000)` no ticker GSAP. `HeroStage` possui a timeline `hero-stage`, sticky nativo e `scrub: 0.8`. Sua distância depende somente da altura de `#inicio` e da viewport do próprio palco. O mundo lê esse progresso, sem depender da geometria de Sobre/Serviços/Contato. Atributos `data-world-*` das seções são preservados.

### Baseline

[browser-before.json](design-system/browser-before.json) contém desktop 1440 × 900 e mobile 390 × 900, telemetria original do canvas, avanço pelos quatro atos e reduced motion. O teste não introduz RAF nem listeners na aplicação.

- Desktop: benchmark 59.05 FPS; janelas dos atos 50.23, 59.99, 49.23 e 59.98 FPS, tier high, DPR adaptado para 1.
- Mobile: primeira janela 31.20 FPS, tier low, DPR 1; fallback adaptativo já acionado no segundo ato. Sem erro JavaScript. Isso precede qualquer alteração.
- Progresso nos atos: aproximadamente 0.25 → 0.46 → 0.74 → 1.00, sincronizado com o indicador editorial.
- Hero 3150 px, viewport 900 px nos dois tamanhos; canvas ocupa exatamente a viewport, `pointer-events: none`.
- Reduced motion: nenhum canvas nem Lenis; conteúdo em fluxo normal, sem overflow horizontal.
- Lighthouse inicial: desktop Performance 83, Acessibilidade 100, SEO 100; mobile 56, 100, 100. CLS 0 no mobile. São medições locais de Chromium, não dados de campo de um celular real.

## 2. Design system da referência

### Método e limites

Site aberto no Chrome e inspecionado com DevTools/`getComputedStyle`, scroll e menu. Viewports da inspeção nativa: desktop 1201 px e mobile 390 × 844. Uma sessão isolada complementou a inspeção em 1440 × 900 e 390 × 900, incluindo hover, menu e emulação de reduced motion; [medidas sem cores](design-system/reference-computed.json). Valores de CSS calculado são separados de inferências; `transition-duration: 0s` não significa ausência de animação JavaScript.

Não se atribuem números exatos a lerp, magnetic force, stagger, delays ou timelines JavaScript que não foram mensurados. Ausência de evidência não é evidência de suporte a acessibilidade.

### Tipografia

| Papel observado | Desktop 1201 px | Mobile 390 px | Princípio transferível |
| --- | --- | --- | --- |
| Título principal e títulos grandes | 70 px / 77 px | 36 px / 39.6 px | Escala marcante, entrelinha aproximadamente 1.1 |
| Navegação e rótulos editoriais | 26 px / 31.2 px | 18 px / 21.6 px | Hierarquia de metadados consistente, entrelinha 1.2 |
| Base | 15 px / 19.5 px | 15 px / 19.5 px | Texto auxiliar separado do display |
| Linhas de projetos | 110 px / 110 px em 1440 px | 40 px / 40 px | Lista pode ser um componente editorial, com entrelinha compacta |
| Links do menu overlay | — | 46.8 px / 65.52 px | Navegação móvel grande, com espaço generoso |

Peso observado 400 e letter-spacing normal nos elementos medidos. A referência usa predominantemente caixa mista, sem impor uppercase global. Há contraste entre display expressivo e metadados menores. Não foi utilizada sua família tipográfica. A adaptação conserva as fontes e a caixa-alta da marca atual.

Os tamanhos mudam por viewport; 46.8 px em 390 px equivale a 12vw, mas a fórmula original não é presumida. A busca por `font-size: clamp()` nas folhas acessíveis não encontrou ocorrências: não se afirma que o site inteiro não usa clamp. A adaptação usa clamps próprios, com limites legíveis em mobile e desktop.

### Grid, espaçamento e estrutura

- Desktop: 12 colunas; gutter 20 px; margens externas 40 px. Conteúdo ocupa a largura disponível; não foi comprovado um max-width universal.
- Mobile: quatro colunas de 80 px em 390 px, gutter horizontal 10 px, vertical 20 px, margens 20 px.
- Escala observada: 10, 20, 30 e 40 px para detalhes; espaços grandes de cerca de 125 px em 1201 px; 80 px em mobile; afastamento do rodapé de 160 px no desktop observado.
- O espaço negativo estabelece hierarquia. Listas grandes, divisórias e títulos carregam a composição sem depender de muitos cards decorativos.
- Sequência: abertura de marca/mídia → resumo de identidade → lista de projetos → texto editorial sobre a agência → extras em listas → produtos → rodapé em colunas. Não se transfere essa sequência de conteúdo para a marca de turismo.
- No desktop 1201 px, os blocos medidos no container foram aproximadamente 796, 31, 804, 1025, 1676 e 264 px. Proporções dependem do conteúdo e viewport; não são alturas para copiar.
- Há composição assimétrica: display amplo, metadados menores, mídia e textos distribuídos no grid. O rodapé funciona como parte da composição editorial.
- Não foi confirmado um marquee contínuo na home inspecionada. Não se inventa um nem se duplica o copy da marca.

### Navegação e interação

Header fixed com altura observada de 60 px no desktop; navegação textual distribuída horizontalmente. Nos trechos de scroll observados, permaneceu disponível. Não foi comprovado um algoritmo de ocultar/mostrar por direção.

No mobile, um botão abre overlay com links display e metadados no final. O botão expõe `aria-expanded` e `aria-controls`. A inspeção confirmou abertura e fechamento. O menu da Carolina já possui fechamento por Escape, contenção de Tab, retorno de foco e stop/start do Lenis; uma substituição exigiria aprovação por interferir nesse contrato.

Listas editoriais apresentam linhas de grande escala e links dedicados. Hovers e elementos visuais de cursor participam da experiência desktop; a implementação e o custo por frame não foram copiados. Não foi comprovado magnetic button. Links e estados de teclado devem permanecer compreensíveis sem cursor customizado.

### Movimento

- Header: `0.2s`, `cubic-bezier(0.215, 0.61, 0.355, 1)` em CSS calculado. Transferir a ideia de resposta rápida com desaceleração; conservar `--ease-premium` da Carolina.
- Hover de mídia da lista no desktop: animação observada de 450 ms, `cubic-bezier(0.23, 1, 0.32, 1)`, delay zero. Não se transporta a mídia flutuante; o projeto já responde ao hover em 500 ms com seu próprio easing.
- Dois efeitos repetidos sobre títulos da lista declararam 2000 ms e `linear`. Não se confunde esse dado com prova de marquee, nem se aplica um loop de texto ao projeto.
- Menu e links principais medidos: CSS calculado `0s`. A transição visual pode ser conduzida por JavaScript; sua duração/ease não foi inferida desse valor.
- Há entrada de conteúdo e deslocamento visual durante a navegação; não foi quantificado o tipo de split (linha/palavra/caractere), stagger ou lerp interno.
- Suavidade de scroll e mídia com movimento são observáveis, mas não comprovam a biblioteca ou a versão utilizada. Locomotive Scroll é apenas uma alternativa avaliada; Lenis já atende ao projeto e não será substituído nem complementado.
- Transições entre páginas, parallax exato, trajetória de cursor e magnetic buttons não têm valores verificáveis nesta amostra. Ficam fora da implementação.
- Reveals por linha, batching, easing expo/power e parallax já existem no projeto. São preservados integralmente; não há motivo para criar outro sistema de animação.

### Componentes, performance e acessibilidade

Botões/links: hierarquia textual clara, amplo espaço clicável e feedback visual. Lista de projetos: tipografia dominante e separação entre linhas. Rodapé: colunas de navegação, contato e links externos. Existe formulário de newsletter, mas não há equivalente autorizado no projeto; não será acrescentado.

Na amostra de mídia, vídeo declarou `preload=metadata` e não autoplay; imagens medidas declararam `loading=auto`. Esses atributos não comprovam toda a estratégia de carregamento. A Carolina conserva `next/image`, `sizes`, proporções reservadas e a política de carregamento atual.

O menu tem atributos ARIA, e títulos de projetos estão disponíveis à leitura assistiva. Uma sondagem de foco programático retornou `outline: none` e não acionou `:focus-visible`; isso não valida o comportamento por Tab. Não se toma a referência como prova de WCAG AA. A adaptação conserva o foco visível da marca e verifica teclado/reduced motion independentemente.

O suporte completo da referência a `prefers-reduced-motion` e a estabilidade de foco em todas as rotas não foram certificados. Não se transportam eventuais limitações. Não são adicionados efeitos de cursor, scrollers, listeners globais ou carregamentos de mídia ao projeto.

Na emulação `reduce`, o header da referência continuou declarando transição de 0.2s nas duas larguras medidas. Isso descreve somente esse estilo calculado; não certifica a interrupção de todas as animações JavaScript. No projeto, a política de reduced motion é testada independentemente.

## 3. Tradução e escopo

Ver [tabela de mapeamento e riscos](locomotive-pattern-mapping.md). Tokens novos serão CSS variables locais em um CSS Module, herdadas somente por Sobre, Serviços e Contato. Não serão colocados em `:root` nem no stylesheet protegido. Esta escolha evita modificar o hero ou os consumidores de cores do mundo.

A implementação mantém copy, contatos, CTAs, fotografias e ordem das seções; aproxima a hierarquia tipográfica, o alinhamento do grid e a leitura editorial dos serviços.

## 4. Não aplicado deliberadamente

- Paleta, fontes, assets, textos, SVGs e código da referência: identidade original preservada.
- Hero, câmera, shaders, canvas, container e controles 3D: zona protegida.
- Novo smooth scroll, Locomotive Scroll, novo RAF, ticker ou scroller: Lenis/GSAP existentes preservados.
- Header com hide/show e substituição do menu: risco médio por compartilharem scroll e foco com o hero; dependem de aprovação.
- Cursor customizado, magnetic buttons e previews que acompanham ponteiro: custo contínuo sem necessidade na experiência de turismo; não implementados.
- Novo pin/parallax de grande mídia ou alteração dos reveals globais: risco para scroll/3D; não implementados.
- Marquee, newsletter, catálogo, preços, destinos, avaliações e pacotes: não há conteúdo autorizado equivalente.
- Recoloração de classes antigas white/black: quebraria diferença zero da paleta existente.
- Bibliotecas adicionais e implantação: não fazem parte desta alteração local.

## 5. Evidências finais

Ver [relatório de verificação](locomotive-verification.md), incluindo comandos, limites de medição, lista de commits e arquivos alterados.

O critério de CLS global zero permanece pendente: a rodada mobile final e três controles com o código original reproduziram o mesmo deslocamento no texto do hero, em arquivo protegido. Nenhuma correção desse trecho foi aplicada. Uma proposta isolada está anexada ao relatório para decisão conforme a regra 5.
