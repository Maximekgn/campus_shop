<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'type' => ['required', Rule::in(['vente', 'don', 'echange'])],
            'price' => ['nullable', 'numeric', 'min:0', 'max:9999999.99'],
        ];
    }

    /**
     * Configure the validator instance.
     * Price is required for "vente" type, must be null for "don".
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $type = $this->input('type');
            $price = $this->input('price');

            if ($type === 'vente' && (is_null($price) || $price <= 0)) {
                $validator->errors()->add('price', 'Le prix est obligatoire pour une vente.');
            }

            if ($type === 'don' && !is_null($price) && $price > 0) {
                $validator->errors()->add('price', 'Un don ne peut pas avoir de prix.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est obligatoire.',
            'description.required' => 'La description est obligatoire.',
            'type.required' => 'Le type d\'annonce est obligatoire.',
            'type.in' => 'Le type doit être : vente, don ou echange.',
        ];
    }
}
