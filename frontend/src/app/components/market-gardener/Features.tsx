import Image from "next/image";

type FeatureCardProps = {
  title: string;
  imgSrc: string;
  imgAlt: string;
  text: string;
};

function FeatureCard({ imgSrc, imgAlt, text }: FeatureCardProps) {
  return (
    <div className="bg-white text-[var(--foreground)] p-6 rounded-2xl shadow flex flex-col md:flex-row items-center gap-6 m-7">
      {/* Image à gauche */}
      <Image
        src={imgSrc}
        alt={imgAlt}
        width={500}
        height={333}
        className="w-full md:w-1/3 h-auto rounded-xl"
      />

      {/* Texte à droite */}
      <div className="md:w-2/3">
        <p>{text}</p>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section
      className="bg-[url('/background-green.png')] bg-cover bg-center] text-white py-6 px-2"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        <h2
          className="text-3xl text-center mb-8"
          style={{
            fontFamily: "var(--font-pacifico)",
          }}
        >
          Notre Exploitation
        </h2>

        <FeatureCard
          title="Des sols fertiles et vivants"
          imgSrc="/_DSC0972.jpg"
          imgAlt="Sols fertiles"
          text="Nous cultivons nos légumes sur 2,5Ha autour de la ferme dont 2000m2 avec autonomie en eau.
Tous nos plants et graines sont certifié bio, nous faisons nous même une partie des plants dont certains destinée à la vente aux particuliers au printemps (légumes ratatouille)"
        />
      </div>
    </section>
  );
}
