import supabase from '../config/supabase.js';
import { createAppError } from '../utils/helpers.js';

export const uploadService = {
  async saveFileRecord(caseId, file) {
    const record = {
      case_id: caseId,
      filename: file.originalname,
      filetype: file.mimetype,
      storage_url: `/uploads/${file.filename}`,
    };

    const { data, error } = await supabase
      .from('uploaded_files')
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async saveMultipleFiles(caseId, files) {
    const records = files.map((file) => ({
      case_id: caseId,
      filename: file.originalname,
      filetype: file.mimetype,
      storage_url: `/uploads/${file.filename}`,
    }));

    const { data, error } = await supabase
      .from('uploaded_files')
      .insert(records)
      .select();

    if (error) throw error;
    return data;
  },

  async getFilesByCase(caseId) {
    const { data, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('case_id', caseId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};
