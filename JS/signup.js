document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (this.password.value !== this.confirm_password.value) {
        document.getElementById('errorAlert').style.display = 'block';
        document.getElementById('errorAlert').textContent = 'Passwords do not match!';
        return;
    }
    
    const formData = new FormData(this);
    
    fetch('signup_process.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('successAlert').style.display = 'block';
            document.getElementById('successAlert').textContent = data.message;
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            document.getElementById('errorAlert').style.display = 'block';
            document.getElementById('errorAlert').textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});