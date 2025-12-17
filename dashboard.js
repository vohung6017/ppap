const t = window.t || ((key) => key);
let USERS_CACHE = [];

async function fetchUsers() {
    try {
        const res = await fetch('/sample-system/api/users');
        if (!res.ok) {
            throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        return json.result || [];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

function filterUsers(keyword) {
    if (!keyword || keyword.length === 0) {
        return USERS_CACHE;
    }

    const lowerKeyword = keyword.toLowerCase();
    return USERS_CACHE.filter((user) => {
        const idCard = (user.idCard || '').toLowerCase();
        const fullName = (user.fullName || '').toLowerCase();
        const displayName = (user.displayName || '').toLowerCase();

        return idCard.includes(lowerKeyword) || fullName.includes(lowerKeyword) || displayName.includes(lowerKeyword);
    });
}

function formatUserLabel(user) {
    if (!user) return '';
    const idCard = (user.idCard || '').trim();
    const displayName = (user.displayName || '').trim();
    if (!idCard && !displayName) return '';
    return displayName ? `${idCard} - ${displayName}` : idCard;
}

function getUserLabelById(idCard) {
    if (!idCard) return '';
    const normalized = String(idCard).trim();
    const found = USERS_CACHE.find((user) => (user.idCard || '').toString() === normalized);
    if (found) return formatUserLabel(found);
    return normalized;
}

function getStageIdByName(stageName) {
    if (!stageName) return null;
    const stages = SELECT_CACHE['/api/stages'] || [];
    const found = stages.find((s) => s.name === stageName);
    return found ? found.id : null;
}

function getStatusBadgeClass(status) {
    const statusMap = {
        OPEN: 'status-pending',
        PENDING: 'status-gray',
        IN_PROGRESS: 'status-in-progress',
        WAITING_FOR_APPROVAL: 'status-waiting',
        COMPLETED: 'status-completed',
        OVERDUE: 'status-overdue',
        // Legacy mappings
        IN_PROCESS: 'status-in-progress',
        OVER_DUE: 'status-overdue',
    };
    return statusMap[status] || 'status-pending';
}

function getStatusLabel(status) {
    if (!status) return 'N/A';
    // Replace underscores with spaces, keep uppercase
    return status.replace(/_/g, ' ');
}

function getPriorityBadgeClass(priority) {
    if (!priority) return 'priority-medium';
    const p = priority.toLowerCase();
    return `priority-${p}`;
}

function getPriorityLabel(priority) {
    if (!priority) return 'MEDIUM';
    // Keep uppercase, replace underscores with spaces
    return priority.replace(/_/g, ' ');
}

async function fetchProjectTasks(projectId, stageId) {
    try {
        let url = `/sample-system/api/project/${projectId}/tasks`;
        if (stageId) {
            url += `?stageId=${stageId}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch tasks: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error('Error fetching project tasks:', error);
        return [];
    }
}

function updateDRISelect() {
    const select = document.querySelector('#dashboardFilterDRI');
    if (!select) return;

    select.innerHTML = '<option value="">-- Select DRI --</option>';

    USERS_CACHE.forEach((user) => {
        const idCard = user.idCard || '';
        const fullName = user.fullName || '';
        const displayName = user.displayName || '';
        const option = document.createElement('option');
        option.value = idCard;
        option.textContent = formatUserLabel(user);
        select.appendChild(option);
    });

    $(select).select2({
        placeholder: 'Search DRI...',
        allowClear: true,
        width: '100%',
    });
}

async function fetchProjects(params) {
    try {
        let url = '/sample-system/api/dashboard/projects';
        if (params && Array.from(params.entries()).length > 0) {
            url += '?' + params.toString();
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        return json.data || [];
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

async function renderProjects(searchParams) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    try {
        loader.load();
        grid.innerHTML = '';
        let projectsData = await fetchProjects(searchParams);
        const keyword = document.getElementById('dashboardFilterSearch')?.value?.trim().toLowerCase();
        if (keyword) {
            projectsData = projectsData.filter((project) =>
                (project.projectName || project.name || '').toLowerCase().includes(keyword)
            );
        }

        projectsData.forEach((project) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
            <div class="project-header">
                <div class="project-name">${project.projectName}</div>
                <button class="cft-team-btn" data-id="${project.id}" data-action="showCFTTeam">
                    <i class="bi bi-people"></i> <span>查看 CFT Team</span>
                </button>
            </div>
            <div class="project-meta">
                <div class="meta-item">
                    <div class="meta-label">客戶</div>
                    <div class="meta-value">${project.customerName || '-'}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">產品</div>
                    <div class="meta-value">${project.modelName}</div>
                </div>
                <div class="meta-item clickable" data-id="${
                    project.id
                }" data-filter="in-progress" data-action="showTaskListByFilter">
                    <div class="meta-label">進行中任務</div>
                    <div class="meta-value" style="color: var(--accent-orange);">${project.inProcess}</div>
                </div>
                <div class="meta-item clickable" data-id="${
                    project.id
                }" data-filter="pending" data-action="showTaskListByFilter">
                    <div class="meta-label">本週待辦</div>
                    <div class="meta-value" style="color: var(--accent-blue);">${project.weeklyPending}</div>
                </div>
                <div class="meta-item clickable" data-id="${
                    project.id
                }" data-filter="overdue" data-action="showTaskListByFilter">
                    <div class="meta-label">逾期任務</div>
                    <div class="meta-value" style="color: var(--accent-red);">${project.overDueTask}</div>
                </div>
            </div>
            <div class="xvt-stages-grid">
                ${renderStages(project)}
            </div>
        `;
            grid.appendChild(card);
        });
        loader.unload();
    } catch (error) {
        loader.unload();
        console.error('Error rendering projects:', error);
    }
}

function renderStages(project) {
    if (!project.process || !Array.isArray(project.process)) return '';

    return project.process
        .map((process) => {
            const percentage = Math.round(process.doneRate * 100);
            const circumference = 2 * Math.PI * 54;
            const offset = circumference - (percentage / 100) * circumference;
            let strokeColor = '#4CAF50';
            if (percentage < 50) strokeColor = '#f44336';
            else if (percentage < 80) strokeColor = '#FF9800';

            return `
            <div class="stage-gauge" data-id="${project.id}" data-stage="${process.processName}" data-action="showTaskListByStage">
                <div class="stage-label">${process.processName}</div>
                <div class="gauge-circle">
                    <svg width="120" height="120">
                        <circle class="gauge-bg" cx="60" cy="60" r="54"></circle>
                        <circle class="gauge-progress" cx="60" cy="60" r="54"
                            stroke="${strokeColor}"
                            stroke-dasharray="${circumference}"
                            stroke-dashoffset="${offset}">
                        </circle>
                    </svg>
                    <div class="gauge-text">
                        <div class="gauge-percentage">${percentage}%</div>
                        <div class="gauge-fraction">${process.taskDone}/${process.taskTotal}</div>
                    </div>
                </div>
                <div class="gauge-date">${process.taskDone}/${process.taskTotal}</div>
            </div>
        `;
        })
        .join('');
}

async function showCFT(projectId) {
    try {
        loader.load();
        const response = await fetch(`/sample-system/api/project/${projectId}/raci`);
        if (!response.ok) {
            throw new Error(`Failed to fetch CFT Team: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        const cftTeamData = result.data || [];

        // Get department cache for mapping
        const departments = SELECT_CACHE['/api/departments'] || [];
        const deptMap = {};
        departments.forEach((dept) => {
            deptMap[dept.id] = dept.name;
        });

        const modal = document.getElementById('cftTeamModal');
        const title = document.getElementById('cftTeamTitle');
        const tbody = document.getElementById('cftTeamBody');

        title.textContent = `${projectId} - CFT Team`;

        tbody.innerHTML = cftTeamData
            .map((member) => {
                const deptName = deptMap[member.departmentId] || member.departmentId || '';
                const managerLabel = getUserLabelById(member.manager);
                return `
                <tr>
                    <td>${deptName}</td>
                    <td>${managerLabel}</td>
                    <td>${member.role || ''}</td>
                    <td>${member.responsibility || ''}</td>
                    <td><span class="raci-badge raci-${(member.raci || '').toLowerCase()}">${
                    member.raci || ''
                }</span></td>
                    <td>
                        <button class="action-icon-btn cft-delete-btn" data-raci-id="${member.id}" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            })
            .join('');

        // Store projectId for later use when adding new members
        modal.dataset.currentProjectId = projectId;

        loader.unload();
        var bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    } catch (error) {
        loader.unload();
        console.error('Error showing CFT Team:', error);
        showAlertError('Lỗi', 'Không thể tải thông tin CFT Team');
    }
}

function closeCFTTeam() {
    document.getElementById('cftTeamModal').classList.remove('active');
}

function addCftMember() {
    const modal = document.getElementById('cftTeamModal');
    const tbody = document.getElementById('cftTeamBody');
    const projectId = modal.dataset.currentProjectId;

    if (!projectId) {
        showAlertError('Error', 'Project ID not found');
        return;
    }

    const departments = SELECT_CACHE['/api/departments'] || [];
    const deptOptions = departments.map((dept) => `<option value="${dept.id}">${dept.name}</option>`).join('');

    const newRow = document.createElement('tr');
    newRow.classList.add('cft-new-row');
    newRow.innerHTML = `
        <td>
            <select class="filter-select cft-dept-select" required>
                <option value="">-- Select Department --</option>
                ${deptOptions}
            </select>
        </td>
        <td>
            <select class="filter-select cft-manager-select" required>
                <option value="">-- Select Manager --</option>
            </select>
        </td>
        <td><input type="text" class="filter-input cft-role-input" placeholder="Role" required /></td>
        <td><input type="text" class="filter-input cft-responsibility-input" placeholder="Responsibility" required /></td>
        <td>
            <button class="raci-cycle-btn raci-badge raci-r" data-raci="R">R</button>
        </td>
        <td>
            <button class="action-icon-btn cft-save-btn" title="Save">
                <i class="bi bi-check-lg"></i>
            </button>
            <button class="action-icon-btn cft-cancel-btn" title="Cancel">
                <i class="bi bi-x-lg"></i>
            </button>
        </td>
    `;

    tbody.appendChild(newRow);

    const managerSelect = newRow.querySelector('.cft-manager-select');
    USERS_CACHE.forEach((user) => {
        const option = document.createElement('option');
        option.value = user.idCard || '';
        option.textContent = formatUserLabel(user);
        managerSelect.appendChild(option);
    });

    $(managerSelect).select2({
        placeholder: 'Search Manager...',
        allowClear: true,
        width: '100%',
        dropdownParent: $(modal),
    });

    const raciBtn = newRow.querySelector('.raci-cycle-btn');
    raciBtn.addEventListener('click', cycleRaci);

    const saveBtn = newRow.querySelector('.cft-save-btn');
    saveBtn.addEventListener('click', () => saveCftMember(newRow, projectId));

    const cancelBtn = newRow.querySelector('.cft-cancel-btn');
    cancelBtn.addEventListener('click', () => {
        $(managerSelect).select2('destroy');
        newRow.remove();
    });
}

function cycleRaci(e) {
    const btn = e.currentTarget;
    const raciStates = ['R', 'A', 'C', 'I'];
    const currentRaci = btn.dataset.raci || 'R';
    const currentIndex = raciStates.indexOf(currentRaci);
    const nextIndex = (currentIndex + 1) % raciStates.length;
    const nextRaci = raciStates[nextIndex];

    btn.dataset.raci = nextRaci;
    btn.setAttribute('data-raci', nextRaci);
    btn.textContent = nextRaci;
    btn.className = `raci-cycle-btn raci-badge raci-${nextRaci.toLowerCase()}`;
}

async function deleteCftMember(raciId, row) {
    try {
        const result = await Swal.fire({
            title: 'Confirm Delete',
            text: 'Are you sure you want to delete this CFT member?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;

        loader.load();
        const response = await fetch('/sample-system/api/raci/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${raciId}`,
        });

        if (!response.ok) {
            throw new Error(`Failed to delete RACI: ${response.status}`);
        }

        loader.unload();
        showAlertSuccess('Success', 'CFT member deleted successfully');

        if (row) {
            row.remove();
        }
    } catch (error) {
        loader.unload();
        console.error('Error deleting CFT member:', error);
        showAlertError('Error', 'Failed to delete CFT member');
    }
}

async function saveCftMember(row, projectId) {
    const deptId = row.querySelector('.cft-dept-select').value;
    const manager = row.querySelector('.cft-manager-select').value.trim();
    const role = row.querySelector('.cft-role-input').value.trim();
    const responsibility = row.querySelector('.cft-responsibility-input').value.trim();
    const raciBtn = row.querySelector('.raci-cycle-btn');
    const raci = (raciBtn && raciBtn.getAttribute('data-raci')) || 'R';

    if (!deptId) {
        showAlertWarning('Validation', 'Please select a department');
        return;
    }

    if (!manager) {
        showAlertWarning('Validation', 'Please select a manager');
        return;
    }

    const raciData = {
        departmentId: parseInt(deptId),
        projectId: parseInt(projectId),
        manager: manager,
        role: role || '',
        responsibility: responsibility || '',
        raci: raci,
    };

    try {
        loader.load();
        const response = await fetch('/sample-system/api/raci/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(raciData),
        });

        if (!response.ok) {
            throw new Error(`Failed to create RACI: ${response.status}`);
        }

        const result = await response.json();
        loader.unload();

        showAlertSuccess('Success', 'CFT member added successfully');

        const managerSelect = row.querySelector('.cft-manager-select');
        if (managerSelect) {
            $(managerSelect).select2('destroy');
        }

        const departments = SELECT_CACHE['/api/departments'] || [];
        const deptName = departments.find((d) => d.id == deptId)?.name || deptId;
        const managerLabel = getUserLabelById(manager);

        row.innerHTML = `
            <td>${deptName}</td>
            <td>${managerLabel}</td>
            <td>${role}</td>
            <td>${responsibility}</td>
            <td><span class="raci-badge raci-${raci.toLowerCase()}">${raci}</span></td>
            <td>
                <button class="action-icon-btn cft-delete-btn" data-raci-id="${result.data?.id || ''}" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        row.classList.remove('cft-new-row');
    } catch (error) {
        loader.unload();
        console.error('Error saving CFT member:', error);
        showAlertError('Error', 'Failed to add CFT member');
    }
}

async function showTaskByStage(projectId, stage) {
    const modal = document.getElementById('taskListModal');
    const title = document.getElementById('taskListModalTitle');
    const tbody = document.getElementById('taskListModalBody');

    try {
        loader.load();

        if (title) {
            title.textContent = `${projectId} - ${stage} Stage Tasks`;
        }

        const stageId = getStageIdByName(stage);

        const tasks = await fetchProjectTasks(projectId, stageId);

        if (tbody) {
            if (tasks.length === 0) {
                tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 20px; color: var(--text-secondary);">
                        No tasks found for this stage
                    </td>
                </tr>
            `;
            } else {
                tbody.innerHTML = tasks
                    .map((task) => {
                        const statusClass = getStatusBadgeClass(task.status);
                        const statusLabel = getStatusLabel(task.status);
                        const priorityClass = getPriorityBadgeClass(task.priority);
                        const priorityLabel = getPriorityLabel(task.priority);
                        const driDisplay = getUserLabelById(task.dri) || '-';
                        const dueDate = task.dueDate || '-';

                        return `
                    <tr data-id="${task.id}" data-project-id="${projectId}" data-action="showTaskDetail" style="cursor: pointer;">
                        <td class="task-id-cell">${task.taskCode || task.id}</td>
                        <td>${task.name || '-'}</td>
                        <td>${projectId}</td>
                        <td>${stage}</td>
                        <td><span class="task-status-badge ${statusClass}">${statusLabel}</span></td>
                        <td><span class="priority-badge ${priorityClass}">${priorityLabel}</span></td>
                        <td>${driDisplay}</td>
                        <td>${dueDate}</td>
                        <td class="action-icons" onclick="event.stopPropagation();">
                            <button class="action-icon-btn" data-id="${
                                task.id
                            }" data-project-id="${projectId}" data-action="editTaskDetail"><i class="bi bi-pencil"></i></button>
                            <button class="action-icon-btn" data-id="${
                                task.id
                            }" data-action="deleteTask"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>
                `;
                    })
                    .join('');
            }
        }

        loader.unload();
        var bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    } catch (error) {
        loader.unload();
        console.error('Error showing tasks:', error);
    }
}

async function showTaskByFilter(filterType, projectId = null) {
    const modal = document.getElementById('taskListModal');
    const title = document.getElementById('taskListModalLabel');
    const tbody = document.getElementById('taskListModalBody');

    // Map filter type to API status param
    const statusMap = {
        'in-progress': 'IN_PROGRESS',
        'pending': 'PENDING',
        'overdue': 'OVERDUE',
        'all': null
    };
    const status = statusMap[filterType] || null;

    let titleText = '';
    if (filterType === 'all') {
        titleText = projectId ? `${projectId} - ${t('all')} ${t('taskName')}` : `${t('all')} ${t('taskName')}`;
    } else if (filterType === 'in-progress') {
        titleText = projectId
            ? `${projectId} - ${t('inProgress')} ${t('taskName')}`
            : `${t('inProgress')} ${t('taskName')}`;
    } else if (filterType === 'pending') {
        titleText = projectId ? `${projectId} - ${t('pending')} ${t('taskName')}` : `${t('pending')} ${t('taskName')}`;
    } else if (filterType === 'overdue') {
        titleText = projectId ? `${projectId} - ${t('overdue')} ${t('taskName')}` : `${t('overdue')} ${t('taskName')}`;
    }

    if (title) {
        title.textContent = titleText;
    }

    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--text-secondary);padding:2rem">Loading...</td></tr>';
    }

    if (modal) {
        var bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    try {
        let tasks = [];
        if (projectId) {
            // Fetch tasks for specific project with status filter
            let url = `/sample-system/api/project/${projectId}/tasks`;
            if (status) {
                url += `?status=${encodeURIComponent(status)}`;
            }
            const res = await fetch(url);
            if (res.ok) {
                const json = await res.json();
                tasks = json.data || [];
            }
        }

        if (!tasks || tasks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--text-secondary);padding:2rem">No tasks found</td></tr>';
            return;
        }

        tbody.innerHTML = tasks.map((task) => {
            const statusClass = getStatusBadgeClass(task.status);
            const statusLabel = getStatusLabel(task.status);
            const priorityClass = getPriorityBadgeClass(task.priority);
            const priorityLabel = getPriorityLabel(task.priority);
            const driDisplay = getUserLabelById(task.dri) || '-';
            const dueDate = task.dueDate || '-';
            const stageName = task.stageName || task.stageId || '-';

            return `
                <tr data-id="${task.id}" data-project-id="${projectId}" data-action="showTaskDetail" style="cursor: pointer;">
                    <td class="task-id-cell">${task.taskCode || task.id}</td>
                    <td>${task.name || '-'}</td>
                    <td>${projectId || '-'}</td>
                    <td>${stageName}</td>
                    <td><span class="task-status-badge ${statusClass}">${statusLabel}</span></td>
                    <td><span class="priority-badge ${priorityClass}">${priorityLabel}</span></td>
                    <td>${driDisplay}</td>
                    <td>${dueDate}</td>
                    <td class="action-icons" onclick="event.stopPropagation();">
                        <button class="action-icon-btn" data-id="${task.id}" data-project-id="${projectId}" data-action="editTaskDetail"><i class="bi bi-pencil"></i></button>
                        <button class="action-icon-btn" data-id="${task.id}" data-action="deleteTask"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        console.error('Error fetching tasks by filter:', error);
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--text-secondary);padding:2rem">Failed to load tasks</td></tr>';
    }
}

async function showDashboardTasks(filterType) {
    const modal = document.getElementById('taskListModal');
    const title = document.getElementById('taskListModalLabel');
    const tbody = document.getElementById('taskListModalBody');

    // Map filter type to API status param
    const statusMap = {
        'in-progress': 'IN_PROGRESS',
        'pending': 'PENDING',
        'overdue': 'OVERDUE',
        'all': null
    };
    const status = statusMap[filterType] || null;

    let titleText = '';
    if (filterType === 'all') {
        titleText = `${t('all')} ${t('taskName')}`;
    } else if (filterType === 'in-progress') {
        titleText = `${t('inProgress')} ${t('taskName')}`;
    } else if (filterType === 'pending') {
        titleText = `${t('pending')} ${t('taskName')}`;
    } else if (filterType === 'overdue') {
        titleText = `${t('overdue')} ${t('taskName')}`;
    }

    if (title) {
        title.textContent = titleText;
    }

    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--text-secondary);padding:2rem">Loading...</td></tr>';
    }

    if (modal) {
        var bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    try {
        // Calculate date range: first day of current month to today
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        function formatDate(d) {
            const y = d.getFullYear();
            const m = ('0' + (d.getMonth() + 1)).slice(-2);
            const day = ('0' + d.getDate()).slice(-2);
            return `${y}/${m}/${day} 00:00:00`;
        }

        const startTime = formatDate(startOfMonth);
        const endTime = formatDate(now);

        // Build API URL
        let url = `/sample-system/api/dashboard/tasks?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`;
        if (status) {
            url += `&status=${encodeURIComponent(status)}`;
        }

        const res = await fetch(url);
        let tasks = [];
        if (res.ok) {
            const json = await res.json();
            tasks = json.data || [];
        }

        if (!tasks || tasks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--text-secondary);padding:2rem">No tasks found</td></tr>';
            return;
        }

        tbody.innerHTML = tasks.map((task) => {
            const statusClass = getStatusBadgeClass(task.status);
            const statusLabel = getStatusLabel(task.status);
            const priorityClass = getPriorityBadgeClass(task.priority);
            const priorityLabel = getPriorityLabel(task.priority);
            const driDisplay = getUserLabelById(task.dri) || '-';
            const dueDate = task.dueDate || '-';
            const stageName = task.stageName || task.stageId || '-';
            const projectId = task.projectId || '-';

            return `
                <tr data-id="${task.id}" data-project-id="${projectId}" data-action="showTaskDetail" style="cursor: pointer;">
                    <td class="task-id-cell">${task.taskCode || task.id}</td>
                    <td>${task.name || '-'}</td>
                    <td>${projectId}</td>
                    <td>${stageName}</td>
                    <td><span class="task-status-badge ${statusClass}">${statusLabel}</span></td>
                    <td><span class="priority-badge ${priorityClass}">${priorityLabel}</span></td>
                    <td>${driDisplay}</td>
                    <td>${dueDate}</td>
                    <td class="action-icons" onclick="event.stopPropagation();">
                        <button class="action-icon-btn" data-id="${task.id}" data-project-id="${projectId}" data-action="editTaskDetail"><i class="bi bi-pencil"></i></button>
                        <button class="action-icon-btn" data-id="${task.id}" data-action="deleteTask"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        console.error('Error fetching dashboard tasks:', error);
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--text-secondary);padding:2rem">Failed to load tasks</td></tr>';
    }
}

function showTaskDetail(taskId) {
    // closeTaskListModal();
    // TODO: Fetch task detail từ API
    // GET /api/tasks/{taskId}

    var modal = new bootstrap.Modal(document.getElementById('taskDetailModal'));
    modal.show();
}

async function editTaskDetail(taskId, projectId) {
    if (!taskId) {
        showAlertError('Error', 'Task ID is required');
        return;
    }

    try {
        loader.load();
        const res = await fetch(`/sample-system/api/tasks/${taskId}`);

        if (!res.ok) {
            throw new Error(`Failed to fetch task: ${res.status}`);
        }

        const json = await res.json();
        const task = json.data || json.result || null;

        if (!task) {
            throw new Error('Task not found');
        }

        loader.unload();

        const modal = document.getElementById('taskDetailModal');
        if (!modal) {
            showAlertError('Error', 'Task detail modal not found');
            return;
        }

        modal.dataset.taskId = taskId;
        modal.dataset.projectId = projectId || '';

        const taskIdElement = modal.querySelector('.task-detail-id');
        if (taskIdElement) taskIdElement.textContent = task.taskCode || task.id || taskId;

        const taskNameElement = modal.querySelector('.task-detail-name');
        if (taskNameElement) taskNameElement.textContent = task.name || 'Task Details';

        const descriptionElement = modal.querySelector('.section-content');
        if (descriptionElement) descriptionElement.textContent = task.description || 'No description available';

        var bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    } catch (error) {
        loader.unload();
        console.error('Error loading task detail:', error);
        showAlertError('Error', 'Failed to load task details');
    }
}

async function deleteTask(taskId) {
    if (!taskId) {
        showAlertError('Error', 'Task ID is required');
        return;
    }

    try {
        const result = await Swal.fire({
            title: 'Confirm Delete',
            text: 'Are you sure you want to delete this task?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;

        loader.load();
        const res = await fetch(`/sample-system/api/tasks/delete?id=${encodeURIComponent(taskId)}`, {
            method: 'POST',
        });

        if (!res.ok) {
            throw new Error(`Failed to delete task: ${res.status}`);
        }

        const json = await res.json();
        const serverOk = json.status === 'OK' || json.success === true || json.result === 'OK';

        if (!serverOk) {
            throw new Error('Server reported failure when deleting task');
        }

        loader.unload();
        showAlertSuccess('Success', 'Task deleted successfully');

        const row = document.querySelector(`tr[data-id="${taskId}"]`);
        if (row) {
            row.remove();
        }

        const tbody = document.getElementById('taskListModalBody');
        if (tbody && tbody.querySelectorAll('tr').length === 0) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('taskListModal'));
            if (modal) modal.hide();
        }
    } catch (error) {
        loader.unload();
        console.error('Error deleting task:', error);
        showAlertError('Error', 'Failed to delete task');
    }
}

function closeTaskDetail() {
    const modal = document.getElementById('taskDetailModal');
    const bsModal = bootstrap.Modal.getInstance(modal);
    if (bsModal) bsModal.hide();

    restoreOriginalUrl(modal);
}

function restoreOriginalUrl(modal) {
    if (!modal) return;

    try {
        const originalUrl = modal.dataset.originalUrl;
        if (originalUrl) {
            window.history.replaceState(null, '', originalUrl);
            delete modal.dataset.originalUrl;
        }
    } catch (e) {
        console.warn('Failed to restore original URL', e);
    }
}

function openTaskPermission(projectId, taskId, userName) {
    const modal = document.getElementById('taskDetailModal');
    if (!modal) return;
    const taskIdElement = modal.querySelector('.task-detail-id');
    if (taskIdElement) taskIdElement.textContent = taskId;
    const taskNameElement = modal.querySelector('.task-detail-name');
    const taskNames = {'PPAP-001': '設計記錄', 'PPAP-007': '控制計劃', 'PPAP-015': '樣品產品'};
    if (taskNameElement) taskNameElement.textContent = taskNames[taskId] || '任務詳情';
    const descriptionElement = modal.querySelector('.section-content');
    if (descriptionElement) {
        descriptionElement.textContent = `專案 ${projectId} - 任務 ${taskId} 由 ${userName} 負責處理`;
    }
    var bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

async function applyDashboardFilters() {
    try {
        const params = buildDashboardProjectParams();
        await renderProjects(params);
    } catch (error) {
        console.error('Error applying dashboard filters:', error);
    }
}

function initDashboardFilters() {
    const changeTargets = ['sl-customer', 'sl-model', 'pjNum', 'dashboardFilterDRI'];
    changeTargets.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', applyDashboardFilters);
        }
    });

    const deadlineInput = document.getElementById('dashboardFilterDeadline');
    if (deadlineInput) {
        deadlineInput.addEventListener('change', applyDashboardFilters);
    }

    const searchInput = document.getElementById('dashboardFilterSearch');
    if (searchInput) {
        searchInput.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                applyDashboardFilters();
            }
        });
    }

    const searchBtn = document.getElementById('search');
    if (searchBtn) {
        searchBtn.addEventListener('click', applyDashboardFilters);
    }

    const resetBtn = document.getElementById('reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetDashboardFilters);
    }

    showDatePicker('dashboardFilterDeadline');
}

async function resetDashboardFilters() {
    ['sl-customer', 'sl-model', 'pjNum'].forEach((id) => {
        const select = document.getElementById(id);
        if (select) {
            select.value = '';
        }
    });

    const driSelect = document.getElementById('dashboardFilterDRI');
    if (driSelect) {
        driSelect.value = '';
        if ($(driSelect).data('select2')) {
            $(driSelect).val(null).trigger('change');
        }
    }

    const deadlineInput = document.getElementById('dashboardFilterDeadline');
    if (deadlineInput) {
        deadlineInput.value = '';
    }

    const searchInput = document.getElementById('dashboardFilterSearch');
    if (searchInput) {
        searchInput.value = '';
    }

    await applyDashboardFilters();
}

function moveModalsToBody() {
    try {
        document.querySelectorAll('.modal').forEach(function (modal) {
            if (modal && modal.parentElement && modal.parentElement !== document.body) {
                document.body.appendChild(modal);
            }
        });
    } catch (e) {
        console.error('moveModalsToBody error:', e);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', moveModalsToBody);
} else {
    moveModalsToBody();
}

function initModalRobustness() {
    try {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes &&
                    m.addedNodes.forEach(function (node) {
                        if (!(node instanceof HTMLElement)) return;
                        if (node.classList && node.classList.contains('modal')) {
                            if (node.parentElement !== document.body) document.body.appendChild(node);
                        }
                    });
            });
        });
        observer.observe(document.documentElement || document.body, {childList: true, subtree: true});
    } catch (e) {
        console.error('Modal MutationObserver error:', e);
    }

    document.addEventListener('show.bs.modal', function (ev) {
        try {
            var modalEl = ev.target;
            if (modalEl && modalEl.parentElement !== document.body) document.body.appendChild(modalEl);

            var loader = document.getElementById('loader');
            if (loader && !loader.classList.contains('d-none')) loader.classList.add('d-none');
        } catch (e) {
            console.error('show.bs.modal handler error:', e);
        }
    });

    document.addEventListener('shown.bs.modal', function (ev) {
        try {
            var backdrops = document.querySelectorAll('.modal-backdrop');
            if (backdrops && backdrops.length > 1) {
                backdrops.forEach(function (b, idx) {
                    if (idx < backdrops.length - 1) b.remove();
                });
            }

            var modalEl = ev.target;
            var backdrop = document.querySelector('.modal-backdrop.show');
            if (backdrop && modalEl) {
                var mz = parseInt(window.getComputedStyle(modalEl).zIndex || '1060', 10);
                if (isNaN(mz)) mz = 1060;
                backdrop.style.zIndex = (mz - 5).toString();
                modalEl.style.zIndex = mz.toString();
            }
        } catch (e) {
            console.error('shown.bs.modal handler error:', e);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModalRobustness);
} else {
    initModalRobustness();
}

const SELECT_CACHE = {};
const SELECT_CONFIGS = [
    {id: 'sl-customer', endpoint: '/api/customers'},
    {id: 'sl-model', endpoint: '/api/models'},
    {id: 'pjNum', endpoint: '/api/projects', params: ['customerId', 'modelId']},
    {id: 'sl-stage', endpoint: '/api/stages'},
    {id: 'sl-status', endpoint: '/api/projects/status'},
    {id: 'sl-priority', endpoint: '/api/tasks/priorities'},
    {id: 'sl-doc-type', endpoint: '/api/documents/types'},
    {id: 'sl-department', endpoint: '/api/departments'},
    {id: 'sl-process', endpoint: '/api/processes'},
    {id: 'modal-sl-status', endpoint: '/api/tasks/status'},
    {id: 'modal-sl-priority', endpoint: '/api/tasks/priorities'},
];

async function fetchOptions(endpoint, params = {}) {
    try {
        const query = new URLSearchParams(params).toString();
        const url = `/sample-system${endpoint}${query ? `?${query}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Network response was not ok');
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error('Error fetching options:', error);
        return [];
    }
}

function renderOptions(selectId, items) {
    const sl = document.querySelector(`#${selectId}`);
    if (!sl) return;

    let html = '<option value="">-- Select --</option>';

    if (Array.isArray(items)) {
        let otp = items
            .map((i) => {
                if (typeof i === 'string' || typeof i === 'number') {
                    return `<option value="${i}">${i}</option>`;
                } else if (i && typeof i === 'object' && i.id && i.name) {
                    return `<option value="${i.id}">${i.name}</option>`;
                } else return '';
            })
            .join('');
        html += otp;
    }

    sl.innerHTML = html;
}

async function loadAllSelects() {
    const simpleConfigs = SELECT_CONFIGS.filter((cfg) => !cfg.params);
    const res = await Promise.all(simpleConfigs.map((cfg) => fetchOptions(cfg.endpoint)));

    simpleConfigs.forEach((cfg, i) => {
        const items = res[i] || [];
        renderOptions(cfg.id, items);
        SELECT_CACHE[cfg.endpoint] = items;
    });

    const pjNumSelect = document.querySelector('#pjNum');
    if (pjNumSelect) {
        pjNumSelect.innerHTML = '<option value="">-- Select Project --</option>';
    }
}

function showAlertSuccess(title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'success',
        customClass: 'swal-success',
        buttonsStyling: true,
    });
}

function showAlertError(title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'error',
        customClass: 'swal-error',
        buttonsStyling: true,
    });
}

function showAlertWarning(title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        customClass: 'swal-warning',
        buttonsStyling: true,
    });
}

function rangePicker($input, fromDate, toDate) {
    const start = fromDate && window.moment ? window.moment(fromDate.split(' ')[0], 'YYYY/MM/DD') : null;
    const end = toDate && window.moment ? window.moment(toDate.split(' ')[0], 'YYYY/MM/DD') : null;

    $input.daterangepicker({
        startDate: start || window.moment().subtract(3, 'months'),
        endDate: end || window.moment(),
        autoApply: false,
        locale: {format: 'YYYY/MM/DD'},
    });
}

function singlePicker($input, workDate) {
    const start = workDate && window.moment ? window.moment(workDate.split(' ')[0], 'YYYY/MM/DD') : null;

    $input.daterangepicker({
        singleDatePicker: true,
        startDate: start || window.moment(),
        autoApply: false,
        locale: {format: 'YYYY/MM/DD'},
    });
}

function showDatePicker(id) {
    const $input = $(`#${id}`);
    if (!$input || $input.length === 0) return;

    singlePicker($input);

    if (!$input.val()) {
        let todayStr = '';
        if (window.moment) {
            todayStr = window.moment().format('YYYY/MM/DD');
        } else {
            const now = new Date();
            const year = now.getFullYear();
            const month = ('0' + (now.getMonth() + 1)).slice(-2);
            const day = ('0' + now.getDate()).slice(-2);
            todayStr = `${year}/${month}/${day}`;
        }
        $input.val(todayStr);
    }
}

async function loadSummary() {
    try {
        const endpoint = '/sample-system/api/dashboard/summary';

        function fmtDate(d) {
            const y = d.getFullYear();
            const m = ('0' + (d.getMonth() + 1)).slice(-2);
            const day = ('0' + d.getDate()).slice(-2);
            return `${y}/${m}/${day} 00:00:00`;
        }

        const now = new Date();
        const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endThisMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const startPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const q1 = `?startTime=${encodeURIComponent(fmtDate(startThisMonth))}&endTime=${encodeURIComponent(
            fmtDate(endThisMonth)
        )}`;
        const q2 = `?startTime=${encodeURIComponent(fmtDate(startPrevMonth))}&endTime=${encodeURIComponent(
            fmtDate(endPrevMonth)
        )}`;

        const [r1, r2] = await Promise.all([fetch(endpoint + q1), fetch(endpoint + q2)]);
        if (!r1.ok || !r2.ok) throw new Error('Error fetching summary');

        const j1 = await r1.json();
        const j2 = await r2.json();

        function metricsFromResponse(res) {
            if (!res) return {totalProject: 0, processTask: 0, overDueTask: 0, weekly: 0};

            // Support multiple response shapes: direct fields, { data: ... }, { result: ... }
            let payload = res;
            if (res.result && typeof res.result === 'object') payload = res.result;
            else if (res.data && typeof res.data === 'object') payload = res.data;

            if (Array.isArray(payload)) {
                return {totalProject: payload.length, processTask: 0, overDueTask: 0, weekly: 0};
            }

            const totalProject =
                typeof payload.totalProject !== 'undefined'
                    ? Number(payload.totalProject)
                    : typeof payload.size !== 'undefined'
                    ? Number(payload.size)
                    : 0;
            const processTask = Number(payload.processTask || 0);
            const overDueTask = Number(payload.overDueTask || 0);
            const weekly = Number(payload.weekly || 0);

            return {totalProject, processTask, overDueTask, weekly};
        }

        const cur = metricsFromResponse(j1);
        const prev = metricsFromResponse(j2);

        const elTotal = document.getElementById('total');
        const elInProgress = document.getElementById('in_progress');
        const elOverdue = document.getElementById('overdue');
        const elPending = document.getElementById('pending');

        if (elTotal) elTotal.textContent = cur.totalProject;
        if (elInProgress) elInProgress.textContent = cur.processTask;
        if (elOverdue) elOverdue.textContent = cur.overDueTask;
        if (elPending) elPending.textContent = cur.weekly;

        const diffs = {
            total: cur.totalProject - prev.totalProject,
            in_progress: cur.processTask - prev.processTask,
            overdue: cur.overDueTask - prev.overDueTask,
            pending: cur.weekly - prev.weekly,
        };

        function renderDiff(elementId, diff) {
            const el = document.getElementById(elementId);
            if (!el) return;
            const arrow =
                diff > 0
                    ? '<i class="bi bi-arrow-up"></i>'
                    : diff < 0
                    ? '<i class="bi bi-arrow-down"></i>'
                    : '<i class="bi bi-dash-lg"></i>';
            const signedNum = diff > 0 ? `+${diff}` : `${diff}`;
            let suffix = '';
            try {
                const orig = el.innerHTML || '';
                const m = orig.match(/<\/i>\s*[-+]?\d+\s*(.*)/);
                if (m && m[1]) suffix = ' ' + m[1].trim();
                else {
                    const txt = el.textContent || '';
                    const tail = txt.replace(/^\s*[\u2191\u2193\-\d\s]+/, '').trim();
                    if (tail) suffix = ' ' + tail;
                }
            } catch (e) {
                /* ignore */
            }

            el.innerHTML = `${arrow} ${signedNum}${suffix}`;
        }

        renderDiff('last_total', diffs.total);
        renderDiff('last_in_progress', diffs.in_progress);
        renderDiff('last_overdue', diffs.overdue);
        renderDiff('last_pending', diffs.pending);
    } catch (error) {
        console.error('Load summary error:', error);
    }
}

async function loadProjectNumbers() {
    const customerId = document.querySelector('#sl-customer')?.value;
    const modelId = document.querySelector('#sl-model')?.value;

    if (!customerId || !modelId) {
        renderOptions('pjNum', []);
        return;
    }

    const items = await fetchOptions('/api/projects', {customerId, modelId});
    renderOptions('pjNum', items);
    SELECT_CACHE['/api/projects'] = items;
}

function loadEvent() {
    const slCustomer = document.querySelector('#sl-customer');
    const slModel = document.querySelector('#sl-model');

    if (slCustomer) {
        slCustomer.addEventListener('change', loadProjectNumbers);
    }

    if (slModel) {
        slModel.addEventListener('change', loadProjectNumbers);
    }
}

function initEventListeners() {
    document.addEventListener('click', function (e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;
        const projectId = target.dataset.id;
        const filterType = target.dataset.filter;
        const stage = target.dataset.stage;

        switch (action) {
            case 'showCFTTeam':
                showCFT(projectId);
                break;
            case 'showTaskListByFilter':
                showTaskByFilter(filterType, projectId);
                break;
            case 'showTaskListByStage':
                showTaskByStage(projectId, stage);
                break;
            case 'showTaskDetail':
                const taskId = target.dataset.id;
                const taskProjectId = target.dataset.projectId;
                if (taskId && taskProjectId) {
                    editTaskDetail(taskId, taskProjectId);
                }
                break;
            case 'editTaskDetail':
                editTaskDetail(target.dataset.id, target.dataset.projectId);
                break;
            case 'deleteTask':
                deleteTask(target.dataset.id);
                break;
            case 'showAttachments':
                alert('附件');
                break;
            case 'addCftMember':
                addCftMember();
                break;
            case 'showDashboardTasks':
                showDashboardTasks(filterType);
                break;
        }
    });

    document.addEventListener('click', function (e) {
        const deleteBtn = e.target.closest('.cft-delete-btn');
        if (!deleteBtn) return;

        const raciId = deleteBtn.dataset.raciId;
        if (raciId) {
            deleteCftMember(raciId, deleteBtn.closest('tr'));
        }
    });
}

async function loadData() {
    await loadAllSelects();
    await loadUsersData();
}

async function loadUsersData() {
    USERS_CACHE = await fetchUsers();
    updateDRISelect();
}

async function initializeDashboardPage() {
    loadEvent();
    await loadData();
    initDashboardFilters();
    initEventListeners();
    if (typeof loadSummary === 'function') loadSummary();
    const uploadBtn = document.getElementById('upload');
    if (uploadBtn) uploadBtn.addEventListener('click', handleTaskFileUpload);
    const commentBtn = document.getElementById('comment');
    if (commentBtn) commentBtn.addEventListener('click', handleTaskComment);
    await applyDashboardFilters();

    const taskDetailModal = document.getElementById('taskDetailModal');
    if (taskDetailModal) {
        taskDetailModal.addEventListener('hidden.bs.modal', function () {
            restoreOriginalUrl(this);
        });
    }

    await openTaskFromUrl();
}

document.addEventListener('DOMContentLoaded', function () {
    initializeDashboardPage();
});

function getTaskIdFromLocation() {
    try {
        const params = new URLSearchParams(window.location.search || '');
        const qTaskId = params.get('taskId');
        if (qTaskId) return qTaskId;
        return null;
    } catch (e) {
        console.warn('getTaskIdFromLocation error', e);
        return null;
    }
}

function getProjectIdFromLocation() {
    try {
        const params = new URLSearchParams(window.location.search || '');
        const qProjectId = params.get('projectId');
        if (qProjectId) return qProjectId;
        return null;
    } catch (e) {
        console.warn('getProjectIdFromLocation error', e);
        return null;
    }
}

async function openTaskFromUrl() {
    const taskId = getTaskIdFromLocation();
    if (!taskId) return;

    const modalRoot = document.getElementById('taskDetailModal');
    if (modalRoot && modalRoot.dataset.taskId === taskId) {
        return;
    }

    const projectIdFromUrl = getProjectIdFromLocation();

    try {
        const res = await fetch(`/sample-system/api/tasks/${encodeURIComponent(taskId)}`);
        if (!res.ok) {
            console.warn('openTaskFromUrl: task API returned', res.status, res.statusText);
            await editTaskDetail(taskId, projectIdFromUrl);
            return;
        }

        const json = await res.json();
        const task = json.data || json.result || null;
        const projectId = task?.projectId || task?.project_id || projectIdFromUrl || null;

        await editTaskDetail(taskId, projectId);
    } catch (e) {
        console.error('openTaskFromUrl error:', e);
        await editTaskDetail(taskId, projectIdFromUrl);
    }
}

window.addEventListener('popstate', async function () {
    const taskId = getTaskIdFromLocation();
    if (taskId) {
        await openTaskFromUrl();
    } else {
        closeTaskDetail();
    }
});

const DateFormatter = {
    toAPIFormat(dateStr) {
        if (!dateStr || dateStr === '-' || String(dateStr).toUpperCase() === 'N/A') {
            return null;
        }

        const str = String(dateStr).trim();

        if (window.moment) {
            const m = window.moment(
                str,
                [
                    'YYYY/MM/DD',
                    'YYYY-MM-DD',
                    'YYYY/MM/DD HH:mm',
                    'YYYY-MM-DD HH:mm',
                    'YYYY/MM/DD HH:mm:ss',
                    'YYYY-MM-DD HH:mm:ss',
                ],
                true
            );

            if (m && typeof m.isValid === 'function' && m.isValid()) {
                return m.format('YYYY/MM/DD HH:mm:ss');
            }
        }

        const parts = str.split(' ');
        let datePart = parts[0] || '';
        let timePart = parts[1] || '00:00:00';

        datePart = datePart.substring(0, 10).replace(/-/g, '/');

        const tPieces = timePart.split(':');
        if (tPieces.length === 1) {
            timePart = `${tPieces[0] || '00'}:00:00`;
        } else if (tPieces.length === 2) {
            timePart = `${tPieces[0] || '00'}:${tPieces[1] || '00'}:00`;
        } else {
            timePart = `${tPieces[0] || '00'}:${tPieces[1] || '00'}:${tPieces[2] || '00'}`;
        }

        return `${datePart} ${timePart}`;
    },

    toDisplayFormat(dateStr) {
        return this.toAPIFormat(dateStr) || '-';
    },
};

function buildDashboardProjectParams() {
    const params = new URLSearchParams();
    const customerId = document.getElementById('sl-customer')?.value?.trim();
    const modelId = document.getElementById('sl-model')?.value?.trim();
    const projectId = document.getElementById('pjNum')?.value?.trim();
    const dri = document.getElementById('dashboardFilterDRI')?.value?.trim();
    const deadlineValue = document.getElementById('dashboardFilterDeadline')?.value?.trim();
    const keyword = document.getElementById('dashboardFilterSearch')?.value?.trim();

    if (customerId) params.append('customerId', customerId);
    if (modelId) params.append('modelId', modelId);
    if (projectId) params.append('projectId', projectId);
    if (dri) params.append('dri', dri);

    if (deadlineValue) {
        const dueDate = DateFormatter.toAPIFormat(deadlineValue);
        if (dueDate) {
            params.append('dueDate', dueDate);
        }
    }

    if (keyword) {
        params.append('projectName', keyword);
    }

    return params;
}

function escapeHtml(input) {
    if (input === null || input === undefined) return '';
    return String(input)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

let currentTaskDetailObj = null;

async function fetchAndRenderAttachments(taskId) {
    if (!taskId) return;
    try {
        const listEl = document.getElementById('attachments-list');
        if (!listEl) return;
        listEl.innerHTML = '<div class="loading">Loading attachments...</div>';

        const res = await fetch(`/sample-system/api/tasks/${encodeURIComponent(taskId)}/documents`);
        if (!res.ok) {
            listEl.innerHTML = '<div class="text-muted">No attachments</div>';
            return;
        }

        const json = await res.json();
        const items = json && (json.data || json.result) ? json.data || json.result : [];
        if (!Array.isArray(items) || items.length === 0) {
            listEl.innerHTML = '<div class="text-muted">No attachments</div>';
            return;
        }

        const rows = items
            .map((it) => {
                const url = it.url || it.downloadUrl || '';
                const name = it.name || it.fileName || it.filename || String(it.id || '');
                const safeName = escapeHtml(name);
                const safeUrl = escapeHtml(url);
                return `
                <div class="attachment-item">
                    <div class="attachment-info">
                        <span class="attachment-icon"><i class="bi bi-file-earmark"></i></span>
                        <span class="attachment-name">${safeName}</span>
                    </div>
                    <button type="button" class="download-btn" data-url="${safeUrl}" data-filename="${safeName}">
                        <span><i class="bi bi-download"></i> Download</span>
                    </button>
                </div>`;
            })
            .join('');

        listEl.innerHTML = rows;

        listEl.querySelectorAll('.download-btn').forEach((btn) => {
            btn.addEventListener('click', function () {
                const url = this.dataset.url;
                const filename = this.dataset.filename;
                if (!url) return;

                try {
                    const a = document.createElement('a');
                    const fullUrl = url.startsWith('http') ? url : `/sample-system${url}`;
                    a.href = fullUrl;
                    a.download = filename || 'download';
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        document.body.removeChild(a);
                    }, 100);
                } catch (e) {
                    console.warn('Download failed, trying fallback', e);
                    try {
                        const fullUrl = url.startsWith('http') ? url : `/sample-system${url}`;
                        window.open(fullUrl, '_blank');
                    } catch (err) {
                        console.error('Both download methods failed', err);
                    }
                }
            });
        });
    } catch (e) {
        console.warn('Failed to load attachments for task', taskId, e);
    }
}

async function getComments(id) {
    try {
        const container = document.getElementById('comment-container');
        if (!container) return;

        container.innerHTML = '<div class="comment-loading">Loading comments...</div>';

        const res = await fetch(`/sample-system/api/tasks/${id}/comments`);
        if (!res.ok) {
            console.warn('getComments: server returned', res.status, res.statusText);
            container.innerHTML = '<div class="comment-empty">No comments</div>';
            return;
        }

        let json = null;
        try {
            json = await res.json();
        } catch (e) {
            json = null;
        }
        const items = json && Array.isArray(json.data) ? json.data : [];

        if (!items || items.length === 0) {
            container.innerHTML = '<div class="comment-empty">No comments</div>';
            return;
        }

        const html = items
            .map((it) => {
                const author = it.createdBy || it.author || '-';
                const date = it.createdAt || it.createAt || it.date || '-';
                const content = it.content || it.cnContent || it.vnContent || '';

                const isSystemUpdate = content.startsWith('Task updated:');

                if (isSystemUpdate) {
                    const changes = parseTaskUpdates(content);
                    return `
                        <div class="update-log-item ml-1" style="font-size:0.85rem; font-style: italic; opacity: 0.65;">
                            <span class="update-label">Updated:</span>
                            <span class="update-changes">${escapeHtml(changes)}</span>
                            <span class="update-separator">-</span>
                            <span class="update-author">${escapeHtml(String(author))}</span>
                            <span class="update-separator">-</span>
                            <span class="update-date">${escapeHtml(String(date))}</span>
                        </div>`;
                }

                return `
                    <div class="comment-item">
                        <div class="comment-header">
                            <div class="comment-avatar"><i class="bi bi-person"></i></div>
                            <div>
                                <div class="comment-author">${escapeHtml(String(author))}</div>
                                <div class="comment-date">${escapeHtml(String(date))}</div>
                            </div>
                        </div>
                        <div class="comment-text">${escapeHtml(String(content))}</div>
                    </div>`;
            })
            .join('');

        container.innerHTML = html;
    } catch (error) {
        console.error('Error getting comments: ' + (error && error.message ? error.message : error));
    }
}

function parseTaskUpdates(content) {
    const fieldMatches = content.matchAll(/\[(\w+):/g);
    const fields = Array.from(fieldMatches).map((m) => m[1]);

    const fieldLabels = {
        dri: 'DRI',
        dueDate: 'Deadline',
        status: 'Status',
        priority: 'Priority',
        stageId: 'Stage',
        processId: 'Process',
    };

    const translatedFields = fields.map((f) => fieldLabels[f] || f);
    return translatedFields.join(', ') || 'Task updated';
}

async function handleTaskFileUpload() {
    const modal = document.getElementById('taskDetailModal');
    if (!modal) return;

    const taskId = modal.dataset.taskId;
    if (!taskId || taskId === 'null') {
        return;
    }

    const oldInput = modal.querySelector('input[type="file"][data-task-upload]');
    if (oldInput) oldInput.remove();

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    fileInput.dataset.taskUpload = 'true';
    modal.appendChild(fileInput);

    fileInput.onchange = async function () {
        if (!fileInput.files || fileInput.files.length === 0) return;

        const formData = new FormData();
        formData.append('id', taskId);

        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append('files', fileInput.files[i]);
        }

        try {
            const res = await fetch('/sample-system/api/tasks/upload-files', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                showAlertError('Failed', 'Upload thất bại: ' + res.status + ' ' + text);
                return;
            }

            showAlertSuccess('Success', 'Success!');

            try {
                await fetchAndRenderAttachments(taskId);
            } catch (e) {
                console.warn('Failed to refresh attachments after upload', e);
            }
        } catch (e) {
            console.error('File upload error', e);
            showAlertError('Failed', 'Không thể upload file');
        }
    };

    fileInput.click();
}

async function handleTaskComment() {
    const modal = document.getElementById('taskDetailModal');
    if (!modal) return;

    const taskId = modal.dataset.taskId;
    if (!taskId || taskId === 'null') {
        return;
    }

    const input = document.getElementById('input-comment');
    const comment = input ? (input.value || '').trim() : '';
    if (!comment) {
        showAlertWarning('Warning', 'Vui lòng nhập bình luận');
        return;
    }

    try {
        const params = new URLSearchParams();
        params.append('comment', comment);

        const res = await fetch(`/sample-system/api/tasks/${taskId}/comment`, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params.toString(),
        });

        if (!res.ok) {
            const txt = await res.text().catch(() => '');
            showAlertError('Failed', 'Gửi comment thất bại: ' + res.status + ' ' + txt);
            return;
        }

        try {
            await getComments(taskId);
        } catch (e) {
            console.warn('Failed to refresh comments after posting', e);
        }

        showAlertSuccess('Success', 'Comment đã gửi');
        if (input) input.value = '';
    } catch (error) {
        console.error('Failed to send comment', error);
        showAlertError('Failed', 'Gửi comment thất bại');
    }
}

function initDeadlinePicker() {
    try {
        const deadlineInput = document.getElementById('deadLine');
        if (deadlineInput && window.jQuery && typeof $.fn.daterangepicker === 'function') {
            const initial = deadlineInput.dataset.initialValue || deadlineInput.value || '';
            const start =
                initial && window.moment ? window.moment(initial.split(' ')[0], 'YYYY/MM/DD') : window.moment();

            $(deadlineInput).daterangepicker({
                singleDatePicker: true,
                startDate: start,
                autoApply: false,
                locale: {format: 'YYYY/MM/DD'},
            });
        }
    } catch (e) {
        console.warn('Failed to initialize deadline picker', e);
    }
}

function initTaskDetailDriSelect2() {
    try {
        const driSelect = document.getElementById('dri');
        if (driSelect && window.jQuery && typeof $.fn.select2 === 'function') {
            const modalRoot = document.getElementById('taskDetailModal');

            if ($(driSelect).data('select2')) {
                $(driSelect).select2('destroy');
            }

            driSelect.innerHTML = '<option value="">-- Select DRI --</option>';
            USERS_CACHE.forEach((user) => {
                const option = document.createElement('option');
                option.value = user.idCard || '';
                option.textContent = formatUserLabel(user);
                driSelect.appendChild(option);
            });

            $(driSelect).select2({
                placeholder: 'Search DRI...',
                allowClear: true,
                width: '100%',
                dropdownParent: $(modalRoot),
            });
        }
    } catch (e) {
        console.warn('Failed to initialize DRI select2', e);
    }
}

async function editTaskDetail(taskId, projectId) {
    if (!taskId || taskId === 'null' || taskId === 'undefined') {
        showAlertWarning('Warning', 'Invalid task ID');
        return;
    }

    let task = null;
    try {
        loader.load();

        try {
            const res = await fetch(`/sample-system/api/tasks/${taskId}`);
            if (res.ok) {
                const json = await res.json();
                task = json.data || json.result || null;
            } else {
                console.warn('editTaskDetail: server returned', res.status, res.statusText);
            }
        } catch (fetchErr) {
            console.warn('editTaskDetail: fetch failed', fetchErr);
        }

        if (!task) {
            loader.unload();
            showAlertError('Error', 'Task not found');
            return;
        }

        const modalRoot = document.getElementById('taskDetailModal');
        if (!modalRoot) {
            loader.unload();
            return;
        }

        try {
            modalRoot.dataset.projectId = String(projectId || '');
            modalRoot.dataset.taskId = String(taskId || '');
            currentTaskDetailObj = task ? JSON.parse(JSON.stringify(task)) : null;
        } catch (e) {
            console.warn('Failed to attach task metadata to modal', e);
        }

        try {
            if (!modalRoot.dataset.originalUrl) {
                modalRoot.dataset.originalUrl = window.location.href;
            }

            const url = new URL(window.location.href);
            url.searchParams.set('taskId', String(taskId));
            window.history.pushState(
                {
                    taskId: taskId,
                    projectId: projectId || null,
                    originalUrl: modalRoot.dataset.originalUrl,
                },
                '',
                url.toString()
            );
        } catch (e) {
            console.warn('Failed to pushState for task deep-link', e);
        }

        const setText = (selector, value) => {
            const el = modalRoot.querySelector(selector);
            if (el) el.textContent = value || '';
        };

        setText('.task-detail-id', task.taskCode || String(task.id || ''));
        setText('.task-detail-name', task.name || '');
        const descEl = modalRoot.querySelector('.section-content');
        if (descEl) descEl.textContent = task.description || '';

        setText('.date-display', task.dueDate || task.deadline || '-');
        setText('.assignee-name', task.dri || task.assignee || '-');

        try {
            const driInput = document.getElementById('dri');
            if (driInput) {
                const driVal = task.dri ?? task.assignee ?? null;
                driInput.value = driVal ? driVal : '';
            }

            const deadLineInput = document.getElementById('deadLine');
            const dueVal = task.dueDate || task.deadline || null;
            if (deadLineInput) {
                if (dueVal) {
                    const normalized = DateFormatter.toDisplayFormat(dueVal);
                    deadLineInput.value = normalized;
                    deadLineInput.dataset.initialValue = normalized;
                } else {
                    deadLineInput.value = '';
                    deadLineInput.dataset.initialValue = '';
                }
            }
        } catch (e) {
            console.warn('Failed to set sidebar inputs (#dri, #deadLine):', e);
        }

        const statusBadge = modalRoot.querySelector('.task-status-badge');
        if (statusBadge) {
            statusBadge.textContent = task.status || '';
            statusBadge.classList.remove('status-in-progress', 'status-completed', 'status-pending', 'status-overdue');
            if (String(task.status).toLowerCase().includes('progress')) statusBadge.classList.add('status-in-progress');
            else if (String(task.status).toLowerCase().includes('complete'))
                statusBadge.classList.add('status-completed');
            else if (String(task.status).toLowerCase().includes('overdue')) statusBadge.classList.add('status-overdue');
            else statusBadge.classList.add('status-pending');
        }

        const priorityBadge = modalRoot.querySelector('.priority-badge');
        if (priorityBadge) {
            priorityBadge.textContent =
                (task.priority && String(task.priority)) || (task.priority === 0 ? '0' : task.priority || '');
            priorityBadge.classList.remove('priority-high', 'priority-medium', 'priority-low');
            const p = String(task.priority || '').toLowerCase();
            if (p === 'high') priorityBadge.classList.add('priority-high');
            else if (p === 'medium') priorityBadge.classList.add('priority-medium');
            else if (p === 'low') priorityBadge.classList.add('priority-low');
        }

        try {
            const statusSelect = modalRoot.querySelector('#modal-sl-status');
            const prioritySelect = modalRoot.querySelector('#modal-sl-priority');
            const stageSelect = modalRoot.querySelector('#sl-xvt');
            const typeSelect = modalRoot.querySelector('#sl-type');

            // Fetch status options with forUpdate=true for task detail modal
            if (statusSelect) {
                try {
                    const statusRes = await fetch('/sample-system/api/tasks/status?forUpdate=true');
                    if (statusRes.ok) {
                        const statusJson = await statusRes.json();
                        const statuses = statusJson.data || [];
                        statusSelect.innerHTML = '<option value="">--Select--</option>';
                        statuses.forEach((s) => {
                            const opt = document.createElement('option');
                            if (typeof s === 'string' || typeof s === 'number') {
                                opt.value = s;
                                opt.textContent = s;
                            } else if (s && s.id && s.name) {
                                opt.value = s.id;
                                opt.textContent = s.name;
                            } else if (s && s.name) {
                                opt.value = s.name;
                                opt.textContent = s.name;
                            }
                            statusSelect.appendChild(opt);
                        });
                    }
                } catch (e) {
                    console.warn('Failed to fetch status options with forUpdate:', e);
                }
            }

            const ensureAndSet = (selectEl, value) => {
                if (!selectEl) return;
                const val =
                    value === null || value === undefined || String(value).trim() === '' ? 'N/A' : String(value);
                const hasOption = Array.from(selectEl.options).some((o) => String(o.value) === val);
                if (!hasOption) {
                    const opt = document.createElement('option');
                    opt.value = val;
                    opt.text = val === 'N/A' ? 'N/A' : val;
                    if (selectEl.options.length > 0) selectEl.add(opt, selectEl.options[0]);
                    else selectEl.add(opt);
                }
                selectEl.value = val;
            };

            ensureAndSet(statusSelect, task.status);
            ensureAndSet(prioritySelect, task.priority);

            if (stageSelect && SELECT_CACHE && SELECT_CACHE['/api/stages']) {
                const stages = SELECT_CACHE['/api/stages'];
                stageSelect.innerHTML = '<option value="">--Select--</option>';
                stages.forEach((stage) => {
                    const opt = document.createElement('option');
                    opt.value = stage.id || stage;
                    opt.textContent = stage.name || stage;
                    stageSelect.appendChild(opt);
                });
                const stageId = task.stageId || (task.stage && task.stage.id) || null;
                if (stageId) stageSelect.value = String(stageId);
            }

            if (typeSelect && SELECT_CACHE && SELECT_CACHE['/api/processes']) {
                const processes = SELECT_CACHE['/api/processes'];
                typeSelect.innerHTML = '<option value="">--Select--</option>';
                processes.forEach((proc) => {
                    const opt = document.createElement('option');
                    opt.value = proc.id || proc;
                    opt.textContent = proc.name || proc;
                    typeSelect.appendChild(opt);
                });
                const processId = task.processId || (task.process && task.process.id) || null;
                if (processId) typeSelect.value = String(processId);
            }
        } catch (e) {
            console.warn('Failed to set status/priority/stage/type selects in task detail modal', e);
        }

        loader.unload();

        try {
            const modal = new bootstrap.Modal(modalRoot);
            modal.show();

            setTimeout(() => {
                initDeadlinePicker();
                initTaskDetailDriSelect2();
            }, 50);
        } catch (e) {
            if (modalRoot) modalRoot.classList.add('active');
            setTimeout(() => {
                try {
                    initDeadlinePicker();
                } catch (err) {}
                try {
                    initTaskDetailDriSelect2();
                } catch (err) {}
            }, 50);
        }

        try {
            await fetchAndRenderAttachments(taskId);
            await getComments(taskId);
        } catch (err) {
            console.warn('Failed to load comments/attachments for task', taskId, err);
        }
    } catch (e) {
        loader.unload();
        console.error('Error opening task detail modal:', e);
        showAlertError('Error', 'Failed to load task details');
    }
}

async function saveTaskDetailChanges() {
    const modalRoot = document.getElementById('taskDetailModal');
    if (!modalRoot) {
        showAlertError('Error', 'taskDetailModal not found');
        return;
    }

    const projectId = modalRoot.dataset.projectId;
    const taskId = modalRoot.dataset.taskId;

    let taskPayload = null;
    if (currentTaskDetailObj && String(currentTaskDetailObj.id) === String(taskId || currentTaskDetailObj.id)) {
        taskPayload = JSON.parse(JSON.stringify(currentTaskDetailObj));
    } else {
        try {
            const res = await fetch(`/sample-system/api/tasks/get-by-id?id=${encodeURIComponent(taskId)}`);
            if (res.ok) {
                const json = await res.json();
                taskPayload = json.data || json.result || null;
            }
        } catch (e) {
            console.warn('Failed to fetch full task payload before update', e);
        }
    }

    if (!taskPayload) {
        showAlertError('Error', 'Task data not available for update');
        return;
    }

    const statusSelect = modalRoot.querySelector('#modal-sl-status');
    const prioritySelect = modalRoot.querySelector('#modal-sl-priority');
    const newStatus = statusSelect ? statusSelect.value : taskPayload.status;
    const newPriority = prioritySelect ? prioritySelect.value : taskPayload.priority;

    const driInput = document.getElementById('dri');
    const deadlineInput = document.getElementById('deadLine');

    let newDri = driInput ? driInput.value : taskPayload.dri;
    let newDeadline = deadlineInput ? deadlineInput.value : taskPayload.dueDate;
    if (newDri === 'N/A' || newDri === '-' || !newDri || newDri.trim() === '') newDri = null;
    if (newDeadline === 'N/A' || newDeadline === '-' || !newDeadline || newDeadline.trim() === '') newDeadline = null;

    if (newDeadline) {
        try {
            newDeadline = DateFormatter.toAPIFormat(newDeadline);
        } catch (e) {
            console.warn('Failed to format deadline:', e);
        }
    }

    taskPayload.status = newStatus === 'N/A' ? null : newStatus;
    taskPayload.priority = newPriority === 'N/A' ? null : newPriority;
    taskPayload.dri = newDri;
    taskPayload.dueDate = newDeadline;

    try {
        const stageSelect = modalRoot.querySelector('#sl-xvt');
        const stageVal = stageSelect
            ? stageSelect.value
            : taskPayload.stageId || (taskPayload.stage && taskPayload.stage.id) || null;
        let newStageId = null;
        if (
            stageVal !== null &&
            stageVal !== undefined &&
            String(stageVal).trim() !== '' &&
            stageVal !== 'N/A' &&
            stageVal !== '-'
        ) {
            const parsed = Number(stageVal);
            newStageId = isNaN(parsed) ? null : parsed;
        }
        taskPayload.stageId = newStageId;
    } catch (e) {
        console.warn('Failed to read stage select for task update:', e);
    }

    try {
        const typeSelect = modalRoot.querySelector('#sl-type');
        const typeVal = typeSelect
            ? typeSelect.value
            : taskPayload.processId || (taskPayload.process && taskPayload.process.id) || null;
        let newProcessId = null;
        if (
            typeVal !== null &&
            typeVal !== undefined &&
            String(typeVal).trim() !== '' &&
            typeVal !== 'N/A' &&
            typeVal !== '-'
        ) {
            const parsedType = Number(typeVal);
            newProcessId = isNaN(parsedType) ? null : parsedType;
        }
        taskPayload.processId = newProcessId;
    } catch (e) {
        console.warn('Failed to read type/process select for task update:', e);
    }

    try {
        loader.load();
        const res = await fetch('/sample-system/api/tasks/update', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(taskPayload),
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            console.warn('Update API returned', res.status, res.statusText, text);
            loader.unload();
            showAlertError('Failed', 'Failed to update task. Server returned ' + res.status);
            return;
        }

        let json = null;
        try {
            json = await res.json();
        } catch (e) {
        }
        const updatedTask = (json && (json.data || json.result)) || taskPayload;

        loader.unload();

        try {
            const statusBadge = modalRoot.querySelector('.task-status-badge');
            const priorityBadge = modalRoot.querySelector('.priority-badge');

            if (statusBadge) {
                statusBadge.textContent = getStatusLabel(updatedTask.status);
                statusBadge.className = `task-status-badge ${getStatusBadgeClass(updatedTask.status)}`;
            }

            if (priorityBadge) {
                priorityBadge.textContent = getPriorityLabel(updatedTask.priority);
                priorityBadge.className = `priority-badge ${getPriorityBadgeClass(updatedTask.priority)}`;
            }

            const dateDisplay = modalRoot.querySelector('.date-display');
            if (dateDisplay) {
                dateDisplay.textContent = updatedTask.dueDate || updatedTask.deadline || '-';
            }

            const assigneeDisplay = modalRoot.querySelector('.assignee-name');
            if (assigneeDisplay) {
                assigneeDisplay.textContent = getUserLabelById(updatedTask.dri) || '-';
            }

            const statusSelect = modalRoot.querySelector('#modal-sl-status');
            const prioritySelect = modalRoot.querySelector('#modal-sl-priority');

            if (statusSelect) {
                statusSelect.value = updatedTask.status || (updatedTask.status === null ? 'N/A' : '');
            }

            if (prioritySelect) {
                prioritySelect.value = updatedTask.priority || (updatedTask.priority === null ? 'N/A' : '');
            }

            const driSelect = document.getElementById('dri');
            if (driSelect && updatedTask.dri) {
                driSelect.value = updatedTask.dri;
                if ($(driSelect).data('select2')) {
                    $(driSelect).val(updatedTask.dri).trigger('change');
                }
            }

            const deadlineInput = document.getElementById('deadLine');
            if (deadlineInput && updatedTask.dueDate) {
                const normalized = DateFormatter.toDisplayFormat(updatedTask.dueDate);
                deadlineInput.value = normalized;
                deadlineInput.dataset.initialValue = normalized;
            }

            refreshTaskListRowData(updatedTask);

            currentTaskDetailObj = JSON.parse(JSON.stringify(updatedTask));

            await getComments(taskId);
        } catch (e) {
            console.warn('Failed to refresh modal data after update', e);
        }

        showAlertSuccess('Success', 'Task updated successfully');
    } catch (e) {
        loader.unload();
        console.error('Failed to call update API', e);
        showAlertError('Failed', 'Failed to update task: ' + e.message);
    }
}

function refreshTaskListRowData(task) {
    if (!task || !task.id) return;
    const tbody = document.getElementById('taskListModalBody');
    if (!tbody) return;
    const row = tbody.querySelector(`tr[data-id="${task.id}"]`);
    if (!row) return;

    const cells = row.querySelectorAll('td');
    if (!cells || cells.length < 8) return;

    const statusCell = cells[4];
    const priorityCell = cells[5];
    const driCell = cells[6];
    const dueDateCell = cells[7];

    if (statusCell) {
        const statusBadge = statusCell.querySelector('.task-status-badge');
        if (statusBadge) {
            statusBadge.textContent = getStatusLabel(task.status);
            statusBadge.className = `task-status-badge ${getStatusBadgeClass(task.status)}`;
        }
    }

    if (priorityCell) {
        const priorityBadge = priorityCell.querySelector('.priority-badge');
        if (priorityBadge) {
            priorityBadge.textContent = getPriorityLabel(task.priority);
            priorityBadge.className = `priority-badge ${getPriorityBadgeClass(task.priority)}`;
        }
    }

    if (driCell) {
        driCell.textContent = getUserLabelById(task.dri) || '-';
    }

    if (dueDateCell) {
        dueDateCell.textContent = task.dueDate || task.deadline || '-';
    }
}

window.saveTaskDetailChanges = saveTaskDetailChanges;
window.toggleFollow = function () {
    alert('Follow feature not implemented');
};
window.setReminder = function () {
    alert('Reminder feature not implemented');
};
window.escalateTask = function () {
    alert('Escalate feature not implemented');
};
window.reassignTask = function () {
    alert('Reassign feature not implemented');
};
