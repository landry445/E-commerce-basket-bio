import Image from "next/image";

type FeatureCardProps = {
  title: string;
  imgSrc: string;
  imgAlt: string;
  text: string;
};

function FeatureCard({ title, imgSrc, imgAlt, text }: FeatureCardProps) {
  return (
    <div className="bg-white text-[var(--foreground)] p-6 rounded-2xl shadow flex flex-col md:flex-row items-center gap-6 m-7">
      {/* Image à gauche */}
      <Image
        src={imgSrc}
        alt={imgAlt}
        width={300}
        height={200}
        className="w-full md:w-1/3 h-auto rounded"
      />

      {/* Texte à droite */}
      <div className="md:w-2/3">
        <h3
          className="text-2xl mb-2"
          style={{ fontFamily: "var(--font-pacifico)" }}
        >
          {title}
        </h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section
      className="bg-[url('/background-green.png')] bg-cover bg-center] text-white py-10 px-8"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        <h2
          className="text-3xl text-center mb-8"
          style={{ fontFamily: "var(--font-pacifico)" }}
        >
          Notre Exploitation 100% BIO
        </h2>

        <FeatureCard
          title="Des sols fertiles et vivants"
          imgSrc="/fields.png"
          imgAlt="Sols fertiles"
          text="La ferme bio DUREAU comprend 14 hectares de belles terres avec des sols limoneux, argileux et sableux (sol idéal pour la culture des carottes). Tous les légumes y sont cultivés en pleine terre. Chaque terrain est adapté aux besoins des différents légumes et bénéficie d’une rotation appropriée des cultures permettant au sol de se régénérer.
                L’exploitation des terres se fait en respectant aussi :
                la culture d’engrais verts et de légumineuses,
                le recyclage et le compostage des matières organiques,
                le recours à des engrais et amendements d’origine naturelle."
        />
        <FeatureCard
          title="Des serres et un étang"
          imgSrc="/greenhouse.png"
          imgAlt="Serres et étang"
          text="Pour certaines cultures, 1 hectare de serres est installé sur l’exploitation agricole bio. Ainsi, les radis, les salades, les épinards, la mâche, les cardes, les oignons blancs, les navets peuvent être récoltés en hiver. Et en été, ce sont les tomates et les concombres qui bénéficient de ces installations. Tous les légumes y sont cultivés en pleine terre et sont certifiés Bio (Agriculture Biologique).
                L’exploitation comprend aussi un étang d’un hectare. Les eaux pluviales sont récupérées et vont directement s’y jeter. L’eau ainsi stockée permet l’arrosage des différentes cultures de l’exploitation et plus particulièrement en été."
        />
        <FeatureCard
          title="Des graines et des plants certifiés bio"
          imgSrc="/seeds.png"
          imgAlt="Graines et plants"
          text="Pour certaines cultures, 1 hectare de serres est installé sur l’exploitation agricole bio. Ainsi, les radis, les salades, les épinards, la mâche, les cardes, les oignons blancs, les navets peuvent être récoltés en hiver. Et en été, ce sont les tomates et les concombres qui bénéficient de ces installations. Tous les légumes y sont cultivés en pleine terre et sont certifiés Bio (Agriculture Biologique).
                L’exploitation comprend aussi un étang d’un hectare. Les eaux pluviales sont récupérées et vont directement s’y jeter. L’eau ainsi stockée permet l’arrosage des différentes cultures de l’exploitation et plus particulièrement en été."
        />
      </div>
    </section>
  );
}
