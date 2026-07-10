import { MessageSquare, Phone } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { gray } from '@/styles/theme';
import { useContactPermissionsModalAnalytics } from './ContactPermissionsModal.analytics';
import { ORG_CONTACTS } from './ContactPermissionsModal.constants';
import {
  ChatButton,
  Description,
  OrgActions,
  OrgList,
  OrgName,
  OrgPhone,
  OrgRow,
} from './ContactPermissionsModal.styles';
import { CONTACT_PERMISSIONS_MODAL_IDS } from './ContactPermissionsModal.testids';

interface ContactPermissionsModalProps {
  onClose: () => void;
}

export const ContactPermissionsModal = ({ onClose }: ContactPermissionsModalProps) => {
  const { trackChatClicked } = useContactPermissionsModalAnalytics();

  const onChatClick = (orgName: string) => () => trackChatClicked(orgName);

  return (
    <Modal title="טיפול בהרשאות" onClose={onClose} data-testid={CONTACT_PERMISSIONS_MODAL_IDS.root}>
      <Description>
        לצפייה במסמכים ופתיחת הרשאות למערכת יש לפנות אל הפיקוד הרלוונטי אליך
      </Description>

      <OrgList>
        {ORG_CONTACTS.map((org) => (
          <OrgRow key={org.id} data-testid={CONTACT_PERMISSIONS_MODAL_IDS.orgRow(org.id)}>
            <OrgName>{org.name}</OrgName>
            <OrgActions>
              <Phone size={16} color={gray[500]} />
              <OrgPhone>{org.phone}</OrgPhone>
              <ChatButton
                type="button"
                aria-label={`צ'אט עם ${org.name}`}
                data-testid={CONTACT_PERMISSIONS_MODAL_IDS.chatButton(org.id)}
                onClick={onChatClick(org.name)}
              >
                <MessageSquare size={16} />
              </ChatButton>
            </OrgActions>
          </OrgRow>
        ))}
      </OrgList>
    </Modal>
  );
};
