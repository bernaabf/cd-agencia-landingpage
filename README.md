# Carolina Décaillet — site

Site institucional de **Carolina Décaillet · Turismóloga | Curadoria de Experiências na Suíça**.
Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · GSAP (ScrollTrigger + SplitText) · Lenis · Lucide.

## Rodar

```bash
npm install
cp .env.example .env.local   # preencha as duas variáveis abaixo
npm run dev                  # desenvolvimento
npm run build && npm start   # produção
npm run lint && npm run typecheck
```

## Configuração obrigatória (.env.local)

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número da Carolina com DDI + DDD, só dígitos. Alimenta todos os botões de WhatsApp (mensagem pré-preenchida por serviço). |
| `NEXT_PUBLIC_SITE_URL` | URL pública (ex.: `https://seudominio.com`). Usada em metadados, Open Graph, sitemap e robots. |

## Onde mexer

- `src/lib/site.ts` — **todo o copywriting**, serviços, links e mensagens do WhatsApp.
- `src/app/globals.css` — tokens de cor/tipografia (`@theme`), glassmorphism, estados iniciais das animações.
- `src/lib/motion.ts` — easings, durações, staggers e sequência de entrada do Hero.
- `src/components/MotionRoot.tsx` — todas as animações, dirigidas por atributos `data-*` (`data-split`, `data-reveal`, `data-mask`, `data-parallax`).
- `src/components/sections/*` — Hero, Sobre, Serviços, Contato/Rodapé.
- `public/images/*` — fotografias recortadas do material original (troque por arquivos originais em alta resolução mantendo os nomes).

## Animações e acessibilidade

- `prefers-reduced-motion`: sem Lenis, sem split/máscaras/parallax; conteúdo aparece direto.
- Parallax apenas a partir de 768 px. Animações só em `transform`, `opacity` e `clip-path`.
- Timelines, ScrollTriggers, SplitText e Lenis são revertidos na desmontagem (`gsap.matchMedia`).
- Menu móvel com foco gerenciado, `Esc`, trap de Tab e bloqueio de rolagem.

## Hero: palco alpino em 3D

O Hero é um palco de 350svh com uma viewport sticky de 100svh. A viagem inteira
acontece antes do Sobre; canvas e conteúdo pertencem à mesma seção. Não há
canvas fixo por trás do restante da página. A copy continua em `src/lib/site.ts`.

### Arquitetura e decisões

- `Hero.tsx` permanece Server Component: título, parágrafo, credenciais, CTA e
  retrato chegam no HTML, com uma única cópia de cada conteúdo.
- `HeroStage.tsx` é a fronteira client. CSS sticky controla o layout, sem pin
  artificial. Uma única timeline GSAP/ScrollTrigger, integrada ao Lenis existente,
  dirige câmera e camadas editoriais. Scrub e curvas contínuas dão o ritmo de voo.
- `progress.ts` guarda apenas o progresso transitório no cliente e notifica o
  renderer sem atualizar estado React a cada frame. Não importa Three.js.
- `AlpineWorldLoader.tsx` importa o mundo com `next/dynamic`, `ssr: false`, depois
  de 350 ms. Não espera o retrato do quarto ato. Verifica reduced motion,
  capacidade, economia de dados e WebGL2. IntersectionObserver e visibilidade
  pausam o desenho fora do palco ou em aba oculta.
- `AlpineWorld.tsx` usa um canvas R3F com `frameloop="demand"`, fade após o primeiro
  frame e fade final. Worker, materiais, textura, geometrias, instâncias, queries,
  subscriptions e contextos GSAP são descartados na desmontagem.
- `terrain.worker.ts` / `terrain.ts`: relevo determinístico com ridged fBm,
  domain warping, ravinas, vale e erosão térmica. Calcula normais e sombras por
  oclusão do terreno para três posições do sol, com até 16 amostras por raio.
  Buffers transferidos sem cópia. As sombras interpoladas são uma aproximação
  pré-calculada, sem shadow map em tempo real; assim evitamos outro render pass
  por frame no mobile. Objetos decorativos próximos usam silhuetas.
- `Terrain.tsx` / shader: hillshade direcional, oclusão, gradiente por altitude,
  linha de neve por altitude e inclinação, isolinhas antialias e height fog.
- `DepthLayers.tsx`: duas cadeias distantes em coordenadas 3D, mais pinheiros e
  rochas instanciados próximos. Junto das escarpas e do vale, formam quatro ou
  mais planos de profundidade. Silhuetas passam rapidamente no voo rasante.
- `Atmosphere.tsx`: céu e luz passam de amanhecer escuro à hora dourada e ao
  entardecer usando somente cores da marca. Névoa em planos compartilhados;
  integração adicional em seis amostras somente no tier high.
- `CameraRig.tsx` / `journey.ts`: splines Catmull-Rom para posição e olhar,
  proteção de altura sobre o terreno e FOV variável. Não criam outro ScrollTrigger.
- `Route.tsx`: tube amostrado sobre o relevo e marcadores instanciados, revelados
  por progresso entre 35% e 60%. Ao voltar a rolagem, o desenho se desfaz.

### Atos e ajustes

| Progresso | Conteúdo | Movimento |
|---|---|---|
| 0–12% | Eyebrow e título por máscara | Abertura e relevo emergindo |
| 12–35% | Parágrafo em vidro | Descida para o vale |
| 35–60% | Credenciais e CTA | Voo rasante e rota |
| 60–85% | Retrato por máscara | Subida até os picos |
| 85–100% | Fade para marrom profundo | Sticky termina antes do Sobre |

Os fades se sobrepõem brevemente entre os atos. Edite tempos em `HeroStage.tsx`,
percurso em `journey.ts`, relevo/neve em `world/tokens.ts` e a paleta em `globals.css`.
A altura da viewport sticky também define a distância do ScrollTrigger, para
não depender das mudanças da barra de endereço do navegador mobile.

### Qualidade e acessibilidade

| Tier | Terreno | DPR máximo | Névoa | Pinheiros |
|---|---:|---:|---|---:|
| high | 224 × 224 | 1,5 | height fog, 4 planos, 6 amostras | 68 |
| medium | 144 × 144 | 1,35 | height fog, 3 planos | 68 |
| low | 80 × 80 | 1,25 | height fog | 28 |

O tier low para em repouso. Custos observados de frame/GPU reduzem DPR primeiro,
depois o tier, até o fundo marrom estático. Os limites são alvos, não garantias de FPS.
Não há pós-processamento, assets geográficos externos nem dependências novas.

Sem JavaScript ou com reduced motion, o conteúdo fica em fluxo normal, com
fundo marrom profundo. Sem WebGL ou após falha, essa base sustenta
a sequência editorial. O 3D entra e sai em fade sobre ela, sem paisagem vetorial.
Canvas decorativo, sem foco ou eventos de ponteiro.
O CTA permanece na ordem de leitura: receber foco por teclado leva diretamente
ao seu ato. Há botão para avançar e link para pular a apresentação. Texto pequeno
usa vidro escuro para preservar legibilidade sobre as montanhas.

A validação desta versão está em [hero-stage.md](docs/alpine-world/hero-stage.md).
Os demais relatórios em `docs/alpine-world` são evidências históricas da versão
anterior e não representam a validação deste palco.
