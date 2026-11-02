# Refinamento editorial — 02/11/2026

## Produto e fluxo

Site institucional de Carolina Décaillet. Público e objetivo confirmados pelo responsável: pessoas de língua portuguesa interessadas na Suíça; conversão por conversa no WhatsApp. Não é um SaaS ou dashboard, portanto gráficos e indicadores não têm função neste conteúdo.

Fluxos preservados:

1. Conhecer a profissional → comparar serviços → abrir mensagem específica no WhatsApp.
2. Navegar até Paisagens → filtrar → ampliar → navegar por setas → fechar e recuperar o foco.
3. Abrir menu → escolher seção → retomar a navegação no conteúdo.

## Três direções consideradas

| Direção | Composição | Adequação e limite |
| --- | --- | --- |
| Editorial de viagem — escolhida | Fotografias abertas, títulos serifados, serviços em linhas e ações junto das descrições | Reforça a identidade atual e facilita comparar as ofertas sem adicionar caixas |
| Ateliê de curadoria | Retrato da Carolina como foco, blocos mais intimistas de leitura | Valoriza autoria, mas reduziria a presença dos destinos e repetiria o foco já presente no Sobre |
| Guia de destinos | Navegação e filtros com maior presença e densidade | Ajuda exploração, mas deslocaria o objetivo principal da curadoria personalizada para um catálogo |

## Composição e hierarquia

A abertura alpina continua como momento imersivo. Sobre apresenta a autoria; a galeria oferece contexto visual; Serviços permite avaliar a oferta; Contato oferece a próxima ação. O sistema preserva Cormorant Garamond e Manrope e todos os tokens cromáticos existentes.

A composição de referência foi gerada antes da implementação conforme preferência do responsável: [composicao-servicos.png](composicao-servicos.png). É um estudo visual; a implementação usa HTML, CSS e conteúdo real, sem aplicar a imagem como fundo.

Os títulos de Serviços e da galeria ganharam medidas mais amplas e espaçamento entre letras moderado. Pilares deixam de parecer botões elevados. Serviços deixam de competir em caixas claras repetidas e usam divisórias sobre a superfície marrom. Ações permanecem em creme, com hierarquia e contraste. Legendas da galeria saem de cima das fotografias.

## Primeira revisão e refinamento

- A primeira renderização confirmou a clareza das linhas abertas e apontou quebra pouco expressiva no nome do primeiro serviço; sua medida foi ajustada, sem mudar a fonte ou o texto.
- No mobile, cada serviço segue título → descrição → ação. As fotos da galeria usam proporção horizontal para reduzir o percurso de rolagem, com legenda fora da imagem.
- O contador do filtro torna seu efeito visível, além do anúncio para leitores de tela.
- Os links sociais agora têm nomes visíveis. A ação de contato aparece antes da faixa fotográfica, para ser encontrada sem rolar pela imagem.
- Corrigido o contêiner imediato de `next/image` na galeria: `picture` recebe posicionamento explícito, eliminando o aviso de pai estático.
- A instalação do Impeccable introduziu 282 avisos de lint em scripts de terceiros. Seus diretórios foram excluídos do lint da aplicação, mantendo as regras do código do site.

## Limites

Não houve alteração de branding, fontes, tokens de cor, fotografias, dependências ou código do mundo 3D. O componente compartilhado de botão recebeu ajustes de legibilidade, alvo mínimo e estados funcionais.

O ambiente local não fornece número de WhatsApp: os links existentes são gerados sem destinatário. A validação verifica a mensagem e a navegação, não uma conversa real. Configurar `NEXT_PUBLIC_WHATSAPP_NUMBER` no ambiente de publicação continua necessário; nenhum número foi inventado.

Resultados dos checks atuais e evidências visuais acompanham este diretório. Os relatórios anteriores em `docs/validacao/` não são medições desta alteração.

## Validação final

- `npm run lint`: passou, sem avisos.
- `npm run typecheck`: passou.
- `npm run build`: passou, com geração estática das oito páginas/artefatos.
- `git diff --check`: passou.
- axe-core no conteúdo principal: nenhuma violação automática WCAG 2 A/AA e WCAG 2.1 AA em 360, 390, 768, 1024, 1440 e 1920 px, com movimento reduzido.
- Nas seis larguras, a largura do documento corresponde à viewport; os três botões de serviço medem no mínimo 44 px de altura.
- Filtro Lagos: quatro fotos e contador correspondente; Enter abre o diálogo, seta direita muda a foto, Escape fecha e devolve o foco à origem.
- Menu e navegação para Paisagens testados em 320 × 740, 390 × 844, 844 × 390 e 1440 × 1000. Foco entra no diálogo e retorna ao botão ao fechar. A seção de destino respeita o cabeçalho.
- Com movimento normal, um canvas permanece na abertura e os serviços ficam visíveis após a navegação. Com movimento reduzido, não há canvas.
- Paleta global, configuração e arquivos de fontes, imagens da marca e código 3D verificados sem alterações contra o commit anterior.

Evidências: [validação detalhada](validacao.json), [serviços desktop](servicos-1440.png), [serviços mobile](servicos-390.png) e [legenda de paisagem no mobile](paisagem-mobile.png). Capturas da documentação omitem os controles de desenvolvimento e o cabeçalho fixo para não cobrir o conteúdo fotografado.

Esses testes não substituem uso em aparelho físico ou sessão com leitor de tela. Não houve nova medição Lighthouse nem promessa de ganho de conversão ou desempenho.
