import { Link } from "react-router";

const Navbar = () => {
  return (
    <div className="flex py-5 px-4 md:px-6 bg-white/30 backdrop-blur-md">
      <div className="w-30 md:w-30 cursor-pointer border border-gray-300 rounded-5xl">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dx0rhbj0a/image/upload/v1766513552/b568c48c-996d-42ae-a87e-9e3f725de7ce_qmzjak.png"
            alt="DOCCAT+"
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
