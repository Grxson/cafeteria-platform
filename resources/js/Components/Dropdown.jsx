import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { createContext, useContext, useState } from 'react';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && (
                <div
                    className="fixed inset-0 z-[9998]"
                    onClick={() => setOpen(false)}
                    style={{ zIndex: 9998 }}
                ></div>
            )}
        </>
    );
};

const Content = ({
    align = 'right',
    width = '48',
    contentClasses = 'py-1',
    children,
}) => {
    const { open, setOpen } = useContext(DropDownContext);

    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
    }

    let widthClasses = '';

    if (width === '48') {
        widthClasses = 'w-48';
    } else if (width === '56') {
        widthClasses = 'w-56';
    }

    return (
        <>
            <Transition
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    className={`absolute z-[9999] mt-2 ${alignmentClasses} ${widthClasses}`}
                    onClick={() => setOpen(false)}
                    style={{ zIndex: 9999 }}
                >
                    {/* Arrow pointer */}
                    <div className={`absolute ${align === 'right' ? 'right-4' : 'left-4'} -top-2 w-4 h-4 transform rotate-45 bg-white border-l border-t border-amber-200 shadow-sm`}></div>
                    
                    <div className="relative bg-white rounded-xl shadow-2xl border border-amber-200 overflow-hidden backdrop-blur-sm">
                        <div className={contentClasses}>
                            {children}
                        </div>
                    </div>
                </div>
            </Transition>
        </>
    );
};

const DropdownLink = ({ className = '', children, ...props }) => {
    return (
        <Link
            {...props}
            className={
                'block w-full px-4 py-3 text-start text-sm leading-5 text-gray-700 transition-all duration-150 ease-in-out hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-800 focus:bg-gradient-to-r focus:from-amber-50 focus:to-orange-50 focus:text-amber-800 focus:outline-none ' +
                className
            }
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
