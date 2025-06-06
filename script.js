async function fetchData() {
  globalThis.albumDisplayList = [];
  const loader = document.getElementById("loader");
	let gridOrTable = localStorage.getItem("gridOrTable");
  if (gridOrTable === null) {
    gridOrTablere = "grid";
    localStorage.setItem("gridOrTable", gridOrTable);
  }
  loader.classList.remove("hidden"); // Show loader
  try {
    const response = await fetch("https://music.is120.ckearl.com/");
    globalThis.data = await response.json();
    console.log("Data fetched:", globalThis.data);
    showDiv("statsDiv");
  } catch (error) {
    console.error("Error fetching album data:", error);
  } finally {
    loader.classList.add("hidden"); // Hide loader
  }
	toggleGridOrTable(gridOrTable);
}
function toggleGridOrTable(g) {
  // Save the selected mode in localStorage
  localStorage.setItem("gridOrTable", g);

  // Reapply the genre and artist selections
  const genreSelect = document.getElementById("genre-select");
  const artistSelect = document.getElementById("artist-select");

  // Apply the saved genre and artist to the selects
  const savedGenre = localStorage.getItem("selectedGenre");
  const savedArtist = localStorage.getItem("selectedArtist");

  if (savedGenre) {
    genreSelect.value = savedGenre;
  }

  if (savedArtist) {
    artistSelect.value = savedArtist;
  }

  // Reload albums after reapplying genre and artist
  loadAlbums();

  // Switch between grid and table mode
  if (g === "grid") {
    displayAlbums();
  } else {
    displayTable();
  }
}
	
function displayAlbums() {
  const albumsDiv = document.getElementById("albumsDiv");
	albumsDiv.innerHTML = ""; // Clear previous content
  for (let i in globalThis.albumDisplayList) {
    const album = globalThis.albumDisplayList[i];
    // Get the albumsDiv element
    if (!album) {
      console.error("Album data is not available");
      return;
    }
    // Create container div
    const albumContainer = document.createElement("div");
    albumContainer.classList.add("album-container");

    // Create album cover image
    const pic = document.createElement("img");
    pic.src = album.cover_image;
    pic.alt = album.album;
    pic.classList.add("album-cover");

    // Create album name
    const name = document.createElement("p");
    name.textContent = album.album;
    name.classList.add("album-name");

    // Append image and name to container, then container to albumsDiv
    albumContainer.appendChild(pic);
    albumContainer.appendChild(name);
    albumsDiv.appendChild(albumContainer);
  }
}
function displayTable() {
  const albumsDiv = document.getElementById("albumsDiv");
  albumsDiv.innerHTML = ""; // Clear previous content

  const table = document.createElement("table");
  table.classList.add("text-table"); // Optional: add a class for styling

  // Create table header
  const header = document.createElement("tr");
  const artistHeader = document.createElement("th");
  artistHeader.textContent = "Artist";
  const albumHeader = document.createElement("th");
  albumHeader.textContent = "Album";
  header.appendChild(artistHeader);
  header.appendChild(albumHeader);
  table.appendChild(header);

  // Add rows for each album
  for (const album of globalThis.albumDisplayList) {
    const row = document.createElement("tr");

    const artistCell = document.createElement("td");
    artistCell.textContent = album.artist;

    const albumCell = document.createElement("td");
    albumCell.textContent = album.album;

    row.appendChild(artistCell);
    row.appendChild(albumCell);
    table.appendChild(row);
  }

  albumsDiv.appendChild(table);
}

function loadGenres() {
  const mySelect = document.getElementById("genre-select");
  if (!mySelect) {
    console.error("Select element not found!");
    return;
  }

  // Clear existing options
  mySelect.options.length = 0;

  // Populate options dynamically
  const genres = globalThis.data.data.spotify_top_genre_artists;
  for (let i in genres) {
    const option = document.createElement("option");
    option.textContent = genres[i].genre_name;
    option.value = i;
    mySelect.appendChild(option);
  }
	const savedGenre = localStorage.getItem("selectedGenre");
  if (savedGenre) {
    mySelect.value = savedGenre;
  }
  loadArtists();
}

function loadArtists() {
  const genreSelect = document.getElementById("genre-select");
  if (!genreSelect) {
    console.error("genre-select not found");
    return;
  }

  const artistSelect = document.getElementById("artist-select");
  if (!artistSelect) {
    console.error("artist-select not found");
    return;
  }
  // Clear existing options
  artistSelect.options.length = 0;

  const selectedGenre = genreSelect.value;
  if (!selectedGenre) {
    return; // exit if there isn't a genre
  }

  const artists =
    globalThis.data.data.spotify_top_genre_artists[selectedGenre].artists;
  for (let i in artists) {
    const option = document.createElement("option");
    option.textContent = artists[i].name;
    option.value = i;
    artistSelect.appendChild(option);
  }
	const savedArtist = localStorage.getItem("selectedArtist");
  if (savedArtist) {
    artistSelect.value = savedArtist;
  }
  loadAlbums();
}

// I asked Chatgpt to format the divs in this function in a way that the album names could always appear under the album covers
function loadAlbums() {
  const genreSelect = document.getElementById("genre-select");
  const artistSelect = document.getElementById("artist-select");
  const albumsDiv = document.getElementById("albumsDiv");

  if (!genreSelect || !artistSelect || !albumsDiv) {
    console.error("Missing required elements");
    return;
  }

  const selectedGenre = genreSelect.value;
  const selectedArtist = artistSelect.value;

	localStorage.setItem("selectedGenre", selectedGenre);
  localStorage.setItem("selectedArtist", selectedArtist);

  if (!selectedGenre || !selectedArtist) {
    return;
  }

  albumsDiv.innerHTML = "";

  const albums =
    globalThis.data.data.spotify_top_genre_artists[selectedGenre].artists[
      selectedArtist
    ].albums;
  globalThis.albumDisplayList = []; // Clear previous album display list
  for (let i in albums) {
    const album = albums[i];
    let dA = {
      album: album.name,
      artist:
        globalThis.data.data.spotify_top_genre_artists[selectedGenre].artists[
          selectedArtist
        ].name,
      cover_image: album.cover_image,
      genre:
        globalThis.data.data.spotify_top_genre_artists[selectedGenre]
          .genre_name,
    };
    globalThis.albumDisplayList.push(dA);
  }
	const viewMode = localStorage.getItem("gridOrTable");
  if (viewMode === "grid") {
    displayAlbums();
  } else {
    displayTable();
	}
}

function showDiv(divName) {
  const quizDiv = document.getElementById("quizDiv");
  const statsDiv = document.getElementById("statsDiv");

  if (!statsDiv || !quizDiv) {
    console.error("game or stats div not found");
  }

  // toggle classes based on desired menu item
  if (divName === "quizDiv") {
    if (quizDiv.classList.contains("hidden")) {
      quizDiv.classList.remove("hidden");
    }
    if (!statsDiv.classList.contains("hidden")) {
      statsDiv.classList.add("hidden");
    }
  } else {
    if (!quizDiv.classList.contains("hidden")) {
      quizDiv.classList.add("hidden");
    }
    if (statsDiv.classList.contains("hidden")) {
      statsDiv.classList.remove("hidden");
    }
    loadGenres();
    loadQuizArray();
  }
}

function loadQuizArray() {
  globalThis.albumList = [];
  const genres = globalThis.data.data.spotify_top_genre_artists;
  const quiz_limit = 500;
  let number_loaded = 0;
  for (let i in genres) {
    for (let j in genres[i].artists) {
      for (let k in genres[i].artists[j].albums) {
        number_loaded++;
        // Arbitray max number of records
        if (number_loaded > quiz_limit) {
          break;
        }
        let album = {
          genre: genres[i].genre_name,
          artist: genres[i].artists[j].name,
          album: genres[i].artists[j].albums[k].name,
          cover_image: genres[i].artists[j].albums[k].cover_image,
          popularity: genres[i].artists[j].albums[k].popularity,
        };

        // Add the album object to the albumList array
        globalThis.albumList.push(album);
      }
    }
  }
  load2Albums();
}

function load2Albums() {
  // Generate the first random number
  const x1 = Math.floor(Math.random() * globalThis.albumList.length);

  // Generate the second random number, ensuring it is unique
  const x2 = Math.floor(Math.random() * globalThis.albumList.length);
  const album1 = globalThis.albumList[x1];
  const album2 = globalThis.albumList[x2];
  const album1Div = document.getElementById("album1Div");

  // Create album cover image
  const pic = document.createElement("img");
  pic.src = album1.cover_image;
  pic.alt = album1.album;
  pic.classList.add("album-cover");
  pic.onclick = function () {
    albumClicked(this);
  };
  if (album1.popularity >= album2.popularity) {
    pic.dataset.outcome = "winner";
  } else {
    pic.dataset.outcome = "loser";
  }
  album1Div.innerHTML = ""; // Clear previous content
  album1Div.appendChild(pic);

  // Create album name
  const name = document.createElement("p");
  name.textContent = `Album: ${album1.album}`;
  name.classList.add("album-name");
  album1Div.appendChild(name);

  const artistName = document.createElement("p");
  artistName.textContent = `Artist: ${album1.artist}`;
  artistName.classList.add("album-name");
  album1Div.appendChild(artistName);

  // Create second album div
  const album2Div = document.getElementById("album2Div");

  // Create album cover image
  const pic2 = document.createElement("img");
  pic2.src = album2.cover_image;
  pic2.alt = album2.album;
  pic2.classList.add("album-cover");
  pic2.onclick = function () {
    albumClicked(this);
  };
  if (album2.popularity >= album1.popularity) {
    pic2.dataset.outcome = "winner";
  } else {
    pic2.dataset.outcome = "loser";
  }
  album2Div.innerHTML = ""; // Clear previous content
  album2Div.appendChild(pic2);

  // Create album name
  const name2 = document.createElement("p");
  name2.textContent = `Album: ${album2.album}`;
  name2.classList.add("album-name");
  album2Div.appendChild(name2);

  const artistName2 = document.createElement("p");
  artistName2.textContent = `Artist: ${album2.artist}`;
  artistName2.classList.add("album-name");
  album2Div.appendChild(artistName2);
  // Clear previous outcome message
  document.getElementById("winOrLose").innerHTML = "";
}

function albumClicked(me) {
	const correctSound = new Audio('cute-level-up-3-189853.mp3');
	const incorrectSound = new Audio('negative_beeps-6008.mp3');

  let score = localStorage.getItem("score");
  if (score === null) {
    score = 0;
    localStorage.setItem("score", score);
  }
  let gameCount = localStorage.getItem("gameCount");
  if (gameCount === null) {
    gameCount = 0;
    localStorage.setItem("gameCount", gameCount);
  }
  gameCount++;
  if (me.dataset.outcome === "winner") {
    document.getElementById("winOrLose").innerHTML = "You Win!";
    score++;
		correctSound.play();
  } else {
    document.getElementById("winOrLose").innerHTML = "You Lose!";
		incorrectSound.play();
  }

  document.getElementById(
    "quizScore"
  ).innerHTML = `Wins: ${score} Total Games: ${gameCount}`;

  setTimeout(() => {
    load2Albums();
  }, 3000);
  localStorage.setItem("gameCount", gameCount);
  localStorage.setItem("score", score);
}
fetchData();
