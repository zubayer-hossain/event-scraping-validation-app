import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    EllipsisVerticalIcon,
    ArrowUpTrayIcon,
    ArrowDownTrayIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    ArrowPathIcon,
    ArrowTopRightOnSquareIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';
import TextInput from '@/Components/TextInput';
import { Switch } from '@headlessui/react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

const EventTable = ({ user }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isScrapingModalOpen, setIsScrapingModalOpen] = useState(false);
    const [scrapingResults, setScrapingResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        axios.get('/events/list')
            .then(response => {
                setEvents(response.data.map(event => ({
                    ...event,
                    isChecking: event.status === 'checking',
                    isResultsAvailable: event.status === 'completed'
                })));
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
            router.delete(route('events.destroy', selectedEvent.id), {
                onSuccess: () => {
                    router.visit(route('events.index'));
                },
                onError: (error) => {
                    console.error("There was an error deleting the event!", error);
                }
            });
        }
    };

    const handleCheckSelectors = (event) => {
        axios.post(route('events.checkSelectors', event.id))
            .then(response => {
                router.visit(route('events.index'));
            })
            .catch(error => {
                console.error("There was an error checking the selectors!", error);
            });
    };

    const seeResults = (event) => {
        setSelectedEvent(event);
        setIsScrapingModalOpen(true);
        axios.get(route('events.reports', event.id))
            .then(response => {
                setScrapingResults(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the scraping results!", error);
            });
    }

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
                {user.role === 'author' && (
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
                )}
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
                             {user.role === 'author' && (
                                 <th className="py-2 px-4 text-left">Actions</th>
                             )}
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
                                         checked={event.horizon_scanning}
                                         onChange={() => {}}
                                         className={`${event.horizon_scanning ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                                     >
                                         <span className="sr-only">Enable</span>
                                         <span
                                             className={`${event.horizon_scanning ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full`}
                                         />
                                     </Switch>
                                 </td>
                                 {user.role === 'author' && (
                                     <td className="py-2 px-4 relative">
                                         {(event.status === 'pending' || event.status === 'failed') && (
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
                                                             <button
                                                                 className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                                                 role="menuitem"
                                                                 tabIndex="-1"
                                                                 onClick={() => handleCheckSelectors(event)}
                                                             >
                                                                 <MagnifyingGlassIcon className="h-5 w-5 mr-2"/>
                                                                 Check Selectors
                                                             </button>
                                                             <button
                                                                 className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                                                 role="menuitem"
                                                                 tabIndex="-1"
                                                             >
                                                                 <ArrowPathIcon className="h-5 w-5 mr-2"/>
                                                                 Run Crawler
                                                             </button>
                                                             <button
                                                                 className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                                                 role="menuitem"
                                                                 tabIndex="-1"
                                                                 onClick={() => router.visit(route('events.edit', event.id))}
                                                             >
                                                                 <PencilSquareIcon className="h-5 w-5 mr-2"/>
                                                                 Edit Source
                                                             </button>
                                                             <button
                                                                 className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                                                 role="menuitem"
                                                                 tabIndex="-1"
                                                                 onClick={() => handleDelete(event)}
                                                             >
                                                                 <TrashIcon className="h-5 w-5 mr-2"/>
                                                                 Remove Source
                                                             </button>
                                                         </div>
                                                     </div>
                                                 )}
                                             </div>
                                         )}

                                         {event.status === 'scraping' && (
                                             <div className="relative inline-block text-left">
                                                 <div>
                                                     <button
                                                         type="button"
                                                         className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                         id="menu-button"
                                                         aria-expanded="true"
                                                         aria-haspopup="true"
                                                     >
                                                         <ArrowPathIcon className="h-5 w-5" />
                                                         Checking...
                                                     </button>
                                                 </div>
                                             </div>
                                         )}

                                         {event.status === 'completed' && (
                                             <div className="relative inline-block text-left">
                                                 <div>
                                                     <button
                                                         type="button"
                                                         className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                         id="menu-button"
                                                         aria-expanded="true"
                                                         aria-haspopup="true"
                                                         onClick={() => seeResults(event)}
                                                     >
                                                         <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                                                         See Results
                                                     </button>
                                                 </div>
                                             </div>
                                         )}
                                     </td>
                                 )}
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

            <Modal
                show={isScrapingModalOpen}
                onClose={() => setIsScrapingModalOpen(false)}
                maxWidth="2xl"
            >
                <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-5">Check Results</h2>
                    {scrapingResults && scrapingResults.length > 0 ? (
                        <div className="mb-2">
                            <div className="mb-4">
                                <p className="mt-1"><strong>Name</strong> <br/> {selectedEvent.name}</p>
                                <div className="flex justify-between mr-8">
                                    <div className="mt-1"><strong>Start</strong> <br/> {selectedEvent.check_start}</div>
                                    <div className="mt-1"><strong>Finish</strong> <br/> {selectedEvent.check_end}</div>
                                    <div className="mt-1"><strong>Duration</strong> <br/> {selectedEvent.duration}</div>
                                </div>

                                <h3 className="text-md font-semibold text-gray-800 mt-5">Result {currentIndex
                                                                                            + 1} of {scrapingResults.length}</h3>
                            </div>
                            <div className="bg-gray-100 p-2 rounded-md text-sm text-gray-800">
                                <p><strong>Link</strong> <br/> {scrapingResults[currentIndex].source_url}</p>
                                <p className="mt-2"><strong>Title</strong> <br/> {scrapingResults[currentIndex].title}
                                </p>
                                <p className="mt-2"><strong>Date</strong> <br/> {scrapingResults[currentIndex].date}
                                </p>
                                <p className="mt-2"><strong>Document</strong>
                                    <br/> {scrapingResults[currentIndex].description}</p>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    className="bg-gray-300 text-gray-700 px-2 py-2 rounded-sm mr-2"
                                    disabled={currentIndex === 0}
                                    onClick={() => setCurrentIndex(currentIndex - 1)}
                                >
                                    <ChevronDoubleLeftIcon className="h-3 w-3"/>
                                </button>
                                <button
                                    className="bg-gray-300 text-gray-700 px-2 py-2 rounded-sm"
                                    disabled={currentIndex === scrapingResults.length - 1}
                                    onClick={() => setCurrentIndex(currentIndex + 1)}
                                >
                                    <ChevronDoubleRightIcon className="h-3 w-3"/>
                                </button>
                            </div>
                        </div>
                    ) : (
                         <p className="text-sm text-gray-600 mb-2">No results available.</p>
                     )}
                    <hr/>
                    <div className="mt-4 flex justify-end">
                        <button
                            className="bg-gray-300 text-gray-700 p-2 rounded-lg mr-2"
                            onClick={() => router.visit(route('events.edit', selectedEvent.id))}
                        >
                            Edit Source
                        </button>
                        <button
                            className="bg-gray-300 text-gray-700 p-2 rounded-lg mr-2"
                            onClick={() => setIsScrapingModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default EventTable;
