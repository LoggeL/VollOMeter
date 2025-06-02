// Constants
const ABSORPTION_TIME_EMPTY_STOMACH_MS = 30 * 60 * 1000; // 30 minutes in milliseconds
const ABSORPTION_TIME_WITH_FOOD_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const ETHANOL_DENSITY_G_PER_L = 789.0; // g/L
const MS_PER_HOUR = 3600000; // milliseconds per hour

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
  const weight = inputWeight.value;
  const gender = inputGender.value;
  const bodyType = inputBodyType.value;
  const decayRate = inputDecayRate.value;
  
  const isComplete = weight && gender && bodyType && decayRate && weight > 0;
  
  const formSection = document.querySelector('.form-section');
  if (isComplete) {
    formSection.classList.remove('incomplete');
    formSection.classList.add('complete');
  } else {
    formSection.classList.remove('complete');
    formSection.classList.add('incomplete');
  }
  
  return isComplete;
}

// Function to update form collapse state based on completeness
function updateFormState() {
  const formSection = document.querySelector('.form-section');
  const isComplete = checkFormCompleteness();
  
  if (isComplete) {
    // Auto-collapse if complete and not manually overridden
    if (localStorage.getItem('formManuallyExpanded') !== 'true') {
      formSection.classList.add('collapsed');
      localStorage.setItem('formCollapsed', 'true');
    }
  } else {
    // Auto-expand if incomplete
    formSection.classList.remove('collapsed');
    localStorage.setItem('formCollapsed', 'false');
    localStorage.removeItem('formManuallyExpanded');
  }
  
  // Update header state
  const formHeader = formSection.querySelector('h3');
  const isCollapsed = formSection.classList.contains('collapsed');
  formHeader.style.opacity = isCollapsed ? '0.7' : '1';
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
  
  // Check form completeness and update state
  updateFormState();
  
  work(); // Call work if personal data is loaded and section is active
} else {
  // If no data is loaded, ensure form is expanded
  const formSection = document.querySelector('.form-section');
  if (formSection) {
    formSection.classList.remove('collapsed');
    formSection.classList.add('incomplete');
  }
}

inputFood.addEventListener('change', (e) => {
  localStorage.setItem('hasEaten', e.target.checked);
  work(); // Recalculate if food status changes
});

inputBodyType.addEventListener('change', (e) => {
  localStorage.setItem('bodyType', e.target.value);
  updateFormState(); // Check completeness
  work(); // Recalculate
});

inputDecayRate.addEventListener('change', (e) => {
  localStorage.setItem('decayRate', e.target.value);
  updateFormState(); // Check completeness
  work(); // Recalculate
});

inputWeight.addEventListener('keyup', (e) => {
  localStorage.setItem('weight', e.target.value)
  if (inputGender.value !== '') inputGrid.parentElement.classList.add('active')
  updateFormState(); // Check completeness
  work()
})

inputGender.addEventListener('change', (e) => {
  localStorage.setItem('gender', e.target.value)
  if (inputWeight.value) inputGrid.parentElement.classList.add('active')
  updateFormState(); // Check completeness
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
    const nameText = `${drinks[category][drink].name} (${drinks[category][
      drink
    ].volume.toFixed(2).replace('.', ',')}l, ${(
      drinks[category][drink].alcohol * 100
    ).toFixed(1).replace('.', ',')}%)`
    
    // Add absorption status indicator
    const statusSpan = document.createElement('span')
    statusSpan.className = 'absorption-status'
    statusSpan.innerHTML = ' <span class="status-indicator processing">~30 Min</span>'
    
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
    updateProgressionMarkers();
  }
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
      button.className = 'modal-btn ' + (index % 4 <= 1 ? 'modal-btn-orange' : 'modal-btn-pink')
      button.addEventListener('click', (e) => {
        dialogDrink.classList.remove('active')
        const drink = button.getAttribute('name')

        if (!drinks[category][drink]) return

        // Show drink pouring animation
        showDrinkAnimation(drinks[category][drink].name, category, drink);

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
        ].volume.toFixed(2).replace('.', ',')}l, ${(
          drinks[category][drink].alcohol * 100
        ).toFixed(1).replace('.', ',')}%)`
        
        // Add absorption status indicator
        const statusSpan = document.createElement('span')
        statusSpan.className = 'absorption-status'
        statusSpan.innerHTML = ' <span class="status-indicator processing">~30 Min</span>'
        
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
  })
})

function updateProgressionMarkers() {
  const currentTime = new Date().getTime();
  const hasEaten = inputFood.checked;
  const currentAbsorptionTimeMs = hasEaten ? ABSORPTION_TIME_WITH_FOOD_MS : ABSORPTION_TIME_EMPTY_STOMACH_MS;
  
  // Get all drink rows
  const drinkRows = document.querySelectorAll('.drink-row');
  
  drinkRows.forEach(row => {
    const drinkTime = parseInt(row.dataset.time);
    const timeSinceConsumption = currentTime - drinkTime;
    
    // Calculate progression percentage
    let progressPercentage = 0;
    let phase = 'absorption';
    
    if (timeSinceConsumption < currentAbsorptionTimeMs) {
      // Absorption phase - 0% to 100% of absorption time
      progressPercentage = (timeSinceConsumption / currentAbsorptionTimeMs) * 100;
      phase = 'absorption';
    } else {
      // Post-absorption phase - show full width with different color
      progressPercentage = 100;
      phase = 'decay';
      
      // After 6 hours, consider it completed
      const hoursAfterAbsorption = (timeSinceConsumption - currentAbsorptionTimeMs) / MS_PER_HOUR;
      if (hoursAfterAbsorption > 6) {
        phase = 'completed';
      }
    }
    
    // Update row classes
    row.classList.remove('absorption-phase', 'decay-phase', 'completed-phase');
    row.classList.add(`${phase}-phase`);
    
    // Update progression width using CSS custom property
    row.style.setProperty('--progression-width', `${Math.min(progressPercentage, 100)}%`);
    
    // Update absorption status indicator - only show during absorption
    const statusIndicator = row.querySelector('.status-indicator');
    if (statusIndicator) {
      if (phase === 'absorption') {
        const remainingMinutes = Math.ceil((currentAbsorptionTimeMs - timeSinceConsumption) / (1000 * 60));
        statusIndicator.textContent = `~${remainingMinutes} Min`;
        statusIndicator.className = 'status-indicator processing';
        statusIndicator.style.display = 'inline-block';
      } else {
        // Hide the indicator once absorption is complete
        statusIndicator.style.display = 'none';
      }
    }
  });
}

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

  // Update progression markers for all drinks
  updateProgressionMarkers();

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

  // Get current emoji
  let currentEmoji = '🤔';
  for (const e of drunkEmojis) {
    if (promille >= e.bac) currentEmoji = e.emoji;
    else break;
  }

  // Create warning icons for driving
  const warningIcons = promille > 0.5 ? `<br/><span class="warning-icons">🚗❌⚠️</span>` : '';

  // Get BAC peak prediction
  let peakPrediction = '';
  if (drinkHistory.length > 0) {
    const prediction = predictBACPeak();
    if (prediction && prediction.maxBAC > 0.01) { // Show peak if it's meaningful (>0.01‰)
      const peakTime = prediction.peakTime.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const peakBAC = prediction.maxBAC.toFixed(2).replace('.', ',');
      
      // Show if peak is significantly higher than current, or if we're still in absorption phase
      const currentTime = new Date();
      const hasRecentDrinks = drinkHistory.some(drink => {
        const absorptionTime = hasEaten ? ABSORPTION_TIME_WITH_FOOD_MS : ABSORPTION_TIME_EMPTY_STOMACH_MS;
        return (currentTime.getTime() - drink.time) < absorptionTime;
      });
      
      if (prediction.maxBAC > promille * 1.05 || hasRecentDrinks) {
        peakPrediction = `<br/><span class="peak-prediction">📈 Peak: ${peakBAC}‰ um ${peakTime}</span>`;
      }
    }
  }

  // Output with emoji
  outputElement.innerHTML = `<span class="promille-text">Promille: ${promille.toFixed(
    2
  ).replace('.', ',')}‰</span> <span class="status-emoji">${currentEmoji}</span> ${warningIcons}${peakPrediction}`;
  outputElement.style.filter = `blur(${Math.min(
    promille,
    2
  )}px)`;
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
  const formSection = document.querySelector('.form-section');
  const formHeader = formSection.querySelector('h3');
  
  // Initial form state setup
  updateFormState();
  
  formHeader.addEventListener('click', () => {
    const wasCollapsed = formSection.classList.contains('collapsed');
    
    formSection.classList.toggle('collapsed');
    const isCollapsed = formSection.classList.contains('collapsed');
    localStorage.setItem('formCollapsed', isCollapsed);
    
    // If user manually expands when form is complete, remember this preference
    if (!isCollapsed && checkFormCompleteness()) {
      localStorage.setItem('formManuallyExpanded', 'true');
    } else if (isCollapsed) {
      localStorage.removeItem('formManuallyExpanded');
    }
    
    // Update header indicator
    formHeader.style.opacity = isCollapsed ? '0.7' : '1';
  });
  
  // Update progression markers and status indicators every minute
  setInterval(() => {
    if (drinkHistory.length > 0 && inputWeight.value && inputGender.value) {
      updateProgressionMarkers();
      work(); // Also update BAC calculation
    }
  }, 60000); // Update every minute
});

// Function to predict BAC peak
function predictBACPeak() {
  if (drinkHistory.length === 0) return null;
  
  const currentTime = new Date();
  const weight = parseFloat(inputWeight.value) || 70;
  const gender = inputGender.value || 'm';
  const bodyType = inputBodyType.value || 'average';
  const hasEaten = inputFood.checked;
  const decayRate = parseFloat(inputDecayRate.value) || 0.10;
  
  // Calculate BAC for future time points (next 12 hours with 5-minute resolution)
  let maxBAC = 0;
  let peakTime = null;
  
  for (let futureMinutes = 0; futureMinutes <= 720; futureMinutes += 5) {
    const futureTime = new Date(currentTime.getTime() + futureMinutes * 60000);
    let futureBac = 0;
    
    drinkHistory.forEach(drink => {
      const drinkTime = new Date(drink.time);
      const minutesSinceDrink = (futureTime - drinkTime) / (1000 * 60);
      
      if (minutesSinceDrink >= 0) {
        futureBac += calculateDrinkBAC(drink, minutesSinceDrink, weight, gender, bodyType, hasEaten, decayRate);
      }
    });
    
    if (futureBac > maxBAC) {
      maxBAC = futureBac;
      peakTime = futureTime;
    }
  }
  
  return { maxBAC, peakTime };
}

// Function to calculate BAC for a single drink at a specific time
function calculateDrinkBAC(drink, minutesSinceDrink, weight, gender, bodyType, hasEaten, decayRate) {
  const drinkData = drinks[drink.category][drink.drink];
  const drinkVolumeL = drinkData.volume; // in Liters
  const alcoholPercentage = drinkData.alcohol; // e.g., 0.05 for 5%

  // Amount of alcohol in grams (same as main work function)
  const alcoholGrams = drinkVolumeL * alcoholPercentage * ETHANOL_DENSITY_G_PER_L;

  // Use same r-factors as main work function
  let alcoholDistributionRatio;
  if (gender === 'm' && rFactors.male[bodyType]) {
    alcoholDistributionRatio = rFactors.male[bodyType];
  } else if (gender === 'w' && rFactors.female[bodyType]) {
    alcoholDistributionRatio = rFactors.female[bodyType];
  } else if (gender === 'd' && rFactors.diverse[bodyType]) {
    alcoholDistributionRatio = rFactors.diverse[bodyType];
  } else {
    alcoholDistributionRatio = rFactors.diverse.average;
  }

  // Initial promille contribution from this drink (same as main work function)
  const initialDrinkPromille = alcoholGrams / (weight * alcoholDistributionRatio);

  const absorptionTime = hasEaten ? ABSORPTION_TIME_WITH_FOOD_MS : ABSORPTION_TIME_EMPTY_STOMACH_MS;
  const timeSinceConsumptionMs = minutesSinceDrink * 60 * 1000; // Convert minutes to milliseconds
  
  let bac = 0;
  
  if (timeSinceConsumptionMs < absorptionTime) {
    // Absorption phase - gradual increase (same as main work function)
    bac = initialDrinkPromille * (timeSinceConsumptionMs / absorptionTime);
  } else {
    // Post-absorption - peak reached, now decaying (same as main work function)
    const timeAfterAbsorptionPeak = timeSinceConsumptionMs - absorptionTime;
    const hoursAfterAbsorptionPeak = timeAfterAbsorptionPeak / MS_PER_HOUR;
    const decay = hoursAfterAbsorptionPeak * decayRate;
    bac = Math.max(0, initialDrinkPromille - decay);
  }
  
  return bac;
}

// Function to show drink pouring animation
function showDrinkAnimation(drinkName, drinkCategory, drinkKey) {
  const overlay = document.getElementById('drinkAnimationOverlay');
  const textElement = document.getElementById('drinkAnimationText');
  const subtextElement = document.getElementById('drinkAnimationSubtext');
  const bottleElement = overlay.querySelector('.drink-bottle');
  
  // Update text based on drink
  textElement.textContent = `${drinkName} 🍻`;
  subtextElement.textContent = 'Getränk hinzugefügt';
  
  // Update bottle to show actual drink image
  const drinkImagePath = `img/${drinkCategory}/${drinkKey}.png`;
  bottleElement.style.backgroundImage = `url('${drinkImagePath}')`;
  bottleElement.style.backgroundSize = 'cover';
  bottleElement.style.backgroundPosition = 'center';
  bottleElement.style.backgroundRepeat = 'no-repeat';
  
  // Show overlay
  overlay.classList.add('active');
  
  // Hide after animation completes
  setTimeout(() => {
    overlay.classList.remove('active');
    // Reset bottle background
    bottleElement.style.backgroundImage = '';
    bottleElement.style.background = 'var(--gradient-orange)';
  }, 3000); // 3 seconds total animation time
}
