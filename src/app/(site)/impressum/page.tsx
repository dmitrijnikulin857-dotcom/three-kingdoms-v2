import type { Metadata } from "next";
import { RESTAURANT } from "@/lib/menu-data";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum des China Restaurant Three Kingdoms Düsseldorf.",
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <div className="container-tk max-w-3xl py-16">
      <h1 className="section-heading">Impressum</h1>
      <div className="prose-invert mt-8 space-y-8 text-neutral-300">
        <section>
          <h2 className="font-serif text-xl font-semibold text-white">
            Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)
          </h2>
          <p className="mt-3 leading-relaxed">
            {RESTAURANT.name}
            <br />
            {RESTAURANT.street}
            <br />
            {RESTAURANT.zip} {RESTAURANT.city}
            <br />
            {RESTAURANT.country}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-white">
            Vertreten durch
          </h2>
          <p className="mt-3">Geschäftsführung: Three Kingdoms Gastronomie GmbH</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-white">Kontakt</h2>
          <p className="mt-3">
            Telefon:{" "}
            <a href={`tel:${RESTAURANT.phoneIntl}`} className="text-gold hover:underline">
              {RESTAURANT.phone}
            </a>
            <br />
            E-Mail:{" "}
            <a href={`mailto:${RESTAURANT.email}`} className="text-gold hover:underline">
              {RESTAURANT.email}
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-white">
            Umsatzsteuer-ID
          </h2>
          <p className="mt-3">
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
            <br />
            DE&nbsp;XXX&nbsp;XXX&nbsp;XXX
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-white">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p className="mt-3">
            Three Kingdoms Gastronomie GmbH
            <br />
            {RESTAURANT.street}, {RESTAURANT.zip} {RESTAURANT.city}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-white">
            EU-Streitschlichtung
          </h2>
          <p className="mt-3 leading-relaxed">
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht
            bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-white">Haftung für Inhalte</h2>
          <p className="mt-3 leading-relaxed">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen.
          </p>
        </section>
      </div>
    </div>
  );
}
