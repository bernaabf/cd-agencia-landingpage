# Galeria de paisagens — decisões e validação

Implementado em 31/10/2026 no projeto existente, sem publicação ou alterações de contatos reais.

## Auditoria e integração

- Next.js 16.4 (App Router), React 19, TypeScript, Tailwind 4, GSAP 3 e Lenis já instalados; orientações locais de Image e lazy loading lidas antes da implementação.
- Uma home em `src/app/page.tsx`, com Hero → About → Services → Contact. Galeria inserida entre About e Services.
- O único canvas permanece em `AlpineWorld`; HeroStage usa sticky nativo e uma timeline de ScrollTrigger compartilhada com o progresso da câmera.
- Fontes mantidas: Cormorant Garamond para títulos e Manrope para interface. Cores mantidas: #2a1815, #3d2521, #5b3425, #fbf8f4, #c8b4a0.
- A grade assimétrica usa duas colunas a partir de 640 px e uma abaixo disso, com proporções reservadas e legendas sempre visíveis.
- Novos controles reutilizam `whatsappLink` e `site.whatsappNumber`, de `NEXT_PUBLIC_WHATSAPP_NUMBER`. Nenhum contato foi inventado.
- Sharp adicionado apenas a devDependencies; nenhuma biblioteca nova de galeria ou animação.

## Decisões conservadoras

1. Hero fotográfico e panorama pinado opcionais omitidos. O herói 3D continua como abertura; a galeria não cria canvas nem pin.
2. Revelação e troca de filtros usam fade, translate e scale em GSAP, sem Flip, blur animado ou clip-path animado. Máscaras dos cartões são estáticas (`overflow: hidden`). Timelines e gatilhos são revertidos com os contextos de GSAP/matchMedia.
3. O herói passou de 350svh para 720svh: percurso efetivo de 250 para 620 alturas de viewport (2,48×). O texto permanece completamente visível entre 28% e 47% do percurso, e credenciais/CTA entre 60% e 73%. Transições menores, easing suave, scrub 1,1 e botão de avanço em 2,2 s. Usuário mantém controle da leitura.
4. O retrato usa somente transform na transição. A câmera não recalcula curvas quando o progresso fica parado. A sondagem descartável de contexto WebGL foi substituída por detecção da API; o canvas real continua protegido pelo tratamento de falhas existente. `compileAsync` prepara shaders antes da primeira revelação, usando compilação paralela quando disponível.
5. Modal nativo `<dialog>`: fundo inerte, foco contido pelo navegador, retorno ao cartão, Escape, setas e swipe; Lenis e overflow são restaurados ao fechar. Lightbox carregado sob demanda; apenas vizinhas são pré-carregadas.
6. `prefers-reduced-motion` conserva todo o texto do herói no fluxo, sem pin, zoom ou transições espaciais. O lightbox desativa fade; filtros continuam funcionais.
7. Sem autoplay, sem novo loop de renderização ou assinatura contínua de scroll na galeria. Espaço das imagens reservado; refresh após filtros, não após cada download.
8. Lago de Lucerna representa a categoria Cidades, por incluir construções da margem; Sils representa Montanhas. Todos os 12 lugares sugeridos foram cobertos, sem substituições de destino.

## Imagens e reprodução

- 12 fotografias de origem com lado maior ≥2400 px; dimensões e URLs originais registradas em `src/data/paisagens-fontes.json`.
- Masters locais de 2400 px (`public/images/paisagens/<id>.jpg`), 180 variantes em 480, 768, 1080, 1600 e 2400 px e três formatos (AVIF/WebP/JPEG), e 12 LQIPs de 24 px.
- `<picture>` seleciona AVIF, depois WebP; o elemento de imagem é sempre `next/image`, com loader JPEG local, `sizes`, lazy loading e blur. Nenhum hotlink no carregamento das fotos.
- Qualidade inicial: AVIF 58, WebP 78, JPEG 80; qualidade adaptada apenas se necessário ao limite mobile. Todas as 108 variantes até 1080 px foram verificadas; máximo de 147,5 KB por arquivo.
- Masters e versões em alta resolução ficam disponíveis para o script/lightbox, com pesos maiores; não entram como imagens prioritárias da galeria.
- Regenerar a partir dos masters versionados: `npm run imagens:otimizar`.
- Para novos originais já baixados: `npm run imagens:otimizar -- --preparar /caminho/dos/originais` (arquivos `<id>.jpg`). O script é sequencial para limitar memória/CPU e falha se o orçamento mobile for excedido.
- Fontes e licenças também aparecem no rodapé da galeria, em cada lightbox e em `public/images/paisagens/CREDITOS.md`. As variantes conservam a licença de cada foto; recorte, redução e compressão declarados. As licenças das fotos não se estendem à marca ou ao código do site.

## Fotografias

| Lugar | Autor | Fonte e original | Licença |
| --- | --- | --- | --- |
| Matterhorn | Ximonic (Simo Räsänen) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Matterhorn_as_seen_from_Zermatt,_Wallis,_Switzerland,_2012_August.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Vale de Lauterbrunnen | Marine4 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lauterbrunnen_valley_mid_summer.jpg) | [Public domain](https://creativecommons.org/publicdomain/mark/1.0/) |
| Grindelwald | MartySwissCH | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Wetterhor,_Mettenberg,_and_Grindelwald-First_Cable_Cars_(view_from_Eggboden_Road)_-_Summer_2022.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Lago de Lucerna | OlhaSolodenko | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lake_Lucerne_in_Lucerne_city.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Lavaux e Lago Léman | Lorenz Poffet | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lavaux_Switzerland.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Castelo de Chillon | SimonWaldherr | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Chillon_Castle_08.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Glaciar de Aletsch | Seba3mmm | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Aletsch_Glacier_view.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Viaduto Landwasser | Kabelleger / David Gubler | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:RhB_Ge_4-4_II_614_Glacier_Express_on_Landwasser_Viaduct.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Lago de Sils | Tiia Monto | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Sils_im_Engadin_-_Silsersee.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Lago Oeschinen | Martin Thurnherr | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Oeschinensee_0437.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Iseltwald e Lago Brienz | Sidharthmittal13 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Iseltwald_sidharthmittal13.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Lago de Lugano | Samuel Ferrara | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lake_Lugano_Panorama.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |

## Validação

- `npm run build`: passou (Turbopack, build de produção e geração estática).
- `npm run lint`: passou, sem avisos novos.
- `npm run typecheck`: passou.
- `git diff --check`: passou.
- Verificação dos arquivos: 12 fotos, 180 variantes com dimensões esperadas, 12 placeholders válidos e orçamento mobile atendido.
- Safari desktop: filtro Lagos retorna quatro paisagens; abertura do lightbox, navegação por seta direita, Escape e retorno à galeria confirmados. Diálogo expõe apenas seus controles na árvore de acessibilidade enquanto aberto.
- Auditorias de acessibilidade em 360, 768, 1280 e 1920 px: 100/100, sem erros de runtime. A execução de 360 px usou `--force-prefers-reduced-motion`; captura confirmou herói com texto e retrato no fluxo, sem canvas.
- Grade de 768 px inspecionada visualmente; cenário 3D visível na captura de produção desktop. Capturas de página inteira têm limitações de rasterização com sticky/canvas e conteúdo fora da viewport.
- Swipe implementado, mas não foi exercitado em aparelho físico. Interação de teclado foi exercitada no Safari desktop, não nas quatro larguras.

### Lighthouse 13.6 — produção local

| Métrica | Mobile (412 px) | Desktop (1280 px) |
| --- | --- | --- |
| Performance | 97 | 100 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 1,1 s | 0,3 s |
| CLS | 0,023 | 0 |
| TBT | 200 ms | 0 ms |

Relatórios completos: `docs/validacao/lighthouse-mobile.html` e `lighthouse-desktop.html`. Valores legíveis por máquina, versões e horários UTC em `lighthouse-resumo.json`.

Não há medição comparável do site original antes da alteração. Uma medição intermediária motivou a revisão do WebGL; foi descartada como comparação porque havia outros testes concorrentes. As medições finais de performance foram feitas sequencialmente. LCP e CLS atendem às metas em laboratório; INP exige dados de interação em campo e não é substituído pelo TBT.

## Arquivos criados

- `src/components/paisagens/GaleriaPaisagens.tsx`
- `src/components/paisagens/PaisagemCard.tsx`
- `src/components/paisagens/PaisagemImage.tsx`
- `src/components/paisagens/FiltroCategorias.tsx`
- `src/components/paisagens/Lightbox.tsx`
- `src/components/paisagens/Paisagens.module.css`
- `src/hooks/usePrefersReducedMotion.ts`
- `src/data/paisagens.ts`, `paisagens-fontes.json`, `paisagens-geradas.json`
- `scripts/otimizar-imagens.mjs`
- `public/images/paisagens/`: 12 masters JPEG, 180 variantes e `CREDITOS.md`
- `docs/galeria-decisoes.md` e três arquivos em `docs/validacao/`

## Arquivos alterados

- `src/app/page.tsx`, `globals.css`, `sitemap.ts`
- `src/components/world/HeroStage.tsx`, `CameraRig.tsx`, `AlpineWorld.tsx`, `AlpineWorldLoader.tsx`
- `src/lib/motion.ts`, `src/lib/world/quality.ts`
- `package.json`, `package-lock.json`: script e sharp como devDependency. Alterações preexistentes nesses dois arquivos preservadas.

## Pendências e limites

1. **TODO — configurar `NEXT_PUBLIC_WHATSAPP_NUMBER`** com o número aprovado e refazer o build. Sem ele, os novos CTAs da galeria levam a Contato. CTAs originais não foram alterados; seu helper atual gera `wa.me/` sem destinatário quando a variável está ausente.
2. Confirmar swipe, foco e fluidez em iOS/Android reais; Lighthouse não certifica a experiência em todos os dispositivos.
3. Medir INP e Core Web Vitals em produção com tráfego real. Metas de laboratório não garantem dados de campo.
4. Comparação Lighthouse antes/depois do site original não disponível.
