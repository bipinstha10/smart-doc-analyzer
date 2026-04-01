import { Link } from "react-router";
import { BellRing, MessagesSquare, AlertCircle } from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const LandingPage = () => {
  return (
    <div className="pt-20">
      {" "}
      {/* Offset for fixed navbar */}
      {/* Hero Section */}
      <section className="md:h-[80vh] grid items-center gap-16 px-8 py-14 grid-cols-1 md:grid-cols-3 md:px-12 md:py-30">
        <div className="md:col-span-2 max-w-xl">
          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.1] text-onBackground">
            Turn chaos into clarity.
          </h1>

          <p className="mt-6 text-base leading-relaxed text-secondary">
            Upload documents and watch them organize themselves. Our AI
            instantly sorts notices, feedback, and complaints — giving you
            actionable insights in seconds, not hours.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/dashboard">
              <Button variant="primary">Start Classifying</Button>
            </Link>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
        <img
          src="/images/hero-image.png"
          className="rounded-base filter grayscale hover:grayscale-0 transition duration-300 hidden md:block"
          alt="Document classification interface"
        />
      </section>
      {/* Features Section */}
      <section
        id="features"
        className="md:h-[60vh] px-8 py-14 md:px-12 bg-[#f2f2f2] scroll-mt-20"
      >
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:justify-between">
          <h2 className="text-4xl font-semibold text-onBackground">
            Three categories. Infinite insights.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-secondary">
            Every document finds its place. Our AI categorizes your content with
            precision, so you can focus on what matters.
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
      </section>
      {/* About Section */}
      <section
        id="about"
        className="md:h-[60vh] px-8 py-14 md:px-12 md:py-20 scroll-mt-20"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-onBackground mb-6">
            About Us
          </h2>
          <p className="text-base leading-relaxed text-secondary mb-4">
            We built this tool because sorting through unstructured documents is
            exhausting. Our AI learns from your documents and automatically
            organizes them into notices, feedback, and complaints — so you can
            spend less time filing and more time taking action.
          </p>
          <p className="text-base leading-relaxed text-secondary">
            Whether you're managing customer feedback, internal communications,
            or support tickets, our platform brings order to chaos.
          </p>
        </div>
      </section>
      {/* Contact Section */}
      <section
        id="contact"
        className="md:h-[40vh] px-8 py-14 md:px-12 md:py-20 bg-[#f2f2f2] scroll-mt-20"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-onBackground mb-6">
            Get in Touch
          </h2>
          <p className="text-base leading-relaxed text-secondary mb-8">
            Have questions or feedback? We'd love to hear from you.
          </p>
          <div className="flex flex-col gap-4 md:flex-row justify-center">
            <Button variant="primary">Email Us</Button>
            <Button variant="outline">Schedule a Demo</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
