import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSpellCheckBannerAnalytics } from './SpellCheckBanner.analytics';
import {
  BannerIcon,
  BannerRoot,
  BannerSub,
  BannerText,
  BannerTitle,
} from './SpellCheckBanner.styles';
import { SPELL_CHECK_BANNER_IDS } from './SpellCheckBanner.testids';

interface SpellCheckBannerProps {
  onInstall: () => void;
}

export const SpellCheckBanner = ({ onInstall }: SpellCheckBannerProps) => {
  const { trackInstallClicked } = useSpellCheckBannerAnalytics();

  const handleInstall = () => {
    onInstall();
    trackInstallClicked();
  };

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
    </BannerRoot>
  );
};
