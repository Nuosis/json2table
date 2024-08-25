import { toTitleCase, formatCellValue } from './utils'; // Import your utility functions

export default handleSettings = (data, settings) => {
  // Provide default values for settings to prevent errors
  const { hide = [], sortOrder = [], format = [] } = settings;

  // Create a lookup map for formatting
  const formatMap = format.reduce((acc, { key, style }) => {
    acc[key] = style;
    return acc;
  }, {});

  // Step 1: Filter out columns to omit based on `settings.hide`
  const filteredKeys = Object.keys(data[0])
    .filter(key => {
      return !hide.some(prefix => key.startsWith(prefix));
    });

  // Step 2: Sort the columns based on `settings.sortOrder`
  const orderedColumns = sortOrder
    .filter(key => filteredKeys.includes(key)) // Only include keys that are not hidden and are in sortOrder
    .map(key => ({
      id: key,
      header: toTitleCase(key),
      accessorKey: key,
      cell: info => {
        const value = info.getValue();
        const formatStyle = formatMap[key];
        return formatCellValue(value, formatStyle);
      }
    }));

  // Step 3: Include the remaining columns that weren't specified in `sortOrder`
  const remainingColumns = filteredKeys
    .filter(key => !sortOrder.includes(key)) // Exclude keys that are already in orderedColumns
    .map(key => ({
      id: key,
      header: toTitleCase(key),
      accessorKey: key,
      cell: info => {
        const value = info.getValue();
        const formatStyle = formatMap[key];
        return formatCellValue(value, formatStyle);
      }
    }));

  // Combine orderedColumns with remainingColumns
  const finalColumns = [...orderedColumns, ...remainingColumns];

  // Step 4: Sort data by the first column in ascending order
  if (finalColumns.length > 0) {
    const firstColumnKey = finalColumns[0].accessorKey;

    data.sort((a, b) => {
      if (a[firstColumnKey] < b[firstColumnKey]) return -1;
      if (a[firstColumnKey] > b[firstColumnKey]) return 1;
      return 0;
    });
  }

  return finalColumns;
};
