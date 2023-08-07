import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from '@/components/AuthContext.js';

const AddItem = () => {
    const storage = getStorage();
    const router = useRouter();
    const { getToken } = useAuth();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);


    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
        setImagePreview(URL.createObjectURL(selectedImage));
    };

    const uploadImageAndGetDownloadURL = (file) => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');

                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    // Handle unsuccessful uploads
                    console.error('Upload error:', error);
                    reject(error);
                },
                () => {
                    // Handle successful uploads on complete
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then(resolve)
                        .catch(reject);
                }
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const downloadURL = await uploadImageAndGetDownloadURL(image);
            const token = await getToken();
            console.log("got token");
            // Make the fetch call to add the item to the database
            const response = await fetch(
                'http://localhost:5001/addItem',
                // 'https://bakery-project-production.up.railway.app/addItem',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    },
                    body: JSON.stringify({
                        name: name,
                        price: price,
                        description: description,
                        image: downloadURL, // Use the downloadURL directly here
                    }),
                });

            const data = await response.json();
            router.push('/menu');
        } catch (error) {
            console.error('Error:', error);
            // Handle any errors that may occur during the process
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={name} onChange={handleNameChange} />

            <label htmlFor="price">Price</label>
            <input type="text" id="price" value={price} onChange={handlePriceChange} />

            <label htmlFor="description">Description:</label>
            <input type="text" id="description" value={description} onChange={handleDescriptionChange} />

            <label htmlFor="image">Image:</label>
            <input type="file" id="image" onChange={handleImageChange} />

            {imagePreview && <img src={imagePreview} alt="Preview" />}

            <button type="submit">Add Item</button>
        </form>
    );
}

export default AddItem;
