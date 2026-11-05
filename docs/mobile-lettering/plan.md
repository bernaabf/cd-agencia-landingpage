# Lettering mobile — plano de design e implementação

## Contexto confirmado

Curadoria de viagens na Suíça para público de língua portuguesa. O fluxo é conhecer a proposta, reconhecer a consultora, comparar serviços, explorar paisagens e iniciar uma conversa pelo WhatsApp. A identidade editorial, o conteúdo, as fontes Cormorant Garamond/Manrope, as cores e todos os destinos de links permanecem existentes.

## Três direções

1. **Editorial em palavras — escolhida.** O título inicial chega em uma sequência curta de palavras, como uma frase apresentada pela curadora. Títulos de seção retomam essa linguagem com menor deslocamento e duração. Nomes de serviços recebem apenas uma pontuação discreta. Mantém a leitura contínua e dispensa medições de linhas.
2. **Revelação por linhas.** Próxima da linguagem desktop, mas exige recalcular máscaras após fontes e rotação, com maior risco de recortar acentos ou provocar recomposição no Safari. Preservada apenas no desktop já existente.
3. **Cinética por caracteres.** Mais enfática, mas fragmenta a leitura, multiplica elementos e chama atenção em excesso para uma proposta de atendimento pessoal. Não adotada.

## Hierarquia, composição e movimento

O foco autoral é “A Suíça além do roteiro.” sobre a paisagem real já selecionada. A sequência não atrasa o CTA nem altera a fotografia. Os h2 orientam a leitura entre seções; os h3 identificam serviços. Parágrafos, navegação e botões preservam seus comportamentos atuais.

- Hero: 560 ms por palavra, intervalo 35 ms limitado a 140 ms, pequeno deslocamento vertical. Sequência completa até 740 ms.
- Seções: 450 ms, intervalo 22 ms limitado a 100 ms. Serviços: 340 ms, intervalo 14 ms limitado a 50 ms.
- Desaceleração comum: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Tipografia e quebras continuam a cargo do layout responsivo existente; sem máscaras, recálculo de linhas, animação de tamanho ou espaçamento.

## Implementação incremental

1. Registrar plano e baseline, conferir repositório e autoria Git.
2. Adicionar helper mobile com Web Animations API e IntersectionObserver; marcar somente títulos elegíveis. Não alterar a arquitetura nem os controladores desktop.
3. Criticar visualmente, refinar e validar build, lint, tipos, desempenho e fluxos mobile.

Sem dependências novas, scroll listeners, scrub, pin ou render loop. Cada entrada executa uma vez. Evitar revelar o bloco pai simultaneamente ao lettering. O conteúdo começa visível e permanece legível se scripts ou APIs falharem. `prefers-reduced-motion` e `saveData` mantêm títulos estáticos; abas ocultas encerram animações. Cleanup restaura texto e semântica antes de trocar para desktop. O nome acessível do título permanece completo, sem soletração.

## Teste e rollback

Comparar Lighthouse mobile e desktop da mesma build/configuração; verificar largura, quebra, acentos, foco, menu e WhatsApp em 360/390/414/768 px. Validar preferências de movimento, retorno às seções e mudança de orientação. Safari real no iPhone 14 Pro continua sendo confirmação física do usuário; emulação não prova 60 fps nesse aparelho.

Reverter apenas os commits desta etapa desativa o lettering e devolve os reveals leves anteriores. A fotografia mobile, o scroll nativo e a ausência do CTA flutuante permanecem preservados.
