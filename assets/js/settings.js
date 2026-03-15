// Settings page logic

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // --- Tab Switching Logic ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Deactivate all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Activate clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // --- Profile Tab Logic ---
    const avatarUpload = document.getElementById('avatarUpload');
    const profileAvatarPreview = document.getElementById('profile-avatar-preview');
    const saveProfileChangesBtn = document.getElementById('saveProfileChanges');

    if (avatarUpload && profileAvatarPreview) {
        avatarUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profileAvatarPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (saveProfileChangesBtn) {
        saveProfileChangesBtn.addEventListener('click', () => {
            // Simulate saving changes
            alert('Profile changes saved!');
            // In a real app, send data to backend and show toast notification
        });
    }

    // --- Appearance Tab Logic ---
    const colorSchemeSelect = document.getElementById('colorScheme');
    const fontSizeInput = document.getElementById('fontSize');
    const fontSizeValueSpan = document.getElementById('fontSizeValue');
    const reduceMotionToggle = document.getElementById('reduceMotionToggle');
    const saveAppearanceBtn = document.getElementById('saveAppearance');

    // Initialize Font Size display
    if (fontSizeInput && fontSizeValueSpan) {
        fontSizeValueSpan.textContent = `${fontSizeInput.value}px`;
        fontSizeInput.addEventListener('input', () => {
            fontSizeValueSpan.textContent = `${fontSizeInput.value}px`;
            document.documentElement.style.setProperty('--body-font-size', `${fontSizeInput.value / 16}rem`);
        });
    }

    if (saveAppearanceBtn) {
        saveAppearanceBtn.addEventListener('click', () => {
            alert('Appearance settings saved!');
        });
    }

    // --- Notifications Tab Logic ---
    const saveNotificationPreferencesBtn = document.getElementById('saveNotificationPreferences');
    if (saveNotificationPreferencesBtn) {
        saveNotificationPreferencesBtn.addEventListener('click', () => {
            alert('Notification preferences saved!');
        });
    }

    // --- Privacy Tab Logic ---
    const requestDataExportBtn = document.getElementById('requestDataExport');
    if (requestDataExportBtn) {
        requestDataExportBtn.addEventListener('click', () => {
            alert('Data export requested! You will receive an email shortly.');
        });
    }

    // --- API Tab Logic ---
    const generateApiKeyBtn = document.getElementById('generateApiKey');
    const apiKeysList = document.querySelector('.api-keys-list');

    function generateApiKey() {
        const newKey = `sk_live_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
        const apiKeyItem = document.createElement('div');
        apiKeyItem.classList.add('api-key-item');
        apiKeyItem.innerHTML = `
            <div class="key-display">${newKey.substring(0, 10)}********************${newKey.substring(newKey.length - 4)}</div>
            <div class="key-actions">
                <button class="btn btn-icon copy-api-key" title="Copy to clipboard" data-key="${newKey}"><i class="ri-file-copy-line"></i></button>
                <button class="btn btn-icon btn-danger revoke-api-key" title="Revoke key"><i class="ri-delete-bin-line"></i></button>
            </div>
        `;
        apiKeysList.appendChild(apiKeyItem);
        attachApiKeyListeners(apiKeyItem);
    }

    function attachApiKeyListeners(item) {
        const copyButton = item.querySelector('.copy-api-key');
        const revokeButton = item.querySelector('.revoke-api-key');

        if (copyButton) {
            copyButton.addEventListener('click', (e) => {
                const keyToCopy = e.currentTarget.dataset.key;
                navigator.clipboard.writeText(keyToCopy)
                    .then(() => {
                        alert('API Key copied to clipboard!');
                        // showNotification('API Key copied to clipboard!', 'info');
                    })
                    .catch(err => {
                        console.error('Failed to copy API Key:', err);
                        alert('Failed to copy API Key.');
                        // showNotification('Failed to copy API Key.', 'error');
                    });
            });
        }

        if (revokeButton) {
            revokeButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to revoke this API Key?')) {
                    item.remove();
                    alert('API Key revoked!');
                    // showNotification('API Key revoked successfully!', 'success');
                }
            });
        }
    }

    if (generateApiKeyBtn) {
        generateApiKeyBtn.addEventListener('click', generateApiKey);
    }

    // Attach listeners to initially existing API keys
    document.querySelectorAll('.api-keys-list .api-key-item').forEach(attachApiKeyListeners);

    // --- Account Tab Logic ---
    const changePasswordBtn = document.getElementById('changePassword');
    const deleteAccountBtn = document.getElementById('deleteAccount');

    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            alert('Password change functionality not implemented yet.');
        });
    }

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            if (confirm('Are you absolutely sure you want to delete your account? This action is irreversible.')) {
                alert('Account deletion functionality not implemented yet.');
            }
        });
    }
});