#!/usr/bin/env node

/**
 * GradeMe Database Setup Script
 * 
 * This script helps set up the database by running all migrations in order.
 * It can be used with either local Supabase CLI or cloud Supabase instances.
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  
  try {
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure chronological order
    
    return files.map(file => ({
      name: file,
      path: path.join(migrationsDir, file),
      content: fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    }));
  } catch (error) {
    log(`Error reading migrations directory: ${error.message}`, 'red');
    return [];
  }
}

function displayMigrationInfo() {
  log('\n🗂️  GradeMe Database Migration Files', 'cyan');
  log('=' .repeat(50), 'dim');
  
  const migrations = getMigrationFiles();
  
  migrations.forEach((migration, index) => {
    log(`${index + 1}. ${migration.name}`, 'bright');
    
    // Extract description from filename
    const parts = migration.name.split('_');
    if (parts.length > 1) {
      const description = parts.slice(1).join('_').replace('.sql', '').replace(/_/g, ' ');
      log(`   ${description}`, 'dim');
    }
    
    // Show file size
    const stats = fs.statSync(migration.path);
    log(`   ${Math.round(stats.size / 1024)}KB`, 'dim');
    log('');
  });
  
  log(`Total migrations: ${migrations.length}`, 'green');
}

function generateCombinedSQL() {
  log('\n📄 Generating combined SQL file...', 'yellow');
  
  const migrations = getMigrationFiles();
  const outputPath = path.join(__dirname, '../supabase/combined-setup.sql');
  
  let combinedSQL = `-- GradeMe Complete Database Setup
-- Generated on: ${new Date().toISOString()}
-- This file combines all migrations for easy setup

`;

  migrations.forEach(migration => {
    combinedSQL += `
-- ================================================================
-- MIGRATION: ${migration.name}
-- ================================================================

${migration.content}

`;
  });
  
  // Add final setup notes
  combinedSQL += `
-- ================================================================
-- SETUP COMPLETE
-- ================================================================

-- Next steps:
-- 1. Create your first admin user through the application
-- 2. Update environment variables with your Supabase credentials
-- 3. Test the authentication flow

-- Sample admin credentials for development:
-- Email: admin@grademe.com
-- You'll need to create this user through the application signup flow

SELECT 'GradeMe database setup completed successfully!' as status;
`;

  try {
    fs.writeFileSync(outputPath, combinedSQL);
    log(`✅ Combined SQL file created: ${outputPath}`, 'green');
    log('   You can run this file directly in Supabase SQL Editor', 'dim');
  } catch (error) {
    log(`❌ Error creating combined SQL file: ${error.message}`, 'red');
  }
}

function showInstructions() {
  log('\n🚀 Setup Instructions', 'cyan');
  log('=' .repeat(50), 'dim');
  
  log('\n📋 Option 1: Supabase CLI (Recommended)', 'bright');
  log('1. Install Supabase CLI: npm install -g supabase', 'dim');
  log('2. Initialize: supabase init', 'dim');
  log('3. Start local: supabase start', 'dim');
  log('4. Apply migrations: supabase db reset', 'dim');
  
  log('\n📋 Option 2: Supabase Cloud Dashboard', 'bright');
  log('1. Create project at supabase.com', 'dim');
  log('2. Copy content from supabase/combined-setup.sql', 'dim');
  log('3. Paste and run in SQL Editor', 'dim');
  log('4. Update your .env.local with project credentials', 'dim');
  
  log('\n📋 Option 3: Individual Migration Files', 'bright');
  log('Run each migration file in order through SQL Editor:', 'dim');
  
  const migrations = getMigrationFiles();
  migrations.forEach((migration, index) => {
    log(`${index + 1}. ${migration.name}`, 'dim');
  });
  
  log('\n🔐 Environment Variables', 'bright');
  log('Add these to your .env.local file:', 'dim');
  log('NEXT_PUBLIC_SUPABASE_URL=your_project_url', 'dim');
  log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key', 'dim');
  
  log('\n🎯 Next Steps', 'bright');
  log('1. Run database setup using one of the options above', 'dim');
  log('2. Start your Next.js application: npm run dev', 'dim');
  log('3. Create your first admin account through the app', 'dim');
  log('4. Test the exam creation and management features', 'dim');
}

// Main execution
function main() {
  log('🎓 GradeMe Database Setup Tool', 'bright');
  log('=' .repeat(50), 'cyan');
  
  const args = process.argv.slice(2);
  
  if (args.includes('--info') || args.includes('-i')) {
    displayMigrationInfo();
  } else if (args.includes('--generate') || args.includes('-g')) {
    generateCombinedSQL();
  } else if (args.includes('--help') || args.includes('-h')) {
    log('\nUsage:', 'bright');
    log('  node scripts/setup-database.js [options]', 'dim');
    log('\nOptions:', 'bright');
    log('  -i, --info      Show migration file information', 'dim');
    log('  -g, --generate  Generate combined SQL file', 'dim');
    log('  -h, --help      Show this help message', 'dim');
    log('\nWith no options: Show setup instructions', 'dim');
  } else {
    displayMigrationInfo();
    generateCombinedSQL();
    showInstructions();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  getMigrationFiles,
  generateCombinedSQL,
  displayMigrationInfo
};