import type { Metadata } from "next";
import { RESTAURANT } from "@/lib/menu-data";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung des China Restaurant Three Kingdoms Düsseldorf gemäß DSGVO.",
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return (
    <div className="container-tk max-w-3xl py-16">
      <h1 className="section-heading">Datenschutzerklärung</h1>
      <div className="mt-8 space-y-8 text-neutral-300">
        <section>
          <h2 className="font-serif text-xl font-semibold text-white">
            1. Datenschutz auf einen Blick
          </h2>
          <p className="mt-3 leading-relaxed">
            Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen.
            Wir verarbeiten Ihre Daten ausschließlich auf Grundlage der
            gesetzlichen Bestimmungen (DSGVO, BDSG). Diese Datenschutzerklärung
            informiert Sie über die wichtigsten Aspekte der Datenverarbeitung im
            Rahmen dieser Website.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-white">
            2. Verantwortliche Stelle
          </h2>
          <p className="mt-3 leading-relaxed">
            {RESTAURANT.name}
            <br />
            {RESTAURANT.street}, {RESTAURANT.zip} {RESTAURANT.city}
            <br />
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
            3. Cookies
          </h2>
          <p className="mt-3 leading-relaxed">
            Diese Website verwendet ausschließlich technisch notwendige Cookies,
            die für den Betrieb der Seite erforderlich sind (z.&nbsp;B. zur
            Speicherung Ihrer Sprachauswahl und Ihres Warenkorbs). Es findet kein
            Tracking und keine Weitergabe an Dritte statt. Diese Cookies werden
            auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-white">
            4. Reservierungen und Bestellungen
          </h2>
          <p className="mt-3 leading-relaxed">
            Wenn Sie über unsere Website einen Tisch reservieren oder eine
            Bestellung aufgeben, verarbeiten wir die von Ihnen angegebenen Daten
            (Name, Telefonnummer, E-Mail-Adresse, ggf. Lieferadresse) zum Zwecke
            der Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit.
            b DSGVO (Vertragserfüllung bzw. vorvertragliche Maßnahmen). Die Daten
            werden gelöscht, sobald sie für die Zweckerreichung nicht mehr
            erforderlich sind und keine gesetzlichen Aufbewahrungspflichten
            entgegenstehen.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-white">
            5. Server-Logfiles
          </h2>
          <p className="mt-3 leading-relaxed">
            Der Hosting-Provider erhebt und speichert automatisch Informationen
            in Server-Logfiles, die Ihr Browser automatisch übermittelt
            (Browsertyp, Betriebssystem, Referrer-URL, Uhrzeit der
            Serveranfrage, IP-Adresse). Diese Daten sind nicht bestimmten
            Personen zuordenbar und werden nicht mit anderen Datenquellen
            zusammengeführt.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-white">
            6. Ihre Rechte
          </h2>
          <p className="mt-3 leading-relaxed">
            Sie haben jederzeit das Recht auf Auskunft (Art. 15 DSGVO),
            Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO),
            Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit
            (Art. 20 DSGVO) sowie ein Widerspruchsrecht (Art. 21 DSGVO).
            Außerdem steht Ihnen ein Beschwerderecht bei einer
            Aufsichtsbehörde zu.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-white">
            7. Google Maps
          </h2>
          <p className="mt-3 leading-relaxed">
            Zur Darstellung unseres Standorts binden wir eine Karte von Google
            Maps ein. Anbieter ist die Google Ireland Limited. Beim Aufruf der
            Karte kann Google Informationen über Ihre Nutzung erheben. Weitere
            Informationen finden Sie in der Datenschutzerklärung von Google.
          </p>
        </section>
      </div>
    </div>
  );
}
