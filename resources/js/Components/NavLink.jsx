import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-amber-500 text-amber-700 focus:border-amber-600'
                    : 'border-transparent text-gray-600 hover:border-amber-300 hover:text-amber-600 focus:border-amber-300 focus:text-amber-600') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
