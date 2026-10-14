# Validação da viagem alpina

Implementação procedural, sem dados geográficos externos. Canvas fixo com cinco
atos, duas splines, luz variável, névoa, neve, isolinhas, rota e quatro marcadores.
O conteúdo editorial e as fotografias foram preservados. O único ajuste de
contraste adicional foi escurecer o vidro do chip sobre o retrato.

## Critérios de aceite

| Critério | Resultado observado |
|---|---|
| Lint, TypeScript e build | Os três passaram; zero novos warnings. [Checks](checks.json). |
| Cinco atos, ida e volta | Progresso retornou a 0,0000 no desktop/tablet e 0,0001 no mobile. Fade final chegou a zero. Sem pin ou scroll extra. |
| Profundidade, luz e atmosfera | Vista ampla, descida entre cristas, voo pelo vale e subida ao pico documentados nas capturas abaixo. [Mundo isolado](milestone-g.png). |
| Axe e contraste | Zero violações nos 15 estados, tags WCAG 2 A/AA e 2.1 AA. Checagem adicional por pixels: mínimo 4,61:1. |
| Console e overflow | Zero erros/warnings de console e zero overflow em 390, 820 e 1440 px, inclusive após voltar ao início. |
| LCP e CLS | Medidos antes/depois e em A/B pareado. CLS zero em todas as navegações. A série histórica variou para cima; a piora não se reproduziu no A/B. Ver números e limites abaixo. |
| Desktop high | 60,0 fps durante scroll, DPR 1,5. CPU e GPU observadas dentro do orçamento de 16 ms. |
| Mobile médio físico | **Não verificado:** não havia aparelho conectado. Emulação 390 px, DPR 1,25 e CPU 4×: 58,9 renders/s durante scroll, zero renders em repouso. A GPU continua sendo a do desktop. |
| Fallbacks | Reduced motion desktop/mobile, WebGL desativado, aparelho fraco, perda de contexto e erro de renderização: site intacto, CTA visível, fundos originais, zero canvas/contextos vivos. |
| Qualidade adaptativa | RAF artificialmente limitado a cerca de 20 fps percorreu high → medium → low → fallback; DPR reduziu antes de cada troca. |
| Desmontagem | Três ciclos e navegação SPA no mesmo documento: zero contextos, triggers e workers do mundo; buffers/programas descartados. Detalhes abaixo. |
| Copy | `src/lib/site.ts` idêntico byte a byte; texto do main normalizado idêntico nas três larguras. [Comparação](copy-check.json). |
| README | Arquitetura, tiers, ajustes de câmera/rota, alternativas de atmosfera e dependências documentados. Sem fonte/licença de elevação externa. |

## Capturas finais

![Cinco atos em desktop](journey-1440.png)

![Cinco atos em mobile](journey-390.png)

| Largura | Hero | Sobre | Serviços | Faixa do mapa | Contato |
|---|---|---|---|---|---|
| 1440 | [Imagem](final-1440-dawn.png) | [Imagem](final-1440-valley.png) | [Imagem](final-1440-route.png) | [Imagem](final-1440-summit.png) | [Imagem](final-1440-silence.png) |
| 820 | [Imagem](final-820-dawn.png) | [Imagem](final-820-valley.png) | [Imagem](final-820-route.png) | [Imagem](final-820-summit.png) | [Imagem](final-820-silence.png) |
| 390 | [Imagem](final-390-dawn.png) | [Imagem](final-390-valley.png) | [Imagem](final-390-route.png) | [Imagem](final-390-summit.png) | [Imagem](final-390-silence.png) |

Sem 3D: [desktop reduced motion](fallback-reduce.png),
[mobile reduced motion](fallback-reduce-mobile.png),
[WebGL desativado](fallback-disable-webgl.png),
[aparelho fraco](fallback-weak.png), [erro simulado](fallback-render-error.png),
[perda de contexto](fallback-context-loss.png).

## Sete marcos

Cada marco teve `npm run build` concluído antes de abrir a versão de produção
para captura e medição de três segundos. DPR 1, viewport 1440 × 1000, Chrome
headless no macOS. FPS contado por chamadas de desenho do terreno, com uma
chamada por frame. Valores próximos/acima de 60 refletem fronteiras da janela
de medição e o relógio de uma tela de 60 Hz.

| Marco | Build | FPS | CPU de render, amostra | Captura |
|---|---|---:|---:|---|
| A — terreno, hillshade, neve | passou | 59,85 | 0,18 ms | [Imagem](milestone-a.png) |
| B — atmosfera e luz | passou | 59,85 | 0,28 ms | [Imagem](milestone-b.png) |
| C — câmera e scroll | passou | 60,20 | 0,25 ms | [Imagem](milestone-c.png) |
| D — rota e marcadores | passou | 60,15 | 0,58 ms | [Imagem](milestone-d.png) |
| E — seções e contraste | passou | 60,13 | 0,27 ms | [Imagem](milestone-e.png) |
| F — tiers e fallback | passou | 59,86 | 0,31 ms | [Imagem](milestone-f.png) |
| G — polimento | passou | 59,75 | 0,44 ms | [Imagem](milestone-g.png) |

Os JSON `a-metrics.json` a `g-metrics.json` guardam as medições. No marco D,
a contagem inicial incluía também o tube; foi corrigida para duas chamadas por
frame naquela captura. As medições seguintes contam apenas o terreno.

Trem, partículas, DOF e pós-processamento não foram adicionados. A direção de
arte prioriza as fotos e o movimento de câmera; a atmosfera usa planos e seis
amostras no high, planos no medium e somente height fog no low. Não houve
tentativa de forçar volumetria completa em mobile.

## Desempenho final

Chrome headless, viewport correspondente, `deviceScaleFactor: 2`; capacidade
declarada de oito núcleos/8 GB para selecionar os tiers de forma reproduzível.
Desktop/tablet sem throttling; mobile com CPU 4× mais lenta via CDP. Uma
trajetória senoidal de scroll de oito segundos percorreu o conteúdo e voltou,
sem incluir o trecho em que o canvas já está apagado. P95 é o intervalo entre
callbacks de RAF; uma tela de 60 Hz apresenta frames a cada 16,67 ms.

| Viewport/tier | DPR | Renders/s ao rolar | P95 RAF | CPU de render¹ | GPU¹ | Renders em 3 s parado |
|---|---:|---:|---:|---:|---:|---:|
| 1440/high | 1,5 | 60,04 | 16,8 ms | 0,235 ms | 3,941 ms | 180 |
| 820/medium | 1,35 | 60,04 | 16,8 ms | 0,187 ms | 2,265 ms | 181 |
| 390/low, CPU 4× | 1,25 | 58,86 | 16,7 ms | 0,461 ms | 0,811 ms | 0 |

¹ Amostras da última janela de um segundo do trecho. CPU mede atualização e
submissão de render; GPU usa queries assíncronas
`EXT_disjoint_timer_query_webgl2`. Não são percentis de todo o pipeline do
navegador nem uma garantia de desempenho em qualquer GPU.

Uma primeira rodada teve 51,8 fps no scroll desktop. Duas passagens adicionais
registraram 60,10 e 60,12 fps, sem frames acima de 50 ms ou long tasks; o fallback
estático registrou 60,12 e 60,03. A rodada final também ficou em 60,04 fps.
O resultado anômalo foi preservado no histórico da conversa; os resultados
reproduzidos estão em [scroll-performance.json](scroll-performance.json) e
[verification.json](verification.json).

## LCP e CLS

Produção local, CPU 4×, DPR 1, contextos de navegador novos, servidor de imagens
aquecido, sem throttling de rede. Três navegações por largura; observação por
seis segundos após load. Valores abaixo são medianas, em milissegundos.

| Largura | Baseline inicial sem mundo | Rodada final | A/B estático contemporâneo | A/B mundo com frame confirmado |
|---|---:|---:|---:|---:|
| 1440 | 496 | 844 | 904 | 836 (2 amostras) |
| 820 | 1988 | 2104 | 1984 | 1948 (3 amostras) |
| 390 | 1424 | 1656 | 2128 | 1664 (3 amostras) |

O aumento histórico foi de 348/116/232 ms. O A/B alternou a ordem entre o mesmo
build com fallback por capacidade declarada de dois núcleos e com mundo por
oito núcleos; o throttling real continuou igual. A comparação contemporânea não
reproduziu uma piora pelo 3D. Isso não demonstra ganho causado pelo 3D nem
ausência estatística de regressão: a amostra local é pequena e houve variação
entre navegações.

No A/B, oito das nove navegações com mundo confirmaram o primeiro frame entre
3,70 e 4,65 s; uma não detectou o frame dentro da janela de seis segundos e está
explicitamente fora da mediana de canvas confirmado. Todos os LCPs foram
fotografia ou parágrafo, antes do mundo. CLS foi **0 em todas as séries**.
Dados completos: [vitals.json](vitals.json),
[paired-vitals.json](paired-vitals.json), [paired-summary.json](paired-summary.json).

Para fechar o critério de ausência de piora perceptível em produção, ainda é
necessário observar um aparelho médio real e uma rede representativa. As
medições locais não foram tratadas como garantia dessa condição.

## Contraste e acessibilidade

O axe retornou zero violações nos quinze estados; deixou entre 20 e 31 nós de
contraste como `incomplete`, por causa de transparências/canvas. Esses casos
receberam checagem adicional: captura com preenchimento de texto transparente,
amostragem dos fundos sob retângulos de linhas a cada dois pixels, composição
da cor/opacidade do texto e cálculo de luminância WCAG. Foram incluídos links
inativos e legendas visuais; sr-only e texto invisível foram excluídos.

Os limites usados foram 4,5:1 para texto normal e 3:1 para texto grande. O mínimo
observado foi **4,61:1**, no rodapé; Hero desktop ficou em 5,49:1. O chip sobre
o retrato havia atingido 2,67:1 e recebeu vidro marrom a 82%. Sobre usa painel
creme a 96%; cards continuam opacos; título e parágrafo têm gradientes protetores.
O método por retângulo é conservador e não substitui uma auditoria humana de
todo frame intermediário. [Resultados por trecho](contrast.json).

Canvas é decorativo, `aria-hidden`, `tabIndex=-1` e sem eventos de ponteiro.
Os links, botões, menu e skip link originais permanecem na mesma ordem.

## Fallback e descarte

[fallback.json](fallback.json) registra seis casos: nenhum deixou canvas,
contexto WebGL vivo, overflow ou erro; título e CTA permaneceram visíveis com
fundo `rgb(61, 37, 33)`. Reduced motion não monta o canvas.
[adaptive-quality.json](adaptive-quality.json) registra a redução sob RAF
artificialmente lento, até retornar ao fundo estático.

Três ciclos reduced motion/no-preference descartaram 22 buffers e cinco
programas por ciclo. A navegação SPA para uma rota temporária válida manteve a
identidade do documento e levou o total a 88 buffers e 20 programas descartados,
com zero contextos, workers e ScrollTriggers do mundo. A rota temporária foi
removida; o build entregue contém apenas as rotas originais.

O listener de visibilidade do loader foi removido. Um listener global do
ScrollTrigger compartilhado e um IntersectionObserver do Next sem alvos
permaneceram, como infraestrutura global; não apontam para o mundo desmontado.
A aba oculta registrou zero desenhos. Evidências:
[lifecycle.json](lifecycle.json), [listener-ownership.json](listener-ownership.json).
Isso verifica os recursos observados; não é um perfil de heap de longa duração.
