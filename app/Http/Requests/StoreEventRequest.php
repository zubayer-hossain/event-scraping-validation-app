<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'url' => 'required|url',
            'country' => 'required|string|max:255',
            'document' => 'required|string|max:255',
            'source_type' => 'required|string|max:255',
            'reference_selector' => 'nullable|string|max:255',
            'horizon_scanning' => 'required|boolean',
            'source_selectors' => 'nullable|array',
            'document_selectors' => 'nullable|array',
        ];
    }
}
