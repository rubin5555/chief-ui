import { Editor } from '@tinymce/tinymce-react';
import styled from 'styled-components';
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';
import 'tinymce/plugins/lists/plugin';
import 'tinymce/plugins/table/plugin';
import 'tinymce/plugins/directionality/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/image/plugin';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.inline.min.css';

import { useContentEditorContext } from '@/context/ContentEditorContext';
import { TINYMCE_INIT, TINYMCE_LICENSE_KEY } from './ContentEditor.constants';
import { ToolbarContainer } from './ContentEditor.styles';
import { CONTENT_EDITOR_IDS } from './ContentEditor.testids';

const GhostEditorHost = styled.div`
  position: fixed;
  top: -2000px;
  left: -2000px;
  width: 300px;
  height: 60px;
  pointer-events: none;
`;

export const ContentEditorToolbar = () => {
  const ctx = useContentEditorContext();
  if (!ctx) return null;

  return (
    <>
      <ToolbarContainer id={ctx.toolbarId} data-testid={CONTENT_EDITOR_IDS.toolbar} />
      {ctx.activeId === null && (
        <GhostEditorHost>
          <Editor
            inline
            disabled
            value=""
            licenseKey={TINYMCE_LICENSE_KEY}
            onEditorChange={() => {}}
            init={{
              ...TINYMCE_INIT,
              fixed_toolbar_container: `#${ctx.toolbarId}`,
            }}
          />
        </GhostEditorHost>
      )}
    </>
  );
};
