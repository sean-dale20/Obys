import {useEffect, useState} from "react"
import Auth from './pages/Auth'
import './App.css'
import { supabase } from "./supabaseClient"
import Listings from "./pages/Listings"
import CreateListingForm from "./pages/CreateListingForm"


function App(){

const [session, setSession] = useState(null)
const [loading, setLoading] = useState(true)
const [activeTab, setActiveTab] = useState("home")

//checks the session
useEffect(() =>{
async function checkSession() {
  try{
  const {data, error} = await supabase.auth.getSession()
  

  if(error){
    console.error("Error checking session:", error.message)
    setLoading(false)
    return
  }
  setSession(data.session)
  setLoading(false)
  }
  catch(err){
    console.error("Unexpected error:", err.message)
    setLoading(false)
  }
}
checkSession()

//checks if there is changes if someone logs in or logs out
const { data: listener} = supabase.auth.onAuthStateChange((event, session) => {
  setSession(session)
})

return () => {
  listener.subscription.unsubscribe()
}



}, [])

  if(loading){

    return (
      <p> hold for a sec.....</p>
    )
    
  }
  if(!session) {
    return (
    <Auth/>
  
)
  }
  if(session){
    return(
      <div id="contents">

      

      <div id="nav-bar">
      <div className="nav-left">
        <span className="home" onClick={() => setActiveTab("home")}>Home</span>
        <span className="post-item" onClick={() => setActiveTab("post-item")}>Post Item</span>
        <span className="messages" onClick={() => setActiveTab("messages")}>Messages</span>
        </div>

        <div className="nav-right">
       <p>{session.user.email}</p>
      <button onClick = {() => supabase.auth.signOut()}>Log out </button>
      </div>

      </div>
     
      
       {activeTab === "home" && <Listings/>}
       {activeTab === "post-item" && <CreateListingForm/>}
       {activeTab === "messages" && <p> coming soon</p>}
  
      
      </div>
    )
  }
}




  

export default App