/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', 'node_modules/@placetopay/spartan-vue/dist/*.js'],
  theme: {
    extend: {}
  },
  plugins: [require('@placetopay/spartan-vue/plugin')({
    primary: {
      100: '214 240 228',
      300: '139 213 180',
      600: '66 184 131'
    }
  })]
}
