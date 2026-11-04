"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Paisagem } from "@/data/paisagens";
import { getLenis, scrollToSection } from "@/lib/scroll";
import { site, whatsappLink } from "@/lib/site";
import Button from "@/components/Button";
import PaisagemImage from "./PaisagemImage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Paisagens.module.css";
export default function Lightbox({ paisagens, initialIndex, origin, onClose, onReady }: {
  paisagens: Paisagem[]; initialIndex: number; origin: HTMLElement | null; onClose: () => void; onReady: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const dialog = useRef<HTMLDialogElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const close = useRef(onClose);
  const ready = useRef(onReady);
  const reduced = usePrefersReducedMotion();
  const p = paisagens[index];
  const move = (step: number) => setIndex(current => (current + step + paisagens.length) % paisagens.length);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const lenis = getLenis();
    const wasStopped = lenis?.isStopped;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    element.showModal();
    ready.current();
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      if (!wasStopped) lenis?.start();
      origin?.focus({ preventScroll: true });
    };
  }, [origin]);
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    // Warm only adjacent previews at the same responsive width as the viewer.
    const pixels = Math.min(1440, innerWidth * 0.94) * Math.min(devicePixelRatio || 1, 2);
    const width = [480, 768, 1080, 1600, 2400].find(width => width >= pixels) ?? 2400;
    const images = [-1, 1].map(step => {
      const image = new window.Image();
      image.src = `${paisagens[(index + step + paisagens.length) % paisagens.length].src}-${width}.avif`;
      return image;
    });
    return () => images.forEach(image => { image.src = ""; });
  }, [index, paisagens]);
  return <dialog ref={dialog} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="paisagem-dialog-title"
    data-lenis-prevent onCancel={event => { event.preventDefault(); close.current(); }}
    onClick={event => { if (event.target === event.currentTarget) close.current(); }}
    onKeyDown={event => {
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    }}>
    <div className={styles.dialogPanel}>
      <div className={styles.dialogTop}><span aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(paisagens.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => close.current()} aria-label="Fechar paisagem" autoFocus><X size={22} /></button></div>
      <div className={styles.dialogVisual} onPointerDown={event => { pointer.current = { x: event.clientX, y: event.clientY }; }}
        onPointerCancel={() => { pointer.current = null; }} onPointerUp={event => {
          const start = pointer.current; pointer.current = null;
          if (!start) return;
          const dx = event.clientX - start.x, dy = event.clientY - start.y;
          if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) move(dx < 0 ? 1 : -1);
        }}>
        <div key={p.id} className={`${styles.dialogImage} ${reduced ? "" : styles.fade}`}>
          <PaisagemImage paisagem={p} sizes="(min-width: 1600px) 1440px, 94vw" contain eager />
        </div>
        {paisagens.length > 1 && <><button type="button" className={styles.previous} onClick={() => move(-1)} aria-label="Paisagem anterior"><ChevronLeft /></button>
          <button type="button" className={styles.next} onClick={() => move(1)} aria-label="Próxima paisagem"><ChevronRight /></button></>}
      </div>
      <div className={styles.dialogBottom}>
        <div aria-live="polite"><h3 id="paisagem-dialog-title">{p.titulo}</h3><p>{p.local}</p>
          <p className={styles.creditLine}><a href={p.credito.url} target="_blank" rel="noopener noreferrer">{p.credito.autor} · {p.credito.fonte}</a> · <a href={p.credito.licencaUrl} target="_blank" rel="noopener noreferrer">{p.credito.licenca}</a></p></div>
        {site.whatsappNumber ? <Button href={whatsappLink(`Olá, Carolina! Vi ${p.titulo} no seu site e gostaria de conversar sobre uma experiência na Suíça.`)}>Planejar esta experiência</Button>
          : <a className={styles.contactFallback} href="#contato" onClick={event => {
            event.preventDefault(); close.current();
            requestAnimationFrame(() => { scrollToSection("contato"); document.getElementById("contato")?.focus({ preventScroll: true }); });
          }}>Fale com a Carolina</a>}
      </div>
    </div>
  </dialog>;
}
