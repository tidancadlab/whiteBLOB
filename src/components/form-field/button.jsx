const { twMerge } = require("tailwind-merge")

/**
 * @typedef {Object} abc
 * @property {string} [className]
 */


/**
 * @param {import('react').ButtonHTMLAttributes | abc} props
 */
const FormButton = (props) => {
    const { className, children, ...rest } = props

    return (
        <button {...rest} className={twMerge("flex items-center justify-center bg-blue-500 disabled:opacity-30 h-6 w-14 rounded text-white font-semibold text-xs", className)}>{children || rest.value}</button>
    )
}

export default FormButton