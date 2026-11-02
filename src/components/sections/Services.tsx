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
              className={styles.serviceRow}
            >
              <div>
                <h3 className={`display ${styles.itemTitle}`}>{item.title}</h3>
                {item.clarification && (
                  <p className="mt-3 text-sm text-sand-400">{item.clarification}</p>
                )}
              </div>
              <div className={styles.serviceDescription}>
                <p className="text-base font-medium leading-relaxed">{item.lead}</p>
                <p className="mt-3 text-base leading-[1.8] text-cream-100/85">{item.text}</p>
                <div className={styles.serviceAction}>
                  <Button href={whatsappLink(item.message)} size="sm">
                    {item.cta}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
