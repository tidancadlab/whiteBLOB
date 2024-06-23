import React from 'react';

export const StorageContext = React.createContext({
  isOnline: true,
  studioVideos: [],
  setStudioVideos() {},
});
