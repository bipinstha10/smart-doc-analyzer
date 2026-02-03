import Button from "./Button";

const Hero = () => {
  return (
    <section className="px-4 md:px-6 py-10 mb-10">
      <div className="bg-[#1E59A7] rounded-4xl min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto w-full px-10">
          <div className="max-w-2xl flex flex-col gap-6">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Turn Documents into Clear Insights
            </h1>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              Save time by automatically summarizing, organizing, and
              understanding your documents with ease.
            </p>

            <Button className="md:w-80">Upload Documents</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
