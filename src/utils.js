const assessJsonStructure = (value) => {
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === 'object' && !Array.isArray(value[0])) {
      return 'aoo'; // Array of Objects
    } else {
      return 'array'; // Array (or Array of Arrays)
    }
  } else if (typeof value === 'object' && value !== null) {
    // Check if the object is an object of objects
    const allObjects = Object.values(value).every(
      (val) => typeof val === 'object' && val !== null && !Array.isArray(val)
    );
    if (allObjects) {
      return 'ooo'; // Object of Objects
    }
    return 'object'; // Single Object
  } else if (typeof value === 'string') {
    return 'string'; // String
  } else {
    return 'prim'; // Could be primitive types or empty structures
  }
};

const assessStringType = (str) => {
  if (str.startsWith('[0]') || str.startsWith('[]')) {
    return 'array';
  } else if (str.startsWith('{}')) {
    return 'object';
  } else {
    return 'unknown'; // In case the string does not match any expected pattern
  }
};

const extractNestedObject = (path) => {
  // Match the last portion of the path after any array or object notation
  const match = path.match(/(?:\[(\d+)\])?(\w+)?$/);
  
  // If only an array index is provided (like "[0]"), return an empty string
  if (match && match[1] && !match[2]) {
    return "";
  }
  
  // If a match is found, return the object key; otherwise, return the original path
  return match[2] || "";
};

const transformKeys = (data, labels, omit) => {
  return data.map(item => {
    let newItem = { ...item }; // Create a shallow copy of the item

    // Step 1: Transform keys based on labels
    Object.entries(labels).forEach(([oldKeyPath, newKey]) => {
      const keys = oldKeyPath.split('.');
      let currentObject = newItem;

      for (let i = 0; i < keys.length - 1; i++) {
        currentObject = currentObject[keys[i]];
        if (!currentObject) return; // If the path doesn't exist, skip the transformation
      }

      const oldKey = keys[keys.length - 1];

      // Set the new key with the old value and remove the nested structure
      if (currentObject && currentObject.hasOwnProperty(oldKey)) {
        newItem[newKey] = currentObject[oldKey];
        delete currentObject[oldKey];
      }
    });

    // Step 2: Remove any empty objects left after key deletion
    Object.keys(newItem).forEach(key => {
      if (typeof newItem[key] === 'object' && Object.keys(newItem[key]).length === 0) {
        delete newItem[key];
      }
    });

    // Step 3: Omit specified keys
    omit.forEach(omitKeyPath => {
      const keys = omitKeyPath.split('.');
      let currentObject = newItem;

      for (let i = 0; i < keys.length - 1; i++) {
        currentObject = currentObject[keys[i]];
        if (!currentObject) return; // If the path doesn't exist, skip the omission
      }

      const omitKey = keys[keys.length - 1];
      if (currentObject && currentObject.hasOwnProperty(omitKey)) {
        delete currentObject[omitKey];
      }
    });

    return newItem;
  });
};

const transformObjectKeys = (obj, formMap) => {
  let newObj = { ...obj }; // Create a shallow copy of the object

  // Step 1: Transform keys based on labels
  Object.entries(formMap.labels || {}).forEach(([oldKeyPath, newKey]) => {
    const keys = oldKeyPath.split('.');
    let currentObject = newObj;

    for (let i = 0; i < keys.length - 1; i++) {
      currentObject = currentObject[keys[i]];
      if (!currentObject) return; // If the path doesn't exist, skip the transformation
    }

    const oldKey = keys[keys.length - 1];

    // Set the new key with the old value and remove the nested structure
    if (currentObject && currentObject.hasOwnProperty(oldKey)) {
      newObj[newKey] = currentObject[oldKey];
      delete currentObject[oldKey];
    }
  });

  // Step 2: Remove any empty objects left after key deletion
  Object.keys(newObj).forEach(key => {
    if (typeof newObj[key] === 'object' && Object.keys(newObj[key]).length === 0) {
      delete newObj[key];
    }
  });

  // Step 3: Omit specified keys
  (formMap.omit || []).forEach(omitKeyPath => {
    const keys = omitKeyPath.split('.');
    let currentObject = newObj;

    for (let i = 0; i < keys.length - 1; i++) {
      currentObject = currentObject[keys[i]];
      if (!currentObject) return; // If the path doesn't exist, skip the omission
    }

    const omitKey = keys[keys.length - 1];
    if (currentObject && currentObject.hasOwnProperty(omitKey)) {
      delete currentObject[omitKey];
    }
  });

  // Step 4: Process nested objects with settings
  Object.keys(newObj).forEach(key => {
    if (formMap[key] && formMap[key].settings && Array.isArray(newObj[key])) {
      const nestedFormMap = formMap[key].settings;
      newObj[key] = transformKeys(newObj[key], nestedFormMap.labels || {}, nestedFormMap.omit || []);
    }
  });

  return newObj;
};

export {assessJsonStructure,extractNestedObject,transformKeys,transformObjectKeys,assessStringType}