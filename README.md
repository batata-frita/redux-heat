# redux-heat 🔥

[![Build Status](https://travis-ci.org/batata-frita/redux-heat.svg)](https://travis-ci.org/batata-frita/redux-heat)
[![npm version](https://badge.fury.io/js/redux-heat.svg)](https://badge.fury.io/js/redux-heat)

[Redux](http://redux.js.org/) side-effects as a function of state.

- Reducers and action creators as pure functions;
- Based on Observables;
- It is **not** a [middleware](http://redux.js.org/docs/advanced/Middleware.html), so setup and testing are super easy;
- Follows the same pattern as React (decide what to do based on the state and not the actions);
- It is supper tiny (really, check the source).

## Install

Add it as a dependency in your project:

```bash
npm add redux-heat
```

## Usage

Here is a simple example to fetch user details once the id of the user changes is the Redux store:

```js
import subscribe from 'redux-heat'
import * as most from 'most'

// Define a selector to define what data to check for changes
const getUserId = state => state.userId

// Describe the effect based on state changes
const fetchUserHeat = state$ =>
  state$
    .map(getUserId)
    .skipRepeats()
    .flatMap(userId =>
      most
        .fromPromise(fetch(`/user/${userId}`))
        .map(user => ({ type: 'SET_USER_DETAILS', payload: user }))
        .recoverWith(error => most.of({ type: 'FETCH_USER_FAILED', payload: e }))
    )

// Then subscribe the effect to the Redux store
subscribe(reduxStore, [fetchUserHeat])
```
