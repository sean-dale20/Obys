import { useState } from 'react'

import { supabase } from '../supabaseClient'


function Auth(){
const [isSignUp, setIsSignUp] = useState(false)

const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [fullName, setFullName] = useState('')

const [loading, setLoading] = useState(false)
const [errorMsg, setErrorMsg] = useState('')
const [contact, setContact] = useState('')

const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')


    try{
    if (isSignUp){

        const {  data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if(error){
            setErrorMsg(error.message)

        } else if (data.user){
            const {error: profileError} = await supabase
            .from('profiles')
            .insert({id: data.user.id, full_name: fullName, contact_number: contact        
            })

            if(profileError){
                setErrorMsg(profileError.message)
            } else{
                setErrorMsg('Sign up successful! Check your email to confirm your account.')
            }
        }
        } else{
            const {error} = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if(error){
                setErrorMsg(error.message)
            }
        }
        } finally{
        setLoading(false)
    }
}

// STYLING
    return(
        <div className='auth-container'>
            <h1>{isSignUp ? 'Sign Up' : 'Log In'}</h1>

            <form onSubmit={handleSubmit}>
{}


{isSignUp &&(
    <>
    <div>
        <label>Full Name</label>
        <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        />
    </div>

<div>
        <label>Contact</label>
        <input
        type='text'
        value={contact}
        onChange={(e) => setContact(e.target.value) }
        required
        minLength={6}
        />
    </div>
</>


)}
  
<div>
    <label>Email</label>
    <input type='email' 
    value={email}
    onChange={(e) => setEmail(e.target.value)}
        required
    />
</div>

    <div>
        <label>Password</label>
        <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value) }
        required
        minLength={6}
        />
    </div>

    
    {errorMsg && <p>{errorMsg}</p>}

    <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
</button>
</form>

{}
<button onClick={() => setIsSignUp(!isSignUp)}>
    {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
</button>
</div>
)
    
    
}

           

export default Auth