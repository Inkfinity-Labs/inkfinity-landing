import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email address' })
  }

  try {
    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Insert new waitlist entry
    const { error } = await supabase
      .from('waitlist')
      .insert([
        { 
          email,
          signed_up_at: new Date().toISOString(),
          status: 'pending'
        }
      ])

    if (error) throw error

    return res.status(200).json({ message: 'Successfully joined the waitlist' })
  } catch (error) {
    console.error('Waitlist error:', error)
    return res.status(500).json({ message: 'Failed to join waitlist' })
  }
} 