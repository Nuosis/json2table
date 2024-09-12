import React, { useMemo } from "react";
import MyForm from "../../components/MyForm";
import Alert from "../../components/Alert";
import { handleFormMap, ensureFormDefaults, sendObjectToFilemaker, validateIsObject, toTitleCase } from "./utils";


const DisplayJsonObject = ({ json, darkMode=false, ky}) => {
  const obj = ky ? toTitleCase(ky) : "";
  console.log(`jsonObject Rendering`,obj)
  //safety check
  if(!json){
    return(
      <Alert title="Invalid Initialization" dialog="The data provided was null." actionText="OK" />
    )
  }
  

  //set variables/state
  const formMap = json.formMap;
  const data = json.json?json.json:json;

  // Data checks
  if(!validateIsObject(data).isValid){
    return (
      <Alert title="Invalid Data Format" dialog = {validateIsObject(data).message} actionText="OK" />
    )
  }

  //HANDLE FORMMAP
  const processedData = React.useMemo(() => handleFormMap(data, formMap), [data, formMap.hide, formMap.group, formMap.format]);
  console.log({processedData})


  // Render the Form
  return (
    <div className="h-screen" >
      <div id="2" className="flex-grow overflow-auto">
        <MyForm formMap={formMap} data={processedData} callback={sendObjectToFilemaker} darkMode={darkMode} obj={ky} />
      </div>
    </div>
  );
};

export default DisplayJsonObject;
