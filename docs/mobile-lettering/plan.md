# Lettering mobile — plano de design e implementação

## Contexto confirmado

Curadoria de viagens na Suíça para público de língua portuguesa. O fluxo é conhecer a proposta, reconhecer a consultora, comparar serviços, explorar paisagens e iniciar uma conversa pelo WhatsApp. A identidade editorial, o conteúdo, as fontes Cormorant Garamond/Manrope, as cores e todos os destinos de links permanecem existentes.

## Três direções

1. **Editorial com máscaras — escolhida pelo responsável em 05/11/2026.** O título inicial chega em uma sequência curta de palavras, recortadas por máscaras tipográficas. Títulos de seção retomam essa linguagem com menor deslocamento e duração. Nomes de serviços recebem apenas uma pontuação discreta. Mantém a leitura contínua e dispensa medições de linhas.
2. **Revelação por linhas.** Próxima da linguagem desktop, mas exige recalcular máscaras após fontes e rotação, com maior risco de recortar acentos ou provocar recomposição no Safari. Preservada apenas no desktop já existente.
3. **Cinética por caracteres.** Mais enfática, mas fragmenta a leitura, multiplica elementos e chama atenção em excesso para uma proposta de atendimento pessoal. Não adotada.

## Hierarquia, composição e movimento

O foco autoral é “A Suíça além do roteiro.” sobre a paisagem real já selecionada. A sequência não atrasa o CTA nem altera a fotografia. Os h2 orientam a leitura entre seções; os h3 identificam serviços. Parágrafos, navegação e botões preservam seus comportamentos atuais.

- Hero: 620 ms por palavra, intervalo 45 ms limitado a 180 ms, deslocamento de 105% por uma máscara estática. Sequência completa em até 840 ms, sem bloquear a ação.
- Seções: 460 ms, intervalo 28 ms limitado a 112 ms, deslocamento de 80%. Serviços: 340 ms, intervalo 22 ms limitado a 44 ms, deslocamento de 55%.
- Desaceleração comum: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Tipografia e quebras continuam a cargo do layout responsivo existente. Cada máscara acompanha apenas uma palavra, com folga de tinta para acentos. Sem recálculo de linhas, animação de tamanho ou espaçamento.
- Feedback: pressão de CTA em 140 ms, filtros em 120–180 ms e abertura do lightbox em 240 ms. A seleção mantém feedback de cor com redução de movimento, sem deslocamento.

## Implementação incremental

1. Registrar plano e baseline, conferir repositório e autoria Git.
2. Adicionar helper mobile com Web Animations API e IntersectionObserver; marcar somente títulos elegíveis. Não alterar a arquitetura nem os controladores desktop.
3. Criticar visualmente, refinar e validar build, lint, tipos, desempenho e fluxos mobile.

Sem dependências novas, scroll listeners, scrub, pin ou render loop. Cada entrada executa uma vez. Evitar revelar o bloco pai simultaneamente ao lettering. O conteúdo começa visível e permanece legível se scripts ou APIs de animação falharem. `prefers-reduced-motion` e `saveData` mantêm títulos estáticos; abas ocultas encerram animações. As palavras temporárias são removidas ao terminar cada título, liberar memória e devolver o texto original. Cleanup também restaura texto e semântica antes de trocar para desktop. O nome acessível do título permanece completo, sem soletração.

## Crítica e refinamento — 05/11/2026

A implementação anterior deslocava as palavras entre .16 e .32 em, já com opacidade de .65 a .85: no celular, a entrada podia passar despercebida. A versão atual dá ao hero uma entrada completa pelo recorte, reservando durações menores para orientação entre seções. A inspeção de quadros intermediários em 390 px confirmou as duas linhas do título, a folga dos acentos e o CTA disponível durante a abertura. Serviços mantêm a composição aberta e as ações junto das descrições.

O refinamento também remove os spans após cada entrada e ao ocultar a aba. O suporte a redução de movimento preserva o feedback de seleção dos filtros e elimina deslocamento na pressão dos controles. As regras visuais novas usam exclusivamente o breakpoint mobile já existente: até 767 px, ou até 1023 px em dispositivo de ponteiro grosso sem hover.

## Teste e rollback

Comparar Lighthouse mobile e desktop da mesma build/configuração; verificar largura, quebra, acentos, foco, menu e WhatsApp em 360/390/414/768 px. Validar preferências de movimento, retorno às seções e mudança de orientação. Safari real no iPhone 14 Pro continua sendo confirmação física do usuário; emulação não prova 60 fps nesse aparelho.

Reverter apenas os commits desta etapa desativa o lettering e devolve os reveals leves anteriores. A fotografia mobile, o scroll nativo e a ausência do CTA flutuante permanecem preservados.
