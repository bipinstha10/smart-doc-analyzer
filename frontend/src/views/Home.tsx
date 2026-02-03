import FileUpload from "../components/FileUpload";
import Hero from "../components/Hero";

const Home = () => {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return (
    <div>
      <Hero />
      <div className="flex-1 flex flex-col gap-6 items-center justify-center">
        <h1 className="text-3xl md:text-5xl">
          Happy {weekday[new Date().getDay()]}
        </h1>
        <FileUpload />
      </div>
    </div>
  );
};

export default Home;
