const Divider = ({ text = "OR" }) => {
  return (
    <div className="flex items-center my-6">
      <hr className="grow border-t border-gray-600" />
      <span className="px-3 text-gray-500 text-sm font-medium">{text}</span>
      <hr className="grow border-t border-gray-600" />
    </div>
  );
};

export default Divider;
