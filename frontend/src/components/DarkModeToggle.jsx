// frontend/src/components/DarkModeToggle.jsx

import React, { useState, useEffect } from 'react';

function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className='bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded'
        >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
    );
}

export default DarkModeToggle;