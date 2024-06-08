import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EventForm from '@/Pages/Events/Form';
import { Head, useForm, router } from '@inertiajs/react';

export default function EventEdit({ auth, event }) {
    const { data, setData, put, processing, errors } = useForm({
        name: event.name || '',
        url: event.url || '',
        country: event.country || '',
        document: event.document || '',
        source_type: event.source_type || '',
        reference_selector: event.reference_selector || '',
        horizon_scanning: event.horizon_scanning || false,
        source_selectors: {
            container: event.source_selectors?.container || '',
            link: event.source_selectors?.link || '',
            title: event.source_selectors?.title || '',
            description: event.source_selectors?.description || '',
            date: event.source_selectors?.date || '',
            remove_text_from_date: event.source_selectors?.remove_text_from_date || '',
            date_format: event.source_selectors?.date_format || '',
        },
        document_selectors: {
            title: event.document_selectors?.title || '',
            description: event.document_selectors?.description || '',
            date: event.document_selectors?.date || '',
            remove_text_from_date: event.document_selectors?.remove_text_from_date || '',
            date_format: event.document_selectors?.date_format || '',
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('events.update', event.id), {
            data,
            onSuccess: () => {
                router.visit(route('events.index'));
            },
        });
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
                        <EventForm
                            data={data}
                            setData={setData}
                            onSubmit={handleSubmit}
                            errors={errors}
                            processing={processing}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
