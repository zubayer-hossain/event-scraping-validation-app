import React from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm } from '@inertiajs/react';
import { Switch } from '@headlessui/react';

export default function Form({ event = {}, data, setData, onSubmit, errors, processing }) {
    const handleInputChange = (field, value) => {
        setData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleNestedInputChange = (field, nestedField, value) => {
        setData((prevData) => ({
            ...prevData,
            [field]: {
                ...prevData[field],
                [nestedField]: value,
            },
        }));
    };


    const sourceTypeOptions = [
        { value: '', text: 'Select a source type', disabled: true },
        { value: 'web scraping', text: 'Web scraping' },
        // Add more options as needed
    ];

    const countryOptions = [
        { value: '', text: 'Select a country', disabled: true },
        { value: 'Australia', text: 'Australia' },
        { value: 'Bangladesh', text: 'Bangladesh' },
    ];

    const documentOptions = [
        { value: '', text: 'Select a document type', disabled: true },
        { value: 'Media Release', text: 'Media Release' },
        { value: 'Consultation', text: 'Consultation' },
        { value: 'Unknown', text: 'Unknown' },
        { value: 'Speech', text: 'Speech' },
    ];

    return (
        <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                    />
                    {errors.name && <InputError message={errors.name} className="mt-2" />}
                </div>
                <div>
                    <InputLabel htmlFor="url" value="URL" />
                    <TextInput
                        id="url"
                        name="url"
                        value={data.url}
                        className="mt-1 block w-full"
                        onChange={(e) => handleInputChange('url', e.target.value)}
                        required
                    />
                    {errors.url && <InputError message={errors.url} className="mt-2" />}
                </div>
                <div>
                    <InputLabel htmlFor="country" value="Country" />
                    <SelectInput
                        id="country"
                        name="country"
                        value={data.country}
                        className="mt-1 block w-full"
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        options={countryOptions}
                        required
                    />
                    {errors.country && <InputError message={errors.country} className="mt-2" />}
                </div>
                <div>
                    <InputLabel htmlFor="document" value="Document" />
                    <SelectInput
                        id="document"
                        name="document"
                        value={data.document}
                        className="mt-1 block w-full"
                        onChange={(e) => handleInputChange('document', e.target.value)}
                        options={documentOptions}
                        required
                    />
                    {errors.document && <InputError message={errors.document} className="mt-2" />}
                </div>
                <div>
                    <InputLabel htmlFor="source_type" value="Source Type" />
                    <SelectInput
                        id="source_type"
                        name="source_type"
                        value={data.source_type}
                        className="mt-1 block w-full"
                        onChange={(e) => handleInputChange('source_type', e.target.value)}
                        options={sourceTypeOptions}
                        required
                    />
                    {errors.source_type && <InputError message={errors.source_type} className="mt-2" />}
                </div>
                <div>
                    <InputLabel htmlFor="reference_selector" value="Reference Selector" />
                    <TextInput
                        id="reference_selector"
                        name="reference_selector"
                        value={data.reference_selector}
                        className="mt-1 block w-full"
                        onChange={(e) => handleInputChange('reference_selector', e.target.value)}
                    />
                    {errors.reference_selector && <InputError message={errors.reference_selector} className="mt-2" />}
                </div>
            </div>
            <div className="mt-4 mb-4">
                <InputLabel htmlFor="horizon_scanning" value="Horizon Scanning" />
                <Switch
                    checked={data.horizon_scanning}
                    onChange={(value) => handleInputChange('horizon_scanning', value)}
                    className={`${data.horizon_scanning ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full mt-2`}
                >
                    <span className="sr-only">Enable Horizon Scanning</span>
                    <span className={`${data.horizon_scanning ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full`} />
                </Switch>
                {errors.horizon_scanning && <InputError message={errors.horizon_scanning} className="mt-2" />}
            </div>
            {data.horizon_scanning && (
                <>
                    <fieldset className="mt-4">
                        <legend className="text-lg font-medium text-gray-900">Source Selectors</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div>
                                <InputLabel htmlFor="source_selectors.container" value="Container" />
                                <TextInput
                                    id="source_selectors.container"
                                    name="source_selectors.container"
                                    value={data.source_selectors.container}
                                    className="mt-1 block w-full"
                                    onChange={(e) => handleNestedInputChange('source_selectors', 'container', e.target.value)}
                                />
                                {errors['source_selectors.container'] && <InputError message={errors['source_selectors.container']} className="mt-2" />}
                            </div>
                            <div>
                                <InputLabel htmlFor="source_selectors.link" value="Link" />
                                <TextInput
                                    id="source_selectors.link"
                                    name="source_selectors.link"
                                    value={data.source_selectors.link}
                                    className="mt-1 block w-full"
                                    onChange={(e) => handleNestedInputChange('source_selectors', 'link', e.target.value)}
                                />
                                {errors['source_selectors.link'] && <InputError message={errors['source_selectors.link']} className="mt-2" />}
                            </div>
                            <div>
                                <InputLabel htmlFor="source_selectors.title" value="Title" />
                                <TextInput
                                    id="source_selectors.title"
                                    name="source_selectors.title"
                                    value={data.source_selectors.title}
                                    className="mt-1 block w-full"
                                    onChange={(e) => handleNestedInputChange('source_selectors', 'title', e.target.value)}
                                />
                                {errors['source_selectors.title'] && <InputError message={errors['source_selectors.title']} className="mt-2" />}
                            </div>
                            <div>
                                <InputLabel htmlFor="source_selectors.description" value="Description" />
                                <TextInput
                                    id="source_selectors.description"
                                    name="source_selectors.description"
                                    value={data.source_selectors.description}
                                    className="mt-1 block w-full"
                                    onChange={(e) => handleNestedInputChange('source_selectors', 'description', e.target.value)}
                                />
                                {errors['source_selectors.description'] && <InputError message={errors['source_selectors.description']} className="mt-2" />}
                            </div>
                            <div>
                                <InputLabel htmlFor="source_selectors.date" value="Date" />
                                <TextInput
                                    id="source_selectors.date"
                                    name="source_selectors.date"
                                    value={data.source_selectors.date}
                                    className="mt-1 block w-full"
                                    onChange={(e) => handleNestedInputChange('source_selectors', 'date', e.target.value)}
                                />
                                {errors['source_selectors.date'] && <InputError message={errors['source_selectors.date']} className="mt-2" />}
                            </div>
                            <div>
                                <InputLabel htmlFor="source_selectors.remove_text_from_date" value="Remove Text From Date" />
                                <TextInput
                                    id="source_selectors.remove_text_from_date"
                                    name="source_selectors.remove_text_from_date"
                                    value={data.source_selectors.remove_text_from_date}
                                    className="mt-1 block w-full"
                                    onChange={(e) => handleNestedInputChange('source_selectors', 'remove_text_from_date', e.target.value)}
                                />
                                {errors['source_selectors.remove_text_from_date'] && <InputError message={errors['source_selectors.remove_text_from_date']} className="mt-2" />}
                            </div>
                            <div>
                                <InputLabel htmlFor="source_selectors.date_format" value="Date Format" />
                                <TextInput
                                    id="source_selectors.date_format"
                                    name="source_selectors.date_format"
                                    value={data.source_selectors.date_format}
                                    className="mt-1 block w-full"
                                    onChange={(e) => handleNestedInputChange('source_selectors', 'date_format', e.target.value)}
                                />
                                {errors['source_selectors.date_format'] && <InputError message={errors['source_selectors.date_format']} className="mt-2" />}
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="mt-4 mb-4">
                        <legend className="text-lg font-medium text-gray-900">Document Selectors</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div>
                                <InputLabel htmlFor="document_selectors.title" value="Title" />
                                <TextInput
                                    id="document_selectors.title"
                                    name="document_selectors.title"
                                    value={data.document_selectors.title}
                                    className="mt-1 block w-full"
                                    onChange={(e) => handleNestedInputChange('document_selectors', 'title', e.target.value)}
                                />
                                {errors['document_selectors.title'] && <InputError message={errors['document_selectors.title']} className="mt-2" />}
                            </div>
                            <div>
                                <InputLabel htmlFor="document_selectors.description" value="Description" />
                                <TextInput
                                    id="document_selectors.description"
                                    name="document_selectors.description"
                                    value={data.document_selectors.description}
                                    className="mt-1 block w-full"
                                    onChange={(e) => handleNestedInputChange('document_selectors', 'description', e.target.value)}
                                />
                                {errors['document_selectors.description'] && <InputError message={errors['document_selectors.description']} className="mt-2" />}
                            </div>
                            <div>
                                <InputLabel htmlFor="document_selectors.date" value="Date" />
                                <TextInput
                                    id="document_selectors.date"
                                    name="document_selectors.date"
                                    value={data.document_selectors.date}
                                    className="mt-1 block w-full"
                                    onChange={(e) => handleNestedInputChange('document_selectors', 'date', e.target.value)}
                                />
                                {errors['document_selectors.date'] && <InputError message={errors['document_selectors.date']} className="mt-2" />}
                            </div>
                            <div>
                                <InputLabel htmlFor="document_selectors.remove_text_from_date" value="Remove Text From Date" />
                                <TextInput
                                    id="document_selectors.remove_text_from_date"
                                    name="document_selectors.remove_text_from_date"
                                    value={data.document_selectors.remove_text_from_date}
                                    className="mt-1 block w-full"
                                    onChange={(e) => handleNestedInputChange('document_selectors', 'remove_text_from_date', e.target.value)}
                                />
                                {errors['document_selectors.remove_text_from_date'] && <InputError message={errors['document_selectors.remove_text_from_date']} className="mt-2" />}
                            </div>
                            <div>
                                <InputLabel htmlFor="document_selectors.date_format" value="Date Format" />
                                <TextInput
                                    id="document_selectors.date_format"
                                    name="document_selectors.date_format"
                                    value={data.document_selectors.date_format}
                                    className="mt-1 block w-full"
                                    onChange={(e) => handleNestedInputChange('document_selectors', 'date_format', e.target.value)}
                                />
                                {errors['document_selectors.date_format'] && <InputError message={errors['document_selectors.date_format']} className="mt-2" />}
                            </div>
                        </div>
                    </fieldset>
                </>
            )}
            <hr />
            <div className="flex items-center justify-between mt-4">
                <div>
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:outline-none focus:border-gray-500 focus:ring focus:ring-gray-200 active:bg-gray-400 transition ease-in-out duration-150 mr-4"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </button>
                </div>
                <div>
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:outline-none focus:border-gray-500 focus:ring focus:ring-gray-200 active:bg-gray-400 transition ease-in-out duration-150 mr-4"
                    >
                        Check Selectors
                    </button>
                    <PrimaryButton disabled={processing}>
                        Save
                    </PrimaryButton>
                </div>
            </div>
        </form>
    );
}



