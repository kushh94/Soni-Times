import React, { useState } from 'react';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { useCapacitor } from '../hooks/useCapacitor';

interface MobileImagePickerProps {
  onImageSelected: (imageData: string) => void;
  currentImage?: string;
  disabled?: boolean;
}

export function MobileImagePicker({ onImageSelected, currentImage, disabled = false }: MobileImagePickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isNative, takePicture, selectImage } = useCapacitor();

  const handleTakePhoto = async () => {
    if (!isNative) return;
    
    try {
      setIsLoading(true);
      const imageData = await takePicture();
      if (imageData) {
        onImageSelected(imageData);
      }
    } catch (error) {
      console.error('Failed to take photo:', error);
      alert('Failed to take photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPhoto = async () => {
    if (!isNative) return;
    
    try {
      setIsLoading(true);
      const imageData = await selectImage();
      if (imageData) {
        onImageSelected(imageData);
      }
    } catch (error) {
      console.error('Failed to select photo:', error);
      alert('Failed to select photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onImageSelected(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (currentImage) {
    return (
      <div className="relative">
        <img
          src={currentImage}
          alt="Selected product"
          className="w-full h-48 object-cover rounded-xl"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {isNative ? (
            <>
              <button
                type="button"
                onClick={handleTakePhoto}
                disabled={disabled || isLoading}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg disabled:opacity-50"
              >
                <Camera size={16} />
              </button>
              <button
                type="button"
                onClick={handleSelectPhoto}
                disabled={disabled || isLoading}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg disabled:opacity-50"
              >
                <ImageIcon size={16} />
              </button>
            </>
          ) : (
            <label className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg cursor-pointer">
              <Upload size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleWebUpload}
                className="hidden"
                disabled={disabled}
              />
            </label>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          {isNative ? (
            <>
              <button
                type="button"
                onClick={handleTakePhoto}
                disabled={disabled || isLoading}
                className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-50"
              >
                <Camera size={24} className="text-blue-600" />
                <span className="text-sm text-blue-600">Take Photo</span>
              </button>
              <button
                type="button"
                onClick={handleSelectPhoto}
                disabled={disabled || isLoading}
                className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors disabled:opacity-50"
              >
                <ImageIcon size={24} className="text-green-600" />
                <span className="text-sm text-green-600">Select Photo</span>
              </button>
            </>
          ) : (
            <label className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
              <Upload size={24} className="text-gray-600" />
              <span className="text-sm text-gray-600">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleWebUpload}
                className="hidden"
                disabled={disabled}
              />
            </label>
          )}
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
}