"use client";
import { categorias, type Categoria } from "@/data/paisagens";
import styles from "./Paisagens.module.css";
export default function FiltroCategorias({ value, onChange }: { value: Categoria | "todas"; onChange: (value: Categoria | "todas") => void }) {
  return <div className={styles.filters} role="group" aria-label="Filtrar paisagens por categoria">
    {Object.entries({ todas: "Todas", ...categorias }).map(([id, label]) => <button type="button" key={id}
      aria-pressed={value === id} aria-controls="paisagens-grid" onClick={() => onChange(id as Categoria | "todas")}>{label}</button>)}
  </div>;
}
