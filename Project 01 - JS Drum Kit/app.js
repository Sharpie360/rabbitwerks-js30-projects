
window.addEventListener('keydown', function(e){

  // check keycode and grab associated audio and play it

  if (e.keyCode >= 65 && e.keyCode <= 83) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    if(!audio) return;
    audio.currentTime = 0;
    audio.play();
    animateKeys();
    console.log(audio.play());

    
  } else if (e.keyCode >= 49 && e.keyCode <= 52) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    if(!audio) return;
    console.log(audio.classList);

    // Checks the newly triggered audio clip data value and pauses the audio on any currently playing. this ensures only one bassline plays at a time. 
    if (audio.classList.contains('bass1')) {
      console.log('bass1');
      document.querySelector('audio[data-key="50"]').pause();
      document.querySelector('audio[data-key="51"]').pause();
    } else if (audio.classList.contains('bass2')) {
      document.querySelector('audio[data-key="49"]').pause();
      document.querySelector('audio[data-key="51"]').pause();
    } else if (audio.classList.contains('bass3')) {
      document.querySelector('audio[data-key="49"]').pause();
      document.querySelector('audio[data-key="50"]').pause();    
    }
    audio.currentTime = 0;
    audio.play();
    animateKeys();
    console.log(audio.play());

  } else {
    console.log('Key not mapped.');
  }
  
  
function animateKeys(){
  //trigger playing class
  document.querySelector(`.key[data-key="${e.keyCode}"]`).classList.add('playing');
  setTimeout(function(){
    document.querySelector(`.key[data-key="${e.keyCode}"]`).classList.remove('playing');
  }, 100);
}

});


const drumKeys = document.querySelector('.keys');

drumKeys.addEventListener('click', clickDrumkit);


function clickDrumkit(e){
  
  let key;
  key = e.target.parentElement;
  keyData = key.attributes[0].nodeValue;
  console.log(e, key, keyData);
  const audio = document.querySelector(`audio[data-key="${keyData}"]`);
  if(!audio) return;
  audio.currentTime = 0;
  audio.play();

  const active = document.querySelector(`.key[data-key="${keyData}"]`);
  active.classList.add('playing');
  //converted to arrow
  setTimeout(() => active.classList.remove('playing'), 100);

}

const basslineKeys = document.querySelector('.basslineKeys');

basslineKeys.addEventListener('click', clickBassline)

function clickBassline(e){
  
  let key;
  key = e.target.parentElement;
  keyData = key.attributes[0].nodeValue;
  console.log(e, key, keyData);
  const audio = document.querySelector(`audio[data-key="${keyData}"]`);
  if(!audio) return;
  audio.currentTime = 0;
  audio.play();

  const active = document.querySelector(`.bassline[data-key="${keyData}"]`);
  active.classList.add('playing');
  //converted to arrow
  setTimeout(() => active.classList.remove('playing'), 100);

}