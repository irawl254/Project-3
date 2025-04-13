async function fetchData() {
    try {
      const response = await fetch("https://music.is120.ckearl.com/");
      globalThis.data = await response.json(); // Assumes the site provides a JSON response
      // displayArtists(albums,'pop');
      showDiv('statsDiv'); 
    } catch (error) {
      console.error("Error fetching album data:", error);
    }
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
    loadArtists();  
  }
  
  
  
  
  function loadArtists(){
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
    if(!selectedGenre){
      return; // exit if there isn't a genre
    }
  
    const artists = globalThis.data.data.spotify_top_genre_artists[selectedGenre].artists;
    for (let i in artists) {
      const option = document.createElement("option");
      option.textContent = artists[i].name;
      option.value = i;
      artistSelect.appendChild(option);
    }
    loadAlbums(); 
  }
  
  
  function loadAlbums(){
    // check to make sure all the elements exit
    const genreSelect = document.getElementById("genre-select");
    if (!genreSelect) {
      console.error("genre-select not found");
      return;
    }
  
    const selectedGenre = genreSelect.value;
    if(!selectedGenre){
      console.error("no genre selected");
      return; // exit if there isn't a genre
    }
  
    const artistSelect = document.getElementById("artist-select");
    if (!artistSelect) {
      console.error("artist-select not found");
      return;
    }
  
    const selectedArtist = artistSelect.value;
    if(!selectedArtist){
      console.error("no artist selected");    
      return; // exit if there isn't a genre
    }
  
    const albumsDiv = document.getElementById("albumsDiv");
    if (!albumsDiv) {
      console.error("albumsDiv not found");
      return;
    }
  
    albumsDiv.innerHTML="";
  
    // now get the albums for the specified genre and artist
    const albums = globalThis.data.data.spotify_top_genre_artists[selectedGenre].artists[selectedArtist].albums;
    for (let i in albums) {
      const pic = document.createElement("img");
      pic.src = albums[i].cover_image;
      pic.alt = albums[i].name;
      pic.classList.add("album-cover");
      //img.data-album_num=i;  
      albumsDiv.appendChild(pic);
    }
  }
  
  
  
  
  function showDiv(divName) {
    const quizDiv = document.getElementById('quizDiv');
    const statsDiv = document.getElementById('statsDiv');
  
    if(!statsDiv || !quizDiv){
      console.error('game or stats div not found'); 
    }
  
    // toggle classes based on desired menu item
    if(divName==='quizDiv'){
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
    }
  }
  
  fetchData();
   