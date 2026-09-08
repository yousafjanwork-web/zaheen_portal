import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Camera, Video, MessageCircle } from 'lucide-react';
const logo = "https://cdn.zaheen.com.pk/zaheen-web-img/zaheen-origami-logo1-1.png";
import { useOrigamiBase } from '../hooks/useOrigamiBase';
import { Navigate } from 'react-router-dom';

interface FooterProps {
  darkMode: boolean;
}

const Footer = ({ darkMode }: FooterProps) => {
  const base = useOrigamiBase();
  const navigate = useNavigate()
  return (
    <footer className={`relative overflow-hidden ${darkMode ? 'bg-[#0a0a1a]' : 'bg-gray-900'} text-white`}>
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none">
          <path
            d="M0,30 C360,60 720,0 1080,30 C1260,45 1360,20 1440,30 L1440,0 L0,0 Z"
            fill={darkMode ? '#0f0f23' : '#F9FAFB'}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
          <Link to={base} className="flex items-center gap-3 mb-4">
  <img
    src={logo}
    alt="Zaheen Origami Logo"
    className="w-16 h-16 object-contain flex-shrink-0"
  />

  <div>
    <h3 className="font-fredoka font-bold text-xl gradient-text">
      Zaheen Origami
    </h3>
    <p className="text-xs text-gray-400 font-nunito">
      Learn • Fold • Create
    </p>
  </div>
</Link>
            <p className="text-gray-400 font-nunito text-sm leading-relaxed mb-4">
              Making paper folding fun and accessible for kids everywhere. Learn beautiful origami through step-by-step videos!
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Video size={18} />, color: 'hover:bg-red-500' },
                { icon: <Camera size={18} />, color: 'hover:bg-pink-500' },
                { icon: <MessageCircle size={18} />, color: 'hover:bg-sky-500' },
                { icon: <Mail size={18} />, color: 'hover:bg-primary' },
              ].map((social, i) => (
                <button
                  key={i}
                  className={`p-2.5 rounded-xl bg-white/10 transition-all duration-200 ${social.color} hover:scale-110`}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-fredoka font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
            {[
                { to: base, label: 'Home' },
                { to: `${base}/library`, label: 'Video Library' },
                { to: `${base}/category/animals`, label: 'Categories' },
                { to: `${base}/profile`, label: 'My Profile' },
              
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white font-nunito text-sm transition-colors duration-200 hover:pl-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-fredoka font-bold text-lg mb-4">Categories</h4>
            <ul className="space-y-2.5">
             {['🐦 Birds', '🐶 Animals', '🌸 Flowers', '⭐ Stars', '❤️ Hearts', '🎁 Boxes'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`${base}/library`}
                    className="text-gray-400 hover:text-white font-nunito text-sm transition-colors duration-200"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-fredoka font-bold text-lg mb-4">Stay Updated! 📬</h4>
            <p className="text-gray-400 font-nunito text-sm mb-4">
              Get weekly craft ideas and tips delivered to your inbox!
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="parent@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="w-full bg-gradient-to-r from-primary to-pink px-4 py-3 rounded-xl font-nunito font-bold text-sm btn-bounce hover:shadow-lg hover:shadow-primary/25 transition-shadow">
                Subscribe ✉️
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <p className="text-gray-500 font-nunito text-sm flex items-center gap-1">
            Made with <Heart size={14} className="text-pink fill-pink" /> by Zaheen Origami © {new Date().getFullYear()}
          </p>
          <div className="flex gap-6">
            <button onClick={()=>navigate("/privacy")} className="text-gray-500 hover:text-gray-300 font-nunito text-sm transition-colors">Privacy</button>
            <button onClick={()=>navigate("/terms")} className="text-gray-500 hover:text-gray-300 font-nunito text-sm transition-colors">Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
