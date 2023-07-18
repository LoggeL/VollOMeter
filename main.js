const inputGrid = document.getElementById('inputGrid')
const inputWeight = document.getElementById('inputWeight')
const inputGender = document.getElementById('inputGender')
const drinkTable = document.getElementById('drinkTable')
const dialogDrink = document.getElementById('dialogDrink')
const dialogGrid = dialogDrink.querySelector('.grid')
const dialogCaption = dialogDrink.querySelector('h5')

let drinkHistory = localStorage.getItem('drinkHistory')
  ? JSON.parse(localStorage.getItem('drinkHistory'))
  : []

const drunkEmojis = [
  // BAC in ‰
  { bac: 0, emoji: '🤔' },
  { bac: 0.3, emoji: '😄' },
  { bac: 0.5, emoji: '🥳' },
  { bac: 0.8, emoji: '🤪' },
  { bac: 1, emoji: '😵' },
  { bac: 1.5, emoji: '🤢' },
  { bac: 2, emoji: '🤮' },
  { bac: 3, emoji: '💀' },
  { bac: 4, emoji: '👻' },
  { bac: 5, emoji: '👽' },
]

const drinks = {
  bier: {
    name: 'Bier',
    pils: {
      name: 'Pils',
      volume: 0.33,
      alcohol: 0.05,
    },
    weizen: {
      name: 'Weizen',
      volume: 0.5,
      alcohol: 0.05,
    },
    bockbier: {
      name: 'Bockbier',
      volume: 0.5,
      alcohol: 0.07,
    },
    kellerbier: {
      name: 'Kellerbier',
      volume: 0.5,
      alcohol: 0.05,
    },
    helles: {
      name: 'Helles',
      volume: 0.5,
      alcohol: 0.05,
    },
    dunkles: {
      name: 'Dunkles',
      volume: 0.5,
      alcohol: 0.05,
    },
  },
  mischbier: {
    name: 'Mischbier',
    radler: {
      name: 'Radler',
      volume: 0.5,
      alcohol: 0.02,
    },
    desperados: {
      name: 'Desperados',
      volume: 0.33,
      alcohol: 0.057,
    },
    colabier: {
      name: 'Colabier',
      volume: 0.33,
      alcohol: 0.04,
    },
    astrarakete: {
      name: 'AstraRakete',
      volume: 0.33,
      alcohol: 0.05,
    },
    mixery: {
      name: 'Mixery',
      volume: 0.33,
      alcohol: 0.05,
    },
    weiteres_bier: {
      name: 'Sonstiges',
      volume: 0.5,
      alcohol: 0.05,
    },
  },
  weinschorle: {
    name: 'Weinschorle',
    weisherbstschorle: {
      name: 'Weißherbstschorle',
      volume: 0.25,
      alcohol: 0.06,
    },
    rieslingschorle: {
      name: 'Rieslingschorle',
      volume: 0.25,
      alcohol: 0.07,
    },
    persching: {
      name: 'Persching',
      volume: 0.2,
      alcohol: 0.05,
    },
    colarot: {
      name: 'Cola Rot',
      volume: 0.3,
      alcohol: 0.05,
    },
    hugo: {
      name: 'Hugo',
      volume: 0.25,
      alcohol: 0.08,
    },
    sangria: {
      name: 'Sangria',
      volume: 0.25,
      alcohol: 0.1,
    },
    aperol: {
      name: 'Aperol Spritz',
      volume: 0.3,
      alcohol: 0.12,
    },
    traubensaftschorle: {
      name: 'Traubensaftschorle',
      volume: 0.2,
      alcohol: 0.0,
    },
  },
  shot: {
    name: 'Shot',
    luft: {
      name: 'Berliner Luft',
      volume: 0.02,
      alcohol: 0.4,
    },
    pffefi: {
      name: 'Pfeffi',
      volume: 0.02,
      alcohol: 0.4,
    },
    luft: {
      name: 'Berliner Luft',
      volume: 0.02,
      alcohol: 0.4,
    },
    jäger: {
      name: 'Jägermeister',
      volume: 0.02,
      alcohol: 0.35,
    },
    sauer: {
      name: 'Saurer Apfel',
      volume: 0.02,
      alcohol: 0.16,
    },
    hut: {
      name: 'Hütchen',
      volume: 0.02,
      alcohol: 0.4,
    },
    nuss: {
      name: 'Nussler',
      volume: 0.02,
      alcohol: 0.25,
    },
  },
  cocktails: {
    name: 'Cocktails',
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
    caipi: {
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
    cuba: {
      name: 'Cuba Libre',
      volume: 0.16,
      alcohol: 0.4,
    },
    pina: {
      name: 'Pina Colada',
      volume: 0.2,
      alcohol: 0.1,
    },
    penis: {
      name: 'Penis',
      volume: 0.27,
      alcohol: 0.13,

    },
  },
  other: {
    name: 'Sonstiges',
  },
}

// Load values from localStorage
if (localStorage.getItem('weight') && localStorage.getItem('gender')) {
  inputWeight.value = localStorage.getItem('weight')
  inputGender.value = localStorage.getItem('gender')
  inputGrid.parentElement.classList.add('active')
  if (localStorage.getItem('drinkHistory')) work()
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

if (localStorage.getItem('drinkHistory')) {
  drinkHistory = JSON.parse(localStorage.getItem('drinkHistory'))

  drinkHistory.forEach((entry) => {
    const { category, drink, time } = entry
    // Add to table
    const row = document.createElement('tr')

    // Time block
    const tdTime = document.createElement('td')
    tdTime.innerText = new Date(time).toLocaleTimeString()
    row.appendChild(tdTime)

    // Name block
    const tdName = document.createElement('td')
    tdName.innerText = `${drinks[category][drink].name} (${drinks[category][
      drink
    ].volume.toFixed(2)}l, ${(drinks[category][drink].alcohol * 100).toFixed(
      1
    )}%)`
    row.appendChild(tdName)

    // delete block
    const td = document.createElement('td')
    td.classList.add('right-align')
    const a = document.createElement('a')
    const i = document.createElement('i')
    i.innerText = 'delete'
    a.appendChild(i)
    a.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      drinkHistory = drinkHistory.filter((e) => e.time !== time)
      localStorage.setItem('drinkHistory', JSON.stringify(drinkHistory))
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
    dialogDrink.classList.add('active')
    const category = button.getAttribute('name')

    dialogCaption.innerText = drinks[category].name
    // fill dialog with buttons for the sub drinks
    dialogGrid.innerHTML = ''
    Object.keys(drinks[category]).forEach((drink, index) => {
      if (drink === 'name') return
      const button = document.createElement('button')
      button.setAttribute('name', drink)
      button.className =
        'responsive s12 m6 ' + (index % 4 <= 1 ? 'orange' : 'pink')
      button.addEventListener('click', (e) => {
        dialogDrink.classList.remove('active')
        const drink = button.getAttribute('name')

        // when wich get pressed is called penis play the sound penis.wav on the browser in form of browser audio in 50% volumen
        if (drink === 'penis') {
          const audio = new Audio('PENIS.wav')
          audio.volume = 0.5
          audio.play()
        }
        







        if (!drinks[category][drink]) return

        const time = new Date().getTime()
        drinkHistory.push({
          category,
          time,
          drink,
        })







        localStorage.setItem('drinkHistory', JSON.stringify(drinkHistory))

        // Add to table
        const row = document.createElement('tr')

        // Time block
        const tdTime = document.createElement('td')
        tdTime.innerText = new Date().toLocaleTimeString()
        row.appendChild(tdTime)

        // Name block
        const tdName = document.createElement('td')
        tdName.innerText = `${drinks[category][drink].name} (${drinks[category][
          drink
        ].volume.toFixed(2)}l, ${(
          drinks[category][drink].alcohol * 100
        ).toFixed(1)}%)`
        row.appendChild(tdName)

        // delete block
        const td = document.createElement('td')
        td.classList.add('right-align')
        const a = document.createElement('a')
        const i = document.createElement('i')
        i.innerText = 'delete'
        a.appendChild(i)
        a.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          drinkHistory = drinkHistory.filter((e) => e.time !== time)
          localStorage.setItem('drinkHistory', JSON.stringify(drinkHistory))
          row.remove()
          work()
        })
        td.appendChild(a)
        row.appendChild(td)
        // Prepend to table
        drinkTable.prepend(row)

        work()
      })

      // <button>
      //   <img class="responsive" src="/favicon.png">
      //   <span>Button</span>
      // </button>
      const img = document.createElement('img')
      img.className = 'responsive'
      img.src = `img/${category}/${drink}.png`
      button.prepend(img)

      const span = document.createElement('span')
      span.innerText = drinks[category][drink].name
      button.appendChild(span)

      dialogGrid.appendChild(button)
    })
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
  let time = drinkHistory[0]?.time
  for (const entry of drinkHistory) {
    const drinkTime = entry.time
    const drinkVolume = drinks[entry.category][entry.drink].volume
    const drinkAlcohol = drinks[entry.category][entry.drink].alcohol
    const drinkGrams = drinkVolume * drinkAlcohol * gramsFactor
    const drinkPromille = drinkGrams / (weight * alcoholDistributionRatio)
    promille += drinkPromille

    // Handle time decay
    promille -= (drinkTime - time) / 1000 / 60 / 60 / 10 // 0.1 promille per hour
    promille = Math.max(0, promille)

    time = drinkTime
  }
  promille -= (new Date().getTime() - time) / 1000 / 60 / 60 / 10 // 0.1 promille per hour
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
