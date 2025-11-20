import { Subscriber } from "./newsletterTypes";

type SubscribersCardProps = {
  subscribers: Subscriber[];
  loading: boolean;
};

export function SubscribersCard(props: SubscribersCardProps) {
  const { subscribers, loading } = props;
  const total = subscribers.length;

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow">
      <h2
        className="mb-2 text-xl"
        style={{ fontFamily: "var(--font-pacifico)" }}
      >
        Abonnés
      </h2>

      {loading && <p className="text-sm text-gray-600">Chargement…</p>}

      {!loading && total === 0 && (
        <p className="text-sm text-gray-600">
          Aucun abonné à la newsletter pour le moment.
        </p>
      )}

      {!loading && total > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-800">
            {total} abonné(s) recevront cette newsletter.
          </p>

          <details className="rounded border border-gray-100 bg-gray-50/70">
            <summary className="cursor-pointer px-3 py-2 text-xs text-gray-700">
              Liste des abonnés
            </summary>
            <ul className="max-h-40 divide-y divide-gray-100 overflow-y-auto text-sm">
              {subscribers.map((s) => (
                <li key={s.id} className="flex justify-between gap-4 px-3 py-2">
                  <span>
                    {s.firstname} {s.lastname}
                  </span>
                  <span className="text-gray-600">{s.email}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}
