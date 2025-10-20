import { Zap, ShieldCheck } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Structured Questioning",
      description: "Systematically gather critical information with our guided, step-by-step process.",
      gradient: "from-[#1D9BF0] to-[#10B981]"
    },
    {
      icon: ShieldCheck,
      title: "Guided Protocols",
      description: "Follow clear, step-by-step prompts that ensure compliance and consistency.",
      gradient: "from-[#10B981] to-[#1D9BF0]"
    }
  ];

  return (
    <section id="features" className="full-screen bg-[#0A0A0A] relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1D9BF0] rounded-full blur-[150px] opacity-5 flare"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold text-white mb-6">
            Core Features
          </h2>
          <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto">
            Built for speed, accuracy, and reliability in critical moments
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="glass rounded-3xl p-10 hover:bg-white/10 transition-all group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-lg text-[#9CA3AF] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}