import React, { useState, useEffect } from 'react';
import { db } from '../firebase'
import { collection, getDocs, query, where, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const TableComponent = () => {
  const [data, setData] = useState([]);


  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [compID, setCompID] = useState('');
  const [name, setName] = useState('');
  const [boycott, setBoycott] = useState('No'); // Default to 'No'
  const [url, setUrl] = useState('');

  const [compName, setCompName] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'companies'), (querySnapshot) => {
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      setData(documents);
    });
  
    // Cleanup function to unsubscribe from the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, []);
  

  const openModal = (item) => {
    setSelectedCompany(item);
    setIsModalOpen(true);
    setCompID(item.id);
    setName(item.name);
    setCompName(item.name)
    setBoycott(item.boycott === true ? "Yes" : "No");
    setUrl(item.url);
  };

  const handleEdit = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Confirm Edit?') === true) {
      if (name !== compName) {
        try {

          // Query Firestore to check if the new name already exists
          const querySnapshot = await getDocs(
            query(collection(db, 'companies'), where('name', '==', name))
          );
    
          if (querySnapshot.size === 0) {
            // No existing document with the same name found, proceed with the update
            await updateDoc(doc(db, 'companies', compID), {
              name: name,
              boycott: boycott === ('Yes' || 'yes') ? true : false,
              url: url,
            });
            setIsModalOpen(false);
            alert('Company Details Updated!');
          } else {
            // A document with the same name already exists, show an error message
            alert('Company with the same name already exists!');
          }
        } catch (error) {
          console.error(error);
        }
      } else if (name === compName) {
        
        try {
          console.log(name);
          console.log(compName);
          console.log(boycott);

          await updateDoc(doc(db, 'companies', compID), {
            name: name,
            boycott: boycott === ('Yes' || 'yes') ? true : false,
            url: url,
          });
          setIsModalOpen(false);
          alert('Company Details Updated!');
        } catch (error) {
          console.error(error);
        }

      }
      
    }
  };

  const handleDelete = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this company?') === true) {

      try {
        await deleteDoc(doc(db, "companies", compID));
        setIsModalOpen(false);
        alert('Company Deleted!');
        // window.location.reload()
      } catch (error) {
        console.error(error);
      }
      
    }
  }

  const handleTableDelete = async (itemId) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this company?') === true) {

      try {
        console.log(itemId);
        await deleteDoc(doc(db, "companies", itemId));
        setIsModalOpen(false);
        alert('Company Deleted!');
        // window.location.reload()
      } catch (error) {
        console.error(error);
      }
      
    }
  }

  return (
    <div className='flex justify-center mt-5 w-full relative' style={{zIndex: '1'}}>
      <div className="relative overflow-x-auto shadow-md rounded-lg w-[95%]  ">
        <table className="w-full text-sm text-left text-gray-400 rounded-lg">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Company name
              </th>
              <th scope="col" className="px-6 py-3">
                Boycott
              </th>
              <th scope="col" className="px-6 py-3">
                URL
              </th>
              <th scope="col" className="px-6 py-3">
                Modify
              </th>
              <th scope="col" className="px-6 py-3">
                
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="bg-gray-900" style={{borderBottom: '1px solid rgb(55 65 81)'}}>
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                  {item.name}
                </th>
                <td className="px-6 py-4">{item.boycott === true ? 'Yes' : "No"}</td>
                <td className="px-6 py-4">{item.url}</td>
                <td className="px-6 py-4">
                  <button onClick={() => openModal(item)} className="font-medium text-blue-500 hover:underline">
                    Edit
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleTableDelete(item.id)} className="font-medium text-blue-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && selectedCompany && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">

          <div className="absolute bg-white w-2/3 md:w-1/3 p-4 rounded-lg shadow-lg z-10 flex flex-col ">
            <h2 className='font-bold mb-2'>Modify Company Details</h2>
            <div className="mb-2">
              <label htmlFor="name" className="text-left block font-semibold mb-2">Name:</label>
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
              <label htmlFor="boycott" className="text-left block font-semibold mb-2">Boycott:</label>
              <select
                type="text"
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
              <label htmlFor="url" className="text-left block font-semibold mb-2">URL (Optional):</label>
              <input
                type="text"
                id="url"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 rounded border focus:transition-colors focus:border-gray-700 outline-none"
              />
            </div>
            <div className='flex flex-row justify-between items-center mt-4'>
              <button
                className="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button onClick={() => setIsModalOpen(false)} type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TableComponent;
