import protectedApi from 'api/protected.api';

/**
 *
 * @param {{
 * id: string,
 * chunk: Array,
 * file: File,
 * fileName: string,
 * hasMetaData: boolean,
 * isLast: boolean,
 * controller: AbortController,
 * onProgress: import('react').Dispatch<import('react').SetStateAction>
 * }}
 * @returns {Promise<import('axios').AxiosResponse>}
 */

export const uploadVideo = async ({ id, chunk, file, fileName, controller, body, isLast, onProgress }) => {
  const formData = new FormData();
  formData.append('id', id);
  formData.append('video', chunk, fileName);
  formData.append('isTail', !!isLast);

  if (file) {
    const { lastModified, size } = file;
    console.log(file);
    formData.append('lastModified', lastModified);
    formData.append('size', size);
  }

  if (body) {
    const { thumbnail, title, tags, category, description } = body;
    formData.append('title', title);
    formData.append('tags', tags);
    formData.append('category', category);
    formData.append('description', description);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail.split(',')[1]);
    }
  }

  const response = await protectedApi.post(`api/upload`, formData, {
    signal: controller.signal,
    onUploadProgress: (e) => {
      console.log(e);
      onProgress((previous) => ({
        ...previous,
        ...e,
        rate: e.rate || previous.rate,
      }));
    },
  });

  return response;
};
