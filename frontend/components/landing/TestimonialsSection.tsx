import { Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      title: "A Game-Changer",
      quote: "The guided questions are incredibly clear and have significantly reduced our decision-making time. It's an essential tool for any modern dispatch center.",
      author: "Alex Johnson",
      role: "Dispatch Supervisor",
      accent: "#1D9BF0"
    },
    {
      title: "Reliable and Intuitive",
      quote: "The interface is so clean and easy to follow. The guided prompts make sure we never miss a critical step, especially during high-stress calls.",
      author: "Maria Garcia",
      role: "Emergency Dispatcher",
      accent: "#10B981"
    },
    {
      title: "Improved Our Response",
      quote: "Since implementing this system, our team's consistency and speed have noticeably improved. The data reporting is fantastic for training.",
      author: "David Chen",
      role: "EMS Chief",
      accent: "#1D9BF0"
    }
  ];

  return (
    <section id="testimonials" className="full-screen bg-[#0A0A0A] relative">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#1D9BF0] rounded-full blur-[120px] opacity-10 flare"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 glass rounded-full text-sm font-medium mb-6 text-[#10B981]">
            Success Stories
          </div>
          
          <h2 className="text-6xl font-bold text-white mb-6">
            Trusted by Professionals
          </h2>
          
          <p className="text-xl text-[#9CA3AF]">
            See what our users are saying about DISPATCHUMS.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="glass rounded-3xl p-8 hover:bg-white/10 transition-all group"
            >
              <Quote className="w-12 h-12 mb-6 opacity-30" style={{color: testimonial.accent}} />
              
              <h3 className="text-2xl font-bold text-white mb-4">
                {testimonial.title}
              </h3>
              
              <p className="text-[#9CA3AF] leading-relaxed mb-8 italic">
                "{testimonial.quote}"
              </p>
              
              <div className="pt-6 border-t border-[#27272A]">
                <p className="font-semibold text-white">{testimonial.author}</p>
                <p className="text-sm text-[#9CA3AF] mt-1">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}