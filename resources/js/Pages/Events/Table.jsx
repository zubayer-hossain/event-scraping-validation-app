import React from 'react';

const EventTable = ({ events }) => {
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="border rounded-md p-2"
                />
                <div>
                    <button className="bg-gray-200 p-2 rounded-md mr-2">Import</button>
                    <button className="bg-gray-200 p-2 rounded-md mr-2">Export</button>
                    <button className="bg-indigo-500 text-white p-2 rounded-md">Add Source</button>
                </div>
            </div>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2">Name</th>
                    <th className="py-2">Country</th>
                    <th className="py-2">Document</th>
                    <th className="py-2">Last Updated</th>
                    <th className="py-2">Enabled</th>
                    <th className="py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {events.map((event) => (
                    <tr key={event.id} className="border-b">
                        <td className="py-2 px-4">{event.name}</td>
                        <td className="py-2 px-4">{event.country}</td>
                        <td className="py-2 px-4">{event.document}</td>
                        <td className="py-2 px-4">{event.last_updated}</td>
                        <td className="py-2 px-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={event.enabled}
                                    className="form-checkbox"
                                    readOnly
                                />
                            </label>
                        </td>
                        <td className="py-2 px-4">
                            <div className="relative">
                                <button className="relative z-10 block bg-gray-200 p-2 rounded-md">
                                    Actions
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-20">
                                    <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Check Selectors</button>
                                    <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Run Crawler</button>
                                    <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Edit Source</button>
                                    <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Remove Source</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default EventTable;
