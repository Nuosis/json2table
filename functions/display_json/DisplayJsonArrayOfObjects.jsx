import React, { useState, useEffect } from "react";
import MyTable from "../../components/MyTable";
import Alert from "../../components/Alert";
import SimpleInput from "../../components/Input";
import { sendToFilemaker, validateIsArrayofObjects } from "./utils";
import handleSettings from "./settings"


const DisplayJsonArrayOfObjects = ({ json, darkMode=false, obj}) => {
  console.log("JsonTable Init...",{json});
  console.log(obj)
  //safety check
  if(!json){
    return(
      <Alert title="Invalid Initialization" dialog="The data provided was null." actionText="OK" />
    )
  }

  //set variables/state
  const d = json.json;
  const settings = json.settings
  const [searchValue, setSearchValue] = useState(settings.initialSearch?settings.initialSearch:"");
  const [filteredData, setFilteredData] = useState([]);

  //CUSTOM CSS
  const searchDiv = {
    position: 'sticky',
    top: '0',
    right: '0',
    backgroundColor: darkMode ? '#000000' : 'White', // Dark mode background color
    color: darkMode ? 'white' : 'black',  // Adjust text color for dark mode
    zIndex: 10,
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0.5rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',  // Tailwind's shadow-sm
  };

  // Data checks
  if(!validateIsArrayofObjects(d).isValid){
    return (
      <Alert title="Invalid Data Format" dialog = {validateIsArrayofObjects(d).message} actionText="OK" />
    )
  }

  // Extract OBJECT from each record
  const data = React.useMemo(() => d.map(record => record[obj]), [d, obj]);


  // Ensure data array is not empty after extraction
  if(!validateIsArrayofObjects(data).isValid){
    return (
      <Alert title="Invalid Data Format" dialog = {validateIsArrayofObjects(data).message} actionText="OK" />
    )
  }

  //HANDLE SETTINGS
  const columns = React.useMemo(() => handleSettings(data, settings), [data, settings.hide, settings.sortOrder, settings.format]);

  //HANDLE SEARCHING
  useEffect(() => {
    const filtered = data.filter(record =>
      Object.values(record).some(value =>
        String(value).toLowerCase().includes(searchValue.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [searchValue, data]);

  // Render the table
  return (
    <div className="h-screen" >
      <div id="1" style={searchDiv}>
        <div className="w-1/3">
          <SimpleInput 
            id="1" 
            type="text" 
            name="search" 
            value = {searchValue}
            placeholder="Search..." 
            useData={(e) => setSearchValue(e.target.value)} 
            darkMode ={darkMode}
          />
        </div>
      </div>
      <div id="2" className="flex-grow overflow-auto">
        <MyTable data={filteredData} columns={columns} callback={sendToFilemaker} darkMode={darkMode}/>
      </div>
    </div>
  );
};

export default DisplayJsonArrayOfObjects;
