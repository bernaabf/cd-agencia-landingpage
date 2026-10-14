import { Clock, MapPin, Sparkles } from "lucide-react";
import MediaFrame from "@/components/MediaFrame";
import { about, site } from "@/lib/site";
import styles from "./Editorial.module.css";

const pillarIcons = [Sparkles, MapPin, Clock];

export default function About() {
  return (
    <section
      id="sobre"
      tabIndex={-1}
      data-world-act="valley"
      aria-labelledby="sobre-title"
      className={`relative bg-cream-100 py-24 text-brown-900 sm:py-32 ${styles.scope}`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p data-reveal className="eyebrow text-brown-700">
              {about.eyebrow}
            </p>
            <h2
              id="sobre-title"
              data-split
              className={`display mt-5 text-brown-900 ${styles.heading}`}
            >
              {about.title}
            </h2>
            <p data-reveal className="mt-3 text-sm text-brown-700">
              {site.name}
            </p>
          </div>
          <p
            data-reveal
            className="text-[1.08rem] leading-[1.85] text-brown-900/85 sm:text-[1.15rem] lg:col-span-6 lg:col-start-7 lg:pt-9"
          >
            {about.text}
          </p>
        </div>

        {/* Composição editorial: três fotografias em alturas distintas */}
        <div className="mt-14 grid grid-cols-6 items-end gap-3 sm:mt-20 sm:gap-6">
          <MediaFrame
            src="/images/globo.jpg"
            alt="Mãos apontando um destino em um globo terrestre"
            sizes="(min-width: 1280px) 30vw, 40vw"
            parallax={5}
            className="col-span-3 aspect-[3/4] sm:col-span-2 sm:aspect-[3/3.6]"
          />
          <MediaFrame
            src="/images/carolina-tablet.jpg"
            alt="Carolina Décaillet em pé, de blazer, consultando um tablet"
            sizes="(min-width: 1280px) 30vw, 40vw"
            parallax={4}
            className="col-span-3 aspect-[3/4] sm:col-span-2 sm:aspect-[3/4.4]"
          />
          <MediaFrame
            src="/images/mapa-notebook.jpg"
            alt="Notebook exibindo um trem panorâmico suíço sobre um mapa de viagem"
            sizes="(min-width: 1280px) 30vw, 80vw"
            parallax={5}
            className="col-span-6 aspect-[16/10] sm:col-span-2 sm:aspect-[3/3.6]"
          />
        </div>

        <ul className="mt-14 grid gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-5">
          {about.pillars.map((pillar, i) => {
            const Icon = pillarIcons[i];
            return (
              <li
                key={pillar}
                data-reveal
                className="flex items-center gap-4 rounded-[20px] border border-brown-900/10 bg-white/45 px-5 py-4 backdrop-blur-md transition-[translate,border-color] duration-500 ease-premium hover:-translate-y-0.5 hover:border-brown-900/25"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brown-900 text-cream-100">
                  <Icon aria-hidden className="size-[1.1rem]" strokeWidth={1.5} />
                </span>
                <span className="font-display text-[1.3rem] leading-tight">{pillar}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
