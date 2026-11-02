"use client";
import { Expand } from "lucide-react";
import type { Paisagem } from "@/data/paisagens";
import PaisagemImage from "./PaisagemImage";
import styles from "./Paisagens.module.css";
export default function PaisagemCard({ paisagem, onOpen }: { paisagem: Paisagem; onOpen: () => void }) {
  return <figure className={styles.card} data-landscape-card>
    <button type="button" className={styles.open} onClick={onOpen} aria-label={`Ampliar ${paisagem.titulo} — ${paisagem.local}`} aria-haspopup="dialog">
      <PaisagemImage paisagem={paisagem} sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 100vw" />
      <span className={styles.expand} aria-hidden="true"><Expand size={18} /></span>
    </button>
    <figcaption className={styles.caption}><span>{paisagem.titulo}</span><span>{paisagem.local}</span></figcaption>
  </figure>;
}
