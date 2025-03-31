function showAlert(elementId, message, duration = 3000) {
    const alertElement = document.getElementById(elementId);
    alertElement.textContent = message;
    alertElement.style.display = 'block';
    
    // Remove any existing fade-out class
    alertElement.classList.remove('fade-out');
    
    setTimeout(() => {
        // Add fade-out class to start the opacity transition
        alertElement.classList.add('fade-out');
        
        // After the fade animation, hide the element
        setTimeout(() => {
            alertElement.style.display = 'none';
            alertElement.classList.remove('fade-out');
        }, 500); // Match this with the CSS transition duration
    }, duration);
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    fetch('login_process.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('successAlert', data.message);
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
        } else {
            showAlert('errorAlert', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('errorAlert', 'An error occurred. Please try again.');
    });
});