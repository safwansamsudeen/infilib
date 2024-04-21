
import { capitalize } from '$lib/helpers.js';

import { author, category, language, user, item, subscriptionType, publisher } from '$lib/db.js';

const CACHE_STRATEGY = { cacheStrategy: { swr: 60, ttl: 60 } };


function standardizeColumns({ name, important, type, columns, ...data }) {
    if (type === 'object') {
        return { ...data, name, type, columns: columns.map(standardizeColumns) };
    } else {
        return {
            ...data,
            name: name || capitalize(data.id),
            important: important ?? true,
            type: type || 'text'
        };
    }
}

export function getUserColumns(library_slug, opts = false) {
    const types =
        opts &&
        (subscriptionType.findMany({
            ...CACHE_STRATEGY,
            where: { library_slug }
        }));
    return [
        { id: 'name' },
        {
            id: 'gender',
            type: 'select',
            opts: {
                options: [
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' }
                ],
                creatable: false,
                goto: false
            }
        },
        { id: 'email_address', type: 'email' },
        { id: 'phone_number', type: 'tel', important: false },
        { id: 'date_of_birth', type: 'date', important: false },
        { id: 'about', important: false },
        {
            id: 'subscription',
            type: 'object',
            important: true,
            columns: [
                { id: 'member_id', label: 'Member ID', type: 'number' },
                {
                    id: 'type',
                    label: 'Subscription Type',
                    type: 'select',
                    opts: {
                        options: types,
                        creatable: false,
                        goto: false,
                        tableVisible: false
                    }
                },
                { id: 'purchased_on', type: 'date' },
                { id: 'valid_till', type: 'date' },
                { id: 'details' }
            ]
        }
    ].map(standardizeColumns);
}

export function getTransColumns(library_slug) {
    const users = user.findMany({
        ...CACHE_STRATEGY,
        where: { subscriptions: { some: { type: { library_slug } } } }
    });

    const types = subscriptionType.findMany({
        ...CACHE_STRATEGY,
        where: { library_slug }
    });
    const items = item.findMany({
        ...CACHE_STRATEGY,
        where: { library_slug }
    });

    return [
        { id: 'id', name: 'ID', type: 'hidden' },
        {
            id: 'user',
            type: 'select',
            opts: {
                options: users,
                creatable: false,
                goto: 'members/'
            }
        },
        {
            id: 'subscription',
            type: 'select',
            opts: {
                options: types,
                creatable: false,
                disabled: true,
                goto: false,
                tableVisible: false
            }
        },
        {
            id: 'item',
            type: 'select',
            opts: {
                options: items,
                itemId: 'id',
                label: 'title',
                creatable: false
            }
        },
        { id: 'issued_at', type: 'date' },
        { id: 'due_at', type: 'date' },
        { id: 'returned_at', type: 'date', opts: { formRemoved: true } },
        { id: 'price', type: 'number', important: true },
        { id: 'comments', type: 'textarea', important: false, opts: { tableVisible: true } }
    ].map(standardizeColumns);
}

