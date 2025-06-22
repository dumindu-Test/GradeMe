const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

console.log(`${colors.bright}🔐 Creating Test Users with Hashed Passwords${colors.reset}`)
console.log(`${colors.cyan}===================================================${colors.reset}`)

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log(`${colors.red}❌ Error: Missing Supabase environment variables${colors.reset}`)
  console.log(`${colors.yellow}Please add these to your .env file:${colors.reset}`)
  console.log(`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url`)
  console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key`)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestUsers() {
  console.log(`${colors.blue}📝 Creating test users...${colors.reset}`)
  
  try {
    // Test users to create
    const testUsers = [
      {
        email: 'admin@grademe.com',
        password: 'admin123',
        user_type: 'admin',
        full_name: 'System Administrator'
      },
      {
        email: 'student@university.edu',
        password: 'student123',
        user_type: 'student',
        full_name: 'Test Student'
      },
      {
        email: 'teacher@grademe.com',
        password: 'teacher123',
        user_type: 'admin',
        full_name: 'Test Teacher'
      }
    ]

    for (const userData of testUsers) {
      console.log(`${colors.yellow}Creating user: ${userData.email}${colors.reset}`)
      
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single()
      
      if (existingUser) {
        console.log(`${colors.yellow}⚠️  User ${userData.email} already exists, skipping...${colors.reset}`)
        continue
      }
      
      // Hash password
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(userData.password, saltRounds)
      
      // Create user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            email: userData.email,
            password_hash: passwordHash,
            user_type: userData.user_type,
            full_name: userData.full_name,
            is_active: true
          }
        ])
        .select()
        .single()
      
      if (createError) {
        console.log(`${colors.red}❌ Error creating user ${userData.email}:${colors.reset}`, createError.message)
        continue
      }
      
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: newUser.id,
            email: newUser.email,
            user_type: newUser.user_type,
            full_name: newUser.full_name
          }
        ])
      
      if (profileError) {
        console.log(`${colors.yellow}⚠️  Could not create profile for ${userData.email}:${colors.reset}`, profileError.message)
      }
      
      console.log(`${colors.green}✅ Created user: ${userData.email} (${userData.user_type})${colors.reset}`)
    }
    
    console.log(`${colors.bright}${colors.green}🎉 Test users created successfully!${colors.reset}`)
    console.log(`${colors.cyan}===================================================${colors.reset}`)
    console.log(`${colors.bright}Test Credentials:${colors.reset}`)
    console.log(`${colors.yellow}Admin: admin@grademe.com / admin123${colors.reset}`)
    console.log(`${colors.yellow}Student: student@university.edu / student123${colors.reset}`)
    console.log(`${colors.yellow}Teacher: teacher@grademe.com / teacher123${colors.reset}`)
    
  } catch (error) {
    console.log(`${colors.red}❌ Fatal error:${colors.reset}`, error.message)
    process.exit(1)
  }
}

// Run the function
createTestUsers()