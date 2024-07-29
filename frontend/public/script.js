window.initializeRatings = (productId) => {
    // Function to get stored ratings
    const getStoredRatings = () => {
        const storedRatings = localStorage.getItem('productRatings');
        return storedRatings ? JSON.parse(storedRatings) : {};
    };

    // Function to set stored ratings
    const setStoredRatings = (ratings) => {
        localStorage.setItem('productRatings', JSON.stringify(ratings));
    };

    // Function to check if the star is selected
    const checkSelectedStar = (star, currentRatingIndex) => {
        return parseInt(star.getAttribute("data-rate")) === currentRatingIndex;
    };

    // Function to set the rating
    const setRating = (index) => {
        const stars = document.querySelectorAll(".star");
        const emojiEl = document.querySelector(".emoji");
        const statusEl = document.querySelector(".status");

        if (!stars || !emojiEl || !statusEl) return;

        stars.forEach((star) => star.classList.remove("selected"));

        if (index > 0 && index <= stars.length) {
            document.querySelector(`[data-rate="${index}"]`).classList.add("selected");
        }

        const rating = ratings[index];
        emojiEl.innerHTML = rating ? rating.emoji : "";
        statusEl.innerHTML = rating ? rating.name : "Give us rating"; // Default name if rating is not found
    };

    // Function to reset the rating
    const resetRating = (stars, emojiEl, statusEl) => {
        const defaultRatingIndex = 0;
        setRating(defaultRatingIndex, stars, emojiEl, statusEl);
    };

    const ratings = [
        { emoji: "", name: "Give us rating" },
        { emoji: "😔", name: "Very Poor" },
        { emoji: "🙁", name: "Poor" },
        { emoji: "🙂", name: "Good" },
        { emoji: "🤩", name: "Very Good" },
        { emoji: "🥰", name: "Excellent" }
    ];

    const stars = document.querySelectorAll(`.productdisplay[data-product-id="${productId}"] .star`);
    const emojiEl = document.querySelector(`.productdisplay[data-product-id="${productId}"] .emoji`);
    const statusEl = document.querySelector(`.productdisplay[data-product-id="${productId}"] .status`);
    const avgRatingEl = document.querySelector(`.productdisplay[data-product-id="${productId}"] .average-rating`);
    let currentRatingIndex = 0;

    // Load stored rating and apply it
    const storedRatings = getStoredRatings();
    if (storedRatings[productId]) {
        currentRatingIndex = storedRatings[productId];
        setRating(currentRatingIndex, stars, emojiEl, statusEl);
    } else {
        setRating(currentRatingIndex, stars, emojiEl, statusEl);
    }

    // Add event listeners to stars
    stars.forEach((star) => {
        star.addEventListener("click", function () {
            if (checkSelectedStar(star, currentRatingIndex)) {
                resetRating(stars, emojiEl, statusEl);
                return;
            }
            const index = parseInt(star.getAttribute("data-rate"));
            currentRatingIndex = index;
            setRating(index, stars, emojiEl, statusEl);
            // Save rating to localStorage
            const updatedRatings = getStoredRatings();
            updatedRatings[productId] = index;
            setStoredRatings(updatedRatings);

            // Send rating to the server
            fetch('https://backend-beryl-nu-15.vercel.app/rateproduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') // Assume user token is stored in localStorage
                },
                body: JSON.stringify({ productId, rating: index })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    avgRatingEl.innerText = `Average Rating: ${data.averageRating.toFixed(2)}`;
                } else {
                    console.error('Error updating rating:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });

        star.addEventListener("mouseover", function () {
            const index = parseInt(star.getAttribute("data-rate"));
            setRating(index, stars, emojiEl, statusEl);
        });

        star.addEventListener("mouseout", function () {
            setRating(currentRatingIndex, stars, emojiEl, statusEl);
        });
    });

    // Fetch and display average rating on initialization
    fetch(`https://backend-beryl-nu-15.vercel.app/getaveragerating?productId=${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                avgRatingEl.innerText = `Average Rating: ${data.averageRating.toFixed(2)}`;
            } else {
                console.error('Error fetching average rating:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
};
