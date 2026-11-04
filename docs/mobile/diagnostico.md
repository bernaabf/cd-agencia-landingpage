# Diagnóstico mobile — 03/11/2026

Base antes de alterações de código: Next 16.4.3 / React 19 / TS / Tailwind 4, GSAP (ScrollTrigger e SplitText), Lenis, Three + R3F. Home e metadados são estáticos; seções editoriais Server Components; interação isolada no header, hero e galeria.

Build de produção passou fora do sandbox (o primeiro Turbopack ficou bloqueado pelo ambiente e foi encerrado). Next 16 não imprime JS por rota; valores exatos dos scripts do HTML e chunks, gzip e inventário de imagens estão em before-bundles.json. Home: 771222 bytes minificados inicialmente. Maior chunk adiado: 908940 bytes (Three/WebGL). Tamanho instalado não equivale a bundle: Three 37 MB, R3F 2.4 MB, GSAP 6.3 MB, Lenis 504 KB, Lucide 45 MB; imports de ícones são nomeados e tree-shaken.

## Crítica independente

Method: dual-agent (A: critique_design · B: critique_detector). Heurísticas: 24/32; eficiência avançada e documentação n/a. Snapshot em .impeccable/critique/. Detector: 37 advisory (29 font-size, 5 color, 3 radius); divergências documentais, sem justificativa para mudança de marca. Identidade alpina autoral e hierarquia editorial fortes. Galeria e serviços já têm bons caminhos de navegação.

Problemas por impacto, registrados antes de corrigir:
1. P1: Lenis/ticker em mobile e revelações com custo desktop (SplitText, clip-path, zoom longo).
2. P1: abertura 720svh, contato só após metade do percurso ou no menu mobile.
3. P1: viewportFit e env(safe-area-inset-*) ausentes.
4. P2: will-change permanente e blur de 12px sobre WebGL.
5. P2: retrato do quarto ato eager; lightbox aquece duas fotos 1600px mesmo em saveData.
6. P2: Menu sem largura 44px; pular sem altura mínima; hover sem guarda em links/filtros.
7. P2: sem refresh explícito após fontes/imagens.
8. P3: svh/dvh já presentes, faltam fallbacks vh.

Já implementado e a preservar: dynamic ssr:false do 3D, worker de terreno, IO e visibilitychange, loop demand, DPR low 1.25 e 80 segmentos sem nuvens/fog volumétrico, fallback de WebGL/reduced-motion/saveData/aparelho fraco, fontes locais latin/swap, fotos AVIF/WebP responsivas, diálogo com foco/Escape/trava de overflow. Não existem inputs. Não existe WhatsApp flutuante atualmente. Número depende de NEXT_PUBLIC_WHATSAPP_NUMBER: não fabricar.

Browser host indisponível na inspeção; capturas históricas confrontadas com fontes são referência, não prova atual. Menu antigo e preview de serviços com cards foram descartados como desatualizados.

## Plano animate

Foco: conservar viagem alpina e todos os atos, reduzindo duração do percurso e scrub mobile. Continuidade: manter revelações de scroll em transform/opacity, sem máscaras nem split mobile. Feedback: toque/foco com caixas de 44px. Orçamento: scroll nativo touch, sem ticker Lenis; blur mobile menor, sem will-change permanente; WebGL demand já existente, respeitando aba oculta e área visível.

## Baseline Lighthouse 13.6.0

CLI com Chrome local, produção localhost. Mobile: Performance 91, acessibilidade 100; LCP 1085.84 ms; CLS 0.024995; TBT 352.5 ms. Desktop: 100/100; LCP 308.69 ms; CLS 0; TBT 3 ms. Rede mobile simulada: RTT 150 ms, throughput 1638.4 Kbps, CPU 4x. Auditorias executadas em paralelo; resultados são laboratório e variam com carga/cache. INP não é fornecido pelo teste de navegação, requer interações/dados de campo. Não inferir INP a partir de TBT.

Init: PRODUCT.md existente confirmado pelo usuário, sem fatos novos a registrar. Primeira crítica para src-app-page-tsx: 24/32, sem tendência anterior. Snapshot persistido; temp removido. A/B independentes, ignore list ausente; detector executado; host de browser indisponível, overlay/live-server não iniciados. Lighthouse CLI disponível posteriormente, sem overlay.
