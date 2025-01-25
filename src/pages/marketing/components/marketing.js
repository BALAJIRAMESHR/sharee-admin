import React, { useState } from 'react';

const BannerAndOfferUpdate = () => {
  const [mainBanner, setMainBanner] = useState(null);
  const [sideImages, setSideImages] = useState([]);
  const [content, setContent] = useState('');
  const [contentList, setContentList] = useState([]);

  const handleMainBannerUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMainBanner(URL.createObjectURL(file));
    }
  };

  const handleSideImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));

    // Limit total images to 6
    const updatedImages = [...sideImages, ...newImages].slice(0, 6);
    setSideImages(updatedImages);
  };

  const handleRemoveSideImage = (indexToRemove) => {
    setSideImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAddContent = () => {
    if (content.trim()) {
      setContentList((prev) => [...prev, content]);
      setContent('');
    }
  };

  const handleRemoveContent = (indexToRemove) => {
    setContentList((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Banner Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Banner</h2>
        <div className="flex gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-md w-2/3 h-64 flex items-center justify-center bg-gray-100 cursor-pointer" onClick={() => document.getElementById('mainBannerUpload').click()}>
            {mainBanner ? (
              <img src={mainBanner} alt="Main Banner" className="w-full h-full object-cover rounded-md" />
            ) : (
              <div className="text-gray-400">Upload Main Banner</div>
            )}
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
                      src={sideImages[index]} 
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
          <button className="bg-purple-500 text-white w-1/2 py-2 rounded-md" onClick={() => alert('Images updated successfully!')}>
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
          {contentList.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md">
              <span>{item}</span>
              <button className="text-red-500 hover:text-red-700" onClick={() => handleRemoveContent(index)}>
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
    </div>
  );
};

export default BannerAndOfferUpdate;