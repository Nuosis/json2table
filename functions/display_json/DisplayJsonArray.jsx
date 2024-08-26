import React from 'react';
import { sendToFilemaker } from "./utils";
import MyTable from "../../components/MyTable";
import MyHeadlessTable from '../../components/MyHeadlessTable';
import Alert from "../../components/Alert";
import { sendToFilemaker, validateIsArray, toTitleCase } from "./utils";
import setArrayColumns from './setArrayColumns';

const transformArrayToObjects = (array, key) => {
  const k = key ? key : "Values";
  return array.map((item, index) => ({
    id: index + 1,  // Adding an id key with the value being the index (starting from 1)
    [k]: item
  }));
};


const DisplayJsonArray = ({ json, darkMode, strng }) => {
  const obj = toTitleCase(strng)

  console.log(`Rendering ${obj}`)
  //safety check
  if(!json){
    return(
      <Alert title="Invalid Initialization" dialog="The data provided was null." actionText="OK" />
    )
  }

  //set variables/state
  const d = json.json;

  // Data checks
  if(!validateIsArray(d).isValid){
    return (
      <Alert title="Invalid Data Format" dialog = {validateIsArray(d).message} actionText="OK" />
    )
  }

  const data = transformArrayToObjects(d,obj)

  //HANDLE RENDER UNDER ROW
  const onRenderUnderRow = ({ path, json }) => {
    console.log("onRenderUnderRow",{path, json})
    setSubRowData({ path, json });
  };

  //HANDLE COLUMNS
  const columns = React.useMemo(() => setArrayColumns(obj, onRenderUnderRow), [data]);
  console.log({columns})

  return obj
  ? <MyTable searchBar = {false} data={data} columns={columns} callback={sendToFilemaker} darkMode={darkMode}/>
  : <MyHeadlessTable data={data} columns={columns} callback={sendToFilemaker} darkMode={darkMode}/>;;
};

export default DisplayJsonArray;
