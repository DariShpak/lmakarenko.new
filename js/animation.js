document.addEventListener("DOMContentLoaded", function() {
  const lines = document.querySelectorAll('.horizontal-line');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1 
  });

  lines.forEach(line => {
    observer.observe(line);
  });
});