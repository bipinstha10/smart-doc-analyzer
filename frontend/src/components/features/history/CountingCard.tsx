type Props = {
  heading: string;
  counts: number;
};
const CountingCard = ({ heading, counts }: Props) => {
  return (
    <div className="rounded bg-[#F3F3F4] p-2 md:p-5 shadow-md shadow-gray-300/40">
      <p className="font-accent text-[10px] uppercase tracking-[0.2em]">
        {heading}
      </p>
      <p className="mt-5 text-2xl  md:mt-15 md:text-5xl font-semibold">
        {counts}
      </p>
    </div>
  );
};

export default CountingCard;
