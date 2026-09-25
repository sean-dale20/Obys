import {  useEffect, useState } from "react";
import { supabase } from "./supabaseClient";



export default function ClickedListing ({id}){

    const[loading, setLoading]= useState (true);
    const[listing, setListing]= useState (null);
    const[error, setError] = useState(false);
    const[image, setImage] = useState ([])
    const [profile, setProfile] = useState (null);

    

    async function getprofile(sellerId) {
        try{
        const { data, error} = await supabase 
        .from('profiles')
        .select('full_name, contact_number')
        .eq('id', sellerId)
        .single();
      
        
        
    

if(error){
    console.error("failed fetching profiles", error.message);
    return;
}

setProfile(data);

    }
    catch(error){
        console.error("unexpected error", error.message)

    }

    }




    async function getListings(id) {
try{
        const {data, error} = await supabase
        .from('listings')
        .select('*')
     .eq('id', id)
     .single()
       
        




        if(error){
            console.error("failed fetching your data", error.message);
            setLoading(false);
            return
        }
        setListing(data)

getprofile(data.seller_id)


        setLoading(false)
      
}
    
        catch(errss){
            console.error("there seems to be an unexpected problem", errss.message);
        setError(true);
        setLoading(false);
        
        
    }
}

async function getImages(id) {
    try{
    const{ data, error } = await supabase
    .from('listings_images')
    .select('*')
    .eq('listing_id',id)
    

    
    

    setImage(data);
    


    
    if(error){
        console.error("There was a problem fetching your images", error.message)
return;
    }
}
catch(error){
    console.error("There seems to be a problem with your request", error.message)
setLoading(false);
return;




}

}



    
useEffect(() =>{
    getImages(id);
    getListings(id);
    
   
    
}, [id])


if (loading){
    return <p>Loading...</p>
}
if(error){
    return <p>Something went wrong loading this listing</p>;
}
if(!listing){
    return <p>Listing now found</p>;
}




return (
    
    <div className="clicked-listing">
    
  
    

<div className="clicked-listing-container-1">
<div className="clicked-listing-image-container">
{image.map((ikotm) => (
    <img key={ikotm.id} src={ikotm.images_url} alt={listing.title}/>
    ))}
    </div>
    
<div className="clicked-listing-description1">
<h2>Item description</h2>
<p className="clicked-listing-description">Description: {listing.description}</p>

<div className="line">

        <p className="clicked-listing-price">₱{listing.price}</p>
<p className="clicked-listing-contact">Contact: {profile?.contact_number}</p>
</div>
    </div>
    </div>




    <div className="clicked-listing-container-2">
    <h2 className="clicked-listing-title">{listing.title}</h2>

<div className="clicked-listing-description2">
<div className="line">
<p className="clicked-listing-seller">Seller: {profile?.full_name}</p>
<p className="clicked-listing-location">📍{listing.location}</p>
</div>
</div>
</div>



    </div>
    




    
)






        
    }











