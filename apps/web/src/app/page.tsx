import UserForm from '@/components/user-form';
import { apiGet, type HealthResponse, type UsersResponse } from '@/lib/api';

export const dynamic = 'force-dynamic';

const stack = [
  { name: 'Next.js', role: 'Frontend', detail: 'App Router + React 19' },
  { name: 'Tailwind CSS', role: 'Styling', detail: 'CSS-first v4 config' },
  { name: 'Express', role: 'API', detail: 'REST + validation' },
  { name: 'PostgreSQL', role: 'Database', detail: 'SQL migrations via pg' },
];

async function safeGet<T>(path: string): Promise<T | null> {
  try {
    return await apiGet<T>(path);
  } catch {
    return null;
  }
}

export default async function Home() {
  const [health, usersResponse] = await Promise.all([
    safeGet<HealthResponse>('/health'),
    safeGet<UsersResponse>('/users'),
  ]);
  const users = usersResponse?.data ?? [];
  const apiUp = health?.status === 'ok';
  const dbUp = health?.database === 'connected';

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">Streaming platform</p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Next.js × Express × PostgreSQL</h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          A minimal, production-shaped monorepo with a typed REST API, SQL migrations, and a Tailwind UI that talks
          to the database end to end.
        </p>
      </header>

      <section aria-label="Stack" className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((item) => (
          <article key={item.name} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.role}</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{item.name}</h2>
            <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
          </article>
        ))}
      </section>

      <section aria-label="Service status" className="mb-12 flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-4">
        <span className="text-sm font-medium text-slate-300">Status</span>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${apiUp ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
          <span className={`h-2 w-2 rounded-full ${apiUp ? 'bg-emerald-400' : 'bg-red-400'}`} />
          API {apiUp ? 'online' : 'offline'}
        </span>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${dbUp ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
          <span className={`h-2 w-2 rounded-full ${dbUp ? 'bg-emerald-400' : 'bg-red-400'}`} />
          Database {dbUp ? 'connected' : 'unavailable'}
        </span>
        {health && <span className="ml-auto text-xs text-slate-500">uptime {health.uptimeSeconds}s</span>}
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Users</h2>
            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">{users.length}</span>
          </div>

          {users.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-700 px-4 py-10 text-center text-sm text-slate-500">
              No users yet. Add one to verify the full stack.
            </p>
          ) : (
            <ul className="divide-y divide-slate-800">
              {users.map((user) => (
                <li key={user.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-100">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <time className="shrink-0 text-xs text-slate-600" dateTime={user.created_at}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="mb-5 text-xl font-semibold text-white">Create a user</h2>
          <UserForm />
          <p className="mt-4 text-xs text-slate-500">POST /api/users → validated with Zod, stored in PostgreSQL.</p>
        </div>
      </section>
    </main>
  );
}
