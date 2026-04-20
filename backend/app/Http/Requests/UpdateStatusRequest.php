<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['publiee', 'reservee', 'vendue'])],
        ];
    }

    /**
     * Configure the validator instance.
     * Enforce status transition rules:
     *   draft → cannot be changed by owner (moderation handles this)
     *   publiee → reservee | vendue
     *   reservee → publiee | vendue
     *   vendue → cannot be changed back
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $listing = $this->route('listing');
            if (!$listing) {
                return;
            }

            $currentStatus = $listing->status;
            $newStatus = $this->input('status');

            // Cannot change a sold listing
            if ($currentStatus === 'vendue') {
                $validator->errors()->add('status', 'Une annonce vendue ne peut pas changer de statut.');
            }

            // Cannot change a draft (owner must wait for moderation)
            if ($currentStatus === 'draft') {
                $validator->errors()->add('status', 'Une annonce en brouillon doit d\'abord être validée par un modérateur.');
            }

            // Cannot change an archived listing
            if ($currentStatus === 'archivee') {
                $validator->errors()->add('status', 'Une annonce archivée ne peut pas changer de statut.');
            }

            // Valid transitions
            $allowedTransitions = [
                'publiee' => ['reservee', 'vendue'],
                'reservee' => ['publiee', 'vendue'],
            ];

            if (isset($allowedTransitions[$currentStatus]) && !in_array($newStatus, $allowedTransitions[$currentStatus])) {
                $validator->errors()->add('status', "Transition invalide : {$currentStatus} → {$newStatus}.");
            }
        });
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Le statut est obligatoire.',
            'status.in' => 'Le statut doit être : publiee, reservee ou vendue.',
        ];
    }
}
