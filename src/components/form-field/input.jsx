import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * @typedef {Object} abc
 * @property {string} labelTitle
 * @property {import('react').HTMLInputTypeAttribute | "textArea"} type
 * @property {string | {container: string, label: string, input: string }} [className]
 * @property {boolean} [isInvalid]
 */

/**
 * @param {import('react').InputHTMLAttributes | abc} props
 */

const FormInput = (props) => {
  const { className, children, isInvalid, ...attributes } = props;

  const id = attributes.id || Date.now() + Math.ceil(Math.random() * 10 ** 13 - 1);
  const [isFocused, setIsFocused] = useState(isInvalid || false);
  const labelTitle = attributes.labelTitle || 'label';
  const type = attributes.type || 'text';

  // if type is Button
  if (type === 'button') {
    return (
      <button {...attributes} className={twMerge('rounded-lg bg-white px-6 py-3 text-black', className)}>
        {children || attributes.value}
      </button>
    );
  }

  // if type is file
  if (type === 'file') {
    return (
      <div
        aria-disabled={attributes?.disabled}
        aria-hidden={attributes?.hidden}
        className={twMerge(
          'flex cursor-pointer justify-end self-end rounded-lg bg-blue-500 aria-disabled:opacity-30 aria-[hidden=true]:hidden',
          className?.container,
        )}>
        <label className={twMerge('h-full w-full px-4 py-1', className?.label, className)}>
          {children || labelTitle}
          <input {...attributes} hidden type="file" id={id} className={twMerge(className?.input)} />
        </label>
      </div>
    );
  }

  const style = {
    containerClass: twMerge('flex flex-col gap-2', className?.container),
    labelClass: twMerge('peer-invalid:text-red-500', className?.label),
    inputClass: twMerge(
      'aria-[current=true]:invalid:outline-red-500 peer focus:valid:outline-green-500 outline-none rounded-xl h-10 px-4 text-black',
      className?.input,
    ),
  };

  if (type === 'textArea') {
    return (
      <div className={style.containerClass}>
        <label className={style.labelClass} htmlFor={id}>
          {children || labelTitle}
        </label>
        <textarea
          rows={3}
          id={id}
          {...attributes}
          className={twMerge(style.inputClass, 'h-auto', className)}></textarea>
      </div>
    );
  }

  return (
    <div className={style.containerClass}>
      <label className={style.labelClass} htmlFor={id}>
        {children || labelTitle}
      </label>
      <input
        onFocus={() => setIsFocused(true)}
        aria-current={isFocused}
        className={style.inputClass}
        type={type}
        id={id}
        {...attributes}
      />
    </div>
  );
};

export default FormInput;
