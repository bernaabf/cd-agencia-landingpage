# ADR-0001: experiência alpina mobile independente do renderer 3D

## Status
Aceita em 03/11/2026 — plano aprovado pelo responsável, com a condição de usar uma fotografia das paisagens já selecionadas pelo projeto.

Data: 03/11/2026. Relato alvo: iPhone 14 Pro, Safari, retrato.

## Contexto

O site é uma aplicação Next.js estática, com conteúdo em Server Components e ilhas interativas. HeroStage compartilha timeline e estado de jornada com AlpineWorld no desktop e no mobile. O tier low reduz DPR/terreno, mas mantém Three/R3F, worker, compilação de shaders e câmera acionada pelo scroll. O mobile mantém sticky por 480svh. A melhora anterior no Lighthouse de carregamento não comprovou fluidez de scroll/GPU no aparelho relatado.

O pedido atual substitui a regra anterior de conservar o 3D no mobile: o desktop deve conservar sua apresentação; o mobile deve receber outra animação, leve e clean. Identidade, textos, fatos, mensagens e contatos continuam protegidos.

## Decisão

1. Manter Next/React, uma página, um conteúdo semântico e um deploy. Criar apenas uma fronteira local de apresentação do hero.
2. Desktop: extrair mecanicamente o controlador existente para um módulo exclusivo, carregado condicionalmente. Manter câmera, terreno, duração, composição e regras de qualidade existentes.
3. Mobile: criar MobileAlpineScene, fotografia do Matterhorn já selecionada na galeria, variantes AVIF/WebP locais responsivas e uma entrada breve (aproximadamente 450–700ms, opacity/transform). Sem câmera 3D, shader, partículas, backdrop-filter ou loop infinito. Sem animação vinculada continuamente à posição de scroll.
4. Usar IntersectionObserver para disparar a entrada uma vez. Conteúdo visível por padrão; com reduced-motion/saveData, apresentar composição estática. A fotografia estática é o fallback. Sem JavaScript, manter título, texto, CTAs e fotografia utilizáveis. Usar créditos existentes e não introduzir destinos ou fatos novos.
5. Mobile: conteúdo do hero em fluxo normal, altura definida pelo conteúdo com mínimo estável apenas na abertura, sem corredor 480svh, sem sticky de narrativa nem atos ocultos que exijam seek de foco.
6. Selecionar antes de montar o renderer: mobile em largura <=767px, ou dispositivo de toque primário sem hover até 1023px. Demais condições mantêm desktop. Cobrir telefone em paisagem sem migrá-lo acidentalmente ao 3D. CSS e JS devem representar a mesma política, com SSR/hidratação consistentes. Não usar user-agent.
7. O caminho mobile não deve requisitar o chunk Three/R3F, iniciar terrain.worker, criar WebGL ou publicar progresso de jornada. Esconder canvas por CSS não atende à decisão.
8. Na troca de modo: desmontar o controlador anterior, reverter seu contexto/listeners e preservar a seção de leitura. Não manter ambos os renderers vivos. Não duplicar h1, IDs nem CTAs para resolver a seleção.

## Alternativas consideradas

| Alternativa | Benefício | Custo/limite | Avaliação |
|---|---|---|---|
| Reduzir ainda mais o 3D compartilhado | Menor mudança | Mantém shaders/worker/WebGL e acoplamento ao scroll; contraria a troca pedida | Rejeitada |
| Canvas 2D com loop próprio | Controle visual detalhado | Introduz desenho/frame, resize e manutenção de outro motor | Rejeitada |
| Vídeo/GIF das montanhas | Reprodução pronta | Download/decodificação, autoplay, pausa e acessibilidade | Rejeitada |
| Foto alpina + animação breve | Reaproveita material real e a seleção do projeto | Download/decodificação limitados por variantes responsivas | Escolhida pelo responsável |
| SVG geométrico com duas camadas + animação breve | Sem imagens raster, sem loop | Não atende à condição de usar foto selecionada | Não escolhida |
| Reescrever toda a página | Liberdade total | Alto risco para desktop e escopo desnecessário | Rejeitada |

## Consequências e trade-offs

- Positivas: remove o custo 3D do mobile; desacopla a leitura da câmera; reduz ciclos de execução e estados; facilita testes isolados.
- Negativas: mobile perde o voo pela paisagem e a narrativa por scrub; haverá dois pequenos controladores de apresentação para manter.
- Neutras: Three/R3F e GSAP permanecem dependências do projeto porque o desktop continua usando-os. Não prometer zero GSAP no bundle mobile: header/menu ainda possuem interações existentes.
- Custos de infraestrutura e superfície de dados permanecem iguais; nenhum serviço, banco, pacote ou telemetria novo.

## Validação e rollback

Validar ausência de requests Three/worker e canvas WebGL em mobile, inclusive após rolar a página toda, reabrir aba e girar o telefone. Testar SSR/JS desligado, reduced-motion/saveData, falha de carregamento do controlador e mudança de modo. Comparar desktop com baseline da revisão imediatamente anterior.

Implementar em commits locais separados. Se a nova cena falhar, o fallback imediato é a fotografia estática mobile com scroll nativo. Reverter somente o commit da cena se necessário; não reinstalar o 3D mobile como fallback automático. Regressão desktop exige reverter o commit de extração do controlador antes de prosseguir. Não fazer reset destrutivo de alterações do usuário.

## Referências locais

- src/components/world/HeroStage.tsx
- src/components/world/AlpineWorldLoader.tsx
- src/components/world/AlpineWorld.tsx
- src/lib/world/progress.ts
- docs/mobile/validacao.md
- node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md
