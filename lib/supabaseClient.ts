import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://keddpyhblaxwuoiwsrhz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZGRweWhibGF4d3VvaXdzcmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0OTQ4OTYsImV4cCI6MjA1NDA3MDg5Nn0.LdwvVueMYRVRB07SC6eT1kzFEYIGaft01c54v6diysM'
export const supabase = createClient(supabaseUrl, supabaseKey)
