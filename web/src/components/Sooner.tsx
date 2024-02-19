import { Toaster, toast } from 'sonner'
import { useStore } from '@nanostores/react';
import { $activeIcon, $activeStyle, $activeColor, $useFill } from '@/store';
import { useEffect } from 'react';
import { codeToHtml } from 'shiki/bundle/web'


export default function Sooner() {
  const activeIcon = useStore($activeIcon);
  const activeStyle = useStore($activeStyle);
  const activeColor = useStore($activeColor);
  const useFill = useStore($useFill);

  useEffect(() => {
    if (activeIcon) {
      const code = `
        <script setup>
        import { ${activeIcon}Icon } from '@placetopay/iconsax-vue/${activeStyle.toLowerCase()}';
        </script>

        <template>
          <${activeIcon}Icon class="${useFill ? 'fill' : 'stroke'}-[${activeColor}] h-6 w-6" />
        </template>
      `;

      const promise = codeToHtml(code, {
        lang: 'vue',
        theme: 'github-light',
      });

      toast.promise(promise, {
        loading: 'Loading...',
        success: (html) => {
          return <div className='flex flex-col'>
          <header className='flex gap-1 items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className='h-4' viewBox="0 0 24 24" fill="none"><path stroke="#111827" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M3 10c0-4.56 1.67-5.8 5-5.98M14 22H9c-5 0-6-2-6-6v-2m13-9.98c3.33.18 5 1.41 5 5.98v5"/><path stroke="#111827" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M11 2h-.96c-1 0-2 0-2 2s1 2 2 2h4c2 0 2-1 2-2 0-2-1-2-2-2M15 19v-3h3m3 6-5.96-5.96"/></svg>
            <h1 className='font-semibold'>{activeIcon} icon copied to clipboard!</h1>
          </header>
          <main className='overflow-hidden'>
            <div className='-translate-x-14 text-[15px]' dangerouslySetInnerHTML={{__html: html}} />
          </main>
          </div>;
        },
      });
    }
  }, [activeIcon]);

    return (
      <Toaster position="bottom-left" duration={5000} closeButton visibleToasts={2} toastOptions={{style: { width: 'fit-content'}}} />
    );
}
