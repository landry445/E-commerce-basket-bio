export default function MapEmbed() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <iframe
          title="Localisation exploitation"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2713.039422748514!2d-1.942!3d47.116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4805f2e4a4f0b5f7%3A0x4e4e4b4d4e4e4b4d!2s203%20Rue%20des%20Fontenelles%2C%2044320%20Chaumes-en-Retz%2C%20France!5e0!3m2!1sfr!2sfr!4v1724000000000"
          width="100%"
          height="300"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
