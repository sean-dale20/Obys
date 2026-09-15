import {useEffect, useState} from "react"
import Auth from './pages/Auth'
import './App.css'
import { supabase } from "./supabaseClient"
import Listings from "./pages/Listings"
import CreateListingForm from "./pages/CreateListingForm"
import MyListings from "./pages/MyListings"
import ClickedListing from "./ClickedListing"
import MessagePage from "./Chat/MessagePage"



function App(){

const [session, setSession] = useState(null)
const [loading, setLoading] = useState(true)
const [activeTab, setActiveTab] = useState("home")
const [selectedListing, setselectedListing] = useState (null);

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
        <span className="myListings" onClick={() => setActiveTab("myListings")}>My Listings</span>
        
        </div>

        <div className="nav-right">
       <p className="email">{session.user.email}</p>
      <button onClick = {() => supabase.auth.signOut()}>Log out </button>
      </div>

      </div>
     
      
       {activeTab === "home" && (
        <Listings
        onSelectListing={(id) => {
          setselectedListing(id);
          setActiveTab("ClickedListing");
        }}
        />
       )}



       

       {activeTab === "post-item" && <CreateListingForm/>}
       {activeTab === "messages" && <MessagePage/>}
  {activeTab === "myListings" && <MyListings/>}
  {activeTab === "ClickedListing" && <ClickedListing id={selectedListing}/>}
      
      </div>
    )
  }
}




  

export default App