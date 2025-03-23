
document.querySelector(".see_all").classList.toggle("width");
document.querySelector(".card_mid_content").classList.toggle("margin");
document.querySelector(".first_ctext").classList.toggle("margin");
document.querySelector(".card_scroll").classList.toggle("scroll");
document.querySelector(".main__main-content").classList.toggle("width");
document.querySelector(".admission_scroll").classList.toggle("width");

document.querySelectorAll(".admission_scroll_card").forEach((width) => {
  width.classList.toggle("width");
});