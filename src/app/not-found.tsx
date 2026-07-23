import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-4 text-center">
      <span className="font-serif text-7xl font-bold text-gold">404</span>
      <h1 className="mt-4 font-serif text-2xl font-bold text-white">
        Seite nicht gefunden
      </h1>
      <p className="mt-2 max-w-md text-neutral-400">
        Die gesuchte Seite existiert nicht. Vielleicht möchten Sie unsere
        Speisekarte entdecken?
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-gold">
          Zur Startseite
        </Link>
        <Link href="/menu" className="btn-outline">
          Speisekarte
        </Link>
      </div>
    </div>
  );
}
