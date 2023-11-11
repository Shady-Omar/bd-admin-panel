import { useEffect, useState } from 'react';
import './App.css';
import TableComponent from './Components/DataTable';
import ExcelFileUploader from './Components/ExcelFileUploader';
import Navbar from './Components/Navbar';
import SearchCompanies from './Components/SearchBar';
import PopupComponent from './Components/addBtn';
import { db } from './firebase'
import { collection, getDocs } from 'firebase/firestore';

function App() {

  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    const companiesCollection = collection(db, 'companies');
    const companiesSnapshot = await getDocs(companiesCollection);

    const companiesData = companiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setCompanies(companiesData);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="App">
      <Navbar />
      <div className='flex flex-col md:flex-row items-start'>
        <div className='w-full flex flex-row items-start'>
          <PopupComponent fetchCompanies={fetchCompanies} />
          <h4 className='p-4 font-semibold text-xl text-left'>or</h4>
          <ExcelFileUploader companies={companies} />
        </div>
        <div className='w-full'>
          <SearchCompanies fetchCompanies={fetchCompanies} companiesData={companies} />
        </div>
      </div>
      <hr />
      <TableComponent fetchCompanies={fetchCompanies} />
    </div>
  );
}

export default App;
