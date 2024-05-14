function Progress({ uploadProgress = 60, color }) {
  return (
    <div className="w-full self-stretch py-2">
      <div className="relative h-0.5 rounded-lg bg-gray-700">
        <div className={`absolute h-full rounded bg-white duration-200 ease-in-out`} style={{ width: `${uploadProgress}%` }}></div>
      </div>
    </div>
  );
}

export default Progress;
