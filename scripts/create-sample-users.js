#!/usr/bin/env node

/**
 * GradeMe Sample Users Creation Script
 * 
 * This script creates sample admin and student users in Supabase Auth
 * so you can test the application with real login credentials.
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

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
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Sample users to create
const sampleUsers = [
  {
    email: 'admin@grademe.com',
    password: 'admin123!',
    user_type: 'admin',
    full_name: 'System Administrator'
  },
  {
    email: 'teacher@grademe.com',
    password: 'teacher123!',
    user_type: 'admin',
    full_name: 'John Teacher'
  },
  {
    email: 'alice@university.com',
    password: 'student123!',
    user_type: 'student',
    full_name: 'Alice Johnson'
  },
  {
    email: 'bob@university.com',
    password: 'student123!',
    user_type: 'student',
    full_name: 'Bob Smith'
  },
  {
    email: 'carol@university.com',
    password: 'student123!',
    user_type: 'student',
    full_name: 'Carol Davis'
  }
]

async function createSampleUsers() {
  log('\n🎓 GradeMe Sample Users Creation', 'bright')
  log('=' .repeat(50), 'cyan')
  
  // Get Supabase credentials from environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    log('❌ Supabase environment variables not found!', 'red')
    log('Please ensure .env file contains:', 'dim')
    log('NEXT_PUBLIC_SUPABASE_URL=your_project_url', 'dim')
    log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key', 'dim')
    return
  }
  
  if (supabaseUrl.includes('mock')) {
    log('❌ Mock Supabase URL detected. Please configure real Supabase credentials.', 'red')
    return
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  log(`🔗 Connected to Supabase: ${supabaseUrl}`, 'blue')
  log(`👥 Creating ${sampleUsers.length} sample users...`, 'yellow')
  
  const results = {
    created: [],
    existing: [],
    errors: []
  }
  
  for (const user of sampleUsers) {
    try {
      log(`\n📝 Creating user: ${user.email} (${user.user_type})`, 'dim')
      
      // Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            user_type: user.user_type,
            full_name: user.full_name
          }
        }
      })
      
      if (authError) {
        if (authError.message.includes('already registered')) {
          log(`⚠️  User ${user.email} already exists`, 'yellow')
          results.existing.push(user.email)
        } else {
          log(`❌ Error creating ${user.email}: ${authError.message}`, 'red')
          results.errors.push({
            email: user.email,
            error: authError.message
          })
        }
      } else {
        log(`✅ Successfully created ${user.email}`, 'green')
        results.created.push(user.email)
        
        // Wait a bit to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
    } catch (error) {
      log(`❌ Unexpected error creating ${user.email}: ${error.message}`, 'red')
      results.errors.push({
        email: user.email,
        error: error.message
      })
    }
  }
  
  // Summary
  log('\n📊 Creation Summary', 'cyan')
  log('=' .repeat(30), 'dim')
  
  if (results.created.length > 0) {
    log(`✅ Created: ${results.created.length} users`, 'green')
    results.created.forEach(email => log(`   - ${email}`, 'dim'))
  }
  
  if (results.existing.length > 0) {
    log(`⚠️  Already existed: ${results.existing.length} users`, 'yellow')
    results.existing.forEach(email => log(`   - ${email}`, 'dim'))
  }
  
  if (results.errors.length > 0) {
    log(`❌ Errors: ${results.errors.length} users`, 'red')
    results.errors.forEach(({email, error}) => log(`   - ${email}: ${error}`, 'dim'))
  }
  
  // Login credentials
  log('\n🔐 Sample Login Credentials', 'bright')
  log('=' .repeat(40), 'cyan')
  
  log('\n👨‍💼 Admin Accounts:', 'magenta')
  log('Email: admin@grademe.com', 'dim')
  log('Password: admin123!', 'dim')
  log('Email: teacher@grademe.com', 'dim')
  log('Password: teacher123!', 'dim')
  
  log('\n👨‍🎓 Student Accounts:', 'blue')
  log('Email: alice@university.com', 'dim')
  log('Password: student123!', 'dim')
  log('Email: bob@university.com', 'dim')
  log('Password: student123!', 'dim')
  log('Email: carol@university.com', 'dim')
  log('Password: student123!', 'dim')
  
  log('\n🎯 Next Steps:', 'bright')
  log('1. Go to http://localhost:3000', 'dim')
  log('2. Use any of the credentials above to log in', 'dim')
  log('3. Admin users can create exams and manage students', 'dim')
  log('4. Student users can take exams and view results', 'dim')
  
  log('\n⚠️  Important Notes:', 'yellow')
  log('- These are sample accounts for development only', 'dim')
  log('- Change passwords in production', 'dim')
  log('- User profiles are auto-created via database triggers', 'dim')
}

// Main execution
if (require.main === module) {
  createSampleUsers().catch(error => {
    console.error('Script failed:', error)
    process.exit(1)
  })
}

module.exports = { createSampleUsers }