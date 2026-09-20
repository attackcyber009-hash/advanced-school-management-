/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  UserRole,
  ActiveNavTab,
  Student,
  FeeVoucher,
  StudentMarkEntry,
  ExpenseRecord,
  AdmissionInquiry,
  StudyMaterial,
  InventoryProduct,
  ClassInfo,
  CampusBranch,
  SystemUser,
  AuditLogEntry,
  AcademicSession,
  SecurityPolicyConfig,
  TimetablePeriod,
  TeacherSubstitution,
  SubjectAllotment,
  DailyDiary,
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_STAFF,
  INITIAL_VOUCHERS,
  INITIAL_EXPENSES,
  INITIAL_MARKS,
  INITIAL_INQUIRIES,
  INITIAL_STUDY_MATERIALS,
  INITIAL_INVENTORY,
  INITIAL_CLASSES,
  INITIAL_USERS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTICES,
  INITIAL_CAMPUSES,
  INITIAL_SYSTEM_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SESSIONS,
  INITIAL_SECURITY_POLICY,
  INITIAL_SUBJECTS,
  INITIAL_TIMETABLE,
  INITIAL_SUBSTITUTIONS,
  INITIAL_DIARIES,
} from './data/mockData';

import LoginScreen from './components/LoginScreen';
import TopHeader from './components/TopHeader';
import SidebarNavigation from './components/SidebarNavigation';
import QuickActionRibbon from './components/QuickActionRibbon';
import DashboardView from './components/DashboardView';
import AdmissionsView from './components/AdmissionsView';
import StudentManagementView from './components/StudentManagementView';
import IDCardPrintingView from './components/IDCardPrintingView';
import AttendanceView from './components/AttendanceView';
import FeeManagementView from './components/FeeManagementView';
import ExamManagementView from './components/ExamManagementView';
import TeacherPortalView from './components/TeacherPortalView';
import ParentPortalView from './components/ParentPortalView';
import AcademicOperationsView from './components/AcademicOperationsView';
import Phase1AdministrationView from './components/Phase1AdministrationView';
import PrintModal from './components/PrintModal';
import TimetableSubstitutionEngine from './components/TimetableSubstitutionEngine';
import ClassSubjectManagementView from './components/ClassSubjectManagementView';
import DailyDiaryHomeworkLmsView from './components/DailyDiaryHomeworkLmsView';
import PayrollManagementView from './components/PayrollManagementView';
import AccountsExpenseLedgerView from './components/AccountsExpenseLedgerView';
import CampusPosStoreView from './components/CampusPosStoreView';
import CertificatesSlipsView from './components/CertificatesSlipsView';
import TransportManagementView from './components/TransportManagementView';
import CommunicationsHubView from './components/CommunicationsHubView';
import LibraryManagementView from './components/LibraryManagementView';
import VisitorGateSecurityView from './components/VisitorGateSecurityView';
import HostelBoardingView from './components/HostelBoardingView';
import ExecutiveAnalyticsBiView from './components/ExecutiveAnalyticsBiView';
import SportsHousesView from './components/SportsHousesView';
import InfirmaryHealthView from './components/InfirmaryHealthView';
import LabAssetsInventoryView from './components/LabAssetsInventoryView';
import ExamPaperGeneratorView from './components/ExamPaperGeneratorView';
import AdmissionMeritAssessmentView from './components/AdmissionMeritAssessmentView';
import TeacherCpdLessonPlanView from './components/TeacherCpdLessonPlanView';
import PtmSchedulerFeedbackView from './components/PtmSchedulerFeedbackView';
import AlumniUniversityPlacementView from './components/AlumniUniversityPlacementView';
import DigitalLmsQuizVaultView from './components/DigitalLmsQuizVaultView';
import SportsOlympiadTournamentView from './components/SportsOlympiadTournamentView';
import BudgetProcurementErpView from './components/BudgetProcurementErpView';
import ExecutiveBiCommandCenterView from './components/ExecutiveBiCommandCenterView';
import BroadcastGatewayView from './components/BroadcastGatewayView';
import ParentHelpdeskView from './components/ParentHelpdeskView';
import MasterTimetableEngineView from './components/MasterTimetableEngineView';
import FacilityFleetMaintenanceView from './components/FacilityFleetMaintenanceView';
import HostelCafeteriaInventoryView from './components/HostelCafeteriaInventoryView';
import AIQuestionBankEngineView from './components/AIQuestionBankEngineView';
import LocalizationPortalView from './components/LocalizationPortalView';

export default function App() {
  // Authentication & Session State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('super_admin');
  const [selectedCampus, setSelectedCampus] = useState('Main Campus (Model Town)');
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');

  // Collapsible Sidebar & Mobile Drawer State with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('school_app_sidebar_collapsed');
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Admission Subtab & Action State
  const [admissionsSubTab, setAdmissionsSubTab] = useState<'admit' | 'inquiries' | 'bulk' | 'requests'>('admit');
  const [admissionsAction, setAdmissionsAction] = useState<string | null>(null);

  // Student Subtab / Action State
  const [studentAction, setStudentAction] = useState<'info' | 'promotion' | 'birthday' | 'transfer' | null>(null);

  // Parent Subtab / Action State
  const [parentAction, setParentAction] = useState<'manage' | 'requests' | 'reports' | null>(null);

  // ID Card Subtab / Action State
  const [idCardAction, setIdCardAction] = useState<'student' | 'staff' | 'settings'>('student');

  // Classes Subtab / Action State
  const [classAction, setClassAction] = useState<'classes' | 'sections' | null>(null);

  // Attendance Subtab / Action State
  const [attendanceAction, setAttendanceAction] = useState<'student' | 'staff' | 'barcode' | 'account' | 'biometric' | 'report' | null>(null);

  // Timetable Action State
  const [timetableAction, setTimetableAction] = useState<'add' | 'manage' | null>(null);

  // Fee / Accounting Action State
  const [feeAction, setFeeAction] = useState<
    | 'monthly'
    | 'custom'
    | 'transport'
    | 'types'
    | 'increment_pct'
    | 'increment_amt'
    | 'decrement_pct'
    | 'decrement_amt'
    | 'family_calc'
    | 'family_credit'
    | 'wallet'
    | 'direct_student'
    | 'direct_custom'
    | 'sms_defaulters'
    | 'balance_sheets'
    | 'deleted_fees'
    | 'discount_print'
    | 'discount_student'
    | 'discount_family'
    | 'print_student'
    | 'print_family'
    | null
  >(null);

  const handleSelectAdmissionSubTab = (
    subTab: 'admit' | 'inquiries' | 'bulk' | 'requests',
    action?: string
  ) => {
    setActiveTab('admissions');
    setAdmissionsSubTab(subTab);
    if (action) {
      setAdmissionsAction(action);
    } else {
      setAdmissionsAction(null);
    }
  };

  const handleSelectStudentAction = (action: 'info' | 'promotion' | 'birthday' | 'transfer') => {
    setActiveTab('students');
    setStudentAction(action);
  };

  const handleSelectParentAction = (action: 'manage' | 'requests' | 'reports') => {
    setActiveTab('parents');
    setParentAction(action);
  };

  const handleSelectIdCardAction = (action: 'student' | 'staff' | 'settings') => {
    setActiveTab('id_cards');
    setIdCardAction(action);
  };

  const handleSelectClassAction = (action: 'classes' | 'sections') => {
    setActiveTab('classes');
    setClassAction(action);
  };

  const handleSelectAttendanceAction = (action: 'student' | 'staff' | 'barcode' | 'account' | 'biometric' | 'report') => {
    setActiveTab('attendance');
    setAttendanceAction(action);
  };

  const handleSelectTimetableAction = (action: 'add' | 'manage') => {
    setActiveTab('timetable');
    setTimetableAction(action);
  };

  const handleSelectFeeAction = (
    action:
      | 'monthly'
      | 'custom'
      | 'transport'
      | 'types'
      | 'increment_pct'
      | 'increment_amt'
      | 'decrement_pct'
      | 'decrement_amt'
      | 'family_calc'
      | 'family_credit'
      | 'wallet'
      | 'direct_student'
      | 'direct_custom'
      | 'sms_defaulters'
      | 'balance_sheets'
      | 'deleted_fees'
      | 'discount_print'
      | 'discount_student'
      | 'discount_family'
      | 'print_student'
      | 'print_family'
  ) => {
    setActiveTab('fee_vouchers');
    setFeeAction(action);
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('school_app_sidebar_collapsed', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save sidebar state to localStorage', err);
      }
      return next;
    });
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  // Keyboard shortcut (Ctrl+B or Cmd+B) to collapse/expand sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Application Data States
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [vouchers, setVouchers] = useState<FeeVoucher[]>(INITIAL_VOUCHERS);
  const [classes, setClasses] = useState<ClassInfo[]>(INITIAL_CLASSES);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [marks, setMarks] = useState<StudentMarkEntry[]>(INITIAL_MARKS);
  const [inquiries, setInquiries] = useState<AdmissionInquiry[]>(INITIAL_INQUIRIES);
  const [materials, setMaterials] = useState<StudyMaterial[]>(INITIAL_STUDY_MATERIALS);
  const [inventory, setInventory] = useState<InventoryProduct[]>(INITIAL_INVENTORY);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [notices, setNotices] = useState(INITIAL_NOTICES);

  // Phase 4 Academic Operations, Timetable & Substitution State
  const [timetable, setTimetable] = useState<TimetablePeriod[]>(INITIAL_TIMETABLE);
  const [substitutions, setSubstitutions] = useState<TeacherSubstitution[]>(INITIAL_SUBSTITUTIONS);
  const [subjects, setSubjects] = useState<SubjectAllotment[]>(INITIAL_SUBJECTS);
  const [diaryList, setDiaryList] = useState<DailyDiary[]>(INITIAL_DIARIES);

  // Phase 1 Multi-Campus Architecture, RBAC & Cybersecurity State
  const [campuses, setCampuses] = useState<CampusBranch[]>(INITIAL_CAMPUSES);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(INITIAL_SYSTEM_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [sessions, setSessions] = useState<AcademicSession[]>(INITIAL_SESSIONS);
  const [securityPolicy, setSecurityPolicy] = useState<SecurityPolicyConfig>(INITIAL_SECURITY_POLICY);

  // Print Modal State
  const [printModalConfig, setPrintModalConfig] = useState<{
    isOpen: boolean;
    type:
      | 'fee_voucher'
      | 'id_card'
      | 'admit_card'
      | 'report_card'
      | 'transfer_certificate'
      | 'character_certificate'
      | 'bonafide_certificate'
      | 'merit_certificate'
      | 'datesheet'
      | 'visitor_pass'
      | 'student_gate_pass'
      | 'hostel_outing_pass'
      | 'book_barcode_label'
      | 'house_merit_certificate'
      | 'medical_fitness_certificate'
      | 'lab_asset_tag'
      | 'formal_exam_paper'
      | 'admission_offer_letter'
      | 'teacher_cpd_certificate'
      | 'ptm_evaluation_slip'
      | 'alumni_recommendation_letter'
      | 'lesson_plan_dossier'
      | 'career_counseling_dossier'
      | 'sports_winner_certificate'
      | 'procurement_purchase_order'
      | 'executive_audit_report'
      | 'lms_course_completion_certificate'
      | 'helpdesk_grievance_dossier'
      | 'master_class_timetable'
      | 'facility_work_order'
      | 'fleet_vehicle_dossier'
      | 'hostel_room_dossier'
      | 'mess_menu_card'
      | 'cafeteria_barcode_tag'
      | 'exam_paper_document'
      | 'question_item_card'
      | 'localized_portal_dossier';
    data: any;
  }>({
    isOpen: false,
    type: 'fee_voucher',
    data: null,
  });

  // Current logged in user object
  const currentUser = INITIAL_USERS.find((u) => u.role === currentUserRole) || INITIAL_USERS[0];

  // Actions
  const handleLogin = (role: UserRole) => {
    setCurrentUserRole(role);
    setIsLoggedIn(true);
    if (role === 'teacher') setActiveTab('teacher_portal');
    else if (role === 'parent') setActiveTab('parent_portal');
    else if (role === 'student') setActiveTab('student_portal');
    else setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleAddCampus = (campus: Omit<CampusBranch, 'id' | 'studentCount' | 'staffCount'>) => {
    const newCampus: CampusBranch = {
      ...campus,
      id: `campus-${Date.now()}`,
      studentCount: 0,
      staffCount: 0,
    };
    setCampuses((prev) => [...prev, newCampus]);
    const newAudit: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      role: currentUserRole,
      action: `ADD_CAMPUS_BRANCH: ${newCampus.name} (${newCampus.city})`,
      category: 'SYSTEM',
      severity: 'INFO',
      status: 'SUCCESS',
      ipAddress: '192.168.10.4',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleAddUser = (user: Omit<SystemUser, 'id' | 'lastLogin'>) => {
    const newUser: SystemUser = {
      ...user,
      id: `usr-${Date.now()}`,
      lastLogin: 'Never',
    };
    setSystemUsers((prev) => [...prev, newUser]);
    const newAudit: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      role: currentUserRole,
      action: `PROVISION_USER: ${newUser.fullName} (${newUser.username}) [${newUser.role}]`,
      category: 'SECURITY',
      severity: 'INFO',
      status: 'SUCCESS',
      ipAddress: '192.168.10.4',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleUpdateSecurityPolicy = (newPolicy: SecurityPolicyConfig) => {
    setSecurityPolicy(newPolicy);
    const newAudit: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      role: currentUserRole,
      action: `UPDATE_SECURITY_POLICY: 2FA=${newPolicy.require2FA ? 'Enforced' : 'Optional'}, Session=${newPolicy.sessionTimeoutMinutes}m`,
      category: 'SECURITY',
      severity: 'WARNING',
      status: 'SUCCESS',
      ipAddress: '192.168.10.4',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleAddStudent = (newStudent: Omit<Student, 'id'>) => {
    const created: Student = {
      ...newStudent,
      id: `std-${Date.now()}`,
    };
    setStudents((prev) => [created, ...prev]);

    // Also auto-generate 1st fee voucher for the new student!
    const newVoucher: FeeVoucher = {
      id: `vch-${Date.now()}`,
      voucherNo: `VCH-2024-${String(vouchers.length + 1).padStart(4, '0')}`,
      studentId: created.id,
      studentName: created.name,
      fatherName: created.fatherName,
      studentCode: created.studentCode,
      className: created.className,
      section: created.section,
      month: 'October 2024',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '2024-10-10',
      feeHeads: [
        { head: 'Tuition Fee', amount: created.monthlyFee },
        { head: 'Admission Registration Fee', amount: 5000 },
      ],
      totalAmount: created.monthlyFee + 5000,
      lateFee: 200,
      discount: 0,
      netPayable: created.monthlyFee + 5000,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
    };
    setVouchers((prev) => [newVoucher, ...prev]);
  };

  const handleBatchAddStudents = (newStudentsList: Omit<Student, 'id'>[]) => {
    const createdList: Student[] = newStudentsList.map((s, idx) => ({
      ...s,
      id: `std-${Date.now()}-${idx}`,
    }));
    setStudents((prev) => [...createdList, ...prev]);

    // Also auto-generate initial vouchers for the batch
    const newVouchers: FeeVoucher[] = createdList.map((created, idx) => ({
      id: `vch-${Date.now()}-${idx}`,
      voucherNo: `VCH-2024-${String(vouchers.length + 1 + idx).padStart(4, '0')}`,
      studentId: created.id,
      studentName: created.name,
      fatherName: created.fatherName,
      studentCode: created.studentCode,
      className: created.className,
      section: created.section,
      month: 'October 2024',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '2024-10-10',
      feeHeads: [
        { head: 'Tuition Fee', amount: created.monthlyFee },
        { head: 'Admission Registration Fee', amount: 5000 },
      ],
      totalAmount: created.monthlyFee + 5000,
      lateFee: 200,
      discount: 0,
      netPayable: created.monthlyFee + 5000,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
    }));
    setVouchers((prev) => [...newVouchers, ...prev]);
  };

  const handleAddInquiry = (inq: Omit<AdmissionInquiry, 'id'>) => {
    setInquiries((prev) => [{ ...inq, id: `inq-${Date.now()}` }, ...prev]);
  };

  const handleAddExpense = (exp: Omit<ExpenseRecord, 'id'>) => {
    setExpenses((prev) => [
      {
        ...exp,
        id: `exp-${Date.now()}`,
      },
      ...prev,
    ]);
  };

  const handleRecordFeePayment = (voucherId: string, amount: number) => {
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === voucherId
          ? { ...v, paymentStatus: 'Paid', paidAmount: amount, paymentDate: new Date().toISOString().split('T')[0] }
          : v
      )
    );
  };

  const handleSearchStudent = (query: string) => {
    if (query.trim().length > 0) {
      setActiveTab('students');
    }
  };

  // If user is logged out, render login screen
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onRequestParentAccount={() => alert('Parent portal registration request dispatched to campus registrar.')}
      />
    );
  }

  const unpaidCount = vouchers.filter((v) => v.paymentStatus === 'Unpaid').length;
  const unreadComplaints = complaints.filter((c) => c.status !== 'Resolved').length;

  return (
    <div id="school-management-system" className="h-screen h-[100dvh] w-screen overflow-hidden flex flex-col bg-[#f4f6f9] font-sans text-slate-800">
      {/* 1. Global Navigation Top Header */}
      <TopHeader
        currentUser={currentUser}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        onSearchStudent={handleSearchStudent}
        onRoleSwitch={(role: UserRole) => {
          setCurrentUserRole(role);
          if (role === 'teacher') setActiveTab('teacher_portal');
          else if (role === 'parent') setActiveTab('parent_portal');
        }}
        onLogout={handleLogout}
        onQuickAction={(action) => {
          if (action === 'admit') setActiveTab('admissions');
          else if (action === 'attendance') setActiveTab('attendance');
          else if (action === 'fee') setActiveTab('fee_vouchers');
          else if (action === 'exams') setActiveTab('exams');
        }}
        unreadComplaintsCount={unreadComplaints}
        unreadMessagesCount={3}
        onToggleMobileSidebar={toggleMobileSidebar}
      />

      {/* 2. Rapid Quick Action Ribbon */}
      <QuickActionRibbon
        onSelectTab={setActiveTab}
        onQuickAdmissionModal={() => setActiveTab('admissions')}
        onRefreshData={() => alert('System data synchronized with campus server.')}
      />

      {/* 3. Main Body Container with Isolated Sidebar and Main Stage Viewport */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative w-full">
        {/* Stationary / Collapsible Navigation Sidebar & Mobile Drawer */}
        <SidebarNavigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onSelectAdmissionSubTab={handleSelectAdmissionSubTab}
          onSelectStudentAction={handleSelectStudentAction}
          onSelectParentAction={handleSelectParentAction}
          onSelectIdCardAction={handleSelectIdCardAction}
          onSelectClassAction={handleSelectClassAction}
          onSelectAttendanceAction={handleSelectAttendanceAction}
          onSelectTimetableAction={handleSelectTimetableAction}
          onSelectFeeAction={handleSelectFeeAction}
          complaintsCount={unreadComplaints}
          unpaidFeesCount={unpaidCount}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          userName={currentUser.name}
          userRole={currentUser.designation || 'Administrator'}
        />

        {/* Dynamic Center Work Stage with Independent Vertical Scroll */}
        <main
          id="main-stage-viewport"
          className="flex-1 h-full overflow-y-auto p-3 sm:p-5 max-w-[1600px] w-full mx-auto custom-scrollbar"
        >
          {/* View Tab 1: Executive Dashboard (Phase 2 Visual Analytics & Financial Recovery) */}
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              staff={staff}
              vouchers={vouchers}
              classes={classes}
              expenses={expenses}
              campuses={campuses}
              selectedCampus={selectedCampus}
              onSelectCampus={setSelectedCampus}
              sessions={sessions}
              notices={notices}
              onNavigate={setActiveTab}
              onAdmitClick={() => setActiveTab('admissions')}
              onPrintVoucher={(v) => setPrintModalConfig({ isOpen: true, type: 'fee_voucher', data: v })}
              onPrintIdCard={(std) => setPrintModalConfig({ isOpen: true, type: 'id_card', data: std })}
            />
          )}

          {/* View Tab 2: Admissions Module */}
          {activeTab === 'admissions' && (
            <AdmissionsView
              students={students}
              inquiries={inquiries}
              initialSubTab={admissionsSubTab}
              initialAction={admissionsAction}
              onAddStudent={handleAddStudent}
              onAddInquiry={handleAddInquiry}
              onBatchAddStudents={handleBatchAddStudents}
              onPrintForm={(std) => setPrintModalConfig({ isOpen: true, type: 'transfer_certificate', data: std })}
            />
          )}

          {/* View Tab 3: Students Management */}
          {activeTab === 'students' && (
            <StudentManagementView
              students={students}
              vouchers={vouchers}
              classes={classes}
              initialAction={studentAction}
              onUpdateStudents={setStudents}
              onPrintIdCard={(std) => setPrintModalConfig({ isOpen: true, type: 'id_card', data: std })}
              onPrintCertificate={(std, type) =>
                setPrintModalConfig({ isOpen: true, type: 'transfer_certificate', data: std })
              }
              onPrintVoucher={(v) => setPrintModalConfig({ isOpen: true, type: 'fee_voucher', data: v })}
            />
          )}

          {/* ID Card Printing Studio */}
          {activeTab === 'id_cards' && (
            <IDCardPrintingView
              students={students}
              staff={staff}
              initialAction={idCardAction}
              onPrintSingleCard={(data, type) =>
                setPrintModalConfig({ isOpen: true, type: 'id_card', data })
              }
            />
          )}

          {/* Phase 6 View 1: Official Institutional Certificates, SLC & Verification Hub */}
          {activeTab === 'certifications' && (
            <CertificatesSlipsView
              students={students}
              onOpenBatchIdModal={() => setActiveTab('id_cards')}
            />
          )}

          {/* View Tab 4: Attendance Management */}
          {activeTab === 'attendance' && (
            <AttendanceView students={students} staff={staff} initialAction={attendanceAction} />
          )}

          {/* View Tab 5: Fee Billing, 3-Copy Bank Challans & Defaulters Recovery */}
          {(activeTab === 'fee_vouchers' || activeTab === 'accounting') && (
            <FeeManagementView
              vouchers={vouchers}
              students={students}
              initialAction={feeAction}
              onPrintVoucher={(v) => setPrintModalConfig({ isOpen: true, type: 'fee_voucher', data: v })}
              onRecordPayment={handleRecordFeePayment}
              onAddVouchers={(newV) => setVouchers((prev) => [...newV, ...prev])}
            />
          )}

          {/* View Tab 6: Staff Management, Salaries, Loans & EOBI Payroll */}
          {(activeTab === 'salaries' || activeTab === 'staff') && (
            <PayrollManagementView
              staff={staff}
              onDisburseSalary={(slipId, method) => {
                // salary disburse record
              }}
            />
          )}

          {/* View Tab 7: Double-Entry Accounts, Cash/Bank Ledger & Expenses */}
          {activeTab === 'expenses' && (
            <AccountsExpenseLedgerView
              expenses={expenses}
              onAddExpense={handleAddExpense}
              monthlyFeeCollection={vouchers.filter((v) => v.paymentStatus === 'Paid').reduce((s, v) => s + v.netPayable, 0)}
              monthlyPayrollCost={485000}
            />
          )}

          {/* View Tab 8: Campus POS Store & Warehouse Inventory */}
          {(activeTab === 'inventory' || (activeTab as any) === 'stock') && (
            <CampusPosStoreView
              students={students}
              inventory={inventory}
              onUpdateInventory={setInventory}
            />
          )}

          {/* View Tab 6: Examinations & Marks */}
          {activeTab === 'exams' && (
            <ExamManagementView
              marks={marks}
              onPrintReportCard={(entry) =>
                setPrintModalConfig({ isOpen: true, type: 'report_card', data: entry })
              }
              onPrintAdmitCard={(entry) =>
                setPrintModalConfig({ isOpen: true, type: 'admit_card', data: entry })
              }
              onUpdateMarks={(id, obtained) => {
                setMarks((prev) =>
                  prev.map((m) => (m.id === id ? { ...m, totalObtained: obtained } : m))
                );
              }}
            />
          )}

          {/* View Tab 7: Teacher Dashboard & Virtual Classes */}
          {activeTab === 'teacher_portal' && (
            <TeacherPortalView
              students={students}
              materials={materials}
              onUploadMaterial={(mat) =>
                setMaterials((prev) => [{ ...mat, id: `mat-${Date.now()}` }, ...prev])
              }
              onNavigateTab={setActiveTab}
            />
          )}

          {/* View Tab 8: Parent Access Portal & Accounts */}
          {(activeTab === 'parent_portal' || activeTab === 'parents') && (
            <ParentPortalView
              students={students}
              vouchers={vouchers}
              initialAction={parentAction}
              onPrintVoucher={(v) => setPrintModalConfig({ isOpen: true, type: 'fee_voucher', data: v })}
            />
          )}

          {/* Phase 4 View 1: Class, Section, Subject Allotment & Workload Quota Matrix */}
          {(activeTab === 'classes' || activeTab === 'subjects') && (
            <ClassSubjectManagementView
              classes={classes}
              subjects={subjects}
              staff={staff}
              initialAction={classAction}
              onUpdateClasses={setClasses}
              onUpdateSubjects={setSubjects}
            />
          )}

          {/* Phase 4 View 2: Academic Timetable Routine & Automated Teacher Substitution Engine */}
          {activeTab === 'timetable' && (
            <TimetableSubstitutionEngine
              timetable={timetable}
              substitutions={substitutions}
              staff={staff}
              classes={classes}
              subjects={subjects}
              initialAction={timetableAction}
              onUpdateTimetable={setTimetable}
              onAddSubstitution={(sub) => setSubstitutions((prev) => [sub, ...prev])}
            />
          )}

          {/* Phase 4 View 3: Daily Homework Diary, Parent Broadcast & Virtual Classroom LMS */}
          {(activeTab === 'diary' || activeTab === 'lms' || activeTab === 'online_classes') && (
            <DailyDiaryHomeworkLmsView
              diaryList={diaryList}
              studyMaterials={materials}
              students={students}
              classes={classes}
              onAddDiary={(entry) => setDiaryList((prev) => [entry, ...prev])}
              onAddMaterial={(mat) => setMaterials((prev) => [mat, ...prev])}
            />
          )}

          {/* Phase 6 View 2: Omni-Channel Communications, Masked SMS & Parent Helpdesk */}
          {activeTab === 'communications' && (
            <CommunicationsHubView students={students} />
          )}

          {/* Phase 6 View 3: Official Verification Registry & Instant Certificate Generator */}
          {(activeTab === 'certificates' || activeTab === 'certifications') && (
            <CertificatesSlipsView
              students={students}
              onPrintCertificate={(certType, data) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: certType,
                  data,
                })
              }
            />
          )}

          {/* Phase 6 View 4: Transport Fleet, Route Telematics & Van Operations */}
          {activeTab === 'transport' && (
            <TransportManagementView
              students={students}
              onAddExpense={handleAddExpense}
            />
          )}

          {/* Phase 7 View 1: Library Catalog, OPAC & Circulation Management */}
          {activeTab === 'library' && (
            <LibraryManagementView
              students={students}
              onPrintBookLabel={(book) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'book_barcode_label',
                  data: book,
                })
              }
            />
          )}

          {/* Phase 7 View 2: Visitor Gate Passes, Vehicle Tags & Emergency Early Leaves */}
          {activeTab === 'gate_security' && (
            <VisitorGateSecurityView
              students={students}
              onPrintVisitorPass={(pass) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'visitor_pass',
                  data: pass,
                })
              }
              onPrintStudentGatePass={(pass) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'student_gate_pass',
                  data: pass,
                })
              }
            />
          )}

          {/* Phase 7 View 3: Hostel & Boarding Suite with 7-Day Mess Schedule */}
          {activeTab === 'hostel' && (
            <HostelBoardingView
              students={students}
              onPrintHostelPass={(leave) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'hostel_outing_pass',
                  data: leave,
                })
              }
            />
          )}

          {/* Phase 7 View 4: Executive BI Analytics, Alumni Directory & Audit Compliance */}
          {(activeTab === 'analytics' || activeTab === 'alumni') && (
            <ExecutiveAnalyticsBiView
              students={students}
            />
          )}

          {/* Phase 8 View 1: Inter-House Championship, Sports Olympiad & Co-Curricular Clubs */}
          {activeTab === 'sports_houses' && (
            <SportsHousesView
              students={students}
              onPrintHouseCertificate={(cert: any) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'house_merit_certificate',
                  data: cert,
                })
              }
            />
          )}

          {/* Phase 8 View 2: Infirmary, Clinic OPD & Student Medical Profiles */}
          {activeTab === 'infirmary' && (
            <InfirmaryHealthView
              students={students}
              onPrintMedicalCertificate={(profile: any) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'medical_fitness_certificate',
                  data: profile,
                })
              }
            />
          )}

          {/* Phase 8 View 3: Science & IT Labs Equipment, Maintenance & Chemical Hazard Registry */}
          {activeTab === 'lab_assets' && (
            <LabAssetsInventoryView
              onPrintAssetTag={(asset: any) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'lab_asset_tag',
                  data: asset,
                })
              }
            />
          )}

          {/* Phase 8 View 4: AI Question Paper Generator & Bloom's Taxonomy Question Bank */}
          {activeTab === 'question_paper' && (
            <ExamPaperGeneratorView
              onPrintExamPaper={(paper: any) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'formal_exam_paper',
                  data: paper,
                })
              }
            />
          )}

          {/* Phase 9 View 1: Entrance Assessment, Quota Allocation & Merit Ranking Engine */}
          {activeTab === 'admission_merit' && (
            <AdmissionMeritAssessmentView
              onPrintAdmissionOffer={(candidate) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'admission_offer_letter',
                  data: candidate,
                })
              }
            />
          )}

          {/* Phase 9 View 2: Faculty Continuous Professional Development (CPD) & Weekly Lesson Plan Matrix */}
          {activeTab === 'teacher_cpd' && (
            <TeacherCpdLessonPlanView
              staffList={staff}
              onPrintCpdCertificate={(record) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'teacher_cpd_certificate',
                  data: record,
                })
              }
            />
          )}

          {/* Phase 9 View 3: Parent-Teacher Meeting (PTM) Portal & 360° Student Feedback Dossier */}
          {activeTab === 'ptm_portal' && (
            <PtmSchedulerFeedbackView
              students={students}
              onPrintPtmSlip={(feedback) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'ptm_evaluation_slip',
                  data: feedback,
                })
              }
            />
          )}

          {/* Phase 9 View 4: Alumni Network Directorate, University Placements & Career Counseling */}
          {activeTab === 'career_alumni' && (
            <AlumniUniversityPlacementView
              onPrintRecommendationLetter={(alumni) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'alumni_recommendation_letter',
                  data: alumni,
                })
              }
            />
          )}

          {/* Phase 10 View 1: Digital LMS Vault, E-Learning Video Hub & SLO Quiz Engine */}
          {activeTab === 'lms_vault' && (
            <DigitalLmsQuizVaultView
              onPrintCompletionCertificate={(sub) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'lms_course_completion_certificate',
                  data: sub,
                })
              }
            />
          )}

          {/* Phase 10 View 2: Annual Sports Gala, House Championship & National Olympiad Hub */}
          {activeTab === 'sports_olympiad' && (
            <SportsOlympiadTournamentView
              onPrintSportsCertificate={(ev) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'sports_winner_certificate',
                  data: ev,
                })
              }
            />
          )}

          {/* Phase 10 View 3: School Capex/Opex Budgeting, PR/PO & Vendor Procurement ERP */}
          {activeTab === 'budget_procurement' && (
            <BudgetProcurementErpView
              onPrintPurchaseOrder={(pr) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'procurement_purchase_order',
                  data: pr,
                })
              }
            />
          )}

          {/* Phase 10 View 4: Executive BI Command Center, Campus 360° Health & AI Risk Predictor */}
          {activeTab === 'executive_bi' && (
            <ExecutiveBiCommandCenterView
              onPrintAuditReport={(metric) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'executive_audit_report',
                  data: metric,
                })
              }
            />
          )}

          {/* Phase 11 View 1: Multi-Channel Broadcast & WhatsApp/SMS Gateway Engine */}
          {activeTab === 'broadcast_gateway' && (
            <BroadcastGatewayView />
          )}

          {/* Phase 11 View 2: Parent-School Helpdesk & SLA Ticket Redressal Center */}
          {activeTab === 'parent_helpdesk' && (
            <ParentHelpdeskView
              onPrintTicketSummary={(ticket) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'helpdesk_grievance_dossier',
                  data: ticket,
                })
              }
            />
          )}

          {/* Phase 12: Master Timetable Scheduler & Smart Substitution Engine */}
          {activeTab === 'master_timetable_engine' && (
            <MasterTimetableEngineView
              onPrintTimetable={(timetable) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'master_class_timetable',
                  data: timetable,
                })
              }
            />
          )}

          {/* Phase 13: Campus Facility Maintenance, Fleet GPS Logs & Solar Telemetry */}
          {activeTab === 'facility_fleet_maintenance' && (
            <FacilityFleetMaintenanceView
              onPrintWorkOrder={(wo) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'facility_work_order',
                  data: wo,
                })
              }
              onPrintFleetLog={(fleet) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'fleet_vehicle_dossier',
                  data: fleet,
                })
              }
            />
          )}

          {/* Phase 14: Boarding Hostel Allotment, Mess Nutrition & Cafeteria POS Inventory */}
          {activeTab === 'hostel_cafeteria_inventory' && (
            <HostelCafeteriaInventoryView
              onPrintHostelDossier={(room) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'hostel_room_dossier',
                  data: room,
                })
              }
              onPrintMessMenu={(menu) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'mess_menu_card',
                  data: menu,
                })
              }
              onPrintInventoryTag={(item) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'cafeteria_barcode_tag',
                  data: item,
                })
              }
            />
          )}

          {/* Phase 16: Automated AI Question Bank, SNC Paper Blueprint & Exam Paper Generator */}
          {activeTab === 'ai_question_bank_engine' && (
            <AIQuestionBankEngineView
              onPrintExamPaper={(paper) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'exam_paper_document',
                  data: paper,
                })
              }
              onPrintQuestionItem={(item) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'question_item_card',
                  data: item,
                })
              }
            />
          )}

          {/* Phase 17: Multi-Language Parent & Teacher Portal Localization */}
          {activeTab === 'localization_portal' && (
            <LocalizationPortalView
              onPrintLocalizationDossier={(data) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'localized_portal_dossier',
                  data,
                })
              }
            />
          )}

          {/* View Tab 13: Phase 1 Multi-Campus Architecture, RBAC & Cybersecurity Administration */}
          {activeTab === 'settings' && (
            <Phase1AdministrationView
              campuses={campuses}
              users={systemUsers}
              auditLogs={auditLogs}
              sessions={sessions}
              securityPolicy={securityPolicy}
              selectedCampus={selectedCampus}
              onSelectCampus={setSelectedCampus}
              onAddCampus={handleAddCampus}
              onAddUser={handleAddUser}
              onUpdateSecurityPolicy={handleUpdateSecurityPolicy}
            />
          )}

          {/* View Tab 14: Student Portal */}
          {activeTab === 'student_portal' && (
            <ParentPortalView
              students={students}
              vouchers={vouchers}
              onPrintVoucher={(v) => setPrintModalConfig({ isOpen: true, type: 'fee_voucher', data: v })}
            />
          )}
        </main>
      </div>

      {/* Printable Modal (Fee Vouchers, ID Cards, Admit Cards, Report Cards, SLC) */}
      {printModalConfig.isOpen && (
        <PrintModal
          type={printModalConfig.type}
          data={printModalConfig.data}
          onClose={() => setPrintModalConfig({ isOpen: false, type: 'fee_voucher', data: null })}
        />
      )}
    </div>
  );
}
