      // Form submission handling
      document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const number = document.getElementById('number').value;
        const message = document.getElementById('message').value;

        // Here you would typically send this data to your server
        console.log('Form submitted:', { name, email, number, message });
        
        // Clear form
        this.reset();
        document.getElementById('popupOverlay').style.display = 'flex';
      });

      // Close popup on button click
      document.getElementById('popupClose').addEventListener('click', function() {
        document.getElementById('popupOverlay').style.display = 'none';
      });

      // Close popup when clicking outside
      document.getElementById('popupOverlay').addEventListener('click', function(e) {
        if (e.target === this) {
          this.style.display = 'none';
        }
      });