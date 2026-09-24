import{ useState, useEffect} from "react"
import {supabase} from "../supabaseClient"
import "../App.css";




function Listings({onSelectListing}){
    const[listings, setListings] = useState([])
    const[images, setImages]= useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedLocation, setSelectedLocation] = useState("");

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


    const filteredListings = listings.filter((x) =>{
     const searchfilter = x.title.toLowerCase().includes(searchTerm.toLowerCase())

    const locationfilter = x.location === selectedLocation

if(selectedLocation === ""){
    return searchfilter
}
else if(searchTerm === ""){
    return locationfilter
}
else if(searchfilter && locationfilter ){
    return true
}
else
    return false;


})


    return(
        <div>
        <div className="listings-heading-container">
        <h1 className="listings-heading">Listings</h1>
       
        </div>

        <div className="search-bar-container">
        
            
            <input
            type="text"
            placeholder="🔍 Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
/>
<select
value={selectedLocation}
onChange={(e) => setSelectedLocation(e.target.value)}
>
    <option  value="">Sort Location</option>
    <option value="Clark">Clark</option>
    <option value="Angeles">Angeles</option>
    <option value="Balibago">Balibago</option>
    <option value="Dau">Dau</option>
    <option value="Clark">Clark</option>
    <option value="Mabalacat">Mabalacat</option>
    <option value="San-fernando">San-fernando</option>
</select>
</div>






<div className="listing-container">

         <p className="listings-count">
           There are {listings.length} listings available
        </p>

                <div className="grids">
                
                {filteredListings.map((listing) => {
                    const image = images.find((img) => img.listing_id === listing.id)
                    return(
                        <div 
                        //onclick for clicked listing
                        onClick={() => onSelectListing(listing.id)}
                        className="listing-grid"
                        key={listing.id}
                        >
                        <p className="listing-title">{listing.title}</p>
                        {image && <img src={image.images_url} alt={listing.title}/>}
                        <p className="price"> PRICE: ₱{listing.price}</p>
                        <p className="item-description">{listing.description}</p>
                        <div className="location-timeline-row"> 
                        <p className="Location">📍{listing.location}</p>
<p className="timeline">Posted: {new Date(listing.created_at).toLocaleDateString("en-US",{
    month: "short",
    day: "numeric",
    year: "numeric",
   
})}</p>
 </div>
                        </div>
                    )
                })}
                
                </div>
</div>
        </div>
    )
}
export default Listings;