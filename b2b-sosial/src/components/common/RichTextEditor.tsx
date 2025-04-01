// src/components/common/RichTextEditor.tsx
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import React Quill with a different approach
// This addresses the findDOMNode error
const ReactQuill = dynamic(
  async () => {
    // Only import in client environment
    if (typeof window !== 'undefined') {
      const { default: RQ } = await import('react-quill');
      // Import CSS directly from the module (Next.js will handle this)
      import('react-quill/dist/quill.snow.css');
      return RQ;
    }
    // Return a placeholder component for server-side rendering
    return function PlaceholderQuill(props: any) {
      return <div className="quill-placeholder"><textarea {...props} /></div>;
    };
  },
  { ssr: false }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modules?: any;
  formats?: string[];
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write content here...',
  className = '',
  modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link'],
      ['clean'],
    ],
  },
  formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link',
  ],
}) => {
  // Local state to handle editor mounting issues
  const [mounted, setMounted] = useState(false);
  const [editorValue, setEditorValue] = useState(value);
  
  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);
  
  // Sync external value with local state
  useEffect(() => {
    if (value !== editorValue) {
      setEditorValue(value);
    }
  }, [value]);
  
  // Handle editor changes
  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };
  
  // Only render the actual editor after mounting on client
  if (!mounted) {
    return (
      <div className={`rich-editor-loading ${className}`}>
        <textarea 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[150px]"
          placeholder={placeholder}
          defaultValue={value}
        />
      </div>
    );
  }

  return (
    <div className={`rich-editor-container ${className}`}>
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default RichTextEditor;