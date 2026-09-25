import { useState } from "react";
import {supabase} from "../supabaseClient";



const MAX_IMAGES = 4





const LOCATIONS = ["Angeles", "Balibago", "Dau", "Clark", "Mabalacat","San Fernando"];


export default function CreateListingForm(){
const [title, setTitle] = useState("");
const [description, setDescription] = useState ("");
const [price, setPrice] = useState ("");
const [location, setLocation] = useState ("");

const [images, setImages] = useState([]);
const [previews, setPreviews] = useState([]);



const [submitting, setSubmitting] = useState (false);


//needs to be studied

//needs to be studied
function handleImageSelect(e){
    const files = Array.from(e.target.files);
    const room = MAX_IMAGES - images.length;
    const accepted = files.slice(0, room);


    setImages((prev) => [...prev, ...accepted]);
    setPreviews((prev) => [
        ...prev,
        ...accepted.map((file) => URL.createObjectURL(file)),
    ]);
}

//remove-image   FUNCTION
function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
}







//submit handle FUNCTION
async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true)


  
//image upload selecting



    const uploadedUrls = [];

for(let i = 0; i < images.length; i++){
    const file = images[i];
    const fileName = Date.now() + "-" + file.name;

    const uploadResult = await supabase.storage
    .from("listing-images")
    .upload(fileName, file);


    if(uploadResult.error){
        console.error("Upload failed:", uploadResult.error.message)
        setSubmitting(false);
        return;
    }
    const urlResult = supabase.storage
    .from("listing-images")
    .getPublicUrl(fileName);


    uploadedUrls.push(urlResult.data.publicUrl);
    setSubmitting(false);
}

console.log("All uploaded URLs:", uploadedUrls);
setSubmitting(false);



const {data: {user}} = await supabase.auth.getUser();
    

    // injecting it through listings in supabase
    const {data: listingData, error: listingError} = await supabase
    .from('listings')
    .insert({
        title: title,
        description: description,
        price: price,
        location: location,
        seller_id: user.id,
    })
    .select()
    .single()
    
    if(listingError){
        console.error("failed to create listing", listingError.message)
   setSubmitting(false);

   return;
    }

    console.log("Listing created:", listingData);


    for(let i = 0; i < uploadedUrls.length; i++){
        const { error: imageError } = await supabase
        .from('listings_images')
        .insert({
            listing_id: listingData.id,
            images_url: uploadedUrls[i],

        });
        if(imageError){
            console.error("failed to save image:", imageError.message );
        }
        else{
            console.log("Image saved successfully:", uploadedUrls[i]);
        }


    }

    setSubmitting(false);
}
    










const canSubmit = title.trim() && price && location && images.length > 0;
return(
    <div id="createListing">
    <form onSubmit={handleSubmit}>

    <input
    type="text"
    className="createListing-title"
    placeholder="Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    />

    <textarea
    type="text"
    className="createListing-description"
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    />

    <input
    type="number"
    className="createListing-price"
    placeholder="Price"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
/>


{/* this is for picking location */}
<select
className="createListing-location"
value={location}
onChange={(e) => setLocation(e.target.value)}
>

<option value="">Select a location</option>



{LOCATIONS.map((loc) => (
    <option key={loc} value={loc}>
    {loc}
    </option>
))}
</select>

<input

type="file"
className="createListing-chooseFile"
accept="image/*"
multiple
onChange={handleImageSelect}
disabled={images.length >= MAX_IMAGES}
/>

<div>
    {previews.map((src, index) => (
        <div key={src}>
        <img src={src} alt={`preview ${index}`} width={80} height={80} />
         <button type="button" onClick={() => removeImage(index)}>
            Remove
         </button>
         </div>

    ))}
</div>
<button className="createListing-submit" type="submit" disabled={!canSubmit}>Submit Listing</button>



    </form>
    </div>
);
}

