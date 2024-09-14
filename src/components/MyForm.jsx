import React, { useState, useMemo } from 'react';
import MyHeadlessTable from './MyHeadlessTable';
import MyTable from './MyTable';
import Accordion from './Accordion';
import DisplayJsonArrayOfObjects from '../functions/display_json/DisplayJsonArrayOfObjects';
import DisplayJsonArray from '../functions/display_json/DisplayJsonArray';
import DisplayJsonObject from '../functions/display_json/DisplayJsonObject';
import { assessJsonStructure } from '../utils';
import {
  removeEmptyKeys,
  handleFormMap,
  ensureFormDefaults,
  ensureSettingsDefaults,
  handleSettings,
  toTitleCase,
  prepareRenderArrays,
} from '../functions/display_json/utils';

const MyForm = ({ initialData, callback, darkMode = false, initialFormMap, obj }) => {
  const [data, setData] = useState(initialData);
  const [formMap, setFormMap] = useState(ensureFormDefaults(initialFormMap));
  // Destructure the processed data
  const { renderObj, dataObj } = data;
  const parentPath = formMap.title || "";

  // Separate arrays of objects from renderObj
  const [renderArrs, renderObjs] = Object.entries(renderObj).reduce(
    ([arrays, objects], [key, value]) => {
      const nestedEntries = Object.entries(value).filter(([_, nestedValue]) => {
        // Identify arrays of objects
        return Array.isArray(nestedValue) && assessJsonStructure(nestedValue) === 'aoo';
      });
  
      if (nestedEntries.length > 0) {
        nestedEntries.forEach(([nestedKey, nestedValue]) => {
          // Check if the array has only one row
          if (nestedValue.length === 1) {
            // If it has only one row, check if the content is an object
            if (typeof nestedValue[0] === 'object' && !Array.isArray(nestedValue[0])) {
              // Assign the single object to objects[key]
              objects[nestedKey] = nestedValue[0];
            } else {
              // If it's not an object, assign the array as it is
              arrays[nestedKey] = nestedValue;
            }
          } else {
            // For arrays with more than one row, assign the full array
            arrays[nestedKey] = nestedValue;
          }
          delete value[nestedKey]; // Remove the original array from the object
        });
      }
  
      // Add the remaining non-array values to objects
      objects[key] = value;
      return [arrays, objects];
    },
    [{}, {}]
  );
  
  // MANAGE OBJ PREP
  const renderObjects = removeEmptyKeys(renderObjs);

  // MANAGE ARRAY PREP
  const renderArrays = prepareRenderArrays(renderArrs, formMap);

  console.log({ renderArrays, renderObjects });

  // Handle Item click (if needed for future use)
  const handleItemClick = (dataObj, clickedItemPath, value) => {
    if (callback) {
      callback({ data: dataObj, item: clickedItemPath, value });
    }
  };

  // Determine the grid column class based on the number of keys
  const numberOfKeys = Object.keys(renderObjects).length;
  let gridClass;
  if (numberOfKeys === 2) {
    gridClass = 'grid-cols-1';
  } else if (numberOfKeys === 3) {
    gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';
  } else {
    gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  }

  // Custom Components
  const Header = ({ title }) => (
    <div
      className={`col-span-full text-center p-4 m-2 rounded-lg shadow-md ${
        darkMode ? 'bg-black text-white' : 'bg-gray-100 border-gray-300 text-gray-800'
      }`}
    >
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );

  const Field = ({ id, label, value }) => {
    //console.log("Rendering Field with key:", `field ${id}`);
    return (
    <div key={id} className="flex flex-col">
      <label htmlFor={id} className="font-medium mb-1">
        {label}
      </label>
      <input
        id={id}
        key={`field ${id}`}
        type="text"
        value={value}
        readOnly
        className={`p-2 border ${
          darkMode ? 'bg-zinc-800 border-zinc-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'
        } rounded`}
        onClick={() => handleItemClick(dataObj, id, value)}
      />
    </div>
  )};

  const AooComponent = ({ data, ky, parentPath }) => {
    const [expanded, setExpanded] = React.useState(false);
    console.log('Aoo Called', data);
    const objTitle = toTitleCase(ky);
    const currentPath = parentPath ? `${parentPath}.${ky}` : ky;

    return (
      <div>
        <div onClick={() => setExpanded(!expanded)} className="cursor-pointer flex items-center">
          <span>{expanded ? '▼' : '►'}</span>
          <span className="ml-2">{objTitle}</span>
        </div>
        {expanded && (
          <div className={`mt-2 grid ${window.innerWidth >= 768 ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
            <DisplayJsonArrayOfObjects
              json={data}
              darkMode={darkMode}
              ky={ky}
              parentPath={currentPath}
            />
          </div>
        )}
      </div>
    );
  };

  const OooComponent = ({ ky, data, formMap, parentPath }) => {
    const title = toTitleCase(ky);
    const currentPath = parentPath ? `${parentPath}.${ky}` : ky;
    const preppedFormMap = { ...formMap, title };
    const innerFormMap = ensureFormDefaults(preppedFormMap);
    const oooProcessedData = useMemo(() => handleFormMap(data, innerFormMap), [
      data,
      innerFormMap.hide,
      innerFormMap.group,
      innerFormMap.format,
    ]);
    const processedData = Object.entries(oooProcessedData.renderObj).reduce((acc, [key, value]) => {
      if (key === 'Title') return acc;
      if (
        value === '' ||
        (typeof value === 'object' && value !== null && Object.keys(value).length === 0) ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {});
    console.log('Processed Data:', processedData);

    return (
      <div
        className={`mt-4 ${
          darkMode ? 'bg-zinc-800 border-zinc-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'
        }`}
      >
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(processedData).map(([ky, value]) => {
            const structureType = assessJsonStructure(value);
            let fieldPath = `${currentPath}.${ky}`;

            if (structureType === 'object') {
              let innerFieldPath = `${fieldPath}.${ky}`;
            

              return (
                <Accordion key={fieldPath} title={ky} darkMode={darkMode}>
                  {Object.entries(value).map(([innerKey, innerValue]) => {
                    const uniqueFieldPath = `${fieldPath}.${innerKey}`;

                    return (
                      <Field
                        key={uniqueFieldPath}
                        id={uniqueFieldPath}
                        label={innerKey}
                        value={innerValue}
                      />
                    );
                  })}
                </Accordion>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

const formatLabel = (parentKey, innerKey) => {
  const combinedKey = `${parentKey}.${innerKey}`;
  return combinedKey
    .split('.')                           // Split by dot notation
    .slice(-2)                            // Take the last two parts (parentKey and innerKey)
    .map(part => toTitleCase(part))       // Convert to title case (capitalize first letter)
    .join(' ');                           // Join with space to create readable format
};


  // Render a group of fields
  const renderGroup = (groupTitle, groupData, parentPath = '') => {
    const currentPath = parentPath ? `${parentPath}.${groupTitle}` : groupTitle;
    
    return (
      <>
        {groupTitle !== 'Title' && (
          <div
            key={currentPath}
            className={`p-4 m-2 rounded-lg shadow-md ${
              darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-gray-800'
            }`}
          >
            {groupTitle !== 'Other Data' && <h3 className="text-xl font-semibold mb-4">{toTitleCase(groupTitle)}</h3>}

            <div
              className={`grid ${
                Object.entries(groupData).some(([_, value]) => assessJsonStructure(value) === 'ooo')
                  ? 'grid-cols-1'
                  : 'grid-cols-1 md:grid-cols-2'
              } gap-4`}
            >
              {Object.entries(groupData).map(([key, value]) => {
                const structureType = assessJsonStructure(value);
                let fieldPath = `${currentPath}.${key}`;
                
                console.log(structureType)

                if (structureType === 'object') {
                  return Object.entries(value).map(([innerKey, innerValue]) => {
                    let innerFieldPath = `${fieldPath}.${innerKey}`;
                    console.log({innerFieldPath})
                    let label = formatLabel(fieldPath, innerKey)
                    
                    return (
                      <Field
                        key={innerFieldPath}
                        id={innerFieldPath}
                        label={label}
                        value={innerValue}
                      />
                    );
                  });
                } else if (structureType === 'ooo') {
                  return (
                    <OooComponent
                      key={fieldPath}
                      ky={key}
                      data={value}
                      formMap={formMap}
                      parentPath={currentPath}
                    />
                  );
                } else if (structureType === 'string' || structureType === 'number') {
                  console.log({fieldPath})
                  return (
                    <Field
                      key={fieldPath}
                      id={fieldPath}
                      label={key}
                      value={value}
                    />
                  );
                } else if (structureType === 'aoo') {
                  return (
                    <AooComponent
                      key={fieldPath}
                      ky={key}
                      data={value}
                      parentPath={currentPath}
                    />
                  );
                } else if (structureType === 'array') {
                  return (
                    <div key={fieldPath} className="overflow-auto max-h-24">
                      <DisplayJsonArray
                        json={value}
                        darkMode={darkMode}
                        ky={key}
                        parentPath={fieldPath}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="container mx-auto mt-12 p-4">
      {/* Render Header only if renderObjects.Title is not empty */}
      {renderObjects.Title && renderObjects.Title.trim() !== '' && (
        <div className="grid gap-4 grid-cols-1">
          <Header title={renderObjects.Title} />
        </div>
      )}
      <div className={`grid gap-4 sm:grid-cols-1 ${gridClass}`}>
        {Object.entries(renderObjects)
          .sort(([key1], [key2]) => {
            if (key1 === 'Other Data') return 1;
            if (key2 === 'Other Data') return -1;
            return 0;
          })
          .map(([groupTitle, groupData]) => {
            // Log groupTitle to check for duplicate or problematic keys
            console.log("Rendering groupTitle:", groupTitle);
            return renderGroup(groupTitle, groupData);
          })}
      </div>
      {/* Render the arrays separately */}
      {Object.entries(renderArrays).map(([key, value]) => (
        <div key={key} className="mt-4">
          <DisplayJsonArrayOfObjects json={value} darkMode={darkMode} ky={key} parentPath={key} />
        </div>
      ))}
    </div>
  );
};

export default MyForm;
