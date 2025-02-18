import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const placeOptions = [
    { type: "Fire extinguishers", icon: "/images/Fire-Extinguisher.webp" }, // Fire extinguisher icon
    { type: "Restaurant", icon: "https://cdn-icons-png.flaticon.com/512/3170/3170733.png" }, // Restaurant icon
    { type: "Bathrooms", icon: "https://cdn-icons-png.flaticon.com/512/3938/3938895.png" }, // Toilet icon
    { type: "First aid", icon: "https://cdn-icons-png.flaticon.com/512/5765/5765468.png" }, // First aid icon
    { type: "Meeting station", icon: "/images/Emergency-Meeting-Station.webp" },
];

const IconDropdown = ({ selectedType, onPlaceSelect }) => {
    const handleChange = (value) => {
        onPlaceSelect(value);
    };

    return (
        <Select value={selectedType} onValueChange={handleChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select Place" />
            </SelectTrigger>
            <SelectContent>
                {placeOptions.map((place) => (
                    <SelectItem key={place.type} value={place.type}>
                        {place.type}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default IconDropdown;
