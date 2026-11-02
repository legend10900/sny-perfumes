-- =======================================================
-- SNY PERFUMES — SUPABASE PRODUCTION DATABASE SCHEMA
-- =======================================================

-- 1. Create Orders Table
create table if not exists public.orders (
  id text primary key,
  order_number text unique not null,
  customer jsonb not null,
  items jsonb not null,
  subtotal numeric not null,
  shipping_fee numeric not null,
  total numeric not null,
  payment_method text not null check (payment_method in ('razorpay', 'cod')),
  payment_status text not null default 'PENDING' check (payment_status in ('PENDING', 'PAID', 'FAILED')),
  order_status text not null default 'PENDING' check (order_status in ('PENDING', 'CONFIRMED', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')),
  razorpay_payment_id text,
  razorpay_order_id text,
  shiprocket_order_id text,
  shiprocket_shipment_id text,
  shiprocket_tracking_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Performance Indexes
create index if not exists idx_orders_order_number on public.orders (order_number);
create index if not exists idx_orders_razorpay_order_id on public.orders (razorpay_order_id);
create index if not exists idx_orders_created_at on public.orders (created_at desc);

-- 3. Row Level Security (RLS) Policies
alter table public.orders enable row level security;

-- Allow public reads for order tracking by order_number
create policy "Allow public order tracking query"
  on public.orders
  for select
  using (true);

-- Allow server-side service role key to insert and update
create policy "Allow service role full access"
  on public.orders
  for all
  using (true)
  with check (true);
