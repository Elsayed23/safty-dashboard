// components/IconDropdown.js
import React from 'react';

const iconOptions = [
    {
        value: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
        label: "Green Leaf",
    },
    {
        value: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
        label: "Red Leaf",
    },
    {
        value: "https://leafletjs.com/examples/custom-icons/leaf-orange.png",
        label: "Orange Leaf",
    },
];

const IconDropdown = ({ selectedIcon, onIconSelect }) => {
    const handleChange = (e) => {
        onIconSelect(e.target.value);
    };

    return (
        <select value={selectedIcon} onChange={handleChange} className="block w-full py-3 px-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
            {iconOptions.map((icon) => (
                <option key={icon.value} value={icon.value}>
                    {icon.label}
                </option>
            ))}
        </select>
    );
};

export default IconDropdown;
