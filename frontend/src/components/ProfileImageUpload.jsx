import React, { useState } from 'react';
import API from '../axiosConfig';

function ProfileImageUpload({ currentImage, onUpdate }) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('profile_image', selectedFile);

        API.post('profile/image/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                onUpdate(response.data.profile_image); //プロフィール画像の更新
                alert('Profile image updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating profile image:', error);
            });
    };

    return (
        <div>
            <h3>Upload Profile Image</h3>
            <img src={currentImage} alt="Profile" style={{ width: '150px', height: '150px', borderRedius: '50%' }} />
            <form onSubmit={handleSubmit}>
                <input
                    type='file'
                    onChange={handleFileChange}
                    accept='image/*'
                />
                <button type='submit'>Upload</button>
            </form>
        </div>
    );
}

export default ProfileImageUpload;