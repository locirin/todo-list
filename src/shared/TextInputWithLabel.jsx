export default function TextInputWithLabel({
  id,
  name,
  type = 'text',
  value,
  onChange,
  children,
  inputRef,
}) {
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        ref={inputRef}
      />
    </>
  );
}
