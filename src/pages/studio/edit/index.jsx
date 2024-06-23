import { Button, Input, Radio } from 'components/form-field';
import { useState } from 'react';
import { apiStateStatus } from 'utilities';

function StudioEdit() {
  const [apiUploadStatus, setApiUploadStatus] = useState('');
  const [formData, setFormData] = useState({title: '', category: 'movie', tags: [], description: '' });
  return (
    <div className="grow">
      <form className="flex flex-col gap-4 bg-white">
        <Input name="title" required value={formData.title}>
          Title
        </Input>
        <Input name="description" type="textArea">
          Description
        </Input>
        <p className="-mb-2">Category</p>
        <div className="flex gap-4 overflow-x-auto p-2">
          {['movie'].map((value, index) => (
            <Radio
              key={value.id}
              checked={formData.category === value.title}
              aria-checked={formData.category === value.title}
              className="select-none duration-100 ease-in-out disabled:outline-none peer-checked:outline peer-hover:outline-2 disabled:peer-active:outline-8"
              name="category"
              id={value.id}
              value={value.title}
              required>
              {value.title}
            </Radio>
          ))}
        </div>
        <Input value={formData.tags.join(' ')} name="tags" type="textArea">
          Tags (put space after every tag){' '}
        </Input>
        <div className="flex items-center justify-end gap-4">
          <div className="flex gap-4 self-end">
            {apiUploadStatus === apiStateStatus.initial && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                }}
                type="submit">
                Upload
              </Button>
            )}
            {apiUploadStatus === apiStateStatus.rejected && <Button>Start</Button>}
            <Button type="button" disabled={apiUploadStatus !== apiStateStatus.pending} className="bg-red-500">
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default StudioEdit;
