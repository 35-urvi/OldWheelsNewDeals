        const verifyForm = document.getElementById('verifyForm');
        const resetPasswordForm = document.getElementById('resetPasswordForm');
        const successAlert = document.getElementById('successAlert');
        const errorAlert = document.getElementById('errorAlert');
        let verifiedEmail = '';

        function showAlert(type, message) {
            const alert = type === 'success' ? successAlert : errorAlert;
            alert.textContent = message;
            alert.style.display = 'block';
            setTimeout(() => {
                alert.style.display = 'none';
            }, 5000);
        }

        verifyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            successAlert.style.display = 'none';
            errorAlert.style.display = 'none';

            fetch('verify_user.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('success', 'Account verified! Please set your new password.');
                    verifyForm.style.display = 'none';
                    resetPasswordForm.style.display = 'block';
                    verifiedEmail = formData.get('email');
                } else {
                    showAlert('error', data.message);
                }
            })
            .catch(error => {
                showAlert('error', 'An error occurred. Please try again.');
                console.error('Error:', error);
            });
        });

        resetPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newPassword = this.new_password.value;
            const confirmPassword = this.confirm_new_password.value;

            if (newPassword !== confirmPassword) {
                showAlert('error', 'Passwords do not match!');
                return;
            }

            if (newPassword.length < 6) {
                showAlert('error', 'Password must be at least 6 characters long!');
                return;
            }
            
            const formData = new FormData(this);
            formData.append('email', verifiedEmail);
            
            fetch('reset_password.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('success', data.message);
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showAlert('error', data.message);
                }
            })
            .catch(error => {
                showAlert('error', 'An error occurred. Please try again.');
                console.error('Error:', error);
            });
        });