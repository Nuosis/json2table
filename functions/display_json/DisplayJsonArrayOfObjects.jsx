import React, { useState, useEffect } from "react";
import MyTable from "../../components/MyTable";
import App from "../../src/App";
import Alert from "../../components/Alert";
import SimpleInput from "../../components/Input";
import { sendToFilemaker, validateIsArrayofObjects } from "./utils";
import handleSettings from "./settings";

const DisplayJsonArrayOfObjects = ({ json, darkMode = false, obj }) => {
  const [expandedRows, setExpandedRows] = useState({}); // Object to store expanded state
  const [visibleEmails, setVisibleEmails] = useState({}); // Object to track visible emails per row

  const handleRowClick = (rowIndex) => {
    setExpandedRows(prevExpandedRows => ({
      ...prevExpandedRows,
      [rowIndex]: !prevExpandedRows[rowIndex]
    }));
  };

  const handleEmailClick = (rowIndex) => {
    setVisibleEmails(prevVisibleEmails => ({
      ...prevVisibleEmails,
      [rowIndex]: !prevVisibleEmails[rowIndex]
    }));
  };

  if (!json) {
    return (
      <Alert title="Invalid Initialization" dialog="The data provided was null." actionText="OK" />
    );
  }

  const d = json.json;
  const settings = json.settings;
  const [searchValue, setSearchValue] = useState(settings.initialSearch ? settings.initialSearch : "");
  const [filteredData, setFilteredData] = useState([]);

  const searchDiv = {
    position: 'sticky',
    top: '0',
    right: '0',
    backgroundColor: darkMode ? '#000000' : 'White',
    color: darkMode ? 'white' : 'black',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0.5rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  };

  if (!validateIsArrayofObjects(d).isValid) {
    return (
      <Alert title="Invalid Data Format" dialog={validateIsArrayofObjects(d).message} actionText="OK" />
    );
  }

  const data = React.useMemo(() => d.map(record => record[obj]), [d, obj]);

  if (!validateIsArrayofObjects(data).isValid) {
    return (
      <Alert title="Invalid Data Format" dialog={validateIsArrayofObjects(data).message} actionText="OK" />
    );
  }

  const onRenderUnderRow = ({ path, json }) => {
    setExpandedRows({ path, json });
  };

  const columns = React.useMemo(() => handleSettings(data, settings, onRenderUnderRow), [data, settings.hide, settings.sortOrder, settings.format]);

  useEffect(() => {
    const filtered = data.filter(record =>
      Object.values(record).some(value =>
        String(value).toLowerCase().includes(searchValue.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [searchValue, data]);

  return (
    <div className="h-screen">
      <div id="1" style={searchDiv}>
        <div className="w-1/3">
          <SimpleInput
            id="1"
            type="text"
            name="search"
            value={searchValue}
            placeholder="Search..."
            useData={e => setSearchValue(e.target.value)}
            darkMode={darkMode}
          />
        </div>
      </div>
      <div id="2" className="flex-grow overflow-auto">
        <MyTable
          data={filteredData}
          columns={columns}
          callback={sendToFilemaker}
          darkMode={darkMode}
          onRowClick={handleRowClick}
          expandedRows={expandedRows}
          renderCell={(rowIndex, columnIndex, value, column) => {
            if (column.id === 'emails' && value.length > 1) {
              const isExpanded = visibleEmails[rowIndex] || false;
              const displayedEmails = isExpanded ? value : [value[0], "..."];
              return (
                <div>
                  {displayedEmails.map((email, index) => (
                    <span key={index} onClick={() => handleEmailClick(rowIndex)}>
                      {email}
                    </span>
                  ))}
                </div>
              );
            }
            return value;
          }}
        />
      </div>
    </div>
  );
};

export default DisplayJsonArrayOfObjects;
