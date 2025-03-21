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

// The «SignUp/> component cannot render when a user is already signed in, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, Clerk is redirecting to the value set in 'afterSiqnUp
// URL instead.
// (This notice only appears in development)