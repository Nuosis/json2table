import React, { useState, useEffect } from "react";
import Alert from "./components/Alert"
import DisplayJsonArrayOfObjects from "./functions/display_json/DisplayJsonArrayOfObjects";
import DisplayJsonArray from "./functions/display_json/DisplayJsonArray";
import DisplayJsonObject from "./functions/display_json/DisplayJsonObject";
import ReadMe from "./functions/read_me/ReadMe";
import { assessJsonStructure,extractNestedObject,transformKeys,transformObjectKeys,assessStringType } from "./utils";
import {ensureSettingsDefaults,ensureFormDefaults} from "./functions/display_json/utils"

const App = ({ json }) => {
  const { path, data=json.json } = json;

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


  if( assessStringType(path)==='array' ){
    settings=ensureSettingsDefaults(json.settings)
    transformedData = transformKeys(data,settings.labels,settings.omit)
    prop = {json:transformedData,path,settings}
  } else if (assessStringType(path)==='object') {
    formMap=ensureFormDefaults(json.formMap)
    transformedData = transformObjectKeys(data,formMap)
    prop = {json:transformedData,path,formMap}
  }

  // PATH
  switch (true) {
    case typeof path === "string" && assessJsonStructure(transformedData)=== "aoo":
      obj=extractNestedObject(path);
      console.log("displayJsonArrayOfObjects called...",transformedData,obj);
      return <DisplayJsonArrayOfObjects json={prop} darkMode={prefersDarkMode} ky={obj} />;

    case typeof path === "string" && assessJsonStructure(transformedData)=== "array":
      obj=extractNestedObject(path);
      console.log("displayJsonArray called...",{obj});
      return <DisplayJsonArray json={prop} darkMode={prefersDarkMode} ky={obj} />;

    case typeof path === "string" && assessJsonStructure(transformedData)=== "object":
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
