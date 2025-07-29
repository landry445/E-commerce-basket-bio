"use client";
import { useState } from "react";
import Image from "next/image";

type Basket = {
  id: string;
  name: string;
  price: string;
  description: string;
  image?: string;
  actif: boolean;
};
type BasketSansId = Omit<Basket, "id">;

type FormBasketProps =
  | {
      mode: "create";
      initialValues?: Partial<BasketSansId>;
      onSubmit: (formData: FormData) => void;
    }
  | {
      mode: "edit";
      initialValues: Basket;
      onSubmit: (formData: FormData) => void;
    };

export default function FormBasket(props: FormBasketProps) {
  const { mode, onSubmit } = props;
  const initial = props.initialValues ?? {};

  const [name, setName] = useState(initial.name ?? "");
  const [price, setPrice] = useState(initial.price ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [actif, setActif] = useState(
    mode === "edit" ? (initial as Basket).actif : initial.actif ?? true
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("actif", String(actif));
    if (file) {
      formData.append("image", file);
    }
    if (mode === "edit") {
      formData.append("id", (initial as Basket).id);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-8 mt-2">
      <div className="flex-1 flex flex-col gap-4">
        <input
          className="rounded-full border border-gray-300 px-6 py-2 bg-white font-sans placeholder:text-gray-400 text-base"
          type="text"
          placeholder="Nom du panier"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded-full border border-gray-300 px-6 py-2 bg-white font-sans placeholder:text-gray-400 text-base"
          type="number"
          step="0.01"
          placeholder="Prix (ex : 14.00)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <textarea
          className="rounded-xl border border-gray-300 px-6 py-4 bg-white font-sans placeholder:text-gray-400 text-base min-h-[160px] resize-none"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Upload d'image */}
        <div>
          <label htmlFor="image" className="font-medium">
            Image du panier
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="block mt-1"
            onChange={handleFileChange}
          />
          {preview && (
            <Image
              src={preview.startsWith("/uploads") ? preview : preview}
              alt="Aperçu"
              width={120}
              height={80}
              className="rounded shadow mt-2"
              unoptimized={preview.startsWith("blob:")}
            />
          )}
        </div>
        <div className="flex items-center gap-3 mt-2">
          <input
            type="checkbox"
            checked={actif}
            onChange={(e) => setActif(e.target.checked)}
            id="actif"
            className="w-4 h-4 accent-green-600"
          />
          <label htmlFor="actif" className="text-base font-medium">
            Panier actif
          </label>
        </div>
      </div>
      <div className="flex flex-col items-end mt-3">
        <button
          type="submit"
          className="mt-6 w-full px-4 py-2 rounded-full bg-accent text-white font-sans font-bold hover:brightness-110"
        >
          {mode === "edit" ? "Modifier" : "Créer"}
        </button>
      </div>
    </form>
  );
}
