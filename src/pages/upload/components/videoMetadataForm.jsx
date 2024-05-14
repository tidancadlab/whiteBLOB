import { apiStateStatus } from 'utilities';
import protectedApi from 'api/protected.api';
import { Button, Input, Radio } from 'components/form-field';
import { useState } from 'react';
import { Alert } from 'components/alert';

const category = [
  { id: 0, title: 'Movie' },
  { id: 1, title: 'Show' },
  { id: 2, title: 'Other' },
];

const VideoMetadataForm = ({ file }) => {
  const [isHidden, setIsHidden] = useState(true);
  const [activeEdit, setActiveEdit] = useState(false);
  const [apiStatus, setApiStatus] = useState(apiStateStatus.initial);

  const [formData, setFormData] = useState({
    title: file.name.split('.')[0],
    description: '',
    category: category[0].title,
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const onSubmitMetadata = async (e) => {
    e.preventDefault();
    setApiStatus(apiStateStatus.pending);
    try {
      formData.id = file.id;

      const response = await protectedApi.post('api/video/metadata', formData, {
        onUploadProgress: (e) => {
          console.log(e);
        },
      });
      if (response.status === 200) {
        setApiStatus(apiStateStatus.resolved);
        setActiveEdit(false);
      } else {
        setApiStatus(apiStateStatus.rejected);
      }
    } catch (error) {
      setApiStatus(apiStateStatus.rejected);
      console.log(error);
    }
  };

  return (
    <div
      aria-disabled={isHidden}
      className="relative h-full w-full overflow-hidden rounded-2xl bg-gray-800 px-6 aria-disabled:h-8 aria-disabled:bg-transparent">
      <div className=" p-4 py-8 font-mono text-white">
        <form className="flex flex-col gap-4" onSubmit={onSubmitMetadata}>
          <Input onChange={onInputChange} disabled={!activeEdit} name="title" required value={formData.title}>
            Title
          </Input>
          <Input
            onChange={onInputChange}
            disabled={!activeEdit}
            name="description"
            type="textArea"
            className="p-2"
            value={formData.description}>
            Description
          </Input>
          <p className="-mb-2">Category</p>
          <div className="flex gap-4">
            {category.map((value, index) => (
              <Radio
                key={value.id}
                onChange={onInputChange}
                disabled={!activeEdit}
                checked={formData.category === value.title}
                aria-checked={formData.category === value.title}
                className="select-none duration-100 ease-in-out peer-checked:outline disabled:outline-none peer-hover:outline-2 disabled:peer-active:outline-8"
                name="category"
                id={value.id}
                value={value.title}
                required>
                {value.title}
              </Radio>
            ))}
          </div>
          <div className="flex items-center justify-end gap-4">
            <Alert hidden={apiStatus !== apiStateStatus.rejected} type="error">
              Something went wrong! Please try again.
            </Alert>
            <div className="flex gap-4 self-end">
              {activeEdit && (
                <Button
                  aria-busy={apiStateStatus.pending === apiStatus}
                  disabled={apiStateStatus.pending === apiStatus}
                  className="aria-busy:animate-pulse"
                  type="submit">
                  Save
                </Button>
              )}
              {!activeEdit && (
                <Button className="bg-green-500" type="button" onClick={() => setActiveEdit(true)}>
                  Edit
                </Button>
              )}
              <Button
                type="button"
                disabled={apiStateStatus.pending === apiStatus}
                onClick={() => {
                  setFormData({
                    title: file.name.split('.')[0],
                    category: category[0].title,
                    description: '',
                  });
                }}
                className="bg-red-500">
                Reset
              </Button>
            </div>
          </div>
        </form>
      </div>
      <Button
        aria-selected={isHidden}
        className="absolute right-8 top-0 rounded-b bg-indigo-500 text-white ease-in-out aria-selected:right-0 aria-selected:h-full aria-selected:w-full aria-selected:duration-200"
        onClick={() => {
          setIsHidden((previous) => !previous);
        }}>
        {isHidden ? 'Show' : 'Hide'}
      </Button>
    </div>
  );
};

export default VideoMetadataForm;
