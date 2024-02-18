import React, { useState } from 'react';

const VideoUploadPage = () => {
    const [videoData, setVideoData] = useState({
        title: '',
        thumbnail: '',
        description: '',
        tags: '',
    });

    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [errors, setErrors] = useState({
        title: '',
        file: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVideoData({
            ...videoData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setErrors({
            ...errors,
            file: '',
        });
    };

    const handleUpload = async () => {
        setUploadProgress(0)
        setUploadStatus(null)
        // Perform required validation
        let validationErrors = {};
        if (videoData.title.trim() === '') {
            validationErrors.title = 'Title is required';
        }
        if (!file) {
            validationErrors.file = 'Video file is required';
        }
        if (videoData.description.trim() === '') {
            validationErrors.description = 'Description is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', videoData.title);
            formData.append('thumbnail', videoData.thumbnail);
            formData.append('description', videoData.description);
            formData.append('tags', videoData.tags);

            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener('progress', (event) => {
                console.log(event);     
                setUploadStatus({ success: true, message: `${event.loaded / 1024000 } mb / ${event.total / 1024000} mb - Uploading...` })
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(progress);
                }
            });

            // Handle successful upload
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    console.log(JSON.parse(xhr.response))
                    setUploadStatus({ success: true, message: JSON.parse(xhr.response).message });
                } else {
                    setUploadStatus({ success: false, message: 'Upload failed. Please try again.' });
                }
            });

            // Handle upload errors
            xhr.addEventListener('error', () => {
                setUploadStatus({ success: false, message: 'Upload failed. Please try again.' });
            });

            xhr.open('POST', `${process.env.REACT_APP_SERVER_URL}/api/upload`, true);
            xhr.send(formData);
        } catch (error) {
            setUploadStatus({ success: false, message: 'Upload failed. Please try again.' });
        }
    };

    return (
        <div className='grow p-4'>
            <div className="container mx-auto mt-8 p-4 max-w-xl px-4 bg-white">
                <h2 className="text-2xl font-semibold mb-4">Video Upload</h2>
                {uploadStatus && (
                    <div className={`mt-4 p-2 ${uploadStatus.success ? 'bg-green-200' : 'bg-red-200'} rounded text-gray-800`}>
                        {uploadStatus.message}
                    </div>
                )}
                {uploadProgress > 0 && (
                    <div className="mt-4">
                        <p className="mb-2 text-gray-700">Upload Progress: {uploadProgress}%</p>
                        <div className="bg-gray-300 h-4 relative rounded">
                            <div
                                className={`bg-blue-500 absolute h-full rounded`}
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
                <div>
                    <label className="block mb-2 text-gray-700" htmlFor="title">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={videoData.title}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded mb-4`}
                    />
                    {errors.title && <p className="text-red-500 text-sm -mt-4 ">{errors.title}</p>}
                </div>
                <div>
                    <label className="block mb-2 text-gray-700" htmlFor="thumbnail">
                        Thumbnail URL:
                    </label>
                    <input
                        type="text"
                        id="thumbnail"
                        name="thumbnail"
                        value={videoData.thumbnail}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-gray-700" htmlFor="description">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={videoData.description}
                        onChange={handleChange}
                        rows="4"
                        className={`w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded mb-4`}
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm -mt-4 ">{errors.description}</p>}
                </div>
                <div>
                    <label className="block mb-2 text-gray-700" htmlFor="tags">
                        Tags:
                    </label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={videoData.tags}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-gray-700" htmlFor="file">
                        Video File:
                    </label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        accept='video/*'
                        onChange={handleFileChange}
                        className={`mb-4 ${errors.file ? 'border-red-500' : ''}`}
                    />
                    {errors.file && <p className="text-red-500 text-sm -mt-4 ">{errors.file}</p>}
                </div>
                <button
                    type="button"
                    onClick={handleUpload}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
                >
                    Upload
                </button>

            </div>
        </div>
    );
};

export default VideoUploadPage;
