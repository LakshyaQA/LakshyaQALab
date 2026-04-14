import fs from 'fs'
import path from 'path'

/**
 * Smart Resume Sync Script
 * This script finds the latest PDF in the public/ folder that contains "resume"
 * in its name (case-insensitive) and copies it to public/resume.pdf so the
 * website always has the most recent version.
 */

const PUBLIC_DIR = 'public'
const TARGET_FILENAME = 'LakshyaSharmaQAAutomationEngineerResume.pdf'
const TARGET_PATH = path.join(PUBLIC_DIR, TARGET_FILENAME)

function syncResume() {
  console.log('🔍 Searching for the latest resume in public/ folder...')

  try {
    if (!fs.existsSync(PUBLIC_DIR)) {
      console.error(`❌ Dir not found: ${PUBLIC_DIR}`)
      return
    }

    const files = fs.readdirSync(PUBLIC_DIR)

    // Find all PDFs with "resume" in the name, excluding the target itself
    const resumeFiles = files.filter(file => {
      const lower = file.toLowerCase()
      return lower.includes('resume') && lower.endsWith('.pdf') && file !== TARGET_FILENAME
    })

    if (resumeFiles.length === 0) {
      console.log('⚠️ No alternative resume files found. Keeping current resume.pdf if it exists.')
      return
    }

    // Get file stats and sort by modification time (mtime)
    const sortedResumes = resumeFiles
      .map(file => {
        const filePath = path.join(PUBLIC_DIR, file)
        const stat = fs.statSync(filePath)
        return { name: file, path: filePath, mtime: stat.mtime }
      })
      .sort((a, b) => b.mtime - a.mtime)

    const latest = sortedResumes[0]

    console.log(`✅ Found latest resume: ${latest.name} (Updated: ${latest.mtime})`)

    // Only copy if it's actually different or if target doesn't exist
    // This prevents unnecessary file system activity
    fs.copyFileSync(latest.path, TARGET_PATH)
    console.log(`🚀 Synced ${latest.name} -> ${TARGET_PATH}`)
  } catch (error) {
    console.error('❌ Error syncing resume:', error.message)
  }
}

syncResume()
