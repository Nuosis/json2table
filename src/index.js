import JsonTable from "./JsonTable";
import React from "react";
import { createRoot } from "react-dom/client";
import json from "./data.json"

function jsonPrep(json){
  console.log("jsonPrep Init...",{json})
  // Attempt to parse the JSON string
  let obj;
  try {
    obj = JSON.parse(json);
    return obj
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return;
  }
}

window.displayJson = (json) => {
  let data
  // Check if json is a string
  if (typeof json == 'string') {
    
    data = jsonPrep(json)
  } else {
    data = json
  }
  console.log("displayJson Init...",{data})

  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(<JsonTable json={data} />);
};

console.log("version 1.0.2","FUNCTIONS: displayJson","OUTPUT: calls script displayJson * callback")
//displayJson(json)