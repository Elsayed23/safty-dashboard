'use client'
import React, { useState } from 'react';

const ImageUpload = ({ onImageUpload }) => {
    const [image, setImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                onImageUpload(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && <img src={image} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '10px' }} />}
        </div>
    );
};

export default ImageUpload;