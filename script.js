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


// document.addEventListener('DOMContentLoaded', () => {
//    // Fetch songs when the page loads
//    fetch('/songs')
//       .then(response => response.json())
//       .then(songs => {
//          // Populate the song list
//          const list = document.querySelector('.list');
//          songs.forEach((song, index) => {
//             const row = document.createElement('tr');
//             row.classList.add('song');
//             row.innerHTML = `
//                    <td class="nr">${index + 1}</td>
//                    <td class="title">${song.filename}</td>
//                    <td class="length">${song.duration}</td>
//                    <td><button onclick="playSong('${song._id}', '${song.filename}')">Play</button></td>
//                `;
//             list.appendChild(row);
//          });
//       })
//       .catch(error => console.error('Error fetching songs:', error));
// });

// // Function to play a song
// function playSong(songId, filename) {
//    const audio = document.getElementById('audio');
//    audio.src = `/play-song/${filename}`;
//    audio.play();
// }



