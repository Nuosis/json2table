import React, { useState, useEffect } from "react";
import Alert from "./components/Alert"
import DisplayJsonArrayOfObjects from "./functions/display_json/DisplayJsonArrayOfObjects";
import DisplayJsonArray from "./functions/display_json/DisplayJsonArray";
import DisplayJsonObject from "./functions/display_json/DisplayJsonObject";
import ReadMe from "./functions/read_me/ReadMe";
import { assessJsonStructure,extractNestedObject,transformKeys,transformObjectKeys,assessStringType } from "./utils";
import {ensureSettingsDefaults,ensureFormDefaults} from "./functions/display_json/utils"

const App = ({ json }) => {
  let { path } = json;
  const d= json.json?json.json:json
  let route=path
  let data
  console.log("App called:",{json})

  const dataType=assessJsonStructure(d)
  if(dataType==='aoo'&&d.length===1){
    data=d[0] //is array has only one row cset data to contents of the row
  } else {
    data=d
  }

  if(!path){
    route=assessJsonStructure(data)
    if(route==="aoo"){route='array',path='[0]'}
    if(route==="ooo"){route='object'.path='{}'}
    if(route==="array"){path='[0]'}
    if(route==="object"){path='{}'}
  } else {
    route=assessStringType(path)
  }

  console.log({path},{route},{data})

  // DARK MODE
  const [prefersDarkMode, setPrefersDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Define a handler to update state when the preference changes
    const handleChange = (e) => {
      setPrefersDarkMode(e.matches);
    };

    // Add event listener for changes to the media query
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  let obj
  let transformedData
  let prop

  // ASSIGN APP ROUTE
  if( route==='array' ){
    settings=ensureSettingsDefaults(json.settings)
    transformedData = transformKeys(data,settings.labels,settings.omit)
    console.log("Omit and Lables Transformed",transformedData)
    prop = {json:transformedData,path,settings}
  } else if (route==='object') {
    //console.log(json.formMap)
    formMap=ensureFormDefaults(json.formMap)
    //console.log({formMap})
    transformedData = transformObjectKeys(data,formMap)
    console.log("Omit and Lables Transformed",transformedData)
    prop = {json:transformedData,path,formMap}
  }

  // PATH
  switch (true) {
    case assessJsonStructure(transformedData)=== "aoo":
      obj=extractNestedObject(path);
      console.log("displayJsonArrayOfObjects called...",transformedData,obj);
      return <DisplayJsonArrayOfObjects json={prop} darkMode={prefersDarkMode} ky={obj} />;

    case assessJsonStructure(transformedData)=== "array":
      obj=extractNestedObject(path);
      console.log("displayJsonArray called...",{obj});
      return <DisplayJsonArray json={prop} darkMode={prefersDarkMode} ky={obj} />;

    case assessJsonStructure(transformedData)=== "object" || assessJsonStructure(transformedData)=== "ooo":
      obj=extractNestedObject(path);
      console.log("displayJsonObject called...");
      return <DisplayJsonObject json={prop} darkMode={prefersDarkMode} ky={obj}/>;

    // case path === "ReadMe":
    //   console.log("readMe called...");
    //   return <ReadMe />;

    default:
      return (
        <Alert 
          title="Dev Error" 
          dialog={`${path} is either undefined or unknown.`}
          actionText="OK"
        />
      );
  }
};

export default App;
