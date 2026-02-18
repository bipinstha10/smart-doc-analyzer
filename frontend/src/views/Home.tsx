import FileUpload from "../components/FileUpload";
// import Hero from "../components/Hero";
import { useRef } from "react";

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

  const fileUploadRef = useRef<HTMLDivElement>(null);

  // const scrollToSection = () => {
  //   fileUploadRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  return (
    <div>
      {/* <Hero onButtonClick={scrollToSection} /> */}
      <div className="flex-1 flex flex-col gap-6 items-center justify-center">
        <h1 className="text-3xl md:text-5xl">
          Happy {weekday[new Date().getDay()]}
        </h1>
        <FileUpload ref={fileUploadRef} />
      </div>
    </div>
  );
};

export default Home;
