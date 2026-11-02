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
      className={`relative bg-cream-100 text-brown-900 ${styles.scope} ${styles.section}`}
    >
      <div className={styles.container}>
        <div className={styles.introGrid}>
          <div className="lg:col-span-5">
            <h2
              id="sobre-title"
              data-split
              className={`display text-brown-900 ${styles.heading}`}
            >
              {about.title}
            </h2>
            <p data-reveal className="mt-3 text-sm text-brown-700">
              {site.name}
            </p>
          </div>
          <p
            data-reveal
            className={`text-[1.08rem] leading-[1.85] text-brown-900/85 sm:text-[1.15rem] lg:col-span-6 lg:col-start-7 lg:pt-2 ${styles.bodyCopy}`}
          >
            {about.text}
          </p>
        </div>

        {/* Composição editorial: três fotografias em alturas distintas */}
        <div className={`grid grid-cols-6 items-end gap-3 sm:gap-6 ${styles.block}`}>
          <MediaFrame
            src="/images/globo-destinos.jpg"
            alt="Mãos apontando um destino em um globo terrestre"
            sizes="(min-width: 1280px) 30vw, 40vw"
            parallax={5}
            className="col-span-3 aspect-[3/4] sm:col-span-2 sm:aspect-[3/3.6]"
          />
          <MediaFrame
            src="/images/carolina-consultora.jpg"
            alt="Carolina Décaillet sorrindo, em pé, de terno vinho"
            sizes="(min-width: 1280px) 30vw, 40vw"
            parallax={4}
            className="col-span-3 aspect-[3/4] sm:col-span-2 sm:aspect-[3/4.4]"
          />
          <MediaFrame
            src="/images/planejamento-viagem.jpg"
            alt="Mãos planejando uma viagem sobre um mapa, ao lado de um notebook"
            sizes="(min-width: 1280px) 30vw, 80vw"
            parallax={5}
            className="col-span-6 aspect-[16/10] sm:col-span-2 sm:aspect-[3/3.6]"
          />
        </div>

        <ul className={`${styles.pillars} ${styles.block}`}>
          {about.pillars.map((pillar, i) => {
            const Icon = pillarIcons[i];
            return (
              <li
                key={pillar}
                data-reveal
                className="flex items-center gap-4 border-t border-brown-900/20 py-5"
              >
                <Icon aria-hidden className="size-5 shrink-0 text-brown-700" strokeWidth={1.5} />
                <span className="font-display text-[1.55rem] leading-tight">{pillar}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
