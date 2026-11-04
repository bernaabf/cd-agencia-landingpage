# Otimização mobile — entrega em 03/11/2026

Aplicadas as rotinas impeccable init (contexto existente confirmado), critique (duas avaliações independentes) e animate. Identidade, paleta, fontes utilizadas, conteúdo, serviços, CTAs e contatos originais preservados; src/lib/site.ts e src/data não foram alterados. Não houve deploy.

## Antes/depois

Lighthouse 13.6.0, produção local, Chrome headless, mobile CPU 4x, RTT 150ms / 1638.4 Kbps (4G lento simulado). Resultados brutos em lighthouse-*.json; resumo em comparison.json. São execuções de laboratório, não percentis de campo. Baselines foram executadas em paralelo; os testes finais foram sequenciais. Carga e cache podem influenciar diferenças pequenas.

| Medida | Antes | Depois |
|---|---:|---:|
| Performance mobile | 91 | 96 |
| Acessibilidade mobile | 100 | 100 |
| LCP mobile | 1.086 s | 1.068 s |
| CLS mobile | 0.0250 | 0.0436 |
| TBT mobile | 352.5 ms | 207.5 ms |
| Performance desktop | 100 | 100 |
| Acessibilidade desktop | 100 | 100 |
| LCP desktop | 0.309 s | 0.290 s |
| CLS desktop | 0 | 0 |
| TBT desktop | 3 ms | 0 ms |
| Home JS inicial, minificado | 771222 B | 748560 B |
| Home JS inicial, gzip por arquivo | 248794 B | 241619 B |
| Imagens transferidas no load mobile | 11728 B | 11724 B |
| INP | Não medido | Não medido |

TBT caiu aproximadamente 41%. CLS ficou abaixo de 0.1, mas variou para cima: o relatório identifica o ato inicial/título do hero; não declarar CLS zero. Imagens no carregamento mobile ficaram praticamente iguais — o ganho de mídia é evitar pesos de fonte sem uso e aquecimento excessivo no lightbox, não redução comprovada do tráfego inicial de fotos. Nenhum insight de entrega de imagens pendente na auditoria final.

Next 16 não imprime a antiga tabela de First Load JS. before-bundles.json e after-bundles.json medem os scripts referenciados no HTML e seus chunks, sem confundir bytes minificados com transferência comprimida. Maior chunk adiado (Three/WebGL) continua em torno de 909 KB minificados / 244 KB gzip: manter o 3D tem esse custo. React/Next, GSAP/ScrollTrigger e renderer Three são os grandes grupos utilizados; Lucide usa imports nomeados. Nenhuma dependência sem uso foi identificada para remoção.

## Mudanças

- Layout/toque: viewport-fit=cover; safe areas em header, menu, conteúdo editorial, galeria, lightbox, rodapé e controles inferiores; fallbacks vh no palco/menu; alvos Menu e links maiores; hover de menu/filtros/fotos protegido para hover real; feedback de toque.
- Contato: ação mobile reaproveita texto e mensagem existentes. O observer a oculta quando texto, imagens ou CTAs ocupam a faixa inferior; não cobre o contato editorial. Sem número configurado, a nova ação leva a #contato.
- Animate: mobile mantém todos os atos alpinos, com percurso 720svh → 480svh e scrub 1.1 → 0.35. Revelações de títulos/imagens no mobile usam transform/opacity curtos; máscaras, SplitText, zoom e parallax editoriais ficam no desktop. Conteúdo editorial deixa de depender de CSS inicialmente invisível.
- JavaScript: Lenis só é importado/iniciado com desktop + hover + pointer fine, syncTouch=false; SplitText importado só para desktop; cleanup por matchMedia, interrupção de inicializações assíncronas no unmount e remoção dos listeners. ScrollTrigger recebe refresh após fontes/imagens.
- Efeitos: blur do vidro 12px → 4px no mobile; fallback sem backdrop; removido will-change permanente dos atos.
- Imagens/fontes: retrato do quarto ato deixa de ser eager e recebe sizes mais específico; preload adjacente no lightbox usa largura responsiva e é suspenso em saveData. Removidos arquivos de fonte 300 italic e 500 não utilizados. Fontes locais latin/swap preservadas.
- 3D: preservados dynamic ssr:false, worker, DPR 1.25/80 segmentos no low, ausência de nuvens/fog volumétrico low, loop demand, pausa fora da seção/aba oculta e tratamento de falhas. Carregamento agora aguarda a primeira observação real da seção. Acrescentado poster com foto alpina existente para reduced-motion, saveData, aparelhos fracos e falha WebGL; créditos existentes na galeria.
- Bugs encontrados durante validação: altura mobile igual desde a primeira pintura para evitar deslocamento de âncoras na hidratação; restauração da seção de leitura após reconstrução GSAP no breakpoint; contato flutuante ocultado sobre conteúdo.

## Verificação

- npm run build: passou, Next 16.4.3 / Turbopack, todas as rotas estáticas.
- npm run lint: passou.
- npm run typecheck: passou.
- git diff --check: passou.
- Conteúdo e dados: sem diff em src/lib/site.ts, src/data e tokens da paleta.
- Chrome nativo via CUA: visualização em 360, 390, 414, 768 e 1024 px, altura emulada 800 px. Hero/menu em 360 e 390; conteúdo editorial em 390; serviços em 414 e 768; galeria/header em 1024; sem cortes horizontais visíveis nas áreas examinadas.
- Menu em 360: abriu com foco no Fechar e body overflow:hidden; fechamento por botão. Em 768: Escape fechou e devolveu foco ao Menu.
- Pular apresentação em 390 levou ao conteúdo e revelou texto/fotos. Acesso direto final por ?mobile-qa=final#sobre permaneceu na seção após hidratação. Após correção complementar, 390 → 768 manteve a seção Sobre.
- Save-Data:on no DevTools, recarga em 390: poster Matterhorn exibido, título, controles e contato preservados; sem classe world-ready.
- Contato flutuante: presente no hero; ausente sobre as fotografias na seção Sobre final. Não foi enviado contato externo.

O host de automação de abas estava indisponível; a inspeção posterior usou a interface nativa do Chrome em janela visitante. Não houve overlay, injeção ou live-server da skill. A crítica foi persistida para src-app-page-tsx (primeira execução, 24/32); ignore list ausente; temp da crítica removido; avaliações A/B independentes.

## Limites e pendências

- INP <200ms e 60fps em hardware mobile real não comprovados. Lighthouse de navegação não fornece INP; TBT não o substitui. Inspeção emulada não certifica GPU, temperatura, iOS Safari ou safe areas físicas. Falhas WebGL e mudança de reduced-motion não foram novamente injetadas nesta rodada; seus caminhos foram revisados em fonte e o caminho saveData foi observado.
- Inspeção visual por amostragem não equivale a matriz integral de todos os estados em cada largura, nem medição DOM de scrollWidth. Concluir QA em iPhone/Android físicos antes de declarar cobertura completa.
- NEXT_PUBLIC_WHATSAPP_NUMBER não está configurado no ambiente de validação. Os links originais wa.me/?text continuam sem destinatário, sem alteração de dados. Responsável deve fornecer/configurar o número verdadeiro para validar o fluxo de WhatsApp até o contato correto.
- Nenhuma decisão visual pendente: mantidos conteúdo e identidade. Poster usa imagem real já licenciada no repositório.

## Reprodução

1. npm run build && npm run start -- --hostname 127.0.0.1 --port 3102
2. Lighthouse instalado temporariamente em /private/tmp/cd-mobile-audit (sem nova dependência do projeto):
   CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' /private/tmp/cd-mobile-audit/node_modules/.bin/lighthouse http://127.0.0.1:3102 --output=json --output-path=docs/mobile/lighthouse-after.json --only-categories=performance,accessibility --chrome-flags='--headless --no-sandbox' --throttling.cpuSlowdownMultiplier=4 --quiet
3. Desktop: mesma linha, com --preset=desktop e outro output-path, sem o override de CPU.
4. node scripts/report-mobile.mjs
