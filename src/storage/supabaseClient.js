import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bpixkpmbtxlxqnzywzcp.supabase.co'; // Replace with your URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwaXhrcG1idHhseHFuenl3emNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzOTA2NDgsImV4cCI6MjA2Njk2NjY0OH0.9ysoKW23PQZOFvoRkCeWp97y4yzJRGaiKSJdEKh8gOg'; // Replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseKey);