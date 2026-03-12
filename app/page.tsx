import Link from "next/link";
import {
  Mail,
  MousePointer2,
  Zap,
  Layout,
  CheckCircle2,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Navbar } from "./components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 bg-secondary rounded-full border border-white/10 text-xs font-semibold mb-8"
            data-aos="fade-down"
          >
            <span className="bg-accent px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
              New
            </span>
            <span>AI-powered templates now available</span>
          </div>

          <h1
            className="text-xl lg:text-5xl xl:text-7xl font-extrabold leading-[1.1] mb-8 gradient-text"
            data-aos="fade-up"
          >
            Create stunning emails <br className="hidden md:block" /> in
            seconds, not hours.
          </h1>

          <p
            className="md:text-lg lg:text-xl text-text-light/60 max-w-2xl mx-auto mb-10 leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Boost your conversion rates with our drag-and-drop email builder.
            AI-powered content generation and professional templates to make
            your brand stand out.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Link
              href="/editor"
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-text-light px-8 py-3 rounded-full lg:text-lg font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Start creating <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full sm:w-auto glass hover:bg-white/10 text-text-light px-8 py-3 rounded-full lg:text-lg font-bold transition-all">
              Watch Demo
            </button>
          </div>

          {/* Image Placeholder/Mockup */}
          <div
            className="mt-20 relative px-4"
            data-aos="zoom-in-up"
            data-aos-delay="300"
          >
            <div className="glass rounded-2xl p-2 md:p-4 border border-white/10 shadow-2xl">
              <div className="bg-background rounded-lg aspect-[16/9] flex items-center justify-center overflow-hidden border border-white/5">
                <div className="flex flex-col items-center gap-4 opacity-20">
                  <Layout className="w-20 h-20" />
                  <span className="text-xl font-medium tracking-widest">
                    EMAIL EDITOR PREVIEW
                  </span>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="hidden lg:block absolute -top-10 -left-10 glass p-4 rounded-xl border border-white/10 animate-bounce cursor-default select-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">AI Assistant</div>
                  <div className="text-[10px] text-text-light/50">
                    Writing subject lines...
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block absolute -bottom-10 -right-10 glass p-4 rounded-xl border border-white/10 animate-pulse cursor-default select-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <MousePointer2 className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">Real-time Collab</div>
                  <div className="text-[10px] text-text-light/50">
                    2 others editing
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-secondary/30 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2
              className="text-xl lg:text-3xl xl:text-5xl font-bold mb-6"
              data-aos="fade-up"
            >
              Everything you need to <span className="text-accent">scale</span>.
            </h2>
            <p
              className="text-text-light/60 max-w-xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              We've packed MailMaker with powerful features to help you create,
              send, and optimize your email campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <MousePointer2 className="w-8 h-8 text-accent" />,
                title: "Drag & Drop Builder",
                desc: "Intuitive editor that lets you build professional emails without writing a single line of code.",
              },
              {
                icon: <Zap className="w-8 h-8 text-accent" />,
                title: "AI Copywriting",
                desc: "Stop staring at a blank screen. Let our AI generate compelling copy and subject lines for you.",
              },
              {
                icon: <Layout className="w-8 h-8 text-accent" />,
                title: "100+ Templates",
                desc: "Start from a library of beautifully designed, high-converting templates for every industry.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass p-8 rounded-3xl border border-white/10 hover:border-accent/30 transition-all hover:-translate-y-2 group"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-text-light/60 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2" data-aos="fade-right">
              <h2 className="text-xl lg:text-3xl xl:text-5xl font-bold mb-8 leading-tight">
                Design like a pro, <br /> even if you aren't one.
              </h2>

              <div className="space-y-8">
                {[
                  {
                    title: "Pick a template",
                    text: "Choose from our curated collection of conversion-focused designs.",
                  },
                  {
                    title: "Customize with AI",
                    text: "Add your content and let our AI optimize it for your audience.",
                  },
                  {
                    title: "Send with confidence",
                    text: "Preview on 50+ devices and send knowing it looks perfect.",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{step.title}</h4>
                      <p className="text-text-light/50 text-sm">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-12 bg-accent hover:bg-accent/90 text-text-light px-8 py-3 rounded-full font-bold transition-all">
                Get started for free
              </button>
            </div>

            <div className="lg:w-1/2 relative" data-aos="fade-left">
              <div className="glass aspect-square rounded-full border border-white/5 p-8 relative flex items-center justify-center">
                <div className="bg-background w-full h-full rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="flex flex-col items-center gap-2 opacity-10">
                    <Mail className="w-32 h-32" />
                    <span className="text-3xl font-black italic">PROCESS</span>
                  </div>
                </div>

                {/* Floating circles */}
                <div className="absolute top-10 right-10 w-24 h-24 bg-accent/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-secondary/40 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/20 pt-20 pb-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-accent p-1.5 rounded-lg">
                  <Mail className="w-4 h-4 text-text-light" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  MailMaker <span className="text-accent">AI</span>
                </span>
              </div>
              <p className="text-text-light/40 text-sm leading-relaxed mb-6">
                The world's most intuitive AI-powered email template builder for
                creators and businesses.
              </p>
              <div className="flex gap-4">
                <Twitter className="w-5 h-5 text-text-light/50 hover:text-accent cursor-pointer transition-colors" />
                <Github className="w-5 h-5 text-text-light/50 hover:text-accent cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-text-light/50 hover:text-accent cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-accent">
                Product
              </h5>
              <ul className="space-y-4 text-sm text-text-light/50 font-medium">
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Features
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Templates
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Pricing
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Integrations
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-accent">
                Company
              </h5>
              <ul className="space-y-4 text-sm text-text-light/50 font-medium">
                <li className="hover:text-accent cursor-pointer transition-colors">
                  About Us
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Career
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Blog
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Contact
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-accent">
                Join the newsletter
              </h5>
              <p className="text-xs text-text-light/40 mb-4">
                Get the latest tips on email marketing.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-background border border-white/10 rounded-lg px-4 py-2 text-xs w-full focus:outline-none focus:border-accent"
                />
                <button className="bg-accent hover:bg-accent/90 px-4 py-2 rounded-lg text-xs font-bold transition-all">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-4">
            <p className="text-[10px] text-text-light/30">
              © {new Date().getFullYear()} MailMaker AI Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-[10px] text-text-light/30 font-medium">
              <span className="hover:text-text-light/60 cursor-pointer">
                Privacy Policy
              </span>
              <span className="hover:text-text-light/60 cursor-pointer">
                Terms of Service
              </span>
              <span className="hover:text-text-light/60 cursor-pointer">
                Cookie Settings
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
