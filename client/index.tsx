
import React from 'react'
import ReactDOM from 'react-dom'

import { Dashboard } from './Dashboard'


window.addEventListener('load', () =>
    ReactDOM.render(<Dashboard />, document.querySelector('#root')))

document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});