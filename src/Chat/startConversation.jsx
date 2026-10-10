import {supabase } from "../supabaseClient";

async function startConversation(listing) {
    const {data, error} = await supabase.auth.getUser()

    if(error){
        console.error("failed creating a conversation", error.message);
    return;
    }

console.log(data.user)





//only show the conversation that the logged in user has

const {data: existing, error: findError} = await supabase
.from('conversations')
.select('*')
.eq('listing_id', listing.id)
.eq('buyer_id', data.user.id)

.maybeSingle()

if(findError) {
    console.error("failed checking conversation", findError.message);
return;
}


if(existing){
    console.log("Existing coversation:", existing)
    return existing;
}
console.log(existing);


//creating of convo if there is no existing convo yet
const { data: created, error: createError}= await supabase
.from('conversations')
.insert({
    listing_id: listing.id,
    buyer_id: data.user.id,
    seller_id: listing.seller_id
})
.select()
.single()




if(createError){
    console.error("failed chatting the seller", createError.message);
    return;
}

console.log("New conversation:", created)
return created



}


export default startConversation

