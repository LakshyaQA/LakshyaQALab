import React from 'react'
import { HeartIcon } from '@heroicons/react/24/solid'
import { profileData } from '../data/profile'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const footerLinks = [
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Experience', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'Resume', id: 'resume' },
    { name: 'Contact', id: 'contact' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand & Description */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-gradient mb-4">{profileData.name}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                QA Automation Engineer specializing in building robust test frameworks and ensuring
                software quality across web, mobile, API, and AI applications.
              </p>
              <div className="flex space-x-4">
                <a
                  href={profileData.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <span className="font-bold">in</span>
                </a>
                <a
                  href={profileData.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label="GitHub"
                >
                  <span className="font-bold">gh</span>
                </a>
                <a
                  href={`mailto:${profileData.email}`}
                  className="w-10 h-10 bg-primary-600 hover:bg-primary-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label="Email"
                >
                  <span className="font-bold">@</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {footerLinks.map(link => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <p>
                  <a
                    href={`mailto:${profileData.email}`}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {profileData.email}
                  </a>
                </p>
                <p>
                  <a
                    href={`tel:${profileData.phone}`}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {profileData.phone}
                  </a>
                </p>
                <p>{profileData.location}</p>
                <p className="text-sm text-gray-400 mt-2">Available for remote opportunities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-400 text-sm mb-4 md:mb-0">
              <span>
                © {currentYear} {profileData.name}. All rights reserved.
              </span>
            </div>

            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Built with</span>
              <HeartIcon className="h-4 w-4 text-red-500" />
              <span>using React & Tailwind CSS</span>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => scrollToSection('hero')}
          className="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-40"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </footer>
  )
}

export default Footer
