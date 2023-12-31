import React, { useState, useEffect } from 'react';
import { db, algoliaIndex } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const SearchCompanies = (props) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [compID, setCompID] = useState('');
  const [name, setName] = useState('');
  const [boycott, setBoycott] = useState('No'); // Default to 'No'
  const [url, setUrl] = useState('');

  const [compName, setCompName] = useState('');

  const [companiesData, setCompaniesData] = useState([]);

  useEffect(() => {
    setCompaniesData(props.companiesData);
  }, [props.companiesData]);

  async function queryCompanies(searchText) {
    let companiesData = [];
    await algoliaIndex
      .search(searchText, { hitsPerPage: 10 })
      .then(async ({ hits }) => {
        for (const hit of hits) {
          try {
            const docRef = doc(db, hit.path);
            const docSnap = await getDoc(docRef);
            companiesData = ([...companiesData, { id: docSnap.id, ...docSnap.data() }])
          } catch (error) {
            console.error('Error fetching document:', error);
          }
        }
      })
      .catch(err => {
        console.log(`This is an error ${err}`);
      });


    return companiesData;
  }


  const handleSearch = async (searchText) => {
    setSearch(searchText);
    if (searchText) {
      const suggestions = await queryCompanies(searchText);
      setSuggestions(suggestions);
    } else {
      setSuggestions([]);
    }
  };

  const openModal = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
    setSuggestions([]); // Clear the suggestions when opening the modal
    setCompID(company.id);
    setName(company.name);
    setCompName(company.name)
    setBoycott(company.boycott === true ? "Yes" : "No");
    setUrl(company.url);
    setSearch('');
  };

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedCompany(null);
    }
  }, [isModalOpen]);

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
            props.fetchCompanies();
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
          props.fetchCompanies();
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
        props.fetchCompanies();
        alert('Company Deleted!');
      } catch (error) {
        console.error(error);
      }

    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 relative">
      <input
        type="text"
        placeholder="Search for companies..."
        className="w-full p-2 rounded-lg shadow transition-colors border-gray-500 border-2 focus:outline-none focus:border-blue-500 focus:border-2"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="mt-2 border rounded shadow-lg absolute z-10 bg-white w-full">
          {suggestions.map((company) => (
            <React.Fragment key={company.id}>
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer text-left pl-4"
                onClick={() => openModal(company)}
              >
                {company.name}
              </li>
              <hr />
            </React.Fragment>
          ))}
        </ul>
      )}

      {isModalOpen && selectedCompany && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50" style={{ zIndex: '999' }}>

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

export default SearchCompanies;
