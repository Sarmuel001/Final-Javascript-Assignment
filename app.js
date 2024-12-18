//URLs
const API_KEY = '8d85e791b741b0217b3ac82182b8803a'; 
const TRENDING_API_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;
const SEARCH_API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
const GENRE_API_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;

// Global variables
let allMovies = [];
let genres = {};
// Fetch genres
async function fetchGenres() {
    try {
        const response = await fetch(GENRE_API_URL);
        const data = await response.json();
        data.genres.forEach(genre => {
            genres[genre.id] = genre.name;
        });
    } catch (error) {
        console.error('Error fetching genres:', error);
        alert("Error fetching genres");
    }
}


// Fetch trending movies
async function fetchTrendingMovies() {
    showLoading();
    try {
        const response = await fetch(TRENDING_API_URL);
        const data = await response.json();
        allMovies = data.results;
        displayMovies(allMovies, 'trending-movies');
        console.log(data.results);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        displayError('trending-movies');
    } finally {
        hideLoading();
    }
}

// Search for movies
async function searchMovies(query) {
    showLoading();
    try {
        const response = await fetch(`${SEARCH_API_URL}${query}`);
        const data = await response.json();
        displayMovies(data.results, 'trending-movies');
    } catch (error) {
        console.error('Error searching for movies:', error);
        displayError('trending-movies');
    }finally {
        hideLoading();
    }
}

// Display movies in the specified container
function displayMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    movies.forEach(movie => {
      const imgMovie = document.createElement('img');
      imgMovie.classList.add('image-container');
      imgMovie.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      imgMovie.alt=`${movie.title}`;

      const movieElement = document.createElement('div');
      movieElement.classList.add('movie');
      movieElement.innerHTML = `
          <button onclick="addToWatchlist('${movie.title}')">Add to Watchlist</button>
          <button onclick=""><a href='${`https://video.tmdb.org/t/p/w500${movie.backdrop_path}`}'> Stream</a></button>
    
      `;
        movieElement.appendChild(imgMovie)
        container.append(movieElement);
    });
}

// Add movie to watchlist
function addToWatchlist(movieTitle) {
    console.log('Adding to watchlist:', movieTitle); 
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlist.includes(movieTitle)) {
        watchlist.push(movieTitle);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        console.log('Watchlist updated:', watchlist); 
        alert('Movie Successfully added to Watchlist!!!')
        displayWatchlist();
    } else {
       alert('Movie Already in Watchlist!!!')
        console.log('Movie already in watchlist'); 
    }
}

// Display watchlist
function displayWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const container = document.getElementById('watchlist-movies');
    container.innerHTML = ``;
    watchlist.forEach(movieTitle => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <h3>${movieTitle}</h3>
            
            <button onclick="removeFromWatchlist('${movieTitle}')">Remove</button>
        `;
        container.appendChild(movieElement);   
             
    });
    
}

// Remove movie from watchlist
function removeFromWatchlist(movieTitle) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(title => title !== movieTitle);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayWatchlist();
}

// Display error message
function displayError(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p>Failed to load data. Please try again later.</p>';
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await fetchGenres();
    fetchTrendingMovies();
    displayWatchlist();

    // Search functionality
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (event) => {
        const query = event.target.value;
        if (query) {
            searchMovies(query);
        } else {
            fetchTrendingMovies();
            
        }
    });
});

//Page
// documentonreadystation() {
//     if (document.readyState !== "complete") {
//         document.querySelector(
//           "body").style.visibility = "hidden";
//         document.querySelector(
//           "#spinner").style.visibility = "visible";
//     } else {
//         document.querySelector(
//           "#spinner").style.display = "none";
//         document.querySelector(
//           "body").style.visibility = "visible";
//     }
// };

// Display error message
function displayError(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p>Failed to load data. Please try again later.</p>';
}

// Show loading indicator
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

// Hide loading indicator
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function filterByGenre(genreName) {
    const genreId = Object.keys(genres).find(key => genres[key] === genreName);
    const filteredMovies = allMovies.filter(movie => movie.genre_ids.includes(parseInt(genreId)));
    displayMovies(filteredMovies, 'trending-movies');
 
}
