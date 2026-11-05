# Validação do lettering mobile — 05/11/2026

Direção escolhida: editorial marcante, com abertura expressiva e títulos breves. Refinamento limitado à apresentação mobile existente; identidade, conteúdo, fontes, cores e layout preservados.

## Evidência visual e funcional

- Inspeção do hero e das seções Sobre e Serviços em 390 px, incluindo quadros intermediários da abertura. Máscaras com espaço para acentos; título inicial mantém duas linhas e ação permanece disponível durante a sequência.
- Chrome headless em 360, 390, 414, 667 (paisagem), 820 (touch) e 1440 px. Sem erros de página ou overflow horizontal. CLS observado: 0 em cada cenário.
- Menu → Serviços, seleção de categoria → atualização da contagem, abertura da fotografia → Escape e presença do destino do CTA verificados nas larguras mobile. Nenhuma mensagem externa foi enviada.
- Títulos animam uma vez ao entrar na área de leitura; voltar a uma seção não repete a animação. Spans temporários e rótulos auxiliares são removidos ao terminar.
- Nome acessível completo do h1 confirmado na árvore de acessibilidade durante a animação, sem fragmentar o anúncio em palavras.
- Redução de movimento, economia de dados, ausência da Web Animations API e JavaScript desativado mantêm o título visível. Ausência de IntersectionObserver verificada isoladamente no helper, pois o cabeçalho preexistente depende dessa API.
- Ocultar a aba encerra as animações e restaura o texto. Trocar de mobile para desktop durante uma animação pausada também limpa máscaras e rótulos.
- Comparação exata antes/depois em 390 e 1440 px, com redução de movimento: conteúdo dos oito títulos, posição, dimensões, fonte, tamanho, entrelinha, espaçamento e cor idênticos. Em desktop normal não houve chamadas ao lettering mobile.

## Build de produção e desempenho

`npm run typecheck`, `npm run lint`, `npm run build` e `git diff --check` passaram. Build final servido localmente com `next start` e novamente verificado com preferências, fallback sem JS e mudança de breakpoint.

Na abertura mobile de produção em 390 × 844 px, Chrome headless na máquina de desenvolvimento:

| Medida | Resultado |
| --- | --- |
| CLS observado | 0 |
| Tempo somado de criação das animações das palavras | aproximadamente 0,4 ms |
| Intervalo entre quadros p95 na amostra inicial | 16,8 ms |
| Máscaras restantes após conclusão | 0 |
| Erros de página | 0 |

Esses valores descrevem a amostra local, sem throttling de CPU, e não comprovam desempenho em um aparelho físico. Safari/iOS real não foi executado nesta etapa.

Sem novas dependências, medição de linhas, animação de propriedades de layout, scroll listener ou ticker adicionados. As máscaras são estáticas; apenas transform e opacity mudam nas palavras. As regras novas de interação usam exclusivamente o breakpoint mobile do projeto.
