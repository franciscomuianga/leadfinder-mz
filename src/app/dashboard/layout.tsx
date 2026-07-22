import { requireOrganization } from "@/lib/auth";
import { signOutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireOrganization(); // garante que só utilizadores autenticados chegam aqui

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-brand-border bg-brand-surface p-4">
        <p className="mb-6 px-2 text-lg font-bold text-white">LeadFinder</p>
        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-brand-bg hover:text-white"
          >
            Visão geral
          </Link>
          <Link
            href="/leads"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-brand-bg hover:text-white"
          >
            Pesquisar leads
          </Link>
        </nav>

        <form action={signOutAction} className="mt-8 px-2">
          <Button variant="ghost" size="sm" className="w-full justify-start px-1">
            Sair
          </Button>
        </form>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
