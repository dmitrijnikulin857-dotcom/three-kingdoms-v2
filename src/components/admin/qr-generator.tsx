"use client";

import { useEffect, useState, useCallback } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Link2 } from "lucide-react";

export function QrGenerator() {
  const [baseUrl, setBaseUrl] = useState("");
  const [table, setTable] = useState("");
  const [target, setTarget] = useState("/menu");
  const [dataUrl, setDataUrl] = useState("");
  const [fgColor, setFgColor] = useState("#0D0D0E");
  const [bgColor, setBgColor] = useState("#FFFFFF");

  useEffect(() => {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    setBaseUrl(envUrl && envUrl.startsWith("http") ? envUrl : window.location.origin);
  }, []);

  const fullUrl = (() => {
    if (!baseUrl) return "";
    const path = target.startsWith("/") ? target : `/${target}`;
    const url = new URL(path, baseUrl);
    if (table.trim()) url.searchParams.set("table", table.trim());
    return url.toString();
  })();

  const generate = useCallback(async () => {
    if (!fullUrl) return;
    try {
      const url = await QRCode.toDataURL(fullUrl, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 512,
        color: { dark: fgColor, light: bgColor },
      });
      setDataUrl(url);
    } catch (err) {
      console.error("QR generation failed", err);
    }
  }, [fullUrl, fgColor, bgColor]);

  useEffect(() => {
    generate();
  }, [generate]);

  function download() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = table.trim()
      ? `three-kingdoms-tisch-${table.trim()}.png`
      : "three-kingdoms-qr.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">QR-Code Generator</h1>
        <p className="mt-1 text-neutral-400">
          Erstellen Sie QR-Codes für Tische mit direktem Link zur digitalen
          Speisekarte.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="card space-y-5 p-6">
          <div>
            <label className="label">Ziel-Seite</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="input"
            >
              <option value="/menu">Speisekarte (/menu)</option>
              <option value="/order">Online bestellen (/order)</option>
              <option value="/reservation">Reservierung (/reservation)</option>
              <option value="/">Startseite (/)</option>
            </select>
          </div>

          <div>
            <label className="label">Tischnummer (optional)</label>
            <input
              value={table}
              onChange={(e) => setTable(e.target.value)}
              placeholder="z.B. 12"
              className="input"
            />
            <p className="mt-1 text-xs text-neutral-500">
              Wird als Parameter <code className="text-gold">?table=</code> angehängt.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Vordergrund</label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-11 w-full rounded-xl border border-ink-border bg-ink-soft"
              />
            </div>
            <div>
              <label className="label">Hintergrund</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-11 w-full rounded-xl border border-ink-border bg-ink-soft"
              />
            </div>
          </div>

          <div className="rounded-xl border border-ink-border bg-ink-soft p-3">
            <p className="flex items-center gap-2 text-xs text-neutral-500">
              <Link2 className="h-3.5 w-3.5" />
              Verknüpfter Link:
            </p>
            <p className="mt-1 break-all text-sm text-gold">{fullUrl || "…"}</p>
          </div>
        </div>

        {/* Preview */}
        <div className="card flex flex-col items-center justify-center gap-6 p-6">
          <div className="rounded-2xl bg-white p-4">
            {dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dataUrl} alt="QR Code" className="h-56 w-56" />
            ) : (
              <div className="flex h-56 w-56 items-center justify-center text-neutral-400">
                <QrCode className="h-16 w-16" />
              </div>
            )}
          </div>
          <button onClick={download} disabled={!dataUrl} className="btn-gold w-full">
            <Download className="h-4 w-4" />
            Als PNG herunterladen
          </button>
          <p className="text-center text-xs text-neutral-500">
            Drucken Sie den QR-Code aus und platzieren Sie ihn auf den Tischen.
            Gäste scannen ihn und gelangen direkt zur Speisekarte.
          </p>
        </div>
      </div>
    </div>
  );
}
