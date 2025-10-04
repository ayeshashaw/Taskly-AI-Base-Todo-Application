import {createClient} from '@supabase/supabase-js'

const supabaseUrl = 'https://rtwfykoeiniwedjxmeua.supabase.co'
const superbaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0d2Z5a29laW5pd2VkanhtZXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0ODQyNzcsImV4cCI6MjA3NTA2MDI3N30.HLNd9X9QCfr91PG7gbE1yKkGbxUgnCQG2U6-Qy4EsSE'
const supabase = createClient(supabaseUrl,superbaseAnonKey)

export default supabase