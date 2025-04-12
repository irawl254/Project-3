async function fetchData() {
  try {
    const response = await fetch("https://music.is120.ckearl.com/");
    globalThis.data = await response.json(); // Assumes the site provides a JSON response
    // displayArtists(albums,'pop');
  } catch (error) {
    console.error("Error fetching album data:", error);
  }
}
function loadGenres() {
  mySelect = document.getElementById("genre-select");
//   mySelect.option.length = 0;
  for (let i in globalThis.data.data.spotify_top_genre_artists) {
    alert(globalThis.data.data.spotify_top_genre_artists[i].genre_name);
    const myLine = document.createElement("option");
    myLine.textContent =
      globalThis.data.data.spotify_top_genre_artists[i].genre_name;
    myLine.value = globalThis.data.data.spotify_top_genre_artists[i].genre_name;
    mySelect.appendChild(myLine);
  }
}

async function loadPage(pageName, divName) {
  const pageDiv = document.getElementById(divName);
  pageDiv.innerHTML = ""; // Clear the div before loading new content
  const pagePath = `./${pageName}`; // Assuming the HTML files are in the same directory
  fetch(pagePath)
    .then((response) => response.text())
    .then((data) => {
      pageDiv.innerHTML = data;
      
    })
    .catch((error) => console.error("Error loading page:", error));
    if (pageName === "stats.html") {
      loadGenres();
    }
}

fetchData();
