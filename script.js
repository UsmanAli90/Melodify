// PRESS THE MENU BUTTON TO TRIGGER ANIMATION
// PRESS PLAY BUTTON TO LISTEN THE DEMO SONG

// As seen on: "https://dribbble.com/shots/2144866-Day-5-Music-Player-Rebound/"

// THANK YOU!

// document.addEventListener("DOMContentLoaded", function() {
//    const loginBtn = document.getElementById("loginBtn");
//    const signupBtn = document.getElementById("signupBtn");
//    const loginForm = document.getElementById("loginForm");
//    const signupForm = document.getElementById("signupForm");

//    loginBtn.addEventListener("click", function() {
//        toggleForm(loginForm);
//    });

//    signupBtn.addEventListener("click", function() {
//        toggleForm(signupForm);
//    });

//    function toggleForm(form) {
//        if (form.classList.contains("hidden")) {
//            form.classList.remove("hidden");
//        } else {
//            form.classList.add("hidden");
//        }
//    }
// });

// document.addEventListener("DOMContentLoaded", function () {
//    const loginBtn = document.getElementById("loginBtn");
//    const signupBtn = document.getElementById("signupBtn");

//    loginBtn.addEventListener("click", function () {
//       window.location.href = "login.html";
//    });

//    signupBtn.addEventListener("click", function () {
//       window.location.href = "signup.html";
//    });
// });


// const audioPlayer = document.getElementById('audio');
// function togglePlayPause() {
//    if (audioPlayer.paused) {
//       audioPlayer.play();
//       document.getElementById('play').classList.add('pause'); // Add a class to change the appearance
//    } else {
//       audioPlayer.pause();
//       document.getElementById('play').classList.remove('pause'); // Remove the class to revert to play icon
//    }
// }


// document.addEventListener("DOMContentLoaded", function () {
//    const loginBtn = document.getElementById("loginBtn");
//    const signupBtn = document.getElementById("signupBtn");

//    loginBtn.addEventListener("click", function () {
//       window.location.href = "login.html";
//    });

//    signupBtn.addEventListener("click", function () {
//       window.location.href = "signup.html";
//    });
// });

// const audioPlayer = document.getElementById('audio');
// function togglePlayPause() {
//    if (audioPlayer.paused) {
//       audioPlayer.play();
//       document.getElementById('play').classList.add('pause'); // Add a class to change the appearance
//    } else {
//       audioPlayer.pause();
//       document.getElementById('play').classList.remove('pause'); // Remove the class to revert to play icon
//    }
// }
// console.log("In script.js")
// let audio = document.getElementById('audio');
// let playpause = document.getElementById("play");

// function togglePlayPause() {
//    console.log("In PlayPause Function")
//    if (audio.paused || audio.ended) {
//       console.log("In First IF")
//       playpause.title = "Pause";
//       audio.play();
//    } else {
//       playpause.title = "Play";
//       audio.pause();
//    }
// }

// console.log("Outside PlayPause Function")

// Function to play the song
// function playSong(songname) {
//    // Make a request to the /play-song/:songname endpoint
//    fetch(`/play-song/${encodeURIComponent(songname)}`)
//       .then(response => {
//          // Start playing the song when the response is received
//          const audio = new Audio();
//          audio.src = URL.createObjectURL(response.body);
//          audio.play();
//       })
//       .catch(error => console.error('Error playing song:', error));
// }