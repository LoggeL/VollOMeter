// Constants
const ABSORPTION_TIME_EMPTY_STOMACH_MS = 30 * 60 * 1000 // 30 minutes in milliseconds
const ABSORPTION_TIME_WITH_FOOD_MS = 2 * 60 * 60 * 1000 // 2 hours in milliseconds
const ETHANOL_DENSITY_G_PER_L = 789.0 // g/L
const MS_PER_HOUR = 3600000 // milliseconds per hour

const inputGrid = document.getElementById('inputGrid')
const inputWeight = document.getElementById('inputWeight')
const inputGender = document.getElementById('inputGender')
const inputFood = document.getElementById('inputFood')
const inputBodyType = document.getElementById('inputBodyType')
const inputDecayRate = document.getElementById('inputDecayRate')
const drinkTable = document.getElementById('drinkTable')
const dialogDrink = document.getElementById('dialogDrink')
const dialogGrid = dialogDrink.querySelector('.modal-grid')
const dialogCaption = dialogDrink.querySelector('.modal-title')

let drinkHistory = localStorage.getItem('drinkHistory')
  ? JSON.parse(localStorage.getItem('drinkHistory'))
  : []

const drunkEmojis = [
  // BAC in ‰ with emojis
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
  male: { slim: 0.73, average: 0.68, aboveaverage: 0.6 },
  female: { slim: 0.6, average: 0.55, aboveaverage: 0.5 },
  diverse: { slim: 0.665, average: 0.615, aboveaverage: 0.55 }, // Averages
}

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
    name: 'Kurze',
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

// Function to check if form data is complete
function checkFormCompleteness() {
  const weight = inputWeight.value
  const gender = inputGender.value
  const bodyType = inputBodyType.value
  const decayRate = inputDecayRate.value

  const isComplete = weight && gender && bodyType && decayRate && weight > 0

  const formSection = document.querySelector('.form-section')
  if (isComplete) {
    formSection.classList.remove('incomplete')
    formSection.classList.add('complete')
  } else {
    formSection.classList.remove('complete')
    formSection.classList.add('incomplete')
  }

  return isComplete
}

// Function to update form collapse state based on completeness
function updateFormState() {
  const formSection = document.querySelector('.form-section')
  const isComplete = checkFormCompleteness()

  if (isComplete) {
    // Auto-collapse if complete and not manually overridden
    if (localStorage.getItem('formManuallyExpanded') !== 'true') {
      formSection.classList.add('collapsed')
      localStorage.setItem('formCollapsed', 'true')
    }
  } else {
    // Auto-expand if incomplete
    formSection.classList.remove('collapsed')
    localStorage.setItem('formCollapsed', 'false')
    localStorage.removeItem('formManuallyExpanded')
  }

  // Update header state
  const formHeader = formSection.querySelector('h3')
  const isCollapsed = formSection.classList.contains('collapsed')
  formHeader.style.opacity = isCollapsed ? '0.7' : '1'
}

// Load values from localStorage
if (localStorage.getItem('weight') && localStorage.getItem('gender')) {
  inputWeight.value = localStorage.getItem('weight')
  inputGender.value = localStorage.getItem('gender')
  if (localStorage.getItem('hasEaten')) {
    inputFood.checked = localStorage.getItem('hasEaten') === 'true'
  }
  if (localStorage.getItem('bodyType')) {
    inputBodyType.value = localStorage.getItem('bodyType')
  }
  if (localStorage.getItem('decayRate')) {
    inputDecayRate.value = localStorage.getItem('decayRate')
  }
  inputGrid.parentElement.classList.add('active')

  // Check form completeness and update state
  updateFormState()

  work() // Call work if personal data is loaded and section is active
} else {
  // If no data is loaded, ensure form is expanded
  const formSection = document.querySelector('.form-section')
  if (formSection) {
    formSection.classList.remove('collapsed')
    formSection.classList.add('incomplete')
  }
}

inputFood.addEventListener('change', (e) => {
  localStorage.setItem('hasEaten', e.target.checked)
  work() // Recalculate if food status changes
})

inputBodyType.addEventListener('change', (e) => {
  localStorage.setItem('bodyType', e.target.value)
  updateFormState() // Check completeness
  work() // Recalculate
})

inputDecayRate.addEventListener('change', (e) => {
  localStorage.setItem('decayRate', e.target.value)
  updateFormState() // Check completeness
  work() // Recalculate
})

inputWeight.addEventListener('keyup', (e) => {
  localStorage.setItem('weight', e.target.value)
  if (inputGender.value !== '') inputGrid.parentElement.classList.add('active')
  updateFormState() // Check completeness
  work()
})

inputGender.addEventListener('change', (e) => {
  localStorage.setItem('gender', e.target.value)
  if (inputWeight.value) inputGrid.parentElement.classList.add('active')
  updateFormState() // Check completeness
  work()
})

if (localStorage.getItem('drinkHistory')) {
  drinkHistory = JSON.parse(localStorage.getItem('drinkHistory'))

  drinkHistory.forEach((entry) => {
    const { category, drink, time } = entry
    // Add to table
    const row = document.createElement('tr')
    row.classList.add('drink-row')
    row.dataset.time = time

    // Time block
    const tdTime = document.createElement('td')
    tdTime.innerText = new Date(time).toLocaleTimeString()
    row.appendChild(tdTime)

    // Name block
    const tdName = document.createElement('td')

    let drinkData
    // Handle custom drinks
    if (category === 'other' && entry.customDrink) {
      drinkData = entry.customDrink
    } else {
      drinkData = drinks[category][drink]
    }

    // Skip if drink data not found
    if (!drinkData) return

    const nameText = `${drinkData.name} (${drinkData.volume
      .toFixed(2)
      .replace('.', ',')}l, ${(drinkData.alcohol * 100)
      .toFixed(1)
      .replace('.', ',')}%)`

    // Add absorption status indicator
    const statusSpan = document.createElement('span')
    statusSpan.className = 'absorption-status'
    statusSpan.innerHTML =
      ' <span class="status-indicator processing">~30 Min</span>'

    tdName.innerHTML = nameText
    tdName.appendChild(statusSpan)
    row.appendChild(tdName)

    // delete block
    const td = document.createElement('td')
    td.classList.add('text-right')
    const a = document.createElement('a')
    const i = document.createElement('i')
    i.className = 'fas fa-trash delete-icon'
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

  // Initialize progression markers for loaded drinks
  if (inputWeight.value && inputGender.value) {
    updateProgressionMarkers()
  }
}

// Function to get custom drinks from localStorage
function getCustomDrinks() {
  const customDrinks = localStorage.getItem('customDrinks')
  return customDrinks ? JSON.parse(customDrinks) : {}
}

// Function to save custom drinks to localStorage
function saveCustomDrinks(customDrinks) {
  localStorage.setItem('customDrinks', JSON.stringify(customDrinks))
}

// Function to add a new custom drink
function addCustomDrink(name, volume, alcohol) {
  const customDrinks = getCustomDrinks()
  const drinkKey = name.toLowerCase().replace(/[^a-z0-9]/g, '')

  customDrinks[drinkKey] = {
    name: name,
    volume: parseFloat(volume),
    alcohol: parseFloat(alcohol) / 100, // Convert percentage to decimal
    sound: 'beer.webm', // Default sound
  }

  saveCustomDrinks(customDrinks)
  return drinkKey
}

// Function to delete a custom drink
function deleteCustomDrink(drinkKey) {
  const customDrinks = getCustomDrinks()
  delete customDrinks[drinkKey]
  saveCustomDrinks(customDrinks)
}

// Function to create custom drink form
function createCustomDrinkForm() {
  const formHTML = `
    <div class="custom-drink-form" style="
      padding: 30px 20px;
      max-width: 420px;
      margin: 0 auto;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    ">
      <div style="
        text-align: center;
        margin-bottom: 30px;
      ">
        <div style="
          font-size: 64px;
          margin-bottom: 12px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        ">🍺</div>
        <h4 style="
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        ">Neues Getränk hinzufügen</h4>
        <p style="
          margin: 0;
          font-size: 16px;
          color: #7f8c8d;
          font-weight: 500;
        ">Erstelle dein eigenes Getränk</p>
      </div>
      
      <div style="display: grid; gap: 20px; margin-bottom: 30px;">
        <div class="input-group">
          <label style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-size: 16px;
            font-weight: 600;
            color: #34495e;
          ">🏷️ Name des Getränks</label>
          <input type="text" id="customDrinkName" placeholder="z.B. Mein Lieblingsbier" maxlength="30" style="
            width: 100%;
            padding: 16px 20px;
            border: 2px solid #e0e6ed;
            border-radius: 12px;
            font-size: 16px;
            background: #ffffff;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-sizing: border-box;
            font-family: inherit;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          " onfocus="this.style.borderColor='#3498db'; this.style.boxShadow='0 4px 16px rgba(52, 152, 219, 0.2)'; this.style.transform='translateY(-2px)'" onblur="this.style.borderColor='#e0e6ed'; this.style.boxShadow='0 2px 8px rgba(0, 0, 0, 0.04)'; this.style.transform='translateY(0)'">
        </div>
        
        <div class="input-group">
          <label style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-size: 16px;
            font-weight: 600;
            color: #34495e;
          ">📏 Volumen in Liter</label>
          <input type="number" id="customDrinkVolume" placeholder="0.33" step="0.01" min="0.01" max="5" style="
            width: 100%;
            padding: 16px 20px;
            border: 2px solid #e0e6ed;
            border-radius: 12px;
            font-size: 16px;
            background: #ffffff;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-sizing: border-box;
            font-family: inherit;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          " onfocus="this.style.borderColor='#3498db'; this.style.boxShadow='0 4px 16px rgba(52, 152, 219, 0.2)'; this.style.transform='translateY(-2px)'" onblur="this.style.borderColor='#e0e6ed'; this.style.boxShadow='0 2px 8px rgba(0, 0, 0, 0.04)'; this.style.transform='translateY(0)'">
                     <div style="
             display: flex;
             gap: 12px;
             margin-top: 8px;
             flex-wrap: wrap;
           ">
             <small class="volume-tip" data-volume="0.33" style="
               padding: 4px 8px;
               background: #ecf0f1;
               border-radius: 6px;
               font-size: 12px;
               color: #5d6d7e;
               font-weight: 500;
               cursor: pointer;
               transition: all 0.2s ease;
               user-select: none;
             " onmouseover="this.style.background='#3498db'; this.style.color='white'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#ecf0f1'; this.style.color='#5d6d7e'; this.style.transform='scale(1)'">0.33L (Dose)</small>
             <small class="volume-tip" data-volume="0.5" style="
               padding: 4px 8px;
               background: #ecf0f1;
               border-radius: 6px;
               font-size: 12px;
               color: #5d6d7e;
               font-weight: 500;
               cursor: pointer;
               transition: all 0.2s ease;
               user-select: none;
             " onmouseover="this.style.background='#3498db'; this.style.color='white'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#ecf0f1'; this.style.color='#5d6d7e'; this.style.transform='scale(1)'">0.5L (Flasche)</small>
             <small class="volume-tip" data-volume="0.2" style="
               padding: 4px 8px;
               background: #ecf0f1;
               border-radius: 6px;
               font-size: 12px;
               color: #5d6d7e;
               font-weight: 500;
               cursor: pointer;
               transition: all 0.2s ease;
               user-select: none;
             " onmouseover="this.style.background='#3498db'; this.style.color='white'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#ecf0f1'; this.style.color='#5d6d7e'; this.style.transform='scale(1)'">0.2L (Glas)</small>
           </div>
        </div>
        
        <div class="input-group">
          <label style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-size: 16px;
            font-weight: 600;
            color: #34495e;
          ">🌡️ Alkoholgehalt in %</label>
          <input type="number" id="customDrinkAlcohol" placeholder="5.0" step="0.1" min="0" max="80" style="
            width: 100%;
            padding: 16px 20px;
            border: 2px solid #e0e6ed;
            border-radius: 12px;
            font-size: 16px;
            background: #ffffff;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-sizing: border-box;
            font-family: inherit;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          " onfocus="this.style.borderColor='#3498db'; this.style.boxShadow='0 4px 16px rgba(52, 152, 219, 0.2)'; this.style.transform='translateY(-2px)'" onblur="this.style.borderColor='#e0e6ed'; this.style.boxShadow='0 2px 8px rgba(0, 0, 0, 0.04)'; this.style.transform='translateY(0)'">
                     <div style="
             display: flex;
             gap: 12px;
             margin-top: 8px;
             flex-wrap: wrap;
           ">
             <small class="alcohol-tip" data-alcohol="5" style="
               padding: 4px 8px;
               background: #ecf0f1;
               border-radius: 6px;
               font-size: 12px;
               color: #5d6d7e;
               font-weight: 500;
               cursor: pointer;
               transition: all 0.2s ease;
               user-select: none;
             " onmouseover="this.style.background='#e67e22'; this.style.color='white'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#ecf0f1'; this.style.color='#5d6d7e'; this.style.transform='scale(1)'">5% (Bier)</small>
             <small class="alcohol-tip" data-alcohol="12" style="
               padding: 4px 8px;
               background: #ecf0f1;
               border-radius: 6px;
               font-size: 12px;
               color: #5d6d7e;
               font-weight: 500;
               cursor: pointer;
               transition: all 0.2s ease;
               user-select: none;
             " onmouseover="this.style.background='#e67e22'; this.style.color='white'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#ecf0f1'; this.style.color='#5d6d7e'; this.style.transform='scale(1)'">12% (Wein)</small>
             <small class="alcohol-tip" data-alcohol="40" style="
               padding: 4px 8px;
               background: #ecf0f1;
               border-radius: 6px;
               font-size: 12px;
               color: #5d6d7e;
               font-weight: 500;
               cursor: pointer;
               transition: all 0.2s ease;
               user-select: none;
             " onmouseover="this.style.background='#e67e22'; this.style.color='white'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#ecf0f1'; this.style.color='#5d6d7e'; this.style.transform='scale(1)'">40% (Schnaps)</small>
           </div>
        </div>
      </div>
      
      <div style="display: flex; gap: 16px;">
        <button type="button" id="saveCustomDrink" style="
          flex: 1;
          padding: 18px 24px;
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(46, 204, 113, 0.3);
          font-family: inherit;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 24px rgba(46, 204, 113, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(46, 204, 113, 0.3)'">
          ✅ Speichern
        </button>
        <button type="button" id="cancelCustomDrink" style="
          flex: 1;
          padding: 18px 24px;
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(231, 76, 60, 0.3);
          font-family: inherit;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 24px rgba(231, 76, 60, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(231, 76, 60, 0.3)'">
          ❌ Abbrechen
        </button>
      </div>
      
      <div style="
        margin-top: 25px;
        padding: 16px 20px;
        background: linear-gradient(135deg, #e8f4f8, #f0f8ff);
        border-radius: 12px;
        border-left: 4px solid #3498db;
        box-shadow: 0 2px 8px rgba(52, 152, 219, 0.1);
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          color: #2980b9;
          font-weight: 700;
          margin-bottom: 8px;
        ">💡 Tipp</div>
        <div style="
          font-size: 14px;
          color: #34495e;
          line-height: 1.5;
          font-weight: 500;
        ">Alle Angaben findest du meist auf der Flasche oder Dose. Bei selbstgemischten Getränken schätze den Alkoholgehalt.</div>
      </div>
    </div>
  `
  return formHTML
}

document.querySelectorAll('#inputGrid button').forEach((button) => {
  button.addEventListener('click', (e) => {
    dialogDrink.classList.add('active')
    const category = button.getAttribute('name')

    dialogCaption.innerText = drinks[category].name
    // fill dialog with buttons for the sub drinks
    dialogGrid.innerHTML = ''

    // Special handling for "other" category (Sonstiges)
    if (category === 'other') {
      // Load custom drinks
      const customDrinks = getCustomDrinks()

      // Add custom drinks first
      Object.keys(customDrinks).forEach((drinkKey, index) => {
        const drink = customDrinks[drinkKey]
        const button = document.createElement('button')
        button.setAttribute('name', drinkKey)
        button.className =
          'modal-btn ' +
          (index % 4 <= 1 ? 'modal-btn-orange' : 'modal-btn-pink')
        button.style.position = 'relative'

        button.addEventListener('click', (e) => {
          dialogDrink.classList.remove('active')
          const drinkKey = button.getAttribute('name')

          if (!customDrinks[drinkKey]) return

          // Show drink pouring animation
          showDrinkAnimation(customDrinks[drinkKey].name, 'other', drinkKey)

          // Play default sound
          const audio = new Audio(`audio/beer.webm?${new Date().getTime()}`)
          audio.play()

          const time = new Date().getTime()
          drinkHistory.push({
            category: 'other',
            time,
            drink: drinkKey,
            customDrink: customDrinks[drinkKey], // Store custom drink data
          })

          localStorage.setItem('drinkHistory', JSON.stringify(drinkHistory))

          // Add to table
          const row = document.createElement('tr')
          row.classList.add('drink-row')
          row.dataset.time = time

          // Time block
          const tdTime = document.createElement('td')
          tdTime.innerText = new Date().toLocaleTimeString()
          row.appendChild(tdTime)

          // Name block
          const tdName = document.createElement('td')
          const nameText = `${customDrinks[drinkKey].name} (${customDrinks[
            drinkKey
          ].volume
            .toFixed(2)
            .replace('.', ',')}l, ${(customDrinks[drinkKey].alcohol * 100)
            .toFixed(1)
            .replace('.', ',')}%)`

          // Add absorption status indicator
          const statusSpan = document.createElement('span')
          statusSpan.className = 'absorption-status'
          statusSpan.innerHTML =
            ' <span class="status-indicator processing">~30 Min</span>'

          tdName.innerHTML = nameText
          tdName.appendChild(statusSpan)
          row.appendChild(tdName)

          // delete block
          const td = document.createElement('td')
          td.classList.add('text-right')
          const a = document.createElement('a')
          const i = document.createElement('i')
          i.className = 'fas fa-trash delete-icon'
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

        // Add delete button for custom drinks
        const deleteBtn = document.createElement('span')
        deleteBtn.innerHTML = '×'
        deleteBtn.style.cssText = `
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(255,255,255,0.8);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
          color: #333;
        `
        deleteBtn.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          if (confirm(`"${drink.name}" löschen?`)) {
            deleteCustomDrink(drinkKey)
            button.remove()
          }
        })

        const img = document.createElement('div')
        img.className = 'modal-img'
        img.style.cssText = `
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          color: white;
        `
        img.textContent = '🍺'
        button.prepend(img)

        const span = document.createElement('span')
        span.innerText = drink.name
        button.appendChild(span)
        button.appendChild(deleteBtn)

        dialogGrid.appendChild(button)
      })

      // Add "Add new drink" button
      const addButton = document.createElement('button')
      addButton.className = 'modal-btn modal-btn-orange'
      addButton.innerHTML = `
        <div class="modal-img" style="background: linear-gradient(135deg, #4CAF50, #45a049); color: white; display: flex; align-items: center; justify-content: center; font-size: 30px;">+</div>
        <span>Neues Getränk</span>
      `

      addButton.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()

        // Replace dialog content with form
        dialogGrid.innerHTML = createCustomDrinkForm()

        // Add click handlers for volume tips
        document.querySelectorAll('.volume-tip').forEach((tip) => {
          tip.addEventListener('click', () => {
            const volume = tip.getAttribute('data-volume')
            document.getElementById('customDrinkVolume').value = volume
            document.getElementById('customDrinkVolume').focus()
            // Brief highlight effect
            tip.style.background = '#27ae60'
            tip.style.color = 'white'
            setTimeout(() => {
              tip.style.background = '#ecf0f1'
              tip.style.color = '#5d6d7e'
            }, 200)
          })
        })

        // Add click handlers for alcohol tips
        document.querySelectorAll('.alcohol-tip').forEach((tip) => {
          tip.addEventListener('click', () => {
            const alcohol = tip.getAttribute('data-alcohol')
            document.getElementById('customDrinkAlcohol').value = alcohol
            document.getElementById('customDrinkAlcohol').focus()
            // Brief highlight effect
            tip.style.background = '#27ae60'
            tip.style.color = 'white'
            setTimeout(() => {
              tip.style.background = '#ecf0f1'
              tip.style.color = '#5d6d7e'
            }, 200)
          })
        })

        // Handle form submission
        document
          .getElementById('saveCustomDrink')
          .addEventListener('click', () => {
            const name = document.getElementById('customDrinkName').value.trim()
            const volume = document.getElementById('customDrinkVolume').value
            const alcohol = document.getElementById('customDrinkAlcohol').value

            if (!name || !volume || !alcohol) {
              alert('Bitte alle Felder ausfüllen')
              return
            }

            if (parseFloat(volume) <= 0 || parseFloat(volume) > 5) {
              alert('Volumen muss zwischen 0.01 und 5 Liter liegen')
              return
            }

            if (parseFloat(alcohol) < 0 || parseFloat(alcohol) > 80) {
              alert('Alkoholgehalt muss zwischen 0 und 80% liegen')
              return
            }

            addCustomDrink(name, volume, alcohol)
            dialogDrink.classList.remove('active')
          })

        document
          .getElementById('cancelCustomDrink')
          .addEventListener('click', () => {
            dialogDrink.classList.remove('active')
          })
      })

      dialogGrid.appendChild(addButton)
    } else {
      // Original behavior for other categories
      Object.keys(drinks[category]).forEach((drink, index) => {
        if (drink === 'name') return
        const button = document.createElement('button')
        button.setAttribute('name', drink)
        button.className =
          'modal-btn ' +
          (index % 4 <= 1 ? 'modal-btn-orange' : 'modal-btn-pink')
        button.addEventListener('click', (e) => {
          dialogDrink.classList.remove('active')
          const drink = button.getAttribute('name')

          if (!drinks[category][drink]) return

          // Show drink pouring animation
          showDrinkAnimation(drinks[category][drink].name, category, drink)

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
          row.classList.add('drink-row')
          row.dataset.time = time

          // Time block
          const tdTime = document.createElement('td')
          tdTime.innerText = new Date().toLocaleTimeString()
          row.appendChild(tdTime)

          // Name block
          const tdName = document.createElement('td')
          const nameText = `${drinks[category][drink].name} (${drinks[category][
            drink
          ].volume
            .toFixed(2)
            .replace('.', ',')}l, ${(drinks[category][drink].alcohol * 100)
            .toFixed(1)
            .replace('.', ',')}%)`

          // Add absorption status indicator
          const statusSpan = document.createElement('span')
          statusSpan.className = 'absorption-status'
          statusSpan.innerHTML =
            ' <span class="status-indicator processing">~30 Min</span>'

          tdName.innerHTML = nameText
          tdName.appendChild(statusSpan)
          row.appendChild(tdName)

          // delete block
          const td = document.createElement('td')
          td.classList.add('text-right')
          const a = document.createElement('a')
          const i = document.createElement('i')
          i.className = 'fas fa-trash delete-icon'
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
        img.className = 'modal-img'
        img.src = `img/${category}/${drink}.png`
        button.prepend(img)

        const span = document.createElement('span')
        span.innerText = drinks[category][drink].name
        button.appendChild(span)

        dialogGrid.appendChild(button)
      })
    }
  })
})

function updateProgressionMarkers() {
  const currentTime = new Date().getTime()
  const hasEaten = inputFood.checked
  const currentAbsorptionTimeMs = hasEaten
    ? ABSORPTION_TIME_WITH_FOOD_MS
    : ABSORPTION_TIME_EMPTY_STOMACH_MS

  // Get all drink rows
  const drinkRows = document.querySelectorAll('.drink-row')

  drinkRows.forEach((row) => {
    const drinkTime = parseInt(row.dataset.time)
    const timeSinceConsumption = currentTime - drinkTime

    // Calculate progression percentage
    let progressPercentage = 0
    let phase = 'absorption'

    if (timeSinceConsumption < currentAbsorptionTimeMs) {
      // Absorption phase - 0% to 100% of absorption time
      progressPercentage =
        (timeSinceConsumption / currentAbsorptionTimeMs) * 100
      phase = 'absorption'
    } else {
      // Post-absorption phase - show full width with different color
      progressPercentage = 100
      phase = 'decay'

      // After 6 hours, consider it completed
      const hoursAfterAbsorption =
        (timeSinceConsumption - currentAbsorptionTimeMs) / MS_PER_HOUR
      if (hoursAfterAbsorption > 6) {
        phase = 'completed'
      }
    }

    // Update row classes
    row.classList.remove('absorption-phase', 'decay-phase', 'completed-phase')
    row.classList.add(`${phase}-phase`)

    // Update progression width using CSS custom property
    row.style.setProperty(
      '--progression-width',
      `${Math.min(progressPercentage, 100)}%`
    )

    // Update absorption status indicator - only show during absorption
    const statusIndicator = row.querySelector('.status-indicator')
    if (statusIndicator) {
      if (phase === 'absorption') {
        const remainingMinutes = Math.ceil(
          (currentAbsorptionTimeMs - timeSinceConsumption) / (1000 * 60)
        )
        statusIndicator.textContent = `~${remainingMinutes} Min`
        statusIndicator.className = 'status-indicator processing'
        statusIndicator.style.display = 'inline-block'
      } else {
        // Hide the indicator once absorption is complete
        statusIndicator.style.display = 'none'
      }
    }
  })
}

function work() {
  // Get weight and gender
  const weight = inputWeight.value
  const gender = inputGender.value
  const bodyType = inputBodyType.value
  const hasEaten = inputFood.checked
  const currentAbsorptionTimeMs = hasEaten
    ? ABSORPTION_TIME_WITH_FOOD_MS
    : ABSORPTION_TIME_EMPTY_STOMACH_MS

  // Validate
  if (!weight || !gender || weight <= 0 || !bodyType || !inputDecayRate.value) {
    // Added check for decay rate value
    return
  }

  // Update progression markers for all drinks
  updateProgressionMarkers()

  // Determine alcohol distribution ratio (Widmark r factor)
  let alcoholDistributionRatio
  if (gender === 'm' && rFactors.male[bodyType]) {
    alcoholDistributionRatio = rFactors.male[bodyType]
  } else if (gender === 'w' && rFactors.female[bodyType]) {
    alcoholDistributionRatio = rFactors.female[bodyType]
  } else if (gender === 'd' && rFactors.diverse[bodyType]) {
    // 'd' for diverse
    alcoholDistributionRatio = rFactors.diverse[bodyType]
  } else {
    // Fallback to a general average if inputs are somehow invalid
    alcoholDistributionRatio = rFactors.diverse.average // A sensible default
  }

  let totalPromille = 0
  const currentTime = new Date().getTime()

  if (drinkHistory.length === 0) {
    promille = 0
  } else {
    for (const entry of drinkHistory) {
      let drinkData

      // Handle custom drinks
      if (entry.category === 'other' && entry.customDrink) {
        drinkData = entry.customDrink
      } else {
        drinkData = drinks[entry.category][entry.drink]
      }

      if (!drinkData) continue // Skip if drink data not found

      const drinkVolumeL = drinkData.volume // in Liters
      const alcoholPercentage = drinkData.alcohol // e.g., 0.05 for 5%

      // Amount of alcohol in grams
      const alcoholGrams =
        drinkVolumeL * alcoholPercentage * ETHANOL_DENSITY_G_PER_L

      // Initial promille contribution from this drink (Widmark formula)
      // BAC (‰) = (Alcohol Mass (g) / (Body Weight (kg) * Distribution Ratio)) * 1 (since we use ‰ directly)
      // Note: Original formula is often *100 for %, but here it's for ‰ so direct ratio is fine.
      // The formula implicitly uses density of blood similar to water (1 kg/L)
      // and result is per mille (g alcohol / kg body water), effectively g/kg or ‰.
      const initialDrinkPromille =
        alcoholGrams / (weight * alcoholDistributionRatio)

      const timeSinceConsumption = currentTime - entry.time
      let currentDrinkPromille
      const selectedDecayRate = parseFloat(inputDecayRate.value)

      if (timeSinceConsumption < currentAbsorptionTimeMs) {
        // Drink is in absorption phase
        currentDrinkPromille =
          initialDrinkPromille *
          (timeSinceConsumption / currentAbsorptionTimeMs)
      } else {
        // Drink is past absorption phase, decay applies
        const timeAfterAbsorptionPeak =
          timeSinceConsumption - currentAbsorptionTimeMs
        const hoursAfterAbsorptionPeak = timeAfterAbsorptionPeak / MS_PER_HOUR
        const decay = hoursAfterAbsorptionPeak * selectedDecayRate
        currentDrinkPromille = Math.max(0, initialDrinkPromille - decay)
      }
      totalPromille += currentDrinkPromille
    }
  }
  // Assign to the variable name used by subsequent logic
  let promille = totalPromille

  if (!promille) promille = 0 // Ensure NaN or undefined becomes 0, though Math.max should prevent NaN.

  // Apply/remove CSS effects based on promille
  const outputElement = document.getElementById('output')

  // Shaking Effect
  if (promille > 1.0) {
    document.body.classList.add('effect-shake')
  } else {
    document.body.classList.remove('effect-shake')
  }

  // Tilting Effect
  if (promille > 1.5) {
    document.body.classList.add('effect-tilt')
  } else {
    document.body.classList.remove('effect-tilt')
  }

  // Wavy Text Effect
  if (promille > 2.0) {
    outputElement.classList.add('effect-wavy-text')
  } else {
    outputElement.classList.remove('effect-wavy-text')
  }

  // Get current emoji
  let currentEmoji = '🤔'
  for (const e of drunkEmojis) {
    if (promille >= e.bac) currentEmoji = e.emoji
    else break
  }

  // Create warning icons for driving
  const warningIcons =
    promille > 0.5 ? `<br/><span class="warning-icons">🚗❌⚠️</span>` : ''

  // Get BAC peak prediction
  let peakPrediction = ''
  if (drinkHistory.length > 0) {
    const prediction = predictBACPeak()
    if (prediction && prediction.maxBAC > 0.01) {
      // Show peak if it's meaningful (>0.01‰)
      const peakTime = prediction.peakTime.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      })
      const peakBAC = prediction.maxBAC.toFixed(2).replace('.', ',')

      // Show if peak is significantly higher than current, or if we're still in absorption phase
      const currentTime = new Date()
      const hasRecentDrinks = drinkHistory.some((drink) => {
        const absorptionTime = hasEaten
          ? ABSORPTION_TIME_WITH_FOOD_MS
          : ABSORPTION_TIME_EMPTY_STOMACH_MS
        return currentTime.getTime() - drink.time < absorptionTime
      })

      if (prediction.maxBAC > promille * 1.05 || hasRecentDrinks) {
        peakPrediction = `<br/><span class="peak-prediction">📈 Peak: ${peakBAC}‰ um ${peakTime}</span>`
      }
    }
  }

  // Output with emoji
  outputElement.innerHTML = `<span class="promille-text">Promille: ${promille
    .toFixed(2)
    .replace(
      '.',
      ','
    )}‰</span> <span class="status-emoji">${currentEmoji}</span> ${warningIcons}${peakPrediction}`
  outputElement.style.filter = `blur(${Math.min(promille, 2)}px)`
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

// Add collapsible functionality to form section
document.addEventListener('DOMContentLoaded', () => {
  const formSection = document.querySelector('.form-section')
  const formHeader = formSection.querySelector('h3')

  // Initial form state setup
  updateFormState()

  formHeader.addEventListener('click', () => {
    const wasCollapsed = formSection.classList.contains('collapsed')

    formSection.classList.toggle('collapsed')
    const isCollapsed = formSection.classList.contains('collapsed')
    localStorage.setItem('formCollapsed', isCollapsed)

    // If user manually expands when form is complete, remember this preference
    if (!isCollapsed && checkFormCompleteness()) {
      localStorage.setItem('formManuallyExpanded', 'true')
    } else if (isCollapsed) {
      localStorage.removeItem('formManuallyExpanded')
    }

    // Update header indicator
    formHeader.style.opacity = isCollapsed ? '0.7' : '1'
  })

  // Update progression markers and status indicators every minute
  setInterval(() => {
    if (drinkHistory.length > 0 && inputWeight.value && inputGender.value) {
      updateProgressionMarkers()
      work() // Also update BAC calculation
    }
  }, 60000) // Update every minute
})

// Function to predict BAC peak
function predictBACPeak() {
  if (drinkHistory.length === 0) return null

  const currentTime = new Date()
  const weight = parseFloat(inputWeight.value) || 70
  const gender = inputGender.value || 'm'
  const bodyType = inputBodyType.value || 'average'
  const hasEaten = inputFood.checked
  const decayRate = parseFloat(inputDecayRate.value) || 0.1

  // Calculate BAC for future time points (next 12 hours with 5-minute resolution)
  let maxBAC = 0
  let peakTime = null

  for (let futureMinutes = 0; futureMinutes <= 720; futureMinutes += 5) {
    const futureTime = new Date(currentTime.getTime() + futureMinutes * 60000)
    let futureBac = 0

    drinkHistory.forEach((drink) => {
      const drinkTime = new Date(drink.time)
      const minutesSinceDrink = (futureTime - drinkTime) / (1000 * 60)

      if (minutesSinceDrink >= 0) {
        futureBac += calculateDrinkBAC(
          drink,
          minutesSinceDrink,
          weight,
          gender,
          bodyType,
          hasEaten,
          decayRate
        )
      }
    })

    if (futureBac > maxBAC) {
      maxBAC = futureBac
      peakTime = futureTime
    }
  }

  return { maxBAC, peakTime }
}

// Function to calculate BAC for a single drink at a specific time
function calculateDrinkBAC(
  drink,
  minutesSinceDrink,
  weight,
  gender,
  bodyType,
  hasEaten,
  decayRate
) {
  let drinkData

  // Handle custom drinks
  if (drink.category === 'other' && drink.customDrink) {
    drinkData = drink.customDrink
  } else {
    drinkData = drinks[drink.category][drink.drink]
  }

  if (!drinkData) return 0 // Return 0 if drink data not found

  const drinkVolumeL = drinkData.volume // in Liters
  const alcoholPercentage = drinkData.alcohol // e.g., 0.05 for 5%

  // Amount of alcohol in grams (same as main work function)
  const alcoholGrams =
    drinkVolumeL * alcoholPercentage * ETHANOL_DENSITY_G_PER_L

  // Use same r-factors as main work function
  let alcoholDistributionRatio
  if (gender === 'm' && rFactors.male[bodyType]) {
    alcoholDistributionRatio = rFactors.male[bodyType]
  } else if (gender === 'w' && rFactors.female[bodyType]) {
    alcoholDistributionRatio = rFactors.female[bodyType]
  } else if (gender === 'd' && rFactors.diverse[bodyType]) {
    alcoholDistributionRatio = rFactors.diverse[bodyType]
  } else {
    alcoholDistributionRatio = rFactors.diverse.average
  }

  // Initial promille contribution from this drink (same as main work function)
  const initialDrinkPromille =
    alcoholGrams / (weight * alcoholDistributionRatio)

  const absorptionTime = hasEaten
    ? ABSORPTION_TIME_WITH_FOOD_MS
    : ABSORPTION_TIME_EMPTY_STOMACH_MS
  const timeSinceConsumptionMs = minutesSinceDrink * 60 * 1000 // Convert minutes to milliseconds

  let bac = 0

  if (timeSinceConsumptionMs < absorptionTime) {
    // Absorption phase - gradual increase (same as main work function)
    bac = initialDrinkPromille * (timeSinceConsumptionMs / absorptionTime)
  } else {
    // Post-absorption - peak reached, now decaying (same as main work function)
    const timeAfterAbsorptionPeak = timeSinceConsumptionMs - absorptionTime
    const hoursAfterAbsorptionPeak = timeAfterAbsorptionPeak / MS_PER_HOUR
    const decay = hoursAfterAbsorptionPeak * decayRate
    bac = Math.max(0, initialDrinkPromille - decay)
  }

  return bac
}

// Function to show drink pouring animation
function showDrinkAnimation(drinkName, drinkCategory, drinkKey) {
  const overlay = document.getElementById('drinkAnimationOverlay')
  const textElement = document.getElementById('drinkAnimationText')
  const subtextElement = document.getElementById('drinkAnimationSubtext')
  const bottleElement = overlay.querySelector('.drink-bottle')

  // Update text based on drink
  textElement.textContent = `${drinkName} 🍻`
  subtextElement.textContent = 'Getränk hinzugefügt'

  // Update bottle to show actual drink image
  const drinkImagePath = `img/${drinkCategory}/${drinkKey}.png`
  bottleElement.style.backgroundImage = `url('${drinkImagePath}')`
  bottleElement.style.backgroundSize = 'cover'
  bottleElement.style.backgroundPosition = 'center'
  bottleElement.style.backgroundRepeat = 'no-repeat'

  // Show overlay
  overlay.classList.add('active')

  // Hide after animation completes
  setTimeout(() => {
    overlay.classList.remove('active')
    // Reset bottle background
    bottleElement.style.backgroundImage = ''
    bottleElement.style.background = 'var(--gradient-orange)'
  }, 3000) // 3 seconds total animation time
}
