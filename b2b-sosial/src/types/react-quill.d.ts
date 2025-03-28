declare module 'react-quill/dist/quill.snow.css' {
    const styles: string;
    export default styles;
  }
  
  // Additional type for Quill modules if needed
  declare module 'react-quill' {
    export interface ReactQuillProps {
      value: string;
      onChange: (content: string) => void;
      modules?: {
        toolbar?: any[];
        [key: string]: any;
      };
      formats?: string[];
      placeholder?: string;
      className?: string;
      theme?: 'snow' | 'bubble';
      readOnly?: boolean;
    }
  
    const ReactQuill: React.FC<ReactQuillProps>;
    export default ReactQuill;
  }