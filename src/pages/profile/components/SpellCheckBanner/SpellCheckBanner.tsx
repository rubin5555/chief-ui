import { Check } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ModalLoading } from '@/components/ui/ModalLoading';
import { useSpellCheckBannerAnalytics } from './SpellCheckBanner.analytics';
import {
  BannerIcon,
  BannerRoot,
  BannerSub,
  BannerText,
  BannerTitle,
} from './SpellCheckBanner.styles';
import { SPELL_CHECK_BANNER_IDS } from './SpellCheckBanner.testids';

const SpellCheckModal = lazy(() =>
  import('@/modals/SpellCheckModal').then((m) => ({ default: m.SpellCheckModal })),
);

export const SpellCheckBanner = () => {
  const [showSpellCheck, setShowSpellCheck] = useState(false);
  const { trackInstallClicked, trackSpellCheckModalOpened } = useSpellCheckBannerAnalytics();

  const handleInstall = () => {
    setShowSpellCheck(true);
    trackInstallClicked();
    trackSpellCheckModalOpened();
  };
  const handleClose = () => setShowSpellCheck(false);

  return (
    <BannerRoot data-testid={SPELL_CHECK_BANNER_IDS.root}>
      <BannerIcon>
        <Check size={16} />
      </BannerIcon>
      <BannerText>
        <BannerTitle>התקנת בדיקת איות</BannerTitle>
        <BannerSub>שפר את איכות הכתיבה עם בדיקת איות חכמה</BannerSub>
      </BannerText>
      <Button size="xs" data-testid={SPELL_CHECK_BANNER_IDS.install} onClick={handleInstall}>
        התקן
      </Button>

      {showSpellCheck && (
        <Suspense fallback={<ModalLoading />}>
          <SpellCheckModal onClose={handleClose} />
        </Suspense>
      )}
    </BannerRoot>
  );
};
