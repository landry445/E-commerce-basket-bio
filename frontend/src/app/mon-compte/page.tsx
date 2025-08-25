export const dynamic = "force-dynamic";

async function getMe() {
  const res = await fetch("http://localhost:3001/auth/me", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    date_creation: string;
  };
}

export default async function MonComptePage() {
  const me = await getMe();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1
        className="text-2xl mb-6"
        style={{ fontFamily: "var(--font-pacifico)" }}
      >
        Mon compte
      </h1>
      {!me ? (
        <p>Impossible de charger le compte.</p>
      ) : (
        <div className="bg-white rounded-2xl p-5 shadow max-w-xl space-y-2">
          <p>
            <strong>Nom</strong> : {me.firstname} {me.lastname}
          </p>
          <p>
            <strong>Email</strong> : {me.email}
          </p>
          <p>
            <strong>Téléphone</strong> : {me.phone}
          </p>
          <p>
            <strong>Inscription</strong> :{" "}
            {new Date(me.date_creation).toLocaleDateString()}
          </p>
          <div className="pt-4 flex gap-3">
            <a
              className="rounded px-4 py-2 bg-[var(--color-primary)] text-white"
              href="/reserver"
            >
              Nouvelle réservation
            </a>
            <a className="rounded px-4 py-2 border" href="/mes-reservations">
              Mes réservations
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
