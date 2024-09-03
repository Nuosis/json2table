import React from 'react';
import { sendToFilemaker } from "./utils";
import MyTable from "../../components/MyTable";
import MyHeadlessTable from '../../components/MyHeadlessTable';
import Alert from "../../components/Alert";
import { handleSettings, ensureSettingsDefaults, sendToFilemaker, validateIsArray, toTitleCase, transformArrayToObjects } from "./utils";


const DisplayJsonArray = ({ json, darkMode, ky }) => {
  const obj = ky ? toTitleCase(ky) : "";

  console.log(`jsonArray Rendering ${obj}`)
  //safety check
  if(!json){
    return(
      <Alert title="Invalid Initialization" dialog="The data provided was null." actionText="OK" />
    )
  }

  //set variables/state
  const settings = ensureSettingsDefaults(json.settings)

  const rawData = json.json?json.json:json;

  // Data checks
  if(!validateIsArray(rawData).isValid){
    return (
      <Alert title="Invalid Data Format" dialog = {validateIsArray(rawData).message} actionText="OK" />
    )
  }
  //console.log({rawData,ky,settings})
  const data = transformArrayToObjects(rawData,obj)
  console.log("data",data)

  //HANDLE SETTINGS
  const columns = React.useMemo(() => handleSettings(data, settings), [data, settings.hide, settings.columnOrder, settings.format]);
  console.log({columns})
  //const columns = React.useMemo(() => setArrayColumns(obj), [data]);

  return ky
  ? <MyTable data={data} columns={columns} callback={sendToFilemaker} darkMode={darkMode} searchBarMargin = {false} obj={ky} />
  : <MyHeadlessTable data={data} columns={columns} callback={sendToFilemaker} darkMode={darkMode}/>;
};

export default DisplayJsonArray;
