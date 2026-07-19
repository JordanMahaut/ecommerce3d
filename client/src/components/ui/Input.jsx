function Input({
  label,
  id,
  name,
  className = "",
  ...props
}) {
  const inputId = id || name;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        className={`
          w-full rounded-xl border border-slate-300 bg-white
          px-4 py-3 outline-none transition
          focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200
          disabled:cursor-not-allowed disabled:bg-slate-100
          ${className}
        `}
        {...props}
      />
    </div>
  );
}

export default Input;