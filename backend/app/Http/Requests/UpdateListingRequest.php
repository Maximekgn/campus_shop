<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'type' => ['sometimes', Rule::in(['vente', 'don', 'echange'])],
            'price' => ['nullable', 'numeric', 'min:0', 'max:9999999.99'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $type = $this->input('type', $this->route('listing')?->type);
            $price = $this->input('price');

            if ($type === 'vente' && $this->has('price') && (is_null($price) || $price <= 0)) {
                $validator->errors()->add('price', 'Le prix est obligatoire pour une vente.');
            }

            if ($type === 'don' && !is_null($price) && $price > 0) {
                $validator->errors()->add('price', 'Un don ne peut pas avoir de prix.');
            }
        });
    }
}
