// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function () {
  console.log("Page is fully loaded.");

  // Example: Button click alert
  const btn = document.getElementById('clickMe');
  if (btn) {
    btn.addEventListener('click', function () {
      alert("You clicked the button!");
    });
  }

  // Example: Change heading text
  const heading = document.querySelector('h1');
  if (heading) {
    heading.textContent = "Welcome to My Page!";
  }
});
