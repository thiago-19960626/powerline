
var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');

async function loadActivities(token: string, page: ?number = 0, perPage: ?number = PER_PAGE, group: ?string = 'all', user: ?string = 'all'): Promise<Action> {
    try {
        var response = await fetch(`${API_URL}/v2/activities?_format=json&user=${user}&group=${group}&page=${page + 1}&per_page=${perPage}`, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        if (json.totalItems) {
            const action = {
                type: 'LOADED_ACTIVITIES',
                data: {
                    page: json.page,
                    totalItems: json.totalItems,
                    items: json.items,
                    payload: json.payload,
                },
            };
            return Promise.resolve(action);
        }
        else {
            return Promise.reject(json);
        }
    } catch (error) {
        // TEST PURPOSE:
        console.error(error);
        return Promise.reject(error);
    }
}

function resetActivities(): ThunkAction {
    return (dispatch) => {
        return dispatch({
            type: 'RESET_ACTIVITIES',
        });
    };
}

function loadActivitiesByUserId(token, page = 0, per_page = 20, group = 'all', user) {
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/activities?_format=json&user=' + user + '&group=' + group + '&page=' + page + '&per_page=' + per_page, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
            .then((res) => res.json())
            .then(data => {
                console.log("Load Activities by User Id API success", data);
                resolve(data);
            })
            .catch(err => {
                console.log("Load Activities by User Id API error", err);
                reject(err);
            })
    });
}

function loadActivityByEntityId(token, entityType, entityId) {
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/activities?_format=json&' + entityType + '_id=' + entityId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
            .then((res) => res.json())
            .then(data => {
                console.log("Load Activity by Entity Id API success", data);
                resolve(data);
            })
            .catch(err => {
                console.log("Load Activity by Entity Id API error", err);
                reject(err);
            })
    });
}

function putSocialActivity(token, id, ignore){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/social-activities/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                ignore: ignore
            })
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Put Social Activity API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Put Social Activity API Error", err);
            reject(err);
        });
    });
}

module.exports = {
    loadActivities,
    resetActivities,
    loadActivitiesByUserId,
    loadActivityByEntityId,
    putSocialActivity,
}