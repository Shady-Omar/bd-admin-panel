import './App.css';
import ExcelFileUploader from './Components/ExcelFileUploader';
import Navbar from './Components/Navbar';
import SearchCompanies from './Components/SearchBar';
import PopupComponent from './Components/addBtn';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <div className='flex flex-row'>
        <PopupComponent/>
        <SearchCompanies/>
      </div>
      <h4 className='p-4 font-semibold text-xl text-left'>or</h4>
      <ExcelFileUploader/>
    </div>
  );
}

export default App;
