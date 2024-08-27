import React, { useState, useMemo } from 'react';
import { sendToFilemaker } from "./utils";
import MyTable from "../../components/MyTable";
import MyHeadlessTable from '../../components/MyHeadlessTable';
import Alert from "../../components/Alert";
import { validateIsArray, toTitleCase } from "./utils";
import setArrayColumns from './setArrayColumns';

// Helper function to transform array to objects
const transformArrayToObjects = (array, key) => {
  const k = key ? key : "Values";
  return array.map((item, index) => ({
    id: index + 1,
    [k]: item,
  }));
};

const DisplayJsonArray = ({ json, darkMode, strng }) => {
  const obj = toTitleCase(strng);

  console.log(`Rendering ${obj}`);

  // Safety check
  if (!json) {
    return (
      <Alert 
        title="Invalid Initialization" 
        dialog="The data provided was null." 
        actionText="OK" 
      />
    );
  }

  // Set variables/state
  const d = json.json;

  // Data checks
  if (!validateIsArray(d).isValid) {
    return (
      <Alert 
        title="Invalid Data Format" 
        dialog={validateIsArray(d).message} 
        actionText="OK" 
      />
    );
  }

  const data = transformArrayToObjects(d, obj);

  // State for handling expanded rows or sub-row data
  const [subRowData, setSubRowData] = useState(null);
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);

  // Function to handle rendering data under a row when the three dots are clicked
  const onRenderUnderRow = ({ path, json }, rowIndex) => {
    console.log("onRenderUnderRow", { path, json });
    setSubRowData({ path, json });
    setExpandedRowIndex(rowIndex);
  };

  // Define columns with action for three dots
  const columns = useMemo(() => {
    const cols = setArrayColumns(obj, onRenderUnderRow);
    
    // Add an actions column with three dots
    cols.push({
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row, data }) => (
        <button onClick={() => onRenderUnderRow({ path: row.path, json: data[row.index] }, row.index)}>
          ...
        </button>
      ),
    });

    return cols;
  }, [data]);

  // Function to render sub-row data based on type
  const renderSubRowData = (json) => {
    if (Array.isArray(json)) {
      // Render as dropdown if JSON is an array of emails
      return (
        <div>
          <select>
            {json.map((email, index) => (
              <option key={index} value={email}>
                {email}
              </option>
            ))}
          </select>
        </div>
      );
    }
    // Default to rendering JSON as a string
    return <pre>{JSON.stringify(json, null, 2)}</pre>;
  };

  return obj ? (
    <>
      <MyTable 
        searchBar={false} 
        data={data} 
        columns={columns} 
        callback={sendToFilemaker} 
        darkMode={darkMode}
      />
      {expandedRowIndex !== null && subRowData && (
        <div style={{ marginTop: "10px", padding: "10px", border: "1px solid #ddd" }}>
          {/* Render additional data here */}
          <h4>Expanded Content for Row {expandedRowIndex + 1}</h4>
          {renderSubRowData(subRowData.json)}
        </div>
      )}
    </>
  ) : (
    <MyHeadlessTable 
      data={data} 
      columns={columns} 
      callback={sendToFilemaker} 
      darkMode={darkMode}
    />
  );
};

export default DisplayJsonArray;
