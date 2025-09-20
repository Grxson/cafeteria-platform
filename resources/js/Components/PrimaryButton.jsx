export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 ease-in-out hover:from-amber-700 hover:to-orange-700 hover:shadow-xl hover:-translate-y-0.5 focus:from-amber-700 focus:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:from-amber-800 active:to-orange-800 transform ${
                    disabled && 'opacity-50 cursor-not-allowed hover:transform-none'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
