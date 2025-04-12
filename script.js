async function fetchData() {
    try {
      const response = await fetch('https://music.is120.ckearl.com/');
      data = await response.json(); // Assumes the site provides a JSON response
      // displayArtists(albums,'pop');
      myDiv=document.getElementById('genre-list'); 
      myDiv.innerHTMLL="";
      for(let i in data.data.spotify_top_genre_artists){
        const myLine = document.createElement('p');
        myLine.textContent = data.data.spotify_top_genre_artists[i].genre_name;
        // myDiv.appendChild(myLine);        
      }
    } catch (error) {
      console.error('Error fetching album data:', error);
    }
  }

   async function loadPage(pageName, divName) {
    alert("Loading page: " + pageName);
    const pageDiv = document.getElementById(divName);
    pageDiv.innerHTML = ''; // Clear the div before loading new content
    const pagePath = `./${pageName}`; // Assuming the HTML files are in the same directory
    fetch(pagePath)
      .then(response => response.text())
      .then(data => {
        pageDiv.innerHTML = data;
      })
      .catch(error => console.error('Error loading page:', error));
   }