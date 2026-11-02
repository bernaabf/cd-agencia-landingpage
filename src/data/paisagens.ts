import fontes from "./paisagens-fontes.json";
import geradas from "./paisagens-geradas.json";
export type Categoria = "montanhas" | "lagos" | "vales" | "glaciares" | "vinhedos" | "trens" | "cidades";
export const categorias: Record<Categoria, string> = {
  montanhas: "Montanhas", lagos: "Lagos", vales: "Vales", glaciares: "Glaciares", vinhedos: "Vinhedos", trens: "Trens", cidades: "Cidades",
};
export interface Paisagem {
  id: string; titulo: string; local: string; categoria: Categoria; src: string;
  largura: number; altura: number; blurDataURL: string; alt: string;
  foco?: { x: number; y: number };
  credito: { autor: string; fonte: string; url: string; licenca: string; licencaUrl: string };
  destaque?: boolean;
}
export const paisagens: Paisagem[] = fontes.map(p => ({
  ...p, categoria: p.categoria as Categoria,
  ...geradas[p.id as keyof typeof geradas],
}));
