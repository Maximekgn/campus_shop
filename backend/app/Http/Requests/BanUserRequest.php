<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BanUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ban_until' => ['required', 'date', 'after:now'],
            'reason' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'ban_until.required' => 'La date de fin de bannissement est obligatoire.',
            'ban_until.after' => 'La date de fin de bannissement doit être dans le futur.',
        ];
    }
}
