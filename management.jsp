<%@ page contentType="text/html;charset=UTF-8" language="java" %> <%@ taglib uri="http://www.springframework.org/tags"
prefix="spring" %>
<div class="component-wrapper fit pb-0 mb-0">
    <div class="projects-header d-flex flex-shrink-0">
        <div class="projects-title">
            <span><i class="bi bi-clipboard-check"></i></span>
            <span><spring:message code="ppapTaskManagement" /></span>
        </div>
    </div>

    <div class="ppap-section flex-shrink-0">
        <div class="section-header component-title">
            <span><i class="bi bi-search"></i></span>
            <span><spring:message code="advancedFilter" /></span>
        </div>
        <div class="filter-grid filter-grid--management">
            <div class="filter-item">
                <label class="filter-label plus ml-1 mb-0"><spring:message code="label.projectName" /></label>
                <input type="text" class="filter-select" id="ppapFilterProject" placeholder="<spring:message code='placeholder.search' />" />
            </div>

            <div class="filter-item">
                <label class="filter-label plus ml-1 mb-0"><spring:message code="projectCustomer" /></label>
                <select class="filter-input" id="projectCustomerSelect">
                    <option value="">--Select--</option>
                    <option value="1">Apollo</option>
                    <option value="2">Rhea</option>
                    <option value="3">Kronos</option>
                </select>
            </div>

            <div class="filter-item">
                <label class="filter-label plus ml-1 mb-0"><spring:message code="label.model" /></label>
                <input id="filter-model" class="filter-input" placeholder="<spring:message code='placeholder.model' />"></input>
            </div>

            <div class="filter-item">
                <label class="filter-label plus ml-1 mb-0"><spring:message code="label.createdBy" /></label>
                <select id="filter-created-by" class="filter-input"></select>
            </div>

            <div class="filter-item">
                <label class="filter-label plus ml-1 mb-0"><spring:message code="status" /></label>
                <select class="filter-input" id="ppapFilterProjectStatus">
                    <option value="">--Select--</option>
                </select>
            </div>

            <div class="filter-item">
                <label class="filter-label plus ml-1 mb-0"><spring:message code="label.createdDate" /></label>
                <input id="filter-created-date" type="text" class="filter-input" />
            </div>
        </div>
        <div class="d-flex justify-content-end">
            <button id="clear_filter_button" type="button" class="btn btn-sm secondary-btn mr-4">
                <i class="bi bi-arrow-repeat"></i> <spring:message code="reset" />
            </button>
            <button id="filter_button" type="button" class="action-btn">
                <i class="bi bi-search"></i> <spring:message code="button.search" />
            </button>
        </div>
    </div>

    <div class="ppap-section mb-0 flex-grow-1 d-flex flex-column overflow-hidden" id="projectListSection">
        <div class="section-header d-flex justify-content-between">
            <div class="component-title">
                <span><i class="bi bi-list-ul"></i></span>
                <span><spring:message code="projectList" /></span>
            </div>
            <button class="primary-btn" id="createProjectBtn" onclick="showCreateProjectForm()">
                <span><i class="bi bi-plus-square"></i></span>
                <span><spring:message code="createNewProject" /></span>
            </button>
        </div>
        <div id="projectListContainer" class="table-box plus">
            <table class="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th><spring:message code="customer" /></th>
                        <th><spring:message code="label.projectName" /></th>
                        <th><spring:message code="label.model" /></th>
                        <th class="pl-3"><spring:message code="status" /></th>
                        <th><spring:message code="label.createdBy" /></th>
                        <th><spring:message code="label.createdAt" /></th>
                        <th><spring:message code="label.approvedBy" /></th>
                        <th><spring:message code="label.approvedAt" /></th>
                        <th><spring:message code="actions" /></th>
                    </tr>
                </thead>
                <tbody id="otherProjectsBody"></tbody>
            </table>
        </div>
    </div>

    <div class="ppap-section" id="operationOptionsSection" style="display: none">
        <div class="section-header">
            <span><i class="bi bi-gear"></i></span>
            <span><spring:message code="operationOptions" /></span>
        </div>
        <div class="action-buttons-row">
            <button class="action-btn" onclick="showStandardPPAP()">
                <span><i class="bi bi-clipboard-check"></i></span>
                <span><span id="size"></span><spring:message code="standard26PPAP" /></span>
            </button>
            <button class="action-btn" onclick="showCustomTask()">
                <span><i class="bi bi-plus-circle"></i></span>
                <span><spring:message code="customTask" /></span>
            </button>
            <button class="action-btn" onclick="showCopyTemplate()">
                <span><i class="bi bi-clipboard-check"></i></span>
                <span><spring:message code="copyProjectTemplate" /></span>
            </button>
        </div>
        <div class="bottom-actions" style="margin-top: 20px">
            <button class="secondary-btn" onclick="cancelProjectCreation()">
                <span><i class="bi bi-x-circle"></i></span>
                <span><spring:message code="cancel" /></span>
            </button>
            <button class="secondary-btn" onclick="showRACIMatrix()">
                <span><i class="bi bi-grid-3x3"></i></span>
                <span><spring:message code="viewRACIMatrix" /></span>
            </button>
            <button class="primary-btn" onclick="submitProject()">
                <span><i class="bi bi-check-circle"></i></span>
                <span><spring:message code="submitProject" /></span>
            </button>
        </div>
    </div>
</div>

<!-- Standard PPAP Modal -->
<div
    id="standardPPAPModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="standardPPAPModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="standardPPAPModalLabel">
                    <span><i class="bi bi-clipboard-check"></i></span>
                    <span><spring:message code="standardPPAPTitle" /></span>
                </div>
                <button type="button" class="btn-close close-btn" data-bs-dismiss="modal" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
                <div class="modal-body" style="min-height: 31.25rem; height: 60vh; overflow: hidden;">
                    <p style="color: var(--text-secondary); margin-bottom: 20px">
                        <span><spring:message code="modal.selectTaskDesc" /></span>
                    </p>
                <div class="ppap-actions d-flex justify-content-between mb-2 ml-3 mr-3">
                    <div class="">
                        <button class="select-all-btn" onclick="selectAllPPAP()">
                            <span><i class="bi bi-check-square"></i> <spring:message code="selectAll" /></span>
                        </button>
                        <button class="deselect-all-btn" onclick="deselectAllPPAP()">
                            <span><i class="bi bi-square"></i> <spring:message code="deselectAll" /></span>
                        </button>
                    </div>
                    <div class="">
                        <input
                            id="filter-standard-ppap"
                            class="filter-input"
                            type="text"
                            placeholder="<spring:message code='placeholder.searchTasks' />" />
                    </div>
                </div>
                <div
                    class="ppap-tasks-grid"
                    id="ppapTasksGrid"
                    style="overflow-y: auto; height: calc(60vh - 7.5rem);">
                    <!-- PPAP tasks will be populated here -->
                </div>
            </div>
            <div class="modal-footer bottom-actions mt-0">
                <button type="button" class="secondary-btn" data-bs-dismiss="modal">
                    <span><i class="bi bi-x-lg"></i></span>
                    <span><spring:message code="cancel" /></span>
                </button>
                <button type="button" class="primary-btn" onclick="confirmPPAPSelection()">
                    <span><i class="bi bi-check-lg"></i></span>
                    <span><spring:message code="confirm" /></span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Project Tasks Modal-->
<div
    id="projectTasksModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="projectTasksModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content" style="max-height: 95vh">
            <div class="modal-header">
                <div class="modal-title" id="projectTasksModalLabel">
                    <span><i class="bi bi-list-task"></i></span>
                    <span><spring:message code="modal.projectTasksTitle" /></span>
                </div>
                <button type="button" class="btn-close close-btn" data-bs-dismiss="modal" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-body" style="height: 70vh; overflow: hidden;">
                <div class="detail-operation-list" style="display: flex; gap: 16px; align-items: flex-start">
                    <div class="detail-block" style="flex: 1; min-width: 220px">
                        <div class="component-title">
                            <span class="d-inline-flex mb-3" style="gap: 0.3rem"
                                ><i class="bi bi-info-circle"></i> <spring:message code="modal.detailsTitle" /></span
                            >
                        </div>
                        <input type="hidden" id="pt_detail_projectId" />

                        <div class="filter-grid">
                            <div class="filter-item">
                                <label class="filter-label mb-0 ml-1" for="pt_detail_customer"><spring:message code="customer" /></label>
                                <input type="text" class="filter-input" id="pt_detail_customer" placeholder="" />
                            </div>

                            <div class="filter-item">
                                <label class="filter-label mb-0 ml-1" for="pt_detail_projectName"><spring:message code="project" /></label>
                                <input type="text" class="filter-input" id="pt_detail_projectName" placeholder="" />
                            </div>

                            <div class="filter-item">
                                <label class="filter-label mb-0 ml-1" for="pt_detail_createdDate"><spring:message code="label.created" /></label>
                                <input type="text" class="filter-input" id="pt_detail_createdDate" />
                            </div>

                            <div class="filter-item">
                                <label class="filter-label mb-0 ml-1"><spring:message code="status" /></label>
                                <input type="text" class="filter-input" id="pt_detail_status" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-end"></div>
                    </div>
                </div>
                <div id="operation-add" class="operation-block">
                    <div class="component-title mb-3">
                        <div class="d-inline-flex" style="gap: 0.3rem">
                            <i class="bi bi-file-earmark-plus"></i> <spring:message code="operationOptions" />
                        </div>
                    </div>
                    <div class="action-buttons-row" style="display: flex; gap: 8px; flex-wrap: wrap">
                        <button class="action-btn" onclick="showStandardPPAP()">
                            <span><i class="bi bi-clipboard-check"></i></span>
                            <span><span id="size-ppap"></span> <spring:message code="standard26PPAP" /></span>
                        </button>
                        <button class="action-btn" onclick="showCustomTask()">
                            <span><i class="bi bi-plus-circle"></i></span>
                            <span><spring:message code="customTask" /></span>
                        </button>
                        <button id="copy-template" class="action-btn" onclick="showCopyTemplate()">
                            <span><i class="bi bi-clipboard-check"></i></span>
                            <span><spring:message code="copyProjectTemplate" /></span>
                        </button>
                    </div>
                </div>
                <div class="component-title mt-3 d-flex justify-content-between align-items-center">
                    <span class="d-inline-flex" style="gap: 0.3rem"><i class="bi bi-list-task"></i> <spring:message code="modal.tasksListTitle" /> </span>
                    <input id="search-task" class="filter-input" type="text" placeholder="<spring:message code='placeholder.search' />" />
                </div>
                <div id="projectTasksContent" style="padding-bottom: 8rem; height: calc(70vh - 12rem); overflow-y: auto"></div>
            </div>
            <div class="modal-footer bottom-actions mt-0">
                <button type="button" class="secondary-btn" data-bs-dismiss="modal">
                    <span><i class="bi bi-x-lg"></i></span>
                    <span><spring:message code="close" /></span>
                </button>
                <button
                    id="showRaciFromProjectBtn"
                    class="action-btn"
                    onclick="showRACIMatrixFromProject()">
                    <i class="bi bi-bar-chart-line"></i> <spring:message code="button.showRaci" />
                </button>
                <button class="action-btn" onclick="saveProjectTaskQuantity()">
                    <i class="bi bi-floppy"></i> <spring:message code="save" />
                </button>
                <button class="action-btn" onclick="projectTasksSubmit()">
                    <i class="bi bi-check-circle"></i> <spring:message code="submit" />
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Custom Task Modal -->
<div id="customTaskModal" class="modal fade" tabindex="-1" aria-labelledby="customTaskModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content modal-content-wide">
            <div class="modal-header">
                <div class="modal-title" id="customTaskModalLabel">
                    <span><i class="bi bi-plus-circle"></i></span>
                    <span><spring:message code="modal.addCustomTaskTitle" /></span>
                </div>
                <button type="button" class="btn-close close-btn" data-bs-dismiss="modal" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="project-form-grid">
                    <div class="form-group">
                        <label class="form-label"><spring:message code="label.taskName" /> <span class="required">*</span></label>
                        <input id="custom-task-name" type="text" class="form-input" placeholder="" />
                    </div>
                    <!-- <div class="form-group d-none">
                        <label class="form-label">Department ID<span class="required">*</span></label>
                        <input id="custom-task-id" type="text" class="form-input" placeholder="" />
                    </div> -->
                    <div class="form-group">
                        <label class="form-label"><spring:message code="label.xvt" /> <span class="required">*</span></label>
                        <select id="custom-sl-xvt" class="form-select"></select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Department <span class="required">*</span></label>
                        <select id="custom-sl-department" class="form-select"></select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Process <span class="required">*</span></label>
                        <select id="custom-sl-process" class="form-select"></select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Priority <span class="required">*</span></label>
                        <select id="custom-sl-priority" class="form-select"></select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">DRI <span class="required">*</span></label>
                        <select id="custom-dri" class="form-select"></select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Deadline <span class="required">*</span></label>
                        <input id="custom-deadline" type="date" class="form-input" />
                    </div>
                    <div class="form-group" style="grid-column: 1 / -1">
                        <label class="form-label"><spring:message code="label.taskDescription" /></label>
                        <textarea
                            id="custom-task-description"
                            class="form-input"
                            style="min-height: 80px; resize: vertical"
                            placeholder="<spring:message code='placeholder.taskDescription' />"></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer bottom-actions mt-0">
                <button type="button" class="secondary-btn" data-bs-dismiss="modal">
                    <span><i class="bi bi-x-lg"></i></span>
                    <span><spring:message code="cancel" /></span>
                </button>
                <button id="add-custom" type="button" class="primary-btn">
                    <span><i class="bi bi-check-lg"></i></span>
                    <span><spring:message code="addTask" /></span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Copy Template Modal -->
<div
    id="copyTemplateModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="copyTemplateModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content modal-content-wide">
            <div class="modal-header">
                <div class="modal-title">
                    <span><i class="bi bi-clipboard-check"></i></span>
                    <span><spring:message code="modal.copyTemplateTitle" /></span>
                </div>
                <button type="button" class="btn-close close-btn" data-bs-dismiss="modal" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-body">
                <p style="color: var(--text-secondary); margin-bottom: 20px">
                    <spring:message code="modal.copyTemplateDesc" />
                </p>
                <div class="info-section" style="margin-bottom: 20px">
                    <div class="section-title">
                        <span><i class="bi bi-box-arrow-up"></i></span>
                        <span><spring:message code="modal.sourceProject" /></span>
                    </div>
                    <div class="project-form-grid">
                        <div class="form-group">
                            <label class="form-label"
                                ><span><spring:message code="label.sourceCustomer" /></span> <span class="required">*</span></label
                            >
                            <select class="form-select" id="source-customer">
                                <option value="">Please select</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label"
                                ><span><spring:message code="label.sourceProjectNumber" /></span> <span class="required">*</span></label
                            >
                            <select class="form-select" id="source-project-number">
                                <option value="">Please select</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label"
                                ><span><spring:message code="label.sourceXvtStage" /></span> <span class="required">*</span></label
                            >
                            <select class="form-select" id="source-xvt-stage">
                                <option value="">Please select</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label"
                                ><span><spring:message code="label.sourceProcess" /></span> <span class="required">*</span></label
                            >
                            <select class="form-select" id="source-process">
                                <option value="">Please select</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="info-section">
                    <div class="section-title">
                        <span><i class="bi bi-box-arrow-in-down"></i></span>
                        <span><spring:message code="modal.targetProject" /></span>
                    </div>
                    <div class="project-form-grid">
                        <div class="form-group">
                            <label class="form-label"
                                ><span><spring:message code="label.targetCustomer" /></span> <span class="required">*</span></label
                            >
                            <select class="form-select" id="target-customer">
                                <option value="">Please select</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label"
                                ><span><spring:message code="label.targetProjectNumber" /></span> <span class="required">*</span></label
                            >
                            <select class="form-select" id="target-project-number">
                                <option value="">Please select</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label"
                                ><span><spring:message code="label.targetXvtStage" /></span> <span class="required">*</span></label
                            >
                            <select class="form-select" id="target-xvt-stage">
                                <option value="">Please select</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label"
                                ><span><spring:message code="label.targetProcess" /></span> <span class="required">*</span></label
                            >
                            <select class="form-select" id="target-process">
                                <option value="">Please select</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer bottom-actions mt-0">
                <button type="button" class="secondary-btn" data-bs-dismiss="modal">
                    <span><i class="bi bi-x-lg"></i></span>
                    <span><spring:message code="cancel" /></span>
                </button>
                <button type="button" class="primary-btn" onclick="confirmCopyProject()">
                    <span><i class="bi bi-check-lg"></i></span>
                    <span><spring:message code="confirmCopy" /></span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- RACI Matrix Modal -->
<div id="raciMatrixModal" class="modal fade" tabindex="-1" aria-labelledby="raciMatrixModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content modal-content-large">
            <div class="modal-header">
                <h5 class="modal-title" id="raciMatrixModalLabel">
                    <span><i class="bi bi-bar-chart-line"></i></span>
                    <span><spring:message code="raciMatrixTitle" /></span>
                </h5>
                    <button type="button" class="btn-close close-btn" data-bs-dismiss="modal" aria-label="Close">
                        <i class="bi bi-x-lg"></i>
                    </button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px">
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px">
                        <div
                            style="
                                background: rgba(76, 175, 80, 0.1);
                                padding: 15px;
                                border-radius: 8px;
                                border: 1px solid var(--accent-green);
                            ">
                            <h3 style="color: var(--accent-green); margin-bottom: 8px"><spring:message code="label.raciResponsible" /></h3>
                            <p style="font-size: 13px; color: var(--text-secondary)"><spring:message code="label.raciResponsibleDesc" /></p>
                        </div>
                        <div
                            style="
                                background: rgba(33, 150, 243, 0.1);
                                padding: 15px;
                                border-radius: 8px;
                                border: 1px solid var(--accent-blue);
                            ">
                            <h3 style="color: var(--accent-blue); margin-bottom: 8px"><spring:message code="label.raciAccountable" /></h3>
                            <p style="font-size: 13px; color: var(--text-secondary)"><spring:message code="label.raciAccountableDesc" /></p>
                        </div>
                        <div
                            style="
                                background: rgba(255, 152, 0, 0.1);
                                padding: 15px;
                                border-radius: 8px;
                                border: 1px solid var(--accent-orange);
                            ">
                            <h3 style="color: var(--accent-orange); margin-bottom: 8px"><spring:message code="label.raciConsulted" /></h3>
                            <p style="font-size: 13px; color: var(--text-secondary)"><spring:message code="label.raciConsultedDesc" /></p>
                        </div>
                        <div
                            style="
                                background: rgba(33, 150, 243, 0.1);
                                padding: 15px;
                                border-radius: 8px;
                                border: 1px solid var(--accent-blue);
                            ">
                            <h3 style="color: var(--accent-blue); margin-bottom: 8px"><spring:message code="label.raciInformed" /></h3>
                            <p style="font-size: 13px; color: var(--text-secondary)"><spring:message code="label.raciInformedDesc" /></p>
                        </div>
                    </div>
                </div>

                <div style="overflow-x: auto">
                    <table class="raci-matrix-table">
                        <thead>
                            <tr>
                                <th style="min-width: 150px"><spring:message code="label.task" /></th>
                            </tr>
                        </thead>
                        <tbody id="raciMatrixBody"></tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer bottom-actions mt-0" style="justify-content: end">
                <button type="button" class="secondary-btn" data-bs-dismiss="modal">
                    <span><i class="bi bi-x-lg"></i></span>
                    <span><spring:message code="close" /></span>
                </button>
                <button type="button" class="btn action-btn" onclick="saveRACIMatrix()">
                    <span><i class="bi bi-floppy"></i></span>
                    <span><spring:message code="save" /></span>
                </button>
            </div>
        </div>
    </div>
</div>

<div id="taskDetailModal" class="modal fade" tabindex="-1" aria-labelledby="taskDetailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content modal-content-large">
            <!-- Modal Header -->
            <div class="modal-header task-detail-header mb-0">
                <div class="task-detail-title-section">
                    <div class="task-detail-id"></div>
                    <div class="task-detail-name"></div>
                </div>
                <div style="display: flex; align-items: center; gap: 15px">
                    <div class="task-action-buttons">
                        <button class="task-action-btn follow-btn" onclick="toggleFollow()">
                            <span><i class="bi bi-star"></i></span>
                            <span><spring:message code="follow" /></span>
                        </button>
                        <button class="task-action-btn reminder-btn" onclick="setReminder()">
                            <span><i class="bi bi-alarm"></i></span>
                            <span><spring:message code="reminder" /></span>
                        </button>
                        <button class="task-action-btn escalation-btn" onclick="escalateTask()">
                            <span><i class="bi bi-bell-fill"></i></span>
                            <span><spring:message code="escalation" /></span>
                        </button>
                        <button class="task-action-btn reassign-btn" onclick="reassignTask()">
                            <span><i class="bi bi-person"></i></span>
                            <span><spring:message code="reassignTask" /></span>
                        </button>
                    </div>
                    <button type="button" class="btn-close close-btn" data-bs-dismiss="modal" aria-label="Close">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>

            <!-- Modal Body -->
            <div class="modal-body task-detail-body">
                <div class="task-main-info">
                    <div class="info-section">
                        <div class="section-title">
                            <span><i class="bi bi-pencil-square"></i></span>
                            <span><spring:message code="taskDescriptionTitle" /></span>
                        </div>
                        <div class="section-content"></div>
                    </div>

                    <div class="info-section">
                        <div class="section-title">
                            <span><i class="bi bi-paperclip"></i></span>
                            <span><spring:message code="attachments" /></span>
                        </div>
                        <div id="attachments-list" class="attachments-list"></div>
                        <div class="d-flex mt-3 justify-content-end">
                            <button id="upload" class="add-attachment-btn">
                                <span><i class="bi bi-paperclip"></i></span>
                                <span><spring:message code="addAttachment" /></span>
                            </button>
                        </div>
                    </div>

                    <div class="info-section">
                        <div class="section-title">
                            <span><i class="bi bi-chat"></i></span>
                            <span><spring:message code="actions" /></span>
                        </div>
                        <div class="comment-input mb-3">
                            <textarea
                                id="input-comment"
                                class="comment-textarea"
                                placeholder="<spring:message code='placeholder.enterComment' />"></textarea>
                            <div class="comment-actions">
                                <button id="comment" class="submit-comment-btn">
                                    <spring:message code="button.sendComment" />
                                </button>
                            </div>
                        </div>
                        <div id="comment-container" class="comments-section"></div>
                    </div>
                </div>

                <div class="task-sidebar">
                    <div class="sidebar-section d-flex flex-column">
                        <span class="sidebar-label"><spring:message code="status" /></span>
                        <select id="sl-status" class="filter-input"></select>
                    </div>

                    <div class="sidebar-section d-flex flex-column">
                        <span class="sidebar-label"><spring:message code="dri" /></span>
                        <select id="dri" class="filter-input"></select>
                    </div>

                    <div class="sidebar-section d-flex flex-column">
                        <span class="sidebar-label"><spring:message code="priority" /></span>
                        <select id="sl-priority" class="filter-input"></select>
                    </div>

                    <div class="sidebar-section d-flex flex-column">
                        <span class="sidebar-label"><spring:message code="deadline" /></span>
                        <input id="deadLine" type="text" class="filter-input" />
                    </div>

                    <div class="sidebar-section d-flex flex-column">
                        <span class="sidebar-label"><spring:message code="xvtStage" /></span>
                        <select id="sl-xvt" class="filter-input"></select>
                    </div>

                    <div class="sidebar-section d-flex flex-column">
                        <span class="sidebar-label"><spring:message code="label.type" /></span>
                        <select id="sl-type" class="filter-input"></select>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer bottom-actions mt-0">
                <button type="button" class="secondary-btn" data-bs-dismiss="modal">
                    <span><i class="bi bi-door-open"></i></span>
                    <span><spring:message code="close" /></span>
                </button>
                <button type="button" class="secondary-btn js-task-reject d-none">
                    <span><i class="bi bi-x-circle"></i></span>
                    <span><spring:message code="reject" /></span>
                </button>
                <button type="button" class="primary-btn js-task-approve d-none">
                    <span><i class="bi bi-check-circle"></i></span>
                    <span><spring:message code="approve" /></span>
                </button>
                <button type="button" class="primary-btn js-task-save" onclick="saveTaskDetailChanges()">
                    <span><i class="bi bi-floppy"></i></span>
                    <span><spring:message code="saveChanges" /></span>
                </button>
                <button type="button" class="primary-btn js-task-submit d-none">
                    <span><i class="bi bi-send"></i></span>
                    <span><spring:message code="submit" /></span>
                </button>
            </div>
        </div>
    </div>
</div>

<div
    id="createProjectModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="createProjectModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content modal-content-large">
            <div class="modal-header">
                <h5 class="modal-title" id="createProjectModalLabel">
                    <span><i class="bi bi-plus-square"></i></span>
                    <span><spring:message code="createNewProject" /></span>
                    <span
                        id="createProjectModalMeta"
                        style="
                            margin-left: 12px;
                            color: inherit;
                            font-size: inherit;
                            font-weight: inherit;
                            display: none;
                        "></span>
                </h5>
                <button type="button" class="btn-close close-btn" data-bs-dismiss="modal" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-body">
                <!-- Step 1: Basic Create Form -->
                <div id="createProjectStep1">
                    <div class="project-form-grid">
                        <div class="form-group">
                            <label class="form-label">
                                <spring:message code="customer" /> <span class="required">*</span>
                            </label>
                            <select class="form-select" id="newProjectCustomer">
                                <option value=""><spring:message code="pleaseSelect" /></option>
                                <option value="1">Apollo</option>
                                <option value="2">Rhea</option>
                                <option value="3">Kronos</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">
                                <spring:message code="projectName" /> <span class="required">*</span>
                            </label>
                            <input type="text" class="form-input" id="newProjectName" placeholder="<spring:message code='placeholder.exampleProjectNumber' />" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">
                                Product <span class="required">*</span>
                            </label>
                            <input type="text" class="form-input" id="newProjectProduct" placeholder="Enter Product" />
                        </div>
                    </div>
                </div>

                <!-- Step 2: Operation Options + Selected Tasks -->
                <div id="createProjectStep2" style="display: none">
                    <div class="ppap-section" style="margin-bottom: 10px">
                        <div class="section-header">
                            <span><i class="bi bi-gear"></i></span>
                            <span><spring:message code="operationOptions" /></span>
                        </div>
                        <div class="action-buttons-row">
                            <button id="standard-ppap" class="action-btn" onclick="showStandardPPAP()">
                                <span><i class="bi bi-clipboard-check"></i></span>
                                <span><spring:message code="standard26PPAP" /></span>
                            </button>
                            <button class="action-btn" onclick="showCustomTask()">
                                <span><i class="bi bi-plus-circle"></i></span>
                                <span><spring:message code="customTask" /></span>
                            </button>
                            <button class="action-btn" onclick="showCopyTemplate()">
                                <span><i class="bi bi-clipboard-check"></i></span>
                                <span><spring:message code="copyProjectTemplate" /></span>
                            </button>
                        </div>
                    </div>

                    <div class="ppap-section">
                        <div class="section-header">
                            <span><i class="bi bi-list-ul"></i></span>
                            <span><spring:message code="modal.selectedTasks" /></span>
                        </div>
                        <div
                            id="selectedTasksList"
                            class="table"
                            style="
                                width: 100%;
                                min-height: 120px;
                                border: 1px solid var(--border);
                                padding: 12px;
                                border-radius: 6px;
                            ">
                            <div style="color: var(--text-secondary)"><spring:message code="modal.noTasksSelected" /></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer bottom-actions mt-0">
                <button type="button" class="secondary-btn" data-bs-dismiss="modal" onclick="closeCreateProjectModal()">
                    <span><i class="bi bi-x-lg"></i></span>
                    <span><spring:message code="cancel" /></span>
                </button>
                <button
                    type="button"
                    class="secondary-btn"
                    id="createBackBtn"
                    style="display: none"
                    onclick="createModalBackToStep1()">
                    <span><i class="bi bi-arrow-left"></i></span>
                    <span><spring:message code="cancel" /></span>
                </button>
                <button type="button" class="primary-btn" id="createNextBtn" onclick="saveProjectBasicInfoModal()">
                    <span><i class="bi bi-floppy"></i></span>
                    <span id="save-info"><spring:message code="save" /></span>
                </button>
                <button
                    type="button"
                    class="primary-btn"
                    id="createSaveBtn"
                    style="display: none"
                    onclick="submitProjectFromModal()">
                    <span><i class="bi bi-check-circle"></i></span>
                    <span><spring:message code="save" /></span>
                </button>
            </div>
        </div>
    </div>
</div>
<script src="/sample-system/js/modules/ppap_management.js"></script>
