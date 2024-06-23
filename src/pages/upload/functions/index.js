/**
 * @callback urlCallback
 * @param {string} url
 */

import axios from 'axios';

const imageColorStorage = {};

/**
 *
 * @param {import("react-image-crop").Crop | import("react-image-crop").PercentCrop} cropDimension
 * @param {string} imageUrl
 */
export const offscreenCanvasImageCrop = (cropDimension, imageUrl, callback) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageUrl;
    image.setAttribute('crossorigin', 'anonymous');
    image.onload = async () => {
      let x, y, width, height;
      const { naturalWidth, naturalHeight } = image;

      switch (cropDimension.unit) {
        case '%':
          x = (cropDimension.x / 100) * naturalWidth;
          y = (cropDimension.y / 100) * naturalHeight;
          width = (cropDimension.width / 100) * naturalWidth;
          height = (cropDimension.height / 100) * naturalHeight;
          break;
        default:
          x = cropDimension.x;
          y = cropDimension.y;
          width = cropDimension.width;
          height = cropDimension.height;
          break;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = Math.min(height, 1080);
      canvas.width = Math.min(width, 1920);
      ctx.drawImage(image, x, y, width, height, 0, 0, canvas.width, canvas.height);

      const url = canvas.toDataURL('image/jpeg');
      resolve(url);
    };
    image.onerror = () => reject(new Error('Something went wrong in crop image'));
  });
};

/**
 *
 * @param {File} file
 * @returns {Promise<string>}
 */

export const handleReadImageFile = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error(''));
    const videoFile = new FileReader();

    videoFile.onload = (e) => {
      const buffer = e.target.result;
      const videoBlob = new Blob([new Uint8Array(buffer)], { type: file.type });
      const url = window.URL.createObjectURL(videoBlob);
      const image = new Image();
      image.src = url;
      image.onload = () => {
        if (image.width < 360) return reject(new Error('File should be minimum 360 px width'));
        if (image.height < 202) return reject(new Error('File should be minimum 202 px height'));
        resolve(url);
      };
    };
    videoFile.onerror = (e) => reject(e);
    videoFile.onprogress = (e) => onProgress(e.loaded / e.total);
    videoFile.readAsArrayBuffer(file);
  });
};

/**
 *
 * @param {URL} url
 * @returns {Promise<string>}
 */

export const handleReadImageURL = async (url, onProgress) => {
  return new Promise(async (resolve, reject) => {
    if (!url) return reject(new Error('one parameter required'));
    const res = await axios({
      url,
      onDownloadProgress(e) {
        onProgress((e.loaded / e.total) * 100);
      },
      responseType: 'blob',
    });

    const image = new Image();
    url = URL.createObjectURL(res.data);
    image.src = URL.createObjectURL(res.data);
    image.onload = () => {
      if (image.width < 360) return reject(new Error('File should be minimum 360 px width'));
      if (image.height < 202) return reject(new Error('File should be minimum 202 px height'));
      resolve(url);
      return;
    };
    image.onerror = (e) => {
      reject(new Error('Something went wrong, Please check link'));
    };
  });
};

export async function dataURItoBlob(dataURI) {
  try {
    const [header, body] = dataURI.split(',');
    const type = header.split(/:|;/)[1];
    const binary = atob(body);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type });
    const arrayBuffer = await blob.arrayBuffer();
    return arrayBuffer;
  } catch (error) {
    console.error(error);
  }
}

export function dataURItoArrayBuffer(dataURI) {
  try {
    const regex = /^data:.+\/(.+);base64,(.*)$/;

    const matches = dataURI.match(regex);
    const ext = matches[1];
    const data = matches[2];
    const buffer = window.Buffer.from(data, 'base64');
    console.log(buffer);
    return { ext, data };
  } catch (error) {
    console.error(error);
  }
}

// TODO: new feature - grab 3 image from selected video for thumbnail

/**
 *
 * @param {string} url
 */
export const imageToColor = async (url, cb) => {
  if (imageColorStorage[url]) {
    cb(imageColorStorage[url]);
    return;
  }
  const image = new Image();
  image.src = url;
  image.setAttribute('crossorigin', 'anonymous');
  image.onload = async () => {
    const { naturalWidth, naturalHeight } = image;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = naturalHeight;
    canvas.width = naturalWidth;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    // Get the pixel data
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // Get the average color
    const averageColor = [0, 0, 0];
    let count = 0;
    for (let i = 0; i < pixelData.length; i += 4) {
      if (pixelData[i] < 25 || pixelData[i + 1] < 25 || pixelData[i + 2] < 25) {
        continue;
      }
      averageColor[0] += pixelData[i];
      averageColor[1] += pixelData[i + 1];
      averageColor[2] += pixelData[i + 2];
      count++;
    }

    const hexColor = '#' + averageColor.map((x) => (~~(x / count)).toString(16)).join('');
    imageColorStorage[url] = hexColor;
    cb(hexColor);
  };
};
