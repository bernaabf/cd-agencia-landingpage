# Plano entregue antes da implementação

**Intenção:** uma viagem desenhada a partir de você. Um mundo fixo reage ao
scroll normal; fotografias e conteúdo editorial continuam em primeiro plano.

1. **Heightmap:** um worker gera relevo determinístico por ridged fBm com domain
   warping, vale sinuoso, escarpas e ravinas. Quatro passes de erosão térmica
   suavizam excessos; normais e curvatura alimentam a luz e a oclusão. Buffers
   transferíveis evitam cópia e trabalho de geração na thread principal.
2. **Shader:** hillshade direcional, altitude marrom/areia, neve nas cotas altas,
   oclusão leve nos vales e isolinhas antialias. Height fog exponencial e bordas
   dissolvidas; céu controlado pela paleta. Névoa em planos compartilhados e seis
   amostras somente no high. Sem dados geográficos reais ou nomes inventados.
3. **Câmera e narrativa:** duas Catmull-Rom, posição e look-at. Vista ampla no
   Hero, descida no Sobre, três desacelerações nos Serviços, subida na faixa do
   mapa e fade no Contato. ScrollTrigger com scrub e âncoras nas seções reais,
   usando o Lenis existente. Sem pin; percurso reversível e contínuo.
4. **Integração:** canvas fixo atrás do conteúdo. Hero/Serviços com gradientes
   protetores; Sobre com painel creme quase opaco e relevo nas margens; faixa
   preserva a fotografia; Contato volta ao marrom profundo. Só ativar os fundos
   translúcidos após o primeiro frame. Fallback restaura os fundos atuais.
5. **Orçamento:** high 224²/DPR 1,5, planos e névoa curta; medium 144²/DPR 1,35,
   planos sem integração; low 80²/DPR 1,25, height fog e repouso estático. Benchmark
   de 1 s ajusta DPR e tier. Reduced motion, WebGL2 ausente, aparelho fraco ou erro
   usam o site estático. Não começar com partículas, trem, DOF ou pós-processamento.
6. **Verificação:** sete marcos com build, screenshot e medição. Depois testar
   axe, contraste visual, 390/820/1440 px, ida e volta, LCP/CLS antes/depois,
   falhas simuladas e descarte ao navegar. Separar emulação de aparelho físico.
