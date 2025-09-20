import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'w-full rounded-xl border-2 border-amber-200 bg-white/80 px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm transition duration-300 ease-in-out focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 hover:border-amber-300 hover:bg-white ' +
                className
            }
            ref={localRef}
        />
    );
});
