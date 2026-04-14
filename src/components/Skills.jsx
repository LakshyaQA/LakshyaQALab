import React, { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { profileData } from '../data/profile'

const Skills = () => {
  const [animatedSkills, setAnimatedSkills] = useState({})
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      // Animate skills with staggered delays
      Object.keys(profileData.skills).forEach((skillCategory, index) => {
        setTimeout(() => {
          setAnimatedSkills(prev => ({
            ...prev,
            [skillCategory]: true,
          }))
        }, index * 200)
      })
    }
  }, [inView])

  const getSkillIcon = category => {
    const icons = {
      'Test Automation': '🤖',
      'API Testing': '🔗',
      'Performance Testing': '⚡',
      'CI/CD': '🚀',
      Programming: '💻',
      Databases: '🗄️',
      'Cloud & Tools': '☁️',
    }
    return icons[category] || '🔧'
  }

  return (
    <section
      id="skills"
      className="section-padding bg-white dark:bg-slate-950 transition-colors duration-300"
    >
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comprehensive expertise across the quality assurance technology stack
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(profileData.skills).map(([category, skillData], index) => (
            <div
              key={category}
              className="dark-elegant-card p-6 card-hover"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Category Header */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">{getSkillIcon(category)}</span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{category}</h3>
              </div>

              {/* Proficiency Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Proficiency</span>
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {skillData.proficiency}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-600 to-accent-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: animatedSkills[category] ? `${skillData.proficiency}%` : '0%',
                    }}
                  ></div>
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillData.technologies.map((tech, techIndex) => (
                    <span
                      key={tech}
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors duration-200"
                      style={{
                        animationDelay: `${index * 100 + techIndex * 50}ms`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience Level Indicator */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-slate-500">
                    Experience Level
                  </span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          i < Math.ceil(skillData.proficiency / 20)
                            ? 'bg-primary-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills Summary */}
        <div className="mt-16 bg-gradient-elegant dark:border dark:border-slate-800/80 rounded-2xl p-8 shadow-sm">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Quality Assurance Expertise
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              With comprehensive experience across automation frameworks, API testing, performance
              optimization, and CI/CD integration, I deliver robust quality assurance solutions that
              ensure reliable, high-performance applications.
            </p>

            {/* Key Achievements */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">7+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Technology Stacks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-500">25+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tools & Frameworks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600">100+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Automated Test Cases</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
