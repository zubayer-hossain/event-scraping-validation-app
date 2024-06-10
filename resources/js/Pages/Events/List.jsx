import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EventTable from '@/Pages/Events/Table';
import { Head } from '@inertiajs/react';

const EventListPage = ({ auth }) => {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Events</h2>}
        >
            <Head title="Events" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <EventTable user={auth.user} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EventListPage;
