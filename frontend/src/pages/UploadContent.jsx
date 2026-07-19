import { useState, useRef } from 'react';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

const UploadContent = ({ topicId }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('PDF');
  const [isUploading, setIsUploading] = useState(false);

  // NEW: State to track if a user is dragging a file over the box
  const [isDragging, setIsDragging] = useState(false);

  // NEW: A reference to trigger the hidden file input when the box is clicked
  const fileInputRef = useRef(null);

  // --- STANDARD FILE SELECTION ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleDragOver = (e) => {
    e.preventDefault(); // Prevents the browser from opening the file in a new tab
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];

      // Optional safety check: ensure the file matches the selected type
      if (type === 'PDF' && !droppedFile.type.includes('pdf')) {
         return alert("Please drop a valid PDF file.");
      }
      if (type === 'VIDEO' && !droppedFile.type.includes('video')) {
         return alert("Please drop a valid Video file.");
      }

      setFile(droppedFile);
    }
  };

  // --- SUBMIT TO SPRING BOOT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("Please provide a title and select a file!");

    setIsUploading(true);

    try {
      // 1. Upload the physical file
      const formData = new FormData();
      formData.append('file', file);

            console.log("Uploading file...");
            const uploadResponse = await axiosInstance.post('/files/upload', formData);

            console.log("File uploaded successfully");

            console.log("Saving content...");

      const fileUrl = uploadResponse.data;

      // 2. Save the database record
      const newContent = {
        title: title,
        url: fileUrl,
        type: type,
        topic: { id: topicId }
      };

      await axiosInstance.post('/content', newContent);

      alert("Content successfully uploaded!");
      setFile(null);
      setTitle('');

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload content. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-lg mx-auto">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Upload New Material</h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="e.g., Chapter 1 Notes"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
          <select
            value={type}
            onChange={(e) => {
               setType(e.target.value);
               setFile(null); // Clear the file if they switch types to prevent uploading a video as a PDF
            }}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <option value="PDF">PDF Document</option>
            <option value="VIDEO">Video File</option>
          </select>
        </div>

        {/* --- THE DRAG AND DROP ZONE --- */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    // Notice we removed the onClick from here so it doesn't conflict with our new button
                    className={`mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-dashed rounded-xl transition-all duration-200
                      ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-gray-300 bg-gray-50/50 hover:bg-gray-50'}
                      ${file ? 'bg-green-50 border-green-400' : ''}
                    `}
                  >
                    <div className="space-y-3 text-center w-full">
                      {/* Dynamic Icon */}
                      <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center text-4xl mb-2">
                        {file ? '✅' : isDragging ? '📂' : '📥'}
                      </div>

                      <div className="text-sm text-gray-600">
                        {file ? (
                          <span className="font-semibold text-green-700 text-base">{file.name}</span>
                        ) : (
                          <div className="flex flex-col items-center">
                            <p className="mb-2 text-gray-600 font-medium text-base">
                              Drag & Drop your file right here
                            </p>
                            <p className="mb-4 text-xs text-gray-400 font-bold uppercase tracking-wider">
                              - or -
                            </p>

                            {/* EXPLICIT BROWSE BUTTON */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                fileInputRef.current.click(); // Triggers the hidden input below
                              }}
                              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
                            >
                              Browse Files
                            </button>
                          </div>
                        )}
                      </div>

                      {!file && (
                        <p className="text-xs text-gray-400 mt-4">
                          {type === 'PDF' ? 'Supported: PDF (up to 50MB)' : 'Supported: MP4, MKV (up to 50MB)'}
                        </p>
                      )}
                    </div>

                    {/* Hidden Input: This does the actual file picking when the button is clicked */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept={type === 'PDF' ? '.pdf' : '.mp4,.mkv,.avi'}
                      className="hidden"
                    />
                  </div>

                  {/* Allow user to remove the file if they picked the wrong one */}
                  {file && (
                    <div className="mt-3 text-right">
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-sm text-red-500 hover:text-red-700 font-bold bg-red-50 px-3 py-1 rounded-md"
                      >
                        🗑️ Remove File
                      </button>
                    </div>
                  )}
                </div>

        <button
          type="submit"
          disabled={isUploading || !file || !title}
          className={`w-full py-3 rounded-lg text-white font-bold transition-all ${
            isUploading || !file || !title ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
          }`}
        >
          {isUploading ? 'Uploading and Saving...' : 'Upload Content'}
        </button>
      </form>
    </div>
  );
};

export default UploadContent;