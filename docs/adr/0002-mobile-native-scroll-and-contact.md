# ADR-0002: scroll nativo e contato em fluxo normal no mobile

## Status
Aceita em 03/11/2026 — aprovada pelo responsável; implementação incremental.

Data: 03/11/2026. Alvo principal: iPhone 14 Pro / Safari / retrato.

## Contexto

Lenis já não é iniciado na condição touch atual. Persistem uma timeline scrub no hero, emissões globais de progresso/câmera, animações editoriais e refresh global após eventos load. Galeria e header também mantêm ScrollTrigger próprios. A falta de fluidez relatada não deve ser atribuída ao Lenis sem evidência.

MobileContact usa position:fixed, um IntersectionObserver sobre seletores de toda a página e rootMargin calculado a partir de innerHeight. Essa dependência de geometria/visibilidade é frágil diante de transformações e mudanças na viewport visível. A causa exata de o botão surgir no meio da tela no Safari ainda exige reprodução; não foi estabelecida somente pelo código.

## Decisão proposta

1. Retirar o contato flutuante e seu observer. O componente atual é exclusivo do mobile: removê-lo não elimina uma ação visível do desktop. Preservar CTAs existentes no hero, serviços, menu e contato, com mesmos textos, links e mensagens.
2. Oferecer contato no fluxo normal do hero mobile, sem esperar pelo avanço da cena. Não substituir o botão defeituoso por outra barra fixed/sticky.
3. Preservar a rolagem nativa do gesto de toque. Não introduzir outro smooth-scroller, captura de touchmove, scroll-lock global ou sincronização manual do dedo.
4. Substituir somente os reveals mobile da página/galeria por IntersectionObserver + transições CSS breves, uma vez por elemento, em opacity/transform e sem esconder conteúdo por padrão. Sem pin, scrub ou parallax editorial mobile.
5. Manter MotionRoot/galeria desktop como estão. Inicializar o ramo de animação que corresponde ao modo ativo; não operar dois motores sobre o mesmo elemento.
6. Limitar refresh de recursos ao ramo desktop que precisa de ScrollTrigger; header/menu mobile permanecem inicialmente com o comportamento existente, medindo seu custo no trace antes de qualquer mudança adicional. Não executar uma reescrita global do header nesta etapa.
7. Respeitar reduced-motion e saveData. Em navegação programática, usar o helper existente com offset de header/safe area correto, sem interferir no gesto de rolagem.

## Alternativas consideradas

- Corrigir fixed com visualViewport e reposicionamento por evento: mantém CTA persistente, mas acrescenta sincronização e mais estados; não resolve a reclamação de sobreposição com a mesma simplicidade. Rejeitada.
- Barra sticky inferior: ainda ocupa espaço e exige compensações. Rejeitada.
- Manter GSAP mobile com durações menores: menor diff, mas conserva triggers/refresh e mistura responsabilidades. Insuficiente como estratégia principal.
- Scroll nativo + contato em fluxo + reveals por observer: recomendada. Menor persistência de contato em troca de previsibilidade e menor execução durante o scroll.

## Consequências

- Menos código de posicionamento e menos trabalho associado à rolagem mobile.
- Contato deixa de estar sempre disponível no canto da tela; permanece disponível no início e nos pontos de decisão existentes.
- Shared markup e fontes de conteúdo permanecem únicas. Sem nova dependência, API ou estado de negócio.
- Acessibilidade preservada com foco visível, diálogos e alvos >=44px; conteúdo deve permanecer visível se os observers falharem.

## Testes e rollback

No Safari relatado, testar rolagem lenta/rápida com inércia, barra de endereço expandida/recolhida, retorno de aba, menu abrindo/fechando, lightbox, âncoras e giro. Não deve existir contato flutuante em nenhum ponto do percurso.

Comparar traces durante gesto e inércia, não só Lighthouse. Alvo: fluidez próxima de 60fps, ausência de long tasks repetidas geradas por nossa animação e nenhum aumento de CLS. INP deve ser medido por interações; TBT não o substitui.

Commit de retirada do flutuante é independente. Caso os novos reveals falhem, usar conteúdo visível estático no mobile. Preservar essa correção e reverter apenas o commit de reveals, sem restaurar um overlay que já apresentou defeito.

## Referências

- src/components/MobileContact.tsx
- src/components/MotionRoot.tsx
- src/components/paisagens/GaleriaPaisagens.tsx
- src/components/Header.tsx
- src/lib/scroll.ts
- src/app/globals.css
