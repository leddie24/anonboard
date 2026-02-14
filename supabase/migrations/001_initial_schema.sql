-- AnonBoard Schema
-- Run this in the Supabase SQL Editor to set up the database.

-- ============================================================
-- TABLES
-- ============================================================

create table boards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  owner_id uuid references auth.users(id) default auth.uid(),
  created_at timestamptz default now()
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id) on delete cascade not null,
  content text not null,
  anonymous_name text not null,
  user_id uuid default auth.uid(),
  created_at timestamptz default now()
);

create table votes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid default auth.uid(),
  value integer not null check (value in (-1, 1)),
  created_at timestamptz default now(),
  unique (post_id, user_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table boards enable row level security;
alter table posts enable row level security;
alter table votes enable row level security;

-- Boards: anyone can read, authenticated users can create, owners can delete
create policy "boards: anyone can read"
  on boards for select using (true);

create policy "boards: authenticated users can create"
  on boards for insert with check (auth.uid() = owner_id);

create policy "boards: owner can delete"
  on boards for delete using (auth.uid() = owner_id);

-- Posts: anyone can read, any signed-in user can post,
-- post author OR board owner can delete
create policy "posts: anyone can read"
  on posts for select using (true);

create policy "posts: signed-in users can create"
  on posts for insert with check (auth.uid() = user_id);

create policy "posts: author or board owner can delete"
  on posts for delete using (
    auth.uid() = user_id
    or auth.uid() = (select owner_id from boards where id = board_id)
  );

-- Votes: anyone can read, signed-in users can vote,
-- users can update or delete their own votes
create policy "votes: anyone can read"
  on votes for select using (true);

create policy "votes: signed-in users can create"
  on votes for insert with check (auth.uid() = user_id);

create policy "votes: user can update own vote"
  on votes for update using (auth.uid() = user_id);

create policy "votes: user can delete own vote"
  on votes for delete using (auth.uid() = user_id);

-- ============================================================
-- COMMENTS (nested, Reddit-style soft delete)
-- ============================================================

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade not null,
  parent_id uuid references comments(id),
  content text not null,
  anonymous_name text not null,
  user_id uuid references auth.users(id) default auth.uid() not null,
  is_deleted boolean default false,
  created_at timestamptz default now()
);

alter table comments enable row level security;

-- Comments: anyone can read, signed-in users can create,
-- comment author or board owner can soft-delete (update)
create policy "comments: anyone can read"
  on comments for select using (true);

create policy "comments: signed-in users can create"
  on comments for insert with check (auth.uid() = user_id);

create policy "comments: author or board owner can update"
  on comments for update using (
    auth.uid() = user_id
    or auth.uid() = (
      select b.owner_id from boards b
      join posts p on p.board_id = b.id
      where p.id = post_id
    )
  );
