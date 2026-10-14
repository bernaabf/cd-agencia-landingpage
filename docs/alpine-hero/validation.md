# Hero — relevo alpino procedural

Validação local em 11/10/2026, com build de produção Next.js e Chrome headless via Playwright no macOS.

O retrato, texto, CTA e navegação existentes permanecem na mesma composição. O fundo acrescenta um terreno abstrato em isolinhas, uma rota progressiva e câmera com deriva/parallax discreto. Não há dados ou nomes geográficos reais.

## Implementação

- `AlpineBackground.tsx`: fronteira cliente leve, `next/dynamic` com `ssr: false`, espera pela imagem decodificada/fontes/entrada do Hero, detecção de capacidade, IntersectionObserver, Page Visibility e boundary de erro.
- `AlpineTerrain.tsx`: React Three Fiber, uma malha de terreno, rota Catmull-Rom projetada sobre a mesma triangulação e ponto final; GSAP/ScrollTrigger dentro de `matchMedia`, compartilhando a integração Lenis existente.
- `terrain.ts` e `shaders/terrain.ts`: cinco oitavas de ruído fBm com cristas; isolinhas antialiasadas por altura, superfície quase transparente, fog e bordas suaves. Cores vêm dos tokens CSS `@theme` via `readTerrainPalette()`.
- `motion.ts`: durações, easing e parâmetros de movimento centralizados. `Hero.tsx` recebe apenas o componente de fundo; CSS acrescenta máscara/vinheta. `MotionRoot.tsx` e `scroll.ts` não precisaram mudar.

A malha usa 160 × 160 segmentos no desktop e 96 × 96 no tablet. DPR limitado a `[1, 1.5]` em ambos. O loop é `demand`, com invalidação somente enquanto o Hero está visível e a aba ativa. Geometrias e materiais são descartados explicitamente; Fiber possui e descarta o renderer/contexto.

Abaixo de 768 px o canvas não é montado: a contribuição visual de um fundo atrás de texto/retrato não justifica seu custo em bateria e processamento. O mesmo fallback vale para movimento reduzido, economia de dados, até quatro núcleos lógicos, memória informada de até 4 GB, falha de WebGL2 ou do renderer. O gradiente original permanece disponível desde o HTML inicial.

Three e seus tipos estão fixados em r182: Fiber 9.8.1 ainda instancia `Clock`, depreciado nas versões seguintes do Three. Isso evita um aviso novo no console. Referência: [guia oficial de migração, r182 → r183](https://github.com/mrdoob/three.js/wiki/Migration-Guide#182--183).

## Critérios de aceite

| Critério | Resultado e evidência |
| --- | --- |
| Lint, tipos e build | `npm run lint`, `npx tsc --noEmit` e `npm run build`: sucesso, sem novos erros/avisos. |
| Console e overflow | Zero erros/avisos nos sete cenários de browser; sem overflow em 390, 820 e 1440 px. |
| LCP | Medianas abaixo; diferença absoluta de 16–32 ms. Nenhum canvas foi candidato a LCP. |
| Movimento reduzido | Canvas e contextos WebGL ausentes desde a carga inicial em desktop/mobile; Hero e CTA completos. |
| WebGL desativado | Chrome iniciado com `--disable-webgl`: fallback, zero canvas/contextos, CTA visível, zero erros/avisos. |
| Falha durante execução | Perda real de contexto e exceção injetada em `drawElements`: fallback, zero contextos vivos, CTA visível, zero erros/avisos. |
| Contraste AA | Axe-core: zero violações A/AA no Hero em todos os cenários. Amostragem adicional do fundo renderizado: título ≥ 5,40:1; parágrafo ≥ 5,85:1; eyebrow ≥ 6,44:1. |
| Limpeza | Três ciclos de desmontagem/remontagem: zero contextos vivos, triggers do terreno, listeners de ponteiro do Hero ou listeners de perda de contexto após cada desmontagem. Navegação interna desmontando o Hero: mesmos resultados e zero listeners de visibilidade. |
| Pausa | Zero chamadas de desenho após sair da viewport. Zero chamadas após simular `document.hidden` e disparar `visibilitychange`. |
| Rota | Quantidade de pontos desenhados progrediu monotonicamente de 1 a 641. |
| Desempenho desktop/tablet | 60,2 fps em 1440 px e 59,9 fps em 820 px, contando desenhos da malha durante três segundos; testes locais sem limitação de CPU. |
| Mobile físico | **Não verificado em aparelho físico.** Em 390 px o fundo é estático e o canvas não existe. Emulação não comprova fluidez/bateria de um celular real. |
| Capturas | Desktop com 3D/fallback, tablet com 3D e mobile normal/reduzido, abaixo. |

A verificação de limpeza encontrou um IntersectionObserver compartilhado do framework, sem alvos observados, após a navegação. Nenhum alvo ou listener do Hero permaneceu. A liberação de contexto confirma o descarte de recursos GPU; não foi feito um perfil prolongado de heap/VRAM em dispositivos físicos.

O contraste adicional foi calculado sobre o pixel de maior luminância de cada região de texto, com os textos temporariamente invisíveis e o terreno pausado. É uma captura conservadora daquele estado, complementar ao axe, não uma medição contínua de todos os frames.

## LCP antes/depois

Cinco navegações por largura, em contextos novos de navegador, CPU limitada a 4×, imagens do servidor previamente aquecidas, DPR 1 e sem limitação de rede. Viewports: 1440 × 1000, 820 × 1000 e 390 × 844. São medidas de laboratório local, não dados de campo.

| Largura | Antes, mediana | Depois, mediana | Diferença |
| --- | ---: | ---: | ---: |
| 1440 px | 384 ms | 412 ms | +28 ms |
| 820 px | 1.944 ms | 1.960 ms | +16 ms |
| 390 px | 1.920 ms | 1.952 ms | +32 ms |

O retrato foi LCP na maioria das amostras; o parágrafo foi LCP em algumas amostras mobile. Na primeira amostra desktop, o chunk 3D começou a ser solicitado em 2.992 ms, após o LCP em 392 ms. Mobile não solicita esse chunk. A inicialização também espera 2,6 segundos desde a montagem da fronteira cliente, a decodificação da imagem prioritária e as fontes.

## Evidências

- [Resultados de browser/axe/fps](browser-results.json)
- [LCP antes](lcp-before.json) e [depois](lcp-after.json)
- [Ciclos de vida e navegação](lifecycle-results.json)
- [WebGL desativado, perda de contexto e erro de renderização](fallback-results.json)
- [Fundo usado na amostragem de contraste](contrast-background.png)

| Cenário | Captura completa do Hero |
| --- | --- |
| Desktop, 3D ativo | [1440 px](desktop-3d.png) |
| Desktop, movimento reduzido/fallback | [1440 px](desktop-fallback.png) |
| Tablet, 3D ativo | [820 px](tablet-3d.png) |
| Mobile, movimento normal/fallback | [390 px](mobile-fallback.png) |
| Mobile, movimento reduzido/fallback | [390 px](mobile-reduced.png) |
| Referência anterior | [Desktop](before-desktop.png), [mobile](before-mobile.png) |

Mobile usa fallback em ambos os modos por decisão de desempenho; não há captura de 3D forçado abaixo do breakpoint.
