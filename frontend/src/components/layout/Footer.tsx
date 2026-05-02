const Footer = () => {
  return (
    <div className="flex items-center justify-center px-6 md:px-20 md:py-3 bg-[#F2F2F2]">
      <p className="text-sm text-gray-500 opacity-100">
        Copyright © {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Footer;
