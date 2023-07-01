const inputGrid = document.getElementById('inputGrid')
const inputWeight = document.getElementById('inputWeight')
const inputGender = document.getElementById('inputGender')
const drinkTable = document.getElementById('drinkTable')
let history = localStorage.getItem('history')
  ? JSON.parse(localStorage.getItem('history'))
  : []

const drunkEmojis = [
  // BAC in ‰
  {bac: 0, emoji: '🤔'},
  {bac: 0.3, emoji: '😄'},
  {bac: 0.5, emoji: '🥳'},
  {bac: 0.8, emoji: '🤪'},
  {bac: 1, emoji: '😵'},
  {bac: 1.5, emoji: '🤢'},
  {bac: 2, emoji: '🤮'},
  {bac: 3, emoji: '💀'},
  {bac: 4, emoji: '👻'},
  {bac: 5, emoji: '👽'},
]

const drinks = {
  bier: {
    name: 'Bier',
    volume: 0.33,
    alcohol: 0.05,
  },
  mischbier: {
    name: 'Mischbier',
    volume: 0.33,
    alcohol: 0.025,
  },
  weinschorle: {
    name: 'Weinschorle',
    volume: 0.5,
    alcohol: 0.065,
  },
  longdrink: {
    name: 'Longdrink / Cocktail',
    volume: 0.2,
    alcohol: 0.15,
  },
  shot: {
    name: 'Shot',
    volume: 0.04,
    alcohol: 0.4,
  },
  mojito: {
    name: 'Mojito',
    volume: 0.24,
    alcohol: 0.125,
  },
  sob: {
    name: 'Sex on the Beach',
    volume: 0.27,
    alcohol: 0.13,
  },
  caip: {
    name: 'Caipi',
    volume: 0.22,
    alcohol: 0.175,
  },
  liit: {
    name: 'Long Island Iced Tea',
    volume: 0.2,
    alcohol: 0.35,
  },
  blhawaii: {
    name: 'Blue Hawaiian',
    volume: 0.24,
    alcohol: 0.155,
  },
}

// Load values from localStorage
if (localStorage.getItem('weight') && localStorage.getItem('gender')) {
  inputWeight.value = localStorage.getItem('weight')
  inputGender.value = localStorage.getItem('gender')
  inputGrid.parentElement.classList.add('active')
  if (localStorage.getItem('history')) work()
}

inputWeight.addEventListener('keyup', (e) => {
  localStorage.setItem('weight', e.target.value)
  if (inputGender.value !== '') inputGrid.parentElement.classList.add('active')
  work()
})

inputGender.addEventListener('change', (e) => {
  localStorage.setItem('gender', e.target.value)
  if (inputWeight.value) inputGrid.parentElement.classList.add('active')
  work()
})

if (localStorage.getItem('history')) {
  history = JSON.parse(localStorage.getItem('history'))

  history.forEach((entry) => {
    const row = document.createElement('tr')
    // Time, Name, Delete Button
    row.innerHTML = `
      <td>${new Date(entry.time).toLocaleTimeString()}</td>
      <td>${drinks[entry.drink].name} (${drinks[entry.drink].volume}l, ${
      drinks[entry.drink].alcohol * 100
    }%)</td>
    `
    const td = document.createElement('td')
    td.classList.add('right-align')
    const a = document.createElement('a')
    const i = document.createElement('i')
    i.innerText = 'delete'
    a.appendChild(i)
    a.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      history = history.filter((e) => e.time !== entry.time)
      localStorage.setItem('history', JSON.stringify(history))
      row.remove()
      work()
    })
    td.appendChild(a)
    row.appendChild(td)

    // Prepend to table
    drinkTable.prepend(row)
  })
}

document.querySelectorAll('#inputGrid button').forEach((button) => {
  button.addEventListener('click', (e) => {
    const drink = button.getAttribute('name')

    if (!drinks[drink]) return

    const time = new Date().getTime()
    history.push({
      drink,
      time,
    })

    localStorage.setItem('history', JSON.stringify(history))

    // Add to table
    const row = document.createElement('tr')
    // Time, Name, Delete Button
    row.innerHTML = `
      <td>${new Date().toLocaleTimeString()}</td>
      <td>${drinks[drink].name} (${drinks[drink].volume}l, ${
      drinks[drink].alcohol * 100
    }%)</td>    `
    const td = document.createElement('td')
    td.classList.add('right-align')
    const a = document.createElement('a')
    const i = document.createElement('i')
    i.innerText = 'delete'
    a.appendChild(i)
    a.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      history = history.filter((e) => e.time !== time)
      localStorage.setItem('history', JSON.stringify(history))
      row.remove()
      work()
    })
    td.appendChild(a)
    row.appendChild(td)
    // Prepend to table
    drinkTable.prepend(row)

    work()
  })
})

function work() {
  // Get weight and gender
  const weight = inputWeight.value
  const gender = inputGender.value

  // Validate
  if (!weight || !gender || weight <= 0) {
    return
  }

  // Factor
  let factor = 0
  if (gender === 'm') {
    alcoholDistributionRatio = 0.68 //average for males
  } else if (gender === 'w') {
    alcoholDistributionRatio = 0.55 //average for females
  } else if (gender === 'd') {
    // Average
    alcoholDistributionRatio = 0.615
  }

  const gramsFactor = 789 //g, 1 l of ethanol weights 789g

  // Calculate
  let promille = 0
  let time = history[0]?.time
  for (const drink of history) {
    const drinkTime = drink.time
    const drinkVolume = drinks[drink.drink].volume
    const drinkAlcohol = drinks[drink.drink].alcohol
    const drinkGrams = drinkVolume * drinkAlcohol * gramsFactor
    const drinkPromille = drinkGrams / (weight * alcoholDistributionRatio)
    promille += drinkPromille

    // Handle time decay
    promille -= (drinkTime - time) / 1000 / 60 / 60 / 10 // 1 promille per hour
    promille = Math.max(0, promille)

    time = drinkTime
  }
  promille -= (new Date().getTime() - time) / 1000 / 60 / 60 / 10 // 1 promille per hour
  promille = Math.max(0, promille)

  if (!promille) promille = 0

  let emoji = ''
  for (const e of drunkEmojis) {
    if (promille >= e.bac) emoji = e.emoji
    else break
  }

  // Output
  document.getElementById('output').innerHTML = `Promille: ${promille.toFixed(
    2
  )}‰ ${emoji} ${promille > 0.5 ? '<br/>⛔🚗🚫' : ''}`
  document.getElementById('output').style.filter = `blur(${Math.min(
    promille,
    2
  )}px)`
}

setInterval(work, 60 * 1000)

// beforeinstallprompt
let deferredPrompt
const addBtn = document.getElementById('installPWA')
const logoRight = document.getElementById('logoRight')

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  addBtn.style.display = 'flex'

  logoRight.style.display = 'none'

  addBtn.addEventListener('click', (e) => {
    addBtn.style.display = 'none'
    logoRight.style.display = 'block'
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
      } else {
      }
      deferredPrompt = null
    })
  })
})
