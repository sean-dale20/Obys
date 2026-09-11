import {useState, useEffect, useRef} from 'react';
import {getMessages, sendMessage} from '../lib/chat';


export default function ChatWindow({ conversation,  currentUserId}){
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage]= useState('');
    const bottomRef = useRef(null);



    useEffect(() =>{
        if(!conversation) return;

        getMessages(conversation.id).then(setMessages);


        const intervalId = setInterval(() => {
            getMessages(conversation.id).then(setMessages);
        
        }, 4000);









        return() => clearInterval(intervalId);
    }, [conversation]);



    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth'});


    }, [messages]);

    async function handleSend(e) {
        e.preventDefault();
        if(!newMessage.trim()) return;


        const text = newMessage;
        setNewMessage('');



        await sendMessage(conversation.id, currentUserId, text);




     


        getMessages(conversation.id).then(setMessages);

    }
    if(!conversation){
        return <div className="chat-window empty">Select a conversation to start chatting</div>
    }


    return(
        <div className="chat-window">
        <div className="chatmessages">
        {messages.map((msg) =>(
            <div
            key={msg.id}
            className={`message ${msg.sender_id === currentUserId ? 'mine' : 'theirs'}`}
            >

            <p>{msg.content}</p>
            <span className="timestamp">
                {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
           
            </span>
           

     
        </div>
           ))}
<div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className='chat-input'>
<input
type='text'
value={newMessage}
onChange={(e) => setNewMessage(e.target.value)}
placeholder='Type a message'
/>

<button type='submit'>Send</button>
        </form>
        </div>
    );
}
   