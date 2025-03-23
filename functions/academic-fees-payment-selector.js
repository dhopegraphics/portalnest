  // Add click event listeners to payment method cards
  document.addEventListener('DOMContentLoaded', function () {
    const methodCards = document.querySelectorAll('.method-card');

    methodCards.forEach(card => {
      card.addEventListener('click', function () {
        // Remove selected class from all cards
        methodCards.forEach(c => c.classList.remove('selected'));

        // Add selected class to clicked card
        this.classList.add('selected');
      });
    });
  });