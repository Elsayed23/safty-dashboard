"use client";

import { useState, useRef } from "react";
import IconDropdown from "./IconDropdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const placeOptions = [
  { type: "Bathroom", icon: "https://cdn-icons-png.flaticon.com/512/174/174902.png" },
  { type: "Restaurant", icon: "https://cdn-icons-png.flaticon.com/512/1046/1046751.png" },
  { type: "Mosque", icon: "https://cdn-icons-png.flaticon.com/512/1995/1995532.png" },
];

const MapWithPins = () => {
  const [image, setImage] = useState(null);
  const [pins, setPins] = useState([]);
  const [isCreatingPin, setIsCreatingPin] = useState(false);
  const [newPin, setNewPin] = useState({ x: 0, y: 0, type: "", icon: "", description: "" });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const imageRef = useRef(null);

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result);
      reader.readAsDataURL(file);
    }
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

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md text-center">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-3 py-2 border rounded-lg cursor-pointer"
        />
      </div>

      {isCreatingPin && (
        <p className="text-blue-600 font-semibold text-lg">
          Click on the image to add a new place.
        </p>
      )}

      {image && (
        <div className="relative w-[500px] border-2 border-gray-300 bg-white rounded-lg shadow-lg">
          <img
            ref={imageRef}
            src={image}
            alt="Uploaded Map"
            className="w-full h-auto cursor-pointer"
            onClick={handleImageClick}
          />

          {pins.map((pin, index) => (
            <img
              key={index}
              src={pin.icon}
              alt={pin.type}
              className="absolute w-8 h-8 cursor-pointer drop-shadow-lg"
              style={{
                top: `${pin.y}%`,
                left: `${pin.x}%`,
                transform: "translate(-50%, -100%)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePinClick(pin);
              }}
            />
          ))}

          {selectedPin && (
            <div
              className="absolute bg-white p-3 border rounded-lg shadow-lg text-sm w-40"
              style={{
                top: `${selectedPin.y}%`,
                left: `${selectedPin.x}%`,
                transform: "translate(-50%, -120%)",
              }}
            >
              <p className="font-bold">{selectedPin.type}</p>
              {selectedPin.description && <p className="text-gray-600">{selectedPin.description}</p>}
              <Button
                onClick={() => setSelectedPin(null)}
                className="mt-2"
                size='sm'
                variant='destructive'
              >
                Close
              </Button>
            </div>
          )}
        </div>
      )}

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

      {image && !isCreatingPin && (
        <Button
          onClick={() => setIsCreatingPin(true)}
          variant="primary"
        >
          Add Pin
        </Button>
      )}
    </div>
  );
};

export default MapWithPins;
