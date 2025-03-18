document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello world");
  let istoggleFilterActive = false;
  const aside = document.querySelector("aside");

  const toggleFilter = document.querySelector(".toggle-filter");
  const closeAside = document.querySelector(".close-btn");
  toggleFilter.addEventListener("click", () => {
    if (istoggleFilterActive == false) {
      aside.classList.add("act");
      istoggleFilterActive = true;
      console.log(istoggleFilterActive);
    } else {
      return;
    }
  });

  closeAside.addEventListener("click", () => {
    aside.classList.remove("act");
    istoggleFilterActive = false;
    console.log(istoggleFilterActive);
  });
});
