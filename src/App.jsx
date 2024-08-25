import React, { useState, useEffect } from "react";
import Alert from "../components/Alert";
import DisplayJsonArrayOfObjects from "../functions/display_json/DisplayJsonArrayOfObjects";
import ReadMe from "../functions/read_me/ReadMe";

const App = ({ json }) => {
  const { path } = json;
  console.log(path)

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

  // Helper function to safely access nested properties
  const assessNestedData = (obj, path) => {
    console.log("getNestedDataExists called...", path, { obj });
  
    // Convert the path into an array of keys (both for dot notation and bracket notation)
    const keys = path.match(/(\w+|\[\d+\])/g);
  
    // Reduce the object using the keys array, checking if the path exists
    const exists = keys.reduce((o, p) => {
      // Check if the key is in bracket notation, e.g., [0]
      if (p.startsWith('[') && p.endsWith(']')) {
        p = parseInt(p.slice(1, -1), 10); // Convert "[0]" to 0
      }
      return (o && o[p] !== undefined) ? o[p] : false;
    }, obj);
  
    // If the final result is false, the path does not exist
    const result = exists !== false;
    console.log(`Path exists: ${result}`);
    return result;
  };

  const extractNestedObject = (path) => {
    console.log("stripObjectFromPath called...", path);
  
    // Match the last portion of the path after any array or object notation
    const match = path.match(/(?:\[\d+\])?(\w+)$/);
    
    // If a match is found, return it; otherwise, return the original path
    const result = match ? match[1] : path;
  
    console.log("Stripped path:", result);
    return result;
  };
  

  // PATH
  switch (true) {
    case typeof path === "string" && assessNestedData(json.json, path):
      const obj=extractNestedObject(path);
      console.log("displayJsonArrayOfObjects called...",obj);
      return <DisplayJsonArrayOfObjects json={json} darkMode={prefersDarkMode} obj={obj} />;

    case typeof path === "string" && path.match(/^\[\d+\]$/):
      console.log("displayJsonArray called...");
      // Implement or uncomment the return statement once DisplayJsonArray is available
      // return <DisplayJsonArray json={json} darkMode={prefersDarkMode} />;

    case typeof path === "string" && path.match(/^{[^}]+}$/):
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
