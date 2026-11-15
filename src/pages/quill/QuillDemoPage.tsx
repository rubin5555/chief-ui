import { TinyQuillEditor, type TinyQuillToolbarState } from '@workspace/tiny-quill-editor';
import { useState } from 'react';
import { EditorContent, EditorWrapper } from '@/components/ui/ContentEditor/ContentEditor.styles';
import { EditorRibbon } from '@/components/ui/ContentEditor/components/EditorRibbon';
import {
  DemoHeader,
  DemoPageRoot,
  DemoSubtitle,
  DemoTitle,
} from '@/pages/collab/CollabDemoPage/CollabDemoPage.styles';

const INITIAL_HTML = '<p>זהו עורך Quill שמחובר לסרגל הכלים ולסרגל הטבלה של ContentEditor.</p>';

// ponytail: TinyQuillEditor + hoisted EditorRibbon without ContentEditor wrapper
export const QuillDemoPage = () => {
  const [tinyToolbar, setTinyToolbar] = useState<TinyQuillToolbarState | null>(null);
  const [content, setContent] = useState(INITIAL_HTML);
  const [footnotes, setFootnotes] = useState<string[]>([]);

  const handleAddFootnote = () => {
    const marker = String(footnotes.length + 1);
    setFootnotes((prev) => [...prev, `הערת שוליים ${marker}`]);
    return marker;
  };

  return (
    <DemoPageRoot>
      <DemoHeader>
        <DemoTitle>הדגמת Quill</DemoTitle>
        <DemoSubtitle>עורך TinyQuillEditor מחובר ל-EditorRibbon.</DemoSubtitle>
      </DemoHeader>

      <EditorWrapper $inset={false}>
        <EditorRibbon flush onAddFootnote={handleAddFootnote} tinyToolbar={tinyToolbar} />
        <EditorContent $minHeight={240} data-testid="quill-demo-content">
          <TinyQuillEditor
            embedded
            hideToolbar
            minHeight={220}
            locale="he"
            direction="rtl"
            value={content}
            initialValue={content}
            onChange={setContent}
            onToolbarStateChange={setTinyToolbar}
          />
        </EditorContent>
      </EditorWrapper>

      {footnotes.length > 0 && (
        <ol>
          {footnotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ol>
      )}
    </DemoPageRoot>
  );
};
