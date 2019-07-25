'use strict'

import currencies from './currencies.js'

// GLOBALS

const favourites = []
let baseCurrency
let baseCurrencyAmount



document.addEventListener('DOMContentLoaded', init)

function init(){
    getExchangeRates()
    addEventListeners()
    populateAddCurrencyList()
    copyrightMessage()
}

const getExchangeRates = () => {
    let url = 'https://api.exchangeratesapi.io/latest'
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        document.querySelector('.date').innerHTML = `Last updated on ${data.date}`
        data.rates['EUR'] = 1
        currencies.forEach(currency => currency.rate = data.rates[currency.abbreviation])
        loadLocalStorage()
    })
    .catch(err => console.log(err))
}

const loadLocalStorage = () => {
    if(!localStorage.getItem('favourites')){
        localStorage.setItem('favourites', JSON.stringify(['USD', 'EUR', 'JPY', 'GBP']))
    }
    if(!localStorage.getItem('base-currency')){
        localStorage.setItem('base-currency', JSON.stringify('USD'))
    }
    baseCurrency = JSON.parse(localStorage.getItem('base-currency'))
    
    favourites.length = 0
    JSON.parse(localStorage.getItem('favourites')).forEach(elem => favourites.push(elem))
    
    if(document.querySelector('.favourite')){
        deleteCards(document.querySelectorAll('.favourite'))
        createCards(getFavourites(favourites))
    } else {
        createCards(getFavourites(favourites)) 
    }
}

const getFavourites = favs => { 
    //iterate over favourites in localstorage and compare them to currencies array
    const favouriteCurrencies = []
    for (let fav of favs){
        currencies.forEach(currency => {
            if(fav === currency.abbreviation){
                favouriteCurrencies.push(currency)
            }
        })
    }
    return favouriteCurrencies
}

const createCards = favs => {
    const container = document.querySelector('#favourites')
    const baseCurrencyRate = currencies.find(c => c.abbreviation === baseCurrency).rate
    
    
    favs.forEach(fav =>{
        const exchangeRate = fav.abbreviation == baseCurrencyRate ? 1 : (fav.rate/baseCurrencyRate).toFixed(4)
        
        const li = document.createElement('li')
        li.classList.add('favourite')
        li.setAttribute('id', fav.abbreviation)
        li.addEventListener('click', setBaseCurrency)
        if(fav.abbreviation == baseCurrency){
            li.classList.add('base-currency')
        }
        
        const img = document.createElement('img')
        img.src = fav.flag
        img.classList.add('flag')
        
        const div = document.createElement('div')
        div.classList.add('info')
        
        const p1 = document.createElement('p')
        p1.classList.add('input')
        
        const input = document.createElement('input')
        input.setAttribute('placeholder', '0.00')
        input.setAttribute('value', '')
        input.addEventListener('input', updateFavouriteCurrenciesInputs)
        input.addEventListener('focusout', validateAndCleanInput)
        input.addEventListener('keydown', addEnterFunctionality)
        
        const span1 = document.createElement('span')
        span1.classList.add('currency-symbol')
        span1.innerHTML = fav.symbol
        
        const p2 = document.createElement('p')
        p2.classList.add('currency-name')
        p2.innerHTML = `${fav.abbreviation} - ${fav.name}`
        
        const p3 = document.createElement('p')
        p3.classList.add('base-currency-rate')
        p3.innerHTML = `1 ${baseCurrency} = ${exchangeRate} ${fav.abbreviation}`
        
        const span2 = document.createElement('span')
        span2.classList.add('close')
        span2.innerHTML = 'x'
        span2.addEventListener('click', removeFromLocalStorage)

        
        p1.appendChild(input)
        p1.appendChild(span1)
        
        div.appendChild(p1)
        div.appendChild(p2)
        div.appendChild(p3)
        
        li.appendChild(img)
        li.appendChild(div)
        li.appendChild(span2)
        
        container.appendChild(li)
        
        //add focus on input
        input.closest('li').className.includes('base-currency') ? input.focus() : input.blur()
    })
    

    
}

const deleteCards = elems => {
    for (let elem of elems){
        elem.parentNode.removeChild(elem)
    }
}

const populateAddCurrencyList = () => {
    
    const addCurrencyList = document.querySelector('.add-currency-list')
    
    while(addCurrencyList.querySelector('li')) {
        addCurrencyList.removeChild(addCurrencyList.querySelector('li'))
    }
    
    currencies.forEach(currency => {
        
        const li = document.createElement('li')
        li.setAttribute('data-currency', currency.abbreviation)
        li.addEventListener('click', addCurrencyToFavourites)
        
        document.querySelectorAll('.favourite').forEach(elem => {
            if (elem.getAttribute('id') === currency.abbreviation){
                li.classList.add('disabled')
                li.removeEventListener('click', addCurrencyToFavourites)
            }
        })
        
        const img = document.createElement('img')
        img.src = currency.flag
        img.classList.add('flag')
        
        const span = document.createElement('span')
        span.innerHTML = `${currency.abbreviation} - ${currency.name} &nbsp;(${currency.symbol})`
        
        li.appendChild(img)
        li.appendChild(span)
        
        addCurrencyList.appendChild(li)
    })
}

//EVENT LISTENERS

const addEventListeners = () => {    
    document.querySelector('.add-currency-btn').addEventListener('click', addCurrencyBtn)
    document.querySelector('#search-field').addEventListener('keydown', searchCurrencies)
    document.querySelector('#search-button').addEventListener('click', searchCurrencies)
}

const addCurrencyBtn = ev => {
    document.querySelector('.add-currency-btn').classList.toggle('open')
    populateAddCurrencyList()
    document.querySelector('#search-field').value = ''
}

const searchCurrencies = ev => {
    let inputValue = ev.target.value
    const elementsToIterate = document.querySelectorAll('.add-currency-list li')
    const currenciesArray = []
    const matches = []
    
    removeClassAndParagraph()
    
    if (!inputValue) {
        inputValue = ev.target.previousSibling.value
    }
    
    if (ev.key === 'Enter' || ev.type === 'click' && inputValue.length > 0) {
        elementsToIterate.forEach(elem => {
            currenciesArray.push(elem.innerText)
        })
        
        for(let currenciesHTML of currenciesArray) {
            if (currenciesHTML.toLowerCase().includes(inputValue.toLowerCase())) {
                matches.push(currenciesHTML)
            }
        }
        
        const p = document.createElement('p')
        p.innerHTML = `${matches.length} Results Found`
        p.className = 'results'
        
        document.querySelector('.search-div').appendChild(p)
        
        elementsToIterate.forEach(elem => {
            if (matches.includes(elem.innerText) && !(elem.className == 'disabled')) {
                elem.classList.add('found')
                elem.scrollIntoView({behavior: 'smooth', block: 'nearest'})
            }
        })
    }
}

const removeClassAndParagraph = () => {
    while (document.querySelector('.add-currency-list .found')){
        document.querySelector('.found').classList.remove('found')
    }
    
    if(document.querySelector('.search-div .results')) {
        document.querySelector('.search-div').removeChild(document.querySelector('.search-div .results'))
    }
}

const removeFromLocalStorage = ev => {
    ev.stopPropagation()
    const elementToBeRemoved = ev.path[1].getAttribute('id')
    const index = favourites.indexOf(elementToBeRemoved)
    favourites.splice(index, 1)
    localStorage.setItem('favourites', JSON.stringify(favourites))
    
    //remove disabled class from element in add-currency-list
    document.querySelectorAll('.add-currency-list li').forEach(currency => {
        if (currency.getAttribute('data-currency') === elementToBeRemoved){
            currency.classList.remove('disabled')
        }
    })
    
    loadLocalStorage()
}

const addCurrencyToFavourites = ev => {
    let favouriteCurrency
    if(ev.target.getAttribute('data-currency')){
        favouriteCurrency = ev.target
    } else {
        favouriteCurrency = ev.path[1]
    }
    favouriteCurrency.classList.add('disabled')
    
    favouriteCurrency = favouriteCurrency.getAttribute('data-currency')
    
    favourites.push(favouriteCurrency)
    localStorage.setItem('favourites', JSON.stringify(favourites))
    loadLocalStorage()
}

const updateFavouriteCurrenciesInputs = ev => {
    const baseCurrencyRate = currencies.find(c => c.abbreviation === baseCurrency).rate
    const inputValue = ev.target.value
    const newBaseCurrencyAmount = isNaN(ev.target.value) ? 0 : Number(ev.target.value)
 
    if(baseCurrencyAmount !== newBaseCurrencyAmount) {
        baseCurrencyAmount = newBaseCurrencyAmount
        document.querySelectorAll('.favourite').forEach(favouriteLI => {
            if(favouriteLI.id !== baseCurrency) {
                const currencyRate = currencies.find(currency => currency.abbreviation === favouriteLI.id).rate
                const exchangeRate = favouriteLI.id === baseCurrency ? 1 : (currencyRate/baseCurrencyRate).toFixed(4)
                favouriteLI.querySelector('.input input').value = exchangeRate * baseCurrencyAmount !== 0 ? (exchangeRate * baseCurrencyAmount).toFixed(2) : ''
            }
        })
    }
}

const validateAndCleanInput = ev => {
    const inputValue = ev.target.value
    if (isNaN(inputValue) || Number(inputValue) === 0) {
        ev.target.value = ''
    } else {
        ev.target.value = Number(inputValue).toFixed(2)
    }
}

const addEnterFunctionality = ev => {
    if(ev.key === 'Enter') ev.target.blur()
}

const setBaseCurrency = ev => {
    let target = ev.target.closest('li')
    
    if(document.querySelector('.base-currency')) {
        document.querySelector('.base-currency').classList.remove('base-currency')
    }
    target.classList.add('base-currency')
    
    baseCurrency = target.id
    localStorage.setItem('base-currency', JSON.stringify(baseCurrency))
    loadLocalStorage()
}

const copyrightMessage = () => {
    const date = new Date()
    let year = date.getFullYear()
    const copyrightTag = document.querySelector('#copyright')
    copyrightTag.innerHTML = `&copy; Copyright ${year} Justin Rignault. All Rights Reserved`
}