import{ useState, useEffect} from "react"
import {supabase} from "../supabaseClient"

function Listings(){
    const[listings, setListings] = useState([])
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
        


    }, [])


    return(
        <div>
            <h1>Listings</h1>
        </div>
    )
}
export default Listings