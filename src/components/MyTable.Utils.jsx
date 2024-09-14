import {  handleSettings, ensureSettingsDefaults,transformArrayToObjects } from "../functions/display_json/utils";
import { assessJsonStructure } from "../utils";
import Alert from "./Alert"
import MyHeadlessTable from "./MyHeadlessTable";
import MyTable from "./MyTable";
import Accordion from "./Accordion";
import { toTitleCase,ensureFormDefaults,handleFormMap } from "../functions/display_json/utils";

const handleExpandedRow = (data, callback, darkMode) => {
  console.log("Row expansion called...")
  const processedData = assessJsonStructure(data);
  console.log({data},{processedData})

  switch (processedData) {
    case "aoo":
      const dataObjectified =   data.map(record => record[obj])
      const aooSettings = ensureSettingsDefaults(json.settings)
      const aooColumns = handleSettings(data, aooSettings);
      return <MyTable data={dataObjectified} columns={aooColumns} callback={callback} darkMode={darkMode} />;
    case "array":
      const dataArray = data.slice(1)
      const formattedData = transformArrayToObjects(dataArray);
      const arraySettings = ensureSettingsDefaults()
      const arrayColumns = handleSettings(formattedData, arraySettings);;
      return <MyHeadlessTable data={formattedData} columns={arrayColumns} callback={callback} darkMode={darkMode} />;
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

const OooComponent = ({ ky, data, formMap, darkMode }) => {
  const title = toTitleCase(ky);
  const innerFormMap = ensureFormDefaults(formMap);
  const oooProcessedData = handleFormMap(data, innerFormMap);
  
  const processedData = Object.entries(oooProcessedData.renderObj).reduce((acc, [key, value]) => {
    if (key === 'Title') return acc;
    if (value === '' || (typeof value === 'object' && Object.keys(value).length === 0)) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});

  return (
    <div className={`mt-4 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'}`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(processedData).map(([ky, value]) => {
          const structureType = assessJsonStructure(value);

          if (structureType === 'object') {
            return (
              <Accordion key={ky} title={ky} darkMode={darkMode}>
                {Object.entries(value).map(([innerKey, innerValue]) => (
                  <div key={`${ky}.${innerKey}`} className="p-2">
                    <strong>{toTitleCase(innerKey)}:</strong> {innerValue}
                  </div>
                ))}
              </Accordion>
            );
          }

          return (
            <div key={ky} className="p-2">
              <strong>{toTitleCase(ky)}:</strong> {value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const isNaNValue = (value) => {
  return value === null || value === undefined || value === '' || value === '$NaN' || value === 'NaN' || (typeof value === 'number' && isNaN(value));
};

const renderCellValue = (cell,darkMode) => {
  const value = cell.getValue();

  // If value is an object, we might want to render it differently (like in OooComponent)
  if (typeof value === 'object' && value !== null) {
    // We can show the object as a JSON string, or render a specific component like OooComponent
    return <OooComponent ky={cell.column.columnDef.accessorKey} data={value} darkMode={darkMode} />;
  }

  // Otherwise, render the value as is
  return isNaNValue(value) ? '' : String(value);
};

export {handleExpandedRow,OooComponent,renderCellValue};
