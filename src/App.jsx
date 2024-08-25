import React from "react";
import Alert from "../components/Alert";
import DisplayJson from "../functions/display_json/DisplayJson"
import ReadMe from "../functions/read_me/ReadMe"



/**
 * App Component
 * 
 * Purpose:
 * The `App` component is a router-like function that renders different components based on the
 * provided `path` prop. It supports rendering of a JSON display component and a ReadMe component
 * depending on the value of `path`.
 * 
 * Props:
 * - path: String
 *   - A string that determines which component to render. Supported values:
 *     - `"displayJson"`: Renders the `DisplayJson` component with the provided `data`.
 *     - `"readMe"`: Renders the `ReadMe` component without any props.
 * 
 * - data: Any (optional)
 *   - The data to be passed as a prop to the `DisplayJson` component when `path` is `"displayJson"`.
 * 
 * Structure:
 * - Uses a `switch` statement to decide which component to render based on the `path` prop.
 * - Renders the `DisplayJson` component with the `json` prop if `path` is `"displayJson"`.
 * - Renders the `ReadMe` component without any props if `path` is `"readMe"`.
 * - Returns `null` if `path` doesn't match any of the predefined cases.
 * 
 * Usage:
 * ```jsx
 * <App path="displayJson" data={yourData} />
 * ```
 * 
 * ```jsx
 * <App path="readMe" />
 * ```
 */

const App = ({json}) => {
  console.log("loading...",{json})
  const path=json.path
  const data=json.json
  const settings=json.settings
  switch (path) {
    case "displayJson":
      console.log("displayJson called...", { data });
      return <DisplayJson json={{data,settings}} />;
    case "readMe":
      console.log("readMe called...");
      return <ReadMe />;
    default:
      return (
        <Alert 
          title="Dev Error" 
          dialog={`${path} is either undefined or unknown.` }
          actionText="OK" 
        />
      );
  }
};

export default App