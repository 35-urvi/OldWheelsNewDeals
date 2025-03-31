const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
  };
  
      ScrollReveal().reveal(".service__image img", {
      ...scrollRevealOption,
      origin: "left",
      });
      ScrollReveal().reveal(".service__content .section__subheader", {
      ...scrollRevealOption,
      delay: 500,
      });
      ScrollReveal().reveal(".service__content .section__header", {
      ...scrollRevealOption,
      delay: 1000,
      });
      ScrollReveal().reveal(".service__list li", {
      ...scrollRevealOption,
      delay: 1500,
      interval: 500,
      });
  
          document.getElementById('sellButton').addEventListener('click', function() {
              document.getElementById('sellForm').classList.add('active');
              this.scrollIntoView({ behavior: 'smooth' });
          });
          document.querySelectorAll('.preview-box').forEach(box => {
              const input = box.querySelector('input[type="file"]');
              const img = box.querySelector('img');
              const removeBtn = box.querySelector('.remove-image');
  
              box.addEventListener('click', (e) => {
                  if (e.target !== removeBtn) {
                      input.click();
                  }
              });
  
              input.addEventListener('change', (e) => {
                  const file = e.target.files[0];
                  if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                          img.src = e.target.result;
                          box.classList.add('has-image');
                      };
                      reader.readAsDataURL(file);
                  }
              });
  
              removeBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  input.value = '';
                  img.src = '';
                  box.classList.remove('has-image');
              });
          });
  
          // Form submission with progress and popup
          const form = document.getElementById('sellForm');
          const progressContainer = document.querySelector('.progress-container');
          const progressFill = document.querySelector('.progress-fill');
          const progressText = document.querySelector('.progress-text');
          const popup = document.querySelector('.popup');
          const overlay = document.querySelector('.overlay');
          const popupClose = document.querySelector('.popup-close');
  
          function showPopup(type, title, message) {
              popup.className = 'popup ' + type;
              popup.querySelector('h3').textContent = title;
              popup.querySelector('p').textContent = message;
              popup.style.display = 'block';
              overlay.style.display = 'block';
          }
  
          popupClose.addEventListener('click', () => {
              popup.style.display = 'none';
              overlay.style.display = 'none';
              if (popup.classList.contains('success')) {
                  form.reset();
                  document.querySelectorAll('.preview-box').forEach(box => {
                      box.classList.remove('has-image');
                  });
              }
          });
  
          form.addEventListener('submit', async (e) => {
              e.preventDefault();
              
              // Show progress bar
              progressContainer.style.display = 'block';
              
              // Simulate upload progress
              let progress = 0;
              const interval = setInterval(() => {
                  progress += 5;
                  progressFill.style.width = progress + '%';
                  progressText.textContent = `Uploading... ${progress}%`;
                  
                  if (progress >= 100) {
                      clearInterval(interval);
                      progressContainer.style.display = 'none';
                      showPopup(
                          'success',
                          'Success!',
                          'Your car listing has been submitted successfully! Our team will review and get back to you soon.'
                      );
                  }
              }, 100);
  
              // In real implementation, you would handle the form submission here
              const formData = new FormData(form);
              try {
                  const response = await fetch('process_sell.php', {
                      method: 'POST',
                      body: formData
                  });
                  if (response.ok) {
                      showPopup('success', 'Success!', 'Your car listing has been submitted successfully!');
                  } else {
                      throw new Error('Submission failed');
                  }
              } catch (error) {
                  showPopup('error', 'Error!', 'Failed to submit the listing. Please try again.');
              }
          });