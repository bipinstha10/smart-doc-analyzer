import { Link } from "react-router";
import { BellRing, MessagesSquare, AlertCircle } from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const LandingPage = () => {
  return (
    <div className="pt-24">
      <section className="max-w-7xl mx-auto px-8 pt-20 pb-32 grid md:grid-cols-12 gap-16 items-center">
        <div className="md:col-span-7">
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-onBackground">
            Turn chaos into clarity.
          </h1>

          <p className="mt-6 text-xl leading-relaxed mb-10">
            Upload documents and watch them organize themselves. Our AI
            instantly sorts notices, feedback, and complaints — giving you
            actionable insights in seconds, not hours.
          </p>
          <div className="flex gap-4">
            <Link to="/dashboard">
              <Button variant="primary">Start Classifying</Button>
            </Link>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
        <div className="md:col-span-5">
          <img
            src="/images/hero-image.png"
            className="w-full aspect-4/5 rounded-sm grayscale hover:grayscale-0 transition-all duration-700 hidden md:block"
            alt="Document classification interface"
          />
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="px-8 py-32 bg-[#f6f6f6] scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between mb-20">
            <h2 className="text-4xl font-bold text-onBackground">
              Three categories. Infinite insights.
            </h2>
            <p className="max-w-md text-[#666666] text-sm leading-relaxed">
              Every document finds its place. Our AI categorizes your content
              with precision, so you can focus on what matters.
            </p>
          </div>
          <div className="grid h-full place-items-center gap-4 grid-cols-1 md:grid-cols-3">
            <Card
              title="Notices"
              desc="Important announcements and informational updates that keep your team aligned."
              icon={BellRing}
            />
            <Card
              title="Feedback"
              desc="Constructive suggestions and positive input for continuous improvement."
              icon={MessagesSquare}
            />
            <Card
              title="Complaints"
              desc="Issues and concerns flagged for urgent triage and resolution."
              icon={AlertCircle}
            />
          </div>
        </div>
      </section>
      {/* About Section */}
      <section
        id="about"
        className="max-w-7xl mx-auto px-8 py-32 md:px-12 text-center scroll-mt-20"
      >
        <h2 className="text-3xl md:text-4xl font-semibold text-onBackground mb-20">
          About Us
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img
            src="/images/about.png"
            alt="About illustration"
            className="w-full rounded shadow-sm grayscale"
          />

          <div className="text-left">
            <p className="md:text-lg text-[#666666] leading-relaxed mb-4">
              We built this tool because sorting through unstructured documents
              is exhausting. Our AI learns from your documents and automatically
              organizes them into notices, feedback, and complaints — so you can
              spend less time filing and more time taking action.
            </p>
            <p className="md:text-lg text-[#666666] leading-relaxed">
              Whether you're managing customer feedback, internal
              communications, or support tickets, our platform brings order to
              chaos.
            </p>
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section
        id="contact"
        className="md:h-[40vh] px-8 py-14 md:px-12 md:py-20 bg-[#f2f2f2] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-onBackground mb-6">
            Get in Touch
          </h2>
          <p className="md:text-base leading-relaxed text-[#666] mb-8">
            Have questions or feedback? We'd love to hear from you.
          </p>
          <div className="flex flex-col gap-4 md:flex-row justify-center">
            <a href="mailto:beepeenstha10@gmail.com">
              <Button variant="primary">Email Us</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
