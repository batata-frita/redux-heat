# redux-heat

[![Build Status](https://travis-ci.org/pirelenito/redux-heat.svg)](https://travis-ci.org/pirelenito/redux-heat)
[![npm version](https://badge.fury.io/js/redux-heat.svg)](https://badge.fury.io/js/redux-heat)

[Redux](http://redux.js.org/) side-effects as a function of state.

- No new concept to understand ([Sagas](https://github.com/yelouafi/redux-saga), [Observables](https://redux-observable.js.org/)) it is just [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise);
- It is **not** a [middleware](http://redux.js.org/docs/advanced/Middleware.html);
- Follow the same pattern as React.

## Install

Add it as a dependency in your project:

```bash
npm add redux-heat
```

## Usage

Here is a simple example to fetch user details once the id of the user changes is the Redux store:

```js
import { onChange, subscribe } from 'redux-heat'

// Define a selector to define what data to check for changes
const getUserId = (state) => state.userId

// Describe the effect based on state changes
const fetchUserEffect = onChange(getUserId, async (state, userId) => {
  const user = await fetch(`/user/${userId}`)
  return { type: 'SET_USER_DETAILS', payload: user }
})

// Then subscribe the effect to the Redux store
subscribe(reduxStore, [fetchUserEffect])
```
