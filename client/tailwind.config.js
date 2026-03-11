/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0f172a',    // slate-900
                surface: '#1e293b',       // slate-800
                primary: '#6366f1',       // indigo-500
                secondary: '#14b8a6',     // teal-500
                accent: '#f43f5e',        // rose-500
                'diff-easy': '#34d399',   // emerald-400
                'diff-medium': '#fbbf24', // amber-400
                'diff-hard': '#ef4444',   // red-500
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
