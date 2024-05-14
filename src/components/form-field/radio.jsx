import { twMerge } from 'tailwind-merge'

/**
 * @typedef {Object} abc
 * @property {string} label
 * @property {string} [id]
 * @property {string | {container: string, label: string, input: string }} [className]
 */


/**
 * @param {import('react').InputHTMLAttributes | abc} props
 */

const FormRadio = (props) => {
    const { label = "label", id = Date.now() + Math.ceil(Math.random() * 10 ** 13 - 1), className, children, ...rest } = props
    const style = {
        containerClass: twMerge("flex gap-2", className?.container),
        labelClass: twMerge("peer hidden", className?.label),
        inputClass: twMerge("peer-checked:bg-[rgb(79,70,229)] px-3 py-2 focus:outline outline-offset-2 outline-[rgb(79,70,229)] rounded-xl border border-gray-700 cursor-pointer peer-checked:border-[rgb(79,70,229)]", className?.input)
    }

    return (
        <div className={style.containerClass}>
            <input
                className={style.labelClass}
                id={id}
                {...rest}
                type="radio"
            />
            <label
                role="textbox"
                className={twMerge(style.inputClass, className)}
                htmlFor={id}
            >
                {children || label}
            </label>
        </div>
    )
}

export default FormRadio