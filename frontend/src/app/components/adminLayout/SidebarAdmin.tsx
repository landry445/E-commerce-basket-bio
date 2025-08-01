"use client";
import Image from "next/image";
import SidebarNavButton from "./SidebarNavButton";
import { usePathname, useRouter } from "next/navigation";

type SidebarAdminProps = {
  userName?: string;
};

export default function SidebarAdmin({ userName = "Adri" }: SidebarAdminProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (segment: string) => pathname.includes(`/admin/${segment}`);

  return (
    <aside className="relative flex flex-col items-center bg-yellow rounded-2xl py-12 px-6 shadow-sm min-h-[90vh] mt-6 mb-6 ml-4 w-56">
      {/* Titre */}
      <span className="font-sans text-lg font-bold text-dark mb-4 text-center">
        Palette
        <br />
        Administrateur
      </span>
      {/* Logo */}
      <Image
        src="/logo-frog.png"
        alt="Logo"
        width={64}
        height={64}
        className="mx-auto my-2"
      />
      {/* Bonjour */}
      <div className="flex flex-col items-center mb-8">
        <span className="text-dark text-sm">Bonjour,</span>
        <span className="font-pacifico italic text-accent text-base">
          {userName}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-8 w-full mt-16">
        <SidebarNavButton
          label="Rerservations"
          active={isActive("reservations")}
          onClick={() => router.push("/admin/reservations")}
        />
        <SidebarNavButton
          label="Panier"
          active={isActive("paniers")}
          onClick={() => router.push("/admin/paniers")}
        />
        <SidebarNavButton
          label="Utilisateur"
          active={isActive("users")}
          onClick={() => router.push("/admin/users")}
        />
      </nav>
    </aside>
  );
}
