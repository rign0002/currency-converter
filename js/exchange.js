'use strict'

import currencies from './currencies.js';


document.addEventListener('DOMContentLoaded', init)

function init() {
    addEventListeners()
    copyrightMessage()
}


const addEventListeners = () => {
    
}

const copyrightMessage = () => {
    const date = new Date()
    let year = date.getFullYear()
    const copyrightTag = document.querySelector('#copyright')
    copyrightTag.innerHTML = `&copy; Copyright ${year} Justin Rignault. All Rights Reserved`
}
