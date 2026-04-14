import React from 'react'
import {
  ChartBarIcon,
  CodeBracketIcon,
  CogIcon,
  RocketLaunchIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline'
import { profileData } from '../data/profile'

const About = () => {
  const testingProcess = [
    {
      step: 'Test Design & Development',
      icon: CodeBracketIcon,
      description: 'Design comprehensive test strategies and develop automated test frameworks',
    },
    {
      step: 'Automation & Execution',
      icon: CogIcon,
      description: 'Implement automated test suites with continuous integration',
    },
    {
      step: 'Performance & Monitoring',
      icon: ChartBarIcon,
      description: 'Conduct performance testing and monitor application metrics',
    },
    {
      step: 'AI testing & AI driven testing',
      icon: CpuChipIcon,
      description:
        'Leverage AI testing and AI-driven automation to validate models and optimized ,faster,more reliable releases',
    },
  ]

  return (
    <section
      id="about"
      className="section-padding bg-gray-50 dark:bg-slate-900 transition-colors duration-300"
    >
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* About Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {profileData.about.summary}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {profileData.about.personalIntro}
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-transparent dark:border-slate-700/50 hover:shadow-md transition-all">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">2+</div>
                <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                  Years Experience
                </div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-transparent dark:border-slate-700/50 hover:shadow-md transition-all">
                <div className="text-3xl font-bold text-accent-500">95%</div>
                <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                  Release Stability
                </div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-transparent dark:border-slate-700/50 hover:shadow-md transition-all">
                <div className="text-3xl font-bold text-secondary-600">40%</div>
                <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                  Efficiency Gain
                </div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-transparent dark:border-slate-700/50 hover:shadow-md transition-all">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">6+</div>
                <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">Major Projects</div>
              </div>
            </div>
          </div>

          {/* How I Test Process */}
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                How I Ensure Quality
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                My systematic approach to quality assurance
              </p>
            </div>

            <div className="space-y-4">
              {testingProcess.map((process, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 dark-elegant-card">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center border border-transparent dark:border-primary-800/30">
                      <process.icon className="h-6 w-6 text-primary-600 dark:text-primary-400 shadow-sm" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {process.step}
                    </h4>
                    <p className="text-gray-600 dark:text-slate-400 text-sm">
                      {process.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-2xl font-bold text-primary-200 dark:text-slate-800">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>

            {/* Process Flow Arrows */}
            <div className="hidden sm:block absolute left-8 top-16 bottom-16 w-0.5 bg-gradient-to-b from-primary-300 to-accent-300 opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
