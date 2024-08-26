import React, { useState, useEffect } from "react";
import Alert from "../components/Alert";
import DisplayJsonArrayOfObjects from "../functions/display_json/DisplayJsonArrayOfObjects";
import DisplayJsonArray from "../functions/display_json/DisplayJsonArray";
import ReadMe from "../functions/read_me/ReadMe";

const App = ({ json }) => {
  const { path } = json;

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

  // Helper function to access json structure
  const assessJsonStructure = (value) => {
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object' && !Array.isArray(value[0])) {
        return 'aob'; // Array of Objects
      } else {
        return 'array'; // Array (or Array of Arrays)
      }
    } else if (typeof value === 'object' && value !== null) {
      return 'object'; // Single Object
    } else {
      return 'unknown'; // Could be primitive types or empty structures
    }
  };

  const extractNestedObject = (path) => {
    //console.log("extractNestedObject called...", path);
  
    // Match the last portion of the path after any array or object notation
    const match = path.match(/(?:\[\d+\])?(\w+)$/);
    
    // If a match is found, return it; otherwise, return the original path
    const result = match ? match[1] : path;
  
    //console.log("Stripped path:", result);
    return result;
  };
  
  let obj

  // PATH
  switch (true) {
    case typeof path === "string" && assessJsonStructure(json.json)=== "aob":
      obj=extractNestedObject(path);
      console.log("displayJsonArrayOfObjects called...");
      return <DisplayJsonArrayOfObjects json={json} darkMode={prefersDarkMode} obj={obj} />;

    case typeof path === "string" && assessJsonStructure(json.json)=== "array":
      obj=extractNestedObject(path);
      console.log("displayJsonArray called...");
      return <DisplayJsonArray json={json} darkMode={prefersDarkMode} strng={obj} />;

    case typeof path === "string" && assessJsonStructure(json.json)=== "object":
      console.log("displayJsonObject called...");
      // Implement or uncomment the return statement once DisplayJsonObject is available
      // return <DisplayJsonObject json={json} darkMode={prefersDarkMode} />;

    case path === "readMe":
      console.log("readMe called...");
      return <ReadMe />;

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
