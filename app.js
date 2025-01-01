const API_KEY = "563492ad6f91700001000001607dea46955541fb8f250c99051589ba"; // Replace with your Pexels API key
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const gallery = document.getElementById("gallery");
const loadMoreBtn = document.getElementById("load-more-btn");
const loadMoreContainer = document.getElementById("load-more-container");
const resolutionModal = document.getElementById("resolution-modal");
const resolutionOptions = document.getElementById("resolution-options");
const closeModalBtn = document.getElementById("close-modal");

let currentPage = 1; // Track the current page for API requests
let currentQuery = ""; // Track the current search query

// Fetch photos from Pexels API
const fetchPhotos = async (query, page) => {
  const endpoint = query
    ? `https://api.pexels.com/v1/search?query=${query}&per_page=12&page=${page}`
    : `https://api.pexels.com/v1/curated?per_page=12&page=${page}`;
  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: API_KEY,
      },
    });
    const data = await response.json();
    return data.photos;
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
};

// Display photos in the gallery
const displayPhotos = (photos) => {
    photos.forEach((photo) => {
      const photoDiv = document.createElement("div");
      photoDiv.className = "bg-white rounded-lg shadow overflow-hidden";
      photoDiv.innerHTML = `
        <img src="${photo.src.medium}" alt="${photo.photographer}" class="w-full h-48 object-cover cursor-pointer" data-photo='${JSON.stringify(
          photo.src
        )}' />
        <div class="p-4">
          <h2 class="text-lg font-bold">${photo.photographer}</h2>
        </div>
      `;
  
      // Add event listener to open the modal when the image is clicked
      const imgElement = photoDiv.querySelector("img");
      imgElement.addEventListener("click", () => openResolutionModal(photo.src));
  
      gallery.appendChild(photoDiv);
    });
  };
  

// Load initial curated photos (infinite scroll)
const loadInitialPhotos = async () => {
  const photos = await fetchPhotos("", currentPage);
  displayPhotos(photos);
  currentPage++;
};

// Load photos for search results
const loadSearchPhotos = async () => {
  const photos = await fetchPhotos(currentQuery, currentPage);
  displayPhotos(photos);
  currentPage++;
};


// Open the resolution selection modal
const openResolutionModal = (src) => {
    resolutionOptions.innerHTML = ""; // Clear previous options
  
    // Available resolutions
    const resolutions = [
      { label: "Original", url: src.original },
      { label: "Large", url: src.large },
      { label: "Medium", url: src.medium },
      { label: "Small", url: src.small },
      { label: "Tiny", url: src.tiny },
    ];
  
    // Create resolution options
    resolutions.forEach((res) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <button
          class="w-full text-left bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          data-url="${res.url}"
        >
          ${res.label}
        </button>
      `;
  
      // Add click event to download the image
      li.querySelector("button").addEventListener("click", () => {
        const downloadLink = document.createElement("a");
        downloadLink.href = res.url;
        downloadLink.download = "image.jpg"; // Set a default file name
        downloadLink.click();
      });
  
      resolutionOptions.appendChild(li);
    });
  
    // Show the modal
    resolutionModal.classList.remove("hidden");
  };
  
  // Close the modal
  closeModalBtn.addEventListener("click", () => {
    resolutionModal.classList.add("hidden");
  });

// Handle search functionality
searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (query) {
    currentQuery = query;
    currentPage = 1;
    gallery.innerHTML = ""; // Clear the gallery
    const photos = await fetchPhotos(query, currentPage);
    displayPhotos(photos);
    currentPage++;
    loadMoreContainer.classList.remove("hidden"); // Show Load More button
  }
});

// Handle Load More button
loadMoreBtn.addEventListener("click", loadSearchPhotos);

// Infinite scrolling for curated photos
window.addEventListener("scroll", async () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !currentQuery
  ) {
    const photos = await fetchPhotos("", currentPage);
    displayPhotos(photos);
    currentPage++;
  }
});

// Initial load
loadInitialPhotos();