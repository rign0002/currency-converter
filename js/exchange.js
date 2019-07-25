'use strict'

import currencies from './currencies.js'


document.addEventListener('DOMContentLoaded', init)

function init() {
    addEventListeners()
    copyrightMessage()
}


const addEventListeners = () => {
    document.querySelector('#first-btn').addEventListener('click', clickFirstBtn)
    document.querySelector('#second-btn').addEventListener('click', clickSecondBtn)
    document.querySelectorAll('.input-form').forEach(input => input.addEventListener('input', updateInputs))
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
    
    
//    getExchangeRates()
}

//const getExchangeRates = () => {
//    const currencySymbols = document.querySelectorAll('.btn-currency-symbol')
//    const first = currencySymbols[0].innerHTML.substring(0, 3)
//    const second = currencySymbols[1].innerHTML.substring(0, 3)
//    
//    const url = `https://api.exchangeratesapi.io/latest?base=${first}&symbols=${first},${second}`
//    
//    fetch(url)
//    .then(resp => resp.json())
//    .then(data => {
//        console.log(data.rates)
//        console.log(currencies)
//    })
//}

const updateInputs = ev => {
    const btns = document.querySelectorAll('.btn-form')
    const inputs = document.querySelectorAll('.input-form')
    
    const baseCurrencyRate = currencies.find(c => c.abbreviation === btns[0].getAttribute('data-currency')).rate
    const currencyRate = currencies.find(currency => currency.abbreviation === btns[1].getAttribute('data-currency')).rate
    const exchangeRate = Number(currencyRate/baseCurrencyRate).toFixed(4)
    
    inputs[1].value = exchangeRate * inputs[0].value

    console.log(exchangeRate)

}

const deleteItems = elem => {
    while(elem.hasChildNodes())
        elem.removeChild(elem.querySelector('li'))
}

const clearInput = () => {
   document.querySelector('#second-input').value = ''
    updateInputs()
}

const deleteButton = btn => {
        btn.removeChild(btn.querySelector('.fas'))
        btn.removeChild(btn.querySelector('.btn-img'))
        btn.removeChild(btn.querySelector('.btn-currency-symbol'))
        btn.removeChild(btn.querySelector('.btn-currency-name'))
}

const copyrightMessage = () => {
    const date = new Date()
    let year = date.getFullYear()
    const copyrightTag = document.querySelector('#copyright')
    copyrightTag.innerHTML = `&copy; Copyright ${year} Justin Rignault. All Rights Reserved`
}
