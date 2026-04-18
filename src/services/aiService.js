import OpenAI from 'openai'

const DEFAULT_OPENROUTER_KEY =
  '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'
const DEFAULT_MODEL = 'google/gemini-2.0-flash-001'

/**
 * Service to handle AI-powered XPath and Locator analysis using OpenRouter.
 */
class AIService {
  constructor() {
    this.userKey = localStorage.getItem('OPENROUTER_API_KEY') || ''
    this.apiKey = this.userKey || DEFAULT_OPENROUTER_KEY
    this.model = localStorage.getItem('AI_MODEL') || DEFAULT_MODEL
    this.client = this.apiKey ? this.createClient(this.apiKey) : null
  }

  createClient(key) {
    return new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: key,
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        'HTTP-Referer':
          typeof window !== 'undefined' ? window.location.origin : 'https://lakshyatesthub.com',
        'X-OpenRouter-Title': 'LakshyaQA Lab',
      },
    })
  }

  setApiKey(key) {
    this.userKey = key
    this.apiKey = key || DEFAULT_OPENROUTER_KEY
    localStorage.setItem('OPENROUTER_API_KEY', key) // Store '' to signify using default
    this.client = this.createClient(this.apiKey)
  }

  setModel(model) {
    this.model = model
    localStorage.setItem('AI_MODEL', model)
  }

  get isConfigured() {
    return !!this.apiKey
  }

  /**
   * Refactor a brittle XPath and provide explanation/tips.
   */
  async refactorXpath(xpath, tool = 'Selenium') {
    if (!this.client) throw new Error('OpenRouter API Key not configured')

    const prompt = `
      Act as a Senior SDET (Software Development Engineer in Test).
      Analyze the following fragile/incorrect XPath for ${tool}:
      "${xpath}"
      
      Tasks:
      1. Identify exactly what is syntactically or architecturally wrong.
      2. Provide the single BEST corrected version.
      3. Explain exactly why the original was wrong (Brain).
      4. Provide a "Pro Tip" for making it even more robust (e.g. using normalize-space, unique parents, or data-attributes).
      
      Respond ONLY in the following JSON format:
      {
        "isValid": boolean,
        "fixed": "corrected xpath",
        "explanation": "concise explanation of fixes",
        "proTip": "expert tip for robustness",
        "issues": ["list", "of", "issues"]
      }
    `

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      const text = completion.choices[0].message.content

      // Extract JSON in case AI adds markdown blocks
      const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text
      return JSON.parse(jsonStr)
    } catch (e) {
      console.error('OpenRouter API Error:', e)
      throw new Error(
        e.response?.data?.error?.message || e.message || 'Failed to connect to OpenRouter'
      )
    }
  }

  /**
   * Analyze an image (screenshot) to find locators.
   */
  async analyzeVision(imageBase64, tool = 'Selenium') {
    if (!this.client) throw new Error('OpenRouter API Key not configured')

    const prompt = `
        Analyze this screenshot of a UI. 
        Identify the primary interactive elements (buttons, inputs) and suggest the 3 most ROBUST ${tool} XPaths for them.
        Prioritize unique text and stable relative paths.
        
        Respond ONLY as JSON:
        {
          "elements": [
            { "name": "Element name", "xpath": "suggested xpath", "reason": "why this is robust" }
          ]
        }
      `

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      })

      const text = completion.choices[0].message.content
      const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text
      return JSON.parse(jsonStr)
    } catch (e) {
      console.error('Vision Analysis Error:', e)
      throw new Error('Failed to analyze image via OpenRouter')
    }
  }
}

export const aiService = new AIService()
export default aiService
