import { useState } from 'react';
import ConversationsList from './ConversationsList';
import ChatWindow from './ChatWindow';
import {supabase} from '../lib/supabaseClient';

export default function MessagePage(){
    const [activeConversation, setActiveConversation] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);



    useState(() => {
        supabase.auth.getUser().then(({data}) => {
            setCurrentUserId(data?.user?.id ?? null);
        });
    }, []);

    return(
        <div className='messages-page'>
            <ConversationsList
            currentUserId={currentUserId}
            activeConversationId={activeConversation?.id}
            onSelect={setActiveConversation}
            />
            <ChatWindow
            conversation={activeConversation}
            currentUserId={currentUserId}
            />
        </div>
    );
}







