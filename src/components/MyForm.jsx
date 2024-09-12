import React, {useState, useEffect, useMemo} from 'react';
import MyHeadlessTable from './MyHeadlessTable';
import MyTable from './MyTable';
import Accordion from './Accordion';
import DisplayJsonArrayOfObjects from '../functions/display_json/DisplayJsonArrayOfObjects'
import DisplayJsonArray from '../functions/display_json/DisplayJsonArray'
import DisplayJsonObject from '../functions/display_json/DisplayJsonObject'
import { assessJsonStructure } from '../utils';
import { removeEmptyKeys, handleFormMap, ensureFormDefaults, ensureSettingsDefaults, handleSettings, toTitleCase, prepareRenderArrays } from '../functions/display_json/utils';

const MyForm = ({ data, callback, darkMode = false, formMap, obj }) => {
  // Destructure the processed data
  const { renderObj } = data;  
  
  // Separate arrays of objects from renderObj
  const [renderArrs, renderObjs] = Object.entries(renderObj).reduce(
    ([arrays, objects], [key, value]) => {
      const nestedEntries = Object.entries(value).filter(([_, nestedValue]) => {
        // Identify arrays of objects
        return Array.isArray(nestedValue) && assessJsonStructure(nestedValue) === 'aoo';
      });

      if (nestedEntries.length > 0) {
        nestedEntries.forEach(([nestedKey, nestedValue]) => {
          // Move the array of objects to renderArrays
          arrays[nestedKey] = nestedValue;
          delete value[nestedKey];
        });
      }

      objects[key] = value;
      return [arrays, objects];
    },
    [{}, {}]
  );

  //MANAGE OBJ PREP
  const renderObjects = removeEmptyKeys(renderObjs)
  
  //MANAGE ARRAY PREP
  const renderArrays = prepareRenderArrays(renderArrs, formMap)

  console.log({renderArrays,renderObjects})

  // Handle Item click (if needed for future use)
  const handleItemClick = (dataObj, clickedItem) => {
    if (callback) {
      callback({ data: dataObj, item: clickedItem });
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

  // Custom Componenets
  const Header = ({ title }) => (
    <div className={`col-span-full text-center p-4 m-2 rounded-lg shadow-md ${darkMode ? 'bg-black text-white' : 'bg-gray-100 border-gray-300 text-gray-800'}`}>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );

  const Field = ({ky,value,groupTitle}) => (
    <div key={ky} className="flex flex-col">
      <label className="font-medium mb-1">{ky}</label>
      <input
        type="text"
        value={value}
        readOnly
        className={`p-2 border ${darkMode ? 'bg-zinc-800 border-zinc-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'} rounded`}
        onClick={() => handleItemClick(renderObj, `data.${groupTitle}.${key}`)}
      />
    </div>
  )
  
  const AooComponent = ({ data, ky }) => {
    const [expanded, setExpanded] = React.useState(false);
    console.log("Aoo Called",data)
    const obj = toTitleCase(ky)
    return (
      <div>
        <div onClick={() => setExpanded(!expanded)} className="cursor-pointer flex items-center">
          <span>{expanded ? '▼' : '►'}</span>
          <span className="ml-2">{obj}</span>
        </div>
        {expanded && (
          <div className={`mt-2 ${window.innerWidth >= 768 ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
            <DisplayJsonArrayOfObjects json={data} darkMode={darkMode} ky={ky} />
          </div>
        )}
      </div>
    );
  };

  const OooComponent = ({ ky, data, formMap }) => {
    console.log("Object of Object called",{ky,data,formMap})
    title=toTitleCase(ky)
    const preppedFormMap = formMap ? formMap : {};
    preppedFormMap.title=title
    innerFormMap = ensureFormDefaults(preppedFormMap)
    const oooProcessedData = React.useMemo(() => handleFormMap(data, innerFormMap), [data, innerFormMap.hide, innerFormMap.group, innerFormMap.format]);
    const processedData = Object.entries(oooProcessedData.renderObj).reduce((acc, [key, value]) => {
      console.log({key, value});
      
      // Skip the "Title" key
      if (key === "Title") {
        return acc;
      }

      const thisValue = value ? value : "";

      // Exclude keys with values that are empty strings, empty objects, or empty arrays
      if (
        thisValue === "" ||
        (typeof thisValue === "object" && thisValue !== null && Object.keys(thisValue).length === 0) ||
        (Array.isArray(thisValue) && thisValue.length === 0)
      ) {
        return acc;
      }

      // If the key passes all checks, add it to the processed data
      acc[key] = thisValue;
      return acc;
    }, {});
    console.log("Processed Data:", processedData);
  
    
    return (
      <div className={`mt-4 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'}`}>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(processedData).map(([ky, value]) => {
            const structureType = assessJsonStructure(value);
            console.log({ structureType }, { value }, { ky });
    
            if (structureType === 'object') {
              return (
                <Accordion key={ky} title={ky} darkMode={darkMode}>
                  {Object.entries(value).map(([innerKey, innerValue]) => (
                    <Field key={innerKey} ky={innerKey} value={innerValue} groupTitle={ky} />
                  ))}
                </Accordion>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
    
  };


  // Render a group of fields
  const renderGroup = (groupTitle, groupData) => {
    return (
      <>
        {groupTitle !== "Title" &&
          <div key={groupTitle} className={`p-4 m-2 rounded-lg shadow-md ${darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-gray-800'}`}>
            {groupTitle !== "Other Data" && <h3 className="text-xl font-semibold mb-4">{groupTitle}</h3>}
            
            <div className={`grid ${Object.entries(groupData).some(([_, value]) => assessJsonStructure(value) === 'ooo') ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
              {Object.entries(groupData).map(([key, value]) => {
                const structureType = assessJsonStructure(value);

                if (structureType === 'object') {
                  return Object.entries(value).map(([innerKey, innerValue]) => (
                    <Field ky={innerKey} value={innerValue} groupTitle={key} />
                  ));
                } else if (structureType === 'ooo') {
                  return <OooComponent ky={key} data={value} formMap={formMap} />;
                } else if (structureType === 'string' || structureType === 'number' ) {
                  return <Field ky={key} value={value} groupTitle={groupTitle} />;
                } else if (structureType === 'aoo') {
                  return <AooComponent ky={key} data={value} />;
                } else if (structureType === 'array') {
                  return (
                    <div key={key} className="overflow-auto max-h-24">
                      <DisplayJsonArray json={value} darkMode={darkMode} ky={key} />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        }
      </>
    );
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-4 grid-cols-1">
        <Header title={renderObjects.Title}/>
      </div>
      <div className={`grid gap-4 sm:grid-cols-1 ${gridClass}`}>
        {Object.entries(renderObjects)
          .sort(([key1], [key2]) => {
            if (key1 === 'Other Data') return 1;
            if (key2 === 'Other Data') return -1;
            return 0;
          })
          .map(([groupTitle, groupData]) => renderGroup(groupTitle, groupData))}
      </div>
      {/* Render the arrays separately */}
      {Object.entries(renderArrays).map(([key, value]) => (
        <div key={key} className="mt-4">
          <DisplayJsonArrayOfObjects json={value} darkMode={darkMode} ky={key} />
        </div>
      ))}
    </div>
  );
};

export default MyForm;
