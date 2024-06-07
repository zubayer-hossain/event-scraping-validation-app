import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EventForm           from '@/Pages/Events/Form';
import { Head, useForm } from '@inertiajs/react';

export default function EventEdit({ auth, event }) {
    const { put } = useForm();

    const handleSubmit = (data) => {
        put(route('events.update', event.id), { data });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Event</h2>}
        >
            <Head title="Edit Event" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <EventForm event={event} onSubmit={handleSubmit} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
