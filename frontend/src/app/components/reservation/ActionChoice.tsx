"use client";

type Props = {
  value: "order" | "contact";
  onChange: (v: "order" | "contact") => void;
};

export default function ActionChoice({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-lg font-semibold mb-2">
        Que souhaitez-vous faire&nbsp;*
      </p>
      <div className="space-y-2">
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
