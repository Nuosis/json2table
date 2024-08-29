export default function SimpleInput({ id, type, name, value = "", placeholder = "", useData, darkMode = false }) {
  return (
    <div>
      <input
        className={`block w-full rounded-md border-0 p-2 shadow-sm ring-1 ring-inset ${
          darkMode 
            ? 'text-white bg-gray-300 ring-gray-600 placeholder:text-gray-500 focus:ring-indigo-400' 
            : 'text-gray-900 bg-white ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'
        } sm:text-sm sm:leading-6`}
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={useData}
      />
    </div>
  )
}
