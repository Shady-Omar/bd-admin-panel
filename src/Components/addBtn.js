import React, { useState } from 'react';
import { db } from '../firebase'
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

function PopupComponent(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [boycott, setBoycott] = useState('No'); // Default to 'No'
  const [url, setUrl] = useState('');

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    // Validation: Ensure name is provided.
    if (name.trim() === '') {
      alert('Name field is required.');
    } else {
      // Perform your submit action here
      // For example, you can send the data to an API or handle it as needed.
      try {
        // console.log('Submitting:', name, boycott, url);
      
        // Check if a document with the same name already exists
        const querySnapshot = await getDocs(query(collection(db, "companies"), where("name", "==", name)));
      
        if (querySnapshot.size > 0) {
          // A document with the same name already exists
          alert('Company with this name already exists.');
        } else {
          // No document with the same name, so you can add a new one
          await addDoc(collection(db, "companies"), {
            name: name,
            boycott: boycott === ('Yes' || 'yes') ? true : false,
            url: url,
          });
          // console.log("Document written with ID: ", docRef.id);
          props.fetchCompanies();
          // Success message:
          alert('Company Added Successfully!');
          
        }
      
        // Close the popup
        closePopup();
      } catch (error) {
        console.error(error);
      }
      
    
    }
  };

  return (
    <div className="p-4 flex">
      <button
        onClick={openPopup}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer transition-colors"
      >
        Add
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center" style={{zIndex: '999'}}>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-50 z-0" onClick={closePopup}></div>

          <div className="absolute bg-white w-2/3 md:w-1/3 p-4 rounded-lg shadow-lg z-10 flex flex-col ">
            <div className="mb-2">
              <label htmlFor="name" className="text-left block font-bold mb-2">Name:</label>
              <input
                type="text"
                id="name"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded border focus:transition-colors focus:border-gray-700 outline-none"
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="boycott" className="text-left block font-bold mb-2">Boycott:</label>
              <select
                id="boycott"
                value={boycott}
                onChange={(e) => setBoycott(e.target.value)}
                className="w-full p-2 rounded border focus:transition-colors focus:border-gray-700 outline-none"
              >
                <option value="Select" disabled>Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="url" className="text-left block font-bold mb-2">URL (Optional):</label>
              <input
                type="text"
                id="url"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 rounded border focus:transition-colors focus:border-gray-700 outline-none"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 my-2 transition-colors"
            >
              Submit
            </button>
            <button onClick={closePopup} type="button" className="focus:outline-none text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopupComponent;
