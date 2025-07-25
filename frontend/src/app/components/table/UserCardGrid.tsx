"use client";

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  date_creation: string;
};

type Props = {
  users: User[];
  selectedUserId: string | null;
  onSelect: (id: string) => void;
};

export default function UserCardGrid({
  users,
  selectedUserId,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelect(user.id)}
          className={`flex flex-col items-center bg-gray-100 rounded-xl p-4 shadow transition border-2
            ${
              selectedUserId === user.id
                ? "border-accent ring-2 ring-accent"
                : "border-transparent"
            }
          `}
        >
          <div className="w-16 h-16 rounded-full bg-yellow flex items-center justify-center mb-2">
            {/* Avatar générique */}
            <span className="text-3xl">👤</span>
          </div>
          <span className="font-semibold text-lg text-dark">
            {user.firstname} {user.lastname}
          </span>
        </button>
      ))}
    </div>
  );
}
