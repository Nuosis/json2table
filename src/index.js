import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

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

window.loadApp = (json) => {
  let data
  // Check if json is a string
  if (typeof json == 'string') {
    data = jsonPrep(json)
  } else {
    data = json
  }
  console.log("App Init...",{data})

  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(<App json={data} />);
};

console.log("version 1.0.2",{FUNCTIONS: [{Name: "loadApp",props: [{path: "displayJson", json: "{data: [{theJsonDataToDisplay}], settings: {hide:['keys to hid']}"},{path: "readMe"}]}]})