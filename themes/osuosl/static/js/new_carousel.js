document.addEventListener('DOMContentLoaded', function () {
    let index = 0;
    let timeoutId; // Variable to store the timeout ID
    const slides = document.getElementsByClassName("slide");

    function displaySlides() {
        // Hide all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        index++;
        if (index > slides.length) {
            index = 1;
        }
        slides[index - 1].style.display = "block";

        // Set timeout for next slide
        timeoutId = setTimeout(displaySlides, 5000);
    }

    function showSlide(n) {
        // Clear the current timeout
        clearTimeout(timeoutId);

        // Hide all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }

        // Update index and ensure it's within bounds
        index = n;
        if (index > slides.length) {
            index = 1;
        }
        if (index < 1) {
            index = slides.length;
        }

        // Show the current slide
        slides[index - 1].style.display = "block";

        // Restart the timeout for auto-slide
        timeoutId = setTimeout(displaySlides, 5000);
    }

    displaySlides();

    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    // Add event listeners for prev and next buttons
    prevButton.addEventListener('click', function () {
        showSlide(index - 1);
    });

    nextButton.addEventListener('click', function () {
        showSlide(index + 1);
    });

    const titles = document.getElementsByClassName("slide-title");
    Array.from(titles).forEach(title => {
        const slideInfo = title.nextElementSibling;

        // Pause slideshow when mouse is over the title or the slideInfo
        title.addEventListener("mouseover", function () {
            slideInfo.classList.add("show");
            clearTimeout(timeoutId); // Pause slideshow
        });

        slideInfo.addEventListener("mouseover", function () {
            slideInfo.classList.add("show");
            clearTimeout(timeoutId); // Pause slideshow
        });

        // Restart slideshow when mouse leaves the title or the slideInfo
        title.addEventListener("mouseout", function () {
            if (!slideInfo.matches(':hover')) {
                slideInfo.classList.remove("show");
                timeoutId = setTimeout(displaySlides, 5000); // Restart slideshow
            }
        });

        slideInfo.addEventListener("mouseout", function () {
            if (!title.matches(':hover')) {
                slideInfo.classList.remove("show");
                timeoutId = setTimeout(displaySlides, 5000); // Restart slideshow
            }
        });
    });
});