declare module 'react-quill' {
    import React from 'react';
  
    interface ReactQuillProps {
      value: string;
      onChange: (content: string) => void;
      modules?: Record<string, any>;
      formats?: string[];
      placeholder?: string;
      className?: string;
      // Legg til andre props du trenger her
    }
  
    const ReactQuill: React.FC<ReactQuillProps>;
    export default ReactQuill;
  }