import { twMerge } from 'tailwind-merge';

/**
 *
 * @param {{
 * progress: number
 * } | import('react').AllHTMLAttributes} props
 * @returns
 */

function Progress(props) {
  const { progress, isPlayer, ...rest } = props;
  return (
    <div {...rest} className={twMerge('w-full self-stretch py-2', rest.style?.container)}>
      <div className={twMerge('relative h-0.5 rounded-lg bg-gray-700', rest.className)}>
        <div className={`absolute h-full rounded bg-white`} style={{ width: `${progress || 0}%` }}>
          {isPlayer && <div className="absolute -right-2 h-4 w-4 rounded-full bg-white top-1/2 -translate-y-1/2"></div>}
        </div>
      </div>
    </div>
  );
}

export default Progress;
