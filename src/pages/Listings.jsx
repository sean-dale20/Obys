import{ useState, useEffect} from "react"
import {supabase} from "../supabaseClient"


function Listings(){
    const[listings, setListings] = useState([])
    const[images, setImages]= useState([])
    const [loading, setLoading] = useState(true)

// gets the stored data from listing in supabase
    useEffect(() => {
        async function checkListings() {
            try{
                const {data, error} = await supabase
                .from('listings')
                .select('*')
                



                if(error) { 
                    console.error("somethings went wrong, failed getting listings" , error.message);
                    setLoading(false)
                    return
                }

                setListings(data)
                setLoading(false)
            } catch (err){
                console.error("Unexpected error:", err.message)
                setLoading(false)
            }
            }
            
        checkListings()



        // gets the stored images from listings_images in supabase
      async function getListingImages() {
        try{
        const{data,error} = await supabase
        .from('listings_images')
        .select('*')


        if(error){
            console.error("failed getting the images", error.message);
            setLoading(false)
            return
        }

        setImages(data)
        setLoading(false)
    } catch (err){
        console.error("Unexpected error:", err.message)
        setLoading(false)
    }
        
      }
getListingImages()






    }, [])
    


    return(
        <div>
            <h1>Listings</h1>
<div className="listing-container">

                <div className="grids">
                {listings.map((listing) => {
                    const image = images.find((img) => img.listing_id === listing.id)
                    return(
                        <div className="listing-grid" key={listing.id}>
                        <p className="listing-title">{listing.title}</p>
                        {image && <img src={image.images_url} alt={listing.title}/>}
                        <p className="price"> PRICE: ₱{listing.price}</p>
                        <p className="item-description">{listing.description}</p>
                        <p className="Location">📍{listing.location}</p>

                        </div>
                    )
                })}
                
                </div>
</div>
        </div>
    )
}
export default Listings