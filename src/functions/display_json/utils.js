import { FaEllipsisV } from 'react-icons/fa';
import { assessJsonStructure } from '../../utils';

const sendToFilemaker = (row) => {
  const scriptName = "displayJson * callback";
  const scriptParameter = JSON.stringify({ row });
  FileMaker.PerformScript(scriptName, scriptParameter);
};

const sendObjectToFilemaker = ({data,item}) => {
  const scriptName = "displayJson * callback";
  const obj = {data,item}
  const scriptParameter = JSON.stringify( obj );
  FileMaker.PerformScript(scriptName, scriptParameter);
};

const validateIsArrayofObjects = (data) => {
    console.log("IsArrayOfObj: ",data)
    if (!Array.isArray(data)) {
      return { message: "The data provided is not an array.", isValid: false };
    }
  
    if (data.length === 0) {
      return { message: "The data array is empty.", isValid: false };
    }
  
    if (typeof data[0] !== "object") {
      return { message: "The data provided does not contain objects.", isValid: false };
    }
  
    return { message: "The data is valid.", isValid: true };
  
};

const validateIsArray = (data) => {
    if (!Array.isArray(data)) {
      return { message: "The data provided is not an array.", isValid: false };
    }
  
    if (data.length === 0) {
      return { message: "The data array is empty.", isValid: false };
    }
  
    return { message: "The data is valid.", isValid: true };
  
};

const validateIsObject = (data) => {
  // Check if the data is an object and not null
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return { message: "The data provided is not a valid object.", isValid: false };
  }

  // Check if the object has any keys
  if (Object.keys(data).length === 0) {
    return { message: "The object does not have any keys.", isValid: false };
  }

  return { message: "The data is a valid object.", isValid: true };
};

const formatDate = (value, format) => {
  const date = new Date(value);

  const year = date.getFullYear();
  const month2 = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
  const month = String(date.getMonth() + 1); // getMonth() is zero-based
  const day2 = String(date.getDate()).padStart(2, '0');
  const day = String(date.getDate());

  // Replace the format tokens with the corresponding date parts
  const formattedDate = format
    .replace('YYYY', year)
    .replace('MM', month2)
    .replace('M', month)
    .replace('DD', day2)
    .replace('D', day);

  return formattedDate;
};

const formatCellValue = (value, formatStyle) => {
  //console.log("formatCellValue",{value, formatStyle})
  if (!formatStyle) return value; // No format specified, return value as is

  if (formatStyle.startsWith('decimal')) {
    const decimalPlaces = parseInt(formatStyle.replace('decimal', ''), 10);
    if (!isNaN(decimalPlaces)) {
      return parseFloat(value).toFixed(decimalPlaces);
    }
  }

  if (formatStyle.startsWith('date')) {
    const dateFormat = formatStyle.replace('date', '').trim();
    return formatDate(value, dateFormat);
  }

  switch (formatStyle) {
    case 'currency$':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    default:
      return value; // Return the value as is if format is not recognized
  }
};

const removeEmptyKeys = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (
      value === "" ||                             // Empty string
      value === null ||                           // Null
      value === undefined ||                      // Undefined
      (Array.isArray(value) && value.length === 0) || // Empty array
      (typeof value === "object" && Object.keys(value).length === 0) // Empty object
    ) {
      return acc; // Skip adding this key
    }

    // If the value is not empty, add it to the accumulator
    acc[key] = value;
    return acc;
  }, {});
};

const toTitleCase = (str) => {  
  // Check if the string is all uppercase, and if so, return it as is
  if (str === str.toUpperCase()) {
    return str;
  }

  // Convert snake_case to camelCase by replacing underscores with spaces and capitalizing the first letter of each word
  const intermediateStr = str.replace(/_/g, ' ');

  // Split the string by spaces or uppercase letters (for camelCase)
  const words = intermediateStr.split(/(?=[A-Z])| /);

  // Capitalize the first letter of each word and join them with spaces
  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const transformArrayToObjects = (array, key) => {
  const k = key ? key : "Values";
  return array.map((item, index) => ({
    id: index + 1,  // Adding an id key with the value being the index (starting from 1)
    [k]: item
  }));
};

const createColumnDef = (key, formatStyle, labels) => ({
  id: key,
  header: labels[key] || toTitleCase(key),
  accessorKey: key,
  enableSorting: true,
  cell: info => {
    const value = info.getValue();
    const row = info.row;
    
    // Handle array case - if the first element is an object, convert it to a string or select a property
    let displayValue;
    if (Array.isArray(value)) {
      displayValue = typeof value[0] === 'object' ? JSON.stringify(value[0]) : value[0];
    } else {
      displayValue = value;
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>{formatCellValue(displayValue, formatStyle)}</span>
        {Array.isArray(value) && value.length > 1 && (
          <button
            style={{
              marginLeft: '5px',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click from being triggered
              row.toggleExpanded(); // Toggle the expanded state of the row
              row.original.cellValue = value; // Store the content that triggered the expansion
            }}
          >
            <FaEllipsisV style={{ width: '16px', height: '16px' }} />
          </button>
        )}
      </div>
    );
  }
});

const handleSettings = (data, settings) => {
  const { hide = [], columnOrder = [], format = [], labels = {} } = settings;

  // Create a lookup map for formatting
  const formatMap = format.reduce((acc, { key, style }) => {
    acc[key] = style;
    return acc;
  }, {});

  // Step 1: Filter out columns to omit based on `settings.hide`
  const filteredKeys = Object.keys(data[0])
    .filter(key => !hide.some(prefix => key.startsWith(prefix)));
    console.log("filteredKeys: ",filteredKeys)

  // Step 2: Sort the columns based on `settings.columnOrder`
  const orderedColumns = columnOrder
    .filter(key => filteredKeys.includes(key)) // Only include keys that are not hidden and are in columnOrder
    .map(key => createColumnDef(key, formatMap[key], labels));

  // Step 3: Include the remaining columns that weren't specified in `columnOrder`
  const remainingColumns = filteredKeys
    .filter(key => !columnOrder.includes(key)) // Exclude keys that are already in orderedColumns
    .map(key => createColumnDef(key, formatMap[key], labels));

  // Combine orderedColumns with remainingColumns
  const finalColumns = [...orderedColumns, ...remainingColumns];

  // Step 4: Sort data by the first column in ascending order
  if (finalColumns.length > 0) {
    const firstColumnKey = finalColumns[0].accessorKey;

    data.sort((a, b) => {
      if (a[firstColumnKey] < b[firstColumnKey]) return -1;
      if (a[firstColumnKey] > b[firstColumnKey]) return 1;
      return 0;
    });
  }

  return finalColumns;
};

const handleFormMap = (data, formMap) => {
  console.log("handleFormMap",{formMap},{data})
  const { hide = [], group = [], format = [], labels = {}, title = ""  } = formMap;
  //console.log({labels})

  // Create a lookup map for formatting
  const formatMap = format.reduce((acc, { key, style }) => {
    acc[key] = style;
    return acc;
  }, {});

  const renderObj = {"Title":title};
  const dataObj = data

  // Step 1: Group Keys based on `formMap.group`
  group.forEach(({ keys, title }) => {
    renderObj[title] = {};
    keys.forEach(key => {
      if (!hide.some(h => key.startsWith(h)) && data.hasOwnProperty(key)) {
        let value = data[key];

        // Apply formatting if needed
        if (formatMap[key]) {
          value = formatCellValue(value, formatMap[key]);
        }

        // Use label if available
        const label = labels[key] || toTitleCase(key);

        renderObj[title][label] = value;
      }
    });
  });

  // Step 2: Handle ungrouped keys (keys that are not in the hide array and not already grouped)
  const ungroupedKeys = Object.keys(data).filter(
    key => !group.some(g => g.keys.includes(key)) && !hide.some(h => key.startsWith(h))
  );
  console.log("ungroupedKeys",{ungroupedKeys})

  if (ungroupedKeys.length > 0) {
    renderObj["Other Data"] = renderObj["Other Data"] || {};
    ungroupedKeys.forEach(key => {
      // Use label if available
      const label = labels[key] || toTitleCase(key);
      let value = data[key];
      if (assessJsonStructure(value)==='object'){  
        // Create a new object to hold the mapped key-value pairs
        const mappedObject = {};
      
        // Iterate through the object's entries
        Object.entries(value).forEach(([innerKey, innerValue]) => {
          // Use the label if available, otherwise use the original key
          const innerLabel = labels[innerKey] || toTitleCase(innerKey);
          mappedObject[innerLabel] = innerValue;
        });

        // Assign the mapped object to the translated label in the renderObj
        renderObj[label] = mappedObject;
      } else {
        // Apply formatting if needed
        if (formatMap[key]) {
          value = formatCellValue(value, formatMap[key]);
        }
        renderObj["Other Data"][label] = value;
      }
    });
  }
  return {dataObj,renderObj};
};

const ensureSettingsDefaults = (settings = {}) => {
  const hideArray = settings.hide || [];
  if (!hideArray.includes('id')) {
    hideArray.push('id');
  }
  return {
    ...settings,
    hide: hideArray,
    labels: settings.labels || {},
    columnOrder: settings.columnOrder || [],
    initialSearch: settings.initialSearch || '',
    format: settings.format || [],
    omit: settings.omit || [],
  };
};

const ensureFormDefaults = (form = {}) => {
  const hideArray = form.hide || [];
  if (!hideArray.includes('id')) {
    hideArray.push('id');
  }

  return {
    ...form, // Spread the original form object to keep existing keys
    title: form.title || '',
    hide: hideArray,
    labels: form.labels || {},
    group: form.group || [],
    format: form.format || [],
    omit: form.omit || [],
  };
};

const prepareRenderArrays = (Arrays, formMap) => {
  return Object.entries(Arrays).reduce((acc, [key, arrayData]) => {
    acc[key] = {
      json: arrayData, // Original array data
      settings: formMap[key]?.settings ? ensureSettingsDefaults(formMap[key].settings) : ensureSettingsDefaults(formMap[key]), // Use existing settings or ensure defaults
    };
    return acc;
  }, {});
};



export {prepareRenderArrays, removeEmptyKeys, handleSettings, handleFormMap, createColumnDef, ensureFormDefaults, ensureSettingsDefaults, sendToFilemaker, sendObjectToFilemaker, validateIsArrayofObjects, validateIsArray, validateIsObject, formatCellValue, formatDate, toTitleCase, transformArrayToObjects};