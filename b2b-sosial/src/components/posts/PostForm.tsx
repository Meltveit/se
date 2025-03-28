import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/types';
import { createPost, updatePost } from '@/lib/firebase/db';
import { uploadPostImage } from '@/lib/firebase/storage';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Textarea from '@/components/common/Textarea';
import FileUpload, { FileUploadRef } from '@/components/common/FileUpload';
import { useToast } from '@/contexts/ToastContext';
import dynamic from 'next/dynamic';

// Dynamic import for RichTextEditor (react-quill)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface PostFormProps {
  businessId: string;
  existingPost?: Post;
  onSuccess?: (postId: string) => void;
  onCancel?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({
  businessId,
  existingPost,
  onSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState(existingPost?.title || '');
  const [summary, setSummary] = useState(existingPost?.summary || '');
  const [content, setContent] = useState(existingPost?.content || '');
  const [tags, setTags] = useState<string[]>(existingPost?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>(existingPost?.coverImage || '');
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileUploadRef = useRef<FileUploadRef>(null);
  const router = useRouter();
  const { showToast } = useToast();

  // Check if editing an existing post
  const isEditing = !!existingPost;

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link',
  ];

  // Handle tag input
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Add tag on Enter or comma
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().replace(/,/g, '');
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setIsSubmitting(true);

    try {
      let postCoverImageUrl = coverImageUrl;
      let additionalImageUrls: string[] = existingPost?.imageUrls || [];

      // Upload cover image if selected
      if (coverImage) {
        try {
          const fileId = existingPost?.id || 'new';
          const imageUrl = await uploadPostImage(
            businessId,
            fileId,
            coverImage,
            0,
            (progress) => setUploadProgress(progress)
          );
          postCoverImageUrl = imageUrl;
        } catch (error) {
          console.error('Error uploading cover image:', error);
          showToast('Failed to upload cover image', 'error');
          setIsSubmitting(false);
          return;
        }
      }

      // Upload additional images if selected
      if (additionalImages.length > 0) {
        try {
          const fileId = existingPost?.id || 'new';
          const uploadedUrls = await Promise.all(
            additionalImages.map((image, index) => 
              uploadPostImage(
                businessId, 
                fileId, 
                image, 
                index + 1, 
                (progress) => setUploadProgress(progress / additionalImages.length)
              )
            )
          );
          additionalImageUrls = [...additionalImageUrls, ...uploadedUrls];
        } catch (error) {
          console.error('Error uploading additional images:', error);
          showToast('Failed to upload additional images', 'error');
          setIsSubmitting(false);
          return;
        }
      }

      // Create/update post data
      const postData = {
        title,
        summary,
        content,
        tags,
        coverImage: postCoverImageUrl,
        imageUrls: additionalImageUrls,
        status: 'published' as const,
        authorId: businessId,
        businessId, // Add businessId
        viewCount: existingPost?.viewCount || 0, // Default to 0 if not provided
        likeCount: existingPost?.likeCount || 0, // Default to 0 if not provided
        commentCount: existingPost?.commentCount || 0, // Default to 0 if not provided
      };

      let postId;
      if (isEditing && existingPost) {
        // Update existing post
        await updatePost(existingPost.id, postData);
        postId = existingPost.id;
        showToast('Post updated successfully', 'success');
      } else {
        // Create new post
        postId = await createPost(businessId, postData);
        showToast('Post created successfully', 'success');
      }

      // Call onSuccess or redirect
      if (onSuccess) {
        onSuccess(postId);
      } else {
        router.push(`/news-feed/${postId}`);
      }
    } catch (error: any) {
      console.error('Error saving post:', error);
      if (error.message === 'Maximum post frequency reached (2 posts per week)') {
        setError('You have reached the maximum post limit (2 posts per week)');
      } else {
        setError('Failed to save post. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          placeholder="Enter post title"
        />
      </div>

      <div>
        <Textarea
          label="Summary (optional)"
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          fullWidth
          placeholder="Brief summary of your post"
          rows={3}
          hint="A short summary will appear in post previews"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <div className="rounded-md shadow-sm">
          <ReactQuill
            value={content}
            onChange={(value) => setContent(value)}
            modules={modules}
            formats={formats}
            placeholder="Write your post content here..."
            className="h-64"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cover Image {isEditing && coverImageUrl && '(Leave empty to keep current image)'}
        </label>
        <FileUpload
          accept="image/*"
          maxSize={5}
          multiple={false}
          onUpload={(files) => setCoverImage(files[0])}
          ref={fileUploadRef}
          hint="Recommended size: 1200 x 630 pixels (16:9 ratio)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-blue-800 hover:text-blue-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex">
          <Input
            id="tagInput"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag and press Enter"
            fullWidth
            disabled={tags.length >= 10}
          />
          <Button
            type="button"
            variant="secondary"
            className="ml-2"
            onClick={addTag}
            disabled={tags.length >= 10 || !tagInput.trim()}
          >
            Add
          </Button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Add up to 10 tags separated by commas or pressing Enter
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isEditing ? 'Update Post' : 'Publish Post'}
        </Button>
      </div>

      {/* Upload Progress Indicator */}
      {isSubmitting && uploadProgress > 0 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Uploading... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}
    </form>
  );
};

export default PostForm;