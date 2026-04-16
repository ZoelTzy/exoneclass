import { createClient } from '@supabase/supabase-js'

// Masukkan URL dari menu Data API
const supabaseUrl = 'https://nrnnxkfzcbhcvijviarz.supabase.co' 

// Masukkan key dari sb_publishable_... tadi
const supabaseAnonKey = 'sb_publishable_QlKEID-NCMKrK1HR0zLbfA_knJP9HIv' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
