function VideoSelect({ setFile, ...rest }) {
  return (
    <div className="flex justify-end gap-3">
      <label aria-disabled={rest?.disabled} className="cursor-pointer rounded-lg bg-blue-500 px-4 py-1 aria-disabled:cursor-default aria-disabled:hidden">
        <p>Select file</p>
        <input
          {...rest}
          type="file"
          accept="video/*, .mkv"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          name="file"
          hidden
          id="file"
        />
      </label>
    </div>
  );
}

export default VideoSelect;
