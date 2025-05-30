import React from 'react'
import { SignIn} from '@clerk/clerk-react'

function SignInSkrible() {
  return (
    <div className="center-screen" style={{ backgroundColor: '#ece6f0' }}>
      <SignIn 
        signUpFallbackRedirectUrl="/signup" 
        fallbackRedirectUrl= "/main-site"
      />
    </div>
  )
}

export default SignInSkrible