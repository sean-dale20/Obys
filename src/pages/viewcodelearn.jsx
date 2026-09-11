    const [editId, setEditId] = useState(null); // holds the id of whichever listing is currently being edited (null = none)

    const [editForm, setEditForm] = useState({  // draft copy of the fields being edited — separate from items so nothing
        title: "",                               // changes on screen until Save is clicked
        price: "",
        description: "",
        location: ""
    })

    function editListing(item) {
        setEditId(item.id);           // marks this listing as "currently being edited"
        setEditForm({                 // pre-fills the draft with this listing's current values,
            title: item.title,        // so the input boxes open showing existing data instead of blank
            price: item.price,
            description: item.description,
            location: item.location
        });
    }

    function cancelEditing() {
        setEditId(null); // exits edit mode without saving — the draft (editForm) is just abandoned
    }

    function handleEditChange(e) {
        const { name, value } = e.target;                    // "name" tells us which field changed (matches
        setEditForm((prev) => ({ ...prev, [name]: value }));  // name="title"/"price"/etc on each input below)
    }                                                          // updates just that one field in the draft, on every keystroke

    async function saveEdit(id) {
        const { data, error: updateError } = await supabase
            .from('listings')
            .update({                          // sends the draft's current values to Supabase,
                title: editForm.title,         // actually updating that row in the database
                price: editForm.price,
                description: editForm.description,
                location: editForm.location
            })
            .eq('id', id)
            .select();

        if (updateError) {
            console.error("There was a problem editing your listing", updateError.message)
            return;
        }

        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...editForm } : item // finds the matching listing in local state and
            )                                                      // replaces its fields with the new draft values —
        );                                                         // updates the screen instantly, no refetch needed
        setEditId(null); // exits edit mode, switches this card back to the normal read-only view
    }
    







                    {editId !== item.id && (        // if this listing is NOT the one being edited...
                    <>
                        <p className="ml-title">{item.title}</p>       // ...show the normal read-only view:
                        <p className="ml-price">₱ {item.price}</p>     // plain text + Edit/Delete buttons
                        <p className="ml-description">{item.description}</p>
                        <p className="ml-location">{item.location}</p>

                        <button className="delete-buttton" onClick={() => deleteListing(item.id)}>Delete</button>
                        <button className="edit-button" onClick={() => editListing(item)}>Edit</button> // clicking this
                    </>                                                                                   // triggers editListing()
                )}

                {editId === item.id ? (          // if this listing IS the one being edited...
                    <div className="ml-edit-form">
                        <input                    // ...show input boxes instead, one per field
                            type="text"
                            name="title"                      // "name" must match a key in editForm
                            value={editForm.title}            // shows the current draft value
                            onChange={handleEditChange}       // updates the draft as you type
                            className="ml-edit-input"
                        />

                        <input
                            type="number"
                            name="price"
                            value={editForm.price}
                            onChange={handleEditChange}
                            className="ml-edit-input"
                        />

                        <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            className="ml-edit-textarea"
                        />

                        <textarea
                            name="location"
                            value={editForm.location}
                            onChange={handleEditChange}
                            className="ml-edit-input"
                        />

                        <div className="ml-edit-actions">
                            <button onClick={() => saveEdit(item.id)}>Save</button>  // saves the draft to Supabase
                            <button onClick={cancelEditing}>Cancel</button>          // discards the draft, exits edit mode
                        </div>
                    </div>
                ) : null}