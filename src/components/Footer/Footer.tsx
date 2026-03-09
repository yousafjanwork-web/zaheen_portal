import React from "react";
import { Globe, Video, MessageSquare, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/images/ZaheenLogo.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-20 mt-20">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

          {/* Logo */}
          <div>
            <img
              src={logo}
              alt="Zaheen Logo"
              className="h-10 mb-6 brightness-0 invert"
            />

            <p className="text-sm mb-6">
              Empowering learners with world-class education and professional training.
            </p>

            <div className="flex space-x-3">
              <Globe size={20} />
              <Video size={20} />
              <MessageSquare size={20} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>

            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Courses</li>
              <li>Pricing</li>
              <li>Testimonials</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>

            <ul className="space-y-2 text-sm">
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} /> info@zaheen.com
              </li>

              <li className="flex items-center gap-2">
                <Phone size={16} /> +92 XXX XXX XXX
              </li>

              <li className="flex items-center gap-2">
                <MapPin size={16} /> Pakistan
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-sm text-center">
          © 2024 Zaheen Educational Portal
        </div>

      </div>
    </footer>
  );
};

export default Footer;