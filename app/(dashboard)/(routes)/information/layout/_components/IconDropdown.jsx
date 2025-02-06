import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const placeOptions = [
    { type: "Bathroom", icon: "https://cdn-icons-png.flaticon.com/512/174/174902.png" },
    { type: "Restaurant", icon: "https://cdn-icons-png.flaticon.com/512/1046/1046751.png" },
    { type: "Mosque", icon: "https://cdn-icons-png.flaticon.com/512/1995/1995532.png" },
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
