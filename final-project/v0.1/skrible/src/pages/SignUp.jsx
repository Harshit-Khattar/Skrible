import React from 'react'
import { SignUp } from '@clerk/clerk-react'

function SignUpSkrible() {
  return  (
  <div className='center-screen' style={{ backgroundColor: '#ece6f0' }}>
  <SignUp signInUrl="/signin" />
  </div>
)
}
export default SignUpSkrible