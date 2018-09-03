// DOM SELECTORS
/// range and color picker inputs
const inputs = document.querySelectorAll('.controls input');
/// direction selector dropdown
const directionSelector = document.querySelector('#direction-select');
/// image picker thumbnail images
const images = document.querySelectorAll('.image-picker img')
/// button to reset filters - desktop display
const resetButtonDesktop = document.getElementById('reset-desktop-btn');
/// button to reset filters - mobile display
const resetButtonMobile = document.getElementById('reset-mobile-btn')

// EVENT LISTENERS
/// add to inputs, listen for change and mousemove
inputs.forEach(input => input.addEventListener('change', handleUpdate));
inputs.forEach(input => input.addEventListener('mousemove', handleUpdate));

/// add to selector dropdown
directionSelector.addEventListener('change', (e) => {
  console.log(e, e.target.value)
  document.documentElement.style.setProperty('--direction', `${e.target.value}`)
})

/// add to each image picker image
images.forEach(image => image.addEventListener('click', function(e) {
  //console.log(e)
  //console.log("image picker child imgs", this.parentElement.children)
  images.forEach(image => image.classList.remove('picked'))
  e.target.classList.add('picked')
  const pickedImageSrc = e.target.src;
  console.log(pickedImageSrc)
  document.getElementById('current-image').src = pickedImageSrc; 
}))



// checks screen size to see which button to use, removes the one not needed. then adds a click listener onto rendered button
if (window.innerWidth < 480) {
  resetButtonDesktop.remove()
  resetButtonMobile.addEventListener('click', resetFilters);
} else {
  resetButtonMobile.remove()
  resetButtonDesktop.addEventListener('click', resetFilters);
}

/// function that changes the values of the CSS variables when called
function handleUpdate() {
  const suffix = this.dataset.sizing || '';
  document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
}

// resets all filter settings to default
function resetFilters() {
  document.getElementById('contrast').value = 100;
  document.documentElement.style.setProperty('--contrast', '100%');
  document.getElementById('saturate').value = 100;
  document.documentElement.style.setProperty('--saturate', '100%');
  document.getElementById('hue-rotate').value = 0;
  document.documentElement.style.setProperty('--hueRotate', 0);
  document.getElementById('invert').value = 0;
  document.documentElement.style.setProperty('--invert', 0);
  document.getElementById('sepia').value = 0;
  document.documentElement.style.setProperty('--sepia', 0);
}




