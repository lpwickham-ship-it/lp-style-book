-- items belong to brands and subcategories
-- subcategories belong to categories
-- reviews, wear_records, and photos belong to items

create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  country text,
  notes text,
  created_at timestamptz default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id),
  name text not null,
  slug text not null unique
);

create table items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand_id uuid references brands(id),
  subcategory_id uuid references subcategories(id),
  description text,
  material text,
  purchase_price numeric(10, 2),
  purchase_date date,
  purchase_location text,
  source_url text,
  status text not null default 'owned' check (status in ('owned', 'archived')),
  in_collection boolean not null default false,
  in_wishlist boolean not null default false,
  is_recommendation boolean not null default false,
  created_at timestamptz default now()
);

create table item_photos (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  storage_path text not null,
  is_primary boolean not null default false,
  created_at timestamptz default now()
);

create table lp_reviews (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  fit smallint not null check (fit between 1 and 10),
  comfort smallint not null check (comfort between 1 and 10),
  quality smallint not null check (quality between 1 and 10),
  versatility smallint not null check (versatility between 1 and 10),
  value smallint not null check (value between 1 and 10),
  notes text,
  reviewed_at timestamptz default now()
);

create table wear_records (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  worn_on date not null,
  season text check (season in ('Spring', 'Summer', 'Autumn', 'Winter')),
  occasion text check (occasion in ('Casual', 'Smart Casual', 'Work', 'Formal', 'Sport')),
  created_at timestamptz default now()
);

create table wishlist_items (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  status text not null default 'Wishlist'
    check (status in ('Wishlist', 'Researching', 'Considering', 'Purchased', 'Archived')),
  notes text,
  alternatives text,
  interest_score smallint check (interest_score between 1 and 10),
  created_at timestamptz default now()
);

create table failed_purchases (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  reason text not null check (reason in (
    'poor fit', 'poor quality', 'poor value', 'rarely worn',
    'doesn''t suit style', 'uncomfortable', 'impulse purchase', 'other'
  )),
  notes text,
  created_at timestamptz default now()
);

create table recommendation_entries (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references items(id) on delete set null,
  written_take text not null,
  published_at timestamptz default now()
);

create table item_pairings (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  paired_item_id uuid not null references items(id) on delete cascade,
  note text,
  unique(item_id, paired_item_id),
  check (item_id != paired_item_id)
);

create table hero_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  display_order integer not null default 0,
  created_at timestamptz default now()
);

-- RLS: all tables readable by anyone, writable only by authenticated users
alter table brands enable row level security;
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table items enable row level security;
alter table item_photos enable row level security;
alter table lp_reviews enable row level security;
alter table wear_records enable row level security;
alter table wishlist_items enable row level security;
alter table failed_purchases enable row level security;
alter table recommendation_entries enable row level security;
alter table item_pairings enable row level security;
alter table hero_images enable row level security;

create policy "public read" on brands for select using (true);
create policy "public read" on categories for select using (true);
create policy "public read" on subcategories for select using (true);
create policy "public read" on items for select using (true);
create policy "public read" on item_photos for select using (true);
create policy "public read" on lp_reviews for select using (true);
create policy "public read" on wear_records for select using (true);
create policy "public read" on wishlist_items for select using (true);
create policy "public read" on failed_purchases for select using (true);
create policy "public read" on recommendation_entries for select using (true);
create policy "public read" on item_pairings for select using (true);
create policy "public read" on hero_images for select using (true);

create policy "auth write" on brands for all using (auth.uid() is not null);
create policy "auth write" on categories for all using (auth.uid() is not null);
create policy "auth write" on subcategories for all using (auth.uid() is not null);
create policy "auth write" on items for all using (auth.uid() is not null);
create policy "auth write" on item_photos for all using (auth.uid() is not null);
create policy "auth write" on lp_reviews for all using (auth.uid() is not null);
create policy "auth write" on wear_records for all using (auth.uid() is not null);
create policy "auth write" on wishlist_items for all using (auth.uid() is not null);
create policy "auth write" on failed_purchases for all using (auth.uid() is not null);
create policy "auth write" on recommendation_entries for all using (auth.uid() is not null);
create policy "auth write" on item_pairings for all using (auth.uid() is not null);
create policy "auth write" on hero_images for all using (auth.uid() is not null);

-- Seed static reference data
insert into categories (name, slug) values
  ('Clothing', 'clothing'),
  ('Accessories', 'accessories'),
  ('Shoes', 'shoes');

insert into subcategories (category_id, name, slug) values
  ((select id from categories where slug = 'clothing'), 'Tops', 'tops'),
  ((select id from categories where slug = 'clothing'), 'Shirts', 'shirts'),
  ((select id from categories where slug = 'clothing'), 'Bottoms', 'bottoms'),
  ((select id from categories where slug = 'clothing'), 'Outerwear', 'outerwear'),
  ((select id from categories where slug = 'clothing'), 'Knitwear', 'knitwear'),
  ((select id from categories where slug = 'accessories'), 'Watches', 'watches'),
  ((select id from categories where slug = 'accessories'), 'Belts', 'belts'),
  ((select id from categories where slug = 'accessories'), 'Bags', 'bags'),
  ((select id from categories where slug = 'accessories'), 'Scarves', 'scarves'),
  ((select id from categories where slug = 'accessories'), 'Eyewear', 'eyewear'),
  ((select id from categories where slug = 'accessories'), 'Ties', 'ties'),
  ((select id from categories where slug = 'shoes'), 'Trainers', 'trainers'),
  ((select id from categories where slug = 'shoes'), 'Boots', 'boots'),
  ((select id from categories where slug = 'shoes'), 'Loafers', 'loafers'),
  ((select id from categories where slug = 'shoes'), 'Derby', 'derby'),
  ((select id from categories where slug = 'shoes'), 'Oxford', 'oxford');
