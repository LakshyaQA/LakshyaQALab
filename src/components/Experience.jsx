import React, { useState } from 'react'
import {
  CalendarIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'
import { profileData } from '../data/profile'

const Experience = () => {
  const [expandedExperience, setExpandedExperience] = useState(0)
  const [expandedProject, setExpandedProject] = useState(null)

  const toggleExperience = index => {
    setExpandedExperience(expandedExperience === index ? -1 : index)
  }

  const toggleProject = projectName => {
    setExpandedProject(expandedProject === projectName ? null : projectName)
  }

  return (
    <section id="experience" className="section-padding bg-gray-50 dark:bg-gray-800/50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Professional <span className="text-gradient">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Building quality assurance excellence across diverse technology platforms
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Experience Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div
              className="absolute left-8 top-0 bottom-0"
              style={{
                width: '2px',
                backgroundImage:
                  'repeating-linear-gradient(to bottom, #d1d5db 0px, #d1d5db 8px, transparent 8px, transparent 16px)',
              }}
            ></div>

            {profileData.experience.map((exp, index) => (
              <div key={index} className="relative mb-12 ml-20">
                {/* Timeline Dot — ring style */}
                <div className="absolute -left-12 top-6 w-5 h-5 rounded-full bg-white dark:bg-gray-900 border-2 border-primary-500 dark:border-primary-400 shadow-md flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400"></div>
                </div>

                {/* Experience Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 card-hover">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">
                          {exp.company.split('-')[0][0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {exp.role}
                        </h3>
                        <p className="text-primary-600 dark:text-primary-400 font-semibold">
                          {exp.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end space-y-1">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {exp.duration}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {exp.location}
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="space-y-3">
                    {exp.achievements
                      .slice(0, expandedExperience === index ? exp.achievements.length : 3)
                      .map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-1.5 h-1.5 bg-primary-600 rounded-full mt-2"></div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {achievement}
                          </p>
                        </div>
                      ))}
                  </div>

                  {/* Expand/Collapse Button */}
                  {exp.achievements.length > 3 && (
                    <button
                      onClick={() => toggleExperience(index)}
                      className="flex items-center space-x-2 mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                    >
                      <span className="text-sm font-medium">
                        {expandedExperience === index
                          ? 'Show Less'
                          : `Show ${exp.achievements.length - 3} More`}
                      </span>
                      {expandedExperience === index ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Professional Projects Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Key Professional Projects
            </h3>

            <div className="grid gap-6">
              {profileData.professionalProjects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 card-hover"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {project.name}
                    </h4>
                    <button
                      onClick={() => toggleProject(project.name)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                    >
                      {expandedProject === project.name ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-3">{project.description}</p>

                  {expandedProject === project.name && (
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">My Role:</h5>
                        <p className="text-gray-600 dark:text-gray-300">{project.role}</p>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                          Tech Stack:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech, techIndex) => (
                            <span key={techIndex} className="skill-badge">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Impact:</h5>
                        <p className="text-accent-600 dark:text-accent-400 font-medium">
                          {project.impact}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
