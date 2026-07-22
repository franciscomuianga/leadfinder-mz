# LeadFinder MZ

Ferramenta para encontrar negócios em Moçambique sem site (ou com site fraco)
e gerar propostas/previews de sites automaticamente.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Supabase** (Postgres + Auth)
- **Tailwind CSS**
- **OpenStreetMap / Overpass API** — fonte de dados (gratuita, sem cartão,
  dados guardáveis sob licença ODbL — ao contrário da Google Places API)
- Link direto para o **Google Maps** por negócio (sem API, sem custo)
- **Vercel** — hosting

## Setup

### 1. Base de dados (Supabase)

1. No painel do Supabase, abre o **SQL Editor**.
2. Cola o conteúdo de `supabase/schema.sql` e corre.
3. Vai a **Project Settings → API** e copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (nunca expor no cliente)

### 2. Variáveis de ambiente

```bash
cp .env.example .env.local
# preencher com os valores do Supabase
```

### 3. Instalar e correr localmente

```bash
npm install
npm run build
npm run dev
```

### 4. Deploy (Vercel)

1. Importa o repositório GitHub na Vercel.
2. Define as 3 variáveis de ambiente (mesmas do `.env.local`) nas
   definições do projeto na Vercel.
3. Deploy automático a cada push para `main`.

## Como funciona

1. **Pesquisar leads** — escolhe categoria + cidade → consulta a Overpass
   API (OpenStreetMap) → mostra negócios, destacando os que não têm site.
2. **Guardar como lead** — grava na base de dados (organização própria,
   protegida por RLS) e corre uma avaliação automática do site existente
   (se houver) — `sem_site` / `site_fraco` / `site_ok`.
3. **Ficha do lead** — dados do negócio, link direto ao Google Maps, preview
   de um site gerado automaticamente (mostrado dentro da app, sem deploy),
   gestão de estado (Novo → Contactado → Em negociação → Vendido) e notas.

## Nota legal importante

Os dados de negócios vêm do **OpenStreetMap** (licença ODbL — atribuição
obrigatória, já incluída na página de pesquisa). O link do Google Maps é
gerado localmente a partir do nome/coordenadas — não usa a Google Places
API, por isso não há restrições de armazenamento a respeitar desse lado.

## Próximos passos (pós-MVP, se decidires vender como SaaS)

- Cobrança via Stripe
- Múltiplos utilizadores por organização (convites)
- Deploy automático do site real quando o lead é marcado como "Vendido"
- Fotos reais fornecidas pelo cliente
- Envio de proposta por email/WhatsApp diretamente da app
