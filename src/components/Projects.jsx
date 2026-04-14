import React, { useState } from 'react'
import { EyeIcon, CodeBracketIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { profileData } from '../data/profile'

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Project Image */}
          <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-lg mb-6 flex items-center justify-center">
            <div className="text-primary-600 dark:text-primary-400 text-4xl font-bold">
              {project.name
                .split(' ')
                .map(word => word[0])
                .join('')}
            </div>
          </div>

          {/* Category Badge */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="skill-badge">{project.category}</span>
            {project.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300">
                Featured
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {project.description}
          </p>

          {/* Problem & Solution */}
          <div className="space-y-4 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Problem:</h4>
              <p className="text-gray-600 dark:text-gray-300">{project.problem}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Solution:</h4>
              <p className="text-gray-600 dark:text-gray-300">{project.solution}</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Tech Stack:</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <span key={index} className="skill-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Achievement:</h4>
            <p className="text-accent-600 dark:text-accent-400 font-medium">{project.keyMetrics}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center space-x-2"
            >
              <CodeBracketIcon className="h-5 w-5" />
              <span>View Code</span>
            </a>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center space-x-2"
              >
                <EyeIcon className="h-5 w-5" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)

  const categories = ['All', 'E2E', 'API', 'Performance', 'AI']

  const filteredProjects =
    activeFilter === 'All'
      ? profileData.projects
      : profileData.projects.filter(project => project.category === activeFilter)

  const openProjectModal = project => {
    setSelectedProject(project)
  }

  const closeProjectModal = () => {
    setSelectedProject(null)
  }

  return (
    <section
      id="projects"
      className="section-padding bg-white dark:bg-slate-950 transition-colors duration-300"
    >
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Showcasing quality assurance expertise through comprehensive testing projects
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <FunnelIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-2" />
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 dark:bg-slate-900/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div key={project.id} className="dark-elegant-card overflow-hidden card-hover group">
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center">
                <div className="text-primary-600 dark:text-primary-400 text-4xl font-bold">
                  {project.name
                    .split(' ')
                    .map(word => word[0])
                    .join('')}
                </div>
                {project.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-accent-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  <span className="skill-badge text-xs">{project.category}</span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack Preview */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.techStack.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-gray-500 dark:text-gray-400">
                      +{project.techStack.length - 3} more
                    </span>
                  )}
                </div>

                {/* Key Metric */}
                <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-3 mb-4">
                  <p className="text-accent-700 dark:text-accent-300 text-sm font-medium">
                    🎯 {project.keyMetrics}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => openProjectModal(project)}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>Details</span>
                  </button>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <CodeBracketIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Projects Found */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No projects found for "{activeFilter}" category.
            </p>
          </div>
        )}

        {/* Project Modal */}
        <ProjectModal project={selectedProject} onClose={closeProjectModal} />
      </div>
    </section>
  )
}

export default Projects
