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


document.addEventListener('DOMContentLoaded', function () {
    const searchIcon = document.querySelector('.search-icon');
    const searchInputContainer = document.querySelector('.search-input-container');

    searchIcon.addEventListener('click', function () {
        // Clear previous content
        searchInputContainer.innerHTML = '';

        // Create and append input element
        const searchInput = document.createElement('input');
        searchInput.setAttribute('type', 'text');
        searchInput.setAttribute('placeholder', 'Search songs...');
        searchInput.classList.add('search-input');
        searchInputContainer.appendChild(searchInput);

        // Focus on input field
        searchInput.focus();

        // Listen for input events
        searchInput.addEventListener('input', function () {
            const searchQuery = this.value.toLowerCase();
            const searchResults = searchSongs(searchQuery);
            displaySearchResults(searchResults);
        });
    });

    function searchSongs(query) {
        // Sample list of songs
        const songs = [
            { title: 'Song 1', artist: 'Artist 1' },
            { title: 'Song 2', artist: 'Artist 2' },
            { title: 'Song 3', artist: 'Artist 3' },
            // Add more songs as needed
        ];

        // Filter songs based on query
        const filteredSongs = songs.filter(song => {
            const title = song.title.toLowerCase();
            const artist = song.artist.toLowerCase();
            return title.includes(query) || artist.includes(query);
        });

        return filteredSongs;
    }

    function displaySearchResults(results) {
        // Assuming you have a container to display the search results
        const searchResultsContainer = document.querySelector('.search-results');
        searchResultsContainer.innerHTML = '';

        if (results.length === 0) {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = 'No results found.';
            searchResultsContainer.appendChild(noResultsMessage);
        } else {
            const resultList = document.createElement('ul');
            results.forEach(result => {
                const listItem = document.createElement('li');
                listItem.textContent = `${result.title} - ${result.artist}`;
                resultList.appendChild(listItem);
            });
            searchResultsContainer.appendChild(resultList);
        }
    }
});

