import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";

function App() {
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [imageBlob, setImageBlob] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = (event) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
  
      const ripple = document.createElement("div");
      ripple.classList.add("ripple-effect");
  
      ripple.style.left = `${rect.left + rect.width / 2}px`;
      ripple.style.top = `${rect.top + rect.height / 2}px`;
  
      document.body.appendChild(ripple);
  
      // Toggle dark mode
      setDarkMode((prevMode) => !prevMode);
      document.documentElement.classList.toggle("dark");
  
      setTimeout(() => {
          ripple.remove();
      }, 1000);
  };
  

    const sampleImages = [
        "/sample1.jpg",
        "/sample2.jpg",
        "/sample3.jpg",
    ];

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setErrorMessage("");
        setImageUrl("");
    };

    const handleUpload = async (fileToUpload) => {
        if (!fileToUpload && !file) {
            setErrorMessage("Please select an image first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileToUpload || file);

        try {
            const response = await axios.post(
                "http://127.0.0.1:5000/upload",
                formData,
                { responseType: "blob" }
            );

            const blob = new Blob([response.data], { type: "image/jpeg" });
            setImageBlob(blob);
            setImageUrl(URL.createObjectURL(blob));
        } catch (error) {
            console.error("Error uploading image:", error);
            setErrorMessage("Something went wrong. Please try again.");
        }
    };

    const handleSampleClick = (sampleUrl) => {
        fetch(sampleUrl)
            .then((res) => res.blob())
            .then((blob) => handleUpload(blob))
            .catch((err) => {
                console.error("Error loading sample image:", err);
                setErrorMessage("Failed to load the sample image.");
            });
    };

    return (
        <div className={`${darkMode ? "dark" : ""}`}>
            <Header />
            <main className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="absolute top-4 right-4">
            <button
                onClick={(e) => toggleDarkMode(e)}
                className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold py-2 px-4 rounded"
            >
                {darkMode ? "Light" : "Dark"}
            </button>
        </div>
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                        Upload an Image
                    </h2>
                    <div className="mb-4">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 dark:text-gray-300 
                                   file:mr-4 file:py-2 file:px-4 
                                   file:rounded-full file:border-0 
                                   file:text-sm file:font-semibold 
                                   file:bg-blue-50 dark:file:bg-blue-700 file:text-blue-700 dark:file:text-blue-200
                                   hover:file:bg-blue-100 dark:hover:file:bg-blue-600"
                        />
                    </div>
                    <button
                        onClick={() => handleUpload(null)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        Upload Image
                    </button>

                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Try Our Sample Images
                        </h2>
                        <div className="flex space-x-4 mt-4">
                            {sampleImages.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Sample ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded cursor-pointer hover:ring-2 hover:ring-blue-500"
                                    onClick={() => handleSampleClick(url)}
                                />
                            ))}
                        </div>
                    </div>

                    {errorMessage && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-4">
                            {errorMessage}
                        </p>
                    )}
                    {imageUrl && (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Processed Image:
                            </h2>
                            <img
                                src={imageUrl}
                                alt="Processed"
                                className="mt-4 rounded shadow-md w-full"
                            />
                            <a
                                href={URL.createObjectURL(imageBlob)}
                                download="processed-image.jpg"
                                className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                            >
                                Download Image
                            </a>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
