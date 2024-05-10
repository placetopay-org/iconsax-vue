import { atom } from 'nanostores'

export const $query = atom<string>('')
export const $activeIcon = atom<string>(null)
export const $activeStyle = atom<string>('Bold')
export const $activeColor = atom<string>('#000')
