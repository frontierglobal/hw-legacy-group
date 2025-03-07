import { supabase } from './supabase';

export async function setupTables() {
  try {
    // Create users table
    const { error: usersError } = await supabase.rpc('create_users_table', {
      sql: `
        create table if not exists users (
          id uuid references auth.users on delete cascade,
          email text,
          role text check (role in ('admin', 'user')),
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          primary key (id)
        );
      `
    });

    if (usersError) throw usersError;

    // Create pages table
    const { error: pagesError } = await supabase.rpc('create_pages_table', {
      sql: `
        create table if not exists pages (
          id uuid default uuid_generate_v4() primary key,
          title text not null,
          slug text not null unique,
          content text not null,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
      `
    });

    if (pagesError) throw pagesError;

    // Create content table
    const { error: contentError } = await supabase.rpc('create_content_table', {
      sql: `
        create table if not exists content (
          id uuid default uuid_generate_v4() primary key,
          key text not null unique,
          value text not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
      `
    });

    if (contentError) throw contentError;

    console.log('Tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

// Run the setup
setupTables(); 