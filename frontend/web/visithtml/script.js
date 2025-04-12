// Add YouTube API script tag
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// YouTube player variable
let youtubePlayer;

// Initialize YouTube player when API is ready
function onYouTubeIframeAPIReady() {
  youtubePlayer = new YT.Player("youtube-player", {
    videoId: "THrCxzbjaYM",
    playerVars: {
      autoplay: 1,
      loop: 1,
      mute: 1,
      controls: 0,
      showinfo: 0,
      rel: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
      playlist: "THrCxzbjaYM", // Must repeat the videoId for looping
      disablekb: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

// When player is ready
function onPlayerReady(event) {
  event.target.playVideo();
  event.target.mute();

  // Resize player to cover the entire container
  resizeYouTubePlayer();
  window.addEventListener("resize", resizeYouTubePlayer);
}

// Handle player state changes
function onPlayerStateChange(event) {
  // If video ends, replay it
  if (event.data === YT.PlayerState.ENDED) {
    event.target.playVideo();
  }
}

// Function to resize the YouTube player to maintain aspect ratio
function resizeYouTubePlayer() {
  const videoContainer = document.querySelector(".video-container");
  const containerWidth = videoContainer.offsetWidth;
  const containerHeight = videoContainer.offsetHeight;

  // Calculate dimensions to maintain 16:9 aspect ratio and cover the container
  let width, height;
  const containerRatio = containerWidth / containerHeight;
  const videoRatio = 16 / 9;

  if (containerRatio > videoRatio) {
    // Container is wider than the video
    width = containerWidth;
    height = containerWidth / videoRatio;
  } else {
    // Container is taller than the video
    height = containerHeight;
    width = containerHeight * videoRatio;
  }

  // Apply styles if player exists
  if (youtubePlayer && youtubePlayer.getIframe) {
    const iframe = youtubePlayer.getIframe();
    iframe.style.width = width + "px";
    iframe.style.height = height + "px";
    iframe.style.position = "absolute";
    iframe.style.top = "50%";
    iframe.style.left = "50%";
    iframe.style.transform = "translate(-50%, -50%)";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Testimonial Slider Functionality
  const testimonials = [
    {
      text: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."',
      author: "John Doe",
      role: "Park Visitor",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      text: '"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',
      author: "Jane Smith",
      role: "Tour Guide",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      text: '"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."',
      author: "Robert Johnson",
      role: "Wildlife Expert",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
    },
  ];

  let currentTestimonialIndex = 0;
  const testimonialContainer = document.querySelector(".testimonial");
  const dots = document.querySelectorAll(".dot");

  // Function to update testimonial content
  function updateTestimonial(index) {
    const testimonial = testimonials[index];

    const testimonialHTML = `
            <div class="testimonial-text">
                <p>${testimonial.text}</p>
            </div>
            <div class="testimonial-author">
                <img src="${testimonial.image}" alt="Testimonial Author">
                <div class="author-details">
                    <h4>${testimonial.author}</h4>
                    <p>${testimonial.role}</p>
                </div>
            </div>
        `;

    testimonialContainer.innerHTML = testimonialHTML;

    // Update active dot
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  // Initialize arrows functionality
  const leftArrow = document.querySelector(".testimonial-arrow.left");
  const rightArrow = document.querySelector(".testimonial-arrow.right");

  leftArrow.addEventListener("click", () => {
    currentTestimonialIndex =
      (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
    updateTestimonial(currentTestimonialIndex);
  });

  rightArrow.addEventListener("click", () => {
    currentTestimonialIndex =
      (currentTestimonialIndex + 1) % testimonials.length;
    updateTestimonial(currentTestimonialIndex);
  });

  // Initialize dots functionality
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentTestimonialIndex = index;
      updateTestimonial(currentTestimonialIndex);
    });
  });

  // Auto slide testimonials every 10 seconds
  setInterval(() => {
    currentTestimonialIndex =
      (currentTestimonialIndex + 1) % testimonials.length;
    updateTestimonial(currentTestimonialIndex);
  }, 10000);
});
