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
    alcohol: 0.08,
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
      <td>${drink.name} (${drink.volume}l, ${drink.alcohol * 100}%)</td>    `
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

  const gramsFactor = 0.789 //g, 1 ml of ethanol weights 0.789g

  // Calculate
  let promille = 0
  let time = history[0]?.time
  for (const drink of history) {
    promille +=
      ((drinks[drink.drink].volume *
        drinks[drink.drink].alcohol *
        gramsFactor) /
        (alcoholDistributionRatio * weight)) *
      1000
    promille -= (time - drink.time) / 1000 / 60 / 60 / 10 // 1 promille per hour
    time = drink.time
    promille = Math.max(0, promille)
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
}
