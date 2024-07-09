'use client'
// components/MapWithPins.js
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import IconDropdown from './IconDropdown'; // Ensure correct import
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Fix default icon issues with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png',
});

const MapWithPins = () => {

    const { user } = useAuth()


    const [pins, setPins] = useState([]);
    const [isCreatingPin, setIsCreatingPin] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newPin, setNewPin] = useState({ lat: 0, lng: 0, icon: '', name: '', data: '', userId: user?.id });
    const [selectedPin, setSelectedPin] = useState(null);

    useEffect(() => {
        // Fetch all pins on component mount
        const fetchPins = async () => {
            try {
                const response = await axios.get('/api/pins');
                setPins(response.data);
            } catch (error) {
                console.error('Error fetching pins:', error);
            }
        };

        fetchPins();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPin((prevPin) => ({ ...prevPin, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsFormVisible(false);
        setIsCreatingPin(true);
    };

    const handleIconSelect = (iconUrl) => {
        setNewPin((prevPin) => ({ ...prevPin, icon: iconUrl }));
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: async (e) => {
                if (isCreatingPin) {
                    const updatedPin = { ...newPin, lat: e.latlng.lat, lng: e.latlng.lng };
                    setNewPin(updatedPin);
                    setIsCreatingPin(false);

                    try {
                        const { data } = await axios.post('/api/pins', updatedPin);
                        setPins(data);
                    } catch (error) {
                        console.error('Error saving pin:', error);
                    }
                }
            },
        });
        return null;
    };

    const createCustomIcon = (iconUrl) => {
        return new L.Icon({
            iconUrl: iconUrl || 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });
    };

    const closeSelectedPin = () => {
        setSelectedPin(null);
    };

    return (
        <div className="flex flex-col items-center">
            <Button onClick={() => { setIsFormVisible(prev => !prev) }} className={`self-start mb-5 ${isFormVisible && 'bg-red-600 hover:bg-red-500'}`}>
                {
                    !isFormVisible
                        ?
                        'Add Pin'
                        :
                        'Cancel'
                }
            </Button>
            {isFormVisible && (
                <form onSubmit={handleFormSubmit} className="mb-4 flex flex-col gap-5">
                    <div>
                        <Label className='text-slate-600'>
                            Icon:
                        </Label>
                        <IconDropdown selectedIcon={newPin.icon} onIconSelect={handleIconSelect} />
                    </div>
                    <div>
                        <Label className='text-slate-600'>
                            Name:
                        </Label>
                        <Input type="text" name="name" value={newPin.name} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label className='text-slate-600'>
                            Description:
                        </Label>
                        <Input type="text" name="data" value={newPin.data} onChange={handleInputChange} />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                        Place Pin
                    </button>
                </form>
            )}
            <MapContainer
                center={[30.0444, 31.2357]}
                zoom={13}
                style={{ height: '500px', width: '100%', cursor: isCreatingPin ? 'pointer' : 'default' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler />
                {pins.length > 0 && pins.map((pin, index) => (
                    <Marker
                        key={index}
                        position={[pin.lat, pin.lng]}
                        icon={createCustomIcon(pin.icon)}
                        eventHandlers={{
                            click: () => {
                                setSelectedPin(pin);
                            },
                        }}
                    >
                        <Popup>
                            <h2>{pin.name}</h2>
                            <p>{pin.data}</p>
                            <p>Added by: {pin.user.name}</p>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            {/* {selectedPin && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg text-center">
                        <h2 className="text-2xl mb-2">{selectedPin.name}</h2>
                        <p className="mb-4">{selectedPin.data}</p>
                        <p>Added by: {selectedPin.user.name}</p>
                        <button onClick={closeSelectedPin} className="px-4 py-2 bg-blue-500 text-white rounded">
                            Close
                        </button>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default MapWithPins;
