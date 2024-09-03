import React, { useState, useEffect } from "react";
import MyTable from "../../components/MyTable";
import Alert from "../../components/Alert";
import SimpleInput from "../../components/Input";
import { handleSettings, ensureSettingsDefaults, sendToFilemaker, validateIsArrayofObjects, toTitleCase } from "./utils";


const DisplayJsonArrayOfObjects = ({ json, darkMode=false, ky}) => {
  console.log(ky)
  const obj = toTitleCase(ky)
  console.log(`jsonAoO Rendering ${ky}`)
  //safety check
  if(!json){
    return(
      <Alert title="Invalid Initialization" dialog="The data provided was null." actionText="OK" />
    )
  }

  //set variables/state
  const settings = ensureSettingsDefaults(json.settings)
  const [searchValue, setSearchValue] = useState(settings.initialSearch || '');
  const [filteredData, setFilteredData] = useState([]);


  const rawData = json.json?json.json:json;

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
  if(!validateIsArrayofObjects(rawData).isValid){
    return (
      <Alert title="Invalid Data Format" dialog = {validateIsArrayofObjects(rawData).message} actionText="OK" />
    )
  }

  // Extract OBJECT from each record
  let data = rawData
  if(rawData[0][ky]!==undefined){
    data = React.useMemo(() => rawData.map(record => record[ky]), [rawData, ky]);
  }

  // Ensure data array is not empty after extraction
  if(!validateIsArrayofObjects(data).isValid){
    return (
      <Alert title="Invalid Format" dialog = {validateIsArrayofObjects(data).message} actionText="OK" />
    )
  }
  console.log("data",data)

  //HANDLE SETTINGS
  const columns = React.useMemo(() => handleSettings(data, settings), [data, settings.hide, settings.columnOrder, settings.format]);
  console.log({columns})

  //HANDLE SEARCHING
  useEffect(() => {
    if (searchValue !== undefined && searchValue !== null) {
      const filtered = data.filter(record =>
        Object.values(record).some(value =>
          String(value).toLowerCase().includes(searchValue.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Show all data if searchValue is undefined or null
    }
  }, [searchValue, data]);

  // Render the table
  return (
    <div className="h-screen" >
      <div id="1" style={searchDiv}>
        <div className="w-64">
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
        <MyTable data={filteredData} columns={columns} callback={sendToFilemaker} darkMode={darkMode} obj={ky} />
      </div>
    </div>
  );
};

export default DisplayJsonArrayOfObjects;
