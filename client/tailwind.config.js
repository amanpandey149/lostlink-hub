/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Poppins', 'sans-serif'],
            },
            colors: {
                primary: '#4F46E5', // Indigo-600
                secondary: '#10B981', // Emerald-500
                accent: '#8B5CF6', // Violet-500
                dark: '#0F172A', // Slate-900
                light: '#F8FAFC', // Slate-50
            },
            boxShadow: {
                'premium': '0 10px 40px -10px rgba(0,0,0,0.08)',
                'premium-hover': '0 20px 40px -10px rgba(0,0,0,0.12)',
            }
        },
    },
    plugins: [],
}
