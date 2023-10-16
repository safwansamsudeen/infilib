import { patch } from '$lib/serverHelpers.js';
import { getUserColumns } from '$lib/columns.js';
import { user } from '$lib/db.js';

export const PATCH = patch(getUserColumns, user);
