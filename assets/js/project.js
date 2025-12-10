// Function to open the lightbox
function openLightbox(imgElement) {
    var modal = document.getElementById("lightboxModal");
    var modalImg = document.getElementById("expandedImg");
    
    modal.style.display = "flex"; // Changed from block to flex for centering
    modalImg.src = imgElement.src;
    modalImg.alt = imgElement.alt;
    
    // Disable scrolling on background
    document.body.style.overflow = "hidden";
}

// Function to close the lightbox
function closeLightbox() {
    var modal = document.getElementById("lightboxModal");
    modal.style.display = "none";
    
    // Re-enable scrolling
    document.body.style.overflow = "auto";
}

// Close when clicking outside the image
document.getElementById("lightboxModal").addEventListener("click", function(e) {
    if (e.target === this) {
        closeLightbox();
    }
});

// Close on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeLightbox();
    }
});
