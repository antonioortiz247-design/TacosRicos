create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  category text not null check (category in ('tacos','especialidades','viernes','miercoles','jueves')),
  name text not null,
  price numeric(10,2) not null,
  image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id),
  user_id uuid,
  items jsonb not null,
  total numeric(10,2) not null,
  delivery_type text not null,
  address text,
  address_references text,
  payment_method text not null,
  payment_status text not null default 'pending',
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table if not exists order_items (
  id bigserial primary key,
  order_id uuid references orders(id) on delete cascade,
  product_name text not null,
  config jsonb,
  created_at timestamptz default now()
);

create table if not exists event_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id),
  payload jsonb not null,
  created_at timestamptz default now()
);

create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) unique,
  horarios jsonb,
  zonas_envio jsonb,
  whatsapp_number text,
  created_at timestamptz default now()
);

create table if not exists drivers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  driver_id uuid references drivers(id),
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id),
  code text not null,
  discount numeric(10,2) not null,
  expiration timestamptz,
  created_at timestamptz default now()
);
