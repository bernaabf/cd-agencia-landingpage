# Fotografia mobile e scroll nativo — validação

Data: 03/11/2026. Alvo informado: iPhone 14 Pro, Safari, retrato.

Plano aprovado com condição expressa de fotografia selecionada pelo projeto, substituindo o SVG proposto. ADRs aceitos em docs/adr/0001-mobile-alpine-experience.md e 0002-mobile-native-scroll-and-contact.md. Arquitetura principal, rotas, paleta, conteúdo factual, mensagens e contatos preservados.

## Resultado implementado

- Mobile usa a fotografia existente do Matterhorn, selecionada por ID no catálogo, sem novo destino ou imagem gerada. Créditos e licença existentes permanecem na galeria.
- Fontes AVIF/WebP/JPG locais de 480, 768 e 1080px são escolhidas pelo picture. getImageProps do Next mantém a fotografia sem handlers de hidratação; preload com media só prioriza a foto no mobile. Não há download da foto no desktop auditado.
- Entrada da imagem dura 650ms e repousa. Não existe movimento contínuo sincronizado ao scroll. Reduced-motion/saveData deixam a imagem estática.
- Hero mobile em fluxo normal, sem jornada sticky de 480svh. Texto, fatos, retrato e CTA originais continuam disponíveis; o CTA aparece no início e não flutua.
- MobileContact foi removido, assim como sua lógica global de observação e posicionamento fixed. Header e diálogos mantêm seus papéis existentes.
- Revelações mobile usam IntersectionObserver e CSS uma vez por elemento. Não iniciam scrub, ticker ou refresh global de recursos. Filtros da galeria continuam funcionais; desktop conserva os triggers anteriores.
- DesktopHeroExperience foi extraído com timeline byte a byte idêntica à original. Seu controlador pequeno está disponível no bundle para evitar outro request antes da coreografia desktop. O renderer Three/R3F e worker continuam em import dinâmico no caminho desktop; não são montados/requisitados no mobile. Esse compromisso acrescenta ~1.4KB ao JS mobile em relação ao experimento com entrada assíncrona e preserva a entrada desktop.
- Seleção: <=767px ou touch primário sem hover até 1023px. Isso inclui telefone em paisagem; desktop com mouse >=768px e telas >=1024px continuam no caminho original. Um único conteúdo semântico, sem duplicar h1/IDs/CTAs.

## Comparação da baseline desta revisão

Lighthouse 13.6.0 / Chrome headless / produção local; auditorias finais sequenciais. Retrato: viewport 412x823, DPR 1.75, CPU 4x, rede móvel simulada padrão (RTT 150ms, throughput 1638.4Kbps). Baseline de código e4a74ec, anterior à implementação. As capturas JSON documentam as condições. Valores variam com ambiente/cache; não são medições físicas do iPhone.

| Métrica | Antes | Depois |
|---|---:|---:|
| Performance mobile | 94 | 96 |
| Acessibilidade mobile | 100 | 100 |
| TBT mobile | 265ms | 17ms |
| CLS mobile | 0.0436 | 0 |
| LCP mobile simulado | 1.058s | 2.786s |
| JS transferido mobile | 453090B | 206558B |
| Requests do renderer WebGL mobile | 1 | 0 |
| Requests do terrain worker mobile | 1 | 0 |
| Performance desktop | 100 | 100 |
| Acessibilidade desktop | 100 | 100 |
| LCP desktop simulado | 291ms | 291ms |
| CLS desktop | 0 | 0 |
| TBT desktop | 1ms | 0ms |

TBT reduziu aproximadamente 94%; JS transferido, 54%. A foto retrato usada pela auditoria foi a variante de 768px: 37909B de conteúdo / 38303B transferidos. A variante de 1080px foi usada no teste paisagem (73797B transferidos). O aparelho físico pode selecionar essa variante maior por DPR; não afirmar que toda navegação usa apenas 38KB.

O LCP passou a medir a fotografia, enquanto antes o maior candidato era o título sobre o canvas. A métrica simulada aumentou e a meta <2.5s NÃO foi atingida (2.786s). Preload antecipou a descoberta da imagem; não ocultamos a foto nem alteramos dimensões para excluir seu custo do LCP. O resultado não deve ser apresentado como melhora de todas as métricas. As metas de Performance >=90, acessibilidade >=95 e CLS <0.1 passaram.

Paisagem mobile auditada a 852x393 / DPR 1: 100/100, LCP 1.058s, TBT 12ms, CLS zero, sem renderer WebGL nem worker. A diferença de tamanho/candidato impede compará-la diretamente ao retrato.

Na extração inicial, a entrada assíncrona do controlador produziu nota desktop 99. O carregamento adicional foi removido; a auditoria final voltou a 100/100 com LCP e CLS iguais à baseline. Capturas finais mostram a mesma composição alpina; a timeline e os módulos de câmera/terreno/atmosfera não foram alterados.

## Checks executados

- npm run build: passou (Next 16.4.3, Turbopack; rotas estáticas).
- npm run lint: passou, sem avisos.
- npm run typecheck: passou.
- git diff --check: passou.
- node scripts/verify-mobile-photo.mjs: passou. Lê as auditorias desta revisão e valida ausência dos recursos 3D em retrato/paisagem, presença do renderer desktop, ausência da foto mobile no desktop, redução de JS, orçamento de CLS, timeline desktop e fontes de conteúdo protegidas.
- Tokens @theme comparados à revisão e4a74ec: idênticos. Sem diff em src/lib/site.ts, src/data e módulos originais Three/câmera/terreno/atmosfera.
- Chrome nativo em janela visitante: hero em 393x852, 360x852 e 414x852, sem cortes visíveis; fotografia, título e CTA legíveis.
- Scroll por teclado atravessou o conteúdo editorial sem a antiga apresentação presa e sem overlay de contato.
- Menu aberto por teclado em 393px recebeu foco no Fechar. Navegação por Tab até Serviços fechou o menu, devolveu foco ao Menu e atingiu #servicos com título/CTA legíveis.
- O CTA original abriu a página de mensagem pré-preenchida do WhatsApp; nenhuma mensagem foi enviada. O número continua ausente no ambiente local, conforme a configuração anterior; não foi inventado contato.
- Save-Data:on ativado no DevTools e recarga em 414px: classe mobile-static-motion confirmada, foto mantida e ausência de world-ready. A condição desliga a animação e as revelações mobile.
- Fotos/rede e desktop foram validados por Lighthouse; seu screenshot final foi exportado dos relatórios sem edição. Arquivos em docs/mobile-photo/*-before.jpg e *-after.jpg.

## Limites da validação

O host de automação de abas continuou indisponível. A interface nativa do Safari foi consultada, mas não havia modo responsivo habilitado; não alteramos preferências do usuário. A inspeção responsiva foi feita no Chrome. NÃO houve teste em Safari físico/iPhone conectado; 60fps e INP <200ms no aparelho relatado ainda não estão certificados. TBT não substitui INP.

O teste de rede observa o carregamento auditado em cada modo, não cada gesto de uma sessão longa ou todos os ciclos de rotação. O código desmonta contextos/listeners e nunca monta o renderer no ramo mobile. Ainda convém testar no iPhone real: barra retrátil do Safari, inércia, rotação, alternância de aba, menu e lightbox. Não declarar uma matriz física completa a partir de emulação.

## Teste e rollback

1. npm run build
2. npm run start -- --hostname 127.0.0.1 --port 3204
3. Reexecutar Lighthouse nas configurações registradas nos JSONs antes de usar os relatórios para avaliar outra versão.
4. node scripts/verify-mobile-photo.mjs

Commits isolados permitem revert por etapa. Para falha na animação mobile, manter a fotografia estática e o scroll nativo. Não reintroduzir o 3D mobile como fallback. A retirada do contato flutuante é independente. Para regressão desktop, reverter o commit específico da fronteira/controlador; não usar reset destrutivo das alterações do usuário.

Nenhum push ou deploy foi realizado. O site público não muda até publicar estes commits.
