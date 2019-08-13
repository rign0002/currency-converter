/***************************************************************************
Filename: exchange.js
Author: Justin Rignault
Description: main js file linked to index.html with functionality to the quick exchange section of the page
Date: August 12th 2019
****************************************************************************/

'use strict'

import currencies from './currencies.js'


document.addEventListener('DOMContentLoaded', init)

function init() {
    addEventListeners()
}

const addEventListeners = () => {
    const firstInput = document.querySelector('#first-input')
    
    document.querySelector('#first-btn').addEventListener('click', clickFirstBtn)
    document.querySelector('#second-btn').addEventListener('click', clickSecondBtn)
    document.querySelector('.fa-exchange-alt').addEventListener('click', switchCurrencies)
    firstInput.addEventListener('input', updateInputs)
    firstInput.addEventListener('focusout', validateAndCleanInput)
    firstInput.addEventListener('keydown', addEnterFunctionality)
}

const clickFirstBtn = ev => {
    ev.preventDefault()
    
    const btn = document.querySelector('#first-btn')
    
    btn.classList.toggle('open')
    
    populateCurrencies(ev, btn)
}

const clickSecondBtn = ev => {
    ev.preventDefault()
    
    const btn = document.querySelector('#second-btn')
    
    btn.classList.toggle('open')
    
    populateCurrencies(ev, btn)
}

const populateCurrencies = (ev, btn) => {
    let currenciesBtn = []    
    const ul = btn.nextElementSibling

    let btns = document.querySelectorAll('.btn-form')
    btns.forEach(elem => {
        currenciesBtn.push(elem.querySelector('.btn-currency-name').innerHTML)
    })
    deleteItems(ul)
    
    
    currencies.forEach(currency => {
        const li = document.createElement('li')
        li.setAttribute('data-currency', currency.abbreviation)
        li.className = 'currency-li'
        li.addEventListener('click', setCurrency)
        if(currency.name === currenciesBtn[0] || currency.name === currenciesBtn[1]){
            li.classList.add('disabled')
            li.removeEventListener('click', setCurrency)
        }
        
        
        const img = document.createElement('img')
        img.className = 'currency-list-img'
        img.src = currency.flag
        
        const span1 = document.createElement('span')
        span1.className = 'currency-abbreviation'
        span1.innerHTML = `${currency.abbreviation} (${currency.symbol})`
        
        const span2 = document.createElement('span')
        span2.className = 'currency-full-name'
        span2.innerHTML = currency.name
        
        li.appendChild(img)
        li.appendChild(span1)
        li.appendChild(span2)
        
        ul.appendChild(li)
    })
}

const setCurrency = ev => {
    const li = ev.currentTarget
    const btn = li.parentElement.previousElementSibling
    
    const imgsrc = li.querySelector('.currency-list-img').src
    const abbreviationSymbol = li.querySelector('.currency-abbreviation').innerHTML
    const name = li.querySelector('.currency-full-name').innerHTML
    
    btn.classList.toggle('open')
    
    clearInput()
    deleteButton(btn)
    
    const i = document.createElement('i')
    i.className = 'fas fa-angle-down'
    
    const img = document.createElement('img')
    img.src = imgsrc
    img.className = 'btn-img'
    
    const span1 = document.createElement('span')
    span1.className = 'btn-currency-symbol'
    span1.innerHTML = abbreviationSymbol
    
    const span2 = document.createElement('span')
    span2.className = 'btn-currency-name'
    span2.innerHTML = name
    
    btn.setAttribute('data-currency', li.getAttribute('data-currency'))
    
    btn.appendChild(i)
    btn.appendChild(img)
    btn.appendChild(span1)
    btn.appendChild(span2)
    
}

const switchCurrencies = () => {
    const btns = document.querySelectorAll('.btn-form')
    const btnsText = []
    const btnsAttr = []
    
    btnsText.push(btns[0].innerHTML)
    btnsText.push(btns[1].innerHTML)
    
    btnsAttr.push(btns[0].getAttribute('data-currency'))
    btnsAttr.push(btns[1].getAttribute('data-currency'))
    
    console.log(btnsAttr)
    
    btns[1].innerHTML = btnsText[0]
    btns[1].setAttribute('data-currency', btnsAttr[0])
    
    btns[0].innerHTML = btnsText[1]
    btns[0].setAttribute('data-currency', btnsAttr[1])
    
    updateInputs()
}

const updateInputs = () => {
    const btns = document.querySelectorAll('.btn-form')
    const inputs = document.querySelectorAll('.input-form')
    
    const baseCurrencyRate = currencies.find(c => c.abbreviation === btns[0].getAttribute('data-currency')).rate
    const currencyRate = currencies.find(currency => currency.abbreviation === btns[1].getAttribute('data-currency')).rate
    const exchangeRate = Number(currencyRate/baseCurrencyRate).toFixed(4)
    
    
    inputs[1].value = exchangeRate * inputs[0].value !== 0 ? (exchangeRate * inputs[0].value).toFixed(4) : ''


}

const deleteItems = elem => {
    while(elem.hasChildNodes())
        elem.removeChild(elem.querySelector('li'))
}

const clearInput = () => {
   document.querySelectorAll('.input-form').forEach(input => {
       input.value = ''
   })
    updateInputs()
}

const validateAndCleanInput = ev => {
    const inputValue = ev.target.value
    if (isNaN(inputValue) || Number(inputValue) === 0) {
        ev.target.value = ''
    } else {
        ev.target.value = Number(inputValue).toFixed(4)
    }
}

const addEnterFunctionality = ev => {
    if(ev.key === 'Enter') ev.target.blur()
}

const deleteButton = btn => {
        btn.removeChild(btn.querySelector('.fas'))
        btn.removeChild(btn.querySelector('.btn-img'))
        btn.removeChild(btn.querySelector('.btn-currency-symbol'))
        btn.removeChild(btn.querySelector('.btn-currency-name'))
}
