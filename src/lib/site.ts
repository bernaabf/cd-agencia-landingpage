/**
 * Fonte única de conteúdo e configuração do site.
 * Copy baseada no material original da Carolina Décaillet, com refinamentos
 * editoriais e mensagens de contato preparadas para o site.
 */

const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

export const site = {
  name: "Carolina Décaillet",
  role: "Turismóloga",
  tagline: "Curadoria de Experiências na Suíça",
  title: "Carolina Décaillet | Viagem à Suíça com roteiro personalizado",
  description:
    "Sua viagem à Suíça com roteiro personalizado, curadoria de experiências, concierge e transfer privativo. Carolina Décaillet, turismóloga.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  instagram: {
    handle: "cd_consultoriadeviagens",
    url: "https://www.instagram.com/cd_consultoriadeviagens/",
  },
  contactCta: "Fale com a Carolina",
  whatsappNumber,
} as const;

/** Link do WhatsApp com mensagem pré-preenchida. */
export function whatsappLink(message: string): string {
  const base = site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { id: "inicio", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "servicos", label: "Serviços" },
  { id: "contato", label: "Contato" },
] as const;

export const generalMessage =
  "Olá, Carolina! Vim pelo seu site e quero planejar uma viagem à Suíça.\nPeríodo previsto:\nQuantas pessoas:\nO que gostaria de viver:";

export const hero = {
  eyebrow: "Turismóloga | Curadoria de Experiências na Suíça",
  title: "A Suíça além do roteiro.",
  text: "Acredito que cada viagem deve refletir a forma de viver de quem a escolheu. Por isso, crio experiências personalizadas, com olhar local e escolhas que respeitam o seu ritmo.",
  cta: "Planeje sua experiência",
  facts: [
    { value: "30 anos", label: "no turismo" },
    { value: "Desde 2012", label: "vivendo na Suíça" },
  ],
} as const;

export const about = {
  eyebrow: "Sobre",
  title: "Quem desenha a sua viagem",
  text: "Sou turismóloga, tenho 30 anos de experiência no turismo e moro na Suíça desde 2012. Conheço o país por dentro, e é desse olhar que nasce uma curadoria que vai além dos roteiros convencionais.",
  pillars: ["Experiências personalizadas", "Olhar local", "Respeito ao seu ritmo"],
} as const;

export const services = {
  title: "Conheça os meus serviços",
  items: [
    {
      title: "Suíça Sob Medida",
      clarification: null,
      lead: "Uma viagem desenhada a partir de você.",
      text: "Consultoria personalizada que reúne planejamento, curadoria de experiências e roteiro completo, considerando seus interesses, ritmo e prioridades.",
      cta: "Planeje sua viagem",
      message:
        "Olá, Carolina! Vim pelo seu site e gostaria de conhecer o serviço Suíça Sob Medida para planejar minha viagem à Suíça.\nPeríodo previsto:\nQuantas pessoas:\nO que gostaria de viver:",
    },
    {
      title: "Concierge",
      clarification: null,
      lead: "Seu ponto de apoio durante a experiência na Suíça.",
      text: "Acompanhamento personalizado para que você viva sua viagem com mais tranquilidade, contando com suporte local durante a sua estadia.",
      cta: "Conheça o concierge",
      message:
        "Olá, Carolina! Vim pelo seu site e gostaria de conhecer o serviço Concierge para minha estadia na Suíça.\nPeríodo da estadia:\nQuantas pessoas:\nEm que gostaria de ter apoio:",
    },
    {
      title: "Transfert Privé",
      clarification: "(transfer privativo)",
      lead: "O cuidado com a sua experiência também está no caminho.",
      text: "Transfer privativo para seus deslocamentos na Suíça, unindo conforto, segurança e atendimento personalizado em cada percurso.",
      cta: "Solicite seu transfer",
      message:
        "Olá, Carolina! Vim pelo seu site e gostaria de solicitar o serviço Transfert Privé na Suíça.\nDatas e horários previstos:\nTrecho (origem e destino):\nQuantas pessoas:",
    },
  ],
} as const;

export const closing = {
  title: "Viva a Suíça no seu ritmo.",
  text: "Experiências escolhidas com intenção, olhar local e cuidado em cada detalhe, para que a sua viagem tenha a sua medida e deixe memórias que permaneçam.",
  cta: "Comece a conversa",
} as const;
