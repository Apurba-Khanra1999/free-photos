const API_KEY = "563492ad6f91700001000001607dea46955541fb8f250c99051589ba"; // Replace with your Pexels API key
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const gallery = document.getElementById("gallery");
const resolutionModal = document.getElementById("resolution-modal");
const resolutionOptions = document.getElementById("resolution-options");
const closeModalBtn = document.getElementById("close-modal");
const loadingSpinner = document.getElementById("loading-spinner");

let currentPage = 1; // Track the current page for API requests
let currentQuery = ""; // Track the current search query
let isLoading = false; // Prevent concurrent API requests

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
    photoDiv.className =
      "bg-white rounded-lg shadow overflow-hidden transform hover:scale-105 transition duration-300";
    photoDiv.innerHTML = `
      <img src="${photo.src.medium}" alt="${photo.photographer}" class="w-full h-48 object-cover cursor-pointer" data-photo='${JSON.stringify(
        photo.src
      )}' />
      <div class="p-4">
        <h2 class="text-lg font-bold text-gray-800">${photo.photographer}</h2>
      </div>
    `;

    // Add event listener to open the modal when the image is clicked
    const imgElement = photoDiv.querySelector("img");
    imgElement.addEventListener("click", () => openResolutionModal(photo.src));

    gallery.appendChild(photoDiv);
  });
};

// Load photos for curated or search results
const loadPhotos = async () => {
  if (isLoading) return;
  isLoading = true;

  // Show the loading spinner
  loadingSpinner.classList.remove("hidden");

  const photos = await fetchPhotos(currentQuery, currentPage);
  displayPhotos(photos);
  currentPage++;

  // Hide the loading spinner
  loadingSpinner.classList.add("hidden");
  isLoading = false;
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
    await loadPhotos();
  }
});

// Infinite scrolling
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !isLoading
  ) {
    loadPhotos();
  }
});

// Initial load
loadPhotos();
