-- =======================================================
-- SNY PERFUMES — PRODUCTION SUPABASE DATABASE SCHEMA
-- Architecture: Direct UPI (0% Fee) & Shiprocket Logistics
-- =======================================================

create extension if not exists "uuid-ossp";

-- 1. Products Table
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  tagline text,
  inspired_by text,
  description text,
  type text default 'Eau De Parfum',
  volume text default '30 ml',
  price numeric not null,
  compare_price numeric,
  stock int default 100,
  top_notes text[],
  heart_notes text[],
  base_notes text[],
  accent_color text,
  image_url text not null,
  lifestyle_image_url text,
  created_at timestamptz default now()
);

-- 2. Orders Table (Direct UPI & Shiprocket Tracking)
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  total_amount numeric not null,
  payment_method text not null default 'DIRECT_UPI', -- 'DIRECT_UPI' or 'COD'
  utr_number text,
  status text default 'PENDING_VERIFICATION', -- 'PENDING_VERIFICATION', 'VERIFIED', 'DISPATCHED', 'DELIVERED'
  shiprocket_order_id bigint,
  shiprocket_shipment_id bigint,
  awb_code text,
  courier_name text,
  tracking_url text,
  created_at timestamptz default now()
);

-- 3. Order Items Table
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  price numeric not null,
  quantity int not null
);

-- 4. Indexes for Rapid Querying
create index if not exists idx_orders_phone on orders(customer_phone);
create index if not exists idx_orders_utr on orders(utr_number);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at desc);

-- 5. Seed Catalog Products
insert into products (name, slug, tagline, inspired_by, description, type, volume, price, compare_price, top_notes, heart_notes, base_notes, accent_color, image_url)
values
  ('Titan Aura', 'titan-aura', 'Command The Unforgettable', 'Creed Aventus', 'A monumental blend of regal confidence and smoky sophistication.', 'Extrait De Parfum', '30 ml', 349, 499, ARRAY['Pineapple', 'Bergamot', 'Black Currant'], ARRAY['Birch', 'Jasmine', 'Rose'], ARRAY['Oakmoss', 'Ambergris', 'Vanilla'], '#f59e0b', '/branding/titan-aura.jpg'),
  ('Aqua Tide', 'aqua-tide', 'Freshness That Moves With You', 'Davidoff Cool Water', 'An invigorating aquatic tempest that captures the crisp rush of Aegean breakers.', 'Eau De Parfum', '30 ml', 349, 499, ARRAY['Marine Accord', 'Mint', 'Bergamot'], ARRAY['Lavender', 'Geranium', 'Jasmine'], ARRAY['Amber', 'Cedarwood', 'Musk'], '#38bdf8', '/branding/aqua-tide.jpg'),
  ('Midnight Oud', 'midnight-oud', 'A Fragrance Beyond Time', 'Lamsa Harir', 'Dark, opulent, and dangerously seductive with rich Persian saffron and agarwood.', 'Extrait De Parfum', '30 ml', 349, 499, ARRAY['Saffron', 'Bergamot', 'Lavender'], ARRAY['Rose', 'Geranium', 'Oud'], ARRAY['Amber', 'Patchouli', 'Musk'], '#c084fc', '/branding/midnight-oud.jpg'),
  ('Silk Oud', 'silk-oud', 'Liquid Gold on Velvet', 'Oud Bushra Habib', 'An oriental harmony where smoky aged agarwood is softened with silk petals.', 'Eau De Parfum', '30 ml', 349, 499, ARRAY['Saffron', 'Rose', 'Bergamot'], ARRAY['Oud', 'Agarwood', 'Jasmine'], ARRAY['Amber', 'Musk', 'Sandalwood'], '#d97706', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop'),
  ('Shadow Lust', 'shadow-lust', 'Dare The Night', 'Azzaro Most Wanted', 'A decadent cocktail of zesty citrus, melted salted caramel, and smoky Haitian vetiver.', 'Eau De Parfum', '30 ml', 349, 499, ARRAY['Lemon', 'Cardamom', 'Lavender'], ARRAY['Caramel', 'Geranium', 'Juniper Berries'], ARRAY['Amber', 'Tonka Bean', 'Vetiver'], '#a855f7', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop'),
  ('Floral Desire', 'floral-desire', 'Elegance in Bloom', 'Gucci Flora', 'A lush, radiant bouquet bursting with powdery peony blossoms and white rose.', 'Eau De Parfum', '30 ml', 349, 499, ARRAY['Peony', 'Lychee', 'Bergamot'], ARRAY['Rose', 'Osmanthus', 'Magnolia'], ARRAY['Musk', 'Sandalwood', 'Patchouli'], '#f472b6', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop'),
  ('Arabian Gold', 'arabian-gold', 'Royalty in Every Drop', 'Swiss Arabian', 'The grand heritage of Dubai encapsulated in gold with sacred oud smoke.', 'Extrait De Parfum', '30 ml', 349, 499, ARRAY['Saffron', 'Bergamot', 'Cardamom'], ARRAY['Rose', 'Oud', 'Jasmine'], ARRAY['Amber', 'Sandalwood', 'Musk'], '#eab308', '/branding/arabian-gold.jpg'),
  ('Signature', 'signature', 'The Benchmark of Suited Charisma', 'Hugo Boss', 'Crisp red apple and spicy cinnamon wrapped in classic geranium and refined sandalwood.', 'Eau De Parfum', '30 ml', 349, 499, ARRAY['Apple', 'Bergamot', 'Cinnamon'], ARRAY['Geranium', 'Jasmine', 'Sage'], ARRAY['Sandalwood', 'Vetiver', 'Amber'], '#d97706', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop'),
  ('Red Aura', 'red-aura', 'Passion Unleashed', 'Red Diamond', 'A fiery encounter between zesty blood orange, velvety crimson rose, and dark oud.', 'Eau De Parfum', '30 ml', 349, 499, ARRAY['Pink Pepper', 'Blood Orange', 'Lavender'], ARRAY['Rose', 'Jasmine', 'Cardamom'], ARRAY['Amber', 'Vanilla', 'Oud'], '#ef4444', 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1200&auto=format&fit=crop'),
  ('Asphalt', 'asphalt', 'Ride Bold. Live Free.', 'Harley Davidson', 'A bold, rebellious scent that roars with freedom and leaves a lasting trail of raw leather and smoky amber.', 'Extrait De Parfum', '30 ml', 349, 499, ARRAY['Bergamot', 'Lemon', 'Black Pepper', 'Lavender'], ARRAY['Geranium', 'Nutmeg', 'Clary Sage'], ARRAY['Amber', 'Leather', 'Vetiver', 'Patchouli'], '#ea580c', '/branding/asphalt.jpg'),
  ('Rush 7', 'rush-7', 'Energy That Defines You', 'Fresh Spicy Citrus & Cedar', 'An electrifying surge of zest and green botanical freshness with crushed mint and rich cedarwood.', 'Eau De Parfum', '100 ml', 349, 499, ARRAY['Bergamot', 'Lemon', 'Mint', 'Lavender'], ARRAY['Cinnamon', 'Jasmine', 'Cardamom'], ARRAY['Amber', 'Cedarwood', 'Musk'], '#22c55e', '/branding/rush-7.jpg')
on conflict (slug) do nothing;
