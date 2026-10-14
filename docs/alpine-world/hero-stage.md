# Hero alpino — palco imersivo

Implementação local revisada em 12 de outubro de 2026. Os relatórios anteriores
nesta pasta descrevem a versão com canvas global; não são resultados desta versão.

## Diagnóstico confirmado antes da alteração

| Causa | Evidência no código anterior | Correção |
|---|---|---|
| Canvas encoberto | `.alpine-world` fixed atrás de `.site-content`; gradiente do Hero entre 97% e 89% de marrom na região de texto | Canvas dentro da viewport sticky, com scrims localizados |
| Cena na margem | Grid com texto e retrato ocupando seis colunas cada | Primeira dobra com cena inteira e título; retrato só no quarto ato |
| Contraste baixo | `uContours: 0.12`, cores e fog suaves | Isolinhas até 0.55, neve, brilho das cristas e oclusão direcional |
| Viagem curta no Hero | Hero de 100svh; `measureJourney` dava apenas 1/7 do percurso até Sobre | Toda a spline acontece nos 350svh do Hero |
| Conteúdo competindo | Parágrafo, CTA e retrato entram juntos por tempo | Camadas editoriais reveladas pelo progresso compartilhado |
| Primeiro plano ausente | Terreno, atmosfera e rota, sem objetos próximos | Pinheiros e rochas instanciados, duas cadeias distantes |

## Decisões

Sticky nativo mantém o fluxo da página. A única timeline do palco publica um
progresso transitório para câmera, atmosfera e rota; não há setState por frame.
Lenis e ScrollTrigger continuam integrados pelo MotionRoot. A sequência antiga
do Hero foi removida desse componente para evitar disputa e seletores sem alvo.

Copy e retrato permanecem no HTML do Server Component. O bundle pesado do WebGL
é dinâmico. Reduced motion e ausência de JavaScript usam composição estática;
falhas de GPU usam fundo marrom profundo com a sequência editorial disponível.
O fundo vetorial foi removido: a entrada e a saída do 3D usam fade sobre essa base.

As sombras são calculadas no worker pela oclusão do relevo em três posições do
sol. O shader interpola os estados: aproximação deliberada de sombras físicas
pré-calculadas, sem shadow maps dinâmicos ou sombras projetadas pelos pinheiros.
Isso evita um segundo passe de renderização no mobile. Há altura mínima da câmera
sobre a triangulação real, névoa por altura e dois níveis adicionais de montanhas.

## Verificação executada

- `npm run typecheck`: passou.
- ESLint nos componentes e módulos alterados: passou.
- `npm run build -- --webpack`: produção compilada, TypeScript aprovado e oito
  páginas estáticas geradas. O build padrão Turbopack foi tentado dentro e fora
  do sandbox, mas falhou ao abrir a porta interna (`Operation not permitted`).
- Chrome local: canvas e abertura, painel no vale, chip/CTA, rota, retrato,
  retorno ao início e saída para Sobre observados. A rota foi reposicionada e
  o olhar da câmera abaixado após a inspeção para enquadrar o desenho no vale.
- Viewport 390 × 844 em DevTools: abertura e painel cabem na tela; CTA acessível
  por Tab, com busca automática do seu ato. A emulação de reduced motion remove
  o canvas e devolve o conteúdo ao fluxo; ao restaurar a preferência, o palco volta.
- Navegação nova após correções: console com mensagens de desenvolvimento do
  React/HMR, sem os avisos antigos de seletores GSAP e de qualidade das imagens.
  A qualidade 85 usada pelo MediaFrame foi incluída na allowlist do Next 16.
- Árvore de acessibilidade: título, parágrafo, credenciais, CTA e retrato presentes
  na ordem de leitura; canvas e paisagem decorativos. Pular apresentação transfere
  foco para Sobre. O link externo não foi acionado nem enviou mensagem.

A checagem geométrica executou os módulos TypeScript reais via transpileModule
em Node, gerou cada terreno e percorreu 1.001 posições do CameraRig por tier.
Validou finitude, alturas, intervalo [0,1] de todas as sombras, presença de áreas
iluminadas e sombreadas e remoção da subscription ao descartar o rig.

| Tier | Vértices | Menor altura livre observada | Geração + checagem local¹ |
|---|---:|---:|---:|
| low | 6.561 | 3,38 unidades | 42 ms |
| medium | 21.025 | 3,54 unidades | 53 ms |
| high | 50.625 | 3,63 unidades | 106 ms |

¹ Amostra única em Node no computador local; não representa FPS nem tempo em
um celular. As posições projetadas da rota foram verificadas em 40%, 46%, 52%
e 58%: há segmentos desenhados dentro do frustum em todos esses pontos.

## Limites

Não houve medição nova de FPS, Core Web Vitals, contraste por pixel ou heap de
longa duração. A inspeção móvel foi emulada; GPU e touch em aparelho real não
foram testados. A implementação trata falha de renderer, shader, worker e perda
de contexto, mas essas falhas não foram injetadas nesta rodada. Sem JavaScript
foi revisado pelo HTML/CSS e fluxo de fallback, sem navegação com JS desativado.
A captura inicial no Safari mostrou o fallback; a revisão completa do WebGL foi
feita no Chrome. A geração Webpack passou; Turbopack de produção continua limitado
pelas permissões do ambiente de execução.
