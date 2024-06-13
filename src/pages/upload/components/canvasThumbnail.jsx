import { useEffect, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from 'components/form-field';
import { apiStateStatus } from 'utilities';

/**
 *
 * @param {{src: URL, status: string, handleCropImage: CallableFunction, progress: number }} param0
 * @returns
 */

const CanvasThumbnail = ({ src, status, handleCropImage, progress }) => {
  const [crop, setCrop] = useState({
    unit: '%',
    x: 0,
    y: 0,
    width: 100,
    height: 56.25,
  });

  useEffect(() => {
    if (!src) return;
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const { naturalWidth, naturalHeight } = image;
      const calculatedWidthPercent = ((naturalHeight * 1.5625) / naturalWidth) * 100;
      const calculatedHeightPercent = ((naturalWidth * 0.5625) / naturalHeight) * 100;
      const calculatedY = (100 - calculatedHeightPercent) / 2;
      const calculatedX = (100 - calculatedWidthPercent) / 2;

      if (naturalHeight >= naturalWidth * 0.5625) {
        setCrop((pre) => ({
          ...pre,
          width: 100,
          height: calculatedHeightPercent,
          y: calculatedY,
        }));
      } else {
        setCrop((pre) => ({
          ...pre,
          width: calculatedWidthPercent,
          height: 100,
          x: calculatedX,
        }));
      }
    };
  }, [src]);

  if (status === apiStateStatus.pending) {
    return (
      <div className="absolute left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-lg">
        <div className="h-32 w-32 animate-spin rounded-full border-8 border-green-500 border-l-transparent"></div>
        <div className="w-full max-w-xl">
          <p style={{ width: `${progress}%` }} className="w-full self-start rounded-xl bg-white text-center">
            {progress.toFixed(0)}
          </p>
        </div>
      </div>
    );
  }

  if (status === apiStateStatus.resolved && src) {
    return (
      <div className="absolute left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-lg">
        <ReactCrop
          crop={crop}
          onChange={(pxCrop, perCrop) => setCrop(perCrop)}
          className="flex h-fit  !max-h-[80vh] w-fit !max-w-[80vw] justify-center"
          aspect={16 / 9}
          minWidth={360}
          style={{
            color: 'red',
          }}
          onComplete={(px, percent) => setCrop(percent)}>
          <img src={src} alt="" />
        </ReactCrop>
        <Button onClick={() => handleCropImage(crop)}>Done</Button>
      </div>
    );
  }
  return null;
};

export default CanvasThumbnail;
