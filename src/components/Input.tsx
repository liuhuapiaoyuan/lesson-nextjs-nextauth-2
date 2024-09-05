export interface InputProps {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  defaultValue?: string;
}
export const Input: React.FC<InputProps> = ({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
}) => {
  return (
    <label
      htmlFor={name}
      className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
    >
      <span>{label}</span>
      <input
        defaultValue={defaultValue}
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0 focus:border-gray-500"
      />
    </label>
  );
};
