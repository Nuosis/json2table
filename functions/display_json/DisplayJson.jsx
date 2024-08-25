import React, { useState, useEffect } from "react";
import MyTable from "../../components/MyTable";
import Alert from "../../components/Alert";
import SimpleInput from "../../components/Input";

const sendToFilemaker = (row) => {
  const scriptName = "displayJson * callback";
  const scriptParameter = JSON.stringify({ row });
  FileMaker.PerformScript(scriptName, scriptParameter);
};

const searchDiv = {
  position: 'sticky',
  top: '0',
  backgroundColor: 'white',
  zIndex: 10,
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '0.5rem',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',  // Tailwind's shadow-sm
};


const DisplayJson = ({ json }) => {
  console.log("JsonTable Init...");
  const d = json.data;
  const settings = json.settings;
  console.log({ d, settings });
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Data checks
  if (!json || !Array.isArray(d) || d.length === 0 || typeof d[0] !== "object") {
    return (
      <Alert
        title="Invalid Data Format"
        dialog="The data provided is not valid or empty."
        actionText="OK"
      />
    );
  }

  // Extract fieldData from each record
  const data = React.useMemo(() => d.map(record => record.fieldData), [d]);

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

  // Extract column headers from the keys of the first object, filtering out the ones to hide
  const columns = React.useMemo(() => {
    return Object.keys(data[0])
      .filter(key => {
        // Check if the key starts with any of the prefixes in settings.hide
        return !settings.hide.some(prefix => key.startsWith(prefix));
      })
      .map(key => ({
        id: key,  // Unique id for the column
        header: key.charAt(0).toUpperCase() + key.slice(1),
        accessorKey: key,
      }));
  }, [data, settings.hide]);

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

export default DisplayJson;
