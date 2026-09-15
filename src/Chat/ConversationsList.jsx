import { useEffect, useState } from "react";
import { getUserConversations } from "./Chat";


export default function ConversationsList({ currentUserId, activeConversationId, onSelect}){
    const [conversations, setConversations] = useState ([]);
    const [loading, setLoading] = useState (true);


    useEffect(() => {
        if(!currentUserId) return;



        getUserConversations(currentUserId)
        .then(setConversations)
        .finally(() => setLoading(false));


    }, [currentUserId]);
   

if(loading){
    return <div className="conversations-list loading">Loading conversations...</div>;
    
}



if (conversations.length === 0) {
    return <div className="conversations-list empty">No conversations yet</div>
}

return(
    <div className="conversations-list">
        {conversations.map((conv) => {

            const isBuyer = conv.buyer_id === currentUserId;
            const otherPerson = isBuyer ? conv.seller : conv.buyer;
        

        return(
            <button
            key={conv.id}
            className={`conversation-item ${conv.id === activeConversationId ? 'active': ''}`}
            onClick={() => onSelect(conv)}
            >
                <span className="conversation-listing">{conv.listings?.title}</span>
                <span className="conversation-person">{otherPerson?.full_name}</span>
            </button>
        );
        })}
    </div>
);

}