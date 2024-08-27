// import React, { useState, useMemo } from 'react';
// import { sendToFilemaker } from "./utils";
// import MyTable from "../../components/MyTable";
// import MyHeadlessTable from '../../components/MyHeadlessTable';
// import Alert from "../../components/Alert";
// import { validateIsArray, toTitleCase } from "./utils";
// import setArrayColumns from './setArrayColumns';

// // Helper function to transform array to objects
// const transformArrayToObjects = (array, key) => {
//   const k = key ? key : "Values";
//   return array.map((item, index) => ({
//     id: index + 1,
//     [k]: item,
//   }));
// };

// const DisplayJsonArray = ({ json, darkMode, strng }) => {
//   const obj = toTitleCase(strng);

//   console.log(`Rendering ${obj}`);

//   // Safety check
//   if (!json) {
//     return (
//       <Alert 
//         title="Invalid Initialization" 
//         dialog="The data provided was null." 
//         actionText="OK" 
//       />
//     );
//   }

//   // Set variables/state
//   const d = json.json;

//   // Data checks
//   if (!validateIsArray(d).isValid) {
//     return (
//       <Alert 
//         title="Invalid Data Format" 
//         dialog={validateIsArray(d).message} 
//         actionText="OK" 
//       />
//     );
//   }

//   const data = transformArrayToObjects(d, obj);

//   // State for handling expanded rows or sub-row data
//   const [subRowData, setSubRowData] = useState(null);
//   const [expandedRowIndex, setExpandedRowIndex] = useState(null);

//   // Function to handle rendering data under a row when the three dots are clicked
//   const onRenderUnderRow = ({ path, json }, rowIndex) => {
//     console.log("onRenderUnderRow", { path, json });
//     setSubRowData({ path, json });
//     setExpandedRowIndex(rowIndex);
//   };

//   // Define columns with action for three dots
//   const columns = useMemo(() => {
//     const cols = setArrayColumns(obj, onRenderUnderRow);
    
//     // Add an actions column with three dots
//     cols.push({
//       Header: 'Actions',
//       accessor: 'actions',
//       Cell: ({ row, data }) => (
//         <button onClick={() => onRenderUnderRow({ path: row.path, json: data[row.index] }, row.index)}>
//           ...
//         </button>
//       ),
//     });

//     return cols;
//   }, [data]);

//   // Function to render sub-row data based on type
//   const renderSubRowData = (json) => {
//     if (Array.isArray(json)) {
//       // If the JSON is an array, render each item
//       return (
//         <ul>
//           {json.map((item, index) => (
//             <li key={index}>{item}</li>
//           ))}
//         </ul>
//       );
//     }
//     // Default to rendering JSON as a string
//     return <pre>{JSON.stringify(json, null, 2)}</pre>;
//   };

//   return obj ? (
//     <>
//       <MyTable 
//         searchBar={false} 
//         data={data} 
//         columns={columns} 
//         callback={sendToFilemaker} 
//         darkMode={darkMode}
//       />
//       {expandedRowIndex !== null && subRowData && (
//         <div style={{ marginTop: "10px", padding: "10px", border: "1px solid #ddd" }}>
//           {/* Render additional data here */}
//           <h4>Expanded Content for Row {expandedRowIndex + 1}</h4>
//           {renderSubRowData(subRowData.json)}
//         </div>
//       )}
//     </>
//   ) : (
//     <MyHeadlessTable 
//       data={data} 
//       columns={columns} 
//       callback={sendToFilemaker} 
//       darkMode={darkMode}
//     />
//   );
// };

// export default DisplayJsonArray;


import React, { useState, useEffect, useMemo } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

// Helper function to create column definitions for the table
const setArrayColumns = (onRenderUnderRow) => {
  return [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      cell: info => info.getValue(),
    },
    {
      id: 'emails',
      header: 'Emails',
      accessorKey: 'emails',
      cell: info => {
        const value = info.getValue();
        const displayValue = Array.isArray(value) ? value[0] : value;

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{displayValue}</span>
            {Array.isArray(value) && value.length > 1 && (
              <button
                style={{
                  marginLeft: '5px',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click from being triggered
                  onRenderUnderRow({ json: value }, info.row.index);
                }}
                onMouseEnter={(e) => e.target.style.color = 'blue'} // Hover effect
                onMouseLeave={(e) => e.target.style.color = 'black'}
              >
                <FaEllipsisV style={{ width: '16px', height: '16px' }} />
              </button>
            )}
          </div>
        );
      }
    }
  ];
};

const DisplayJsonArray = () => {
  const [data, setData] = useState([]);
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const [subRowData, setSubRowData] = useState(null);

  useEffect(() => {
    // Load the JSON data
    fetch('/path-to-your-json-file.json') // Update this path to your actual JSON file location
      .then(response => response.json())
      .then(data => {
        // Transform the data to fit the expected format
        const transformedData = data.map(item => ({
          id: item.customers.name,
          name: item.customers.name,
          emails: item.customers.emails
        }));
        setData(transformedData);
      })
      .catch(error => console.error('Error loading data:', error));
  }, []);

  // Function to handle rendering data under a row when the three dots are clicked
  const onRenderUnderRow = ({ json }, rowIndex) => {
    setSubRowData(json);
    setExpandedRowIndex(rowIndex);
  };

  // Define columns with action for three dots
  const columns = useMemo(() => setArrayColumns(onRenderUnderRow), [data]);

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.id} style={{ border: '1px solid #ddd', padding: '8px' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <React.Fragment key={index}>
              <tr>
                {columns.map(col => (
                  <td key={col.id} style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {col.cell({ getValue: () => row[col.accessorKey], row })}
                  </td>
                ))}
              </tr>
              {expandedRowIndex === index && subRowData && (
                <tr>
                  <td colSpan={columns.length} style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <h4>Expanded Content for Row {index + 1}</h4>
                    <pre>{JSON.stringify(subRowData, null, 2)}</pre>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayJsonArray;
