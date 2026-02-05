'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getAuthHeaders } from '@/lib/auth';

// Dynamically import CKEditor to avoid SSR issues
const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then((mod) => mod.CKEditor), {
  ssr: false,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your article content...',
}: RichTextEditorProps) {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorWrapper, setEditorWrapper] = useState<any>(null);

  useEffect(() => {
    // Load ClassicEditor build only on client
    if (typeof window !== 'undefined') {
      import('@ckeditor/ckeditor5-build-classic').then((ClassicEditorModule) => {
        const ClassicEditor = ClassicEditorModule.default;
        // Wrap the editor class in the format expected by CKEditor React component
        // The ClassicEditor build is self-contained and includes everything needed
        setEditorWrapper({
          create: ClassicEditor.create.bind(ClassicEditor),
        });
        setEditorLoaded(true);
      });
    }
  }, []);

  const editorConfig = useMemo(
    () => ({
      placeholder,
      toolbar: {
        items: [
          'heading',
          '|',
          'bold',
          'italic',
          '|',
          'bulletedList',
          'numberedList',
          '|',
          'outdent',
          'indent',
          '|',
          'blockQuote',
          'insertTable',
          'link',
          'imageUpload',
          'mediaEmbed',
          '|',
          'undo',
          'redo',
        ],
        shouldNotGroupWhenFull: true,
      },
      heading: {
        options: [
          { model: 'paragraph' as const, title: 'Paragraph', class: 'ck-heading_paragraph' },
          {
            model: 'heading1' as const,
            view: 'h1',
            title: 'Heading 1',
            class: 'ck-heading_heading1',
          },
          {
            model: 'heading2' as const,
            view: 'h2',
            title: 'Heading 2',
            class: 'ck-heading_heading2',
          },
          {
            model: 'heading3' as const,
            view: 'h3',
            title: 'Heading 3',
            class: 'ck-heading_heading3',
          },
          {
            model: 'heading4' as const,
            view: 'h4',
            title: 'Heading 4',
            class: 'ck-heading_heading4',
          },
        ],
      },
      image: {
        toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side', 'linkImage'],
        resizeUnit: 'px' as const,
      },
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableCellProperties',
          'tableProperties',
        ],
      },
      link: {
        decorators: {
          openInNewTab: {
            mode: 'manual' as const,
            label: 'Open in a new tab',
            attributes: {
              target: '_blank',
              rel: 'noopener noreferrer',
            },
          },
        },
      },
      // Simple upload adapter for images
      // Uses Next.js API route proxy to handle authentication
      simpleUpload: {
        uploadUrl: '/api/media',
        withCredentials: true,
      },
    }),
    [placeholder]
  );

  const handleChange = (_event: any, editor: any) => {
    const data = editor.getData();
    onChange(data);
  };

  if (!editorLoaded || !editorWrapper) {
    return (
      <div className="border rounded-md p-4 min-h-[400px] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="rich-text-editor border rounded-md bg-white">
      <CKEditor
        editor={editorWrapper}
        data={value || ''}
        onChange={handleChange}
        config={editorConfig}
        disableWatchdog={true}
      />
      <style jsx global>{`
        .rich-text-editor .ck-editor {
          min-height: 600px;
        }
        .rich-text-editor .ck-editor__editable {
          min-height: 600px;
          font-size: 16px;
          line-height: 1.8;
          padding: 24px;
        }
        .rich-text-editor .ck-editor__editable.ck-focused {
          outline: none;
          box-shadow: none;
        }
        .rich-text-editor .ck-content {
          min-height: 600px;
        }
        .rich-text-editor .ck-content h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        .rich-text-editor .ck-content h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        .rich-text-editor .ck-content h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        .rich-text-editor .ck-content p {
          margin: 0.75em 0;
        }
        .rich-text-editor .ck-content img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
        }
        .rich-text-editor .ck-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
        }
        .rich-text-editor .ck-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
        }
        .rich-text-editor .ck-content table td,
        .rich-text-editor .ck-content table th {
          border: 1px solid #e5e7eb;
          padding: 0.5em;
        }
      `}</style>
    </div>
  );
}
