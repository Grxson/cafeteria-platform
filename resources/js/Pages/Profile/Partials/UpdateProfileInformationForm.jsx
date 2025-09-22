import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { getAvatarUrl } from '@/Utils/avatarUtils';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            telefono: user.telefono || '',
            direccion: user.direccion || '',
            avatar: null,
            _method: 'patch',
        });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            
            // Crear preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setData('avatar', null);
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getDisplayAvatarUrl = () => {
        if (previewImage) return previewImage;
        return getAvatarUrl(user.avatar_url);
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-8">
                {/* Foto de Perfil */}
                <div className="text-center">
                    <div className="mb-6">
                        <div className="relative inline-block">
                            {getDisplayAvatarUrl() ? (
                                <img
                                    src={getDisplayAvatarUrl()}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-amber-200 shadow-lg"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-amber-200 shadow-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            
                            {/* Botón para cambiar avatar */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-3 shadow-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />

                    <div className="flex justify-center space-x-4">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Cambiar Foto
                        </button>
                        
                        {(getDisplayAvatarUrl() || data.avatar) && (
                            <button
                                type="button"
                                onClick={removeAvatar}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Eliminar
                            </button>
                        )}
                    </div>

                    <InputError className="mt-2 text-center" message={errors.avatar} />
                </div>

                {/* Información Personal */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="name" value="Nombre Completo" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            placeholder="Ingresa tu nombre completo"
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Correo Electrónico" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="tu@email.com"
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div>
                        <InputLabel htmlFor="telefono" value="Teléfono" />
                        <TextInput
                            id="telefono"
                            type="tel"
                            className="mt-1 block w-full"
                            value={data.telefono}
                            onChange={(e) => setData('telefono', e.target.value)}
                            autoComplete="tel"
                            placeholder="+52 123 456 7890"
                        />
                        <InputError className="mt-2" message={errors.telefono} />
                        <p className="text-xs text-gray-500 mt-1">Opcional - Para contacto en pedidos</p>
                    </div>

                    <div>
                        <InputLabel htmlFor="direccion" value="Dirección" />
                        <textarea
                            id="direccion"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring-amber-500"
                            rows="3"
                            value={data.direccion}
                            onChange={(e) => setData('direccion', e.target.value)}
                            autoComplete="address"
                            placeholder="Calle, número, colonia, ciudad..."
                        />
                        <InputError className="mt-2" message={errors.direccion} />
                        <p className="text-xs text-gray-500 mt-1">Opcional - Para entrega de pedidos</p>
                    </div>
                </div>

                {/* Verificación de Email */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                            <div>
                                <p className="text-sm text-yellow-800 font-medium">
                                    Tu correo electrónico no está verificado.
                                </p>
                                <p className="text-sm text-yellow-700">
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="underline hover:text-yellow-900 font-medium"
                                    >
                                        Haz clic aquí para reenviar el correo de verificación.
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {status === 'verification-link-sent' && (
                            <div className="mt-3 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-md">
                                Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                            </div>
                        )}
                    </div>
                )}

                {/* Botones de Acción */}
                <div className="flex items-center gap-4 pt-4 border-t border-amber-200">
                    <PrimaryButton 
                        disabled={processing}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                        {processing ? (
                            <>
                                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Guardando...
                            </>
                        ) : (
                            'Actualizar Perfil'
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
                            Perfil actualizado correctamente
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
