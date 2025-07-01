
import React from 'react';

export const Footer: React.FC = () => {
  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Supported Devices', href: '/devices' },
        { name: 'Accessibility', href: '/accessibility' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Content Guidelines', href: '/guidelines' }
      ]
    },
    {
      title: 'Account',
      links: [
        { name: 'Manage Account', href: '/account' },
        { name: 'Billing', href: '/billing' },
        { name: 'Redeem Gift Cards', href: '/gift' },
        { name: 'Ways to Watch', href: '/watch' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#' },
    { name: 'Twitter', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'YouTube', href: '#' }
  ];

  return (
    <footer className="bg-black text-gray-400 py-12 px-4 md:px-8 lg:px-12 xl:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Social Links */}
        <div className="flex space-x-6 mb-8">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label={social.name}
            >
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
            </a>
          ))}
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="text-red-600 font-bold text-2xl">MERFLIX</div>
              <div className="text-sm text-gray-500">© 2024 Merflix, Inc.</div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <select className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
              </select>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            <p>
              Merflix is a streaming service that offers a wide variety of award-winning TV shows, movies and documentaries on thousands of internet-connected devices.
            </p>
            <p className="mt-2">
              You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
