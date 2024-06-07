import React from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm } from '@inertiajs/react';

export default function Form({ event = {}, onSubmit }) {
    const { data, setData, errors, processing } = useForm({
        name: event.name || '',
        url: event.url || '',
        country: event.country || '',
        document: event.document || '',
        source_type: event.source_type || '',
        reference_selector: event.reference_selector || '',
        horizon_scanning: event.horizon_scanning || false,
        source_selectors: event.source_selectors || '',
        document_selectors: event.document_selectors || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(data);
    };

    const sourceTypeOptions = [
        { value: '', text: 'Select a source type', disabled: true },
        { value: 'web scraping', text: 'Web scraping' },
        // Add more options as needed
    ];

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <InputLabel htmlFor="name" value="Name" />
                <TextInput
                    id="name"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('name', e.target.value)}
                    required
                />
                <InputError message={errors.name} className="mt-2" />
            </div>
            <div className="mt-4">
                <InputLabel htmlFor="url" value="URL" />
                <TextInput
                    id="url"
                    name="url"
                    value={data.url}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('url', e.target.value)}
                    required
                />
                <InputError message={errors.url} className="mt-2" />
            </div>
            <div className="mt-4">
                <InputLabel htmlFor="country" value="Country" />
                <TextInput
                    id="country"
                    name="country"
                    value={data.country}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('country', e.target.value)}
                    required
                />
                <InputError message={errors.country} className="mt-2" />
            </div>
            <div className="mt-4">
                <InputLabel htmlFor="document" value="Document" />
                <TextInput
                    id="document"
                    name="document"
                    value={data.document}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('document', e.target.value)}
                    required
                />
                <InputError message={errors.document} className="mt-2" />
            </div>
            <div className="mt-4">
                <InputLabel htmlFor="source_type" value="Source Type" />
                <SelectInput
                    id="source_type"
                    name="source_type"
                    value={data.source_type}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('source_type', e.target.value)}
                    options={sourceTypeOptions}
                    required
                />
                <InputError message={errors.source_type} className="mt-2" />
            </div>
            <div className="mt-4">
                <InputLabel htmlFor="reference_selector" value="Reference Selector" />
                <TextInput
                    id="reference_selector"
                    name="reference_selector"
                    value={data.reference_selector}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('reference_selector', e.target.value)}
                />
                <InputError message={errors.reference_selector} className="mt-2" />
            </div>
            <div className="mt-4">
                <InputLabel htmlFor="horizon_scanning" value="Horizon Scanning" />
                <input
                    type="checkbox"
                    id="horizon_scanning"
                    name="horizon_scanning"
                    checked={data.horizon_scanning}
                    className="mt-1"
                    onChange={(e) => setData('horizon_scanning', e.target.checked)}
                />
                <InputError message={errors.horizon_scanning} className="mt-2" />
            </div>
            <div className="mt-4">
                <InputLabel htmlFor="source_selectors" value="Source Selectors" />
                <textarea
                    id="source_selectors"
                    name="source_selectors"
                    value={data.source_selectors}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('source_selectors', e.target.value)}
                ></textarea>
                <InputError message={errors.source_selectors} className="mt-2" />
            </div>
            <div className="mt-4">
                <InputLabel htmlFor="document_selectors" value="Document Selectors" />
                <textarea
                    id="document_selectors"
                    name="document_selectors"
                    value={data.document_selectors}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('document_selectors', e.target.value)}
                ></textarea>
                <InputError message={errors.document_selectors} className="mt-2" />
            </div>
            <div className="flex items-center justify-end mt-4">
                <PrimaryButton className="ml-4" disabled={processing}>
                    Save
                </PrimaryButton>
            </div>
        </form>
    );
}
