import Link from "next/link";
import { ArrowUp } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-center bg-[#0A0A0A]">
      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A2540]/40 to-transparent opacity-70 z-0"></div>

      {/* Glow flares */}
      <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-[#1D9BF0] rounded-full blur-[140px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-[#10B981] rounded-full blur-[140px] opacity-10 animate-pulse delay-1000"></div>

      {/* Background heading */}
      <div className="absolute top-[15%] left-0 right-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center">
          <h1
            className="text-[7vw] font-bold leading-none"
            style={{
              WebkitTextStroke: "2px rgba(255, 255, 255, 0.3)",
              color: "rgba(255, 255, 255, 0.9)",
              textShadow: "0 0 40px rgba(255, 255, 255, 0.1)",
              marginBottom: "-0.3vw",
            }}
          >
            Smarter Medical
          </h1>
          <h2
            className="text-[10vw] font-bold leading-none whitespace-nowrap"
            style={{
              WebkitTextStroke: "2px rgba(29, 155, 240, 0.4)",
              color: "transparent",
              textShadow: "0 0 60px rgba(29, 155, 240, 0.2)",
            }}
          >
            Emergency Dispatch
          </h2>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center flex flex-col h-full justify-center">
        <div className="pt-100 pb-6">
          <p className="text-lg md:text-xl text-[#9CA3AF] mb-8 max-w-3xl mx-auto">
            Streamline emergency response with our intelligent Medical Priority Dispatch System.
          </p>

          {/* Search bar */}
          <div className="max-w-4xl mx-auto w-full">
            <div className="rounded-full p-1 border border-[#27272A]/30 hover:border-[#1D9BF0]/50 transition-all">
              <div className="flex items-center gap-3 px-5 py-2">
                <input
                  type="text"
                  placeholder="What do you want to know?"
                  className="flex-1 bg-transparent text-white placeholder-[#9CA3AF] text-base focus:outline-none"
                />
                <button className="w-10 h-10 rounded-full bg-[#1D9BF0] flex items-center justify-center hover:bg-[#1a8cd8] transition-all shadow-lg flex-shrink-0">
                  <ArrowUp className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="mt-8 pb-20">
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/register"
              className="px-9 py-3 bg-[#1D9BF0] text-white text-base font-semibold rounded-full hover:bg-[#1a8cd8] transition-all shadow-2xl shadow-[#1D9BF0]/30 hover:scale-105"
            >
              Get Started Free
            </Link>

            <Link
              href="#features"
              className="px-9 py-3 bg-white/5 text-white text-base font-semibold rounded-full hover:bg-white/10 transition-all border border-white/20"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
