import { supabase } from '../supabaseClient';






export async function getOrCreateConversation(listingId, buyerId, sellerId) {
    const{ data: existing, error: findError } = await supabase
    .from('conversations')
    .select('*')
    .eq('listing_id', listingId)
    .eq('buyer_id', buyerId)
    .maybeSingle(); 


    if (findError) throw findError;
    if (existing) return existing;



    const{ data: created, error: createError } = await supabase
    .from('conversations')
    .insert({listing_id: listingId, buyer_id: buyerId, seller_id: sellerId})
    .select()
    .single();


    if (createError) throw createError;
    return created;
}

export async function getUserConversations(userId) {
    const{ data, error } = await supabase
    .from('conversations')
    .select(`
        *,
        listings( id, title),
        buyer:profiles!conversation_buyer_id_fkey(id, full_name),
        seller:profiles!conversations_seller_id_fkey(id, full_name)
        `
    )
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('created_at', {ascending:false});

    if(error) throw error;
    return data;
    
}
export async function sendMessage(conversationId, senderId, content) {
    const { data, error} = await supabase 
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: senderId,
            content: content,
        })
        .select()
        .single();
        if(error){
            console.error("failed inserting data", error.message)
            return;
        }
        return data;

    };
    export async function getMessages(conversationId) {
        const{data, error}= await supabase 
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending:true});



        if(error){
            console.error("There seems to be a problem", error.message)
        
        }
        return data;
    }
    
    
