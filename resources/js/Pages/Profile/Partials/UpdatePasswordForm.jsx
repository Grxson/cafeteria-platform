import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-8">
                <div>
                    <InputLabel 
                        htmlFor="current_password" 
                        value="Contraseña Actual" 
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-gray-800 focus:ring-gray-800"
                        autoComplete="current-password"
                        placeholder="Ingresa tu contraseña actual"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                        <InputLabel htmlFor="password" value="Nueva Contraseña" />

                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-gray-800 focus:ring-gray-800"
                            autoComplete="new-password"
                            placeholder="Mínimo 8 caracteres"
                        />

                        <InputError message={errors.password} className="mt-2" />
                        <p className="text-xs text-gray-500 mt-1">
                            Usa al menos 8 caracteres con letras, números y símbolos
                        </p>
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirmar Contraseña"
                        />

                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type="password"
                            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-gray-800 focus:ring-gray-800"
                            autoComplete="new-password"
                            placeholder="Repite la nueva contraseña"
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Debe coincidir con la nueva contraseña
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                    <PrimaryButton 
                        disabled={processing}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        {processing ? (
                            <>
                                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Actualizando...
                            </>
                        ) : (
                            'Actualizar Contraseña'
                        )}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center text-sm text-green-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Contraseña actualizada correctamente
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
