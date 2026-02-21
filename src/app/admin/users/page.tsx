"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/types/supabase";

interface UserWithEmail extends UserProfile {
  email?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const supabase = createClient();

    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profiles) {
      // For now, we just show the profiles without emails
      // In a production app, you'd use a server action or API to get emails
      setUsers(profiles as UserProfile[]);
    }

    setIsLoading(false);
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    if (
      newRole === "user" &&
      !confirm(
        "Er du sikker på, at du vil fjerne admin-rettigheder fra denne bruger?"
      )
    ) {
      return;
    }

    setUpdatingUserId(userId);

    const supabase = createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("user_profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (error) {
      alert("Kunne ikke opdatere bruger: " + error.message);
    } else {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole as "user" | "admin" } : user
        )
      );
    }

    setUpdatingUserId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-dark">Brugere</h1>
        <p className="text-dark/60">Administrer brugerroller</p>
      </div>

      {users.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-dark/10">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Bruger ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Rolle
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Oprettet
                </th>
                <th className="text-right px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Handling
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/10">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-mono text-sm text-dark">
                      {user.id.slice(0, 8)}...
                    </p>
                    {user.email && (
                      <p className="text-sm text-dark/60">{user.email}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-sm rounded-full ${
                        user.role === "admin"
                          ? "bg-accent/10 text-accent"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "Bruger"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-dark/80">
                    {new Date(user.created_at).toLocaleDateString("da-DK", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleUserRole(user.id, user.role)}
                      disabled={updatingUserId === user.id}
                      className={`text-sm font-medium disabled:opacity-50 ${
                        user.role === "admin"
                          ? "text-red-600 hover:text-red-700"
                          : "text-accent hover:text-accent/80"
                      }`}
                    >
                      {updatingUserId === user.id
                        ? "Opdaterer..."
                        : user.role === "admin"
                        ? "Fjern admin"
                        : "Gør til admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h2 className="font-serif text-xl text-dark mb-2">
            Ingen brugere endnu
          </h2>
          <p className="text-dark/60">
            Brugere vil blive vist her, når de opretter en konto.
          </p>
        </div>
      )}
    </div>
  );
}
