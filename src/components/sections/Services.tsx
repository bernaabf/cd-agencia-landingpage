import Button from "@/components/Button";
import { services, whatsappLink } from "@/lib/site";

export default function Services() {
  return (
    <section
      id="servicos"
      data-world-act="route"
      aria-labelledby="servicos-title"
      className="relative bg-brown-900 py-24 text-cream-50 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2
          id="servicos-title"
          data-split
          className="display mx-auto max-w-[18ch] text-center text-[clamp(2rem,4.8vw,3.9rem)]"
        >
          {services.title}
        </h2>

        <ul className="mt-14 grid gap-5 sm:mt-20 lg:grid-cols-3 lg:gap-6">
          {services.items.map((item, i) => (
            <li
              key={item.title}
              data-world-stop={i}
              data-reveal
              className="group relative flex flex-col rounded-[24px] border border-white/40 bg-cream-200 p-7 text-brown-900 shadow-[0_8px_32px_rgba(20,10,8,0.18)] transition-[translate,box-shadow] duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-[0_24px_56px_rgba(20,10,8,0.34)] sm:p-9"
            >
              <span
                aria-hidden
                className="font-display text-base tracking-[0.1em] text-brown-700"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-3 text-[1.9rem] text-brown-900">{item.title}</h3>
              {item.clarification && (
                <p className="mt-1 text-sm text-brown-700">{item.clarification}</p>
              )}
              <p className="mt-3 text-[0.95rem] font-semibold leading-snug">{item.lead}</p>
              <p className="mt-4 text-[0.95rem] leading-[1.75] text-brown-900/80">{item.text}</p>
              <div className="mt-8 flex pt-2 lg:mt-auto lg:justify-end lg:pt-8">
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
