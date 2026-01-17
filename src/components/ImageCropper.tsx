import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { X, Check, RotateCcw } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspectRatio));
  }, [aspectRatio]);

  const getCroppedImg = useCallback(async (): Promise<string> => {
    const image = imgRef.current;
    if (!image || !completedCrop) {
      throw new Error('Crop not complete');
    }

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  }, [completedCrop]);

  const handleConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg();
      onCropComplete(croppedImage);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleReset = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, aspectRatio));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-xl glass flex items-center justify-center border border-white/10"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <h2 className="text-lg font-semibold text-white">Crop Image</h2>
        <button
          onClick={handleReset}
          className="w-10 h-10 rounded-xl glass flex items-center justify-center border border-white/10"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Crop Area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspectRatio}
          circularCrop
          className="max-h-full"
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Crop preview"
            onLoad={onImageLoad}
            className="max-h-[60vh] max-w-full object-contain"
            crossOrigin="anonymous"
          />
        </ReactCrop>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 h-12 rounded-xl glass border border-white/10 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-lavender hover:opacity-90 border-0"
          >
            <Check className="w-4 h-4 mr-2" />
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
