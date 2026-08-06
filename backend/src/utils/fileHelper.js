import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import supabase from '../config/supabase.js';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

/**
 * Loads uploaded files for a case from database and reads their content/image base64
 */
export async function getCaseFileAnalysis(caseId) {
  try {
    const { data: files, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('case_id', caseId);

    if (error || !files || files.length === 0) {
      return { fileTextSummary: '', imageParts: [], fileNames: [] };
    }

    let fileTextSummary = '';
    const imageParts = [];
    const fileNames = [];

    for (const fileRecord of files) {
      fileNames.push(fileRecord.filename);
      // Determine local filepath on server
      const localFilename = path.basename(fileRecord.storage_url || fileRecord.filename);
      const filePath = path.join(uploadsDir, localFilename);

      if (fs.existsSync(filePath)) {
        const mime = fileRecord.filetype || '';

        if (mime.startsWith('image/')) {
          try {
            const buffer = fs.readFileSync(filePath);
            const base64 = buffer.toString('base64');
            imageParts.push({
              inlineData: {
                data: base64,
                mimeType: mime,
              },
            });
            fileTextSummary += `\n[Uploaded Image File: ${fileRecord.filename} (Type: ${mime}) - Analyzed via Gemini Vision]`;
          } catch (err) {
            logger.warn(`Failed to read image file ${filePath}: ${err.message}`);
          }
        } else if (mime.startsWith('text/') || mime.includes('csv') || mime.includes('json')) {
          try {
            const textContent = fs.readFileSync(filePath, 'utf-8');
            fileTextSummary += `\n[Uploaded Document Content (${fileRecord.filename})]:\n${textContent.slice(0, 3000)}\n`;
          } catch (err) {
            logger.warn(`Failed to read text file ${filePath}: ${err.message}`);
          }
        } else {
          fileTextSummary += `\n[Uploaded File Attachment: ${fileRecord.filename} (Type: ${mime})]`;
        }
      }
    }

    return { fileTextSummary, imageParts, fileNames };
  } catch (err) {
    logger.error(`Error loading case file analysis: ${err.message}`);
    return { fileTextSummary: '', imageParts: [], fileNames: [] };
  }
}
