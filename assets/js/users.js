// User management logic

document.addEventListener('DOMContentLoaded', () => {
    const usersTableBody = document.querySelector('.data-table-container tbody');
    const searchInput = document.querySelector('.users-controls .search-bar input');
    const roleFilter = document.querySelector('.users-controls .filters select:nth-child(1)');
    const statusFilter = document.querySelector('.users-controls .filters select:nth-child(2)');
    const selectAllCheckbox = document.querySelector('.data-table-container .select-all');
    const paginationControls = document.querySelector('.pagination');

    let allUsers = [];
    let filteredUsers = [];
    let currentPage = 1;
    let usersPerPage = 10;
    let currentSortColumn = 'name';
    let currentSortDirection = 'asc';

    // --- Modal Elements ---
    const modalBackdrop = document.createElement('div');
    modalBackdrop.classList.add('modal-backdrop');
    document.body.appendChild(modalBackdrop);

    function createModal(title, contentHtml, buttons) {
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        modalContent.innerHTML = `
            <h3>${title}</h3>
            <button class="close-button"><i class="ri-close-line"></i></button>
            <div class="modal-body">
                ${contentHtml}
            </div>
            <div class="modal-actions">
                ${buttons.map(btn => `<button class="btn ${btn.class}" data-action="${btn.action}">${btn.text}</button>`).join('')}
            </div>
        `;
        modalBackdrop.innerHTML = ''; // Clear previous content
        modalBackdrop.appendChild(modalContent);

        // Attach close functionality
        modalBackdrop.querySelector('.close-button').addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeModal();
            }
        });
        document.addEventListener('keydown', handleEscapeKey);

        modalBackdrop.classList.add('show');
        return modalContent;
    }

    function closeModal() {
        modalBackdrop.classList.remove('show');
        document.removeEventListener('keydown', handleEscapeKey);
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    }

    // --- User Data Handling ---
    async function fetchAndRenderUsers() {
        try {
            allUsers = await api.getUsers(); // From data.js
            applyFiltersAndSort();
            renderUsersTable();
            renderPagination();
        } catch (error) {
            console.error('Error fetching users:', error);
            usersTableBody.innerHTML = `<tr><td colspan="8" class="text-center">Error loading users.</td></tr>`;
        }
    }

    function applyFiltersAndSort() {
        let tempUsers = [...allUsers];

        // Search filter
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        if (searchTerm) {
            tempUsers = tempUsers.filter(user =>
                user.name.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                user.role.toLowerCase().includes(searchTerm)
            );
        }

        // Role filter
        const selectedRole = roleFilter ? roleFilter.value : '';
        if (selectedRole) {
            tempUsers = tempUsers.filter(user => user.role.toLowerCase() === selectedRole);
        }

        // Status filter
        const selectedStatus = statusFilter ? statusFilter.value : '';
        if (selectedStatus) {
            tempUsers = tempUsers.filter(user => user.status.toLowerCase() === selectedStatus);
        }

        // Sort
        tempUsers.sort((a, b) => {
            const valA = a[currentSortColumn].toLowerCase();
            const valB = b[currentSortColumn].toLowerCase();
            if (valA < valB) return currentSortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return currentSortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        filteredUsers = tempUsers;
        currentPage = 1; // Reset to first page after filter/sort
    }

    function renderUsersTable() {
        if (!usersTableBody) return;

        const start = (currentPage - 1) * usersPerPage;
        const end = start + usersPerPage;
        const usersToRender = filteredUsers.slice(start, end);

        usersTableBody.innerHTML = '';
        if (usersToRender.length === 0) {
            usersTableBody.innerHTML = `<tr><td colspan="8" class="text-center">No users found.</td></tr>`;
            return;
        }

        usersToRender.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" data-user-id="${user.id}"></td>
                <td><img src="${user.avatar}" alt="${user.name}"></td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="badge badge-${user.role.toLowerCase()}">${user.role}</span></td>
                <td><span class="badge badge-${user.status.toLowerCase()}">${user.status}</span></td>
                <td>${formatDateTime(user.joinDate, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td>
                    <button class="btn btn-icon edit-user" data-user-id="${user.id}"><i class="ri-edit-line"></i></button>
                    <button class="btn btn-icon btn-danger delete-user" data-user-id="${user.id}"><i class="ri-delete-bin-line"></i></button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });

        attachTableEventListeners();
        updateSelectAllCheckbox();
    }

    function renderPagination() {
        if (!paginationControls) return;

        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        paginationControls.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.classList.add('btn', 'btn-ghost', 'prev-page');
        prevButton.textContent = 'Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderUsersTable();
                renderPagination();
            }
        });
        paginationControls.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        paginationControls.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.classList.add('btn', 'btn-ghost', 'next-page');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderUsersTable();
                renderPagination();
            }
        });
        paginationControls.appendChild(nextButton);
    }

    // --- Event Listeners ---
    function attachTableEventListeners() {
        // Edit User
        document.querySelectorAll('.edit-user').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = parseInt(e.currentTarget.dataset.userId);
                const user = allUsers.find(u => u.id === userId);
                if (user) showEditUserModal(user);
            });
        });

        // Delete User
        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = parseInt(e.currentTarget.dataset.userId);
                showDeleteConfirmModal(userId);
            });
        });

        // Individual row checkboxes
        document.querySelectorAll('.data-table-container tbody input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectAllCheckbox);
        });
    }

    // Select All Checkbox
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            document.querySelectorAll('.data-table-container tbody input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = isChecked;
            });
        });
    }

    function updateSelectAllCheckbox() {
        if (!selectAllCheckbox) return;
        const allRowsCheckboxes = document.querySelectorAll('.data-table-container tbody input[type="checkbox"]');
        const checkedRows = document.querySelectorAll('.data-table-container tbody input[type="checkbox"]:checked');
        selectAllCheckbox.checked = allRowsCheckboxes.length > 0 && allRowsCheckboxes.length === checkedRows.length;
    }


    // Search & Filter
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            applyFiltersAndSort();
            renderUsersTable();
            renderPagination();
        }, 300));
    }
    if (roleFilter) {
        roleFilter.addEventListener('change', () => {
            applyFiltersAndSort();
            renderUsersTable();
            renderPagination();
        });
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            applyFiltersAndSort();
            renderUsersTable();
            renderPagination();
        });
    }

    // Column Sorting
    document.querySelectorAll('.data-table-container th').forEach(header => {
        if (header.dataset.sort) { // Assuming a data-sort attribute on sortable headers
            header.addEventListener('click', () => {
                const column = header.dataset.sort;
                if (currentSortColumn === column) {
                    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSortColumn = column;
                    currentSortDirection = 'asc';
                }
                applyFiltersAndSort();
                renderUsersTable();
            });
        }
    });

    // --- Modal Functions ---
    const addUserButton = document.querySelector('.users-controls .actions .btn-primary');
    if (addUserButton) {
        addUserButton.addEventListener('click', showAddUserModal);
    }

    function showAddUserModal() {
        const addFormHtml = `
            <div class="form-group">
                <label for="new-name">Name</label>
                <input type="text" id="new-name" placeholder="User's Full Name" required>
            </div>
            <div class="form-group">
                <label for="new-email">Email</label>
                <input type="email" id="new-email" placeholder="user@example.com" required>
            </div>
            <div class="form-group">
                <label for="new-role">Role</label>
                <select id="new-role">
                    <option value="user">User</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div class="form-group">
                <label for="new-status">Status</label>
                <select id="new-status">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
        `;
        const modal = createModal('Add New User', addFormHtml, [
            { text: 'Add User', class: 'btn-primary', action: 'add' },
            { text: 'Cancel', class: 'btn-secondary', action: 'cancel' }
        ]);

        modal.querySelector('[data-action="add"]').addEventListener('click', () => {
            const name = modal.querySelector('#new-name').value;
            const email = modal.querySelector('#new-email').value;
            const role = modal.querySelector('#new-role').value;
            const status = modal.querySelector('#new-status').value;

            // Basic validation
            if (!name || !email) {
                alert('Please fill in all required fields.');
                return;
            }

            const newUser = {
                id: allUsers.length > 0 ? Math.max(...allUsers.map(u => u.id)) + 1 : 1,
                name,
                email,
                role: capitalizeFirstLetter(role), // Use helper from utils.js
                status: capitalizeFirstLetter(status), // Use helper from utils.js
                avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`, // Random avatar
                joinDate: new Date().toISOString()
            };

            allUsers.push(newUser);
            applyFiltersAndSort();
            renderUsersTable();
            renderPagination();
            closeModal();
            // showNotification('User added successfully!', 'success');
        });
    }

    function showEditUserModal(user) {
        const editFormHtml = `
            <div class="form-group">
                <label for="edit-name">Name</label>
                <input type="text" id="edit-name" value="${user.name}" required>
            </div>
            <div class="form-group">
                <label for="edit-email">Email</label>
                <input type="email" id="edit-email" value="${user.email}" required>
            </div>
            <div class="form-group">
                <label for="edit-role">Role</label>
                <select id="edit-role">
                    <option value="user" ${user.role === 'User' ? 'selected' : ''}>User</option>
                    <option value="editor" ${user.role === 'Editor' ? 'selected' : ''}>Editor</option>
                    <option value="admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
                </select>
            </div>
            <div class="form-group">
                <label for="edit-status">Status</label>
                <select id="edit-status">
                    <option value="active" ${user.status === 'Active' ? 'selected' : ''}>Active</option>
                    <option value="inactive" ${user.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                </select>
            </div>
        `;
        const modal = createModal(`Edit User: ${user.name}`, editFormHtml, [
            { text: 'Save Changes', class: 'btn-primary', action: 'save' },
            { text: 'Cancel', class: 'btn-secondary', action: 'cancel' }
        ]);

        modal.querySelector('[data-action="save"]').addEventListener('click', () => {
            const name = modal.querySelector('#edit-name').value;
            const email = modal.querySelector('#edit-email').value;
            const role = modal.querySelector('#edit-role').value;
            const status = modal.querySelector('#edit-status').value;

            // Update user in allUsers array
            const userIndex = allUsers.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                allUsers[userIndex] = {
                    ...allUsers[userIndex],
                    name,
                    email,
                    role: capitalizeFirstLetter(role),
                    status: capitalizeFirstLetter(status)
                };
                applyFiltersAndSort();
                renderUsersTable();
                // showNotification('User updated successfully!', 'success');
            }
            closeModal();
        });
    }

    function showDeleteConfirmModal(userId) {
        const confirmHtml = `<p>Are you sure you want to delete this user? This action cannot be undone.</p>`;
        const modal = createModal('Confirm Deletion', confirmHtml, [
            { text: 'Delete', class: 'btn-danger', action: 'delete' },
            { text: 'Cancel', class: 'btn-secondary', action: 'cancel' }
        ]);

        modal.querySelector('[data-action="delete"]').addEventListener('click', () => {
            allUsers = allUsers.filter(user => user.id !== userId);
            applyFiltersAndSort();
            renderUsersTable();
            renderPagination();
            closeModal();
            // showNotification('User deleted successfully!', 'success');
        });
    }

    // Initial fetch and render
    fetchAndRenderUsers();
});