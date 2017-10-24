'use strict';

import type { Action } from '../actions/types';

const { PER_PAGE } = require('PLEnv');

export type Group = {
    avatar_file_path: ?string;
    joined: ?boolean;
    group_type_label: ?string;
    id: ?number;
    official_name: ?string;
    acronym: ?string;
    picture: ?string;
    created_at: ?string;
    membership_control: ?string;
    fill_fields_required: ?boolean;
    petition_per_month: ?number;
};

export type State = {
    page: number;
    items: number;
    payload: Array<Object>;
};

const itemsPerPage = PER_PAGE;

const initialState = {
    page: 0,
    items: itemsPerPage,
    payload: [],
};

const payloadStack: Array<Object> = [];

function groups(state: State = initialState, action: Action): State {
    if (action.type === 'LOADED_GROUPS') {
        payloadStack = payloadStack.concat(action.data.payload);
        return {
            page: action.data.page,
            items: action.data.items,
            payload: payloadStack,
        };
    }
    if (action.type === 'CLEAR_CACHED_GROUPS' || action.type === 'LOGGED_OUT') {
        payloadStack = [];
        return initialState;
    }
    return state;
}

module.exports = groups;