import { useEffect, useState } from "react";
import {supabase} from "../supabaseClient";


function MyListings() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    const [editId, setEditId] = useState(null);


    const[editForm, setEditForm] = useState({
        title:"",
        price:"",
        description:"",
        location:""
    })

    async function getMylist() { 

try{
    const { data: {user}, error: userError} = await supabase.auth.getUser();


if(userError || !user){
    console.error("failed to get logged in user", userError?.message);
    setLoading(false);
    return;
}

        const {data, error} = await supabase 
        .from('listings')
        .select(`*, listings_images (id, images_url) `)
        .eq('seller_id', user.id)
        

        if(error){
            console.error("getting data failed", error.message)
            setError(error.message);
           return;
        }


        setItems(data);
     } catch(error){
            console.error("unexpected error:", error);
            setError(error.message);
        
            
        }finally{
            setLoading(false);
        }
    }
        useEffect(() => {
            getMylist();
        }, []);

        async function deleteListing(id) {
            const confirmed = window.confirm("Are you sure you want to delete this listing? This cannot be undone");
       if(!confirmed){
        return;
       } 

            const {data, error:deleteError} = await supabase
            .from('listings')
            .delete()
            .eq('id', id)


            if(deleteError){
                console.error("There was a problem deleting your listing " ,deleteError.message)
            setLoading(false)
            return
            }
            setItems((prev) => prev.filter((item) => item.id !==id));

            
        }


         function editListing(item){
            setEditId(item.id);
            setEditForm({
                title: item.title,
                price: item.price,
                description: item.description,
                location: item.location
            });

        }

        function cancelEditing(){
            setEditId(null);
        }

        function handleEditChange(e){
            const{name,value} = e.target
            setEditForm((prev) => ({ ...prev, [name]: value}));
        }

async function saveEdit(id) {
    const{data, error: updateError} = await supabase
    .from('listings')
    .update({
        title: editForm.title,
        price: editForm.price,
        description: editForm.description,
        location: editForm.location
    })
    .eq('id', id)
    .select();

    if(updateError){
        console.error("There was a problem editing your listing", updateError.message)
        return;
    }

    
    setItems((prev) =>
    prev.map((item) =>
        item.id === id ? { ...item, ...editForm} : item
)
    );
    setEditId(null);
}




    



        return(


<div className="my-listing">
{items.length === 0 &&(
    <p className="no-listing">You currently have no listings yet</p>
)}

            {items.map((item) => (
                
            <div className="my-listing-container" key={item.id}>


<div className="ml-image-container">
            {item.listings_images?.map((img) => (

                <img
                
                key={img.id}
                src={img.images_url}
                alt={item.title}
                className="ml-image"
                />
            ))}
</div>

{editId !== item.id&&(
    <>
<div className="mylistings-details-container">

            <p className="ml-title">{item.title}</p>
            <div className="line">
            <p className="ml-price">₱ {item.price}</p>
            <p className="ml-description">{item.description}</p>
            <p className="ml-location">📍 {item.location}</p>
<div className="buttons-container">
<button className="delete-buttton" onClick={() => deleteListing(item.id)}>Delete</button>
<button className="edit-button" onClick={() => editListing(item)}>Edit</button>
</div>
</div>
</div>
</>
)}



{editId === item.id ? (
    
    <div className="ml-edit-form">
    <h2>Edit form</h2>
    <p>Title</p>
    <input 
    type="text"
    name="title"
    value={editForm.title}
    onChange={handleEditChange}
    className="ml-edit-title"
    />

<p>Price</p>
<input
type="number"
name="price"
value={editForm.price}
onChange={handleEditChange}
className="ml-edit-price"
/>

<p>description</p>
<textarea
name="description"
value={editForm.description}
onChange={handleEditChange}
className="ml-edit-description"
/>

<p>location</p>
<textarea
type="text"
name="location"
value={editForm.location}
onChange={handleEditChange}
className="ml-edit-location"
/>



<div className="ml-edit-buttons">
<button onClick={() => saveEdit(item.id)}>Save</button>
<button onClick={cancelEditing}>Cancel</button>
</div>
</div>
):null}




            </div>
                
            ))}
            </div>
            
        );
        }
    
export default MyListings;