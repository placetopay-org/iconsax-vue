import { atom, computed  } from 'nanostores';

export const $query = atom<string>('');
export const $activeIcon = atom<string>(null);
export const $activeStyle = atom<string>('Bold');
export const $activeColor = atom<string>('#000');

export const $useFill = computed($activeStyle, style => ['Bold', 'Outline', 'Bulk'].includes(style))