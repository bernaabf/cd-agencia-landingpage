import Button from "@/components/Button";
import { services, whatsappLink } from "@/lib/site";
import styles from "./Editorial.module.css";

export default function Services() {
  return (
    <section
      id="servicos"
      data-world-act="route"
      aria-labelledby="servicos-title"
      className={`relative bg-brown-900 text-cream-50 ${styles.scope} ${styles.section}`}
    >
      <div className={styles.container}>
        <h2
          id="servicos-title"
          data-split
          className={`display ${styles.heading} ${styles.serviceHeading}`}
        >
          {services.title}
        </h2>

        <ul className={`${styles.block} ${styles.serviceList}`}>
          {services.items.map((item, i) => (
            <li
              key={item.title}
              data-world-stop={i}
              data-reveal
              className={`group relative rounded-[24px] border border-white/40 bg-cream-200 p-7 text-brown-900 shadow-[0_8px_32px_rgba(20,10,8,0.18)] transition-[translate,box-shadow] duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-[0_24px_56px_rgba(20,10,8,0.34)] sm:p-9 ${styles.serviceCard}`}
            >
              <span
                aria-hidden
                className={`font-display text-base tracking-[0.1em] text-brown-700 ${styles.serviceNumber}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={`display text-brown-900 ${styles.itemTitle}`}>{item.title}</h3>
                {item.clarification && (
                  <p className="mt-1 text-sm text-brown-700">{item.clarification}</p>
                )}
              </div>
              <div className={styles.serviceDescription}>
                <p className="text-[0.95rem] font-semibold leading-snug">{item.lead}</p>
                <p className="mt-4 text-[0.95rem] leading-[1.75] text-brown-900/80">{item.text}</p>
              </div>
              <div className={styles.serviceAction}>
                <Button href={whatsappLink(item.message)} variant="dark" size="sm">
                  {item.cta}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
