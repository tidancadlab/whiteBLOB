import React from 'react';

export const StorageContext = React.createContext({
  isOnline: true,
  uploadFile: null,
  uploadProgressStatus: {
    completedChunk: 0,
    totalChunk: 0.000001,
    progress: 0,
    rate: 0,
  },
  videoFileMeteData: {},
  allVideoList: [],
  onUploadFile() {},
  onUploadProgressStatus({ completedChunk = 0, totalChunk = 0, progress = 0, rate = 0 }) {},
});
