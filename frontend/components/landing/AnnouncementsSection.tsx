import { Megaphone } from 'lucide-react';

export default function AnnouncementsSection() {
  return (
    <section className="full-screen bg-[#0A0A0A] relative">
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981] rounded-full blur-[120px] opacity-10 flare flare-delay-1"></div>
      
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="inline-block px-4 py-2 glass rounded-full text-sm font-medium mb-6 text-[#10B981]">
          Latest Updates
        </div>
        
        <h2 className="text-6xl font-bold text-white mb-6">
          Announcements
        </h2>
        
        <p className="text-xl text-[#9CA3AF] mb-16">
          Latest updates and news from the DISPATCHUMS team.
        </p>
        
        <div className="glass rounded-3xl p-10 text-left hover:bg-white/10 transition-all">
          <div className="flex gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1D9BF0] to-[#10B981] flex items-center justify-center">
                <Megaphone className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-white mb-4">
                New Interface Deployed!
              </h3>
              
              <p className="text-lg text-[#9CA3AF] mb-6 leading-relaxed">
                We are excited to announce the launch of our new, streamlined 
                dispatch interface for improved performance and reliability.
              </p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-[#9CA3AF]">
                10/2/2025
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}