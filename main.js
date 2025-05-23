const inputGrid = document.getElementById('inputGrid')
const inputWeight = document.getElementById('inputWeight')
const inputGender = document.getElementById('inputGender')
const inputFood = document.getElementById('inputFood')
const inputBodyType = document.getElementById('inputBodyType')
const inputDecayRate = document.getElementById('inputDecayRate')
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

const rFactors = {
  male: { slim: 0.73, average: 0.68, aboveaverage: 0.60 },
  female: { slim: 0.60, average: 0.55, aboveaverage: 0.50 },
  diverse: { slim: 0.665, average: 0.615, aboveaverage: 0.55 } // Averages
};

const drinks = {
  bier: {
    name: 'Bier',
    pils: {
      name: 'Pils',
      volume: 0.33,
      alcohol: 0.05,
      sound: 'beer.webm',
    },
    weizen: {
      name: 'Weizen',
      volume: 0.5,
      alcohol: 0.05,
      sound: 'beer.webm',
    },
    bockbier: {
      name: 'Bockbier',
      volume: 0.5,
      alcohol: 0.07,
      sound: 'beer.webm',
    },
    kellerbier: {
      name: 'Kellerbier',
      volume: 0.5,
      alcohol: 0.05,
      sound: 'beer.webm',
    },
    helles: {
      name: 'Helles',
      volume: 0.5,
      alcohol: 0.05,
      sound: 'beer.webm',
    },
    dunkles: {
      name: 'Dunkles',
      volume: 0.5,
      alcohol: 0.05,
      sound: 'beer.webm',
    },
  },
  mischbier: {
    name: 'Mischbier',
    radler: {
      name: 'Radler',
      volume: 0.5,
      alcohol: 0.02,
      sound: 'beer.webm',
    },
    desperados: {
      name: 'Desperados',
      volume: 0.33,
      alcohol: 0.057,
      sound: 'beer.webm',
    },
    colabier: {
      name: 'Colabier',
      volume: 0.33,
      alcohol: 0.04,
      sound: 'beer.webm',
    },
    astrarakete: {
      name: 'AstraRakete',
      volume: 0.33,
      alcohol: 0.05,
      sound: 'beer.webm',
    },
    mixery: {
      name: 'Mixery',
      volume: 0.33,
      alcohol: 0.05,
      sound: 'beer.webm',
    },
    weiteres_bier: {
      name: 'Sonstiges',
      volume: 0.5,
      alcohol: 0.05,
      sound: 'beer.webm',
    },
  },
  weinschorle: {
    name: 'Weinschorle',
    weisherbstschorle: {
      name: 'Weißherbstschorle',
      volume: 0.25,
      alcohol: 0.06,
      sound: 'schorle.webm',
    },
    rieslingschorle: {
      name: 'Rieslingschorle',
      volume: 0.25,
      alcohol: 0.07,
      sound: 'schorle.webm',
    },
    persching: {
      name: 'Persching',
      volume: 0.2,
      alcohol: 0.05,
      sound: 'schorle.webm',
    },
    colarot: {
      name: 'Cola Rot',
      volume: 0.3,
      alcohol: 0.05,
      sound: 'schorle.webm',
    },
    hugo: {
      name: 'Hugo',
      volume: 0.25,
      alcohol: 0.08,
      sound: 'schorle.webm',
    },
    sangria: {
      name: 'Sangria',
      volume: 0.25,
      alcohol: 0.1,
      sound: 'schorle.webm',
    },
    aperol: {
      name: 'Aperol Spritz',
      volume: 0.3,
      alcohol: 0.12,
      sound: 'schorle.webm',
    },
    traubensaftschorle: {
      name: 'Traubensaftschorle',
      volume: 0.2,
      alcohol: 0.0,
      sound: 'schorle.webm',
    },
  },
  shot: {
    name: 'Shot',
    luft: {
      name: 'Berliner Luft',
      volume: 0.02,
      alcohol: 0.4,
      sound: 'shot.webm',
    },
    pffefi: {
      name: 'Pfeffi',
      volume: 0.02,
      alcohol: 0.4,
      sound: 'shot.webm',
    },
    luft: {
      name: 'Berliner Luft',
      volume: 0.02,
      alcohol: 0.4,
      sound: 'shot.webm',
    },
    jäger: {
      name: 'Jägermeister',
      volume: 0.02,
      alcohol: 0.35,
      sound: 'shot.webm',
    },
    sauer: {
      name: 'Saurer Apfel',
      volume: 0.02,
      alcohol: 0.16,
      sound: 'shot.webm',
    },
    hut: {
      name: 'Hütchen',
      volume: 0.02,
      alcohol: 0.4,
      sound: 'shot.webm',
    },
    nuss: {
      name: 'Nussler',
      volume: 0.02,
      alcohol: 0.25,
      sound: 'shot.webm',
    },
  },
  cocktails: {
    name: 'Cocktails',
    mojito: {
      name: 'Mojito',
      volume: 0.24,
      alcohol: 0.125,
      sound: 'cocktail.webm',
    },
    sob: {
      name: 'Sex on the Beach',
      volume: 0.27,
      alcohol: 0.13,
      sound: 'cocktail.webm',
    },
    caipi: {
      name: 'Caipi',
      volume: 0.22,
      alcohol: 0.175,
      sound: 'cocktail.webm',
    },
    liit: {
      name: 'Long Island Iced Tea',
      volume: 0.2,
      alcohol: 0.35,
      sound: 'cocktail.webm',
    },
    blhawaii: {
      name: 'Blue Hawaiian',
      volume: 0.24,
      alcohol: 0.155,
      sound: 'cocktail.webm',
    },
    cuba: {
      name: 'Cuba Libre',
      volume: 0.16,
      alcohol: 0.4,
      sound: 'cocktail.webm',
    },
    pina: {
      name: 'Pina Colada',
      volume: 0.2,
      alcohol: 0.1,
      sound: 'cocktail.webm',
    },
    penis: {
      name: 'Penis',
      volume: 0.27,
      alcohol: 0.13,
      sound: 'penis.webm',
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
  if (localStorage.getItem('hasEaten')) {
    inputFood.checked = localStorage.getItem('hasEaten') === 'true';
  }
  if (localStorage.getItem('bodyType')) {
    inputBodyType.value = localStorage.getItem('bodyType');
  }
  if (localStorage.getItem('decayRate')) {
    inputDecayRate.value = localStorage.getItem('decayRate');
  }
  inputGrid.parentElement.classList.add('active');
  work(); // Call work if personal data is loaded and section is active
}

inputFood.addEventListener('change', (e) => {
  localStorage.setItem('hasEaten', e.target.checked);
  work(); // Recalculate if food status changes
});

inputBodyType.addEventListener('change', (e) => {
  localStorage.setItem('bodyType', e.target.value);
  work(); // Recalculate
});

inputDecayRate.addEventListener('change', (e) => {
  localStorage.setItem('decayRate', e.target.value);
  work(); // Recalculate
});

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

        if (!drinks[category][drink]) return

        // If sound
        if (drinks[category][drink].sound) {
          const audio = new Audio(
            `audio/${drinks[category][drink].sound}?${new Date().getTime()}`
          )
          audio.play()
        }

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
  const bodyType = inputBodyType.value;
  const hasEaten = inputFood.checked;
  const currentAbsorptionTimeMs = hasEaten ? ABSORPTION_TIME_WITH_FOOD_MS : ABSORPTION_TIME_EMPTY_STOMACH_MS;

  // Validate
  if (!weight || !gender || weight <= 0 || !bodyType || !inputDecayRate.value) { // Added check for decay rate value
    return
  }

  // Determine alcohol distribution ratio (Widmark r factor)
  let alcoholDistributionRatio;
  if (gender === 'm' && rFactors.male[bodyType]) {
    alcoholDistributionRatio = rFactors.male[bodyType];
  } else if (gender === 'w' && rFactors.female[bodyType]) {
    alcoholDistributionRatio = rFactors.female[bodyType];
  } else if (gender === 'd' && rFactors.diverse[bodyType]) { // 'd' for diverse
    alcoholDistributionRatio = rFactors.diverse[bodyType];
  } else {
    // Fallback to a general average if inputs are somehow invalid
    alcoholDistributionRatio = rFactors.diverse.average; // A sensible default
  }

  let totalPromille = 0;
  const currentTime = new Date().getTime();

  if (drinkHistory.length === 0) {
    promille = 0;
  } else {
    for (const entry of drinkHistory) {
      const drinkData = drinks[entry.category][entry.drink];
      const drinkVolumeL = drinkData.volume; // in Liters
      const alcoholPercentage = drinkData.alcohol; // e.g., 0.05 for 5%

      // Amount of alcohol in grams
      const alcoholGrams = drinkVolumeL * alcoholPercentage * ETHANOL_DENSITY_G_PER_L;

      // Initial promille contribution from this drink (Widmark formula)
      // BAC (‰) = (Alcohol Mass (g) / (Body Weight (kg) * Distribution Ratio)) * 1 (since we use ‰ directly)
      // Note: Original formula is often *100 for %, but here it's for ‰ so direct ratio is fine.
      // The formula implicitly uses density of blood similar to water (1 kg/L)
      // and result is per mille (g alcohol / kg body water), effectively g/kg or ‰.
      const initialDrinkPromille = alcoholGrams / (weight * alcoholDistributionRatio);

      const timeSinceConsumption = currentTime - entry.time;
      let currentDrinkPromille;
      const selectedDecayRate = parseFloat(inputDecayRate.value);

      if (timeSinceConsumption < currentAbsorptionTimeMs) {
        // Drink is in absorption phase
        currentDrinkPromille = initialDrinkPromille * (timeSinceConsumption / currentAbsorptionTimeMs);
      } else {
        // Drink is past absorption phase, decay applies
        const timeAfterAbsorptionPeak = timeSinceConsumption - currentAbsorptionTimeMs;
        const hoursAfterAbsorptionPeak = timeAfterAbsorptionPeak / MS_PER_HOUR;
        const decay = hoursAfterAbsorptionPeak * selectedDecayRate;
        currentDrinkPromille = Math.max(0, initialDrinkPromille - decay);
      }
      totalPromille += currentDrinkPromille;
    }
  }
  // Assign to the variable name used by subsequent logic
  let promille = totalPromille;

  if (!promille) promille = 0; // Ensure NaN or undefined becomes 0, though Math.max should prevent NaN.

  let emoji = ''
  for (const e of drunkEmojis) {
    if (promille >= e.bac) emoji = e.emoji
    else break
  }

  // Apply/remove CSS effects based on promille
  const outputElement = document.getElementById('output');

  // Shaking Effect
  if (promille > 1.0) {
    document.body.classList.add('effect-shake');
  } else {
    document.body.classList.remove('effect-shake');
  }

  // Tilting Effect
  if (promille > 1.5) {
    document.body.classList.add('effect-tilt');
  } else {
    document.body.classList.remove('effect-tilt');
  }

  // Wavy Text Effect
  if (promille > 2.0) {
    outputElement.classList.add('effect-wavy-text');
  } else {
    outputElement.classList.remove('effect-wavy-text');
  }

  // Output
  outputElement.innerHTML = `Promille: ${promille.toFixed(
    2
  )}‰ ${emoji} ${promille > 0.5 ? '<br/>⛔🚗🚫' : ''}`
  outputElement.style.filter = `blur(${Math.min(
    promille,
    2
  )}px)`
}

setInterval(work, 60 * 1000) // Recalculate every minute to update decay

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
