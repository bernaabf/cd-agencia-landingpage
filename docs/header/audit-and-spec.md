# Header editorial — auditoria e especificação

Base: `a912157c50681a8d3e7b87a8dbff190aadb93da3`. Branch: `design/full-width-editorial-header`.
Referência estrutural: [Locomotive](https://locomotive.ca/en), sem transportar cores, fontes, conteúdo, SVGs ou código.

## Auditoria antes de editar

`src/components/Navbar.tsx` é um Client Component sem props. Estados: `scrolled` após 24 px, `open` no mobile e `active` por IntersectionObserver. Refs: botão e painel móvel. Links: Início, Sobre, Serviços e Contato, vindos de `navLinks`. CTA e mensagem: `site.contactCta`, `generalMessage`, `whatsappLink`; Instagram também já existe em `site`.

Pílula: header fixed, `z-50`, margens laterais 16 px, padding superior 12/16 px; nav com largura máxima 1024 px, `rounded-full` e `glass-dark`. O glass aplica fundo marrom com alpha, blur 20 px, saturação 140%, borda e sombra. O scroll reduz padding e aumenta a opacidade do fundo. Há um listener nativo global de scroll só da Navbar, que será removido junto com a pílula.

Menu anterior: painel mobile abaixo do header, raio 28 px, stop/start do Lenis, overflow de html, trap de Tab e Escape. Não é modal full-screen. O header não entra nos cálculos de altura/câmera do mundo.

Os offsets existentes são `scroll-margin-top: 5.5rem` (88 px no padrão) e `NAV_OFFSET = 88` no fallback nativo de `src/lib/scroll.ts`. A altura do novo header será fixa em 88 px, declarada em CSS variable, mantendo esse contrato e sem modificar `scroll.ts`.

## Zona protegida

Lista integral com SHA-256 em [baseline.json](baseline.json): todos os arquivos atuais de código em `src`, exceto os dois alvos explicitamente autorizados nesta tarefa, `Navbar.tsx` (remoção) e `app/page.tsx` (troca do componente e escopo da variável de altura).

Isso preserva, em particular:

- Todos os arquivos de `src/components/world/` e `src/lib/world/`, incluindo shaders, câmera, terreno, worker, loaders, qualidade e telemetria.
- `MotionRoot.tsx`, `lib/motion.ts`, `lib/scroll.ts`: proprietário único de Lenis, ticker GSAP, ScrollTrigger e âncoras.
- `globals.css`, `layout.tsx`, `sections/Hero.tsx`, conteúdo `lib/site.ts`, Button, MediaFrame, seções e fontes existentes.
- Container do canvas, dimensões, posição, z-index, pointer-events e configuração WebGL.

`HeroStage` mede somente a altura do próprio palco e sua viewport. O novo header é fixed e não cria espaço/margem/padding em main ou no hero. A variável nova é escopada à página e só usada pela altura do header e scroll-margin das âncoras; nenhum token de cor é redefinido.

## Snapshot e baseline

[baseline.json](baseline.json) registra os nove tokens hex/HSL, bloco `@theme`, inventário de hex e hashes. [browser-before.json](browser-before.json) contém a telemetria e os quatro atos em 1280 × 900 e 360 × 900.

Desktop: benchmark 60.96 FPS, tier high, DPR observado 1. Mobile: primeira janela 30.94 FPS, tier low, com o fallback adaptativo anterior no segundo ato. Não é medição de aparelho físico; o mobile usa render sob demanda. Esse fallback e o CLS preexistente do hero, já aceito pelo usuário, não são alvo de alteração.

Para avaliar transparência, a pílula foi ocultada somente durante screenshots de inspeção, sem editar arquivos. O contraste conservador de `cream-50` contra os pixels da faixa 32–56 px do fundo real foi pelo menos 5.40:1 no desktop e 11.40:1 no mobile entre os atos amostrados. Dados em [hero-contrast-before.json](hero-contrast-before.json). Texto transparente do novo header terá alpha 1; não será reduzido para 70%.

## Especificação

- Header fixed de largura total, altura constante 88 px, z-index 50 como o anterior; sem raio, blur ou box-shadow.
- Logo/wordmark original à esquerda; links discretos e CTA textual nas larguras desktop; Menu sempre disponível. Layout compacto abaixo de 1024 px, CTA interno ao overlay abaixo de 1280 px.
- Transparente enquanto o hero ocupa o topo; fundo `brown-900` nas seções de conteúdo. Ao reentrar no hero, a superfície fica transparente imediatamente para evitar tintar a cena; show/hide continua animado. Sem fundo sólido intencional sobre o 3D visível.
- A entrada `[data-nav]` existente continua no nav interno. Sua animação é controlada pelo MotionRoot original e não compete com o transform do header externo. Os efeitos novos usam GSAP context, durações 0.3–0.6 s, cleanup e ScrollTrigger compartilhado.
- Direção/histerese de scroll pelo ScrollTrigger, sem listener global próprio, novo ticker/RAF/scroller ou pin. Header reaparece por foco de teclado e enquanto o menu estiver aberto.
- Overlay nativo `<dialog>` em tela cheia, `aria-modal`, links serifados grandes, stagger por linha, botão Fechar, Escape e clique na região externa ao conteúdo. Modalidade nativa + trap explícito, retorno de foco e stop/start do Lenis existente.
- Overlay usa apenas contato/CTA/Instagram existentes. A cobertura visual temporária quando o menu abre é o modal solicitado; o canvas conserva sua geometria/configuração. Scroll lock preserva espaço de scrollbar e restaura os estilos anteriores.
- Reduced motion: fades/set instantâneos, sem deslocamento animado. Foco visível preservado; foco torna o header visível.
- Hover por sublinhado, com token de easing próprio e cores existentes. Sem cursor magnético, fonte comercial ou alternador de idioma (o projeto tem apenas pt-BR).

## Incrementos previstos

1. Header estático e CSS isolado.
2. Estados de scroll/altura/âncoras e integração na home.
3. Menu modal, foco e scroll lock.
4. Micro-interações e reduced motion.
5. Remoção de `Navbar.tsx` e registro/verificação do novo escopo de proteção.

Contraste final, paleta, geometria/FPS, acessibilidade, quatro larguras, build/lint/typecheck e Lighthouse serão registrados no relatório final. Não se afirma CLS global zero enquanto o deslocamento preexistente do hero continuar presente.
