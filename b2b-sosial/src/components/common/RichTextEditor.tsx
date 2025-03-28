// src/components/common/RichTextEditor.tsx
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import React Quill with no SSR
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // When we import react-quill in this way, we don't need to import CSS directly
    return function comp({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />;
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
  return (
    <div className={`rich-editor-container ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
      {/* @ts-expect-error - styled-jsx props not recognized by TypeScript */}
      <style jsx global>{`
        .quill {
          border-radius: 0.375rem;
          border: 1px solid #e5e7eb;
        }
        .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          border-bottom: 1px solid #e5e7eb !important;
          background-color: #f9fafb;
        }
        .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          border: none !important;
          font-family: inherit;
          font-size: 1rem;
          min-height: 150px;
        }
        .ql-editor {
          min-height: 150px;
          max-height: 500px;
          overflow-y: auto;
        }
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;