const assessJsonStructure = (value) => {
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === 'object' && !Array.isArray(value[0])) {
      return 'aoo'; // Array of Objects
    } else {
      return 'array'; // Array (or Array of Arrays)
    }
  } else if (typeof value === 'object' && value !== null) {
    return 'object'; // Single Object
  } else {
    return 'unknown'; // Could be primitive types or empty structures
  }
};

export {assessJsonStructure}