# Refinamento da copy — Carolina Décaillet

Foram alterados quatro arquivos de implementação: `src/lib/site.ts`, `src/components/Navbar.tsx`, `src/components/sections/About.tsx` e `src/components/sections/Services.tsx`.

A fonte central continua em `site.ts`. Navbar desktop e menu mobile usam o mesmo rótulo. Os nomes acessíveis dos botões acompanham seu texto visível, sem aria-label antigo sobrescrevendo-o. O link social de WhatsApp no rodapé continua com o rótulo acessível “Conversar pelo WhatsApp (abre em nova aba)” e usa a mensagem geral atualizada.

`layout.tsx` já usa `site.title` e `site.description` na metadata, Open Graph, Twitter e JSON-LD; por isso, não precisou ser editado. A imagem Open Graph preserva o título do hero, nome e cargo: seu texto continua coerente e não precisou mudar.

## Antes → depois

| Texto | Antes | Depois | Motivo |
|---|---|---|---|
| CTA da navbar (desktop e mobile) | Planeje sua viagem | Fale com a Carolina | Explicita o contato com a Carolina. |
| CTA do fechamento | Planeje sua experiência | Comece a conversa | Convida à conversa pelo WhatsApp. |
| CTA Concierge | Viaje tranquilo | Conheça o concierge | Troca slogan por ação. |
| CTA Transfert Privé | Reserve seu transfer | Solicite seu transfer | Evita prometer reserva imediata. |
| Esclarecimento do transfer | Sem esclarecimento | (transfer privativo) | Explica o nome em francês para visitantes brasileiros. |
| Título Sobre | Carolina Décaillet | Quem desenha a sua viagem | Apresenta quem desenha a viagem. |
| Assinatura Sobre | Nome como título | Carolina Décaillet (assinatura discreta abaixo do título) | Preserva o nome e sua presença na seção. |
| Texto Sobre | Sou turismóloga, atuo há 30 anos no turismo e vivo na Suíça desde 2012. Essa trajetória me permite apresentar o destino com conhecimento, cuidado e uma curadoria que vai além dos roteiros convencionais. | Sou turismóloga, tenho 30 anos de experiência no turismo e moro na Suíça desde 2012. Conheço o país por dentro, e é desse olhar que nasce uma curadoria que vai além dos roteiros convencionais. | Usa voz ativa, mantendo os fatos. |
| Title de SEO | Carolina Décaillet | Turismóloga e Curadoria de Experiências na Suíça | Carolina Décaillet | Viagem à Suíça com roteiro personalizado | Inclui viagem à Suíça e roteiro personalizado. |
| Description de SEO | Turismóloga com 30 anos de atuação no turismo e residente na Suíça desde 2012. Curadoria de experiências personalizadas, concierge e transfer privativo na Suíça. | Sua viagem à Suíça com roteiro personalizado, curadoria de experiências, concierge e transfer privativo. Carolina Décaillet, turismóloga. | Reúne os termos solicitados com naturalidade em 137 caracteres. |
| Mensagem geral do WhatsApp | Olá, Carolina! Vim pelo seu site e gostaria de planejar a minha experiência na Suíça. | Olá, Carolina! Vim pelo seu site e quero planejar uma viagem à Suíça.<br>Período previsto:<br>Quantas pessoas:<br>O que gostaria de viver: | Solicita período, pessoas e interesses. |
| Mensagem WhatsApp — Suíça Sob Medida | Olá, Carolina! Tenho interesse no serviço Suíça Sob Medida e gostaria de planejar a minha viagem. | Olá, Carolina! Vim pelo seu site e gostaria de conhecer o serviço Suíça Sob Medida para planejar minha viagem à Suíça.<br>Período previsto:<br>Quantas pessoas:<br>O que gostaria de viver: | Mantém o nome exato e pede informações adequadas ao serviço. |
| Mensagem WhatsApp — Concierge | Olá, Carolina! Tenho interesse no serviço Concierge para a minha estadia na Suíça e gostaria de saber mais. | Olá, Carolina! Vim pelo seu site e gostaria de conhecer o serviço Concierge para minha estadia na Suíça.<br>Período da estadia:<br>Quantas pessoas:<br>Em que gostaria de ter apoio: | Mantém o nome exato e pede informações adequadas ao serviço. |
| Mensagem WhatsApp — Transfert Privé | Olá, Carolina! Tenho interesse no serviço Transfert Privé e gostaria de reservar o meu transfer na Suíça. | Olá, Carolina! Vim pelo seu site e gostaria de solicitar o serviço Transfert Privé na Suíça.<br>Datas e horários previstos:<br>Trecho (origem e destino):<br>Quantas pessoas: | Mantém o nome exato e pede informações adequadas ao serviço. |
| Grafia do nome do serviço | Suíça sob medida | Suíça Sob Medida | Uniformiza apenas maiúsculas conforme a grafia exigida; preserva o nome. |
| Grafia do nome do serviço | Transfert privé | Transfert Privé | Uniformiza apenas maiúsculas conforme a grafia exigida; preserva o nome. |

## Perguntas para a Carolina

1. Para quem você trabalha melhor: casais, famílias, grupos ou quem faz a primeira viagem à Suíça?
2. O que o “suporte local” do Concierge inclui na prática?
3. O que acontece depois da primeira mensagem e em quanto tempo você costuma responder?
4. Existem depoimentos reais que você possa autorizar para o site?
5. “Transfert Privé” é uma escolha de marca ou pode ser “transfer privativo”?
6. Os pilares atuais repetem ideias do hero e do fechamento. Quais três aspectos do seu trabalho você gostaria de destacar de forma distinta? Mantive “Experiências personalizadas”, “Olhar local” e “Respeito ao seu ritmo” para evitar reinterpretar ou inventar diferenciais.

## Preservação da marca

Nenhum item da lista “NÃO altere” foi modificado em seu conteúdo: os dois títulos protegidos, o parágrafo do hero, os nomes dos serviços, suas frases de apoio e seus parágrafos descritivos, o nome, o cargo e os fatos “30 anos” e “desde 2012” foram preservados, assim como o tom solicitado.

Nos cards, apenas a capitalização de “Suíça sob medida” e “Transfert privé” foi uniformizada para as grafias exigidas na tarefa: “Suíça Sob Medida” e “Transfert Privé”. Não houve renomeação de serviço. Nenhuma informação comercial, destino, preço, prazo, avaliação ou promessa foi inventada.

Layout, classes e animações existentes foram preservados. Foram acrescentadas apenas as duas linhas de conteúdo solicitadas: assinatura abaixo do título Sobre e esclarecimento menor abaixo de Transfert Privé.

## Validação

- `npm run lint`: passou.
- `npx tsc --noEmit`: passou.
- `npm run build`: passou, com geração das oito páginas estáticas.
- Chrome: conferência visual em 390, 820 e 1440 px, incluindo título Sobre, cards, botões e menu mobile. Sem quebra de layout, cortes de texto ou overflow horizontal.
- axe-core: **0 violações** nos três tamanhos e também com o menu mobile aberto. O axe marcou alguns casos de `color-contrast` como inconclusivos, que exigem revisão manual; zero violações automáticas não significa uma auditoria manual completa.
- Nenhum erro de JavaScript observado no navegador.
- Links de WhatsApp inspecionados na página: mensagens com nomes corretos, acentos e quebras de linha `%0A`. A decodificação dos links recupera o texto original integralmente. Nenhuma mensagem foi enviada.
- Comparação programática com a versão anterior confirmou a preservação dos textos protegidos.
- Description: **137 caracteres**.
