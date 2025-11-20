export default function MapEmbed() {
  return (
    <section className="py-8 px-4">
      <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2">
        {/* Gare de Savenay */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-800">
            Gare de Savenay
          </h3>
          <iframe
            title="Gare de Savenay"
            src="https://www.google.com/maps?q=Gare+de+Savenay&z=16&output=embed"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Marché de Blain */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-800">
            Marché de Blain
          </h3>
          <iframe
            title="Marché de Blain"
            src="https://www.google.com/maps?q=Marche+de+Blain&z=16&output=embed"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
