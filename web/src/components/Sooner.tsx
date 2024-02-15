import { Toaster, toast } from 'sonner'
import { useStore } from '@nanostores/react';
import { $activeIcon, $activeStyle } from '@/store';
import { useEffect } from 'react';

export default function Sooner() {
  const activeIcon = useStore($activeIcon);
  const activeStyle = useStore($activeStyle);

  useEffect(() => {
    if (activeIcon) {
      toast.success(`${activeIcon} in ${activeStyle} copied to clipboard!`);
    }
  }, [activeIcon]);

    return (
      <Toaster position="top-center" />
    );
}
