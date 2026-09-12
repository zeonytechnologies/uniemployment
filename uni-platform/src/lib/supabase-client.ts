import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadFileToSupabase(file: File): Promise<{ url: string | null; error: any }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('uni-uploads')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('uni-uploads')
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading file to Supabase:', error);
    return { url: null, error };
  }
}

export async function deleteFileFromSupabase(url: string | null): Promise<{ success: boolean; error: any }> {
  if (!url || !url.includes('uni-uploads')) {
    return { success: true, error: null }; // Nothing to delete or not a Supabase URL
  }

  try {
    // Extract the filename from the URL
    // e.g., https://...supabase.co/storage/v1/object/public/uni-uploads/filename.png
    const urlParts = url.split('/uni-uploads/');
    if (urlParts.length !== 2) return { success: true, error: null };
    
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('uni-uploads')
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting file from Supabase:', error);
    return { success: false, error };
  }
}
