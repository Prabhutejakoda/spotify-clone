// --- DOM Elements ---
const landingPage = document.getElementById('landing-page');
const playerPage = document.getElementById('player-page');
const loginForm = document.getElementById('login-form');
const albumCards = document.querySelectorAll('.album-card');
const playPauseBtn = document.getElementById('play-pause-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const addBtn = document.getElementById('addSongBtn');
const deleteBtn = document.getElementById('delete-btn');
const logoutBtn = document.getElementById('logout-btn');
const signupLink = document.getElementById('signup-link');

const audioPlayer = document.getElementById('audio-player');
const currentSongImg = document.getElementById('current-song-img');
const currentSongTitle = document.getElementById('current-song-title');
const currentSongArtist = document.getElementById('current-song-artist');

const recentlyPlayedList = document.getElementById('recently-played-list');
const artistList = document.getElementById('artist-list');
const latestSongsList = document.getElementById('latest-songs-list');
const toast = document.getElementById('toast-message');
const emailInput = document.getElementById('email-input');
const phoneLoginBtn = document.getElementById('phone-login-btn');
const supportLink = document.getElementById('support-link');
const aboutLink = document.getElementById('about-link');
const contactLink = document.getElementById('contact-link');
const searchInput = document.getElementById('search-input');
const fileInput = document.getElementById("fileInput");
const userEmailDisplay = document.getElementById('user-email');

// NEW: Progress Bar Elements
const progressBar = document.getElementById('progress-bar');
const currentTimeSpan = document.getElementById('current-time');
const totalTimeSpan = document.getElementById('total-time');

// NEW: Volume Bar Elements
const volumeBar = document.getElementById('volume-bar');
const volumeIcon = document.getElementById('volume-icon');

// --- Song & Artist Data (Initial State) ---
const initialSongs = [
    { id: 1, title: 'cheri lady', artist: 'modern talking', image: 'images/cherry.jpeg', audio: 'audio/cheri cheri lady.mp3' },
    { id: 2, title: 'Blinding Lights', artist: 'weekend', image: 'images/weeknd.png', audio: 'audio/Blinding Lights.mp3' },
    { id: 3, title: 'lose my mind', artist: 'Brad pit', image: 'images/lose my mind.jpeg', audio: 'audio/lose my mind -F1.mp3' },
    { id: 4, title: 'OG', artist: 'Thaman', image: 'images/og.jpeg', audio: 'audio/Fire Storm.mp3' },
    { id: 5, title: 'Aashiqui 2', artist: 'Arjith Singh', image: 'images/tum hi ho.jpg', audio: 'audio/Tum Hi Ho.mp3' }
];

const artists = [
    { name: 'A.R. Rahman', image: 'images/rahman.jpeg' },
    { name: 'DSP', image: 'images/dsp.jpeg' },
    { name: 'Thaman', image: 'images/thaman.jpg' }
];

// --- Global Variables ---

let isPlaying = false;
let currentSongIndex = 0;
let songList = [];

// --- Data Persistence Functions ---
function loadSongsFromLocalStorage() {
    const storedSongs = localStorage.getItem('spotify_songs');
    if (storedSongs) {
        songList = JSON.parse(storedSongs);
    } else {
        songList = [...initialSongs];
    }
}

function saveSongsToLocalStorage() {
    localStorage.setItem('spotify_songs', JSON.stringify(songList));
}

// --- Core App Functions ---
function loginUser() {
    landingPage.classList.remove('visible');
    landingPage.classList.add('hidden');
    playerPage.classList.remove('hidden');
    playerPage.classList.add('visible');
    
    // NEW: Display user email
    userEmailDisplay.textContent = emailInput.value;
    supportLink.style.display = 'none'; 
    
    renderMusicContent();
    loadSong(songList[currentSongIndex]);
}

function logoutUser() {
    landingPage.classList.remove('hidden');
    playerPage.classList.remove('visible');
    landingPage.classList.add('visible');
    playerPage.classList.add('hidden');
    
    // NEW: Reset user display
    userEmailDisplay.textContent = '';
    supportLink.style.display = 'inline';
    
    audioPlayer.pause();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function createMusicCard(song) {
    return `
        <div class="music-card" data-song-id="${song.id}">
            <img src="${song.image}" alt="${song.title}">
            <h4>${song.title}</h4>
            <span>${song.artist}</span>
            <button class="play-button"><i class="fas fa-play"></i></button>
        </div>
    `;
}

function createArtistCard(artist) {
    return `
        <div class="artist-card">
            <img src="${artist.image}" alt="${artist.name}">
            <span>${artist.name}</span>
        </div>
    `;
}

function renderMusicContent() {
    recentlyPlayedList.innerHTML = '';
    latestSongsList.innerHTML = '';
    artistList.innerHTML = '';

    const shuffledSongs = shuffleArray([...songList]);
    shuffledSongs.slice(0, 5).forEach(song => {
        recentlyPlayedList.innerHTML += createMusicCard(song);
    });
    
    shuffledSongs.slice(3).forEach(song => {
        latestSongsList.innerHTML += createMusicCard(song);
    });

    artists.forEach(artist => {
        artistList.innerHTML += createArtistCard(artist);
    });

    document.querySelectorAll('.music-card .play-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const songId = e.target.closest('.music-card').dataset.songId;
            const songIndex = songList.findIndex(s => s.id == songId);
            if (songIndex !== -1) {
                currentSongIndex = songIndex;
                loadSong(songList[currentSongIndex]);
                togglePlayPause();
            }
        });
    });
}

// --- Music Player Functions ---
function loadSong(song) {
    currentSongTitle.textContent = song.title;
    currentSongArtist.textContent = song.artist;
    currentSongImg.src = song.image;
    audioPlayer.src = song.audio;
    
    // NEW: Highlight the active song card
    document.querySelectorAll('.music-card').forEach(card => card.classList.remove('active'));
    const activeCard = document.querySelector(`.music-card[data-song-id="${song.id}"]`);
    if (activeCard) {
        activeCard.classList.add('active');
    }
}
//core music 
function togglePlayPause() {
    const activeCard = document.querySelector(`.music-card[data-song-id="${songList[currentSongIndex].id}"]`);
    const playButtonIcon = activeCard ? activeCard.querySelector('.play-button i') : null;

    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (playButtonIcon) playButtonIcon.className = 'fas fa-play';
    } else {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        if (playButtonIcon) playButtonIcon.className = 'fas fa-pause';
    }
    isPlaying = !isPlaying;
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songList.length;
    loadSong(songList[currentSongIndex]);
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songList.length) % songList.length;
    loadSong(songList[currentSongIndex]);
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function shuffleSongs() {
    songList = shuffleArray(songList);
    currentSongIndex = 0;
    loadSong(songList[currentSongIndex]);
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    alert('Shuffling complete!');
}

function addLocalSong(file) {
    if (file) {
        const url = URL.createObjectURL(file);
        const title = file.name.replace(/\.[^/.]+$/, "");
        const newSong = {
            id: songList.length + 1,
            title: title,
            artist: "Local File",
            image: "https://placehold.co/180x180",
            audio: url
        };
        songList.push(newSong);
        saveSongsToLocalStorage();
        renderMusicContent();
        currentSongIndex = songList.length - 1;
        loadSong(songList[currentSongIndex]);
        togglePlayPause();
        alert(`Added and playing: "${title}"`);
    }
}

function deleteSong() {
    if (songList.length === 0) {
        alert("There are no songs in the playlist to delete.");
        return;
    }
    const deletedSongTitle = songList[currentSongIndex].title;
    songList.splice(currentSongIndex, 1);
    saveSongsToLocalStorage();

    audioPlayer.pause();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';

    if (songList.length > 0) {
        if (currentSongIndex >= songList.length) {
            currentSongIndex = 0;
        }
        loadSong(songList[currentSongIndex]);
    } else {
        currentSongTitle.textContent = '';
        currentSongArtist.textContent = '';
        currentSongImg.src = '';
        audioPlayer.src = '';
    }

    renderMusicContent();
    alert(`"${deletedSongTitle}" has been deleted from your playlist.`);
}

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

function displaySongs(songsToDisplay) {
    recentlyPlayedList.innerHTML = '';
    
    if (songsToDisplay.length === 0) {
        recentlyPlayedList.innerHTML = '<p style="text-align: center;">No songs found.</p>';
        return;
    }
    
    songsToDisplay.forEach(song => {
        recentlyPlayedList.innerHTML += createMusicCard(song);
    });
    
    document.querySelectorAll('.music-card .play-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const songId = e.target.closest('.music-card').dataset.songId;
            const songIndex = songList.findIndex(s => s.id == songId);
            if (songIndex !== -1) {
                currentSongIndex = songIndex;
                loadSong(songList[currentSongIndex]);
                togglePlayPause();
            }
        });
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
}

// --- Event Listeners ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
        showToast();
        setTimeout(() => {
            loginUser();
        }, 1000);
    } else {
        alert("Please enter a valid email address.");
    }
});

logoutBtn.addEventListener('click', logoutUser);

playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
shuffleBtn.addEventListener('click', shuffleSongs);
deleteBtn.addEventListener('click', deleteSong);

addBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", (event) => {
    addLocalSong(event.target.files[0]);
});

signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Please signup using Your Email below to Enter into Spotify music world.');
});

albumCards.forEach(card => {
    card.addEventListener('click', () => {
        alert('Please signup using Your Gmail account to listen music.');
    });
});

phoneLoginBtn.addEventListener('click', () => {
    alert("Mobile number login feature is not implemented yet!");
});

supportLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert("Thank you for your interest! For support, please contact us at support@spotifyClone.com");
});

aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert("This is a Spotify music clone created By Prabhuteja, Murali and charan");
});

contactLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert("For contact information, please reach out to spotifyClone@gmail.com.");
});

// Progress bar listeners
audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progress;
    currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
});
audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeSpan.textContent = formatTime(audioPlayer.duration);
});
progressBar.addEventListener('input', () => {
    const newTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
});

// Volume bar listener
volumeBar.addEventListener('input', () => {
    audioPlayer.volume = volumeBar.value;
});

// Search bar functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm === '') {
        renderMusicContent();
        return;
    }
    
    const filteredSongs = songList.filter(song => {
        return song.title.toLowerCase().includes(searchTerm) || 
               (song.artist && song.artist.toLowerCase().includes(searchTerm));
    });
    
    displaySongs(filteredSongs);
});

// --- Initial Page Setup ---
document.addEventListener('DOMContentLoaded', () => {
    loadSongsFromLocalStorage();
    landingPage.classList.remove('hidden');
    landingPage.classList.add('visible');
});