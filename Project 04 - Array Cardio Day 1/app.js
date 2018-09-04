


//REFACTOR - CREATE BUILD STRING VARIABLE

// https://xboxapi.com/v2/${xuid}/achievements/${titleId}

const xuid = '2533274817751947';
const xboxApiKey = '3d97cbd0e25f6dc9055df4956ed18ceba20f09a1';
let titleId = '';


document.getElementById('getGameData').addEventListener('click', getGamesData);


let gamesArr = [];

function getGamesData() {
  const xhr = new XMLHttpRequest();

  // OPEN
  xhr.open('GET', `https://xboxapi.com/v2/${xuid}/xboxonegames`, true);

  xhr.setRequestHeader(
    'X-AUTH', `${xboxApiKey}`
  )

  console.log("readystate = ", xhr.readyState);
  if(xhr.readyState === 1) {
    document.getElementById('getGameData').innerHTML = `<h4>Loading Games...</h4> <img id="spin-loader" src="icons/Spin-1s-200px.gif" alt="spin-loader"> `;
    document.getElementById('spin-loader').style.opacity = 1;
  }

  xhr.onload = function() {
    console.log(this);
    if(this.status === 200) {
      document.getElementById('getGameData').innerHTML = `<h4>Games Loaded</h4>`;
      document.getElementById('xbox-icon').style.color = 'var(--success)';

      console.log('response received');
      const response = JSON.parse(this.responseText);

      let output = '';
      
      //console.table(response.titles);

      const lastUnlockDate = response.titles.map(game => new Date(game.lastUnlock));
      let count = 0;
      let cleanedDates = dateCleaner(lastUnlockDate);

      response.titles.forEach( game => {
        unlockRatio = ((game.currentGamerscore / game.maxGamerscore) * 100).toFixed(2);

        if (game.maxGamerscore === 0){
          return
        } else if (game.currentGamerscore === game.maxGamerscore) {
          // create function that adds from parent element ul to the li's bg-success if complete.
          output += `
          <li class="list-group-item card card-body bg-success mb-2">
            <h3 class="card-title">${game.name}</h3>
            <h6 id="viewAchvs"><a class="text-light" href="#" data-titleId="${game.titleId}">view achievements</a></h6>
            <div class="row">
              <div class="col-sm"><h5>Achievements Unlocked: ${game.earnedAchievements}</h5></div>
              <div class="col-sm"><h5>My Gamerscore: ${game.currentGamerscore}</h5></div>
              <div class="col-sm"><h5>Max Gamerscore: ${game.maxGamerscore}</h5></div>
            </div>
            <div class="row">
              <div class="col-sm">Last Unlock: ${cleanedDates[count]}</div>
              <div class="col-sm">Game Completed</div>
              <div class="col-sm">Unlock Ratio: ${unlockRatio}%</div>
            </div>
          </li>`;

        } else {
          output += `
          <li class="list-group-item card card-body mb-2">
            <h3 class="card-title">${game.name}</h3>
            <h6 id="viewAchvs"><a class="text-light" href="#" data-titleId="${game.titleId}">view achievements</a></h6>
            <div class="row">
              <div class="col-sm"><h5>Achievements Unlocked: ${game.earnedAchievements}</h5></div>
              <div class="col-sm"><h5>My Gamerscore: ${game.currentGamerscore}</h5></div>
              <div class="col-sm"><h5>Max Gamerscore: ${game.maxGamerscore}</h5></div>
            </div>
            <div class="row">
              <div class="col-sm">Last Unlock: ${cleanedDates[count]}</div>
              <div class="col-sm">Gamerscore Remaining: ${game.maxGamerscore - game.currentGamerscore}</div>
              <div class="col-sm">Unlock Ratio: ${unlockRatio}%</div>
            </div>
          </li>`;
        } // end of if, else builds
      });

      extractData(response.titles);

      document.querySelector('.list-group').innerHTML = output;

      sortBtn_ByMyGS.addEventListener('click', () => {
        sortByMyGS(response.titles);
      });
      sortBtn_ByMaxGS.addEventListener('click', () => {
        sortByMaxGS(response.titles);
      });
      

    } else {
      document.getElementById('xbox-icon').style.color = 'var(--danger)';

      document.querySelector('.list-group').innerHTML = '<li>Whoops... Something went wrong, please try again.</li>';

    }
  }
  
  xhr.send();

}

function extractData(data) {
  //console.log('trying extraction');
  setTimeout(() => {
    gamesArr = data;
  }, 100);
  return gamesArr;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// === FILTER ARRAY FUNCTIONS ================================
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const filterBtn_InProgress = document.getElementById('filter-btn-inProgress');
const filterBtn_Completed = document.getElementById('filter-btn-completed');

// --- IN PROGRESS EVENT --- //
filterBtn_InProgress.addEventListener('click', () => {
  filterInProgressGames(gamesArr);

});

function filterInProgressGames(arr) { // takes in array as arguement

  // filters games that dont have same unlocked and max GamerScore
  //returns a new array called inProgress
  const inProgress = arr.filter(game => (game.currentGamerscore !== game.maxGamerscore) && game.maxGamerscore !== 0); 

  console.table(inProgress);
  const lastUnlockDate = inProgress.map(game => new Date(game.lastUnlock));

  let count = 0;

  let cleanedDates = dateCleaner(lastUnlockDate);
  let output = ''; // init output variable

  inProgress.forEach((game) => { // loop through inProgress array and build template string for each iteration
    output +=  `
    <li class="list-group-item card card-body mb-2">
      <h3 class="card-title">${game.name}</h3>
      <h6 id="viewAchvs"><a class="text-light" href="#" data-titleId="${game.titleId}">view achievements</a></h6>
      <div class="row">
        <div class="col-sm"><h5>Achievements Unlocked: ${game.earnedAchievements}</h5></div>
        <div class="col-sm"><h5>My Gamerscore: ${game.currentGamerscore}</h5></div>
        <div class="col-sm"><h5>Max Gamerscore: ${game.maxGamerscore}</h5></div>
      </div>
      <div class="row">
        <div class="col-sm">Last Unlock: ${cleanedDates[count]}</div>
        <div class="col-sm">Gamerscore Remaining: ${game.maxGamerscore - game.currentGamerscore}</div>
        <div class="col-sm">Unlock Ratio: ${unlockRatio}%</div>
      </div>
    </li>`;
    count ++;
  });
  // output result to the DOM
  document.querySelector('.list-group').innerHTML = output;

  sortBtn_ByMyGS.addEventListener('click', () => {
    sortByMyGS(inProgress);
  });
  
  sortBtn_ByMaxGS.addEventListener('click', () => {
    sortByMaxGS(inProgress);
  });

  return inProgress
};

// --- COMPLETED EVENT --- //

filterBtn_Completed.addEventListener('click', () => {
  filterCompletedGames(gamesArr);
});

function filterCompletedGames(arr) {

  const completed = arr.filter(game => (game.currentGamerscore === game.maxGamerscore) && game.maxGamerscore !== 0);
  console.table(completed);

  const lastUnlockDate = completed.map(game => new Date(game.lastUnlock));
  let count = 0;
  let cleanedDates = dateCleaner(lastUnlockDate);

  let output = '';

  completed.forEach((game) => {
    output +=  `
    <li class="list-group-item card card-body bg-success mb-2">
      <h3 class="card-title">${game.name}</h3>
      <h6 id="viewAchvs"><a class="text-light" href="#" data-titleId="${game.titleId}">view achievements</a></h6>
      <div class="row">
        <div class="col-sm"><h5>Achievements Unlocked: ${game.earnedAchievements}</h5></div>
        <div class="col-sm"><h5>My Gamerscore: ${game.currentGamerscore}</h5></div>
        <div class="col-sm"><h5>Max Gamerscore: ${game.maxGamerscore}</h5></div>
      </div>
      <div class="row">
        <div class="col-sm">Last Unlock: ${cleanedDates[count]}</div>
        <div class="col-sm">Game Completed</div>
        <div class="col-sm">Unlock Ratio: ${unlockRatio}%</div>
      </div>
    </li>`;
  });
  
  document.querySelector('.list-group').innerHTML = output;

  sortBtn_ByMyGS.addEventListener('click', () => {
    sortByMyGS(completed);
  });

  sortBtn_ByMaxGS.addEventListener('click', () => {
    sortByMaxGS(completed);
  });

};


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// === MAP ARRAY FUNCTIONS ================================
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// --- GAMERSCORE TO GO --- //
const mapBtn_GsRemain = document.getElementById('map-btn-gs-remain');

mapBtn_GsRemain.addEventListener('click', () => {
  mapGsToGo(gamesArr);
});

function mapGsToGo(arr) {
  let gamesArr = arr;
  const gsToGo = arr.map(game => (game.maxGamerscore - game.currentGamerscore));
  console.log(gsToGo);
  let count = 0;
  let output = ''; // init output variable


  // .....>>>here__________________________
  // make sort function
  // _________________________________
  gamesArr.forEach((game) => { // loop through array and build template string for each iteration

    if (game.maxGamerscore === 0) {
      return
    }

    let msg = '';
    if (gsToGo[count] > 800) {
      msg = `You've got a ways to go on on this one...`;
    } else if (gsToGo[count] > 200) {
      msg = `Keep up the good work!`;
    } else {
      msg = `You're so close to completion! Keep going!`;
    }

    output += `
      <li class="list-group-item card card-body mb-2">
      <h3 class="card-title">${game.name}</h3> 
      <div class="row">
        <div class="col-sm"><h5>Achievements Unlocked: ${game.earnedAchievements}</h5></div>
        <div class="col-sm"><h5>My Gamerscore: ${game.currentGamerscore}</h5></div>
        <div class="col-sm"><h5>Max Gamerscore: ${game.maxGamerscore}</h5></div>
      </div>
      <div class="row">
        <div class="col-sm-4">Gamerscore Remaining: ${gsToGo[count]}</div>
        <div class="col-sm-8"><p class="text-info">${msg}</p></div>
      </div>
    </li>`;
    
    count ++;
  });


  // output result to the DOM
  document.querySelector('.list-group').innerHTML = output;
//make own event listeners internally.
  sortBtn_ByMyGS.addEventListener('click', () => {
    sortByMyGS(gamesArr);
  });

  sortBtn_ByMaxGS.addEventListener('click', () => {
    sortByMaxGS(gamesArr);
  });
}



// --- LAST UNLOCK --- //

const mapBtn_LastUnlock = document.getElementById('map-btn-last-unlock');

mapBtn_LastUnlock.addEventListener('click', () => {
  mapLastUnlock(gamesArr);
});

function mapLastUnlock(arr) {
  let gamesArr = arr;
  let lastUnlockDate = arr.map(game => new Date(game.lastUnlock));
  // lastUnlockDate = lastUnlockDate.sort((a, b) => {
  //   let timeOne = new Date(a);
  //   let timeTwo = new Date(b);
  //   if(timeOne.getTime() > timeTwo.getTime()) {
  //     return -1
  //   } else {
  //     return 1
  //   }
  // });
  let count = 0;

  let cleanedDates = dateCleaner(lastUnlockDate);
  let cleanedTimes = timeCleaner(lastUnlockDate);

  console.log(cleanedDates);
  console.log(cleanedTimes);
  let output = ''; // init output variable
  
  gamesArr.forEach((game) => { // loop through array and build template string for each iteration

    if (game.maxGamerscore === 0) {
      return
    }

    let msg = 'Last achievement unlocked on:';

    output += `
      <li class="list-group-item card card-body mb-2">
      <h3 class="card-title">${game.name}</h3> 
      <div class="row">
        <div class="col-sm"><h5>Achievements Unlocked: ${game.earnedAchievements}</h5></div>
        <div class="col-sm"><h5>My Gamerscore: ${game.currentGamerscore}</h5></div>
        <div class="col-sm"><h5>Max Gamerscore: ${game.maxGamerscore}</h5></div>
      </div>
      <div class="row">
        <div class="col-sm-4">${msg}</div>
        <div class="col-sm-8"><p class="text-info">${cleanedDates[count]} at ${cleanedTimes[count]}</p></div>
      </div>
    </li>`;
    
    count ++;
  });
  // output result to the DOM
  document.querySelector('.list-group').innerHTML = output;
}




// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// === SORT FUNCTIONS ===============================
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ...BY MY GAMERSCORE
// // dom selector
const sortBtn_ByMyGS = document.getElementById('sort-btn-by-my-gs');

function timeCleaner(lastUnlockDate) {
  let cleanedTimes = [];
  for (let i = 0; i < lastUnlockDate.length; i++) {
    let time = lastUnlockDate[i].toLocaleTimeString();
    cleanedTimes.push(time);
  }
  return cleanedTimes;
}

function dateCleaner(lastUnlockDate) {
  let cleanedDates = [];
  for (let i = 0; i < lastUnlockDate.length; i++) {
    let date = lastUnlockDate[i].toDateString();
    cleanedDates.push(date);
  }
  ;
  return cleanedDates;
}

// grabs current array and then sorts it.
// sort function
function sortByMyGS(array) {
  let sortedArray = array.sort((a, b) => {
    // console.log(a.currentGamerscore);
    // console.log(b.currentGamerscore);
    if(a.currentGamerscore > b.currentGamerscore) {
      return -1
    } else {
      return 1
    }
  });

  const lastUnlockDate = sortedArray.map(game => new Date(game.lastUnlock));
  let count = 0;
  let cleanedDates = dateCleaner(lastUnlockDate);

  let output = '';
  sortedArray.forEach( game => {
    if (game.maxGamerscore === 0){
      return
    } else if (game.currentGamerscore === game.maxGamerscore) {
      output += `
      <li class="list-group-item card card-body bg-success mb-2">
        <h3 class="card-title">${game.name}</h3>
        <h6 id="viewAchvs"><a class="text-light" href="#" data-titleId="${game.titleId}">view achievements</a></h6>
        <div class="row">
          <div class="col-sm"><h5>Achievements Unlocked: ${game.earnedAchievements}</h5></div>
          <div class="col-sm"><h5>My Gamerscore: ${game.currentGamerscore}</h5></div>
          <div class="col-sm"><h5>Max Gamerscore: ${game.maxGamerscore}</h5></div>
        </div>
        <div class="row">
          <div class="col-sm">Last Unlock: ${cleanedDates[count]}</div>
          <div class="col-sm">Game Completed</div>
          <div class="col-sm">Unlock Ratio: ${unlockRatio}%</div>
        </div>
      </li>`;

    } else {
      output += `
      <li class="list-group-item card card-body mb-2">
        <h3 class="card-title">${game.name}</h3>
        <h6 id="viewAchvs"><a class="text-light" href="#" data-titleId="${game.titleId}">view achievements</a></h6>
        <div class="row">
          <div class="col-sm"><h5>Achievements Unlocked: ${game.earnedAchievements}</h5></div>
          <div class="col-sm"><h5>My Gamerscore: ${game.currentGamerscore}</h5></div>
          <div class="col-sm"><h5>Max Gamerscore: ${game.maxGamerscore}</h5></div>
        </div>
        <div class="row">
          <div class="col-sm">Last Unlock: ${cleanedDates[count]}</div>
          <div class="col-sm">Gamerscore Remaining: ${game.maxGamerscore - game.currentGamerscore}</div>
          <div class="col-sm">Unlock Ratio: ${unlockRatio}%</div>
        </div>
      </li>`;
    }; // end of if else builds

  });

  document.querySelector('.list-group').innerHTML = output;
}
// ...BY MAX GAMERSCORE
// // dom selector
const sortBtn_ByMaxGS = document.getElementById('sort-btn-by-max-gs');

// grabs current array and then sorts it.
// sort function
function sortByMaxGS(array) {
  let sortedArray = array.sort((a, b) => {
    if(a.maxGamerscore > b.maxGamerscore) {
      return -1
    } else {
      return 1
    }
  });

  const lastUnlockDate = sortedArray.map(game => new Date(game.lastUnlock));
  let count = 0;
  let cleanedDates = dateCleaner(lastUnlockDate);

  let output = '';
  sortedArray.forEach( game => {
    if (game.maxGamerscore === 0){
      return
    } else if (game.currentGamerscore === game.maxGamerscore) {
      output += `
      <li class="list-group-item card card-body bg-success mb-2">
        <h3 class="card-title">${game.name}</h3>
        <h6 id="viewAchvs"><a class="text-light" href="#" data-titleId="${game.titleId}">view achievements</a></h6>
        <div class="row">
          <div class="col-sm"><h5>Achievements Unlocked: ${game.earnedAchievements}</h5></div>
          <div class="col-sm"><h5>My Gamerscore: ${game.currentGamerscore}</h5></div>
          <div class="col-sm"><h5>Max Gamerscore: ${game.maxGamerscore}</h5></div>
        </div>
        <div class="row">
          <div class="col-sm">Last Unlock: ${cleanedDates[count]}</div>
          <div class="col-sm">Game Completed</div>
          <div class="col-sm">Unlock Ratio: ${unlockRatio}%</div>
        </div>
      </li>`;

    } else {
      output += `
      <li class="list-group-item card card-body mb-2">
        <h3 class="card-title">${game.name}</h3>
        <h6 id="viewAchvs"><a class="text-light" href="#" data-titleId="${game.titleId}">view achievements</a></h6>
        <div class="row">
          <div class="col-sm"><h5>Achievements Unlocked: ${game.earnedAchievements}</h5></div>
          <div class="col-sm"><h5>My Gamerscore: ${game.currentGamerscore}</h5></div>
          <div class="col-sm"><h5>Max Gamerscore: ${game.maxGamerscore}</h5></div>
        </div>
        <div class="row">
          <div class="col-sm">Last Unlock: ${cleanedDates[count]}</div>
          <div class="col-sm">Gamerscore Remaining: ${game.maxGamerscore - game.currentGamerscore}</div>
          <div class="col-sm">Unlock Ratio: ${unlockRatio}%</div>
        </div>
      </li>`;

    } // end of if else builds

  });

  document.querySelector('.list-group').innerHTML = output;
}






// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// === FULL GAME LIST FUNCTION ===============================
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

document.getElementById('fullList').addEventListener('click', () => {
  let output = '';

    const lastUnlockDate = gamesArr.map(game => new Date(game.lastUnlock));
    let count = 0;
    let cleanedDates = dateCleaner(lastUnlockDate);

  gamesArr.forEach( game => {
    if (game.maxGamerscore === 0){
      return 
    } else if (game.currentGamerscore === game.maxGamerscore) {
      output += ` 
      <li class="list-group-item card card-body bg-success mb-2">
        <h3 class="card-title">${game.name}</h3>
        <h6 id="viewAchvs"><a class="text-light" href="#" data-titleId="${game.titleId}">view achievements</a></h6>
        <div class="row">
          <div class="col-sm"><h5>Achievements Unlocked: ${game.earnedAchievements}</h5></div>
          <div class="col-sm"><h5>My Gamerscore: ${game.currentGamerscore}</h5></div>
          <div class="col-sm"><h5>Max Gamerscore: ${game.maxGamerscore}</h5></div>
        </div>
        <div class="row">
          <div class="col-sm">Last Unlock: ${cleanedDates[count]}</div>
          <div class="col-sm">Game Completed</div>
          <div class="col-sm">Unlock Ratio: ${unlockRatio}%</div>
        </div>
      </li>`;

    } else {
      output += `
      <li class="list-group-item card card-body mb-2">
        <h3 class="card-title">${game.name}</h3>
        <h6 id="viewAchvs"><a class="text-light" href="#" data-titleId="${game.titleId}">view achievements</a></h6>
        <div class="row">
          <div class="col-sm"><h5>Achievements Unlocked: ${game.earnedAchievements}</h5></div>
          <div class="col-sm"><h5>My Gamerscore: ${game.currentGamerscore}</h5></div>
          <div class="col-sm"><h5>Max Gamerscore: ${game.maxGamerscore}</h5></div>
        </div>
        <div class="row">
          <div class="col-sm">Last Unlock: ${cleanedDates[count]}</div>
          <div class="col-sm">Gamerscore Remaining: ${game.maxGamerscore - game.currentGamerscore}</div>
          <div class="col-sm">Unlock Ratio: ${unlockRatio}%</div>
        </div>
      </li>`;

    } // end of if else builds

  });
  // // turn off solid button color classes
  // inProgress button
  filterBtn_InProgress.classList.remove('btn-success');
  filterBtn_InProgress.classList.add('btn-outline-success');

  // Completed button
  filterBtn_Completed.classList.remove('btn.success');
  filterBtn_Completed.classList.add('btn-outline-success');
  
  document.querySelector('.list-group').innerHTML = output;

});

// function cleanDate(date) {
//   console.log(date);
//   date = new Date(date);
//   dateStr = date.toDateString();
//   console.log(dateStr);

//   return "returned date " + dateStr;
// }


const reduceBtn_MyTotal = document.getElementById('reduce-my-total');

reduceBtn_MyTotal.addEventListener('click', () => {
  let myTotal = gamesArr.reduce((sum, game) => sum + game.currentGamerscore, 0);
  let maxTotal = gamesArr.reduce((sum, game) => sum + game.maxGamerscore, 0);
  let totalUnlockRatio = ((myTotal / maxTotal) * 100).toFixed(2);

  let numUnlockTotal = gamesArr.reduce((sum, game) => sum + game.earnedAchievements, 0);

  console.log(myTotal)
  
  let output = `
    <li class="list-group-item">
      <h3>You've unlocked ${numUnlockTotal} achievements worth <span class="text-success">${myTotal}</span> Gamerscore!</h3>
      <h4>Total Unlock Ratio: ${totalUnlockRatio}%</h4>
    </li>
  `
  document.querySelector('.list-group').innerHTML = output;
});

const reduceBtn_MaxTotal = document.getElementById('reduce-max-total');

reduceBtn_MaxTotal.addEventListener('click', () => {
  let maxTotal = gamesArr.reduce((sum, game) => sum + game.maxGamerscore, 0);
  console.log(maxTotal);

  let output = `
    <li class="list-group-item">
      <h3>The max Gamerscore you can achieve is: ${maxTotal}</h3>
    </li>
  `
  document.querySelector('.list-group').innerHTML = output;
});




// function buildEngine(array) {

//   array.forEach( game => {
//     let buildString_main = `
//     <li class="list-group-item card card-body mb-2">
//       <h3 class="card-title">Title: ${game.name}</h3> 
//       <div class="row">
//         <div class="col-sm"><h5>Achievements Unlocked: ${game.earnedAchievements}</h5></div>
//         <div class="col-sm"><h5>My Gamerscore: ${game.currentGamerscore}</h5></div>
//         <div class="col-sm"><h5>Max Gamerscore: ${game.maxGamerscore}</h5></div>
//       </div>`;

//     let buildString_closingTag = `</li>`;

//     let BuildString = buildString_main + buildString_closingTag;
//     return console.log(BuildString);

//   })
  


//  // let buildString_gsLeft = `
//   //  <hr>
//  //   <div class="row">
//   //    <div class="col-sm-4">Gamerscore Remaining: ${gsToGo[count]}</div>
//   //    <div class="col-sm-8"><p class="text-info">${msg}</p></div>
//   //  </div>`;


  

// };

// buildEngine(gamesArr);
