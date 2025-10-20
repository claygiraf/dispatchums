import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="full-screen bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1D9BF0]/10 to-[#10B981]/10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1D9BF0] rounded-full blur-[200px] opacity-10 flare"></div>
      
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-6xl md:text-7xl font-bold text-white mb-8">
          Ready to Transform Your Dispatch?
        </h2>
        
        <p className="text-2xl text-[#9CA3AF] mb-12">
          Join hundreds of agencies improving response times
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            href="/register"
            className="px-12 py-5 bg-[#1D9BF0] text-white text-lg font-semibold rounded-full hover:bg-[#1a8cd8] transition-all shadow-2xl shadow-[#1D9BF0]/30 hover:scale-105"
          >
            Get Started Free
          </Link>
          
          <a 
            href="mailto:feedback@dispatchums.com"
            className="px-12 py-5 glass text-white text-lg font-semibold rounded-full hover:bg-white/10 transition-all"
          >
            Give Feedback
          </a>
        </div>
      </div>
    </section>
  );
}