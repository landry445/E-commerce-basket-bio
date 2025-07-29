"use client";

type Props = {
  initialValues?: { name?: string; address?: string; day?: string };
  onSubmit: (values: { name: string; address: string; day: string }) => void;
  mode?: "create" | "edit";
};

import { useRef } from "react";

export default function FormPickup({
  initialValues = {},
  onSubmit,
  mode = "create",
}: Props) {
  const nameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name: nameRef.current?.value || "",
      address: addressRef.current?.value || "",
      day: dayRef.current?.value || "",
    });
  }

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-lg mx-auto"
      onSubmit={handleSubmit}
    >
      <input
        ref={nameRef}
        className="rounded border px-4 py-2 bg-white"
        type="text"
        placeholder="name du point de retrait"
        defaultValue={initialValues.name}
      />
      <input
        ref={addressRef}
        className="rounded border px-4 py-2 bg-white"
        type="text"
        placeholder="address"
        defaultValue={initialValues.address}
      />
      <input
        ref={dayRef}
        className="rounded border px-4 py-2 bg-white"
        type="text"
        placeholder="day (ex : Mardi)"
        defaultValue={initialValues.day}
      />
      <button
        type="submit"
        className="self-end px-4 py-2 rounded bg-primary text-white hover:brightness-90"
      >
        {mode === "edit" ? "Modifier" : "Créer"}
      </button>
    </form>
  );
}
