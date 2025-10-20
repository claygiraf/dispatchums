export default function WhySection() {
  return (
    <section id="why" className="full-screen bg-[#0A0A0A] relative">
      <div className="absolute top-20 right-20 w-72 h-72 bg-[#10B981] rounded-full blur-[100px] opacity-10 flare"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div>
            <div className="inline-block px-4 py-2 glass rounded-full text-sm font-medium mb-6 text-[#1D9BF0]">
              Why Choose Us
            </div>
            
            <h2 className="text-6xl font-bold text-white mb-8">
              Why DISPATCHUMS?
            </h2>
            
            <p className="text-xl text-[#9CA3AF] leading-relaxed mb-8">
              Our platform is built to enhance decision-making, reduce response times, 
              and improve patient outcomes through cutting-edge technology and a user-centric design.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <span className="px-5 py-2 glass rounded-full text-sm text-[#10B981] border border-[#10B981]/30">
                AI-Powered
              </span>
              <span className="px-5 py-2 glass rounded-full text-sm text-[#1D9BF0] border border-[#1D9BF0]/30">
                HIPAA Compliant
              </span>
              <span className="px-5 py-2 glass rounded-full text-sm text-[#9CA3AF] border border-[#27272A]">
                24/7 Support
              </span>
            </div>
          </div>
          
          {/* Right Column - Glass Image Container */}
          <div className="glass rounded-3xl overflow-hidden p-2">
            <div className="aspect-video bg-gradient-to-br from-[#1D9BF0]/20 to-[#10B981]/20 rounded-2xl flex items-center justify-center border border-[#27272A]">
              <span className="text-7xl font-bold text-[#27272A]">600 × 400</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}