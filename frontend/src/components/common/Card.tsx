import type { LucideIcon } from "lucide-react";

type CardProps = {
  title: string;
  desc: string;
  icon: LucideIcon; // pass the component itself
};
const Card = ({ title, desc, icon: Icon }: CardProps) => {
  return (
    <article className="rounded bg-white p-8">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
        <Icon className="w-5 h-5" />
      </div>
      <div className="mt-8">
        <h5 className="font-semibold">{title}</h5>
        <p className="mt-3 text-sm">{desc}</p>
      </div>
    </article>
  );
};

export default Card;
