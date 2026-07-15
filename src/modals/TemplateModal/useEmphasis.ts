import { useState } from 'react';

export const useEmphasis = () => {
  const [hasEmphasis, setHasEmphasis] = useState(false);
  const [emphasisText, setEmphasisText] = useState('');

  const addEmphasis = () => setHasEmphasis(true);

  const removeEmphasis = () => {
    setHasEmphasis(false);
    setEmphasisText('');
  };

  return {
    hasEmphasis,
    emphasisText,
    setEmphasisText,
    addEmphasis,
    removeEmphasis,
  };
};
