export const profileData = {
  // Personal Information
  name: 'Lakshya Sharma',
  title: 'QA Automation Engineer',
  email: 'lakshyasharmaqa@gmail.com',
  phone: '+91 9649975469',
  location: 'Jaipur, India',
  domain: 'lakshyasharmaqa.dev',

  // Social Links
  social: {
    linkedin: 'https://linkedin.com/in/lakshyasharmaqa',
    github: 'https://github.com/LakshyaQA',
    email: 'lakshyasharmaqa@gmail.com',
  },

  // Hero Section
  hero: {
    headline: 'QA Automation Engineer',
    subheadline: 'Playwright · Appium · Python/TypeScript · Azure DevOps · Selenium · BrowserStack',
    description:
      'QA Automation Engineer with 2.5+ years of expertise in architecting scalable automation frameworks, API & mobile testing, and high-performance Web testing using Playwright and Selenium.',
    typingText: [
      'Web Automation',
      'Mobile Automation',
      'API Systems',
      'Playwright E2E Automation',
      'CI/CD Pipelines',
      'Performance Testing',
    ],
  },

  // About Section
  about: {
    summary:
      "I'm a QA Automation Engineer based in Jaipur with 2.5+ years of experience in the software testing lifecycle (STLC). I specialize in building TDD-based automation frameworks using Playwright and Appium, integrating robust CI/CD pipelines, and leveraging Agentic AI for optimized test planning and maintenance. I have a proven track record of accelerating regression execution by 40% and ensuring 95%+ release stability across Web, Mobile, and API applications.",
    personalIntro:
      'Passionate about building robust QA processes, I leverage automation, performance testing, and prompt engineering to reduce bugs early, enhance efficiency, and deliver reliable, high-performance software.',
  },

  // Skills
  skills: {
    'Test Automation': {
      technologies: [
        'Selenium',
        'Pytest',
        'Appium',
        'Playwright',
        'BrowserStack',
        'SDET Practices',
        'WebDriverIO',
        'Mocha',
      ],
      proficiency: 95,
    },
    'API Testing': {
      technologies: ['REST Assured', 'Postman', 'Swagger', 'Requests Library', 'SQL Validation'],
      proficiency: 90,
    },
    'Testing Types': {
      technologies: [
        'Functional',
        'End-to-End',
        'Regression',
        'Sanity',
        'JMeter/Locust',
        'Performance & Security (OWASP)',
      ],
      proficiency: 85,
    },
    'CI/CD & DevOps': {
      technologies: [
        'Azure Pipelines',
        'Jenkins',
        'GitHub Actions',
        'GitLab CI',
        'Docker',
        'Kubernetes',
        'Git (YML)',
      ],
      proficiency: 80,
    },
    Languages: {
      technologies: ['TypeScript', 'Core Java', 'Python', 'SQL'],
      proficiency: 85,
    },
    'AI & Prompting': {
      technologies: ['Prompt Engineering', 'Agentic AI', 'AI Model Validation', 'Generative AI'],
      proficiency: 80,
    },
    'Agile & Tracking': {
      technologies: [
        'JIRA',
        'Zephyr',
        'Confluence',
        'BrowserStack',
        'Azure DevOps',
        'Azure Test Plan',
        'Scrum',
        'Test Planning',
        'Bug Tracking',
      ],
      proficiency: 90,
    },
  },

  // Experience
  experience: [
    {
      company: 'TuningBill Services Pvt Ltd.',
      role: 'QA Automation Engineer',
      duration: 'Oct 2025 - Present',
      location: 'Jaipur, India',
      logo: '/api/placeholder/60/60',
      achievements: [
        'Architected and refactored a scalable Mobile Automation Framework from scratch using POM and TDD patterns',
        'Implemented Android and iOS test execution using Appium with BrowserStack for parallel execution',
        'Integrated 3+ test suites into CI/CD pipelines using Azure DevOps and Jenkins, reducing manual execution by 50%',
        'Developed Playwright-based web automation in TypeScript covering critical user journeys across all major browsers',
        'Leveraged Agentic AI and prompt engineering to automate manual test case creation and framework maintenance',
        'Analyzed flaky test failures and optimized waits/retries, improving pipeline stability and reliability',
      ],
      projects: ['smiONE: Fintech Payment System'],
    },
    {
      company: 'IIHT-Techademy',
      role: 'QA Automation Engineer',
      duration: 'Aug 2023 - Oct 2025',
      location: 'Pune, India',
      logo: '/api/placeholder/60/60',
      achievements: [
        'Boosted regression efficiency by 40% through hybrid test automation framework (Selenium, Pytest, TestNG)',
        'Reduced crash rates by 30% via rigorous testing and shift-left bug detection',
        'Integrated automation suites into Jenkins CI/CD pipelines, cutting manual execution effort',
        'Executed performance testing with JMeter, improving response times by 20%',
        'Led quality assurance for AI-driven projects including AEYE Proctoring System',
        'Managed end-to-end testing for Yaksha Assessment Platform and Campus Portal',
      ],
      projects: [
        'AEYE - AI Proctoring System',
        'YAKSHA - Assessment Platform',
        'Techademy Campus Portal',
      ],
    },
  ],

  // Personal Projects (Non-Professional)
  projects: [
    {
      id: 1,
      name: 'CarDekho Functional Automation',
      category: 'E2E',
      description:
        'Automated functional user journeys on the CarDekho platform using Selenium, Java, Maven, and TestNG.',
      problem:
        'Validating core flows like car selection and navigation manually was repetitive and error-prone.',
      solution:
        'Developed a modular automation suite using POM for end-to-end scenarios covering car selection and detail page validation.',
      techStack: ['Selenium', 'Java', 'Maven', 'TestNG', 'POM'],
      keyMetrics: 'Improved test accuracy and reduced manual validation effort by 65%.',
      githubUrl: 'https://github.com/LakshyaQA/ExlatProjectCarDekho',
      demoUrl: null,
      image: '/api/placeholder/400/250',
      featured: true,
    },
    {
      id: 2,
      name: 'I2V QA Testing Suite (IQTS)',
      category: 'API',
      description:
        'Web automation framework for CCTV control portals with API validation and CI/CD integration.',
      problem:
        'CCTV portals required high-reliability validation of camera control and user onboarding.',
      solution:
        'Built a robust API testing framework in Python/Pytest with Jenkins pipelines for automated reporting.',
      techStack: ['Python', 'Pytest', 'JMeter', 'Allure', 'API Testing', 'Jenkins'],
      keyMetrics: 'Achieved 95% API coverage and identified 23 critical bugs before production',
      githubUrl: 'https://github.com/LakshyaQA/i2v_qa',
      demoUrl: null,
      image: '/api/placeholder/400/250',
      featured: true,
    },
  ],

  // Professional Projects (Experience Summary)
  professionalProjects: [
    {
      name: 'smiONE: Fintech Payment System',
      description:
        'Fintech payment ecosystem requiring high security and cross-platform reliability.',
      role: 'Lead Mobile & Web Automation Engineer focusing on Appium and Playwright orchestration',
      techStack: ['Appium', 'Playwright', 'TypeScript', 'BrowserStack', 'Azure DevOps'],
      impact: '50% reduction in manual regression time and 95%+ release stability',
    },
    {
      name: 'AEYE - AI Proctoring System',
      description:
        'AI-powered proctoring solution with real-time monitoring and AI model validation.',
      role: 'Led automation & performance testing including WebSocket and load testing',
      techStack: ['Python', 'Selenium', 'JMeter', 'Kafka', 'Azure'],
      impact: 'Improved system stability by 30% and throughput by 20%',
    },
    {
      name: 'YAKSHA - Assessment Platform',
      description: 'Online assessment platform for technical and aptitude evaluations.',
      role: 'Implemented automation frameworks, database validation, and CI/CD integration',
      techStack: ['Selenium', 'Pytest', 'REST Assured', 'PostgreSQL', 'Jenkins'],
      impact: 'Achieved 95%+ platform reliability and reduced load times by 40%',
    },
  ],

  // Certifications
  certifications: [
    'ISTQB Certified Tester Foundation Level (CTFL)',
    'Generative AI Foundation - UpGrad',
  ],

  // Testimonials
  testimonials: [
    {
      name: 'Senior Manager',
      role: 'Technical Lead at Techademy',
      content:
        "Lakshya's automation frameworks significantly improved our release quality and reduced testing cycles. His attention to detail and proactive QA approach is exceptional.",
      avatar: '/api/placeholder/60/60',
    },
    {
      name: 'Project Manager',
      role: 'AEYE Project Team',
      content:
        'His expertise in AI testing and performance optimization was crucial to our success. Lakshya consistently delivered high-quality testing solutions under tight deadlines.',
      avatar: '/api/placeholder/60/60',
    },
  ],

  // Resume
  resume: {
    downloadUrl: '/LakshyaSharmaQAAutomationEngineerResume.pdf',
    highlights: [
      '2.5+ Years Experience',
      'Appium & Playwright Expert',
      'Web testing using Playwright and Selenium',
      '95%+ Release Stability',
      '50% Regression Efficiency Gains',
      'CI/CD Orchestration (Azure DevOps)',
    ],
  },

  // SEO Data
  seo: {
    title: 'Lakshya Sharma | QA Automation Engineer Portfolio',
    description:
      'QA Automation Engineer with 2.5+ years experience in Playwright, Appium, Selenium, and Azure DevOps. Specializing in Web, Mobile, and API testing with a focus on Jaipur/Pune locations.',
    keywords:
      'QA Automation Engineer, Playwright, Appium, Selenium, Azure DevOps, BrowserStack, Web testing, Agentic AI, Jaipur QA, Lakshya Sharma',
    ogImage: '/og-image.jpg',
  },
}
