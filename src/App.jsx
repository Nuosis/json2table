import React, { useState, useEffect } from "react";
import Alert from "../components/Alert";
import DisplayJsonArrayOfObjects from "../functions/display_json/DisplayJsonArrayOfObjects";
import DisplayJsonArray from "../functions/display_json/DisplayJsonArray";
import ReadMe from "../functions/read_me/ReadMe";
import { assessJsonStructure } from "./utils";

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
  
  let obj

  // PATH
  switch (true) {
    case typeof path === "string" && assessJsonStructure(json.json)=== "aoo":
      obj=extractNestedObject(path);
      console.log("displayJsonArrayOfObjects called...");
      return <DisplayJsonArrayOfObjects json={json} darkMode={prefersDarkMode} obj={obj} />;

    case typeof path === "string" && assessJsonStructure(json.json)=== "array":
      obj=extractNestedObject(path);
      console.log("displayJsonArray called...",{obj});
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
