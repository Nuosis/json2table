import React, { useState, useEffect } from "react";
import MyTable from "../components/MyTable";
import Alert from "../components/Alert";
import SimpleInput from "../components/Input";

const sendToFilemaker = (row) => {
  const scriptName = "displayJson * callback"
  const scriptParameter = JSON.stringify({row});
  FileMaker.PerformScript(scriptName, scriptParameter);
}

const JsonTable = ({ json }) => {
  console.log("JsonTable Init...",{json})
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Data checks
  if (!json || !Array.isArray(json) || json.length === 0 || typeof json[0] !== "object") {
    return (
      <Alert 
        title="Invalid Data Format" 
        dialog="The data provided is not valid or empty." 
        actionText="OK" 
      />
    );
  }

  // Extract fieldData from each record
  const data = React.useMemo(() => json.map(record => record.fieldData), [json]);

  // Ensure data array is not empty after extraction
  if (data.length === 0 || !data[0] || typeof data[0] !== "object") {
    return (
      <Alert 
        title="Invalid Data Format" 
        dialog="Extracted data is empty or not in the correct format." 
        actionText="OK" 
      />
    );
  }

  // Extract column headers from the keys of the first object
  const columns = React.useMemo(() => 
    Object.keys(data[0]).map(key => ({
      id: key,  // Unique id for the column
      header: key.charAt(0).toUpperCase() + key.slice(1),
      accessorKey: key,
    })),
    [data]
  );

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
    <div className="flex flex-col h-screen">
      <div id="1" className="sticky top-0 bg-white z-10 flex justify-end p-2 shadow-sm">
        <div className="w-1/3">
          <SimpleInput 
            id="1" 
            type="text" 
            name="search" 
            placeholder="Search..." 
            useData={(e) => setSearchValue(e.target.value)} 
          />
        </div>
      </div>
      <div id="2" className="flex-grow overflow-auto">
        <MyTable data={filteredData} columns={columns} callback={sendToFilemaker} />
      </div>
    </div>
  );
  
};

export default JsonTable;
