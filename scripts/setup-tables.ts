import { setupTables } from '../src/lib/setup-tables';

console.log('Setting up Supabase tables...');
setupTables().then(() => {
  console.log('Setup complete!');
  process.exit(0);
}).catch((error) => {
  console.error('Setup failed:', error);
  process.exit(1);
}); 