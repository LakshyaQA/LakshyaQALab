import React, { useState } from 'react'
import { DocumentArrowDownIcon, EyeIcon, StarIcon } from '@heroicons/react/24/outline'
import { profileData } from '../data/profile'
import { useResumeDownload } from '../hooks/useResumeDownload'

const Resume = () => {
  const { handleDownload } = useResumeDownload()
  const [showResumePreview, setShowResumePreview] = useState(false)

  const toggleResumePreview = () => {
    setShowResumePreview(!showResumePreview)
  }

  // Get current month and year for "Resume last updated"
  const currentDate = new Date()
  const options = { month: 'long', year: 'numeric' }
  const formattedDate = currentDate.toLocaleDateString('en-US', options)

  return (
    <section id="resume" className="section-padding bg-gray-50 dark:bg-gray-800/50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Download My <span className="text-gradient">Resume</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get a comprehensive overview of my qualifications, experience, and achievements
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Career Highlights */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
              Career Highlights
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {profileData.resume.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center card-hover"
                >
                  <div className="flex items-center justify-center mb-2">
                    <StarIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <DocumentArrowDownIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Professional Resume
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Comprehensive document showcasing my experience in quality assurance, automation
                testing, and technical expertise across multiple domains.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => handleDownload(profileData.resume.downloadUrl)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  <span>Download Resume (PDF)</span>
                </button>

                <button
                  onClick={toggleResumePreview}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <EyeIcon className="h-5 w-5" />
                  <span>{showResumePreview ? 'Hide Preview' : 'Preview Resume'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Resume Preview */}
          {showResumePreview && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="bg-primary-600 text-white p-4">
                <h4 className="text-lg font-semibold flex items-center">
                  <EyeIcon className="h-5 w-5 mr-2" />
                  Resume Preview
                </h4>
              </div>

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {profileData.name}
                  </h1>
                  <h2 className="text-xl text-primary-600 dark:text-primary-400 mb-4">
                    {profileData.title}
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{profileData.email}</span>
                    <span>•</span>
                    <span>{profileData.phone}</span>
                    <span>•</span>
                    <span>{profileData.location}</span>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-primary-600 pl-3">
                    Professional Summary
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {profileData.about.summary}
                  </p>
                </div>

                {/* Key Skills */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-primary-600 pl-3">
                    Core Competencies
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.keys(profileData.skills).map((skillCategory, index) => (
                      <div key={index} className="space-y-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {skillCategory}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {profileData.skills[skillCategory].technologies
                            .slice(0, 2)
                            .map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-primary-600 pl-3">
                    Professional Experience
                  </h3>
                  {profileData.experience.map((exp, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {exp.role}
                          </h4>
                          <p className="text-primary-600 dark:text-primary-400 font-medium">
                            {exp.company}
                          </p>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>{exp.duration}</p>
                          <p>{exp.location}</p>
                        </div>
                      </div>
                      <ul className="space-y-1 ml-4">
                        {exp.achievements.slice(0, 4).map((achievement, achIndex) => (
                          <li
                            key={achIndex}
                            className="text-sm text-gray-700 dark:text-gray-300 list-disc"
                          >
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Education & Certifications */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-primary-600 pl-3">
                      Education
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium">
                        Bachelor's Degree in Computer Science/Engineering
                      </p>
                      <p>Relevant Coursework: Software Testing, Database Management</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-primary-600 pl-3">
                      Certifications
                    </h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {profileData.certifications.map((cert, index) => (
                        <li key={index}>• {cert}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Resume last updated: {formattedDate} • Available for immediate employment
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Resume
