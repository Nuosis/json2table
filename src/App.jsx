import React from "react";
import DisplayJson from "../functions/DisplayJson"
//readMe

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

const App = ({ path, data }) => {
  switch (path) {
    case "displayJson":
      console.log("displayJson called...", { data });
      return <DisplayJson json={data} />;
    case "readMe":
      console.log("readMe called...");
      return <ReadMe />;
    default:
      return null; // Return null or handle other cases as needed
  }
};

export default App