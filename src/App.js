import './App.css';
import TableComponent from './Components/DataTable';
import ExcelFileUploader from './Components/ExcelFileUploader';
import Navbar from './Components/Navbar';
import SearchCompanies from './Components/SearchBar';
import PopupComponent from './Components/addBtn';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <div className='flex flex-col md:flex-row items-start'>
        <div className='w-full flex flex-row items-start'>
          <PopupComponent/>
          <h4 className='p-4 font-semibold text-xl text-left'>or</h4>
          <ExcelFileUploader/>
        </div>
        <div className='w-full'>
          <SearchCompanies/>
        </div>
      </div>
      <hr/>
      <TableComponent/>
    </div>
  );
}

export default App;
