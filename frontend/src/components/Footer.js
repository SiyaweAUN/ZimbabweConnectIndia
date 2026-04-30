// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ExternalLink } from 'lucide-react';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm">ZimbabweConnect</p>
                <p className="text-xs text-brand-400 font-semibold tracking-wide">INDIA</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Bridging Zimbabwean talent with world-class Indian universities. Your dream education is closer than you think.
            </p>
            {/* Flags */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>🇿🇼</span><span>Zimbabwe</span>
              <span className="text-gray-700">×</span>
              <span>🇮🇳</span><span>India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/about', 'About Us'], ['/scholarships', 'Scholarships'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partner Universities */}
          <div>
            <h4 className="text-white font-semibold mb-4">Partner Universities</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {['Amity University', 'Manipal University', 'SRM Institute', 'VIT University', 'Symbiosis International'].map(u => (
                <li key={u} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                  {u}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:siyabongamtombeni20@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-brand-400 transition-colors">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  info@zimbabweconnectindia.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/263771234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                  <WhatsAppIcon />
                  +263 78 906 0918
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Harare, Zimbabwe &amp; New Delhi, India</span>
              </li>
            </ul>

            {/* Social */}
            <div className="flex items-center gap-3 mt-5">
              {[
                { Icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-400' },
                { Icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-400' },
                { Icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
                { Icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-500' },
              ].map(({ Icon, href, label, color }) => (
                <a key={label} href={href} aria-label={label}
                  className={`w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 ${color} transition-all`}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} ZimbabweConnectIndia. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link to="/about" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
