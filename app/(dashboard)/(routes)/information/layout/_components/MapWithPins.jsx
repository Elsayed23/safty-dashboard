"use client";

import { useState, useRef } from "react";
import IconDropdown from "./IconDropdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { IoClose } from "react-icons/io5"; // Importing the "X" icon from react-icons

// Custom pin icons for each place type
const placeOptions = [
  { type: "Fire extinguishers", icon: "/images/Fire-Extinguisher.webp" }, // Fire extinguisher icon
  { type: "Restaurant", icon: "https://cdn-icons-png.flaticon.com/512/3170/3170733.png" }, // Restaurant icon
  { type: "Bathrooms", icon: "https://cdn-icons-png.flaticon.com/512/3938/3938895.png" }, // Toilet icon
  { type: "First aid", icon: "https://cdn-icons-png.flaticon.com/512/5765/5765468.png" }, // First aid icon
  { type: "Meeting station", icon: "/images/Emergency-Meeting-Station.webp" },
];

const MapWithPins = () => {
  const [image, setImage] = useState(null);
  const [pins, setPins] = useState([]);
  const [isCreatingPin, setIsCreatingPin] = useState(false);
  const [newPin, setNewPin] = useState({ x: 0, y: 0, type: "", icon: "", description: "" });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadInput, setShowUploadInput] = useState(true);
  const imageRef = useRef(null);

  // Handle Image Upload
  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result);
        setShowUploadInput(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Drag Over
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle Drag Enter
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle Drag Leave
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  // Handle clicking on the image to place pins
  const handleImageClick = (event) => {
    if (!imageRef.current || !isCreatingPin) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setNewPin((prevPin) => ({
      ...prevPin,
      x,
      y,
    }));

    setIsCreatingPin(false);
    setIsFormVisible(true);
  };

  // Handle form submission to add a pin
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newPin.type) return;

    setPins((prevPins) => [...prevPins, newPin]);

    setIsFormVisible(false);
    setNewPin({ x: 0, y: 0, type: "", icon: "", description: "" });
  };

  // Handle place selection
  const handlePlaceSelect = (selectedType) => {
    const selectedPlace = placeOptions.find((place) => place.type === selectedType);
    setNewPin((prevPin) => ({
      ...prevPin,
      type: selectedPlace.type,
      icon: selectedPlace.icon,
    }));
  };

  // Handle clicking on a pin to show details
  const handlePinClick = (pin) => {
    setSelectedPin(pin);
  };

  // Calculate the count of each place type
  const getPlaceCounts = () => {
    const counts = {};
    pins.forEach((pin) => {
      counts[pin.type] = (counts[pin.type] || 0) + 1;
    });
    return counts;
  };

  const placeCounts = getPlaceCounts();

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Drag-and-Drop Area */}
      {showUploadInput && (
        <div
          className={`bg-white p-4 rounded-lg shadow-lg w-full max-w-md text-center border-2 ${isDragging ? "border-blue-500" : "border-gray-300"
            } transition-all duration-300`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label
            htmlFor="file-input"
            className="cursor-pointer flex flex-col items-center justify-center p-6"
          >
            <span className="text-gray-600 font-medium">
              Drag & Drop an image or <span className="text-blue-500">click to upload</span>
            </span>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Cancel Button to Show Upload Input Again */}
      {!showUploadInput && (
        <Button
          onClick={() => {
            setShowUploadInput(true); // Show upload input
            setImage(null); // Clear the uploaded image
            setPins([]); // Clear all pins
          }}
          variant="secondary"
          className="w-full max-w-md"
        >
          Cancel
        </Button>
      )}

      {isCreatingPin && (
        <p className="text-blue-600 font-semibold text-lg">
          Click on the image to add a new place.
        </p>
      )}

      {/* Display the count of each place type with icons */}
      {image && pins.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-gray-600 font-medium mb-4">Places Added:</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(placeCounts).map(([type, count]) => {
              const place = placeOptions.find((p) => p.type === type);
              return (
                <div key={type} className="flex items-center gap-2">
                  <img src={place.icon} alt={type} className="w-6 h-6" />
                  <span className="text-gray-600">
                    {count} {type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {image && (
        <div className="relative w-full max-w-[650px] border-2 border-gray-300 bg-white rounded-lg shadow-lg">
          <img
            ref={imageRef}
            src={image}
            alt="Uploaded Map"
            className="w-full h-auto cursor-pointer"
            onClick={handleImageClick}
          />

          {/* Render Pins */}
          {pins.map((pin, index) => (
            <div
              key={index}
              className="absolute cursor-pointer"
              style={{
                top: `${pin.y}%`,
                left: `${pin.x}%`,
                transform: "translate(-50%, -100%)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePinClick(pin);
              }}
            >
              <img
                src={pin.icon}
                alt={pin.type}
                className="w-10 h-10 drop-shadow-lg"
              />
            </div>
          ))}

          {/* Pin Details Popup */}
          {selectedPin && (
            <div
              className="absolute bg-white p-4 border rounded-lg shadow-lg text-sm w-48"
              style={{
                top: `${selectedPin.y}%`,
                left: `${selectedPin.x}%`,
                transform: "translate(-50%, -120%)",
              }}
            >
              <button
                onClick={() => setSelectedPin(null)}
                className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <IoClose className="w-4 h-4 text-gray-600" /> {/* "X" icon */}
              </button>
              <p className="font-bold">{selectedPin.type}</p>
              {selectedPin.description && <p className="text-gray-600">{selectedPin.description}</p>}
            </div>
          )}
        </div>
      )}

      {/* Add Pin Form Dialog */}
      {isFormVisible && (
        <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
          <DialogTrigger />
          <DialogContent className="max-w-[450px]">
            <DialogHeader>Add New Place</DialogHeader>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <Label className="block text-gray-600 font-medium mb-2">Place Type:</Label>
                <IconDropdown selectedType={newPin.type} onPlaceSelect={handlePlaceSelect} />
              </div>
              <div className="mb-3">
                <Label className="block text-gray-600 font-medium mb-2">Description (optional):</Label>
                <Input
                  type="text"
                  value={newPin.description}
                  onChange={(e) => setNewPin({ ...newPin, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">
                  Save Pin
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Pin Button */}
      {image && !isCreatingPin && (
        <Button
          onClick={() => setIsCreatingPin(true)}
        >
          Add Pin
        </Button>
      )}
    </div>
  );
};

export default MapWithPins;