const sendToFilemaker = (row) => {
  const scriptName = "displayJson * callback";
  const scriptParameter = JSON.stringify({ row });
  FileMaker.PerformScript(scriptName, scriptParameter);
};

const validateIsArrayofObjects = (data) => {
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

const formatCellValue = (value, formatStyle) => {
  if (!formatStyle) return value; // No format specified, return value as is

  if (formatStyle.startsWith('decimal')) {
    const decimalPlaces = parseInt(formatStyle.replace('decimal', ''), 10);
    if (!isNaN(decimalPlaces)) {
      return parseFloat(value).toFixed(decimalPlaces);
    }
  }

  switch (formatStyle) {
    case 'currency':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    case 'dateYYYY-MM-DD':
      return new Date(value).toISOString().split('T')[0];
    default:
      return value; // Return the value as is if format is not recognized
  }
};

const toTitleCase = (str) => {
  // Convert snake_case to camelCase by replacing underscores with spaces and capitalizing the first letter of each word
  const intermediateStr = str.replace(/_/g, ' ');

  // Split the string by spaces or uppercase letters (for camelCase)
  const words = intermediateStr.split(/(?=[A-Z])| /);

  // Capitalize the first letter of each word and join them with spaces
  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};


export {sendToFilemaker, validateIsArrayofObjects, validateIsArray, formatCellValue, toTitleCase};