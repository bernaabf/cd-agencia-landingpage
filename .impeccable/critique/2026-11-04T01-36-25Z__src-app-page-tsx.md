---
target: homepage mobile
total_score: 24
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:/Users/bernardoferreira/Documents/CD - Agência de Turismo/Code/cd-agencia-landingpage/src/app/page.tsx"
target_fingerprint: "sha256:365781a07eea5c8e1f673a8f491e222fe775ff13caf51d57359dabae511bc8a1"
target_path: /Users/bernardoferreira/Documents/CD - Agência de Turismo/Code/cd-agencia-landingpage/src/app/page.tsx
timestamp: 2026-11-04T01-36-25Z
slug: src-app-page-tsx
---
Method: dual-agent (A: critique_design · B: critique_detector)

Alvo: src/app/page.tsx. Modo Persuade/Experience. Identidade específica: paisagem alpina autoral, fotografias reais e tipografia editorial. Preservar.

| Heurística | Nota | Evidência |
|---|---:|---|
| Estado | 3 | Contagem e progresso |
| Mundo real | 4 | Conteúdo coerente |
| Controle | 3 | Saída disponível, jornada longa |
| Consistência | 3 | Hover touch |
| Prevenção | 3 | Contato depende de env |
| Reconhecimento | 3 | CTA inicial no menu |
| Eficiência | n/a | Landing page |
| Estética | 3 | Hierarquia boa; abertura longa |
| Recuperação | 2 | Guarda 4s |
| Ajuda | n/a | Landing page |
| Total | 24/32 | Bom, provisório |

Detector: 37 advisory (29 font-size, 5 color, 3 radius), sem bloqueantes. Divergências documentais não justificam trocar identidade. Sem browser/overlay atual disponível.

Forças: identidade; serviços em linhas abertas com CTA próximo; galeria com legendas, filtros, Escape e foco.

Prioridades:
- P1: Lenis/ticker, SplitText, máscaras e zoom desktop no touch. Aplicar animate: scroll nativo e transform/opacity mobile.
- P1: hero 720svh com CTA após metade. Encurtar mobile preservando atos, contato existente ao polegar.
- P1: viewportFit e safe areas ausentes. Aplicar adapt em header, menu, hero, footer e diálogos.
- P2: will-change permanente, blur 12px e preload lightbox 1600px. Aplicar optimize.
- P2: controles sem largura mínima e refresh após fontes/imagens. Aplicar harden.

Casey: percurso e controles inferiores; Jordan: tempo até oferta; Sam: conferir foco/zoom final. Carga cognitiva editorial baixa, esforço temporal alto. Pico emocional alpino seguido de possível vale pela duração.

Observações: DPR low já 1.25; dynamic 3D, IO, visibilitychange e fallback já existem. Fontes locais latin/swap e imagens responsivas já existem.

Questions skipped: prioridades, escopo e limites explicitados pelo usuário.
