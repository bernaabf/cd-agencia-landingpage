# Verificação — inspiração editorial

Branch: `design/locomotive-editorial-inspiration`. Base: `aa764e1022c617b98fb2918ddc5087a4232f2e92`.

**Aplicação dos padrões de baixo risco concluída. A verificação global de CLS zero permanece pendente de decisão:** o texto do hero apresenta CLS 0.039 também no código original. Nenhum arquivo protegido foi alterado para corrigir esse comportamento.

## Resultado por requisito

| Verificação | Resultado | Evidência |
| --- | --- | --- |
| Tokens e literais de cor | PASS — diferença zero | `palette-before.json`, `invariants.json` |
| Hex novo em `src` | PASS — nenhum | inventário por regex/`rg`, verificador reproduzível |
| Cores calculadas no DOM | PASS — diferença zero | `content-before.json`, `ui-after.json`, `final-ui.json` |
| Arquivos protegidos no diff | PASS — nenhum; 27 SHA-256 iguais | `invariants.json` |
| Fontes, imagens, stack e configuração | PASS — preservados | verificador e `git diff` contra a base |
| Copy e URLs dos CTAs | PASS — igualdade exata | snapshot do DOM original e comparação final |
| Geometria e comportamento 3D | PASS — mesmos tamanhos, tiers e disponibilidade por ato | `browser-before.json`, `browser-after.json`, `comparison.json` |
| Lenis/ScrollTrigger e sticky | PASS — scroll monotônico, offset 88 px, sticky top 0 | `scroll-after.json` |
| Responsivo/reduced motion | PASS — 320, 390, 820, 1024 e 1440 px; sem overflow | `ui-after.json` |
| Teclado | PASS — foco 2 px, links de rodapé 44 px, menu Tab/Shift+Tab/Escape | `ui-after.json`, `final-ui.json` |
| Lint / TypeScript | PASS — exit 0 | `npm run lint`, `npm run typecheck` |
| Build de produção | PASS com Webpack — exit 0 | `npm run build -- --webpack` |
| Lighthouse Performance/Acessibilidade/SEO | PASS nas comparações descritas abaixo | relatórios Lighthouse |
| CLS global exatamente zero | PENDENTE — 0 no desktop, 0.038826 no mobile | mesmo valor reproduzido no código original |

## Paleta e zona protegida

O snapshot inclui os nove tokens em hex/HSL, todos os hex/rgba/classes de cor anteriores e hashes dos arquivos protegidos. O verificador compara a lista completa por arquivo, incluindo repetições: mover markup não autoriza substituir cores, shadows ou alphas.

Todos os 27 arquivos listados na análise continuam byte a byte iguais. Incluem mundo, shader, worker, câmera, loaders, ticker, GSAP, Lenis, hero, Button, MediaFrame, Navbar, CSS global, layout e conteúdo da marca. Nenhuma alteração de canvas, z-index, pointer-events, posicionamento, dimensões, loop ou modelo/textura. Nenhum novo RAF, scroller, listener global ou dependência na aplicação.

O novo CSS Module não contém `:root`, `:global`, `@theme` nem declaração de cor. As três seções continuam Server Components. A revisão React verificou estrutura sem novos hooks/effects, keys estáveis, sem estado por frame, sem biblioteca adicional e sem mudança dos contratos de acessibilidade.

Comandos reproduzíveis:

```sh
node scripts/verify-design-system.mjs
rg -n '#[0-9a-fA-F]{3,8}\b' src
git diff aa764e1022c617b98fb2918ddc5087a4232f2e92 --name-only
npm run lint
npm run typecheck
npm run build -- --webpack
```

O build padrão com Turbopack falhou **antes das alterações**, por `binding to a port: Operation not permitted`, inclusive na tentativa com execução ampliada. A alternativa `--webpack` consta na documentação CLI instalada desta versão do Next e passou tanto no baseline quanto no estado final. `package.json` e `next.config.ts` não foram modificados para contornar o ambiente.

## 3D e scroll

Medições em Chrome isolado, sem extensões, viewport 1440 × 900 e 390 × 900. Dados obtidos pelos atributos de telemetria que o próprio mundo já publica; nenhum contador/RAF foi adicionado à aplicação.

| Métrica | Original | Final |
| --- | --- | --- |
| Desktop — benchmark do mundo | 59.05 FPS | 60.50 FPS |
| Desktop — CPU/render do benchmark | 0.519 ms | 0.310 ms |
| Desktop — GPU do benchmark | 3.323 ms | 3.511 ms |
| Mobile — benchmark do mundo | 31.198 FPS | 31.220 FPS |
| Mobile — CPU/render do benchmark | 0.322 ms | 0.275 ms |
| Mobile — GPU do benchmark | 0.536 ms | 0.534 ms |
| Hero imersivo | 3150 px | 3150 px |
| Viewport do palco | 900 px | 900 px |
| Canvas desktop / mobile | 1440 × 900 / 390 × 900 | iguais |
| Canvas pointer-events | none | none |
| Tier desktop / mobile | high / low | iguais |
| DPR observado | 1 | 1 |

Pequenas diferenças de tempo de CPU/GPU entre execuções não demonstram ganho ou regressão causal. O código do mundo é idêntico. No mobile, a telemetria é de render sob demanda, não uma medida contínua da tela física: a primeira janela de aproximadamente 31 FPS aciona o fallback adaptativo no segundo ato **tanto antes quanto depois**. Esse comportamento preexistente foi preservado, não corrigido nem ocultado.

Os quatro avanços terminaram nos mesmos scrollY: 563, 1035, 1665 e 2520 px, com progresso 0.25 → 0.46 → 0.74 → 1.00. A maior diferença numérica entre as amostras de progresso foi 0.000002. A geometria do hero/canvas e a disponibilidade do canvas por ato foram iguais. Zero page errors nas duas versões.

Uma verificação adicional amostrou 48 pontos de scroll/progresso por largura durante wheel: nenhum retorno inesperado; sticky top 0; nenhum `.pin-spacer` (o palco usa sticky nativo). A âncora Sobre terminou a 88 px do topo. O menu móvel bloqueou o wheel e retomou Lenis ao navegar. Títulos, cards, último serviço e reveals responderam ao ScrollTrigger existente. Elementos abaixo da viewport permanecem ocultos até entrar, como antes.

## Acessibilidade, conteúdo e imagens

- Comparação exata de texto normalizado, URLs e cores calculadas de títulos, parágrafos e links nas três seções.
- Cinco larguras com reduced motion: zero canvas, zero Lenis, todos os reveals disponíveis, nenhum overflow horizontal.
- Foco do rodapé: outline de 2 px, underline e área vertical mínima de 44 px.
- Menu móvel: Tab e Shift+Tab contidos; Escape fecha e devolve foco ao botão.
- Fotos, `sizes`, alt text e aspect ratios originais preservados. Sem assets novos ou conteúdo comercial inventado.
- Animações GSAP atuais reutilizadas, com sua limpeza original intacta. Nenhuma nova timeline; easing/duração locais mantêm os valores UI existentes.

O Lighthouse manteve o audit de contraste aprovado nas amostras. A pontuação de Acessibilidade 100 **não certifica conformidade integral WCAG 2.2 AA**: há um diagnóstico anterior de nome acessível diferente do texto visível no botão `hero-scroll-cue` (`HeroStage.tsx`, protegido). Ele aparece antes e depois, sem afetar a pontuação agregada nessa versão do Lighthouse. Não foi alterado fora da autorização recebida.

## Lighthouse

Lighthouse 13.5.0, Chromium/Chrome 155, build de produção Webpack, contextos headless isolados, categorias Performance/Acessibilidade/SEO. Desktop usa `--preset=desktop`; mobile usa o perfil padrão com CPU/network simulados. Mesmo conjunto de flags antes/depois. Ferramentas de QA executadas do cache/pasta temporária, sem dependências adicionadas ao projeto.

| Comparação | Performance antes → depois | Acessibilidade | SEO | CLS |
| --- | --- | --- | --- | --- |
| Desktop — baseline inicial e último build | 83 → 99 | 100 → 100 | 100 → 100 | 0 → 0 |
| Mobile — primeira comparação | 56 → 88 | 100 → 100 | 100 → 100 | 0 → 0.038826 |
| Mobile — mediana de 3 controles pareados | 85 → 90 | 100 → 100 | 100 → 100 | 0.038826 → 0.038826 |

As amostras pareadas adicionais foram necessárias porque a primeira comparação expôs um CLS no hero e a Performance variou. O código original foi reconstruído pelo `git archive` da base em `/private/tmp`, usando as mesmas dependências, build e flags, e servido em outra porta local. Nenhum código original foi modificado na cópia de controle.

Rodadas mobile de controle: 92, 85, 82; finais: 88, 90, 90. As três rodadas de cada versão reproduziram o mesmo CLS e o mesmo elemento do hero. Medianas: TBT 350 → 188 ms; LCP 3211 → 3275 ms. O pequeno aumento de LCP não deve ser ocultado pelo ganho de score. Os dados refletem este ambiente e não garantem desempenho idêntico em aparelhos reais.

Relatórios: `lighthouse-before-*`, `lighthouse-after-*`, `lighthouse-original-mobile-control.json` e `lighthouse-paired-mobile.json` em `docs/design-system/`.

## Decisão necessária para CLS zero

O elemento identificado é `.hero-opening`, dentro de `.hero-editorial`. Há regras diferentes para o texto antes/depois de `[data-immersive]`; a mudança de posição/largura/medida do eyebrow durante a hidratação é uma hipótese concreta para o deslocamento. A origem preexistente está comprovada pelo controle; a correção ainda não foi testada nem aplicada.

[Proposta reviewável, não aplicada](design-system/proposed-hero-text-cls.patch): acrescentar, somente para mobile com altura acima de 560 px e sem reduced motion, o estado inicial de texto/eyebrow/controles igual ao estado imersivo final. Não modifica cores, canvas, container do canvas, câmera, shader, loop, loaders, ticker ou listeners. A proposta mira a viewport em que o problema foi reproduzido; não promete corrigir toda combinação de aparelho/hidratação sem verificação posterior.

**Risco médio/alto:** exige editar `src/app/globals.css`, incluído na zona protegida. A regra 5 do usuário exige parar e pedir decisão antes de uma mudança que possa afetar o 3D. Portanto essa proposta permanece apenas em `.patch`, e o critério global de CLS zero não é declarado aprovado.

Opções: manter a zona protegida integral e aceitar a limitação preexistente documentada; ou autorizar uma exceção restrita ao CSS inicial do texto do hero, seguida de nova verificação de paleta, canvas, FPS, reduced motion e Lighthouse. Todos os demais padrões de risco médio/alto continuam não aplicados.

## Commits e arquivos alterados

| Commit | Padrão |
| --- | --- |
| `4872c22` | Auditoria, snapshot, baseline e mapeamento |
| `7acc895` | Tokens locais de tipografia/espaçamento/movimento |
| `4fd7ea7` | Hierarquia de títulos abaixo do hero |
| `e5709b6` | Grid, margens e ritmo vertical |
| `4d80baf` | Serviços originais em linhas editoriais responsivas |
| `d0c4066` | Contrato UI de movimento e foco/toque do rodapé |
| `3705bfb` | Remoção de referência de classe não definida, sem mudar o DOM renderizado |
| Commit que contém este relatório | Verificador, evidências finais e proposta protegida não aplicada |

Arquivos da aplicação: `src/components/sections/About.tsx`, `Services.tsx`, `Contact.tsx` e novo `Editorial.module.css`.

Entregáveis adicionais: `scripts/verify-design-system.mjs`, `docs/locomotive-design-analysis.md`, `docs/locomotive-pattern-mapping.md`, este relatório e os snapshots/relatórios/screenshots em `docs/design-system/`.

Preview da implementação segura: [desktop](design-system/preview-services-1440.png) e [mobile](design-system/preview-services-390.png).

## Não aplicado

Paleta/assets/fontes/copy da referência; novo scroller/Locomotive Scroll; novo RAF/ticker; modificação do mundo/hero; header hide/show; menu com nova coreografia; cursor customizado; magnetic buttons; previews que seguem ponteiro; pins adicionais; grandes parallax; loops/marquee; formulários/newsletter; novos destinos/preços/pacotes/avaliações; normalização de cores literais antigas; correções em arquivos protegidos; publicação. Motivos e riscos detalhados na [tabela](locomotive-pattern-mapping.md).
