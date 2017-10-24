'use strict';

import type {Action } from '../actions/types';

export type State = {
    page: number;
    items: Array<Object>;
    totalPages: number;
    totalItems: number;
};

const initialState = {
    page: 0,
    items: [],
    totalPages: 0,
    totalItems: 0,
};

const itemsStack: Array<Object> = [];

function bookmarks(state: State = initialState, action: Action): State {
    if (action.type === 'LOADED_BOOKMARKS') {
        itemsStack = itemsStack.concat(action.data.items);
        return {
            page: action.data.page,
            items: itemsStack,
            totalItems: action.data.totalItems,
            totalPages: action.data.totalPages,
        };
    }
    if (action.type === 'RESET_BOOKMARKS' || action.type === 'LOGGED_OUT') {
        itemsStack = [];
        return initialState;
    }
    return state;
}

module.exports = bookmarks;