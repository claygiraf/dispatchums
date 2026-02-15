import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#27272A]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <h2 className="text-2xl font-serif text-white mb-4 tracking-wide">
              DISPATCHUMS
            </h2>
            <p className="text-[#9CA3AF]">
              Smarter Emergency Response
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-[#9CA3AF] hover:text-[#1D9BF0] transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-[#9CA3AF] hover:text-[#1D9BF0] transition">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#9CA3AF] hover:text-[#1D9BF0] transition">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contact</h3>
            <ul className="space-y-3 text-[#9CA3AF]">
              <li>support@dispatchums.com</li>
              <li>1-800-DISPATCH</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#27272A] pt-8 text-center">
          <p className="text-[#9CA3AF]">© 2025 DISPATCHUMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}