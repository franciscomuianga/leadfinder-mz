-- ==================================================================
-- LeadFinder MZ — Schema inicial
-- Correr no Supabase: SQL Editor → colar tudo → Run
-- ==================================================================

-- Organizações (desde já, mesmo com 1 só utilizador, para permitir
-- evoluir para SaaS multi-agência no futuro sem reescrever tudo)
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table memberships (
  user_id uuid references auth.users(id) on delete cascade not null,
  organization_id uuid references organizations(id) on delete cascade not null,
  role text not null default 'owner' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (user_id, organization_id)
);

-- Leads (negócios encontrados)
-- IMPORTANTE: guardamos dados do OpenStreetMap (licença ODbL, permite
-- reutilização/armazenamento — ao contrário da Google Places API).
-- O link do Google Maps é só um URL de conveniência, não dados extraídos.
create table leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade not null,

  -- Identificação da fonte
  osm_id text,                      -- ID do OpenStreetMap (nó/via/relação)
  osm_type text,                    -- 'node' | 'way' | 'relation'

  -- Dados do negócio (snapshot no momento da pesquisa)
  name text not null,
  category text,                    -- ex: "restaurante", "loja", "escritorio"
  address text,
  city text,
  phone text,
  existing_website text,            -- se já tinha site (para avaliar se precisa de atualização)
  latitude double precision,
  longitude double precision,
  google_maps_url text,             -- link direto, gerado a partir das coordenadas/nome

  -- Avaliação automática do site existente
  site_health text check (site_health in ('sem_site', 'site_fraco', 'site_ok', 'nao_avaliado')) default 'nao_avaliado',
  site_health_notes text,

  -- Gestão comercial (dados teus, não da fonte de dados)
  status text not null default 'novo' check (status in ('novo', 'contactado', 'em_negociacao', 'vendido', 'descartado')),
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_organization_idx on leads(organization_id);
create index leads_status_idx on leads(status);

-- Rascunhos de site gerados para cada lead
create table site_drafts (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade not null,
  template text not null default 'generico' check (template in ('restaurante', 'loja', 'escritorio', 'generico')),
  content_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Row Level Security — cada utilizador só vê dados da sua organização
alter table organizations enable row level security;
alter table memberships enable row level security;
alter table leads enable row level security;
alter table site_drafts enable row level security;

create policy "Ver as próprias organizações"
  on organizations for select
  using (id in (select organization_id from memberships where user_id = auth.uid()));

create policy "Ver as próprias memberships"
  on memberships for select
  using (user_id = auth.uid());

create policy "Gerir leads da própria organização"
  on leads for all
  using (organization_id in (select organization_id from memberships where user_id = auth.uid()));

create policy "Gerir rascunhos de leads da própria organização"
  on site_drafts for all
  using (lead_id in (
    select id from leads where organization_id in (
      select organization_id from memberships where user_id = auth.uid()
    )
  ));
