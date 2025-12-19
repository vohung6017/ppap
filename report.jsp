<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<div class="component-wrapper fit">
        <div class="projects-header">
            <div class="projects-title">
                <span><i class="bi bi-bar-chart-line"></i></span>
                <span><spring:message code="reportCenter" /></span>
            </div>
        </div>

        <!-- Report Filter Section -->
        <div class="ppap-section">
            <div class="section-header">
                <span><i class="bi bi-search"></i></span>
                <span><spring:message code="reportFilter" /></span>
            </div>
            <div class="filter-grid">
                <div class="filter-item">
                    <label class="filter-label"><spring:message code="customer" /></label>
                    <select class="filter-select">
                        <option value=""><spring:message code="all" /></option>
                        <option value="Apollo">Apollo</option>
                        <option value="Rhea">Rhea</option>
                    </select>
                </div>
                <div class="filter-item">
                    <label class="filter-label"><spring:message code="projectNumber" /></label>
                    <select class="filter-select">
                        <option value=""><spring:message code="all" /></option>
                        <option value="FTV-001">FTV-001</option>
                        <option value="FTV-002">FTV-002</option>
                    </select>
                </div>
                <div class="filter-item">
                    <label class="filter-label"><spring:message code="department" /></label>
                    <select class="filter-select">
                        <option value=""><spring:message code="all" /></option>
                        <option value="PQE">PQE</option>
                        <option value="RD">RD</option>
                    </select>
                </div>
                <div class="filter-item">
                    <label class="filter-label"><spring:message code="process" /></label>
                    <select class="filter-select">
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
                    <label class="filter-label"><spring:message code="dateFrom" /></label>
                    <input type="date" class="filter-input" />
                </div>
                <div class="filter-item">
                    <label class="filter-label"><spring:message code="dateTo" /></label>
                    <input type="date" class="filter-input" />
                </div>
            </div>
            <div class="action-buttons-row">
                <button class="action-btn">
                    <span><i class="bi bi-bar-chart-line"></i></span>
                    <span><spring:message code="exportExcel" /></span>
                </button>
                <button class="action-btn">
                    <span><i class="bi bi-pencil-square"></i></span>
                    <span><spring:message code="exportWord" /></span>
                </button>
                <button class="action-btn">
                    <span><i class="bi bi-file-earmark-slides"></i></span>
                    <span><spring:message code="exportPowerPoint" /></span>
                </button>
                <button class="action-btn">
                    <span><i class="bi bi-file-earmark"></i></span>
                    <span><spring:message code="exportPDF" /></span>
                </button>
            </div>
        </div>

        <!-- Report Tabs -->
        <div class="report-tabs">
            <button class="report-tab active" onclick="switchReportTab('overview')"><span><spring:message code="projectProgressReport" /></span></button>
            <button class="report-tab" onclick="switchReportTab('tasks')"><span><spring:message code="overdueTaskReport" /></span></button>
            <button class="report-tab" onclick="switchReportTab('waiting')"><span><spring:message code="pendingTaskReport" /></span></button>
            <button class="report-tab" onclick="switchReportTab('dri')"><span><spring:message code="driWorkloadReport" /></span></button>
            <button class="report-tab" onclick="switchReportTab('ppap')"><span><spring:message code="ppapSummaryReport" /></span></button>
        </div>

        <!-- Report Content -->

        <!-- 專案進度報告 -->
        <div id="reportOverview" class="report-content active">
            <table class="report-table">
                <thead>
                    <tr>
                        <th style="width: 50px">
                            <input
                                type="checkbox"
                                class="report-checkbox-all"
                                onclick="toggleAllReportCheckboxes('reportOverview')"
                            />
                        </th>
                        <th style="width: 12%">專案</th>
                        <th style="width: 10%">客戶</th>
                        <th style="width: 15%">產品</th>
                        <th style="width: 10%">xVT進度</th>
                        <th style="width: 10%">進行中</th>
                        <th style="width: 10%">待處理</th>
                        <th style="width: 10%">已完成</th>
                        <th style="width: 10%">逾期</th>
                        <th style="width: 13%">整體狀態</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="text-align: center"><input type="checkbox" class="report-checkbox" /></td>
                        <td class="task-id-cell">FTV-001</td>
                        <td>Apple</td>
                        <td>MacBook Pro</td>
                        <td><span class="priority-badge priority-high">85%</span></td>
                        <td>8</td>
                        <td>3</td>
                        <td>110</td>
                        <td>0</td>
                        <td><span class="task-status-badge status-in-progress">進行中</span></td>
                    </tr>
                    <tr>
                        <td style="text-align: center"><input type="checkbox" class="report-checkbox" /></td>
                        <td class="task-id-cell">FTV-002</td>
                        <td>Samsung</td>
                        <td>Galaxy Tab</td>
                        <td><span class="priority-badge priority-medium">72%</span></td>
                        <td>12</td>
                        <td>5</td>
                        <td>95</td>
                        <td>1</td>
                        <td><span class="task-status-badge status-in-progress">進行中</span></td>
                    </tr>
                    <tr>
                        <td style="text-align: center"><input type="checkbox" class="report-checkbox" /></td>
                        <td class="task-id-cell">FTV-003</td>
                        <td>Google</td>
                        <td>Pixel Watch</td>
                        <td><span class="priority-badge priority-low">58%</span></td>
                        <td>15</td>
                        <td>7</td>
                        <td>76</td>
                        <td>2</td>
                        <td><span class="task-status-badge status-in-progress">進行中</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 逾期任務報告 -->
        <div id="reportTasks" class="report-content">
            <table class="report-table">
                <thead>
                    <tr>
                        <th style="width: 50px">
                            <input
                                type="checkbox"
                                class="report-checkbox-all"
                                onclick="toggleAllReportCheckboxes('reportTasks')"
                            />
                        </th>
                        <th style="width: 12%">任務ID</th>
                        <th style="width: 18%">任務名稱</th>
                        <th style="width: 10%">專案</th>
                        <th style="width: 8%">階段</th>
                        <th style="width: 10%">DRI</th>
                        <th style="width: 12%">截止日期</th>
                        <th style="width: 10%">逾期天數</th>
                        <th style="width: 10%">優先級</th>
                        <th style="width: 10%">風險等級</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="text-align: center"><input type="checkbox" class="report-checkbox" /></td>
                        <td class="task-id-cell">PPAP-003</td>
                        <td>客戶工程核准</td>
                        <td>FTV-001</td>
                        <td>EVT</td>
                        <td>李經理</td>
                        <td>2024-01-15</td>
                        <td><span class="priority-badge priority-high">10天</span></td>
                        <td><span class="priority-badge priority-high">高</span></td>
                        <td><span class="task-status-badge status-overdue">嚴重</span></td>
                    </tr>
                    <tr>
                        <td style="text-align: center"><input type="checkbox" class="report-checkbox" /></td>
                        <td class="task-id-cell">PPAP-007</td>
                        <td>控制計劃</td>
                        <td>FTV-001</td>
                        <td>PVT</td>
                        <td>張工程師</td>
                        <td>2024-01-18</td>
                        <td><span class="priority-badge priority-medium">7天</span></td>
                        <td><span class="priority-badge priority-high">高</span></td>
                        <td><span class="task-status-badge status-overdue">中度</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 待辦任務報告 -->
        <div id="reportWaiting" class="report-content">
            <table class="report-table">
                <thead>
                    <tr>
                        <th style="width: 50px">
                            <input
                                type="checkbox"
                                class="report-checkbox-all"
                                onclick="toggleAllReportCheckboxes('reportWaiting')"
                            />
                        </th>
                        <th style="width: 12%">任務ID</th>
                        <th style="width: 18%">任務名稱</th>
                        <th style="width: 10%">專案</th>
                        <th style="width: 8%">階段</th>
                        <th style="width: 10%">DRI</th>
                        <th style="width: 12%">截止日期</th>
                        <th style="width: 10%">剩餘天數</th>
                        <th style="width: 10%">優先級</th>
                        <th style="width: 10%">狀態</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="text-align: center"><input type="checkbox" class="report-checkbox" /></td>
                        <td class="task-id-cell">PPAP-005</td>
                        <td>製程流程圖</td>
                        <td>FTV-001</td>
                        <td>HVT</td>
                        <td>林製程</td>
                        <td>2024-01-28</td>
                        <td><span class="priority-badge priority-low">3天</span></td>
                        <td><span class="priority-badge priority-high">高</span></td>
                        <td><span class="task-status-badge status-pending">待處理</span></td>
                    </tr>
                    <tr>
                        <td style="text-align: center"><input type="checkbox" class="report-checkbox" /></td>
                        <td class="task-id-cell">PPAP-008</td>
                        <td>量測系統分析</td>
                        <td>FTV-002</td>
                        <td>EVT</td>
                        <td>王品質</td>
                        <td>2024-01-30</td>
                        <td><span class="priority-badge priority-medium">5天</span></td>
                        <td><span class="priority-badge priority-medium">中</span></td>
                        <td><span class="task-status-badge status-pending">待處理</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="reportDri" class="report-content">
            <table class="report-table">
                <thead>
                    <tr>
                        <th style="width: 50px">
                            <input
                                type="checkbox"
                                class="permission-checkbox-all"
                                onclick="toggleAllPermissionCheckboxes()"
                            />
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
                        <td><input type="checkbox" checked /></td>
                        <td><input type="checkbox" checked /></td>
                        <td><input type="checkbox" /></td>
                        <td><input type="checkbox" /></td>
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
                        <td><input type="checkbox" checked /></td>
                        <td><input type="checkbox" checked /></td>
                        <td><input type="checkbox" /></td>
                        <td><input type="checkbox" /></td>
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
                        <td><input type="checkbox" checked /></td>
                        <td><input type="checkbox" checked /></td>
                        <td><input type="checkbox" checked /></td>
                        <td><input type="checkbox" checked /></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- PPAP彙整報告 -->
        <div id="reportPpap" class="report-content">
            <table class="report-table">
                <thead>
                    <tr>
                        <th style="width: 50px">
                            <input
                                type="checkbox"
                                class="report-checkbox-all"
                                onclick="toggleAllReportCheckboxes('reportPpap')"
                            />
                        </th>
                        <th style="width: 10%">PPAP項目</th>
                        <th style="width: 16%">項目名稱</th>
                        <th style="width: 9%">FTV-001</th>
                        <th style="width: 9%">FTV-002</th>
                        <th style="width: 9%">FTV-003</th>
                        <th style="width: 9%">FTV-004</th>
                        <th style="width: 9%">FTV-005</th>
                        <th style="width: 10%">完成數/總數</th>
                        <th style="width: 9%">完成率</th>
                        <th style="width: 10%">整體狀態</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="text-align: center"><input type="checkbox" class="report-checkbox" /></td>
                        <td class="task-id-cell">PPAP-001</td>
                        <td>設計記錄</td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td><span class="task-status-badge status-in-progress">○</span></td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td>4/5</td>
                        <td><span class="priority-badge priority-high">80%</span></td>
                        <td><span class="task-status-badge status-in-progress">進行中</span></td>
                    </tr>
                    <tr>
                        <td style="text-align: center"><input type="checkbox" class="report-checkbox" /></td>
                        <td class="task-id-cell">PPAP-005</td>
                        <td>製程流程圖</td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td><span class="task-status-badge status-pending">×</span></td>
                        <td><span class="task-status-badge status-in-progress">○</span></td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td>3/5</td>
                        <td><span class="priority-badge priority-medium">60%</span></td>
                        <td><span class="task-status-badge status-in-progress">進行中</span></td>
                    </tr>
                    <tr>
                        <td style="text-align: center"><input type="checkbox" class="report-checkbox" /></td>
                        <td class="task-id-cell">PPAP-007</td>
                        <td>控制計劃</td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td>5/5</td>
                        <td><span class="priority-badge priority-high">100%</span></td>
                        <td><span class="task-status-badge status-completed">完成</span></td>
                    </tr>
                    <tr>
                        <td style="text-align: center"><input type="checkbox" class="report-checkbox" /></td>
                        <td class="task-id-cell">PPAP-011</td>
                        <td>初始過程研究</td>
                        <td><span class="task-status-badge status-in-progress">○</span></td>
                        <td><span class="task-status-badge status-pending">×</span></td>
                        <td><span class="task-status-badge status-pending">×</span></td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td><span class="task-status-badge status-in-progress">○</span></td>
                        <td>1/5</td>
                        <td><span class="priority-badge priority-low">20%</span></td>
                        <td><span class="task-status-badge status-pending">待開始</span></td>
                    </tr>
                    <tr>
                        <td style="text-align: center"><input type="checkbox" class="report-checkbox" /></td>
                        <td class="task-id-cell">PPAP-018</td>
                        <td>PSW</td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td><span class="task-status-badge status-in-progress">○</span></td>
                        <td><span class="task-status-badge status-pending">×</span></td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td>3/5</td>
                        <td><span class="priority-badge priority-medium">60%</span></td>
                        <td><span class="task-status-badge status-in-progress">進行中</span></td>
                    </tr>
                    <tr>
                        <td style="text-align: center"><input type="checkbox" class="report-checkbox" /></td>
                        <td class="task-id-cell">PPAP-026</td>
                        <td>緊急應變計劃</td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td><span class="task-status-badge status-in-progress">○</span></td>
                        <td>
                            <span class="task-status-badge status-completed"><i class="bi bi-check-lg"></i></span>
                        </td>
                        <td><span class="task-status-badge status-pending">×</span></td>
                        <td>3/5</td>
                        <td><span class="priority-badge priority-medium">60%</span></td>
                        <td><span class="task-status-badge status-in-progress">進行中</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
</div>

<script src="/sample-system/js/modules/report.js"></script>
