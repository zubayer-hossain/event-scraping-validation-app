import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EventForm from '@/Pages/Events/Form';
import { Head, useForm, router } from '@inertiajs/react';

export default function EventCreate({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        url: '',
        country: '',
        document: '',
        source_type: '',
        reference_selector: '',
        horizon_scanning: true,
        source_selectors: {
            container: '',
            link: '',
            title: '',
            description: '',
            date: '',
            remove_text_from_date: '',
            date_format: '',
        },
        document_selectors: {
            title: '',
            description: '',
            date: '',
            remove_text_from_date: '',
            date_format: '',
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('events.store'), {
            data,
            onSuccess: () => {
                router.visit(route('events.index'));
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Source</h2>}
        >
            <Head title="Add Source" />
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
