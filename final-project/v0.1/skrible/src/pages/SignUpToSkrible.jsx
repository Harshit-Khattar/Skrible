import React from 'react'
import { SignUp } from '@clerk/clerk-react'

function SignUpSkrible() {
  return  (
  <div className='center-screen' style={{ backgroundColor: '#ece6f0' }}>
  <SignUp 
  signInFallbackRedirectUrl="/signin"
  fallbackRedirectUrl= "/main-site"
   />
  </div>
)
}
export default SignUpSkrible