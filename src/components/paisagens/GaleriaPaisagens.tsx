"use client";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mobilePresentationQuery } from "@/lib/presentation";
import { revealOnMobile } from "@/lib/mobile-reveals";
import { paisagens, type Categoria } from "@/data/paisagens";
import { generalMessage, site, whatsappLink } from "@/lib/site";
import Button from "@/components/Button";
import PaisagemCard from "./PaisagemCard";
import FiltroCategorias from "./FiltroCategorias";
import styles from "./Paisagens.module.css";
const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

export default function GaleriaPaisagens() {
  const [category, setCategory] = useState<Categoria | "todas">("todas");
  const [selected, setSelected] = useState<{ index: number; origin: HTMLElement | null } | null>(null);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  const filtered = useMemo(() => paisagens.filter(p => category === "todas" || p.categoria === category), [category]);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: mobilePresentationQuery }, (context) => {
      if (!context.conditions?.motion) return;
      const mobile = context.conditions.mobile;
      if (mobile) return revealOnMobile(Array.from(grid.current?.querySelectorAll<HTMLElement>("[data-landscape-card]") ?? []));
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-landscape-card]", grid.current).forEach((card, index) => {
          gsap.fromTo(card, { opacity: 0, y: mobile ? 12 : 24, scale: mobile ? 1 : 0.985 }, {
            opacity: 1, y: 0, scale: 1, duration: mobile ? 0.5 : 0.85, delay: mobile ? 0 : (index % 2) * 0.08, ease: "power3.out",
            clearProps: "transform,opacity", scrollTrigger: { trigger: card, start: "top 96%", once: true },
          });
        });
      }, grid);
      // Only desktop owns scroll measurements; mobile image ratios reserve layout.
      const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => { cancelAnimationFrame(frame); ctx.revert(); };
    });
    return () => mm.revert();
  }, [category]);

  return <section className={styles.section} id="paisagens" aria-labelledby="paisagens-title">
    <div className={styles.container}>
      <div className={styles.heading}>
        <h2 className="display" id="paisagens-title">A Suíça além do roteiro.</h2>
        <p>Montanhas, lagos e caminhos da Suíça.</p>
      </div>
      <div className={styles.toolbar}>
        <FiltroCategorias value={category} onChange={setCategory} />
        <p className={styles.resultCount} role="status">
          {filtered.length} {filtered.length === 1 ? "paisagem" : "paisagens"}
          {loadingDialog && <span className="sr-only">. Abrindo paisagem.</span>}
        </p>
      </div>
      <div className={styles.grid} ref={grid} id="paisagens-grid">
        {filtered.map((p, index) => <PaisagemCard key={p.id} paisagem={p} onOpen={() => {
          setLoadingDialog(true);
          setSelected({ index, origin: document.activeElement as HTMLElement });
        }} />)}
      </div>
      {/* TODO: configurar NEXT_PUBLIC_WHATSAPP_NUMBER para ativar o CTA contextual. */}
      <div data-contact-action className={styles.footer}>
        {site.whatsappNumber ? <Button href={whatsappLink(generalMessage)}>Planejar esta experiência</Button>
          : <Button href="#contato" external={false}>Fale com a Carolina</Button>}
        <details className={styles.credits}>
          <summary>Créditos das fotos</summary>
          <ul>{paisagens.map(p => <li key={p.id}>{p.titulo} — <a href={p.credito.url} target="_blank" rel="noopener noreferrer">{p.credito.autor} · {p.credito.fonte}</a> · <a href={p.credito.licencaUrl} target="_blank" rel="noopener noreferrer">{p.credito.licenca}</a>. Recorte e compressão para exibição.</li>)}</ul>
        </details>
      </div>
    </div>
    {selected !== null && <Lightbox paisagens={filtered} initialIndex={selected.index} origin={selected.origin} onReady={() => setLoadingDialog(false)} onClose={() => { setSelected(null); setLoadingDialog(false); }} />}
  </section>;
}
