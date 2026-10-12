import{ useState, useEffect, useRef} from "react"
import {supabase} from "../supabaseClient"
import "../messagePage.css"

export default function MessagePage() {

const [conversations, setConversations] = useState([]);
const [selectedConvo, setSelectedConvo] = useState(null);
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState ("");
const [currentUserId, setCurrentUserId] = useState(null);
const messageListRef = useRef(null);


async function getConversation() {


       
        const{data:mydata, error:myError} = await supabase.auth.getUser();

       
       if(myError){
        console.error("failed fetching your Id", myError.message )
        return;
       }
        const myId = mydata.user.id;
        setCurrentUserId(myId);
    
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
//sending message
    async function sendMessages() {

if(newMessage === "") return;




const{data:mydata, error:myError} = await supabase.auth.getUser();

if(myError){
    console.error("failed fetching your Id", myError.message)
    return;
}








        const{data:sendData , error:sendError} = await supabase
        .from('messages')
        .insert({
            conversation_id: selectedConvo.id,
            sender_id:  mydata.user.id,
            content: newMessage
        })
       


        if(sendError){
        console.error("failed sending your message")
    return;
    }

setNewMessage("");
getMessages();
}

///////////////////////////////////////////////////////
useEffect(() => {
    getConversation();
}, [])
///////////////////////////////////////////////////////
useEffect(() => {
    if(!selectedConvo) return;

    console.log("START timer for chat:", selectedConvo.id);

     getMessages();

    const timer = setInterval(() => {
         console.log("TICK for chat:", selectedConvo.id);
        getMessages();
    }, 3000);
     return () => {
         console.log("STOP timer for chat:", selectedConvo.id)
        clearInterval(timer);
    };

}, [selectedConvo]);

///////////////////////////////////////////////////////
   
     useEffect(() => {
    if (!messageListRef.current) return;          // box not on screen yet (no chat open), so skip

    const box = messageListRef.current;           // the message-list div
    box.scrollTop = box.scrollHeight;             // scroll all the way down
}, [messages.length]);                            // run when the NUMBER of messages changes
///////////////////////////////////////////////////////

   

   

///////////////////////////////////////////////////////
    return(
        <div className="message-page">
            <h2>Messages</h2>
     

        {conversations.map((convo) => (
            <div key={convo.id} className={selectedConvo?.id === convo.id ? "conversation-item active" : "conversation-item"} onClick={() => setSelectedConvo(convo)}>
            {convo.listings.title}

            </div>
            


        ))}
 {selectedConvo ? 
        <div className="chat">



        <div className="message-list" ref={messageListRef}>
        {messages.map((msg) =>(
            <div key={msg.id} 
            className={msg.sender_id === currentUserId ? "message-item mine" : "message-item"}  >  
            
            {msg.content}
            
            
            </div>



        )) }
        </div>
       
        <div className="input-send-container">
        
        
        <div className="chat-input-container">
        <input

        id="sendMessageInput"
        type="text"
        value={newMessage}
        onChange={(a) => setNewMessage(a.target.value)}
        placeholder="Send a message"
         />
         </div>
         <div className="chat-button-container">
         <button onClick={sendMessages}>Send</button>
         </div>
           </div>
     
</div>
  : null}
   </div>
  
        

    )}
