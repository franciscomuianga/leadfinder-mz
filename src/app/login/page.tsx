import { signInAction, signUpAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-bold text-white">LeadFinder MZ</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Encontra negócios sem site em Moçambique.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <form className="mt-6 space-y-3">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-neutral-400">
              Email
            </label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-neutral-400">
              Palavra-passe
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              minLength={6}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button formAction={signInAction} className="flex-1">
              Entrar
            </Button>
            <Button formAction={signUpAction} variant="secondary" className="flex-1">
              Criar conta
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
