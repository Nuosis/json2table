export default function SimpleInputLabel({id,name}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {name}
      </label>
    </div>
  )
}