import{ useState, useEffect} from "react"
import {supabase} from "../supabaseClient"

export default function MessagePage() {

const [conversations, setConversations] = useState([]);
const [selectedConvo, setSelectedConvo] = useState(null);
const [messages, setMessages] = useState([]);



async function getConversation() {


       
        const{data:mydata, error:myError} = await supabase.auth.getUser();

       
       if(myError){
        console.error("failed fetching your Id", myError.message )
        return;
       }
        const myId = mydata.user.id;
    
    const {data,error} = await supabase
    .from('conversations')
    .select('*, listings(title)')
    .or(`buyer_id.eq.${myId},seller_id.eq.${myId}`)
    .order('created_at', {ascending: false});

    if(error){
        console.error('failed fetching conversations', error.message);
    
   return;
        
    }
  
    
    


 
    console.log(data);
    setConversations(data);
}

    async function getMessages() { 
        const { data: mData , error: mError} = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id',selectedConvo.id)
        .order('created_at', {ascending: true});

        if(mError){
            console.error("failed fetching messages", mError.message)
            return;
        }
        console.log(mData);
        setMessages(mData);
    }



useEffect(() => {
    getConversation();
}, [])

useEffect(() => {
    if(!selectedConvo) return;
    getMessages();
}, [selectedConvo]);


    return(
        <div className="message-page">
            <h2>Messages</h2>
     

        {conversations.map((convo) => (
            <div key={convo.id} className="conversation-item" onClick={() => setSelectedConvo(convo)}>
            {convo.listings.title}

            </div>


        ))}

   </div>
   
        

    )}
