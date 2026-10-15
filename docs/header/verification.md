# Verificação do header editorial

Branch: `design/full-width-editorial-header`. Base: `a912157c50681a8d3e7b87a8dbff190aadb93da3`.

## Resultado

A pílula foi substituída por Header fixed de largura total, sem raio, sombra ou blur. O hero conserva a superfície transparente; as seções de conteúdo recebem o marrom existente. O header esconde ao descer e reaparece ao subir, por transform, sem animar altura. Foco de teclado mantém a navegação visível.

O MenuOverlay é um dialog nativo full-screen com tipografia Cormorant já instalada, links originais, stagger, CTA original e Instagram real. Inclui Escape, Fechar, clique no espaço externo ao conteúdo, trap de Tab/Shift+Tab, fundo inerte pela modalidade nativa e retorno do foco a Menu. O Lenis existente é pausado/restaurado durante a abertura; nenhum novo scroller, ticker, RAF, pin ou listener global próprio de scroll/resize foi criado.

A auditoria, a especificação e a tabela de riscos estão em [audit-and-spec.md](audit-and-spec.md).

## Paleta, stack e zona protegida

`node scripts/verify-header.mjs`: diferença da paleta **zero**, nenhum hex novo, 33 hashes protegidos preservados e nenhum arquivo protegido no diff desde a base. O `@theme` é idêntico ao snapshot; cores novas da UI são referências aos tokens existentes e alpha via color-mix. Pacotes, configuração, fontes e imagens permanecem iguais.

O escopo desta tarefa autoriza explicitamente trocar/remover Navbar e integrar Header em page.tsx. O guard histórico `verify-design-system.mjs` pertence à tarefa anterior, que congelava também esses dois arquivos; permanece como evidência histórica. O novo guard usa [baseline.json](baseline.json), sem liberar globals.css, MotionRoot, scroll.ts ou qualquer arquivo do 3D.

## Navegação, layout e acessibilidade

- Testados 360, 768, 1280 e 1920 × 900, com movimento normal e reduced motion: oito combinações, sem overflow horizontal ou erro JavaScript.
- Header com 88 px constantes, largura total, radius 0 e shadow none. Menus mobile mostram logo + Menu; CTA e links continuam acessíveis dentro do overlay.
- Modal aberto/fechado, Tab e Shift+Tab com wrap, Escape, Fechar e clique externo; foco volta a Menu. Wheel não move o documento enquanto aberto e volta a funcionar depois.
- Âncora Sobre termina em 88 px (arredondamento subpixel menor que 1 px no fallback nativo). O helper original de scroll é reutilizado.
- Scroll down/up verificado sem foco de teclado ativo: oculto ao descer, visível ao subir. Com foco visível, permanece acessível intencionalmente.
- Árvore de acessibilidade do Chrome expõe dialog com nome da marca e `modal: true`. `aria-expanded`, `aria-controls`, `aria-haspopup`, `aria-modal`, nome do dialog e labels de navegação constam da implementação. Não foi executado um leitor de tela físico; a validação usa teclado, árvore AX e Lighthouse.
- Viewport 360 × 600 e scrollbar de 15 px, com o flag de esconder scrollbars do Playwright desativado: canvas/viewport permanecem 345 × 600 antes, durante e após o modal; estilos e scroll são restaurados exatamente. A mudança de reduced motion durante a sessão também passou.
- Novas animações usam GSAP context e cleanup; apenas transform/opacity. Reduced motion usa duração zero e remove hover por deslocamento. Nenhum will-change persistente foi necessário.
- O foco novo usa cream-50, aumentando a visibilidade sobre o hero sem criar cor. O texto sobre brown-900 tem contraste 13,36:1; o mínimo amostrado sobre o hero nas quatro larguras foi 4,92:1, acima dos 4,5:1 para texto pequeno. Os pixels do hero são medidos separadamente em [contrast-after.json](contrast-after.json). São amostras dos atos, não uma garantia de cada frame intermediário em cada dispositivo.

Evidências: [browser-qa.json](browser-qa.json), [browser-extra.json](browser-extra.json), screenshots em `docs/header/screenshots/` e `node scripts/verify-header-browser.mjs`.

## 3D e scroll

[Antes](browser-before.json) e [depois](browser-after.json) registram benchmark, métricas, canvas, hero e quatro atos em Chrome headless no mesmo computador, DPR 1. O mobile é viewport emulada, não aparelho físico. FPS varia com a execução; a comparação avalia faixa de desempenho e comportamento, não igualdade numérica impossível entre amostras.

| Medição local | Antes | Depois |
| --- | ---: | ---: |
| Benchmark desktop (FPS) | 60,96 | 60,65 |
| Primeiro ato mobile (FPS) | 30,94 | 30,93 |
| CPU desktop / frame (ms) | 0,538 | 0,423 |
| GPU desktop / frame (ms) | 3,173 | 3,193 |

A geometria original do palco/canvas, pointer-events, tier e progressos foram mantidos. O palco normal continua com 3150 px e viewport de 900 px. Os marcos de scroll permanecem 563, 1035, 1665 e 2520 px; progressos 0,2502 / 0,4600 / 0,7400 / 1,0000. A integração Lenis → ScrollTrigger do MotionRoot segue intacta. Não foram introduzidos pins ou offsets nos cálculos do mundo.

O fallback adaptativo mobile no segundo ato continua sendo comportamento anterior; não foi alterado. Com reduced motion, continuam o hero estático e a ausência de canvas/Lenis já previstos pelo projeto.

O overlay cobre temporariamente o conteúdo por ser o menu modal solicitado, sem remontar, deslocar ou reduzir o canvas. A barra transparente não adiciona uma faixa opaca à cena.

## Build e Lighthouse

Passaram `npm run build -- --webpack`, `npm run lint` e `npm run typecheck`. O build usa a opção oficial webpack porque Turbopack requer uma porta interna indisponível neste sandbox.

Lighthouse 13.5.0 em produção local, perfis desktop/mobile, mesma máquina e flags, execuções sequenciais sem outros benchmarks concorrentes. Comparação detalhada: [lighthouse-comparison.json](lighthouse-comparison.json).

| Lighthouse | Performance antes → depois | Acessibilidade antes → depois | SEO antes → depois |
| --- | --- | --- | --- |
| Desktop | 99 → 100 | 100 → 100 | 100 → 100 |
| Mobile | 84 → 94 | 100 → 100 | 100 → 100 |

As notas são medições locais sujeitas a variação, não garantia de resultado em produção. CLS mobile: 0,03488 nesta amostra anterior e 0,03883 na final, valor já observado no hero original e aceito antes desta tarefa.

O header fixed não cria espaço no fluxo e o logo reserva dimensões. CLS desktop é zero. O CLS mobile do texto protegido do hero é preexistente e foi aceito pelo usuário; a proposta de corrigir globals.css permanece não aplicada. A auditoria experimental de nome visível do scroll cue do hero também é anterior e está fora do escopo protegido desta tarefa. Não se afirma conformidade absoluta de toda a página a partir de uma nota Lighthouse.

## Arquivos de implementação

- `src/components/Header.tsx`: navegação, direção/superfície por ScrollTrigger, ativo por IntersectionObserver e abertura do menu.
- `src/components/MenuOverlay.tsx`: modalidade, foco, scroll lock e animações.
- `src/components/Header.module.css`: escopo/altura/âncoras, grid do header, menu, underline e foco.
- `src/app/page.tsx`: importa Header e escopo de altura.
- `src/components/Navbar.tsx`: removido.
- `scripts/verify-header.mjs`, `scripts/verify-header-browser.mjs`: guards do novo escopo e evidências de browser.
- `docs/header/`: auditoria, snapshots, evidências, cenários e este relatório.

## Propositalmente não aplicado

- Cores, fontes comerciais, textos, logos, imagens, SVGs e código da referência: identidade e paleta originais preservadas.
- Locomotive Scroll, outro RAF/scroller e listeners próprios de scroll/resize: Lenis/GSAP/ScrollTrigger atuais atendem ao comportamento.
- Mudanças no mundo, câmera, shaders, loaders, render loop, container, MotionRoot, scroll.ts ou globals.css: zona protegida intacta.
- Header opaco sobre o hero, blur e sombra pesada: preserva leitura da cena e a estrutura clean solicitada. A superfície sólida aparece no conteúdo.
- Magnetic buttons, cursor customizado, parallax e transições de página: não fazem parte da troca do header e acrescentariam trabalho desnecessário.
- Idiomas adicionais, telefone/email inventados ou novos destinos/serviços: usados apenas dados existentes.
- Remoção das definições globais antigas de glass: estão em globals.css protegido; a Navbar e seu listener foram removidos e o novo Header não usa essas classes.
- Correção do CLS/fallback mobile e do scroll cue protegido: mantidos e documentados conforme decisão anterior.

## Reprodução

Com build de produção servido em `127.0.0.1:3000`, os cenários `.mjs` desta pasta usam Playwright externo ao projeto. Configure `PLAYWRIGHT_MODULE` com o caminho para `playwright/index.mjs` e `CHROME_PATH` se o Chrome não estiver no caminho macOS padrão. Nenhuma dependência foi adicionada. Os cenários geram JSON/screenshots em `/private/tmp`; copie as evidências correspondentes para esta pasta antes de executar o guard de browser. Execute os benchmarks e Lighthouse sequencialmente.

O inventário completo de alterações pode ser reproduzido com `git diff --name-status a912157..HEAD`; commits com `git log --reverse --oneline a912157..HEAD`.

## Commits

| Commit | Incremento |
| --- | --- |
| `7ca5c41` | Auditoria, especificação e snapshot antes da alteração |
| `2c28949` | Header estático de largura total |
| `94afebe` | ScrollTrigger existente, âncoras e integração na home |
| `d01345c` | Overlay modal, foco e pausa/restauração do Lenis |
| `0659f6f` | Micro-interações, ativo e reduced motion |
| `f834aa2` | Remoção da pílula antiga |
| `c5507dc` | Cleanup dos callbacks e tratamento de scrollbar |
| `d2333e6` | Contraste de foco e compensação de scrollbar sem duplicação |

O commit final de documentação/guards contém as evidências deste relatório; seu identificador está no git log da branch.
