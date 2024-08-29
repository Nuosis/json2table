import React from 'react';
import { sendToFilemaker } from "./utils";
import MyTable from "../../components/MyTable";
import MyHeadlessTable from '../../components/MyHeadlessTable';
import Alert from "../../components/Alert";
import { sendToFilemaker, validateIsArray, toTitleCase, transformArrayToObjects } from "./utils";
import setArrayColumns from './setArrayColumns';


const DisplayJsonArray = ({ json, darkMode, strng }) => {
  const obj = toTitleCase(strng)

  console.log(`jsonArray Rendering ${obj}`)
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


  //HANDLE COLUMNS
  const columns = React.useMemo(() => setArrayColumns(obj), [data]);

  return obj
  ? <MyTable data={data} columns={columns} callback={sendToFilemaker} darkMode={darkMode} searchBarMargin = {false} obj={obj} />
  : <MyHeadlessTable data={data} columns={columns} callback={sendToFilemaker} darkMode={darkMode}/>;
};

export default DisplayJsonArray;
