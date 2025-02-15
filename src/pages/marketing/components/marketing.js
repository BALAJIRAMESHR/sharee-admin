import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const BannerAndOfferUpdate = () => {
  const [mainBanner, setMainBanner] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainBannerUrl, setMainBannerUrl] = useState('');
  const [sideImages, setSideImages] = useState([]);
  const [sideImageFiles, setSideImageFiles] = useState([]);
  const [sideImageUrls, setSideImageUrls] = useState([]);
  const [content, setContent] = useState('');
  const [contentList, setContentList] = useState([]);
  const [editingContentId, setEditingContentId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/getallcontents`, {
        headers: {
          'Authorization': 'QuindlTokPATFileUpload2025#$$TerOiu$'
        }
      });
      const data = await response.json();
      
      // Separate images and text content
      const images = data.filter(item => item.image);
      const texts = data.filter(item => item.content);

      // Update state
      if (images.length > 0) {
        // Construct full URL for main banner with authorization
        const mainBannerFullUrl = `${API_BASE_URL}${images[0].image}?auth=QuindlTokPATFileUpload2025#$$TerOiu$`;
        setMainBanner(mainBannerFullUrl);
        setMainBannerUrl(images[0].image); // Keep original path for backend operations
        
        // Construct full URLs for side images with authorization
        const sideImgs = images.slice(1, 7).map(item => 
          `${API_BASE_URL}${item.image}?auth=QuindlTokPATFileUpload2025#$$TerOiu$`
        );
        setSideImages(sideImgs);
        setSideImageUrls(images.slice(1, 7).map(item => item.image)); // Keep original paths for backend operations
      }
      
      setContentList(texts);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append('file', file);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/upload',
      headers: {
        'Authorization': 'QuindlTokPATFileUpload2025#$$TerOiu$',
        'Content-Type': 'multipart/form-data'
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      console.log('Image uploaded:', response.data);
      return response.data.filePath; // Assuming the API response contains the file path in `data.filePath`
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleMainBannerUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setMainBanner(URL.createObjectURL(file));
      setMainImageFile(file);
      const url = await uploadImage(file);
      setMainBannerUrl(url);
    }
  };

  const handleSideImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    const updatedImages = [...sideImages, ...newImages].slice(0, 6);
    setSideImages(updatedImages);
    setSideImageFiles([...sideImageFiles, ...files].slice(0, 6));

    const urls = await Promise.all(files.map(file => uploadImage(file)));
    setSideImageUrls([...sideImageUrls, ...urls].slice(0, 6));
  };

  const handleRemoveSideImage = (indexToRemove) => {
    setSideImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setSideImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setSideImageUrls((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAddContent = async () => {
    if (content.trim()) {
      try {
        const response = await fetch(`${API_BASE_URL}/marketing/addcontent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: content.trim() }),
        });

        if (response.ok) {
          await fetchContent(); // Refresh the content list
          setContent('');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to add content');
        }
      } catch (error) {
        console.error('Error adding content:', error);
        alert('Failed to add content');
      }
    }
  };

  const handleAdd = async () => {
    try {
      // Upload main banner
      if (mainBannerUrl) {
        const mainBannerData = {
          image: mainBannerUrl,
        };
        await fetch(`${API_BASE_URL}/marketing/addcontent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mainBannerData),
        });
      }

      // Upload side images
      for (const sideImageUrl of sideImageUrls) {
        const sideImageData = {
          image: sideImageUrl,
        };
        await fetch(`${API_BASE_URL}/marketing/addcontent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sideImageData),
        });
      }

      // Clear the form after successful upload
      setMainBanner(null);
      setMainImageFile(null);
      setMainBannerUrl('');
      setSideImages([]);
      setSideImageFiles([]);
      setSideImageUrls([]);

      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    }
  };

  const handleRemoveContent = async (indexToRemove) => {
    try {
      // Since we don't have a delete endpoint, we'll mark it as deleted using edit
      const response = await fetch(`${API_BASE_URL}/marketing/editcontent/${editingContentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDeleted: true }),
      });

      if (response.ok) {
        await fetchContent(); // Refresh the content list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to remove content');
      }
    } catch (error) {
      console.error('Error removing content:', error);
      alert('Failed to remove content');
    }
  };

  const handleDeleteClick = (content) => {
    setContentToDelete(content);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (contentToDelete) {
      await handleRemoveContent(contentToDelete._id);
      setShowDeleteConfirm(false);
      setContentToDelete(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Banner Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Banner</h2>
        <div className="flex gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-md w-2/3 h-64 flex items-center justify-center bg-gray-100 cursor-pointer" onClick={() => document.getElementById('mainBannerUpload').click()}>
            <img 
              src={mainBanner || ''} 
              alt="Main Banner" 
              className="w-full h-full object-cover rounded-md" 
            />
            <input type="file" accept="image/*" id="mainBannerUpload" className="hidden" onChange={handleMainBannerUpload} />
          </div>

          <div className="w-1/3 grid grid-cols-3 grid-rows-2 gap-2">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index} 
                className={`
                  border-2 border-dashed border-gray-300 rounded-md 
                  h-20 flex items-center justify-center 
                  ${index < sideImages.length ? 'bg-white' : 'bg-gray-100'}
                  relative
                `}
                onClick={index === sideImages.length ? 
                  () => document.getElementById('sideImageUpload').click() : 
                  undefined
                }
              >
                {index < sideImages.length ? (
                  <>
                    <img 
                      src={sideImages[index] || ''} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover rounded-md" 
                    />
                    <button 
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSideImage(index);
                      }}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  index === sideImages.length ? (
                    <div className="text-gray-400 text-center">Add Image</div>
                  ) : null
                )}
              </div>
            ))}
            <input 
              type="file" 
              accept="image/*" 
              id="sideImageUpload" 
              multiple 
              className="hidden" 
              onChange={handleSideImageUpload} 
            />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button className="bg-purple-500 text-white w-1/2 py-2 rounded-md" onClick={handleAdd}>
            Add 
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Site & Offer Update</h2>
        <div className="flex items-center space-x-4">
          <input 
            type="text" 
            placeholder="Enter content here" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500" 
          />
          <button className="bg-purple-500 text-white px-4 py-2 rounded-md" onClick={handleAddContent}>
            Add Content
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {contentList.map((item) => (
            <div key={item._id} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md">
              <span>{item.content}</span>
              <button 
                className="text-red-500 hover:text-red-700" 
                onClick={() => handleDeleteClick(item)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button className="bg-purple-500 text-white w-1/2 py-3 rounded-md">
            Update
          </button>
        </div>
      </div>

      {/* Add the confirmation popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this content?</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setContentToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerAndOfferUpdate;