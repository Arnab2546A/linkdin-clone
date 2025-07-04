import { supabase } from '../storage/supabaseClient';

// Upload a file (image or video) to Supabase Storage and get its public URL
export async function uploadToSupabase(file, folder = 'task-images') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`; // No need for folder prefix, since bucket is the folder

  const { error } = await supabase.storage.from('task-images').upload(filePath, file); // <-- change here
  if (error) throw error;

  const { data } = supabase.storage.from('task-images').getPublicUrl(filePath); // <-- change here
  return data.publicUrl;
}

// Insert a post into the 'posts' table
export async function createSupabasePost({ email, username, user_photo, description, media_url, title, likes }) {
  const { error } = await supabase
    .from('task_user_info') // <-- changed here
    .insert([{
      email,
      username,
      user_photo, // <-- new
      description,
      media_url,
      title,
      likes, // <-- new
      liked_by: [],
      // created_at will be set automatically
    }]);
  if (error) throw error;
}

// Get all posts from the 'posts' table
export async function getSupabasePosts() {
  const { data, error } = await supabase
    .from('task_user_info') // <-- changed here
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Delete a post from the 'posts' table and its media from storage
export async function deleteSupabasePost(id) {
  try {
    // First get the post to find its media_url
    const { data: post, error: fetchError } = await supabase
      .from('task_user_info')
      .select('media_url')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error("Error fetching post:", fetchError);
      throw fetchError;
    }
    
    // If post has media, delete it from storage
    if (post && post.media_url) {
      // Extract filename from URL
      const url = new URL(post.media_url);
      const pathSegments = url.pathname.split('/');
      const fileName = pathSegments[pathSegments.length - 1];
      
      console.log("Deleting file:", fileName);
      
      // Delete the file from storage
      const { error: storageError } = await supabase
        .storage
        .from('task-images')  // Your bucket name
        .remove([fileName]);
        
      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue with post deletion even if file deletion fails
      }
    }

    // Then delete the post from the database
    const { error } = await supabase
      .from('task_user_info')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error in deleteSupabasePost:", error);
    throw error;
  }
}

export async function toggleLikePost(post, userEmail) {
  const likedBy = post.liked_by || [];
  const hasLiked = likedBy.includes(userEmail);
  let newLikes = post.likes || 0;
  let newLikedBy;

  if (hasLiked) {
    newLikes -= 1;
    newLikedBy = likedBy.filter(email => email !== userEmail);
  } else {
    newLikes += 1;
    newLikedBy = [...likedBy, userEmail];
  }

  const { error } = await supabase
    .from('task_user_info') // <-- changed here
    .update({ likes: newLikes, liked_by: newLikedBy })
    .eq('id', post.id);

  if (error) throw error;
  return { likes: newLikes, liked_by: newLikedBy };
}