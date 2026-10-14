# Mapeamento e riscos

Risco considera interferência em cores, hero/canvas e coordenação de scroll. Somente linhas de risco baixo fazem parte da implementação. As demais são propostas documentadas e não autorizadas para alteração.

| Padrão da referência | Equivalente na Carolina | Arquivos afetados | Risco paleta / 3D | Decisão |
| --- | --- | --- | --- | --- |
| Escala tipográfica forte, entrelinha compacta | Títulos fluidos com Cormorant e uppercase atuais | `Editorial.module.css`, `About.tsx`, `Services.tsx`, `Contact.tsx` | baixo / baixo | Aplicar somente abaixo do hero |
| Metadados com escala consistente | Eyebrow e números originais; estilos locais | `Editorial.module.css`, `Services.tsx` | baixo / baixo | Aplicar sem texto novo |
| Margens e gutters coerentes | Container até 1280 px, margens 20–40 px e gaps fluidos | CSS Module e três seções | baixo / baixo | Aplicar, sem alcançar `#inicio` |
| Espaço negativo e ritmo editorial | Tokens locais de seção/bloco/ritmo | CSS Module e três seções | baixo / baixo | Aplicar sem medir layout por frame |
| Listas editoriais, número + título + descrição + ação | Os três serviços originais em linhas no desktop e fluxo vertical no mobile | `Services.tsx`, CSS Module | baixo / baixo | Aplicar; conservar todas as cores, bordas, sombras e CTAs |
| Composição assimétrica | Grid 12 colunas e títulos alinhados à esquerda | `About.tsx`, `Services.tsx`, CSS Module | baixo / baixo | Aplicar; imagens e proporções originais |
| Rodapé integrado ao grid | Container alinhado às seções e área clicável dos links | `Contact.tsx`, CSS Module | baixo / baixo | Aplicar sem alterar contato ou cor |
| Hover expressivo e feedback por teclado | Estados já existentes do Button; foco global e área de 44 px nos links de rodapé | `Contact.tsx`, CSS Module | baixo / baixo | Reutilizar animações existentes; nenhuma nova timeline |
| Reveals de conteúdo | SplitText por linhas, batch e parallax já presentes | Nenhum arquivo de animação | baixo / baixo | Preservar; `data-split` e `data-reveal` existentes |
| Redução de movimento | Política global e fallback do mundo atuais | Nenhum arquivo protegido | baixo / baixo | Preservar e testar |
| Header que reagisse à direção do scroll | Navbar + Lenis atuais | `Navbar.tsx`, eventualmente `MotionRoot.tsx` | baixo / médio | Não aplicado; requer decisão antes de editar |
| Menu full-screen com nova coreografia | Painel móvel e contrato de foco/stop/start atual | `Navbar.tsx` | baixo / médio | Não aplicado; requer decisão antes de editar |
| Hero com nova tipografia/geometria | Palco imersivo, máscaras e controles | `Hero.tsx`, `HeroStage.tsx`, `globals.css` | baixo / alto | Não aplicado; zona protegida |
| Tokens globais ou hovers compartilhados | `@theme` e Button usados pelo hero | `globals.css`, `Button.tsx`, `lib/motion.ts` | médio / alto | Não aplicado; usar tokens locais |
| Pins adicionais / outro smooth scroll | Lenis 0.09 + ticker GSAP + ScrollTrigger | `MotionRoot.tsx`, `scroll.ts`, mundo | baixo / alto | Não aplicado; não instalar Locomotive Scroll |
| Cursor / magnetic buttons / mídia que segue ponteiro | Não há equivalente necessário | Novos listeners e loop potencial | baixo / médio | Não aplicado por custo/complexidade |
| Troca de cores, fontes, textos ou mídia | Identidade e conteúdo da marca | Tokens/assets/conteúdo | alto / médio | Proibido pela solicitação |

## Tokens da adaptação

Definidos na classe local `scope`, sem `:root` e sem declarações de cor:

| Token CSS | Valor próprio da adaptação | Uso |
| --- | --- | --- |
| `--editorial-title` | `clamp(2.2rem, 5.5vw, 4.6rem)` | h2 das três seções |
| `--editorial-item-title` | `clamp(1.9rem, 3vw, 2.8rem)` | h3 de serviços |
| `--editorial-leading` | `1.08` | títulos compactos |
| `--editorial-tracking` | `0.025em` | tracking editorial com fonte original |
| `--editorial-section` | `clamp(6rem, 8vw, 8rem)` | espaço entre blocos principais |
| `--editorial-block` | `clamp(3.5rem, 6vw, 5rem)` | espaço entre título e conteúdo |
| `--editorial-margin` | `clamp(1.25rem, 3vw, 2.5rem)` | margens externas |
| `--editorial-gap` | `clamp(1.25rem, 2vw, 2rem)` | gutters e espaços entre itens |
| `--editorial-measure` | `1280px` | largura máxima original |
| `--editorial-duration` | `0.5s` | duração UI já usada no projeto |
| `--editorial-ease` | `var(--ease-premium)` | easing já existente |

São valores de composição próprios, não um clone da referência. Cores continuam nas classes Tailwind originais. Fontes continuam em `font-display`/`display` e `font-sans` originais. Duração/easing apenas nomeiam o contrato existente; não alteram `motion.world` nem a orquestração global.

## Aprovação

Nenhuma proposta média/alta foi implementada. Uma futura aprovação deve especificar a linha da tabela, arquivos e risco autorizado. A regra inviolável sobre paleta/3D continua prevalecendo sobre a inspiração estética.
