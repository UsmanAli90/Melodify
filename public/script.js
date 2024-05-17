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





// document.addEventListener('DOMContentLoaded', function () {
//     const playButtons = document.querySelectorAll('[id^="playbutton11"]');
//     const audioPlayer = document.getElementById('audio-player');

//     playButtons.forEach(playButton => {
//         playButton.addEventListener('click', async function () {
//             const songId = playButton.getAttribute('data-songid');
//             console.log("SONG ID IS: ", songId);

//             if (!songId) {
//                 console.error('No song ID found');
//                 return;
//             }

//             try {
//                 const response = await fetch(`/song/${songId}`);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch the song');
//                 }
//                 const blob = await response.blob();
//                 const url = URL.createObjectURL(blob);

//                 audioPlayer.src = url;
//                 audioPlayer.play();

//                 playButton.style.display = 'none';
//                 const pauseButton = document.getElementById(`pausebutton11${songId}`);
//                 pauseButton.style.display = 'inline';
//             } catch (error) {
//                 console.error('Error fetching or playing the song:', error);
//             }
//         });
//     });

//     const pauseButtons = document.querySelectorAll('[id^="pausebutton11"]');
//     pauseButtons.forEach(pauseButton => {
//         pauseButton.addEventListener('click', function () {
//             audioPlayer.pause();
//             const songId = pauseButton.getAttribute('data-songid');
//             const playButton = document.getElementById(`playbutton11${songId}`);
//             playButton.style.display = 'inline';
//             pauseButton.style.display = 'none';
//         });
//     });
// });


document.addEventListener('DOMContentLoaded', function () {
    const playButtons = document.querySelectorAll('.playbutton');
    const audioPlayer = document.getElementById('audio-player');

    playButtons.forEach(playButton => {
        playButton.addEventListener('click', async function () {
            const songId = playButton.getAttribute('data-songid');
            console.log("SONG ID IS: ", songId);

            if (!songId) {
                console.error('No song ID found');
                return;
            }

            try {
                const response = await fetch(`/play-song/${songId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch the song');
                }
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                audioPlayer.src = url;
                audioPlayer.play();
                audioPlayer.style.display = 'block';

                playButton.style.display = 'none';
                const pauseButton = document.getElementById(`pausebutton${songId}`);
                pauseButton.style.display = 'inline';
            } catch (error) {
                console.error('Error fetching or playing the song:', error);
            }
        });
    });

    const pauseButtons = document.querySelectorAll('.pausebutton');
    pauseButtons.forEach(pauseButton => {
        pauseButton.addEventListener('click', function () {
            audioPlayer.pause();
            const songId = pauseButton.getAttribute('data-songid');
            const playButton = document.getElementById(`playbutton${songId}`);
            playButton.style.display = 'inline';
            pauseButton.style.display = 'none';
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchButton.addEventListener('click', async () => {
        try {
            const searchQuery = searchInput.value.trim();
            if (searchQuery === '') {
                return; // Do nothing if the search query is empty
            }

            // Send a request to the server to search for the song
            const response = await fetch(`/search-song?query=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) {
                throw new Error('Failed to search for the song');
            }

            // Parse the JSON response
            const songs = await response.json();

            // Clear previous search results
            searchResults.innerHTML = '';

            // Display the search results
            songs.forEach(song => {
                const songItem = document.createElement('div');
                songItem.classList.add('song-item');
                songItem.textContent = song.songname; // Customize this as needed
                searchResults.appendChild(songItem);
            });
        } catch (error) {
            console.error('Error searching for song:', error);
            // Optionally display an error message to the user
        }
    });
});

