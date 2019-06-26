'use strict'

const currencies = [
  {
    name: 'US Dollar',
    abbreviation: 'USD',
    symbol: '&#36;',
    flag: '../img/us.gif'
  },
  {
    name: 'Euro',
    abbreviation: 'EUR',
    symbol: '&#8364;',
    flag: '../img/eu.gif'
  },
  {
    name: 'Japanese Yen',
    abbreviation: 'JPY',
    symbol: '&#165;',
    flag: '../img/jp.gif'
  },
  {
    name: 'British Pound',
    abbreviation: 'GBP',
    symbol: '&#163;',
    flag: '../img/uk.gif'
  },
  {
    name: 'Australian Dollar',
    abbreviation: 'AUD',
    symbol: '&#36;',
    flag: '../img/au.gif'
  },
  {
    name: 'Canadian Dollar',
    abbreviation: 'CAD',
    symbol: '&#36;',
    flag: '../img/ca.gif'
  },
  {
    name: 'Swiss Franc',
    abbreviation: 'CHF',
    symbol: '&#67;&#72;&#70;',
    flag: '../img/ch.gif'
  },
  {
    name: 'Chinese Yuan Renminbi',
    abbreviation: 'CNY',
    symbol: '&#165;',
    flag: '../img/cn.gif'
  },
  {
    name: 'Swedish Krona',
    abbreviation: 'SEK',
    symbol: '&#107;&#114;',
    flag: '../img/se.gif'
  },
  {
    name: 'New Zealand Dollar',
    abbreviation: 'NZD',
    symbol: '&#36;',
    flag: '../img/nz.gif'
  },
  {
    name: 'Mexican Peso',
    abbreviation: 'MXN',
    symbol: '&#36;',
    flag: '../img/mx.gif'
  },
  {
    name: 'Singapore Dollar',
    abbreviation: 'SGD',
    symbol: '&#36;',
    flag: '../img/sg.gif'
  },
  {
    name: 'Hong Kong Dollar',
    abbreviation: 'HKD',
    symbol: '&#36;',
    flag: '../img/hk.gif'
  },
  {
    name: 'Norwegian Krone',
    abbreviation: 'NOK',
    symbol: '&#107;&#114;',
    flag: '../img/no.gif'
  },
  {
    name: 'South Korean Won',
    abbreviation: 'KRW',
    symbol: '&#8361;',
    flag: '../img/kr.gif'
  },
  {
    name: 'Turkish Lira',
    abbreviation: 'TRY',
    symbol: '&#8378;',
    flag: '../img/tr.gif'
  },
  {
    name: 'Russian Ruble',
    abbreviation: 'RUB',
    symbol: '&#8381;',
    flag: '../img/ru.gif'
  },
  {
    name: 'Indian Rupee',
    abbreviation: 'INR',
    symbol: '&#8377;',
    flag: '../img/in.gif'
  },
  {
    name: 'Brazilian Real',
    abbreviation: 'BRL',
    symbol: '&#82;&#36;',
    flag: '../img/br.gif'
  },
  {
    name: 'South African Rand',
    abbreviation: 'ZAR',
    symbol: '&#82;',
    flag: '../img/za.gif'
  },
  {
    name: 'Philippine Peso',
    abbreviation: 'PHP',
    symbol: '&#8369;',
    flag: '../img/ph.gif'
  },
  {
    name: 'Czech Koruna',
    abbreviation: 'CZK',
    symbol: '&#75;&#269;',
    flag: '../img/cz.gif'
  },
  {
    name: 'Indonesian Rupiah',
    abbreviation: 'IDR',
    symbol: '&#82;&#112;',
    flag: '../img/id.gif'
  },
  {
    name: 'Malaysian Ringgit',
    abbreviation: 'MYR',
    symbol: '&#82;&#77;',
    flag: '../img/my.gif'
  },
  {
    name: 'Hungarian Forint',
    abbreviation: 'HUF',
    symbol: '&#70;&#116;',
    flag: '../img/hu.gif'
  },
  {
    name: 'Icelandic Krona',
    abbreviation: 'ISK',
    symbol: '&#107;&#114;',
    flag: '../img/is.gif'
  },
  {
    name: 'Croatian Kuna',
    abbreviation: 'HRK',
    symbol: '&#107;&#110;',
    flag: '../img/hr.gif'
  },
  {
    name: 'Bulgarian Lev',
    abbreviation: 'BGN',
    symbol: '&#1083;&#1074;',
    flag: '../img/bg.gif'
  },
  {
    name: 'Romanian Leu',
    abbreviation: 'RON',
    symbol: '&#108;&#101;&#105;',
    flag: '../img/ro.gif'
  },
  {
    name: 'Danish Krone',
    abbreviation: 'DKK',
    symbol: '&#107;&#114;',
    flag: '../img/dk.gif'
  },
  {
    name: 'Thai Baht',
    abbreviation: 'THB',
    symbol: '&#3647;',
    flag: '../img/th.gif'
  },
  {
    name: 'Polish Zloty',
    abbreviation: 'PLN',
    symbol: '&#122;&#322;',
    flag: '../img/pl.gif'
  },
  {
    name: 'Israeli Shekel',
    abbreviation: 'ILS',
    symbol: '&#8362;',
    flag: '../img/il.gif'
  }
]

// GLOBALS

const favourites = []
let baseCurrency
let baseCurrencyAmount



document.addEventListener('DOMContentLoaded', init)

function init(){
    getExchangeRates()
    addEventListeners()
    populateAddCurrencyList()
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
        
        let li = document.createElement('li')
        li.classList.add('favourite')
        li.setAttribute('id', fav.abbreviation)
        li.addEventListener('click', setBaseCurrency)
        if(fav.abbreviation == baseCurrency){
            li.classList.add('base-currency')
        }
        
        let img = document.createElement('img')
        img.src = fav.flag
        img.classList.add('flag')
        
        let div = document.createElement('div')
        div.classList.add('info')
        
        let p1 = document.createElement('p')
        p1.classList.add('input')
        
        let span1 = document.createElement('span')
        span1.classList.add('currency-symbol')
        span1.innerHTML = fav.symbol
        
        let input = document.createElement('input')
        input.setAttribute('placeholder', '0.00')
        input.setAttribute('value', '')
        input.addEventListener('input', updateFavouriteCurrenciesInputs)
        input.addEventListener('focusout', validateAndCleanInput)
        input.addEventListener('keydown', addEnterFunctionality)
        
        let p2 = document.createElement('p')
        p2.classList.add('currency-name')
        p2.innerHTML = `${fav.abbreviation} - ${fav.name}`
        
        let p3 = document.createElement('p')
        p3.classList.add('base-currency-rate')
        p3.innerHTML = `1 ${baseCurrency} = ${exchangeRate} ${fav.abbreviation}`
        
        let span2 = document.createElement('span')
        span2.classList.add('close')
        span2.innerHTML = 'x'
        span2.addEventListener('click', removeFromLocalStorage)

        
        p1.appendChild(span1)
        p1.appendChild(input)
        
        div.appendChild(p1)
        div.appendChild(p2)
        div.appendChild(p3)
        
        li.appendChild(img)
        li.appendChild(div)
        li.appendChild(span2)
        
        container.appendChild(li)
        
        input.closest('li').className.includes('base-currency') ? input.focus() : input.blur() //focus on input
    })
    

    
}

const deleteCards = elems => {
    for (let elem of elems){
        elem.parentNode.removeChild(elem)
    }
}

const populateAddCurrencyList = () => {
    
    const addCurrencyList = document.querySelector('.add-currency-list')
    
    while(addCurrencyList.hasChildNodes()){
        addCurrencyList.removeChild(addCurrencyList.querySelector('li'))
    }
    
//    currencies.sort((a, b) => (a.name > b.name) ? 1 : -1)
    
    currencies.forEach(currency => {
        
        let li = document.createElement('li')
        li.setAttribute('data-currency', currency.abbreviation)
        li.addEventListener('click', addCurrencyToFavourites)
        
        document.querySelectorAll('.favourite').forEach(elem => {
            if (elem.getAttribute('id') === currency.abbreviation){
                li.classList.add('disabled')
            }
        })
        
        let img = document.createElement('img')
        img.src = currency.flag
        img.classList.add('flag')
        
        let span = document.createElement('span')
        span.innerHTML = `${currency.abbreviation} - ${currency.name} &nbsp;(${currency.symbol})`
        
        li.appendChild(img)
        li.appendChild(span)
        
        addCurrencyList.appendChild(li)
    })
}

//EVENT LISTENERS

const addEventListeners = () => {    
    document.querySelector('.add-currency-btn').addEventListener('click', addCurrencyBtn)
}

const addCurrencyBtn = ev => {
    document.querySelector('.add-currency-btn').classList.toggle('open')
    populateAddCurrencyList()
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
        baseCurrencyAmount = newBaseCurrencyAmount;
        document.querySelectorAll('.favourite').forEach(favouriteLI => {
            if(favouriteLI.id!==baseCurrency) {
                const currencyRate = currencies.find(currency => currency.abbreviation === favouriteLI.id).rate;
                const exchangeRate = favouriteLI.id===baseCurrency ? 1 : (currencyRate/baseCurrencyRate).toFixed(4);
                favouriteLI.querySelector('.input input').value = exchangeRate*baseCurrencyAmount!==0 ? (exchangeRate*baseCurrencyAmount).toFixed(2) : '';
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



