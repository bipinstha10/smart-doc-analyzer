import type { LucideIcon } from "lucide-react";

type CardProps = {
  title: string;
  desc: string;
  icon: LucideIcon; // pass the component itself
};
const Card = ({ title, desc, icon: Icon }: CardProps) => {
  return (
    <article className="bg-white p-8 rounded flex flex-col">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 mb-6">
        <Icon className="w-5 h-5" />
      </div>

      <h5 className="font-bold text-xl mb-3">{title}</h5>
      <p className="text-sm text-[#666666] leading-relaxed grow mb-6">{desc}</p>
    </article>
  );
};

export default Card;
