import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { debug } from './debug'

// Load environment variables
dotenv.config()

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

async function testInvitationQuery() {
  const  invitationId = '439c2523-96a2-49c2-ad29-c3ecae85cb52'
  
  debug.info('Testing invitation query:', { invitationId })

  const { data, error } = await supabase
    .from("caregiver_invitations")
    .select(`
      id,
      email,
      name,
      status,
      expires_at,
      specialists (
        name,
        business_name
      )
    `)
    .eq("email", 'goodealsnow@gmail.com')
    .single()

  debug.info('Query result:', {
    hasData: !!data,
    data,
    error
  })
}

// Run tests
async function main() {
  try {
    await testInvitationQuery()
  } catch (err) {
    debug.error('Test failed:', err)
  }
}

main() 