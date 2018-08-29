// DOM SELECTORS
// // Clock and Display
const clock = document.querySelector('.clock');
const time = document.querySelector('.time');

// // Clock Hands
const secondHand = document.querySelector('.second-hand');
const minuteHand = document.querySelector('.min-hand');
const hourHand = document.querySelector('.hour-hand');

// // Greet Message
const greetCont = document.getElementById('greeting');
const initGreetMsg = document.getElementById('init-greet-message');
const returnGreetMsg = document.getElementById('return-greet-message');
const nameInput = document.querySelector('.greet-input');
const greetOutput = document.querySelector('.greet-output');
const submitName =  document.getElementById('submit-name');

// // Edit Name
const editCont = document.getElementById('edit-name');
const editBtn = document.getElementById('edit-btn');
const editInput = document.getElementById('edit-input');
const editConfirm = document.getElementById('confirm');









// USER INIT
let userName;

// // VISUALS
//initGreetMsg -> inline block
//nameInput -> none
//greetOutput -> inline block
//submitName -> none
//clock -> block
//time -> block


// check if first visit // if yes, ask for name, if not, load name from LS
if (localStorage.getItem("hasVisited") === null) {
  rndmHello();
  editCont.style.display = 'none';
  submitName.addEventListener('click', setName);
} else {
  userName = localStorage.getItem("userName");
  changeDom(userName);
  getTodMsg();
}



//RANDOM HI SAYING GENERATOR
function rndmHello() {
  const greetingList = ["hi there", "welcome", "hello", "hiya", "greetings", "howdy"];
  let rndmNum = Math.floor((Math.random() * greetingList.length));
  initGreetMsg.textContent = `${greetingList[rndmNum]}, please enter your name...`;
}



function getTodMsg() {

  let msg = "hello, ";
  const currHour = new Date().getHours();
  if (currHour >= 5 && currHour < 12) {
    msg = "Good morning, ";
  } else if (currHour >= 12 && currHour < 18) {
    msg = "Good afternoon, ";
  } else {
    msg = "Good evening, ";
  }
  
  return msg;
};



// // uncomment to test click without local storage check
// submitName.addEventListener('click', setName);

function setName() {
  userName = nameInput.value;
  //set default name to friend
  if (userName == '') {
    userName = "Friend";
  }
  // uppercase first letter
  const cappedName = userName.charAt(0).toUpperCase() + userName.slice(1);
  
  localStorage.setItem("hasVisited", true);
  localStorage.setItem("userName", cappedName);

  //change dom elements on fire
  changeDom(cappedName);

}

//switches the dom elements from init view to clock view
function changeDom(name) {
  greetCont.style.top = '6%'; // move up to make room for clock
  initGreetMsg.style.display = 'none'; // hide initial div
  returnGreetMsg.style.display = 'inline-block'; // show return user div
  returnGreetMsg.textContent = getTodMsg(); // set the Time of Day message
  nameInput.style.display = 'none'; // hide name input field
  greetOutput.style.display = 'inline-block'; // show name display div
  greetOutput.textContent = name; // set name to userName
  submitName.style.display = 'none'; // hide submit button

  editCont.style.display = 'block';
  if (window.innerWidth < 425) {
    document.getElementById('edit-btn-content').innerHTML = `<i class="fa fa-ellipsis-h">`;
    
    
  }

  clock.style.display = 'block'; // show clock
  time.style.display = 'block'; // show time display
}


editBtn.addEventListener('click', function(e) {

  editInput.classList.toggle('open');
  const getName = localStorage.getItem("userName");
  editInput.value = getName;
  
  

  if (editInput.classList.contains('open')) {
    this.style.color = 'rgb(155, 211, 204)';
    editConfirm.style.opacity = '1';
    if (window.innerWidth < 425) {
      editConfirm.style.left = '1650%';
    } else {
      editConfirm.style.left = '263%';
    }
    
    // add event on confirm button
    editConfirm.addEventListener('click', function() {
      editInput.classList.remove('open');
      editBtn.style.color = 'rgb(255, 255, 255)';
      this.style.opacity = '0';
      this.style.left = '0';
      resetName(editInput.value)
    });

  } else {
    this.style.color = 'rgb(255, 255, 255)';
    editConfirm.style.opacity = '0';
    editConfirm.style.left = '0';
  }

  

  e.preventDefault();
});


function resetName(name) {
  localStorage.removeItem("userName"); 
  name = name.charAt(0).toUpperCase() + name.slice(1);
  localStorage.setItem("userName", name);
  greetOutput.textContent = name;
  
}





// CLOCK AND DISPLAY LOGIC
function setDate() {
  const now = new Date();

  //grab current seconds
  let seconds = now.getSeconds();
  secondsDegrees = ((seconds / 60) * 360) + 90;
  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

  //grab current minutes
  const minutes = now.getMinutes();
  minutesDegrees = ((minutes / 60) * 360) + 90;
  minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;

  // grab current hours
  const hours = now.getHours();
  hoursDegrees = ((hours / 12) * 360) + 90;
  hourHand.style.transform = `rotate(${hoursDegrees}deg)`;

  let secStr = seconds.toString();
  if (secStr.length === 1) {
    secStr = "0" + secStr;
    // console.log(secStr);
  } // converts single digit into '0'+'1' = "01"
  let minStr = minutes.toString();
  if (minStr.length === 1) {
    minStr = "0" + minStr;
    // console.log(minStr);
  } // converts single digit into '0'+'1' = "01"

  // check if time is past 12 hrs, if yes subtract 12 from hours

  if (hours > 12) { // and build with display string with "pm"
    let hoursAdj = hours - 12;
    //console.log(hoursAdj);
    let timeStr = `${hoursAdj}:${minStr}:${secStr}pm`;
    document.getElementById('timeDisplay').textContent = timeStr;

  } else if (hours == 12) { // for Noon
    let timeStr = `${hours}:${minStr}:${secStr}pm`;
    document.getElementById('timeDisplay').textContent = timeStr;

  } else if (hours == 0) { // for Midnight
    let hoursAdj = hours + 12;
    let timeStr = `${hoursAdj}:${minStr}:${secStr}pm`;
    document.getElementById('timeDisplay').textContent = timeStr;

  } else { // build display string with "am"
    let timeStr = `${hours}:${minStr}:${secStr}am`;
    document.getElementById('timeDisplay').textContent = timeStr;
  }
  
}
//init clock time on load
setDate();
setInterval(() => setDate(), 1000);