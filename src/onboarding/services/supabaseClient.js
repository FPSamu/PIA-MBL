// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vylwkqjiwgutppiuuick.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5bHdrcWppd2d1dHBwaXV1aWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MjM2MjgsImV4cCI6MjA2NzM5OTYyOH0.Fldx2nrrFKS9ikN84kcXEg8KWf4OfEwgFyY74dLri6c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
