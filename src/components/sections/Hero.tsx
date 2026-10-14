import Image from "next/image";
import Button from "@/components/Button";
import HeroStage from "@/components/world/HeroStage";
import { generalMessage, hero, whatsappLink } from "@/lib/site";

export default function Hero() {
  return (
    <HeroStage>
      <div className="hero-editorial">
        <div className="hero-act hero-opening" data-stage-opening>
          <p className="eyebrow hero-eyebrow">{hero.eyebrow}</p>
          <div className="hero-title-mask">
            <h1 id="hero-title" className="display hero-title" data-stage-title>{hero.title}</h1>
          </div>
        </div>
        <div className="hero-act hero-story" data-stage-story>
          <p className="hero-glass">{hero.text}</p>
        </div>
        <div className="hero-act hero-invitation" data-stage-invitation>
          <dl className="hero-credentials hero-glass">
            {hero.facts.map(fact => (
              <div key={fact.value}>
                <dt className="sr-only">{fact.label}</dt>
                <dd><span>{fact.value}</span> <span>{fact.label}</span></dd>
              </div>
            ))}
          </dl>
          <Button href={whatsappLink(generalMessage)}>{hero.cta}</Button>
        </div>
        <figure className="hero-act hero-guide" data-stage-guide>
          <div className="hero-portrait" data-stage-portrait>
            <Image src="/images/hero-carolina.jpg"
              alt="Retrato de Carolina Décaillet, turismóloga, sorrindo com a mão apoiada no queixo"
              fill sizes="(min-width: 768px) 32vw, 76vw" loading="eager"
              className="object-cover" style={{ objectPosition: "45% 20%" }} />
          </div>
        </figure>
      </div>
    </HeroStage>
  );
}
