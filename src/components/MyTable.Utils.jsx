import setArrayColumns from "../functions/display_json/setArrayColumns";
import handleSettings from "../functions/display_json/settings";
import { transformArrayToObjects } from "../functions/display_json/utils";
import { assessJsonStructure } from "../utils";
import Alert from "./Alert"
import MyHeadlessTable from "./MyHeadlessTable";
import MyTable from "./MyTable";

const handleExpandedRow = (data, callback, darkMode) => {
  console.log("Row expansion called...")
  const processedData = assessJsonStructure(data);
  console.log({data},{processedData})

  switch (processedData) {
    case "aoo":
      const dataObjectified =   data.map(record => record[obj])
      const aooColumns = handleSettings(data, settings);
      return <MyTable data={dataObjectified} columns={aooColumns} callback={callback} darkMode={darkMode} />;
    case "array":
      const dataArray = data.slice(1)
      const formattedData = transformArrayToObjects(dataArray);
      const columns = setArrayColumns();
      return <MyHeadlessTable data={formattedData} columns={columns} callback={callback} darkMode={darkMode} />;
    case "object":
      console.log("displayJsonObject called...");
      // Implement or uncomment the return statement once DisplayJsonObject is available
      // return <DisplayJsonObject json={row} darkMode={darkMode} />;
      break;
    default:
      return (
        <Alert 
          title="Dev Error" 
          dialog={`ProcessedData data structure is unknown.`}
          actionText="OK"
        />
      );
  }

  return processedData;
}

export {handleExpandedRow};
