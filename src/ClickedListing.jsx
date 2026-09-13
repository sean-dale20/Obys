import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";



export default function clickedListing ({id}){

    const[loading, setLoading]= useState (true);
    const[listing, setListing]= useState ([]);
    const[error, setError] = useState(false);
    const[image, setImage] = useState ([])
    


    async function getListings(id) {
try{
        const {data, error} = await supabase
        .from('listings')
        .select('*')
     .eq('id', id)
       
        




        if(error){
            console.error("failed fetching your data", error.message);
            setLoading(false);
            return
        }
        setListing(data)
        setLoading(false)
}
    
        catch(errss){
            console.error("there seems to be an unexpected problem", errss.message);
        
        
        
    }
}

async function getImages() {
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
    getImages();
    getListings(id);
    
}, [id])
return (
    <div className="clicked-listing">
    {listing.map((ikot) => (
    <div className="clicked-listing-container">
<h2>{ikot.title}</h2>

{image.map((ikotm) => (
    <img key={ikotm.id} src={ikotm.images_url} alt={ikot.title}/>
    ))}
<p className="clicked-listing-description">{ikot.description}</p>
<p className="clicked-listing-price">{ikot.price}</p>
<p className="clicked-listing-location">{ikot.location}</p>

    </div>
    










))}
     </div>
)






        
    }











