import React, { useState, useEffect, useRef } from "react";

function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-blue-600 text-white py-4 shadow-md">
            <div className="container mx-auto px-4 flex justify-between items-center relative">
                <h1 className="text-2xl font-bold">
                    <a href="/">Age & Gender Detection</a>
                </h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <a href="/" className="hover:underline">
                                Home
                            </a>
                        </li>
                        <li className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                className="hover:underline focus:outline-none"
                            >
                                About
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg p-4 w-64 z-10">
                                    <h2 className="text-lg font-semibold mb-2">
                                        About This App
                                    </h2>
                                    <p className="text-sm">
                                        Work in progress...
                                    </p>
                                </div>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
