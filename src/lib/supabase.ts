import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://givtawkvnkyiwjfeoqfa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdnRhd2t2bmt5aXdqZmVvcWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTk5NDYsImV4cCI6MjA2NTMzNTk0Nn0.w4MQwZy5M7JMGIU1SzcXVfVESm7yLRAfZMU9X6CgZHc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

