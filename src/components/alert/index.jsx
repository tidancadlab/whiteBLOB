import { Button } from 'components/form-field';
import { MdDangerous } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';

const colors = { error: 'text-red-700', warning: 'text-yellow-700', info: 'text-blue-700', success: 'text-green-700' };
const bgColor = { error: 'bg-red-200', warning: 'bg-yellow-200', info: 'bg-blue-200', success: 'bg-green-200' };
const buttonBgColor = { error: 'bg-red-500', warning: 'bg-yellow-500', info: 'bg-blue-500', success: 'bg-green-500' };

/**
 *
 * @param {import('react').HTMLAttributes | {message: string, type: "error" | "info" | "warning" | "success",
 *  button: "retry" | "again" | "wait" | "close",
 * className: string | {button: string}}}
 * @returns
 */

export const Alert = ({ type = 'error', className, button: buttonTitle, ...rest }) => {
  let textColor = colors[type] || 'text-black';
  let backgroundColor = bgColor[type] || 'bg-white';
  let buttonBackgroundColor = buttonBgColor[type] || 'bg-black';

  const Icons = () => {
    if (type === 'error') {
      return <MdDangerous className="h-6 w-8 text-5xl" />;
    }
  };

  return (
    !rest?.hidden && (
      <p
        role="alert"
        title={rest?.message || rest?.children}
        className={twMerge(
          'flex w-full justify-between gap-4 rounded-xl bg-red-200 px-4 py-2 text-white',
          textColor,
          backgroundColor,
          rest?.className,
        )}>
        <span className="flex items-center gap-2 ">
          <Icons /> <span className="line-clamp-1 text-sm ">{rest?.message || rest?.children}</span>
        </span>
        {buttonTitle && (
          <Button {...rest} className={twMerge('w-fit px-4 uppercase', buttonBackgroundColor, className?.button)}>
            {buttonTitle}
          </Button>
        )}
      </p>
    )
  );
};
