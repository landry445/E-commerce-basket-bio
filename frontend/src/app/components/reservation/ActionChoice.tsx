type Props = {
  value: "order" | "contact";
  onChange: (v: "order" | "contact") => void;
};

export default function ActionChoice({ value, onChange }: Props) {
  return (
    <div className="mx-auto mt-6 grid max-w-5xl">
      <p className="text-xl mb-2">Que souhaites-tu faire&nbsp;*</p>
      <div className="mt-2 space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="action"
            value="order"
            checked={value === "order"}
            onChange={() => onChange("order")}
          />
          <span>Commander un panier et des légumes</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="action"
            value="contact"
            checked={value === "contact"}
            onChange={() => onChange("contact")}
          />
          <span>Nous écrire</span>
        </label>
      </div>
    </div>
  );
}
