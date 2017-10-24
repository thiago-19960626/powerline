/**
 * @flow
 */

'use strict';

var ActionSheetIOS = require('ActionSheetIOS');
var { Platform } = require('react-native');
var Alert = require('Alert');
var { API_URL } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');
var FacebookSDK = require('FacebookSDK');
var { loadUserProfile } = require('./users');

async function logIn(username: string, password: string): Promise<Action> {
  try {
    var response = await fetch(`${API_URL}/secure/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });
    var user = await response.json();
    if (user.token) {
      const action = {
        type: 'LOGGED_IN',
        data: {
          id: user.id,
          username: user.username,
          token: user.token,
          is_registration_complete: user.is_registration_complete,
        },
      };
      return Promise.resolve(action);
    }
    else {
      return Promise.reject(user);
    }
  } catch (error) {
    console.error(error);
  }
}

function logInManually(username: string, password: string): ThunkAction {
  return (dispatch) => {
    var login = logIn(username, password);
    login.then(
      (result) => {
        dispatch(result);
        dispatch(loadUserProfile(result.data.token));
      }
    );
    return login;
  }
}

async function queryFacebookAPI(path, ...args): Promise {
  return new Promise((resolve, reject) => {
    FacebookSDK.api(path, ...args, (response) => {
      if (response && !response.error) {
        resolve(response);
      } else {
        reject(response && response.error);
      }
    });
  });
}

function logInWithFacebook() {
  return new Promise((resolve, reject) => {
    FacebookSDK.login((result) => {
      if (result.error) {
        console.log(result.error);
        reject(result.error);
      } else {
        var response = result.authResponse;
        fetch(API_URL + `/secure/facebook/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              facebook_id: response.userID || response.userId,
              facebook_token: response.accessToken
            })
        })
        .then((res) => res.json())
        .then(user => {
            console.log(user);
            if (user.token) {               
                var data = {
                    id: user.id,
                    username: user.username,
                    token: user.token,
                    is_registration_complete: user.is_registration_complete
                };
                resolve(data);
            }else{        
                FacebookSDK.api("/me", "get", {fields: 'email,first_name,last_name,picture,gender,location,hometown,birthday,link'}, function(data, err){
                    if(err){
                      console.log(err);
                      reject(err);
                    }
                    var payloadData = {
                      facebook_id: data.id,
                      facebook_token: response.accessToken,
                      email: data.email,
                      email_confirm: data.email,
                      first_name: data.first_name,
                      last_name: data.last_name,
                      avatar_file_name: data.pic,
                      sex: data.gender? data.gender[0].toUpperCase() + data.gender.slice(1, data.gender.last_name): '',
                      facebook_link: data.link
                    };
                    if(data.address){
                      payloadData.address1 = data.address.street;
                      payloadData.city = data.address.city;
                      payloadData.state = data.address.state;
                      payloadData.zip = data.address.zip;
                    }
                    if(data.birthday){
                      payloadData.birth = data.birthday;
                    }
                    if(data.picture && data.picture.data){
                      payloadData.avatar_file_name = data.picture.data.url;
                    }
                    if(data.email){
                      payloadData.username = data.email.split("@")[0];
                    }
                    resolve(payloadData);
                });
            }
        })
        .catch(err => {
            reject(err);
        });        
      }
    }, {scope: 'public_profile,email'});
  });
}

async function forgotPassword(email: string) {
  try {
    let response = await fetch(`${API_URL}/secure/forgot-password`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      })
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}

function logOut(): ThunkAction {
  return (dispatch) => {
    FacebookSDK.logout();

    return dispatch({
      type: 'LOGGED_OUT',
    });
  };
}

function logOutWithPrompt(): ThunkAction {
  return (dispatch, getState) => {
    let name = getState().user.username || 'there';

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: `Hi, ${name}`,
          options: ['Log out', 'Cancel'],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            dispatch(logOut());
          }
        }
      );
    } else {
      Alert.alert(
        `Hi, ${name}`,
        'Log out from Powerline?',
        [
          { text: 'Cancel' },
          { text: 'Log out', onPress: () => dispatch(logOut()) },
        ]
      );
    }
  };
}

module.exports = { logInManually, logInWithFacebook, forgotPassword, logOut, logOutWithPrompt };
