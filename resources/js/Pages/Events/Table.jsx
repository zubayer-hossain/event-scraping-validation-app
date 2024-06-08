import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EllipsisVerticalIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, PlusIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import TextInput from '@/Components/TextInput';
import { Switch } from '@headlessui/react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

const EventTable = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        axios.get('/events/list')
            .then(response => {
                setEvents(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the events!", error);
            });
    }, []);

    const toggleMenu = (index) => {
        setMenuOpen(menuOpen === index ? null : index);
    };

    const handleDelete = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedEvent) {
            axios.delete(`/events/${selectedEvent.id}`)
                .then(response => {
                    setEvents(events.filter(event => event.id !== selectedEvent.id));
                    setIsModalOpen(false);
                    setSelectedEvent(null);
                })
                .catch(error => {
                    console.error("There was an error deleting the event!", error);
                });
        }
    };

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.document.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <TextInput
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border rounded-md p-2 flex-grow mb-2 md:mb-0 md:mr-4"
                />
                <div className="flex space-x-2">
                    <button className="bg-gray-200 p-2 rounded-md flex items-center">
                        <ArrowUpTrayIcon className="h-5 w-5 mr-2"/>
                        Import
                    </button>
                    <button className="bg-gray-200 p-2 rounded-md flex items-center">
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2"/>
                        Export
                    </button>
                    <button
                        className="bg-black text-white p-2 rounded-md flex items-center"
                        onClick={() => router.visit(route('events.create'))}
                    >
                        <PlusIcon className="h-5 w-5 mr-2"/>
                        Add Source
                    </button>
                </div>
            </div>
            {filteredEvents.length === 0 ? (
                <p className="text-center pt-4">No items found</p>
            ) : (
                 <div className="overflow-x-auto">
                     <table className="min-w-full bg-white table-auto">
                         <thead>
                         <tr>
                             <th className="py-2 text-left">Name</th>
                             <th className="py-2 px-4 text-left">Country</th>
                             <th className="py-2 px-4 text-left">Document</th>
                             <th className="py-2 px-4 text-left">Last Updated</th>
                             <th className="py-2 px-4 text-left">Enabled</th>
                             <th className="py-2 px-4 text-left">Actions</th>
                         </tr>
                         </thead>
                         <tbody>
                         {filteredEvents.map((event, index) => (
                             <tr key={event.id} className="border-b">
                                 <td className="py-2">{event.name}</td>
                                 <td className="py-2 px-4">{event.country}</td>
                                 <td className="py-2 px-4">{event.document}</td>
                                 <td className="py-2 px-4">{event.last_updated_at}</td>
                                 <td className="py-2 px-4">
                                     <Switch
                                         checked={event.enabled}
                                         onChange={() => {}}
                                         className={`${event.enabled ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                                     >
                                         <span className="sr-only">Enable</span>
                                         <span
                                             className={`${event.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full`}
                                         />
                                     </Switch>
                                 </td>
                                 <td className="py-2 px-4 relative">
                                     <div className="relative inline-block text-left">
                                         <div>
                                             <button
                                                 type="button"
                                                 className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                 id="menu-button"
                                                 aria-expanded="true"
                                                 aria-haspopup="true"
                                                 onClick={() => toggleMenu(index)}
                                             >
                                                 <EllipsisVerticalIcon className="h-5 w-5" />
                                             </button>
                                         </div>
                                         {menuOpen === index && (
                                             <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                                                 <div className="py-1" role="none">
                                                     <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200" role="menuitem" tabIndex="-1">
                                                         <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                                                         Check Selectors
                                                     </button>
                                                     <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200" role="menuitem" tabIndex="-1">
                                                         <ArrowPathIcon className="h-5 w-5 mr-2" />
                                                         Run Crawler
                                                     </button>
                                                     <button
                                                         className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                                         role="menuitem"
                                                         tabIndex="-1"
                                                         onClick={() => router.visit(route('events.edit', event.id))}
                                                     >
                                                         <PencilSquareIcon className="h-5 w-5 mr-2" />
                                                         Edit Source
                                                     </button>
                                                     <button
                                                         className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                                         role="menuitem"
                                                         tabIndex="-1"
                                                         onClick={() => handleDelete(event)}
                                                     >
                                                         <TrashIcon className="h-5 w-5 mr-2" />
                                                         Remove Source
                                                     </button>
                                                 </div>
                                             </div>
                                         )}
                                     </div>
                                 </td>
                             </tr>
                         ))}
                         </tbody>
                     </table>
                 </div>
             )}
            <Modal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                maxWidth="md"
            >
                <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
                    <p className="text-sm text-gray-600">Are you sure you want to delete this event? This action cannot be undone.</p>
                    <div className="mt-4 flex justify-end">
                        <button
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded-md"
                            onClick={confirmDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EventTable;
