<%@ page contentType="text/html;charset=UTF-8" language="java" %> <%@ taglib uri="http://www.springframework.org/tags"
prefix="spring" %>
<div class="component-wrapper">
    <div class="projects-header" style="margin-top: 3.5rem">
        <div class="projects-title">
            <span><i class="bi bi-gear"></i></span>
            <span><spring:message code="systemSettings" /></span>
        </div>
    </div>

    <!-- System Settings -->
    <div class="ppap-section">
        <div class="section-header">
            <span><i class="bi bi-sliders"></i></span>
            <span><spring:message code="systemSettingsTitle" /></span>
        </div>

        <div class="settings-grid">
            <div class="setting-item">
                <div class="setting-info">
                    <div class="setting-title"><spring:message code="taskNotification" /></div>
                    <div class="setting-description"><spring:message code="taskNotificationDesc" /></div>
                </div>
                <div class="toggle-switch active" onclick="toggleSetting(this)">
                    <div class="toggle-slider"></div>
                </div>
            </div>

            <div class="setting-item">
                <div class="setting-info">
                    <div class="setting-title"><spring:message code="deadlineWarning" /></div>
                    <div class="setting-description"><spring:message code="deadlineWarningDesc" /></div>
                </div>
                <div class="toggle-switch active" onclick="toggleSetting(this)">
                    <div class="toggle-slider"></div>
                </div>
            </div>

            <div class="setting-item">
                <div class="setting-info">
                    <div class="setting-title"><spring:message code="dailySummary" /></div>
                    <div class="setting-description"><spring:message code="dailySummaryDesc" /></div>
                </div>
                <div class="toggle-switch" onclick="toggleSetting(this)">
                    <div class="toggle-slider"></div>
                </div>
            </div>

            <div class="setting-item">
                <div class="setting-info">
                    <div class="setting-title"><spring:message code="escalationNotification" /></div>
                    <div class="setting-description"><spring:message code="escalationNotificationDesc" /></div>
                </div>
                <div class="toggle-switch active" onclick="toggleSetting(this)">
                    <div class="toggle-slider"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Permission Management -->
    <div class="ppap-section">
        <div class="section-header">
            <span><i class="bi bi-shield-lock"></i></span>
            <span><spring:message code="permissionManagement" /></span>
        </div>
        <p style="color: var(--text-secondary); margin-bottom: 20px">
            <spring:message code="permissionManagementDesc" />
        </p>

        <!-- Advanced Filter -->
        <div class="section-header" style="margin-top: 25px">
            <span><i class="bi bi-search"></i></span>
            <span><spring:message code="advancedFilter" /></span>
        </div>
        <div class="filter-grid">
            <div class="filter-item">
                <label class="filter-label"><spring:message code="projectNumber" /></label>
                <select class="filter-select" id="permissionFilterProject">
                    <option value=""><spring:message code="all" /></option>
                    <option value="FTV-001">FTV-001</option>
                    <option value="FTV-002">FTV-002</option>
                    <option value="FTV-003">FTV-003</option>
                    <option value="FTV-004">FTV-004</option>
                    <option value="FTV-005">FTV-005</option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="projectCustomer" /></label>
                <select class="filter-select" id="permissionFilterCustomer">
                    <option value=""><spring:message code="all" /></option>
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Google">Google</option>
                    <option value="Microsoft">Microsoft</option>
                    <option value="Dell">Dell</option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="projectModel" /></label>
                <select class="filter-select" id="permissionFilterModel">
                    <option value=""><spring:message code="all" /></option>
                    <option value="MacBook Pro">MacBook Pro</option>
                    <option value="Galaxy Tab">Galaxy Tab</option>
                    <option value="Pixel Watch">Pixel Watch</option>
                    <option value="Surface Laptop">Surface Laptop</option>
                    <option value="XPS Desktop">XPS Desktop</option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="xvtStage" /></label>
                <select class="filter-select" id="permissionFilterStage">
                    <option value=""><spring:message code="all" /></option>
                    <option value="HVT">HVT</option>
                    <option value="EVT">EVT</option>
                    <option value="DVT">DVT</option>
                    <option value="PVT">PVT</option>
                    <option value="MP">MP</option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="taskStatus" /></label>
                <select class="filter-select" id="permissionFilterStatus">
                    <option value=""><spring:message code="all" /></option>
                    <option value="pending"><spring:message code="pending" /></option>
                    <option value="in-progress"><spring:message code="inProgress" /></option>
                    <option value="completed"><spring:message code="completed" /></option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="priority" /></label>
                <select class="filter-select" id="permissionFilterPriority">
                    <option value=""><spring:message code="all" /></option>
                    <option value="high"><spring:message code="high" /></option>
                    <option value="medium"><spring:message code="medium" /></option>
                    <option value="low"><spring:message code="low" /></option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="department" /></label>
                <select class="filter-select" id="permissionFilterDepartment">
                    <option value=""><spring:message code="all" /></option>
                    <option value="PQE">PQE</option>
                    <option value="TPM">TPM</option>
                    <option value="RD">RD</option>
                    <option value="PE">PE</option>
                    <option value="ME">ME</option>
                    <option value="PQA">PQA</option>
                    <option value="SQE">SQE</option>
                    <option value="IQC">IQC</option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="process" /></label>
                <select class="filter-select" id="permissionFilterProcess">
                    <option value=""><spring:message code="all" /></option>
                    <option value="Supplier">Supplier</option>
                    <option value="IQC">IQC</option>
                    <option value="Kitting">Kitting</option>
                    <option value="SMT">SMT</option>
                    <option value="PCBA">PCBA</option>
                    <option value="Assembly">Assembly</option>
                    <option value="Test">Test</option>
                    <option value="Pack">Pack</option>
                    <option value="OBA">OBA</option>
                    <option value="WH">WH</option>
                    <option value="OTH">OTH</option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="dri" /></label>
                <select class="filter-select" id="permissionFilterDRI">
                    <option value=""><spring:message code="all" /></option>
                    <option value="張工程師">張工程師</option>
                    <option value="李經理">李經理</option>
                    <option value="王品保">王品保</option>
                    <option value="林製程">林製程</option>
                    <option value="周工程師">周工程師</option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="deadline" /></label>
                <input type="date" class="filter-input" id="permissionFilterDeadline" />
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="searchKeyword" /></label>
                <input
                    type="text"
                    class="filter-input"
                    id="permissionFilterSearch"
                    placeholder="輸入關鍵字..."
                    data-i18n-placeholder="enterKeyword" />
            </div>
        </div>
        <div class="action-buttons-row" style="margin-top: 15px">
            <button class="secondary-btn" onclick="resetPermissionFilter()">
                <span><i class="bi bi-arrow-repeat"></i></span>
                <span>重置</span>
            </button>
            <button class="primary-btn" onclick="applyPermissionFilter()">
                <span><i class="bi bi-check-lg"></i></span>
                <span>套用篩選</span>
            </button>
        </div>

        <table class="permission-table">
            <thead>
                <tr>
                    <th style="width: 50px">
                        <input
                            type="checkbox"
                            class="permission-checkbox-all"
                            onclick="toggleAllPermissionCheckboxes()" />
                    </th>
                    <th>專案</th>
                    <th>客戶</th>
                    <th>產品</th>
                    <th>xVT</th>
                    <th>任務</th>
                    <th>製程</th>
                    <th>使用者</th>
                    <th>部門</th>
                    <th>查看</th>
                    <th>編輯</th>
                    <th>刪除</th>
                    <th>管理員</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="text-align: center">
                        <input type="checkbox" class="permission-checkbox" />
                    </td>
                    <td>FTV-001</td>
                    <td>Apple</td>
                    <td>MacBook Pro</td>
                    <td>EVT</td>
                    <td>PPAP-001</td>
                    <td>PCBA</td>
                    <td>張工程師</td>
                    <td>PQE</td>
                    <td><input type="checkbox" class="permission-checkbox" checked /></td>
                    <td><input type="checkbox" class="permission-checkbox" checked /></td>
                    <td><input type="checkbox" class="permission-checkbox" /></td>
                    <td><input type="checkbox" class="permission-checkbox" /></td>
                    <td>
                        <button class="action-btn" onclick="openPermissionTask('FTV-001', 'PPAP-001', '張工程師')">
                            <span><i class="bi bi-clipboard-check"></i></span>
                            <span>查看任務</span>
                        </button>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center">
                        <input type="checkbox" class="permission-checkbox" />
                    </td>
                    <td>FTV-002</td>
                    <td>Samsung</td>
                    <td>Galaxy Tab</td>
                    <td>DVT</td>
                    <td>PPAP-007</td>
                    <td>Test</td>
                    <td>王品保</td>
                    <td>PQA</td>
                    <td><input type="checkbox" class="permission-checkbox" checked /></td>
                    <td><input type="checkbox" class="permission-checkbox" checked /></td>
                    <td><input type="checkbox" class="permission-checkbox" /></td>
                    <td><input type="checkbox" class="permission-checkbox" /></td>
                    <td>
                        <button class="action-btn" onclick="openPermissionTask('FTV-002', 'PPAP-007', '王品保')">
                            <span><i class="bi bi-clipboard-check"></i></span>
                            <span>查看任務</span>
                        </button>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center">
                        <input type="checkbox" class="permission-checkbox" />
                    </td>
                    <td>FTV-003</td>
                    <td>Google</td>
                    <td>Pixel Watch</td>
                    <td>PVT</td>
                    <td>PPAP-015</td>
                    <td>Assembly</td>
                    <td>李經理</td>
                    <td>TPM</td>
                    <td><input type="checkbox" class="permission-checkbox" checked /></td>
                    <td><input type="checkbox" class="permission-checkbox" checked /></td>
                    <td><input type="checkbox" class="permission-checkbox" checked /></td>
                    <td><input type="checkbox" class="permission-checkbox" checked /></td>
                    <td>
                        <button class="action-btn" onclick="openPermissionTask('FTV-003', 'PPAP-015', '李經理')">
                            <span><i class="bi bi-clipboard-check"></i></span>
                            <span>查看任務</span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div
            id="permissionTaskDetailModal"
            class="modal fade"
            tabindex="-1"
            aria-labelledby="permissionTaskDetailModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content modal-content-large">
                    <div class="modal-header">
                        <div class="modal-title" id="permissionTaskDetailModalLabel">
                            <div class="task-detail-title-section">
                                <div class="task-detail-id">PPAP-001</div>
                                <div class="task-detail-name">設計記錄</div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px">
                            <div class="task-action-buttons">
                                <button class="task-action-btn follow-btn" onclick="toggleFollow()">
                                    <span><i class="bi bi-star"></i></span>
                                    <span>關注</span>
                                </button>
                                <button class="task-action-btn reminder-btn" onclick="setReminder()">
                                    <span><i class="bi bi-alarm"></i></span>
                                    <span>提醒</span>
                                </button>
                                <button class="task-action-btn escalation-btn" onclick="escalateTask()">
                                    <span><i class="bi bi-bell-fill"></i></span>
                                    <span>Escalation</span>
                                </button>
                                <button class="task-action-btn reassign-btn" onclick="reassignTask()">
                                    <span><i class="bi bi-person"></i></span>
                                    <span>重新指派任務</span>
                                </button>
                            </div>
                            <button class="close-btn" onclick="closeTaskDetail()"><i class="bi bi-x-lg"></i></button>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="task-detail-body">
                            <div class="task-main-info">
                                <div class="info-section">
                                    <div class="section-title">
                                        <span><i class="bi bi-pencil-square"></i></span>
                                        <span>任務描述</span>
                                    </div>
                                    <div class="section-content">此任務需要完成相關PPAP文件準備及品質標準</div>
                                </div>

                                <div class="info-section">
                                    <div class="section-title">
                                        <span><i class="bi bi-paperclip"></i></span>
                                        <span>附件</span>
                                    </div>
                                    <div class="attachments-list">
                                        <div class="attachment-item">
                                            <div class="attachment-info">
                                                <span class="attachment-icon"><i class="bi bi-file-earmark"></i></span>
                                                <span class="attachment-name">設計規格書_v1.2.pdf</span>
                                            </div>
                                            <button class="download-btn">
                                                <span
                                                    ><span><i class="bi bi-download"></i> 下載</span></span
                                                >
                                            </button>
                                        </div>
                                        <div class="attachment-item">
                                            <div class="attachment-info">
                                                <span class="attachment-icon"
                                                    ><i class="bi bi-bar-chart-line"></i
                                                ></span>
                                                <span class="attachment-name">FMEA分析表.xlsx</span>
                                            </div>
                                            <button class="download-btn">
                                                <span
                                                    ><span><i class="bi bi-download"></i> 下載</span></span
                                                >
                                            </button>
                                        </div>
                                        <button class="add-attachment-btn">
                                            <span><i class="bi bi-paperclip"></i></span>
                                            <span>新增附件</span>
                                        </button>
                                    </div>
                                </div>

                                <div class="info-section">
                                    <div class="section-title">
                                        <span><i class="bi bi-chat"></i></span>
                                        <span>討論 Comment</span>
                                    </div>
                                    <div class="comments-section">
                                        <div class="comment-item">
                                            <div class="comment-header">
                                                <div class="comment-avatar">張</div>
                                                <div>
                                                    <div class="comment-author">張工程師</div>
                                                    <div class="comment-date">2024-01-16 10:30</div>
                                                </div>
                                            </div>
                                            <div class="comment-text">已完成初步設計檔案準備，待客戶審核。</div>
                                        </div>

                                        <div class="comment-item">
                                            <div class="comment-header">
                                                <div class="comment-avatar">王</div>
                                                <div>
                                                    <div class="comment-author">王品質</div>
                                                    <div class="comment-date">2024-01-15 14:45</div>
                                                </div>
                                            </div>
                                            <div class="comment-text">了解，請持續追蹤此問題進度能否在本週完成？</div>
                                        </div>

                                        <div class="comment-input">
                                            <textarea
                                                class="comment-textarea"
                                                placeholder="輸入您的評論..."
                                                data-i18n-placeholder="enterComment"></textarea>
                                            <div class="comment-actions">
                                                <button class="submit-comment-btn">
                                                    <span>發送評論</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="task-sidebar">
                                <div class="sidebar-section">
                                    <div class="sidebar-label">狀態</div>
                                    <div class="sidebar-value">
                                        <span class="task-status-badge status-in-progress">進行中</span>
                                    </div>
                                    <button class="action-btn" style="width: 100%">
                                        <span>變更狀態</span>
                                    </button>
                                </div>

                                <div class="sidebar-section">
                                    <div class="sidebar-label"><span>負責人 (DRI)</span></div>
                                    <div class="assignee-info">
                                        <div class="assignee-avatar">張</div>
                                        <div class="assignee-name">張工程師</div>
                                    </div>
                                    <button class="action-btn" style="width: 100%">
                                        <span>重新分配</span>
                                    </button>
                                </div>

                                <div class="sidebar-section">
                                    <div class="sidebar-label">優先級</div>
                                    <div class="sidebar-value">
                                        <span class="priority-badge priority-high">高</span>
                                    </div>
                                    <button class="action-btn" style="width: 100%">
                                        <span>變更優先級</span>
                                    </button>
                                </div>

                                <div class="sidebar-section">
                                    <div class="sidebar-label">截止日期</div>
                                    <div class="date-display">2024-01-20</div>
                                    <button class="action-btn" style="width: 100%">
                                        <span>調整截止日期</span>
                                    </button>
                                </div>

                                <div class="sidebar-section">
                                    <div class="sidebar-label"><span>xVT 階段</span></div>
                                    <div class="sidebar-value">HVT</div>
                                </div>

                                <div class="sidebar-section">
                                    <div class="sidebar-label"><span>任務類型</span></div>
                                    <div class="sidebar-value">設計</div>
                                </div>
                            </div>
                        </div>

                        <div class="bottom-actions">
                            <button class="secondary-btn" onclick="closePermissionTaskDetail()">
                                <span><i class="bi bi-door-open"></i></span>
                                <span>關閉</span>
                            </button>
                            <button class="primary-btn">
                                <span><i class="bi bi-floppy"></i></span>
                                <span>儲存變更</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="action-buttons-row" style="margin-top: 20px">
                    <button class="primary-btn">
                        <span><i class="bi bi-plus-circle"></i></span>
                        <span>新增使用者</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="/sample-system/js/modules/settings.js"></script>
