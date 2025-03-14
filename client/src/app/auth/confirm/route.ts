import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { redirect } from 'next/navigation'
import { getServerClient } from '@/features/auth/lib/supabase-server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const redirect_to = searchParams.get('redirect_to') ?? '/'

  console.log(searchParams, redirect_to)

  if (token_hash && type) {
    const supabase = await getServerClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    console.log(error)
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(redirect_to)
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/auth/auth-code-error')
}