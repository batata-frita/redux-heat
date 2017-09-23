# redux-heat 🔥

[![Build Status](https://travis-ci.org/batata-frita/redux-heat.svg)](https://travis-ci.org/batata-frita/redux-heat)
[![npm version](https://badge.fury.io/js/redux-heat.svg)](https://badge.fury.io/js/redux-heat)

[Redux](http://redux.js.org/) side-effects as a function of state.

- Reducers and action creators as pure functions;
- It is **not** a [middleware](http://redux.js.org/docs/advanced/Middleware.html), so setup and testing are super easy;
- Follows the same pattern as React (decide what to do based on the state and not the actions);
- Effects are pure functions.

## Install

Add it as a dependency in your project:

```bash
npm install --save redux-heat
```

## Usage

Here is a simple example to fetch user details once the id of the user changes is the Redux store:

```js
import subscribe from 'redux-heat'

// Define a selector to define what data to check for changes
const getUserId = state => state.userId

// Action creators
const setUserDetails = user => ({ type: 'SET_USER_DETAILS', payload: user })
const notifyUserFetchFailed = error => ({ type: 'FETCH_USER_FAILED', payload: e })

const fetchUser = userId => fetch(`/user/${userId}`)

// Describe the effect based on state changes
const fetchUserHeat = state => ({
  fn: fetchUser,
  args: [getUserId(state)],
  onValue: setUserDetails,
  onError: notifyUserFetchFailed
})

// Then subscribe the effect to the Redux store
subscribe(reduxStore, [fetchUserHeat])
```
