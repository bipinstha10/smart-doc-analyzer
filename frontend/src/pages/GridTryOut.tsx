const GridTryOut = () => {
  return (
    <div className="min-h-screen bg-black grid grid-cols-12">
      <div className="bg-[#fb7777] col-span-3"></div>
      <div className="bg-amber-400 col-span-9 flex flex-col">
        <div className="bg-amber-700 col-span-6 flex-1"></div>
        <div className="bg-amber-950 col-span-3 flex-4"></div>
      </div>
    </div>
  );
};

export default GridTryOut;
