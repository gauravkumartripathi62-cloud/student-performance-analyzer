const STORAGE_KEY = "sapas-students";
const CSV_SNAPSHOT_KEY = "sapas-students-csv";
const REVERT_POINTS_KEY = "sapas-student-revert-points";
const MAX_REVERT_POINTS = 15;
const MARK_LIMITS = { assignments: 40, external: 60, total: 100, finalScore: 100, creditsMin: 1, creditsMax: 10 };
const EXPANDED_MARK_LIMITS = { assignments: 100, external: 100, total: 200 };
const navItems = Array.from(document.querySelectorAll(".nav-item"));
const topbarBackButton = document.getElementById("topbar-back-button");
const views = Array.from(document.querySelectorAll(".view"));
const pageTitle = document.getElementById("page-title");
const subjectsList = document.getElementById("subjects-list");
const subjectTemplate = document.getElementById("subject-row-template");
const studentForm = document.getElementById("student-form");
const formError = document.getElementById("form-error");
const stepper = Array.from(document.querySelectorAll(".step"));
const formSteps = Array.from(document.querySelectorAll(".form-step"));
const addFormTitle = document.getElementById("add-form-title");
const nextStepButton = document.getElementById("next-step");
const prevStepButton = document.getElementById("prev-step");
const submitButton = document.getElementById("submit-student");
const addAnotherSemesterButton = document.getElementById("add-another-semester");
const uploadZone = document.getElementById("upload-zone");
const csvFileInput = document.getElementById("csv-file");
const uploadFeedback = document.getElementById("upload-feedback");
const importCsvButton = document.getElementById("import-csv");
const clearUploadButton = document.getElementById("clear-upload");
const storageStatus = document.getElementById("storage-status");
const storedCsvPreview = document.getElementById("stored-csv-preview");
const restoreRevertPointButton = document.getElementById("restore-revert-point");
const revertPointStatus = document.getElementById("revert-point-status");
const downloadTemplateButton = document.getElementById("download-template");
const downloadStorageCsvButton = document.getElementById("download-storage-csv");
const downloadTemplateSavedButton = document.getElementById("download-template-saved");
const downloadStorageCsvSavedButton = document.getElementById("download-storage-csv-saved");
const jumpAddLink = document.getElementById("jump-add");
const predictionForm = document.getElementById("prediction-form");
const simulationResults = document.getElementById("simulation-results");
const simulationEmptyState = document.getElementById("simulation-empty-state");
const simulateButton = document.getElementById("calculate-prediction");
const browseUploadButton = document.getElementById("browse-upload");
const authOverlay = document.getElementById("auth-overlay");
const authForm = document.getElementById("auth-form");
const authEmailInput = document.getElementById("auth-email");
const authPasswordInput = document.getElementById("auth-password");
const authConfirmWrap = document.getElementById("auth-confirm-wrap");
const authConfirmPasswordInput = document.getElementById("auth-confirm-password");
const authError = document.getElementById("auth-error");
const authSubmitButton = document.getElementById("auth-submit");
const authSignupActionButton = document.getElementById("auth-signup-action");
const authGoogleButton = document.getElementById("auth-google");
const authHelperCopy = document.getElementById("auth-helper-copy");
const authStatus = document.getElementById("auth-status");
const authRoleBadge = document.getElementById("auth-role-badge");
const authSignoutButton = document.getElementById("auth-signout");
const dobInput = studentForm ? studentForm.elements.namedItem("dob") : null;
const levelSelect = studentForm ? studentForm.elements.namedItem("level") : null;
const semesterSelect = studentForm ? studentForm.elements.namedItem("semester") : null;
const enrollmentIdField = studentForm ? studentForm.elements.namedItem("enrollmentId") : null;
const enrollmentIdFeedback = document.getElementById("enrollment-id-feedback");
const dobDisplayButton = document.getElementById("dob-display");
const dobDisplayText = document.getElementById("dob-display-text");
const dobCalendarPopup = document.getElementById("dob-calendar-popup");
const dobCalendarGrid = document.getElementById("dob-calendar-grid");
const dobMonthSelect = document.getElementById("dob-month-select");
const dobYearSelect = document.getElementById("dob-year-select");
const dobPrevMonthButton = document.getElementById("dob-prev-month");
const dobNextMonthButton = document.getElementById("dob-next-month");
const phoneInput = studentForm ? studentForm.elements.namedItem("phone") : null;
const backlogsInput = studentForm ? studentForm.elements.namedItem("backlogs") : null;
const programSelect = document.getElementById("program-select");
const programOtherWrap = document.getElementById("program-other-wrap");
const programOtherInput = document.getElementById("program-other");
const departmentSelect = document.getElementById("department-select");
const departmentOtherWrap = document.getElementById("department-other-wrap");
const departmentOtherInput = document.getElementById("department-other");
const deleteModal = document.getElementById("delete-modal");
const deleteCancelButton = document.getElementById("delete-cancel");
const deleteConfirmButton = document.getElementById("delete-confirm");
const deleteModalTitle = document.getElementById("delete-modal-title");
const deleteModalMessage = document.getElementById("delete-modal-message");
const deleteModalWarning = document.getElementById("delete-modal-warning");
const DOWNLOAD_SERVER_URL = "http://127.0.0.1:8876/download-csv";

const PROGRAM_OPTIONS = [
  "BBA (Bachelor of Business Administration)",
  "BCA (Bachelor of Computer Applications)",
  "B.Com (Bachelor of Commerce)",
  "B.Sc (Bachelor of Science)",
  "BA (Bachelor of Arts)",
  "B.Tech (Bachelor of Technology)",
  "MBA (Master of Business Administration)",
  "MCA (Master of Computer Applications)",
  "M.Com (Master of Commerce)",
  "M.Sc (Master of Science)",
  "MA (Master of Arts)",
  "Media / Mass Communication"
];

const LEVEL_PROGRAM_MAP = {
  UG: [
    "BBA (Bachelor of Business Administration)",
    "BCA (Bachelor of Computer Applications)",
    "B.Com (Bachelor of Commerce)",
    "B.Sc (Bachelor of Science)",
    "BA (Bachelor of Arts)",
    "B.Tech (Bachelor of Technology)",
    "Media / Mass Communication"
  ],
  PG: [
    "MBA (Master of Business Administration)",
    "MCA (Master of Computer Applications)",
    "M.Com (Master of Commerce)",
    "M.Sc (Master of Science)",
    "MA (Master of Arts)"
  ]
};

const DEPARTMENT_OPTIONS = [
  "School of Business & Management (SBM)",
  "School of Commerce",
  "School of Sciences",
  "School of Arts & Humanities",
  "School of Computer Applications / IT",
  "School of Media & Communication",
  "School of Engineering & Technology",
  "School of Psychology",
  "School of Social Sciences"
];

const SUBJECT_CATALOG = {
  "BCA (Bachelor of Computer Applications)": {
    1: ["Fundamentals of Computers", "Programming in C", "Mathematics I", "Communication Skills", "Digital Electronics"],
    2: ["Data Structures", "OOP using C++", "Mathematics II", "Operating Systems", "Environmental Studies"],
    3: ["DBMS", "Computer Networks", "Java Programming", "Software Engineering", "Web Technologies"],
    4: ["Python Programming", "Computer Graphics", "Mobile App Development", "Cloud Computing", "Data Analytics"],
    5: ["Artificial Intelligence", "Machine Learning", "Cyber Security", "IoT", "Big Data"],
    6: ["Project Work", "Internship", "Advanced Web Development", "Blockchain Basics"]
  },
  "BBA (Bachelor of Business Administration)": {
    1: ["Principles of Management", "Business Economics", "Financial Accounting", "Business Communication", "Business Mathematics"],
    2: ["Marketing Management", "Organizational Behavior", "Cost Accounting", "Business Law", "Statistics"],
    3: ["Human Resource Management", "Financial Management", "Operations Management", "Research Methodology", "Entrepreneurship"],
    4: ["Consumer Behavior", "Banking & Insurance", "Supply Chain Management", "E-Commerce", "Business Analytics"],
    5: ["Strategic Management", "Investment Analysis", "International Business", "Digital Marketing", "Leadership Skills"],
    6: ["Project Work", "Internship", "Corporate Governance", "Business Ethics"]
  },
  "B.Com (Bachelor of Commerce)": {
    1: ["Financial Accounting", "Business Economics", "Business Law", "English Communication"],
    2: ["Corporate Accounting", "Cost Accounting", "Income Tax", "Banking"],
    3: ["Auditing", "Financial Management", "Business Statistics", "GST"],
    4: ["E-Commerce", "Investment Management", "Corporate Law", "Entrepreneurship"],
    5: ["Advanced Accounting", "Financial Markets", "Tax Planning", "Business Analytics"],
    6: ["Project Work", "Internship", "International Finance"]
  },
  "B.Sc (Bachelor of Science)": {
    1: ["Physics", "Chemistry", "Mathematics", "Environmental Science"],
    2: ["Organic Chemistry", "Mechanics", "Statistics", "Computer Fundamentals"],
    3: ["Electromagnetism", "Data Analysis", "Microbiology", "Numerical Methods"],
    4: ["Quantum Physics", "Biochemistry", "Research Methodology", "Python Programming"],
    5: ["Astrophysics", "Biotechnology", "Machine Learning Basics", "Advanced Statistics"],
    6: ["Project Work", "Internship", "Advanced Science Topics"]
  },
  "BA (Bachelor of Arts)": {
    1: ["Political Science", "History", "Sociology", "English Literature"],
    2: ["Public Administration", "Geography", "Psychology", "Hindi / Regional Language"],
    3: ["International Relations", "Social Work", "Philosophy", "Cultural Studies"],
    4: ["Media Studies", "Gender Studies", "Economics", "Research Basics"],
    5: ["Advanced Political Theory", "Development Studies", "Ethics", "Communication Studies"],
    6: ["Project Work", "Internship", "Contemporary Issues"]
  },
  "B.Tech (Bachelor of Technology)": {
    1: ["Engineering Mathematics", "Physics", "Basic Electrical Engineering", "Engineering Graphics"],
    2: ["Chemistry", "Programming in C", "Workshop Practice", "Environmental Science"],
    3: ["Data Structures", "Digital Electronics", "Signals & Systems", "OOP"],
    4: ["Operating Systems", "Computer Organization", "DBMS", "Microprocessors"],
    5: ["Software Engineering", "Computer Networks", "AI", "Web Technologies"],
    6: ["Machine Learning", "Cloud Computing", "Cyber Security", "IoT"],
    7: ["Major Project", "Internship", "Electives"],
    8: ["Final Project", "Industrial Training"]
  },
  "MBA (Master of Business Administration)": {
    1: ["Management Principles", "Financial Accounting", "Marketing Management", "Organizational Behavior"],
    2: ["Financial Management", "HR Management", "Operations Management", "Business Analytics"],
    3: ["Strategic Management", "International Business", "Electives"],
    4: ["Project Work", "Internship", "Leadership Development"]
  },
  "MCA (Master of Computer Applications)": {
    1: ["Programming in Java", "Data Structures", "Mathematics", "Computer Organization"],
    2: ["DBMS", "Operating Systems", "Software Engineering", "Web Technologies"],
    3: ["AI", "Machine Learning", "Cloud Computing", "Cyber Security"],
    4: ["Project Work", "Internship", "Advanced Computing"]
  },
  "M.Com (Master of Commerce)": {
    default: ["Advanced Accounting", "Financial Management", "Taxation", "Auditing", "Business Research"]
  },
  "M.Sc (Master of Science)": {
    default: ["Advanced Physics", "Advanced Chemistry", "Data Science", "Research Methods"]
  },
  "MA (Master of Arts)": {
    default: ["Advanced Sociology", "Political Theory", "Literature Studies", "Research Work"]
  },
  "Media / Mass Communication": {
    default: ["Journalism", "Digital Media", "Advertising", "Public Relations", "Film Studies", "Media Ethics"]
  }
};

const FALLBACK_SUBJECTS = ["Project Work", "Internship", "Research Work", "Advanced Topics", "Elective"];

const DEPARTMENT_PROGRAM_MAP = {
  "School of Business & Management (SBM)": ["BBA (Bachelor of Business Administration)", "MBA (Master of Business Administration)"],
  "School of Computer Applications / IT": ["BCA (Bachelor of Computer Applications)", "MCA (Master of Computer Applications)"],
  "School of Commerce": ["B.Com (Bachelor of Commerce)", "M.Com (Master of Commerce)"],
  "School of Sciences": ["B.Sc (Bachelor of Science)", "M.Sc (Master of Science)"],
  "School of Arts & Humanities": ["BA (Bachelor of Arts)", "MA (Master of Arts)"],
  "School of Engineering & Technology": ["B.Tech (Bachelor of Technology)"],
  "School of Media & Communication": ["Media / Mass Communication"]
};

const PROGRAM_DEPARTMENT_MAP = Object.fromEntries(
  Object.entries(DEPARTMENT_PROGRAM_MAP).flatMap(([department, programs]) => programs.map((program) => [program, department]))
);

let currentStep = 1;
let students = loadStudents();
let selectedStudentId = students.length ? students[0].id : null;
let editingStudentId = null;
let editingOriginalEnrollmentId = "";
let pendingDeleteStudentId = null;
let pendingDeleteAction = null;
let lastDeleteTrigger = null;
let activeProfileTimelineSemester = null;
let activeProfileTimelineStudentId = null;
let profileTimelineDismissBound = false;
let pendingSaveAndContinue = false;
let permittedExistingEnrollmentId = "";
let programLockedForContinuation = false;
let lockedProgramValue = "";
let departmentLockedForContinuation = false;
let lockedDepartmentValue = "";
let semesterContinuationActive = false;
let timelineEntryLockContext = null;
let studentIdentityLocked = false;
let pendingCsvStudents = [];
let pendingCsvPreviewRows = [];
let pendingCsvFilename = "students-data.csv";
let dobCalendarViewDate = new Date();
let authSession = null;
let authProfile = null;
let authInitialized = false;
let authSubscription = null;
let cloudSyncInFlight = false;
let authSettings = null;
let authMode = "signin";
let authBooting = true;
let authSignupCheckTimer = 0;
let authSignupCheckSequence = 0;
let authSignupDisabledForExistingAccount = false;
let authSignupAvailabilityPending = false;
const knownRegisteredAuthEmails = new Set();

function hasSupabaseClient() {
  return Boolean(window.SapasSupabase && window.SapasSupabase.isConfigured && window.SapasSupabase.isConfigured());
}

function normalizeAuthMessage(error, fallbackMessage) {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return fallbackMessage;
}

function setAuthMessage(message) {
  if (!authError) return;
  authError.textContent = message ? String(message) : "";
  authError.hidden = !message;
  authError.style.display = message ? "block" : "none";
}

function normalizeAuthEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isGoogleAuthEnabled() {
  const external = authSettings && typeof authSettings === "object" ? authSettings.external : null;
  return Boolean(external && external.google);
}

function updateAuthActionState() {
  if (authGoogleButton) {
    const googleSettingsKnown = Boolean(authSettings && typeof authSettings === "object");
    const googleEnabled = !googleSettingsKnown || isGoogleAuthEnabled();
    authGoogleButton.disabled = !googleEnabled;
    authGoogleButton.setAttribute("aria-disabled", googleEnabled ? "false" : "true");
    authGoogleButton.title = googleEnabled ? "Continue with Google" : "Google is not enabled in Supabase yet.";
  }
  if (authSubmitButton) {
    authSubmitButton.disabled = false;
    authSubmitButton.setAttribute("aria-disabled", "false");
  }
  if (authSignupActionButton) {
    const signupBlocked = authSignupDisabledForExistingAccount;
    authSignupActionButton.disabled = signupBlocked;
    authSignupActionButton.setAttribute("aria-disabled", signupBlocked ? "true" : "false");
    authSignupActionButton.style.opacity = signupBlocked ? "0.45" : "";
    authSignupActionButton.style.cursor = signupBlocked ? "not-allowed" : "";
    authSignupActionButton.title = authSignupDisabledForExistingAccount
      ? "This email and password already belong to an existing account."
      : "Sign Up";
  }
}

function updateAuthModeUi() {
  const isSignUp = authMode === "signup";
  if (authConfirmWrap) authConfirmWrap.hidden = !isSignUp;
  if (authSubmitButton) authSubmitButton.textContent = "Sign In";
  if (authSignupActionButton) authSignupActionButton.textContent = "Sign Up";
  if (authHelperCopy) {
    authHelperCopy.textContent = "";
    authHelperCopy.hidden = true;
  }
}

function setAuthMode(mode) {
  authMode = mode === "signup" ? "signup" : "signin";
  setAuthMessage("");
  updateAuthModeUi();
  scheduleAuthSignupAvailabilityCheck();
}

function applyAuthenticatedUi(session, email) {
  authSession = session || null;
  const normalizedEmail = normalizeAuthEmail(authSession?.user?.email || email || "");
  if (normalizedEmail) knownRegisteredAuthEmails.add(normalizedEmail);
  authProfile = authSession ? {
    id: authSession.user?.id || "",
    email: authSession.user?.email || email || "",
    role: authProfile?.role || "teacher"
  } : null;
  updateAuthUi();
  renderAll();
  updateRoleBasedViewState();
}

async function refreshSignupAvailability() {
  if (!authSignupActionButton) {
    authSignupDisabledForExistingAccount = false;
    authSignupAvailabilityPending = false;
    updateAuthActionState();
    return;
  }

  const email = authEmailInput ? normalizeAuthEmail(authEmailInput.value) : "";

  if (!email) {
    authSignupDisabledForExistingAccount = false;
    authSignupAvailabilityPending = false;
    updateAuthActionState();
    return;
  }

  if (knownRegisteredAuthEmails.has(email)) {
    authSignupDisabledForExistingAccount = true;
    authSignupAvailabilityPending = false;
    updateAuthActionState();
    return;
  }
  authSignupDisabledForExistingAccount = false;
  authSignupAvailabilityPending = false;
  updateAuthActionState();
}

async function enforceSignupAvailability() {
  if (!authSignupActionButton) {
    authSignupDisabledForExistingAccount = false;
    authSignupAvailabilityPending = false;
    updateAuthActionState();
    return false;
  }

  const email = authEmailInput ? normalizeAuthEmail(authEmailInput.value) : "";
  if (!email) {
    authSignupDisabledForExistingAccount = false;
    authSignupAvailabilityPending = false;
    updateAuthActionState();
    return false;
  }

  if (knownRegisteredAuthEmails.has(email)) {
    authSignupDisabledForExistingAccount = true;
    authSignupAvailabilityPending = false;
    updateAuthActionState();
    return true;
  }
  authSignupAvailabilityPending = false;
  authSignupDisabledForExistingAccount = false;
  updateAuthActionState();
  return false;
}

function scheduleAuthSignupAvailabilityCheck() {
  const email = authEmailInput ? normalizeAuthEmail(authEmailInput.value) : "";
  if (!email) {
    authSignupDisabledForExistingAccount = false;
    authSignupAvailabilityPending = false;
    updateAuthActionState();
    if (authSignupCheckTimer) window.clearTimeout(authSignupCheckTimer);
    return;
  }
  if (knownRegisteredAuthEmails.has(email)) {
    authSignupDisabledForExistingAccount = true;
    authSignupAvailabilityPending = false;
    updateAuthActionState();
    if (authSignupCheckTimer) window.clearTimeout(authSignupCheckTimer);
    return;
  }
  authSignupAvailabilityPending = false;
  if (authSignupCheckTimer) window.clearTimeout(authSignupCheckTimer);
  authSignupCheckTimer = window.setTimeout(() => {
    refreshSignupAvailability();
  }, 250);
}

async function submitAuth(mode) {
  const actionMode = mode === "signup" ? "signup" : "signin";
  const email = authEmailInput ? normalizeAuthEmail(authEmailInput.value) : "";
  const password = authPasswordInput ? authPasswordInput.value : "";

  setAuthMessage("");

  if (!email || !password) {
    setAuthMessage(actionMode === "signup"
      ? "Enter email and password to create your account."
      : "Enter both email and password to sign in.");
    return;
  }

  if (actionMode === "signup") {
    if (authMode !== "signup") {
      setAuthMode("signup");
      if (authConfirmPasswordInput) authConfirmPasswordInput.focus();
      setAuthMessage("Confirm your password, then click Sign Up again.");
      return;
    }
    if (!authConfirmPasswordInput || !authConfirmPasswordInput.value) {
      setAuthMessage("Confirm your password to finish sign up.");
      return;
    }
    if (password !== authConfirmPasswordInput.value) {
      setAuthMessage("Password and confirm password must match.");
      return;
    }
    if (password.length < 6) {
      setAuthMessage("Use a password with at least 6 characters.");
      return;
    }
  } else if (authMode !== "signin") {
    setAuthMode("signin");
  }

  try {
    if (authSubmitButton) authSubmitButton.disabled = true;
    if (authSignupActionButton) authSignupActionButton.disabled = true;
    if (authGoogleButton) authGoogleButton.disabled = true;

    if (actionMode === "signup") {
      const result = await window.SapasSupabase.signUpWithPassword(email, password);
      const needsEmailConfirmation = !result.session;
      knownRegisteredAuthEmails.add(email);
      authSignupDisabledForExistingAccount = true;
      updateAuthActionState();
      if (result.session) {
        applyAuthenticatedUi(result.session, email);
        try {
          await handleAuthSessionChange(result.session);
        } catch (sessionError) {
          applyAuthenticatedUi(result.session, email);
        }
      }
      setAuthMode("signin");
      if (authConfirmPasswordInput) authConfirmPasswordInput.value = "";
      setAuthMessage(
        needsEmailConfirmation
          ? "Account created. Check your email and confirm it before signing in."
          : "Account created successfully. You are now signed in."
      );
    } else {
      const result = await window.SapasSupabase.signInWithPassword(email, password);
      if (result.session) {
        knownRegisteredAuthEmails.add(email);
        applyAuthenticatedUi(result.session, email);
        try {
          await handleAuthSessionChange(result.session);
        } catch (sessionError) {
          applyAuthenticatedUi(result.session, email);
        }
      }
    }
  } catch (error) {
    setAuthMessage(normalizeAuthMessage(
      error,
      actionMode === "signup" ? "Unable to sign up." : "Unable to sign in."
    ));
  } finally {
    if (authSubmitButton) authSubmitButton.disabled = false;
    if (authSignupActionButton) authSignupActionButton.disabled = false;
    updateAuthActionState();
    scheduleAuthSignupAvailabilityCheck();
  }
}

function getCurrentUserRole() {
  return authProfile && authProfile.role ? String(authProfile.role) : "guest";
}

function canManageStudentRecords() {
  return true;
}

function getLocalStudentsForMigration() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function cloneStudentsData(sourceStudents = students) {
  return JSON.parse(JSON.stringify(Array.isArray(sourceStudents) ? sourceStudents : []));
}

function getStoredRevertPoints() {
  try {
    const parsed = JSON.parse(localStorage.getItem(REVERT_POINTS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function persistRevertPoints(points) {
  if (!Array.isArray(points) || !points.length) {
    localStorage.removeItem(REVERT_POINTS_KEY);
    return;
  }
  localStorage.setItem(REVERT_POINTS_KEY, JSON.stringify(points.slice(0, MAX_REVERT_POINTS)));
}

function formatRevertPointTime(isoString) {
  const value = new Date(isoString);
  if (Number.isNaN(value.getTime())) return "an unknown time";
  return value.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function createRevertPoint(reason, sourceStudents = students, sourceCsv = null) {
  const resolvedCsv = typeof sourceCsv === "string"
    ? sourceCsv
    : Array.isArray(sourceStudents) && sourceStudents.length
    ? studentsToCsv(sourceStudents)
    : (getPersistedCsvSnapshot() || "");
  const revertPoint = {
    id: `revert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    reason: String(reason || "update"),
    createdAt: new Date().toISOString(),
    students: cloneStudentsData(sourceStudents),
    csv: resolvedCsv
  };
  persistRevertPoints([revertPoint, ...getStoredRevertPoints()]);
  renderRevertPointState();
  return revertPoint;
}

function restoreLatestRevertPoint() {
  const revertPoints = getStoredRevertPoints();
  const latestRevertPoint = revertPoints[0];
  if (!latestRevertPoint) return false;

  students = Array.isArray(latestRevertPoint.students) ? cloneStudentsData(latestRevertPoint.students) : [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  if (latestRevertPoint.csv) localStorage.setItem(CSV_SNAPSHOT_KEY, latestRevertPoint.csv);
  else localStorage.removeItem(CSV_SNAPSHOT_KEY);

  persistRevertPoints(revertPoints.slice(1));
  enrichStudents();
  selectedStudentId = students[0]?.id || null;
  if (editingStudentId && !findStudent(editingStudentId)) resetForm();
  clearUploadState();
  renderAll();
  setView(students.length ? "students" : "overview", { historyMode: "push" });
  return true;
}

function renderRevertPointState() {
  const latestRevertPoint = getStoredRevertPoints()[0] || null;
  if (restoreRevertPointButton) restoreRevertPointButton.disabled = !latestRevertPoint;
  if (!revertPointStatus) return;
  if (!latestRevertPoint) {
    revertPointStatus.textContent = "Automatic revert points are created before every save, import, and delete.";
    return;
  }
  revertPointStatus.textContent = `Latest revert point: ${latestRevertPoint.reason} saved on ${formatRevertPointTime(latestRevertPoint.createdAt)}.`;
}

function updateAuthUi() {
  const signedIn = Boolean(authSession);
  const role = getCurrentUserRole();
  const oauthRedirectPending = Boolean(
    !signedIn
    && authBooting
    && hasSupabaseClient()
    && window.SapasSupabase.isOAuthRedirectPending
    && window.SapasSupabase.isOAuthRedirectPending()
  );
  document.body.classList.toggle("auth-required", !signedIn);
  document.body.classList.toggle("role-student", role === "student");

  if (authOverlay) authOverlay.hidden = signedIn || oauthRedirectPending;
  if (authStatus) {
    authStatus.textContent = oauthRedirectPending
      ? "Finishing Google sign-in..."
      : signedIn
      ? `Signed in as ${authProfile?.email || authSession.user?.email || "authenticated user"}`
      : "Sign in required to open the secure Supabase workspace.";
  }
  if (authRoleBadge) authRoleBadge.textContent = signedIn ? "ACTIVE" : "OFFLINE";
  if (authSignoutButton) authSignoutButton.hidden = !signedIn;
  if (signedIn) setAuthMessage("");
  updateAuthActionState();
  updateAuthModeUi();
  scheduleAuthSignupAvailabilityCheck();
}

function updateRoleBasedViewState() {
  document.querySelectorAll('[data-view="add"], [data-view="upload"]').forEach((item) => {
    item.classList.remove("is-hidden");
  });
}

async function refreshStudentsFromCloud(options = {}) {
  if (!authSession || !hasSupabaseClient()) return;
  const remoteStudents = await window.SapasSupabase.fetchStudentRecords();
  students = Array.isArray(remoteStudents) ? remoteStudents : [];
  enrichStudents();
  if (students.length) {
    const preferredStudent = options.preserveEnrollmentId
      ? students.find((item) =>
          item.enrollmentId === options.preserveEnrollmentId
          && Number(item.semester) === Number(options.preserveSemester || item.semester)
        )
      : null;
    selectedStudentId = preferredStudent ? preferredStudent.id : students[0].id;
  } else {
    selectedStudentId = null;
  }
  saveStudents();
  renderAll();
  updateRoleBasedViewState();
}

async function maybeMigrateLocalStudents() {
  if (!authSession || !canManageStudentRecords() || !hasSupabaseClient()) return;
  const remoteStudents = await window.SapasSupabase.fetchStudentRecords();
  if (Array.isArray(remoteStudents) && remoteStudents.length) {
    students = remoteStudents;
    enrichStudents();
    saveStudents();
    return;
  }

  const localStudents = getLocalStudentsForMigration();
  if (!localStudents.length) return;
  await window.SapasSupabase.importStudentRecords(localStudents, "localstorage-migration.json");
}

async function handleAuthSessionChange(session) {
  authSession = session || null;
  if (!authSession) {
    authProfile = null;
    students = [];
    selectedStudentId = null;
    renderAll();
    updateAuthUi();
    updateRoleBasedViewState();
    return;
  }

  authProfile = {
    id: authSession.user?.id || "",
    email: authSession.user?.email || "",
    role: authProfile?.role || "teacher"
  };
  updateAuthUi();
  if (authStatus) authStatus.textContent = `Signed in as ${authProfile.email || "authenticated user"}. Loading workspace...`;

  try {
    authProfile = await window.SapasSupabase.ensureProfile();
  } catch (error) {
    if (authError) authError.textContent = normalizeAuthMessage(error, "Signed in, but the cloud profile could not be prepared.");
  }
  updateAuthUi();
  try {
    await maybeMigrateLocalStudents();
    await refreshStudentsFromCloud();
  } catch (error) {
    if (authError) authError.textContent = normalizeAuthMessage(error, "Signed in, but cloud records could not be loaded.");
    renderAll();
    updateRoleBasedViewState();
  }
}

async function waitForOAuthSessionRestore() {
  if (!hasSupabaseClient() || !window.SapasSupabase.isOAuthRedirectPending || !window.SapasSupabase.getSession) {
    return null;
  }
  if (!window.SapasSupabase.isOAuthRedirectPending()) return null;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const restoredSession = await window.SapasSupabase.getSession();
    if (restoredSession) return restoredSession;
    await new Promise((resolve) => window.setTimeout(resolve, 250));
  }
  return null;
}

async function initializeSupabaseAuth() {
  authBooting = true;
  updateAuthUi();
  if (!hasSupabaseClient()) {
    if (authStatus) authStatus.textContent = "Supabase is not configured yet.";
    if (authError) authError.textContent = "Supabase client failed to load. Check the project URL, anon key, and browser internet access.";
    authBooting = false;
    updateAuthUi();
    return;
  }

  if (!authInitialized) {
    authSubscription = window.SapasSupabase.onAuthStateChange(async (_event, session) => {
      try {
        await handleAuthSessionChange(session);
      } catch (error) {
        if (authError) authError.textContent = normalizeAuthMessage(error, "Unable to refresh your authenticated session.");
      }
    });
    authInitialized = true;
  }

  try {
    let startupSession = null;
    if (window.SapasSupabase.init) {
      startupSession = await window.SapasSupabase.init();
    }
    if (!startupSession) {
      startupSession = await waitForOAuthSessionRestore();
    }
    if (!startupSession && window.SapasSupabase.resetSessionOnOpen) {
      await window.SapasSupabase.resetSessionOnOpen();
    }
    const session = startupSession || await window.SapasSupabase.getSession() || await waitForOAuthSessionRestore();
    await handleAuthSessionChange(session);
  } finally {
    authBooting = false;
    updateAuthUi();
  }

  window.SapasSupabase.getAuthSettings()
    .then((settings) => {
      authSettings = settings;
      updateAuthActionState();
    })
    .catch((error) => {
      authSettings = null;
      if (authError && !authSession) {
        authError.textContent = normalizeAuthMessage(error, "Unable to load live auth settings from Supabase.");
      }
      updateAuthActionState();
    });

  setAuthMode("signin");
}

function loadStudents() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(parsed) && parsed.length) return parsed;
    return restoreStudentsFromCsvSnapshot();
  } catch (error) {
    return restoreStudentsFromCsvSnapshot();
  }
}

function getPersistedCsvSnapshot() {
  const snapshot = localStorage.getItem(CSV_SNAPSHOT_KEY);
  if (snapshot) return snapshot;
  if (students.length) return studentsToCsv();
  return "";
}

function persistCurrentCsvSnapshot() {
  if (students.length) {
    localStorage.setItem(CSV_SNAPSHOT_KEY, studentsToCsv());
    return;
  }
  localStorage.removeItem(CSV_SNAPSHOT_KEY);
}

function hasPersistedStudentData() {
  if (students.length) return true;
  if (hasStoredCsvSnapshot()) return true;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) && parsed.length > 0;
  } catch (error) {
    return false;
  }
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  persistCurrentCsvSnapshot();
}

function normalizeEnrollmentId(value) {
  return String(value || "").trim();
}

function getStudentsByEnrollmentId(enrollmentId, options = {}) {
  const normalizedEnrollmentId = normalizeEnrollmentId(enrollmentId);
  const excludeId = options.excludeId || null;
  if (!normalizedEnrollmentId) return [];
  return students
    .filter((student) => normalizeEnrollmentId(student.enrollmentId) === normalizedEnrollmentId && (!excludeId || student.id !== excludeId))
    .sort((a, b) => Number(a.semester) - Number(b.semester) || String(a.id).localeCompare(String(b.id)));
}

function getEnteredSemestersForEnrollment(enrollmentId, options = {}) {
  return getStudentsByEnrollmentId(enrollmentId, options).map((student) => Number(student.semester));
}

function getRemainingSemestersForEnrollment(enrollmentId, options = {}) {
  const enteredSemesters = new Set(getEnteredSemestersForEnrollment(enrollmentId, options));
  return Array.from({ length: 8 }, (_, index) => index + 1).filter((semester) => !enteredSemesters.has(semester));
}

function getCurrentEditingStudent() {
  return editingStudentId ? findStudent(editingStudentId) : null;
}

function getCurrentFormEnrollmentId() {
  if (!studentForm) return "";
  const field = studentForm.elements.namedItem("enrollmentId");
  return normalizeEnrollmentId(field ? field.value : "");
}

function getEnrollmentIdDuplicate(enrollmentId = getCurrentFormEnrollmentId()) {
  const normalizedEnrollmentId = normalizeEnrollmentId(enrollmentId);
  const editingStudent = getCurrentEditingStudent();
  const editingEnrollmentId = normalizeEnrollmentId(editingOriginalEnrollmentId || editingStudent?.enrollmentId || "");
  if (!normalizedEnrollmentId || (permittedExistingEnrollmentId && normalizedEnrollmentId === permittedExistingEnrollmentId)) {
    return null;
  }
  if (editingEnrollmentId && normalizedEnrollmentId === editingEnrollmentId) {
    return null;
  }
  const matches = getStudentsByEnrollmentId(
    normalizedEnrollmentId,
    editingStudent ? { excludeId: editingStudent.id } : {}
  );
  return matches.length ? matches[0] : null;
}

function syncEnrollmentIdValidation() {
  if (!enrollmentIdField) return false;
  const normalizedEnrollmentId = normalizeEnrollmentId(enrollmentIdField.value);
  if ((semesterContinuationActive || permittedExistingEnrollmentId) && permittedExistingEnrollmentId && normalizedEnrollmentId === permittedExistingEnrollmentId) {
    enrollmentIdField.setCustomValidity("");
    enrollmentIdField.setAttribute("aria-invalid", "false");
    if (enrollmentIdFeedback) enrollmentIdFeedback.textContent = "";
    if (nextStepButton && currentStep === 1) nextStepButton.disabled = false;
    return false;
  }
  const duplicateStudent = getEnrollmentIdDuplicate(enrollmentIdField.value);
  const duplicateMessage = duplicateStudent
    ? "This enrollment ID is already registered. Try a different student ID."
    : "";
  enrollmentIdField.setCustomValidity(duplicateMessage);
  enrollmentIdField.setAttribute("aria-invalid", duplicateMessage ? "true" : "false");
  if (enrollmentIdFeedback) enrollmentIdFeedback.textContent = duplicateMessage;
  if (nextStepButton && currentStep === 1) nextStepButton.disabled = Boolean(duplicateMessage);
  return Boolean(duplicateMessage);
}

function updateAddFormHeading() {
  if (!addFormTitle || !studentForm) return;
  const editingStudent = getCurrentEditingStudent();
  if (editingStudent) {
    addFormTitle.textContent = `Add details for ${editingStudent.name || "this student"}`;
    return;
  }

  const nameField = studentForm.elements.namedItem("name");
  const typedName = String(nameField ? nameField.value : "").trim();
  const enrollmentId = getCurrentFormEnrollmentId();
  const linkedStudent = enrollmentId ? getStudentsByEnrollmentId(enrollmentId)[0] : null;
  const resolvedName = linkedStudent?.name || typedName;
  addFormTitle.textContent = resolvedName
    ? `Add details for ${resolvedName}`
    : "Add details for this student";
}

function normalizeTimelineEntryLockContext(context) {
  if (!context) return null;
  const enrollmentId = normalizeEnrollmentId(context.enrollmentId);
  if (!enrollmentId) return null;
  return {
    enrollmentId,
    level: String(context.level || "").trim(),
    department: String(context.department || "").trim(),
    program: String(context.program || "").trim(),
    semester: clamp(safeNumber(context.semester, 0), 1, 8)
  };
}

function applyStudentIdentityLockState() {
  if (!studentForm) return;
  const locked = Boolean(studentIdentityLocked);
  ["name", "enrollmentId", "email", "phone"].forEach((fieldName) => {
    const field = studentForm.elements.namedItem(fieldName);
    if (field && "readOnly" in field) {
      field.readOnly = locked;
      field.setAttribute("aria-readonly", locked ? "true" : "false");
    }
  });
  if (levelSelect) levelSelect.disabled = locked || Boolean(timelineEntryLockContext);
  if (dobDisplayButton) {
    dobDisplayButton.disabled = locked;
    dobDisplayButton.setAttribute("aria-disabled", locked ? "true" : "false");
  }
}

function setStudentIdentityLockState(isLocked) {
  studentIdentityLocked = Boolean(isLocked);
  applyStudentIdentityLockState();
}

function applyTimelineEntryLockState() {
  const context = timelineEntryLockContext;
  const hasLock = Boolean(context);
  if (enrollmentIdField) {
    enrollmentIdField.readOnly = hasLock;
    enrollmentIdField.setAttribute("aria-readonly", hasLock ? "true" : "false");
  }
  if (semesterSelect && hasLock) semesterSelect.disabled = true;
  applyStudentIdentityLockState();
}

function setTimelineEntryLockContext(context = null) {
  timelineEntryLockContext = normalizeTimelineEntryLockContext(context);
  applyTimelineEntryLockState();
}

function syncSemesterAvailability(preferredSemester = null) {
  if (!semesterSelect) return;
  const enrollmentId = getCurrentFormEnrollmentId();
  const editingStudent = getCurrentEditingStudent();
  const editingSemester = editingStudent ? Number(editingStudent.semester) : null;
  let availableSemesters = enrollmentId
    ? getRemainingSemestersForEnrollment(enrollmentId, { excludeId: editingStudent ? editingStudent.id : null })
    : Array.from({ length: 8 }, (_, index) => index + 1);

  if (editingSemester && !availableSemesters.includes(editingSemester)) {
    availableSemesters = [...availableSemesters, editingSemester].sort((a, b) => a - b);
  }

  const lockedSemester = timelineEntryLockContext ? Number(timelineEntryLockContext.semester) : null;
  if (lockedSemester && !availableSemesters.includes(lockedSemester)) {
    availableSemesters = [...availableSemesters, lockedSemester].sort((a, b) => a - b);
  }

  const preservedValue = lockedSemester
    ? String(lockedSemester)
    : preferredSemester != null
    ? String(preferredSemester)
    : String(semesterSelect.value || "");
  const placeholder = availableSemesters.length
    ? `<option value="">Select a semester</option>`
    : `<option value="">No remaining semesters available</option>`;
  semesterSelect.innerHTML = placeholder + availableSemesters
    .map((semester) => `<option value="${semester}">Semester ${semester}</option>`)
    .join("");
  semesterSelect.disabled = !availableSemesters.length;

  if (availableSemesters.map(String).includes(preservedValue)) {
    semesterSelect.value = preservedValue;
  } else {
    semesterSelect.value = "";
  }
  if (timelineEntryLockContext) semesterSelect.disabled = true;
  syncEnrollmentIdValidation();
}

function updateAddAnotherSemesterButton() {
  if (!addAnotherSemesterButton) return;
  const enrollmentId = getCurrentFormEnrollmentId();
  const editingStudent = getCurrentEditingStudent();
  const remainingSemesters = getRemainingSemestersForEnrollment(enrollmentId, { excludeId: editingStudent ? editingStudent.id : null });
  const showButton = currentStep === 3 && !editingStudent && !!enrollmentId && remainingSemesters.length > 0;
  addAnotherSemesterButton.hidden = !showButton;
  addAnotherSemesterButton.disabled = !showButton;
}

function addStudentCallToAction() {
  return students.length ? "Add Student" : "Add Your First Student";
}

function spreadsheetEngineAvailable() {
  return typeof XLSX !== "undefined" && XLSX && typeof XLSX.read === "function";
}

function uploadIdleMessage() {
  if (spreadsheetEngineAvailable()) {
    return "Choose a CSV or Excel file to enable Import Previewed Rows and Clear Preview.";
  }
  return "Choose a CSV or .xlsx file to enable Import Previewed Rows and Clear Preview. Legacy .xls support is unavailable because the local spreadsheet parser is missing.";
}

function applyDateBounds() {
  if (!dobInput) return;
  dobInput.min = "1900-01-01";
  dobInput.max = new Date().toISOString().split("T")[0];
}

function formatDobDisplay(value) {
  if (!value) return "Select date of birth";
  const [year, month, day] = String(value).split("-").map((part) => Number(part));
  if (!year || !month || !day) return "Select date of birth";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(year, month - 1, day));
}

function closeDobCalendar() {
  if (!dobCalendarPopup || !dobDisplayButton) return;
  dobCalendarPopup.hidden = true;
  dobDisplayButton.setAttribute("aria-expanded", "false");
}

function openDobCalendar() {
  if (!dobCalendarPopup || !dobDisplayButton || !dobInput) return;
  const baseDate = dobInput.value ? new Date(`${dobInput.value}T00:00:00`) : new Date();
  dobCalendarViewDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  renderDobCalendar();
  dobCalendarPopup.hidden = false;
  dobDisplayButton.setAttribute("aria-expanded", "true");
}

function syncDobDisplay() {
  if (!dobDisplayText || !dobDisplayButton || !dobInput) return;
  dobDisplayText.textContent = formatDobDisplay(dobInput.value);
  dobDisplayButton.classList.toggle("is-empty", !dobInput.value);
}

function populateDobSelectors() {
  if (!dobMonthSelect || !dobYearSelect) return;
  const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "long" });
  dobMonthSelect.innerHTML = Array.from({ length: 12 }, (_, index) => (
    `<option value="${index}">${monthFormatter.format(new Date(2000, index, 1))}</option>`
  )).join("");
  const currentYear = new Date().getFullYear();
  dobYearSelect.innerHTML = Array.from({ length: currentYear - 1899 }, (_, index) => {
    const year = currentYear - index;
    return `<option value="${year}">${year}</option>`;
  }).join("");
}

function renderDobCalendar() {
  if (!dobCalendarGrid || !dobMonthSelect || !dobYearSelect || !dobInput) return;
  const today = new Date();
  const todayValue = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const selectedValue = dobInput.value ? new Date(`${dobInput.value}T00:00:00`).getTime() : null;
  const currentYear = dobCalendarViewDate.getFullYear();
  const currentMonth = dobCalendarViewDate.getMonth();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  dobMonthSelect.value = String(currentMonth);
  dobYearSelect.value = String(currentYear);
  dobCalendarGrid.innerHTML = Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startDay + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return `<button type="button" class="calendar-day is-empty" tabindex="-1" aria-hidden="true"></button>`;
    }
    const cellDate = new Date(currentYear, currentMonth, dayNumber);
    const cellValue = cellDate.getTime();
    const isoValue = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
    const isFuture = cellValue > todayValue;
    const isSelected = selectedValue === cellValue;
    const isToday = todayValue === cellValue;
    return `
      <button
        type="button"
        class="calendar-day ${isSelected ? "is-selected" : ""} ${isToday ? "is-today" : ""}"
        data-date="${isoValue}"
        ${isFuture ? "disabled" : ""}
        aria-label="${formatDobDisplay(isoValue)}"
      >
        ${dayNumber}
      </button>
    `;
  }).join("");
}

function selectDobDate(value) {
  if (!dobInput) return;
  dobInput.value = value;
  syncDobDisplay();
  renderDobCalendar();
  closeDobCalendar();
}

function syncProgramInput(value = programSelect ? programSelect.value : "") {
  if (!programSelect || !programOtherWrap || !programOtherInput) return;
  const showOther = value === "Other";
  programOtherWrap.hidden = !showOther;
  programOtherInput.disabled = !showOther;
  programOtherInput.required = showOther;
  if (!showOther) programOtherInput.value = "";
}

function getMappedDepartmentForProgram(program) {
  return PROGRAM_DEPARTMENT_MAP[String(program || "").trim()] || "";
}

function refreshProgramOptionsByDepartment() {
  if (!programSelect) return;
  const selectedLevel = getSelectedLevelValue();
  const selectedDepartment = getSelectedDepartmentValue();
  const levelPrograms = LEVEL_PROGRAM_MAP[selectedLevel] || [];
  const isEditableStudentFlow = Boolean(editingStudentId) && !semesterContinuationActive && !timelineEntryLockContext;
  const departmentPrograms = isEditableStudentFlow
    ? levelPrograms
    : (DEPARTMENT_PROGRAM_MAP[selectedDepartment] || PROGRAM_OPTIONS);
  const allowedPrograms = [...new Set(levelPrograms.filter((program) => departmentPrograms.includes(program)))];
  const currentValue = programLockedForContinuation && lockedProgramValue
    ? lockedProgramValue
    : programSelect.value;
  const lockedOption = currentValue && !allowedPrograms.includes(currentValue) && currentValue !== "Other"
    ? [`<option value="${escapeHtml(currentValue)}">${escapeHtml(currentValue)}</option>`]
    : [];
  const options = [
    `<option value="">${selectedLevel ? "Select a program" : "Select level first"}</option>`,
    ...allowedPrograms.map((program) => `<option value="${escapeHtml(program)}">${escapeHtml(program)}</option>`),
    ...lockedOption,
    `<option value="Other">Other</option>`
  ];
  programSelect.innerHTML = options.join("");
  const allowOther = selectedLevel === "UG";
  if (!allowOther) {
    programSelect.innerHTML = [
      `<option value="">${selectedLevel ? "Select a program" : "Select level first"}</option>`,
      ...allowedPrograms.map((program) => `<option value="${escapeHtml(program)}">${escapeHtml(program)}</option>`),
      ...lockedOption
    ].join("");
  }
  const isCurrentAllowed = (allowOther && currentValue === "Other") || allowedPrograms.includes(currentValue) || lockedOption.length > 0;
  programSelect.value = isCurrentAllowed ? currentValue : "";
  programSelect.disabled = programLockedForContinuation || !selectedLevel;
  syncProgramInput(programSelect.value);
}

function syncDepartmentInput(value = departmentSelect ? departmentSelect.value : "") {
  if (!departmentSelect || !departmentOtherWrap || !departmentOtherInput) return;
  const showOther = value === "Other";
  departmentOtherWrap.hidden = !showOther;
  departmentOtherInput.disabled = !showOther;
  departmentOtherInput.required = showOther;
  if (!showOther) departmentOtherInput.value = "";
}

function syncDepartmentStateFromProgram() {
  if (!departmentSelect) return;
  if (timelineEntryLockContext?.department) {
    const lockedDepartment = timelineEntryLockContext.department;
    if (DEPARTMENT_OPTIONS.includes(lockedDepartment)) {
      departmentSelect.value = lockedDepartment;
      syncDepartmentInput(lockedDepartment);
    } else if (lockedDepartment) {
      departmentSelect.value = "Other";
      syncDepartmentInput("Other");
      if (departmentOtherInput) departmentOtherInput.value = lockedDepartment;
    }
    departmentSelect.disabled = true;
    if (departmentOtherInput) departmentOtherInput.disabled = true;
    return;
  }
  if (departmentLockedForContinuation) {
    const continuationDepartment = String(lockedDepartmentValue || "").trim();
    if (DEPARTMENT_OPTIONS.includes(continuationDepartment)) {
      departmentSelect.value = continuationDepartment;
      syncDepartmentInput(continuationDepartment);
    } else if (continuationDepartment) {
      departmentSelect.value = "Other";
      syncDepartmentInput("Other");
      if (departmentOtherInput) departmentOtherInput.value = continuationDepartment;
    }
    departmentSelect.disabled = true;
    if (departmentOtherInput) departmentOtherInput.disabled = true;
    return;
  }
  const mappedDepartment = getMappedDepartmentForProgram(getSelectedProgramValue());
  const shouldLockDepartment = !!mappedDepartment;
  departmentSelect.disabled = shouldLockDepartment;
  if (shouldLockDepartment) {
    departmentSelect.value = mappedDepartment;
    syncDepartmentInput(mappedDepartment);
  } else {
    departmentSelect.disabled = false;
    syncDepartmentInput(departmentSelect.value);
  }
}

function getSelectedProgramValue() {
  if (!programSelect) return "";
  if (programSelect.value === "Other") {
    return String(programOtherInput ? programOtherInput.value : "").trim();
  }
  return String(programSelect.value || "").trim();
}

function setProgramLockState(isLocked, programValue = "") {
  programLockedForContinuation = isLocked;
  lockedProgramValue = isLocked ? String(programValue || getSelectedProgramValue()).trim() : "";
  if (programSelect) programSelect.disabled = isLocked || !!timelineEntryLockContext || !getSelectedLevelValue();
  if (programOtherInput && programSelect) {
    programOtherInput.disabled = isLocked || !!timelineEntryLockContext || programSelect.value !== "Other";
  }
}

function setDepartmentLockState(isLocked, departmentValue = "") {
  departmentLockedForContinuation = Boolean(isLocked);
  lockedDepartmentValue = departmentLockedForContinuation
    ? String(departmentValue || getSelectedDepartmentValue()).trim()
    : "";
  syncDepartmentStateFromProgram();
}

function getSelectedDepartmentValue() {
  if (!departmentSelect) return "";
  if (departmentSelect.value === "Other") {
    return String(departmentOtherInput ? departmentOtherInput.value : "").trim();
  }
  return String(departmentSelect.value || "").trim();
}

function getSelectedSemesterValue() {
  const semesterField = studentForm ? studentForm.elements.namedItem("semester") : null;
  return Number(safeNumber(semesterField ? semesterField.value : 0, 0));
}

function getSelectedLevelValue() {
  return String(levelSelect ? levelSelect.value : "").trim();
}

function getCurrentSubjectRowCount() {
  return subjectsList ? subjectsList.querySelectorAll(".subject-row").length : 0;
}

function getExpectedSubjectCountForCurrentSelection() {
  const program = getSelectedProgramValue();
  const semester = getSelectedSemesterValue();
  const catalog = SUBJECT_CATALOG[program];
  const semesterSubjects = catalog && Array.isArray(catalog[semester]) ? catalog[semester] : null;
  return semesterSubjects && semesterSubjects.length ? semesterSubjects.length : 0;
}

function getBacklogLimitForCurrentForm() {
  const expectedSubjects = getExpectedSubjectCountForCurrentSelection();
  if (expectedSubjects > 0) return expectedSubjects;
  const currentRows = getCurrentSubjectRowCount();
  return currentRows > 0 ? currentRows : 0;
}

function updateBacklogLimit() {
  if (!backlogsInput) return;
  const backlogLimit = getBacklogLimitForCurrentForm();
  const effectiveLimit = backlogLimit > 0 ? backlogLimit : 20;
  backlogsInput.max = String(effectiveLimit);
  backlogsInput.placeholder = `0-${effectiveLimit}`;
  const currentValue = clamp(safeNumber(backlogsInput.value, 0), 0, effectiveLimit);
  if (String(backlogsInput.value || "").trim() !== "" && String(currentValue) !== String(backlogsInput.value)) {
    backlogsInput.value = String(currentValue);
  }
  if (backlogLimit > 0 && safeNumber(backlogsInput.value, 0) > backlogLimit) {
    backlogsInput.setCustomValidity(`Backlogs cannot exceed the number of subjects in this semester (${backlogLimit}).`);
  } else {
    backlogsInput.setCustomValidity("");
  }
}

function validateBacklogLimit() {
  if (!backlogsInput) return true;
  updateBacklogLimit();
  const backlogLimit = getBacklogLimitForCurrentForm();
  if (!backlogLimit) return true;
  const backlogs = safeNumber(backlogsInput.value, 0);
  if (backlogs > backlogLimit) {
    backlogsInput.reportValidity();
    formError.textContent = `Backlogs cannot be more than ${backlogLimit} for this semester because ${backlogLimit} subject${backlogLimit === 1 ? "" : "s"} are entered.`;
    return false;
  }
  return true;
}

function hasValidProgramDepartmentMapping(program, department) {
  const normalizedProgram = String(program || "").trim();
  const normalizedDepartment = String(department || "").trim();
  if (!normalizedProgram || !normalizedDepartment) return true;
  const mappedDepartment = getMappedDepartmentForProgram(normalizedProgram);
  return !mappedDepartment || mappedDepartment === normalizedDepartment;
}

function hasValidProgramLevelMapping(program, level) {
  const normalizedProgram = String(program || "").trim();
  const normalizedLevel = String(level || "").trim();
  if (!normalizedProgram || !normalizedLevel) return true;
  const allowedPrograms = LEVEL_PROGRAM_MAP[normalizedLevel];
  return Array.isArray(allowedPrograms) ? allowedPrograms.includes(normalizedProgram) : true;
}

function getAvailableSubjects(program, department, semester) {
  const normalizedProgram = String(program || "").trim();
  const normalizedDepartment = String(department || "").trim();
  const semesterValue = Number(safeNumber(semester, 0));
  if (!normalizedProgram || !semesterValue) return [];
  const departmentPrograms = DEPARTMENT_PROGRAM_MAP[normalizedDepartment];
  if (Array.isArray(departmentPrograms) && departmentPrograms.length && !departmentPrograms.includes(normalizedProgram)) {
    return [];
  }
  const catalog = SUBJECT_CATALOG[normalizedProgram];
  if (!catalog) return FALLBACK_SUBJECTS;
  const scopedSubjects = Array.isArray(catalog[semesterValue]) ? catalog[semesterValue] : Array.isArray(catalog.default) ? catalog.default : [];
  const cleanedSubjects = [...new Set(scopedSubjects.map((subject) => String(subject || "").trim()).filter(Boolean))];
  return cleanedSubjects.length ? cleanedSubjects : FALLBACK_SUBJECTS;
}

function updateSubjectDropdownOptions() {
  if (!subjectsList) return;
  const program = getSelectedProgramValue();
  const department = getSelectedDepartmentValue();
  const semester = getSelectedSemesterValue();
  const subjects = getAvailableSubjects(program, department, semester);
  const isEditableStudentFlow = Boolean(editingStudentId) && !semesterContinuationActive && !timelineEntryLockContext;
  const hasValidAcademicContext = !!program && !!semester && (
    isEditableStudentFlow
      || !DEPARTMENT_PROGRAM_MAP[department]
      || DEPARTMENT_PROGRAM_MAP[department].includes(program)
  );
  const placeholderText = !program || !semester
    ? "Select department, program, and semester first"
    : subjects.length
      ? "Select subject"
      : "Select structured fallback subject";
  const selectedSubjects = Array.from(subjectsList.querySelectorAll('select[data-field="subject"]'))
    .map((select) => String(select.dataset.preservedValue || select.value || "").trim())
    .filter(Boolean);
  Array.from(subjectsList.querySelectorAll('select[data-field="subject"]')).forEach((select) => {
    const currentValue = String(select.dataset.preservedValue || select.value || "").trim();
    const optionSet = subjects.filter((subject) => subject === currentValue || !selectedSubjects.includes(subject));
    const preservedOptionSet = currentValue && !optionSet.includes(currentValue)
      ? [currentValue, ...optionSet]
      : optionSet;
    select.innerHTML = [
      `<option value="">${placeholderText}</option>`,
      ...preservedOptionSet.map((subject) => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`)
    ].join("");
    select.disabled = !hasValidAcademicContext;
    select.value = currentValue && preservedOptionSet.includes(currentValue) ? currentValue : "";
    select.dataset.preservedValue = select.value || "";
  });
}

function uid() {
  return `SAPAS-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function average(list, selector) {
  return list.length ? list.reduce((sum, item) => sum + selector(item), 0) / list.length : 0;
}

function formatValue(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function phoneValidationMessage() {
  return "Invalid phone number: Please enter a valid 10-digit mobile number.";
}

function normalizeStoredPhone(value) {
  const raw = String(value || "").trim();
  if (/^\d{10}$/.test(raw)) return raw;
  const digitsOnly = raw.replace(/\D/g, "");
  if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) return digitsOnly.slice(2);
  if (digitsOnly.length === 10) return digitsOnly;
  return raw;
}

function isValidPhoneNumber(value) {
  return /^\d{10}$/.test(String(value || "").trim());
}

function syncPhoneInput() {
  if (!phoneInput) return;
  const digitsOnly = String(phoneInput.value || "").replace(/\D/g, "");
  const trimmed = digitsOnly.slice(0, 10);
  if (phoneInput.value !== trimmed) phoneInput.value = trimmed;
  if (!trimmed.length) {
    phoneInput.setCustomValidity("");
    return;
  }
  phoneInput.setCustomValidity(isValidPhoneNumber(trimmed) ? "" : phoneValidationMessage());
}

function normalizeTextOnlyValue(value) {
  return String(value || "")
    .replace(/[^A-Za-z ]+/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^\s+/g, "");
}

function isValidTextOnlyValue(value) {
  const trimmed = String(value || "").trim();
  return !!trimmed && /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(trimmed);
}

function sanitizeNumericValue(value, mode = "decimal") {
  const raw = String(value || "");
  if (mode === "digits" || mode === "integer") {
    const digitsOnly = raw.replace(/\D+/g, "");
    if (!digitsOnly.length) return "";
    return digitsOnly.replace(/^0+(?=\d)/, "");
  }
  const cleaned = raw.replace(/[^\d.]+/g, "");
  const parts = cleaned.split(".");
  const integerPart = (parts[0] || "").replace(/^0+(?=\d)/, "");
  if (parts.length <= 1) return integerPart;
  const decimalPart = parts.slice(1).join("");
  if (!integerPart.length) return decimalPart.length ? `0.${decimalPart}` : "0";
  return `${integerPart}.${decimalPart}`;
}

function syncTextOnlyInput(input) {
  if (!input) return;
  const normalized = normalizeTextOnlyValue(input.value);
  if (input.value !== normalized) input.value = normalized;
  if (!normalized.trim()) {
    input.setCustomValidity(input.required ? "This field is required and accepts only letters and spaces." : "");
    return;
  }
  input.setCustomValidity(isValidTextOnlyValue(normalized) ? "" : "Only letters and spaces are allowed.");
}

function syncNumericInput(input) {
  if (!input) return;
  const mode = input.dataset.numericMode || "decimal";
  const sanitized = sanitizeNumericValue(input.value, mode);
  if (input.value !== sanitized) input.value = sanitized;
  if (!sanitized.length) {
    input.setCustomValidity(input.required ? "Enter a valid number within the allowed range." : "");
    return;
  }
  const numericValue = Number(sanitized);
  if (!Number.isFinite(numericValue)) {
    input.setCustomValidity("Only numeric values are allowed.");
    return;
  }
  const min = input.min === "" ? null : Number(input.min);
  const max = input.max === "" ? null : Number(input.max);
  const minMessage = input.dataset.rangeMessageMin || `Value must be at least ${min}.`;
  const maxMessage = input.dataset.rangeMessageMax || `Value must be at most ${max}.`;
  if (min != null && numericValue < min) {
    input.value = String(min);
    input.setCustomValidity(minMessage);
    input.reportValidity();
    input.setCustomValidity("");
    return;
  }
  if (max != null && numericValue > max) {
    input.value = String(max);
    input.setCustomValidity(maxMessage);
    input.reportValidity();
    input.setCustomValidity("");
    return;
  }
  if (mode === "digits" && input.maxLength > 0 && sanitized.length !== input.maxLength) {
    input.setCustomValidity(phoneValidationMessage());
    return;
  }
  input.setCustomValidity("");
}

function applyInputRestrictions(root = document) {
  root.querySelectorAll("input[data-text-only='true']").forEach((input) => {
    if (input.dataset.validationBound === "true") return;
    input.dataset.validationBound = "true";
    syncTextOnlyInput(input);
    input.addEventListener("input", () => syncTextOnlyInput(input));
    input.addEventListener("blur", () => syncTextOnlyInput(input));
  });
  root.querySelectorAll("input[data-numeric-mode]").forEach((input) => {
    if (input.dataset.validationBound === "true") return;
    input.dataset.validationBound = "true";
    syncNumericInput(input);
    input.addEventListener("input", () => syncNumericInput(input));
    input.addEventListener("blur", () => syncNumericInput(input));
  });
}

function combinedTotalToFinalScore(total) {
  return clamp(Number(safeNumber(total, 0).toFixed(2)), 0, MARK_LIMITS.finalScore);
}

function scaleLegacyAssignments(value) {
  return clamp(Number(safeNumber(value, 0).toFixed(2)), 0, MARK_LIMITS.assignments);
}

function scaleLegacyExternal(value) {
  return clamp(Number(safeNumber(value, 0).toFixed(2)), 0, MARK_LIMITS.external);
}

function scaleExpandedAssignments(value) {
  return clamp(
    Number(((safeNumber(value, 0) / EXPANDED_MARK_LIMITS.assignments) * MARK_LIMITS.assignments).toFixed(2)),
    0,
    MARK_LIMITS.assignments
  );
}

function scaleExpandedExternal(value) {
  return clamp(
    Number(((safeNumber(value, 0) / EXPANDED_MARK_LIMITS.external) * MARK_LIMITS.external).toFixed(2)),
    0,
    MARK_LIMITS.external
  );
}

function looksLikeExpandedScheme(assignments, external, total = "") {
  const hasAssignments = assignments != null && assignments !== "";
  const hasExternal = external != null && external !== "";
  const hasTotal = total != null && total !== "";
  return (
    (hasAssignments && safeNumber(assignments, 0) > MARK_LIMITS.assignments) ||
    (hasExternal && safeNumber(external, 0) > MARK_LIMITS.external) ||
    (hasTotal && safeNumber(total, 0) > MARK_LIMITS.total)
  );
}

function normalizeCompositeTotal(total, { legacyScheme = false, percentageBased = false, expandedScheme = false } = {}) {
  const rawTotal = safeNumber(total, 0);
  if (percentageBased || legacyScheme) {
    return clamp(Number(rawTotal.toFixed(2)), 0, MARK_LIMITS.total);
  }
  if (expandedScheme || rawTotal > MARK_LIMITS.total) {
    return clamp(
      Number(((rawTotal / EXPANDED_MARK_LIMITS.total) * MARK_LIMITS.total).toFixed(2)),
      0,
      MARK_LIMITS.total
    );
  }
  return clamp(Number(rawTotal.toFixed(2)), 0, MARK_LIMITS.total);
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getGrade(finalScore) {
  const score = clamp(safeNumber(finalScore, 0), 0, MARK_LIMITS.finalScore);
  if (score >= 90) return { grade: "O", points: 10, label: "Outstanding" };
  if (score >= 80) return { grade: "A+", points: 9, label: "Excellent" };
  if (score >= 70) return { grade: "A", points: 8, label: "Very Good" };
  if (score >= 60) return { grade: "B+", points: 7, label: "Good" };
  if (score >= 55) return { grade: "B", points: 6, label: "Above Average" };
  if (score >= 50) return { grade: "C", points: 5, label: "Average" };
  if (score >= 45) return { grade: "P", points: 4, label: "Pass" };
  return { grade: "F", points: 0, label: "Fail" };
}

function attendanceStatus(level, attendance) {
  const value = Number(attendance);
  if (level === "PG") {
    if (value >= 70) return "Eligible";
    if (value >= 60) return "Condonable";
    return "Detained";
  }
  if (value >= 75) return "Eligible";
  if (value >= 65) return "Condonable";
  return "Detained";
}

function performanceCategory(cgpa, attendance) {
  if (cgpa >= 8.5 && attendance >= 85) return "Excellent";
  if (cgpa >= 7 && attendance >= 75) return "Good";
  if (cgpa >= 5 && attendance >= 75) return "Average";
  if (cgpa < 4 || attendance < 65) return "Critical";
  return "At-Risk";
}

function divisionFromCgpa(cgpa) {
  if (cgpa >= 9) return "Outstanding";
  if (cgpa >= 8) return "First Class with Distinction";
  if (cgpa >= 6.5) return "First Class";
  if (cgpa >= 5) return "Pass";
  if (cgpa >= 4) return "Third Class";
  return "Fail";
}

function normalizeStudent(rawStudent) {
  const previousCgpa = rawStudent.previousCgpa == null || rawStudent.previousCgpa === ""
    ? null
    : clamp(safeNumber(rawStudent.previousCgpa, 0), 0, 10);
  return {
    id: rawStudent.id || uid(),
    previousCgpa,
    name: String(rawStudent.name || "").trim(),
    enrollmentId: String(rawStudent.enrollmentId || "").trim(),
    email: String(rawStudent.email || "").trim(),
    phone: normalizeStoredPhone(rawStudent.phone),
    level: rawStudent.level === "PG" ? "PG" : "UG",
    dob: rawStudent.dob || "",
    program: String(rawStudent.program || "").trim(),
    department: String(rawStudent.department || "").trim(),
    semester: clamp(safeNumber(rawStudent.semester, 1), 1, 8),
    studyHours: clamp(safeNumber(rawStudent.studyHours, 0), 0, 80),
    attendance: clamp(safeNumber(rawStudent.attendance, 0), 0, 100),
    backlogs: clamp(safeNumber(rawStudent.backlogs, 0), 0, 20),
    subjects: Array.isArray(rawStudent.subjects)
      ? rawStudent.subjects
          .map((subject) => {
            const legacyScheme = subject.assignments == null && subject.internal != null;
            const expandedScheme = !legacyScheme && looksLikeExpandedScheme(
              subject.assignments ?? subject.internal,
              subject.external,
              subject.combinedTotal ?? subject.total ?? subject.finalScore
            );
            const assignmentsValue = legacyScheme
              ? scaleLegacyAssignments(subject.internal)
              : expandedScheme
                ? scaleExpandedAssignments(subject.assignments ?? subject.internal)
              : safeNumber(subject.assignments ?? subject.internal, 0);
            const externalValue = legacyScheme
              ? scaleLegacyExternal(subject.external)
              : expandedScheme
                ? scaleExpandedExternal(subject.external)
              : safeNumber(subject.external, 0);
            return {
              subject: String(subject.subject || "").trim(),
              credits: clamp(safeNumber(subject.credits, 4), MARK_LIMITS.creditsMin, MARK_LIMITS.creditsMax),
              assignments: clamp(assignmentsValue, 0, MARK_LIMITS.assignments),
              external: clamp(externalValue, 0, MARK_LIMITS.external)
            };
          })
          .filter((subject) => subject.subject)
      : []
  };
}

function computeStudentMetrics(rawStudent, options = {}) {
  const student = normalizeStudent(rawStudent);
  const previousCgpa = options.previousCgpa == null || options.previousCgpa === ""
    ? null
    : clamp(safeNumber(options.previousCgpa, 0), 0, 10);
  const subjects = student.subjects.map((subject) => {
    const combinedTotal = subject.assignments + subject.external;
    const finalScore = combinedTotalToFinalScore(combinedTotal);
    const meta = getGrade(finalScore);
    return { ...subject, combinedTotal, total: finalScore, finalScore, ...meta };
  });
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
  const weightedPoints = subjects.reduce((sum, subject) => sum + subject.points * subject.credits, 0);
  const weightedMarks = subjects.reduce((sum, subject) => sum + subject.finalScore * subject.credits, 0);
  const sgpa = totalCredits ? Number((weightedPoints / totalCredits).toFixed(2)) : 0;
  const semesterCount = Math.max(student.semester, 1);
  const previousSemesters = Math.max(student.semester - 1, 0);
  const hasPreviousSemesterCgpa = student.semester <= 1 || previousCgpa != null;
  const cgpa = hasPreviousSemesterCgpa
    ? Number(((((safeNumber(previousCgpa, 0) * previousSemesters) + sgpa) / semesterCount)).toFixed(2))
    : sgpa;
  return {
    ...student,
    previousCgpa,
    subjects,
    totalCredits,
    weightedMarks,
    sgpa,
    cgpa,
    percentage: Number((cgpa * 9.5).toFixed(2)),
    division: divisionFromCgpa(cgpa),
    attendanceStatus: attendanceStatus(student.level, student.attendance),
    category: performanceCategory(cgpa, student.attendance)
  };
}

function applyMarkScheme() {
  const predAssignmentsLabel = document.getElementById("pred-assignments-label");
  const predExternalLabel = document.getElementById("pred-external-label");
  const subjectMarkingNote = document.getElementById("subject-marking-note");
  const subjectInternalHeader = document.getElementById("subject-header-internal");
  const subjectExternalHeader = document.getElementById("subject-header-external");
  if (predAssignmentsLabel) predAssignmentsLabel.textContent = `Internal Assessment (Assignments) (0-${MARK_LIMITS.assignments})`;
  if (predExternalLabel) predExternalLabel.textContent = `External Examination Marks (0-${MARK_LIMITS.external})`;
  if (subjectMarkingNote) {
    subjectMarkingNote.textContent = `Strict validation applied: Internal (0-${MARK_LIMITS.assignments}) and External (0-${MARK_LIMITS.external}). Values outside limits are not allowed.`;
  }
  if (subjectInternalHeader) subjectInternalHeader.textContent = `Internal (0-${MARK_LIMITS.assignments})`;
  if (subjectExternalHeader) subjectExternalHeader.textContent = `External (0-${MARK_LIMITS.external})`;
  document.querySelectorAll('[data-field="assignments"]').forEach((input) => {
    input.max = String(MARK_LIMITS.assignments);
    input.placeholder = `0-${MARK_LIMITS.assignments}`;
    input.setAttribute("aria-label", `Internal (0-${MARK_LIMITS.assignments})`);
  });
  document.querySelectorAll('[data-field="external"]').forEach((input) => {
    input.max = String(MARK_LIMITS.external);
    input.placeholder = `0-${MARK_LIMITS.external}`;
    input.setAttribute("aria-label", `External (0-${MARK_LIMITS.external})`);
  });
  const predAssignments = document.getElementById("pred-assignments");
  const predExternal = document.getElementById("pred-external");
  if (predAssignments) {
    predAssignments.max = String(MARK_LIMITS.assignments);
    predAssignments.value = String(clamp(safeNumber(predAssignments.value, 0), 0, MARK_LIMITS.assignments));
  }
  if (predExternal) {
    predExternal.max = String(MARK_LIMITS.external);
    predExternal.value = String(clamp(safeNumber(predExternal.value, 0), 0, MARK_LIMITS.external));
  }
  const predAssignmentsValue = document.getElementById("pred-assignments-value");
  const predExternalValue = document.getElementById("pred-external-value");
  if (predAssignments && predAssignmentsValue) predAssignmentsValue.textContent = predAssignments.value;
  if (predExternal && predExternalValue) predExternalValue.textContent = predExternal.value;
}

function buildSemesterHistory(student) {
  if (Array.isArray(student.semesterRecords) && student.semesterRecords.length) {
    return [...student.semesterRecords]
      .sort((a, b) => Number(a.semester) - Number(b.semester))
      .map((record) => ({
        label: `S${record.semester}`,
        value: safeNumber(record.sgpa, 0)
      }));
  }
  if (student.semester <= 1) return [{ label: "S1", value: student.sgpa }];
  const history = [];
  for (let semesterIndex = 1; semesterIndex < student.semester; semesterIndex += 1) {
    history.push({ label: `S${semesterIndex}`, value: student.previousCgpa });
  }
  history.push({ label: `S${student.semester}`, value: student.sgpa });
  return history;
}

function buildProfileStudent(anchorStudent) {
  if (!anchorStudent) return null;
  const semesterRecords = getStudentsByEnrollmentId(anchorStudent.enrollmentId);
  if (!semesterRecords.length) return anchorStudent;
  const latestRecord = [...semesterRecords].sort((a, b) => Number(b.semester) - Number(a.semester) || String(b.id).localeCompare(String(a.id)))[0];
  return {
    ...latestRecord,
    semesterRecords,
    currentRecord: latestRecord,
    anchorRecordId: anchorStudent.id
  };
}

function getSubjectColumns(limit) {
  const headers = [];
  for (let index = 1; index <= limit; index += 1) {
    headers.push(`subject${index}`, `credits${index}`, `assignments${index}`, `external${index}`, `total${index}`, `grade${index}`);
  }
  return headers;
}

function studentsToExportRows(sourceStudents = students) {
  const normalizedStudents = Array.isArray(sourceStudents) ? sourceStudents : [];
  const subjectLimit = Math.max(...normalizedStudents.map((student) => student.subjects.length), 1);
  const headers = [
    "name", "enrollmentId", "email", "phone", "level", "dob",
    "program", "department", "semester", "studyHours", "attendance", "backlogs",
    "previousCgpa", "sgpa", "cgpa", "percentage", "division", "category", "rank", "totalCredits",
    ...getSubjectColumns(subjectLimit)
  ];
  const rows = normalizedStudents.map((student) => {
    const row = {
      name: student.name,
      enrollmentId: student.enrollmentId,
      email: student.email,
      phone: student.phone,
      level: student.level,
      dob: student.dob,
      program: student.program,
      department: student.department,
      semester: student.semester,
      studyHours: student.studyHours,
      attendance: student.attendance,
      backlogs: student.backlogs,
      previousCgpa: student.previousCgpa,
      sgpa: student.sgpa,
      cgpa: student.cgpa,
      percentage: student.percentage,
      division: student.division,
      category: student.category,
      rank: student.rank,
      totalCredits: student.totalCredits
    };
    student.subjects.forEach((subject, subjectIndex) => {
      const slot = subjectIndex + 1;
      row[`subject${slot}`] = subject.subject;
      row[`credits${slot}`] = subject.credits;
      row[`assignments${slot}`] = subject.assignments;
      row[`external${slot}`] = subject.external;
      row[`total${slot}`] = subject.total;
      row[`grade${slot}`] = subject.grade;
    });
    return row;
  });
  return { headers, rows };
}

function rowsToCsv(headers, rows) {
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => `"${String(row[header] == null ? "" : row[header]).replace(/"/g, '""')}"`).join(","))
  ].join("\n");
}

function studentsToCsv(sourceStudents = students) {
  const { headers, rows } = studentsToExportRows(sourceStudents);
  return rowsToCsv(headers, rows);
}

function buildTemplateCsv() {
  const headers = [
    "name", "enrollmentId", "email", "phone", "level", "dob",
    "program", "department", "semester", "studyHours", "attendance", "backlogs",
    ...getSubjectColumns(4)
  ];
  const example = {
    name: "Aarav Sharma",
    enrollmentId: "UG2026-001",
    email: "aarav@example.edu",
    phone: "9876543210",
    level: "UG",
    dob: "2006-05-10",
    program: "B.Sc (Bachelor of Science)",
    department: "School of Sciences",
    semester: 2,
    studyHours: 16,
    attendance: 88,
    backlogs: 0,
    subject1: "Python",
    credits1: 4,
    assignments1: 31,
    external1: 50,
    total1: 81,
    grade1: "A+",
    subject2: "Finance",
    credits2: 4,
    assignments2: 28,
    external2: 47,
    total2: 75,
    grade2: "A",
    subject3: "ACAC",
    credits3: 3,
    assignments3: 26,
    external3: 46,
    total3: 72,
    grade3: "A"
  };
  return rowsToCsv(headers, [example]);
}

function renderStoredCsvPreview() {
  const csv = getPersistedCsvSnapshot();
  renderRevertPointState();
  if (!csv) {
    storageStatus.textContent = "No CSV snapshot is currently saved.";
    storedCsvPreview.innerHTML = `<p class="table-meta">Saved student records will appear here.</p>`;
    setCurrentCsvDownloadDisabled(!getCurrentCsvDownloadConfig());
    return;
  }
  const rows = rowsToObjects(parseCsv(csv));
  const headers = rows.length
    ? Object.keys(rows[0]).filter((header) => {
        const match = header.match(/^(subject|credits|assignments|external|total|grade)(\d+)$/i);
        return !match || Number(match[2]) <= 1;
      })
    : [];
  storageStatus.textContent = `${Math.max(csv.split("\n").length - 1, 0)} row(s) are currently saved in the CSV snapshot below.`;
  setCurrentCsvDownloadDisabled(false);
  storedCsvPreview.innerHTML = `
    <table>
      <thead>
        <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows.slice(0, 5).map((row) => `<tr>${headers.map((header) => `<td>${escapeHtml(row[header])}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
    <p class="table-meta preview-note">CSV mirror saved in the app: ${csv.split("\n").length - 1} row(s).</p>
  `;
}

function hasStoredCsvSnapshot() {
  return Boolean(getPersistedCsvSnapshot());
}

function revokeDownloadUrl(link) {
  if (!link) return;
  const previousUrl = link.dataset.downloadUrl;
  if (previousUrl && previousUrl.startsWith("blob:")) URL.revokeObjectURL(previousUrl);
  delete link.dataset.downloadUrl;
}

function setDownloadLinkState(link, { filename = "", content = "", type = "text/csv;charset=utf-8", enabled = false } = {}) {
  if (!link) return;
  revokeDownloadUrl(link);
  if (!enabled) {
    if ("disabled" in link) link.disabled = true;
    link.setAttribute("aria-disabled", "true");
    link.classList.add("is-disabled");
    link.tabIndex = -1;
    return;
  }

  if ("disabled" in link) link.disabled = false;
  link.removeAttribute("aria-disabled");
  link.classList.remove("is-disabled");
  link.tabIndex = 0;
}

function syncTemplateDownloadLinks() {
  const content = buildTemplateCsv();
  const config = {
    filename: "students-template.csv",
    content,
    type: "text/csv;charset=utf-8",
    enabled: true
  };
  setDownloadLinkState(downloadTemplateButton, config);
  setDownloadLinkState(downloadTemplateSavedButton, config);
}

function setCurrentCsvDownloadDisabled(disabled) {
  if (disabled) {
    setDownloadLinkState(downloadStorageCsvButton, { enabled: false });
    setDownloadLinkState(downloadStorageCsvSavedButton, { enabled: false });
    return;
  }
  handleDownloadCurrentCsv();
}

function getCurrentCsvDownloadConfig() {
  const csv = buildPreviewCsv() || getPersistedCsvSnapshot();
  if (!csv) return null;
  return {
    filename: pendingCsvPreviewRows.length ? pendingCsvFilename : "students-data.csv",
    content: csv,
    type: "text/csv;charset=utf-8",
    enabled: true
  };
}

function handleDownloadCurrentCsv() {
  const config = getCurrentCsvDownloadConfig();
  if (!config) {
    setCurrentCsvDownloadDisabled(true);
    return;
  }
  setDownloadLinkState(downloadStorageCsvButton, config);
  setDownloadLinkState(downloadStorageCsvSavedButton, config);
}

function triggerDirectBrowserDownload(filename, content, type = "text/csv;charset=utf-8") {
  if (!filename || content == null) return false;
  const normalizedType = String(type || "text/csv;charset=utf-8");
  const payload = "\uFEFF" + String(content);

  if (window.navigator && typeof window.navigator.msSaveOrOpenBlob === "function") {
    const blob = new Blob([payload], { type: normalizedType });
    window.navigator.msSaveOrOpenBlob(blob, filename);
    return true;
  }

  const anchor = document.createElement("a");
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";

  if (window.location.protocol === "file:") {
    anchor.href = `data:${normalizedType},${encodeURIComponent(payload)}`;
    document.body.appendChild(anchor);
    anchor.click();
    window.setTimeout(() => anchor.remove(), 300);
    return true;
  }

  const blob = new Blob([payload], { type: normalizedType });
  const url = URL.createObjectURL(blob);
  anchor.href = url;
  document.body.appendChild(anchor);
  anchor.click();
  window.setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 1000);
  return true;
}

function submitCsvDownload(filename, content) {
  if (!filename || content == null || !String(content).trim()) return false;

  const canUseLocalDownloadServer =
    window.location.protocol !== "file:"
    && /^https?:$/i.test(window.location.protocol)
    && window.location.origin === "http://127.0.0.1:8876";

  if (!canUseLocalDownloadServer) {
    void downloadText(filename, String(content ?? ""), "text/csv;charset=utf-8");
    return true;
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = DOWNLOAD_SERVER_URL;
  form.acceptCharset = "utf-8";
  form.enctype = "application/x-www-form-urlencoded";
  form.style.display = "none";

  const filenameInput = document.createElement("input");
  filenameInput.type = "hidden";
  filenameInput.name = "filename";
  filenameInput.value = filename;

  const contentInput = document.createElement("input");
  contentInput.type = "hidden";
  contentInput.name = "content";
  contentInput.value = content;

  form.appendChild(filenameInput);
  form.appendChild(contentInput);
  document.body.appendChild(form);
  try {
    form.submit();
  } catch (error) {
    form.remove();
    return triggerDirectBrowserDownload(filename, content, "text/csv;charset=utf-8");
  }
  window.setTimeout(() => form.remove(), 1500);
  return true;
}

function downloadCsvFile(filename, content, type = "text/csv;charset=utf-8") {
  if (!filename || content == null) return false;
  const normalizedType = String(type || "text/csv;charset=utf-8");
  const csvPayload = "\uFEFF" + String(content);
  const blob = new Blob([csvPayload], { type: normalizedType });

  if (window.navigator && typeof window.navigator.msSaveOrOpenBlob === "function") {
    window.navigator.msSaveOrOpenBlob(blob, filename);
    return true;
  }

  // Direct file:// pages can be stricter with blob downloads, so use a data URL there.
  if (window.location.protocol === "file:") {
    const anchor = document.createElement("a");
    anchor.href = `data:${normalizedType};base64,${btoa(unescape(encodeURIComponent(csvPayload)))}`;
    anchor.download = filename;
    anchor.rel = "noopener";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    window.setTimeout(() => anchor.remove(), 300);
    return true;
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  window.setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 1500);
  return true;
}

function rankStudents(items) {
  const sorted = [...items].sort((a, b) => {
    if (b.cgpa !== a.cgpa) return b.cgpa - a.cgpa;
    if (b.weightedMarks !== a.weightedMarks) return b.weightedMarks - a.weightedMarks;
    return Number(b.attendance) - Number(a.attendance);
  });
  let rank = 0;
  let previous = "";
  return sorted.map((student) => {
    const key = `${student.cgpa}-${student.weightedMarks}-${student.attendance}`;
    if (key !== previous) {
      rank += 1;
      previous = key;
    }
    return { ...student, rank };
  });
}

function enrichStudents() {
  const computedStudents = [];
  const groups = new Map();

  students
    .map(normalizeStudent)
    .forEach((student) => {
      const groupKey = normalizeEnrollmentId(student.enrollmentId) || `__student__${student.id}`;
      if (!groups.has(groupKey)) groups.set(groupKey, []);
      groups.get(groupKey).push(student);
    });

  groups.forEach((group) => {
    const computedGroup = [];
    group
      .sort((a, b) => Number(a.semester) - Number(b.semester) || String(a.id).localeCompare(String(b.id)))
      .forEach((student) => {
        const previousSemesterRecord = computedGroup.find((record) => Number(record.semester) === Number(student.semester) - 1) || null;
        const computedStudent = computeStudentMetrics(student, {
          previousCgpa: previousSemesterRecord ? previousSemesterRecord.cgpa : null
        });
        computedGroup.push(computedStudent);
        computedStudents.push(computedStudent);
      });
  });

  students = rankStudents(computedStudents);
  saveStudents();
}

function statusClass(label) {
  return String(label).toLowerCase().replace(/[^a-z]+/g, "-");
}

function emptyState(title, copy, actionLabel = addStudentCallToAction(), view = "add") {
  return `
    <div class="empty-state glass-card">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(copy)}</p>
      <button type="button" class="primary-button" data-view="${escapeHtml(view)}">${escapeHtml(actionLabel)}</button>
    </div>
  `;
}

function viewNameFromHash(hash = window.location.hash) {
  if (!hash.startsWith("#view-")) return "";
  const candidate = hash.slice(6);
  return views.some((view) => view.id === `view-${candidate}`) ? candidate : "";
}

function updateJumpAddLabel() {
  if (jumpAddLink) jumpAddLink.textContent = addStudentCallToAction();
}

function removeLegacyTopbarActions() {
  const legacyExportButton = document.getElementById("download-json");
  if (legacyExportButton) legacyExportButton.remove();
  const legacyAddButton = document.getElementById("jump-add");
  if (legacyAddButton) legacyAddButton.remove();
  document.querySelectorAll(".topbar-actions").forEach((container) => {
    if (!container.children.length) container.remove();
  });
}

function updateBackButtonState() {
  if (!topbarBackButton) return;
  const hasHistory = window.history.length > 1;
  topbarBackButton.classList.toggle("is-disabled", !hasHistory);
  topbarBackButton.setAttribute("aria-disabled", hasHistory ? "false" : "true");
}

function setView(name, { historyMode = "none" } = {}) {
  if (name === "analytics") {
    name = selectedStudentId ? "profile" : "students";
  }
  const previousView = document.body.dataset.view || "";
  if (
    name === "add"
    && previousView !== "add"
    && !editingStudentId
    && !semesterContinuationActive
    && !studentIdentityLocked
    && !timelineEntryLockContext
  ) {
    resetForm();
  }
  if (previousView === "predict" && name !== "predict") {
    resetSimulationInputs();
    resetSimulationDisplay();
    setSimulationVisibility(false);
  }
  document.body.dataset.view = name;
  navItems.forEach((item) => {
    const active = item.dataset.view === name;
    item.classList.toggle("active", active);
    if (active) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
  views.forEach((view) => view.classList.toggle("active", view.id === `view-${name}`));
  const titles = {
    overview: "Student Profile",
    dashboard: "Dashboard",
    students: "Students",
    add: editingStudentId ? "Edit Student" : "Add Student",
    profile: "Student Profile",
    analytics: "Analytics",
    predict: "Performance Simulator",
    upload: "CSV Upload"
  };
  pageTitle.textContent = titles[name] || "Overview";
  const nextHash = `#view-${name}`;
  if (historyMode === "push") {
    if (window.location.hash !== nextHash || (history.state && history.state.view) !== name) {
      try {
        history.pushState({ view: name }, "", nextHash);
      } catch (error) {
        window.location.hash = nextHash;
      }
    }
  } else if (historyMode === "replace") {
    try {
      history.replaceState({ view: name }, "", nextHash);
    } catch (error) {
      if (window.location.hash !== nextHash) window.location.hash = nextHash;
    }
  }
  updateBackButtonState();
  renderAll();
}


function updateSubjectInputNames() {
  Array.from(subjectsList.querySelectorAll(".subject-row")).forEach((row, index) => {
    const title = row.querySelector(".subject-row-title");
    if (title) title.textContent = `Subject ${index + 1}`;
    row.querySelectorAll("input, select").forEach((field) => {
      field.name = `subjects[${index}][${field.dataset.field}]`;
    });
  });
}

function createSubjectRow(values = {}) {
  const row = subjectTemplate.content.firstElementChild.cloneNode(true);
  row.querySelectorAll("input, select").forEach((field) => {
    const fieldName = field.dataset.field;
    const resolvedValue = fieldName === "subject"
      ? (values.subject ?? values.subject_name ?? "")
      : fieldName === "assignments"
        ? (values.assignments ?? values.internal ?? "")
        : fieldName === "external"
          ? (values.external ?? values.external_marks ?? "")
          : fieldName === "credits"
            ? (values.credits ?? "")
            : values[fieldName];
    const nextValue = resolvedValue == null ? "" : resolvedValue;
    if (fieldName === "subject") {
      field.dataset.preservedValue = String(nextValue || "").trim();
    } else {
      field.value = nextValue;
    }
  });
  row.querySelector(".remove-subject").addEventListener("click", () => {
    if (subjectsList.querySelectorAll(".subject-row").length > 1) {
      row.remove();
      updateSubjectInputNames();
      updateSubjectDropdownOptions();
      updateBacklogLimit();
    }
  });
  subjectsList.appendChild(row);
  updateSubjectInputNames();
  applyMarkScheme();
  applyInputRestrictions(row);
  updateSubjectDropdownOptions();
  updateBacklogLimit();
}

function ensureAtLeastOneSubjectRow() {
  if (!subjectsList.querySelector(".subject-row")) {
    subjectsList.innerHTML = "";
    createSubjectRow();
  }
}

function setStep(step) {
  currentStep = step;
  formSteps.forEach((panel, index) => panel.classList.toggle("active", index + 1 === step));
  stepper.forEach((dot, index) => {
    const active = index + 1 <= step;
    dot.classList.toggle("active", active);
    if (index + 1 === step) dot.setAttribute("aria-current", "step");
    else dot.removeAttribute("aria-current");
  });
  prevStepButton.style.visibility = step === 1 ? "hidden" : "visible";
  nextStepButton.style.display = step === 3 ? "none" : "inline-flex";
  submitButton.style.display = step === 3 ? "inline-flex" : "none";
  if (addAnotherSemesterButton) addAnotherSemesterButton.hidden = !(step === 3);
  if (step === 3) ensureAtLeastOneSubjectRow();
  updateAddAnotherSemesterButton();
  syncEnrollmentIdValidation();
}

function validateStep(step) {
  formError.textContent = "";
  if (step === 1 && syncEnrollmentIdValidation()) {
    enrollmentIdField?.focus();
    return false;
  }
  const fields = Array.from(formSteps[step - 1].querySelectorAll("input, select"));
  for (const field of fields) {
    if (field.type === "hidden") {
      if (field.name === "dob" && !String(field.value || "").trim()) {
        formError.textContent = "Please select a valid date of birth.";
        dobDisplayButton?.focus();
        return false;
      }
      continue;
    }
    if (field.matches("input[data-text-only='true']")) syncTextOnlyInput(field);
    if (field.matches("input[data-numeric-mode]")) syncNumericInput(field);
    if (field.name === "phone") syncPhoneInput();
    if (field === enrollmentIdField) syncEnrollmentIdValidation();
    if (!field.checkValidity()) {
      if (!(field === enrollmentIdField && syncEnrollmentIdValidation())) field.reportValidity();
      formError.textContent = field.name === "phone"
        ? phoneValidationMessage()
        : field === enrollmentIdField && syncEnrollmentIdValidation()
          ? ""
        : field.matches("input[data-text-only='true']")
          ? "Text fields accept only letters and spaces."
          : field.matches("input[data-numeric-mode]")
            ? "Numeric fields accept only numbers within defined limits."
            : "Please complete the required fields before continuing.";
      return false;
    }
  }
  if (step === 2 && !hasValidProgramDepartmentMapping(getSelectedProgramValue(), getSelectedDepartmentValue())) {
    formError.textContent = "Selected program does not belong to the chosen department.";
    programSelect?.focus();
    return false;
  }
  if (step === 2 && !hasValidProgramLevelMapping(getSelectedProgramValue(), getSelectedLevelValue())) {
    formError.textContent = "Selected program does not belong to the chosen academic level.";
    programSelect?.focus();
    return false;
  }
  if (step === 2 && !validateBacklogLimit()) {
    backlogsInput?.focus();
    return false;
  }
  if (step === 3) {
    if (!validateBacklogLimit()) {
      setStep(2);
      backlogsInput?.focus();
      return false;
    }
    const rows = Array.from(subjectsList.querySelectorAll(".subject-row"));
    if (!rows.length) {
      formError.textContent = "Add at least one subject.";
      return false;
    }
    const selectedSubjects = rows
      .map((row) => {
        const field = row.querySelector('select[data-field="subject"]');
        return String(field ? field.value : "").trim();
      })
      .filter(Boolean);
    if (new Set(selectedSubjects).size !== selectedSubjects.length) {
      formError.textContent = "This subject has already been added. Please select a different subject.";
      const duplicateField = rows
        .map((row) => row.querySelector('select[data-field="subject"]'))
        .find((field, index, fields) => field && selectedSubjects.indexOf(String(field.value || "").trim()) !== index);
      duplicateField?.focus();
      return false;
    }
    for (const row of rows) {
      const fields = Array.from(row.querySelectorAll("input, select"));
      fields.forEach((field) => {
        if (field.matches("input[data-text-only='true']")) syncTextOnlyInput(field);
        if (field.matches("input[data-numeric-mode]")) syncNumericInput(field);
      });
      const invalidInput = fields.find((field) => field.value === "" || !field.checkValidity());
      if (invalidInput) {
        invalidInput.reportValidity();
        formError.textContent =
          invalidInput.matches("input[data-text-only='true']")
            ? "Text fields accept only letters and spaces."
            : invalidInput.matches("input[data-numeric-mode]") && invalidInput.dataset.field !== "assignments" && invalidInput.dataset.field !== "external"
              ? "Numeric fields accept only numbers within defined limits."
            :
          invalidInput.dataset.field === "assignments" || invalidInput.dataset.field === "external"
            ? "Invalid input: Internal marks must be between 0 and 40, and External marks must be between 0 and 60."
            : "Complete all subject fields before saving.";
        return false;
      }
    }
  }
  return true;
}

function subjectRowsToData() {
  return Array.from(subjectsList.querySelectorAll(".subject-row")).map((row) => {
    const values = {};
    row.querySelectorAll("input, select").forEach((field) => {
      values[field.dataset.field] = field.value;
    });
    return values;
  });
}

function resetForm() {
  pendingSaveAndContinue = false;
  semesterContinuationActive = false;
  permittedExistingEnrollmentId = "";
  editingOriginalEnrollmentId = "";
  setTimelineEntryLockContext(null);
  setStudentIdentityLockState(false);
  setProgramLockState(false);
  setDepartmentLockState(false);
  editingStudentId = null;
  studentForm.reset();
  document.getElementById("student-id").value = "";
  if (dobInput) dobInput.value = "";
  syncDobDisplay();
  syncPhoneInput();
  if (programSelect) programSelect.value = "";
  syncProgramInput("");
  if (departmentSelect) departmentSelect.value = "";
  syncDepartmentInput("");
  refreshProgramOptionsByDepartment();
  setProgramLockState(false);
  syncDepartmentStateFromProgram();
  subjectsList.innerHTML = "";
  createSubjectRow();
  updateSubjectDropdownOptions();
  syncSemesterAvailability();
  updateBacklogLimit();
  formError.textContent = "";
  submitButton.textContent = "Save Student";
  updateAddFormHeading();
  setStep(1);
  updateAddAnotherSemesterButton();
  syncEnrollmentIdValidation();
}

function populateForm(student) {
  semesterContinuationActive = false;
  permittedExistingEnrollmentId = "";
  editingOriginalEnrollmentId = normalizeEnrollmentId(student.enrollmentId);
  setTimelineEntryLockContext(null);
  setStudentIdentityLockState(false);
  setProgramLockState(false);
  setDepartmentLockState(false);
  editingStudentId = student.id;
  document.getElementById("student-id").value = student.id;
  [
    "name",
    "enrollmentId",
    "email",
    "phone",
    "level",
    "dob",
    "semester",
    "studyHours",
    "attendance",
    "backlogs"
  ].forEach((name) => {
    const field = studentForm.elements.namedItem(name);
    if (field) field.value = student[name] == null ? "" : student[name];
  });
  syncDobDisplay();
  syncPhoneInput();
  const departmentValue = student.department == null ? "" : String(student.department);
  if (departmentSelect) {
    if (DEPARTMENT_OPTIONS.includes(departmentValue)) {
      departmentSelect.value = departmentValue;
      syncDepartmentInput(departmentValue);
    } else if (departmentValue) {
      departmentSelect.value = "Other";
      syncDepartmentInput("Other");
      if (departmentOtherInput) departmentOtherInput.value = departmentValue;
    } else {
      departmentSelect.value = "";
      syncDepartmentInput("");
    }
  }
  refreshProgramOptionsByDepartment();
  const programValue = student.program == null ? "" : String(student.program);
  if (programSelect) {
    if (PROGRAM_OPTIONS.includes(programValue)) {
      programSelect.value = programValue;
      syncProgramInput(programValue);
    } else if (programValue) {
      programSelect.value = "Other";
      syncProgramInput("Other");
      if (programOtherInput) programOtherInput.value = programValue;
    } else {
      programSelect.value = "";
      syncProgramInput("");
    }
  }
  setProgramLockState(false);
  syncDepartmentStateFromProgram();
  subjectsList.innerHTML = "";
  (student.subjects.length ? student.subjects : [{}]).forEach((subject) => createSubjectRow(subject));
  updateSubjectDropdownOptions();
  syncSemesterAvailability(student.semester);
  updateBacklogLimit();
  submitButton.textContent = "Update Student";
  updateAddFormHeading();
  setStep(1);
  updateAddAnotherSemesterButton();
}

function prepareAdditionalSemesterEntry(savedStudent) {
  const stableDraft = {
    name: savedStudent.name,
    enrollmentId: savedStudent.enrollmentId,
    email: savedStudent.email,
    phone: savedStudent.phone,
    level: savedStudent.level,
    dob: savedStudent.dob,
    program: savedStudent.program,
    department: savedStudent.department
  };

  resetForm();
  semesterContinuationActive = true;
  permittedExistingEnrollmentId = normalizeEnrollmentId(savedStudent.enrollmentId);
  setStudentIdentityLockState(true);

  ["name", "enrollmentId", "email", "phone", "level", "dob"].forEach((fieldName) => {
    const field = studentForm.elements.namedItem(fieldName);
    if (field) field.value = stableDraft[fieldName] == null ? "" : stableDraft[fieldName];
  });
  syncDobDisplay();
  syncPhoneInput();

  const departmentValue = stableDraft.department == null ? "" : String(stableDraft.department);
  if (departmentSelect) {
    if (DEPARTMENT_OPTIONS.includes(departmentValue)) {
      departmentSelect.value = departmentValue;
      syncDepartmentInput(departmentValue);
    } else if (departmentValue) {
      departmentSelect.value = "Other";
      syncDepartmentInput("Other");
      if (departmentOtherInput) departmentOtherInput.value = departmentValue;
    }
  }

  refreshProgramOptionsByDepartment();

  const programValue = stableDraft.program == null ? "" : String(stableDraft.program);
  if (programSelect) {
    if (PROGRAM_OPTIONS.includes(programValue)) {
      programSelect.value = programValue;
      syncProgramInput(programValue);
    } else if (programValue) {
      programSelect.value = "Other";
      syncProgramInput("Other");
      if (programOtherInput) programOtherInput.value = programValue;
    }
  }

  setProgramLockState(true, programValue);
  setDepartmentLockState(true, departmentValue);
  syncDepartmentStateFromProgram();
  ["studyHours", "attendance", "backlogs"].forEach((fieldName) => {
    const field = studentForm.elements.namedItem(fieldName);
    if (field) field.value = "";
  });
  if (semesterSelect) semesterSelect.value = "";
  syncSemesterAvailability();
  updateBacklogLimit();
  if (enrollmentIdField) {
    enrollmentIdField.setCustomValidity("");
    enrollmentIdField.setAttribute("aria-invalid", "false");
  }
  if (enrollmentIdFeedback) enrollmentIdFeedback.textContent = "";
  updateSubjectDropdownOptions();
  formError.textContent = `Semester ${savedStudent.semester} and${getRemainingSemestersForEnrollment(savedStudent.enrollmentId).length ? "" : " any available options"} are already saved. Select another remaining semester.`;
  updateAddFormHeading();
  setStep(2);
  updateAddAnotherSemesterButton();
}

function prepareTimelineSemesterEntry(savedStudent, semester) {
  const targetSemester = clamp(safeNumber(semester, 0), 1, 8);
  const stableDraft = {
    name: savedStudent.name,
    enrollmentId: savedStudent.enrollmentId,
    email: savedStudent.email,
    phone: savedStudent.phone,
    level: savedStudent.level,
    dob: savedStudent.dob,
    program: savedStudent.program,
    department: savedStudent.department
  };

  resetForm();
  semesterContinuationActive = true;
  permittedExistingEnrollmentId = normalizeEnrollmentId(savedStudent.enrollmentId);
  setStudentIdentityLockState(true);

  ["name", "enrollmentId", "email", "phone", "level", "dob"].forEach((fieldName) => {
    const field = studentForm.elements.namedItem(fieldName);
    if (field) field.value = stableDraft[fieldName] == null ? "" : stableDraft[fieldName];
  });
  syncDobDisplay();
  syncPhoneInput();

  const departmentValue = stableDraft.department == null ? "" : String(stableDraft.department);
  if (departmentSelect) {
    if (DEPARTMENT_OPTIONS.includes(departmentValue)) {
      departmentSelect.value = departmentValue;
      syncDepartmentInput(departmentValue);
    } else if (departmentValue) {
      departmentSelect.value = "Other";
      syncDepartmentInput("Other");
      if (departmentOtherInput) departmentOtherInput.value = departmentValue;
    }
  }

  refreshProgramOptionsByDepartment();

  const programValue = stableDraft.program == null ? "" : String(stableDraft.program);
  if (programSelect) {
    if (PROGRAM_OPTIONS.includes(programValue)) {
      programSelect.value = programValue;
      syncProgramInput(programValue);
    } else if (programValue) {
      programSelect.value = "Other";
      syncProgramInput("Other");
      if (programOtherInput) programOtherInput.value = programValue;
    }
  }

  setTimelineEntryLockContext({
    enrollmentId: stableDraft.enrollmentId,
    level: stableDraft.level,
    department: departmentValue,
    program: programValue,
    semester: targetSemester
  });
  setProgramLockState(true, programValue);
  setDepartmentLockState(true, departmentValue);
  syncDepartmentStateFromProgram();
  ["studyHours", "attendance", "backlogs"].forEach((fieldName) => {
    const field = studentForm.elements.namedItem(fieldName);
    if (field) field.value = "";
  });
  syncSemesterAvailability(targetSemester);
  updateBacklogLimit();
  if (enrollmentIdField) {
    enrollmentIdField.setCustomValidity("");
    enrollmentIdField.setAttribute("aria-invalid", "false");
  }
  if (enrollmentIdFeedback) enrollmentIdFeedback.textContent = "";
  updateSubjectDropdownOptions();
  formError.textContent = `Add semester ${targetSemester} details for ${savedStudent.enrollmentId}.`;
  updateAddFormHeading();
  setStep(2);
  updateAddAnotherSemesterButton();
}

function startSpecificSemesterEntry(savedStudent, semester) {
  prepareTimelineSemesterEntry(savedStudent, semester);
  setView("add", { historyMode: "push" });
}

function findStudent(studentId) {
  return students.find((student) => student.id === studentId);
}

function startEditStudent(studentId) {
  if (!canManageStudentRecords()) return;
  const student = findStudent(studentId);
  if (!student) return;
  populateForm(student);
  setView("add", { historyMode: "push" });
}

function closeDeleteModal({ restoreFocus = true } = {}) {
  if (!deleteModal) return;
  deleteModal.hidden = true;
  pendingDeleteStudentId = null;
  pendingDeleteAction = null;
  if (restoreFocus && lastDeleteTrigger && typeof lastDeleteTrigger.focus === "function") {
    lastDeleteTrigger.focus();
  }
  lastDeleteTrigger = null;
}

async function deleteStudent(studentId) {
  const student = findStudent(studentId);
  if (!student) return;
  const siblingRecord = students.find((entry) => entry.id !== studentId && normalizeEnrollmentId(entry.enrollmentId) === normalizeEnrollmentId(student.enrollmentId));
  createRevertPoint(`delete student ${student.enrollmentId || student.name || student.id}`);
  students = students.filter((entry) => entry.id !== studentId);
  saveStudents();
  if (authSession && hasSupabaseClient() && canManageStudentRecords()) {
    await window.SapasSupabase.deleteStudentRecord(student.id);
    await refreshStudentsFromCloud({
      preserveEnrollmentId: siblingRecord ? siblingRecord.enrollmentId : ""
    });
  }
  if (selectedStudentId === studentId) selectedStudentId = siblingRecord ? siblingRecord.id : students.length ? students[0].id : null;
  if (editingStudentId === studentId) resetForm();
  renderAll();
  if (!students.length) setView("overview", { historyMode: "push" });
}

async function confirmDeleteStudent() {
  if (!pendingDeleteAction) {
    closeDeleteModal({ restoreFocus: false });
    return;
  }
  if (pendingDeleteAction === "csv") {
    closeDeleteModal({ restoreFocus: false });
    createRevertPoint("clear saved CSV snapshot");
    localStorage.removeItem(CSV_SNAPSHOT_KEY);
    renderStoredCsvPreview();
    return;
  }
  if (pendingDeleteAction === "clear-preview") {
    closeDeleteModal({ restoreFocus: false });
    createRevertPoint("clear upload preview");
    localStorage.removeItem(CSV_SNAPSHOT_KEY);
    clearUploadState();
    renderStoredCsvPreview();
    return;
  }
  const studentId = pendingDeleteStudentId;
  if (!studentId) {
    closeDeleteModal({ restoreFocus: false });
    return;
  }
  closeDeleteModal({ restoreFocus: false });
  await deleteStudent(studentId);
}

function openDeleteModal(studentId, trigger = null) {
  if (!canManageStudentRecords()) return;
  const student = findStudent(studentId);
  if (!student || !deleteModal) return;
  if (deleteModalTitle) deleteModalTitle.textContent = "Confirm Deletion";
  if (deleteModalMessage) deleteModalMessage.textContent = "Are you sure you want to delete this student? This action cannot be undone.";
  if (deleteModalWarning) deleteModalWarning.textContent = "This will remove all associated academic records.";
  pendingDeleteStudentId = studentId;
  pendingDeleteAction = "student";
  lastDeleteTrigger = trigger;
  if (deleteConfirmButton) deleteConfirmButton.textContent = "Delete";
  if (deleteCancelButton) deleteCancelButton.textContent = "Cancel";
  deleteModal.hidden = false;
  if (deleteConfirmButton) deleteConfirmButton.focus();
}

function openDeleteCsvModal(trigger = null) {
  if (!deleteModal) return;
  if (deleteModalTitle) deleteModalTitle.textContent = "Confirm Deletion";
  if (deleteModalMessage) deleteModalMessage.textContent = "Are you sure you want to delete this CSV? This action cannot be undone.";
  if (deleteModalWarning) deleteModalWarning.textContent = "This will remove the uploaded CSV snapshot from the application.";
  pendingDeleteStudentId = null;
  pendingDeleteAction = "csv";
  lastDeleteTrigger = trigger;
  if (deleteConfirmButton) deleteConfirmButton.textContent = "Delete";
  if (deleteCancelButton) deleteCancelButton.textContent = "Cancel";
  deleteModal.hidden = false;
  if (deleteConfirmButton) deleteConfirmButton.focus();
}

function openClearPreviewModal(trigger = null) {
  if (!deleteModal) return;
  if (deleteModalTitle) deleteModalTitle.textContent = "Confirm Clear";
  if (deleteModalMessage) deleteModalMessage.textContent = "Are you sure you want to clear this preview? This action cannot be undone.";
  if (deleteModalWarning) deleteModalWarning.textContent = "This will permanently remove the currently previewed CSV data.";
  pendingDeleteStudentId = null;
  pendingDeleteAction = "clear-preview";
  lastDeleteTrigger = trigger;
  if (deleteConfirmButton) deleteConfirmButton.textContent = "Clear";
  if (deleteCancelButton) deleteCancelButton.textContent = "Cancel";
  deleteModal.hidden = false;
  if (deleteConfirmButton) deleteConfirmButton.focus();
}

function formDataToStudent() {
  const formData = new FormData(studentForm);
  const program = getSelectedProgramValue();
  const department = getSelectedDepartmentValue();
  const level = getSelectedLevelValue();
  const semester = getSelectedSemesterValue();
  if (syncEnrollmentIdValidation()) {
    throw new Error("");
  }
  if (!hasValidProgramLevelMapping(program, level)) {
    throw new Error("Selected program does not belong to the chosen academic level.");
  }
  if (!hasValidProgramDepartmentMapping(program, department)) {
    throw new Error("Selected program does not belong to the chosen department.");
  }
  if (!semester) {
    throw new Error("Select an available semester for this registration number.");
  }
  return {
    id: formData.get("studentId") || uid(),
    name: formData.get("name"),
    enrollmentId: getCurrentFormEnrollmentId(),
    email: formData.get("email"),
    phone: normalizeStoredPhone(formData.get("phone")),
    level,
    dob: formData.get("dob"),
    program,
    department,
    semester,
    studyHours: safeNumber(formData.get("studyHours"), 0),
    attendance: safeNumber(formData.get("attendance"), 0),
    backlogs: clamp(safeNumber(formData.get("backlogs"), 0), 0, Math.max(getBacklogLimitForCurrentForm(), 20)),
    subjects: subjectRowsToData()
  };
}

function kpiIcon(label) {
  const icons = {
    "Total Students": `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="9" cy="8" r="3.25" fill="none" stroke="#f8fafc" stroke-width="1.8"></circle>
        <path d="M3.75 18.25c.7-2.55 2.82-4 5.25-4s4.55 1.45 5.25 4" fill="none" stroke="#f8fafc" stroke-linecap="round" stroke-width="1.8"></path>
        <path d="M16 10.25c1.76.18 3.1 1.01 4.1 2.45" fill="none" stroke="#93c5fd" stroke-linecap="round" stroke-width="1.8"></path>
        <path d="M15.8 17.75h4.45" fill="none" stroke="#93c5fd" stroke-linecap="round" stroke-width="1.8"></path>
      </svg>
    `,
    "Average CGPA": `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 18.25 9.1 13.8l3.2 2.8 5.7-7.1" fill="none" stroke="#f8fafc" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"></path>
        <path d="M17.95 9.5h2.3v2.3" fill="none" stroke="#93c5fd" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"></path>
        <path d="M4 19.5h16" fill="none" stroke="#93c5fd" stroke-linecap="round" stroke-width="1.8"></path>
      </svg>
    `,
    "Average Attendance": `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="7.25" fill="none" stroke="#f8fafc" stroke-width="1.8"></circle>
        <path d="M12 7.75v4.45l2.85 1.7" fill="none" stroke="#93c5fd" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"></path>
      </svg>
    `,
    "At-Risk Count": `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 4.5 20 18.5H4z" fill="none" stroke="#f8fafc" stroke-linejoin="round" stroke-width="1.8"></path>
        <path d="M12 9v4.7" fill="none" stroke="#f8fafc" stroke-linecap="round" stroke-width="1.8"></path>
        <circle cx="12" cy="17.1" r="1" fill="#93c5fd"></circle>
      </svg>
    `
  };
  return icons[label] || icons["Total Students"];
}

function renderKpis() {
  const grid = document.getElementById("kpi-grid");
  if (!students.length) {
    grid.innerHTML = emptyState(
      "No student records yet",
      "SAPAS starts blank by design. Add a student or import a CSV to unlock KPIs and analytics."
    );
    return;
  }
  const values = [
    ["Total Students", students.length],
    ["Average CGPA", average(students, (student) => student.cgpa).toFixed(2)],
    ["Average Attendance", `${average(students, (student) => Number(student.attendance)).toFixed(1)}%`],
    ["At-Risk Count", students.filter((student) => ["At-Risk", "Critical"].includes(student.category)).length]
  ];
  grid.innerHTML = values
    .map(
      ([label, value]) => `
        <article class="metric-card">
          <div class="metric-card__copy">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value)}</strong>
          </div>
          <div class="metric-card__icon" aria-hidden="true">${kpiIcon(label)}</div>
        </article>
      `
    )
    .join("");
}

function renderCgpaDistribution() {
  const container = document.getElementById("cgpa-chart");
  if (!students.length) {
    container.innerHTML = `<p class="table-meta">No data available yet.</p>`;
    return;
  }
  const buckets = [
    { label: "0\u20134", count: 0, tone: "critical", meaning: "Critical", start: "#f43f5e", end: "#9f1239", glow: "rgba(244, 63, 94, 0.2)", text: "#fecdd3" },
    { label: "4\u20135", count: 0, tone: "risk", meaning: "At Risk", start: "#f97316", end: "#c2410c", glow: "rgba(249, 115, 22, 0.2)", text: "#fdba74" },
    { label: "5\u20137", count: 0, tone: "average", meaning: "Average", start: "#f59e0b", end: "#b45309", glow: "rgba(245, 158, 11, 0.18)", text: "#fde68a" },
    { label: "7\u20138.5", count: 0, tone: "good", meaning: "Good", start: "#0ea5e9", end: "#1d4ed8", glow: "rgba(14, 165, 233, 0.2)", text: "#bae6fd" },
    { label: "8.5\u201310", count: 0, tone: "excellent", meaning: "Excellent", start: "#14b8a6", end: "#0f766e", glow: "rgba(20, 184, 166, 0.2)", text: "#99f6e4" }
  ];
  students.forEach((student) => {
    if (student.cgpa < 4) buckets[0].count += 1;
    else if (student.cgpa < 5) buckets[1].count += 1;
    else if (student.cgpa < 7) buckets[2].count += 1;
    else if (student.cgpa < 8.5) buckets[3].count += 1;
    else buckets[4].count += 1;
  });
  const max = Math.max(...buckets.map((bucket) => bucket.count), 1);
  const dominantBuckets = buckets.filter((bucket) => bucket.count === max && bucket.count > 0);
  const dominantBucket = dominantBuckets[0] || buckets[0];
  const averageCgpa = average(students, (student) => student.cgpa);
  const riskStudents = students.filter((student) => ["At-Risk", "Critical"].includes(student.category)).length;
  const riskShare = students.length ? Math.round((riskStudents / students.length) * 100) : 0;
  const riskSummary =
    riskShare >= 50
      ? "Many students are in the risk zone and need close support."
      : riskShare >= 25
        ? "Some students still need focused academic support."
        : "Academic risk is currently under control.";
  const recommendations = [
    "Weekly monitoring",
    "Target support",
    "Boost attendance",
    "Study engagement",
    "Academic programs",
    "Attendance checks",
    "Class participation",
    "Study groups",
    "Habit building",
    "Regular feedback"
  ];
  const interpretationLines = [
    `Most students are grouped in the ${dominantBucket.label} band.`,
    `${riskShare}% of students fall in the risk zone, ${riskSummary.toLowerCase()}`
  ];
  container.innerHTML = `
    <div class="chart-shell cgpa-distribution-shell">
      <div class="chart-story">
        <div class="story-pill focus">
          <span>Average CGPA</span>
          <strong>${averageCgpa.toFixed(2)}</strong>
        </div>
        <div class="story-pill">
          <span>Primary Performance Band</span>
          <strong>${escapeHtml(dominantBucket.label)}</strong>
        </div>
        <div class="story-pill ${riskShare >= 30 ? "alert" : "neutral"}">
          <span>At-Risk Students (%)</span>
          <strong>${riskShare}% of students are at risk</strong>
        </div>
      </div>
      <div class="bars-stage cgpa-bars-stage">
        ${buckets
          .map((bucket) => {
            const fillPercent = bucket.count === 0 ? 3 : Math.max((bucket.count / max) * 100, 6);
            const isDominant = dominantBuckets.some((item) => item.label === bucket.label);
            return `
            <div class="bar-col cgpa-bar-col bar-col-${bucket.tone} ${isDominant ? "is-highlight" : ""}" style="--bar-start:${bucket.start}; --bar-end:${bucket.end}; --bar-glow:${bucket.glow}; --bar-text:${bucket.text};">
              <div class="bar-count" style="color:${bucket.text}; border-color:${bucket.glow}; background:rgba(15, 23, 42, 0.86);">${bucket.count}</div>
              <div class="bar-track">
                <div class="bar-fill ${bucket.count === 0 ? "is-placeholder" : ""}" style="height:${fillPercent}%;"></div>
              </div>
              <div class="bar-label cgpa-bar-label" style="color:${bucket.text};">
                <strong>${escapeHtml(bucket.label)}</strong>
                <span class="table-meta">${escapeHtml(bucket.meaning)} | ${bucket.count} ${bucket.count === 1 ? "student" : "students"}</span>
              </div>
            </div>
          `;
          })
          .join("")}
      </div>
      <div class="chart-insight cgpa-distribution-insight">
        <ul class="cgpa-interpretation-lines" aria-label="CGPA distribution interpretation">
          ${interpretationLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
        </ul>
        <div class="chart-recommendations" aria-label="Recommended actions for CGPA distribution">
          <strong>Recommended Actions</strong>
          <div class="cgpa-recommendations-layout">
            <ul class="cgpa-recommendations-list" aria-label="Recommended actions list">
              ${recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
            <div class="cgpa-recommendations-art" aria-hidden="true">
              <div class="cgpa-recommendations-art-row">
                <img src="./school.png" alt="" class="cgpa-recommendation-image cgpa-recommendation-image-school">
                <img src="./book.png" alt="" class="cgpa-recommendation-image cgpa-recommendation-image-book">
              </div>
              <div class="cgpa-recommendations-art-row">
                <img src="./cloud-library.png" alt="" class="cgpa-recommendation-image cgpa-recommendation-image-cloud">
                <img src="./online-education.png" alt="" class="cgpa-recommendation-image cgpa-recommendation-image-online">
              </div>
              <div class="cgpa-recommendations-art-row cgpa-recommendations-art-row-bottom">
                <img src="./light-bulb.png" alt="" class="cgpa-recommendation-image cgpa-recommendation-image-bulb">
                <img src="./reading.png" alt="" class="cgpa-recommendation-image cgpa-recommendation-image-reading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCategoryPie() {
  const chart = document.getElementById("category-pie");
  const insights = document.getElementById("category-insights");
  if (!students.length) {
    chart.innerHTML = `<p class="table-meta">Category breakdown appears after student data is added.</p>`;
    insights.innerHTML = `<p class="table-meta">Interpretation appears after students are added.</p>`;
    return;
  }

  const categoryConfig = [
    {
      key: "Excellent",
      display: "High Performers",
      gradient: ["#34d399", "#059669"],
      glow: "rgba(16, 185, 129, 0.22)"
    },
    {
      key: "Good",
      display: "Above Average",
      gradient: ["#60a5fa", "#4f46e5"],
      glow: "rgba(99, 102, 241, 0.18)"
    },
    {
      key: "Average",
      display: "Moderate",
      gradient: ["#fcd34d", "#f59e0b"],
      glow: "rgba(245, 158, 11, 0.18)"
    },
    {
      key: "At-Risk",
      display: "Needs Attention",
      gradient: ["#fb923c", "#f97316"],
      glow: "rgba(249, 115, 22, 0.2)"
    },
    {
      key: "Critical",
      display: "High Risk",
      gradient: ["#fb7185", "#ef4444"],
      glow: "rgba(239, 68, 68, 0.34)"
    }
  ];

  const counts = categoryConfig.map((entry) => {
    const value = students.filter((student) => student.category === entry.key).length;
    const percentage = students.length ? Math.round((value / students.length) * 100) : 0;
    return { ...entry, value, percentage };
  });
  const total = students.length;
  const dominant = counts.reduce((best, entry) => (entry.value > best.value ? entry : best), counts[0]);
  const cx = 210;
  const cy = 188;
  const radius = 128;
  const labelRadius = 160;
  const outerLabelX = { left: 132, right: 388 };
  const gapDegrees = 1.6;

  const studentLabel = (value) => `${value} ${value === 1 ? "student" : "students"}`;
  const polar = (distance, angleDegrees) => {
    const radians = (angleDegrees - 90) * (Math.PI / 180);
    return {
      x: cx + distance * Math.cos(radians),
      y: cy + distance * Math.sin(radians)
    };
  };
  const describeSlice = (fromAngle, toAngle, sliceRadius) => {
    const start = polar(sliceRadius, fromAngle);
    const end = polar(sliceRadius, toAngle);
    const largeArc = toAngle - fromAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${sliceRadius} ${sliceRadius} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`;
  };

  let currentAngle = -90;
  const segments = counts
    .map((entry, index) => {
      if (!entry.value) return null;
      const rawSweep = (entry.value / total) * 360;
      const usableGap = rawSweep > 8 ? gapDegrees : 0.45;
      const fromAngle = currentAngle + (usableGap / 2);
      const toAngle = currentAngle + rawSweep - (usableGap / 2);
      const midAngle = currentAngle + (rawSweep / 2);
      currentAngle += rawSweep;

      const isDominant = entry.key === dominant.key;
      const isCritical = entry.key === "Critical";
      const emphasisDistance = isCritical ? 10 : (isDominant ? 6 : 0);
      const midRadians = (midAngle - 90) * (Math.PI / 180);
      const translateX = Number((Math.cos(midRadians) * emphasisDistance).toFixed(2));
      const translateY = Number((Math.sin(midRadians) * emphasisDistance).toFixed(2));
      const calloutStart = polar(radius + emphasisDistance - 2, midAngle);
      const calloutBend = polar(labelRadius + emphasisDistance, midAngle);
      const labelSide = Math.cos(midRadians) >= 0 ? "right" : "left";
      const isHighPerformers = entry.key === "Excellent";
      const effectiveLabelSide = isHighPerformers ? "left" : labelSide;
      const calloutMidX = isHighPerformers ? 86 : calloutBend.x;
      const calloutMidY = isHighPerformers ? 56 : calloutBend.y;
      const calloutEndX = isHighPerformers ? 30 : outerLabelX[effectiveLabelSide];
      const calloutEndY = isHighPerformers ? 48 : calloutBend.y;
      const textX = isHighPerformers
        ? calloutEndX
        : (effectiveLabelSide === "right" ? calloutEndX + 8 : calloutEndX - 8);
      const textY = isHighPerformers ? 30 : calloutBend.y - 7;
      const textAnchor = isHighPerformers ? "start" : (effectiveLabelSide === "right" ? "start" : "end");
      const filterId = isCritical || isDominant ? `category-pie-glow-${index}` : "";
      return {
        defs: `
          <linearGradient id="category-pie-gradient-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${entry.gradient[0]}" />
            <stop offset="100%" stop-color="${entry.gradient[1]}" />
          </linearGradient>
          ${filterId ? `
            <filter id="${filterId}" x="-80%" y="-80%" width="260%" height="260%">
              <feDropShadow dx="0" dy="0" stdDeviation="${isCritical ? 8 : 5}" flood-color="${entry.glow}" />
            </filter>
          ` : ""}
        `,
        slice: `
          <path
            class="pie-slice ${isDominant ? "is-dominant" : ""} ${isCritical ? "is-critical" : ""}"
            d="${describeSlice(fromAngle, toAngle, radius)}"
            fill="url(#category-pie-gradient-${index})"
            stroke="rgba(6, 11, 21, 0.84)"
            stroke-width="2"
            transform="translate(${translateX} ${translateY})"
            ${filterId ? `filter="url(#${filterId})"` : ""}
          ></path>
        `,
        label: `
          <path
            class="pie-callout ${isCritical ? "is-critical" : ""}"
            style="stroke:${entry.gradient[0]};"
            d="${isHighPerformers
              ? `M ${calloutStart.x.toFixed(2)} ${calloutStart.y.toFixed(2)} L ${calloutMidX.toFixed(2)} ${calloutMidY.toFixed(2)}`
              : `M ${calloutStart.x.toFixed(2)} ${calloutStart.y.toFixed(2)} L ${calloutMidX.toFixed(2)} ${calloutMidY.toFixed(2)} L ${calloutEndX} ${calloutEndY.toFixed(2)}`
            }"
          ></path>
          <text class="pie-label ${isDominant ? "is-dominant" : ""}" style="fill:${entry.gradient[0]}; --pie-label-stroke:${entry.glow};" x="${textX}" y="${textY.toFixed(2)}" text-anchor="${textAnchor}">
            <tspan x="${textX}" dy="0">${escapeHtml(entry.display)}</tspan>
            <tspan class="pie-label-meta" style="fill:${entry.gradient[0]};" x="${textX}" dy="15">${studentLabel(entry.value)} | ${entry.percentage}%</tspan>
          </text>
        `
      };
    })
    .filter(Boolean);

  chart.innerHTML = `
    <div class="pie-chart-shell">
      <svg class="pie-chart-svg" viewBox="0 0 520 380" role="img" aria-label="Performance category pie chart showing student categories by count and percentage">
        <defs>${segments.map((segment) => segment.defs).join("")}</defs>
        ${segments.map((segment) => segment.slice).join("")}
        ${segments.map((segment) => segment.label).join("")}
      </svg>
      <div class="pie-chart-center">
        <span>Total Students</span>
        <strong>${total}</strong>
      </div>
    </div>
  `;

  insights.innerHTML = `
    <strong>Interpretation</strong>
    <div class="category-insight-list">
      ${counts
        .map(
          (entry) => `
            <div class="category-insight-line ${entry.key === "Critical" ? "is-critical" : ""}">
              <div class="category-insight-label">
                <span class="category-insight-dot" style="--insight-start:${entry.gradient[0]}; --insight-end:${entry.gradient[1]}; --insight-glow:${entry.glow};"></span>
                <strong>${escapeHtml(entry.display)}</strong>
              </div>
              <span class="category-insight-value">
                <span class="category-insight-count">${entry.value} ${entry.value === 1 ? "student" : "students"}</span>
                <span class="category-insight-separator" aria-hidden="true">|</span>
                <span class="category-insight-percent">${entry.percentage}%</span>
              </span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderMiniTable(items, mountId, emptyCopy) {
  const mount = document.getElementById(mountId);
  if (!items.length) {
    mount.innerHTML = `<p class="table-meta">${escapeHtml(emptyCopy)}</p>`;
    return;
  }
  mount.innerHTML = `
    <table>
      <thead>
        <tr><th>Name</th><th>CGPA</th><th>Attendance</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${items
          .map(
            (student) => `
              <tr>
                <td>${escapeHtml(student.name)}</td>
                <td class="mono">${student.cgpa}</td>
                <td class="mono">${student.attendance}%</td>
                <td><span class="status-badge status-${statusClass(student.category)}">${escapeHtml(student.category)}</span></td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderBacklogBurdenPanel() {
  const mount = document.getElementById("at-risk-panel");
  if (!mount) return;

  const bySemester = Array.from({ length: 8 }, (_, index) => {
    const semester = index + 1;
    const total = students
      .filter((student) => Number(student.semester) === semester)
      .reduce((sum, student) => sum + Number(student.backlogs || 0), 0);
    return {
      label: `Sem${semester}`,
      value: total
    };
  });

  const hasData = bySemester.some((item) => item.value > 0);
  if (!hasData) {
    mount.innerHTML = `<div class="backlog-burden-empty table-meta">Backlog data appears after records are added.</div>`;
    return;
  }

  const max = Math.max(...bySemester.map((item) => item.value), 1);
  const highestBacklogSemester = bySemester.reduce((best, item) => (item.value > best.value ? item : best), bySemester[0]);
  const latestBacklog = bySemester[bySemester.length - 1];
  mount.innerHTML = `
    <div class="backlog-burden-panel">
      <div class="backlog-burden-chart" role="img" aria-label="Backlog burden by semester panel">
        ${bySemester.map((item) => {
          const widthPercent = item.value === 0 ? 10 : Math.max((item.value / max) * 100, 10);
          const severityLabel =
            item.value === 0
              ? "No backlog"
              : item.value <= 2
                ? "Low"
                : "High Risk";
          const severityClass =
            item.value === 0
              ? "is-clear"
              : item.value <= 2
                ? "is-low"
                : "is-high";
          return `
            <div class="backlog-burden-row">
              <span class="backlog-burden-sem">${escapeHtml(item.label)}</span>
              <div class="backlog-burden-track" title="Backlogs: ${item.value} | ${severityLabel}" aria-label="${escapeHtml(item.label)} backlogs: ${item.value}, ${severityLabel}">
                <div class="backlog-burden-fill ${severityClass}" style="width:${widthPercent}%;">
                  <span class="backlog-burden-value mono">${item.value}</span>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
      <div class="chart-insight">
        <strong>Interpretation</strong>
        <ul class="chart-insight-list">
          <li>Backlog pressure is highest in ${escapeHtml(highestBacklogSemester.label)}, so this semester needs the fastest academic support.</li>
          <li>The latest semester currently shows ${latestBacklog.value} uncleared paper${latestBacklog.value === 1 ? "" : "s"}, which helps indicate the present workload level.</li>
        </ul>
      </div>
    </div>
  `;
}

function formatSignedValue(value, digits = 2) {
  const rounded = Number(Number(value).toFixed(digits));
  if (rounded === 0) return "0";
  return `${rounded > 0 ? "+" : "-"}${formatValue(Math.abs(rounded))}`;
}

function formatTrendLabel(label) {
  const match = /^S(\d+)$/i.exec(String(label || "").trim());
  if (match) return `Semester ${match[1]}`;
  return String(label || "").trim();
}

function formatShortSemesterLabel(label) {
  const match = /^S(\d+)$/i.exec(String(label || "").trim());
  if (match) return `Sem ${match[1]}`;
  return String(label || "").trim();
}

function boxesOverlap(a, b, padding = 8) {
  return !(
    a.x + a.width + padding <= b.x ||
    b.x + b.width + padding <= a.x ||
    a.y + a.height + padding <= b.y ||
    b.y + b.height + padding <= a.y
  );
}

function renderTrend(containerId, data, valueKey, color = "#6366f1", options = {}) {
  const container = document.getElementById(containerId);
  if (!data.length) {
    container.innerHTML = `<p class="table-meta">Trend visual appears after student data is entered.</p>`;
    return;
  }
  const {
    metricLabel = "value",
    averageMetricLabel = `average ${metricLabel}`,
    averageStoryLabel = "Average",
    peakStoryLabel = "Peak",
    trajectoryStoryLabel = "Trend Direction",
    deltaUnit = "",
    useAcademicNarrative = false,
    labelFormatter = formatTrendLabel,
    axisLabelFormatter = labelFormatter,
    showAllPointLabels = false,
    valueFormatter = formatValue,
    pointLabelFormatter = (point, formattedLabel, formatMetricValue) => `${formattedLabel} | ${formatMetricValue(point.value)}`,
    averageLineLabelFormatter = (value, formatMetricValue) => `Average: ${formatMetricValue(value)}`,
    showAverageLine = true,
    showPeakPointLabel = true,
    showAxisTickLabels = true,
    leftPaddingOverride = null,
    yAxisX = 18,
    xAxisLabel = "",
    yAxisLabel = "",
    storyValueFormatter = null,
    captionVisibilityNote = "",
    interpretationPoints = null,
    singlePointStoryLabel = "Score",
    singlePointContextLabel = "Label",
    singlePointStatusLabel = "Status",
    singlePointStatusText = "Baseline Recorded"
  } = options;
  const width = containerId === "semester-trend" ? 740 : 620;
  const height = containerId === "semester-trend" ? 420 : 320;
  const leftPadding = leftPaddingOverride ?? 62;
  const rightPadding = 26;
  const topPadding = containerId === "semester-trend" ? 42 : 36;
  const bottomPadding = containerId === "semester-trend" ? 66 : 56;
  const values = data.map((item) => Number(item[valueKey]));
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const stepX = data.length > 1 ? (width - leftPadding - rightPadding) / (data.length - 1) : 0;
  const baselineY = height - bottomPadding;
  const gridLines = 4;
  const avgValue = average(data, (item) => Number(item[valueKey]));
  const avgY = baselineY - (((avgValue - min) / range) * (baselineY - topPadding));
  const points = data.map((item, index) => {
    const x = data.length > 1 ? leftPadding + index * stepX : width / 2;
    const y = baselineY - (((Number(item[valueKey]) - min) / range) * (baselineY - topPadding));
    return { x, y, label: item.label, value: Number(item[valueKey]) };
  });
  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPath = `M ${points[0].x} ${baselineY} L ${points.map((point) => `${point.x} ${point.y}`).join(" L ")} L ${points[points.length - 1].x} ${baselineY} Z`;
  const peakPoint = points.reduce((best, point) => (point.value > best.value ? point : best), points[0]);
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const delta = lastPoint.value - firstPoint.value;
  const trajectory = delta > 0.15 ? "Rising" : delta < -0.15 ? "Declining" : "Stable";
  const storyClass = delta > 0.15 ? "story-pill good" : delta < -0.15 ? "story-pill alert" : "story-pill neutral";
  const gradientId = `${containerId.replace(/[^a-z0-9]+/gi, "-")}-gradient`;
  const formattedPeakLabel = labelFormatter(peakPoint.label);
  const formatMetricValue = (value) => valueFormatter(Number(value));
  const deltaMagnitude = formatMetricValue(Math.abs(delta));
  const deltaWithUnit = `${deltaMagnitude}${deltaUnit ? ` ${deltaUnit}` : ""}`;
  const isSinglePoint = points.length === 1;
  const labelPlacements = [];
  const averageLabelText = showAverageLine ? averageLineLabelFormatter(avgValue, formatMetricValue) : "";
  const averageLabelBox = !isSinglePoint && averageLabelText
    ? {
        x: Math.max(leftPadding, width - rightPadding - Math.max(112, Math.round(averageLabelText.length * 6.2))),
        y: Math.max(topPadding + 6, avgY - 20),
        width: Math.max(112, Math.round(averageLabelText.length * 6.2)),
        height: 16
      }
    : null;
  if (averageLabelBox) labelPlacements.push(averageLabelBox);
  const averagePerformanceSummary =
    avgValue < 4
      ? "reflects generally low academic performance."
      : avgValue < 8
        ? "reflects moderate overall performance."
        : "reflects strong academic performance.";
  let caption = "";
  if (isSinglePoint) {
    caption = `${formattedPeakLabel} records a ${metricLabel} of ${formatMetricValue(peakPoint.value)}. As only one data point is available, trend analysis cannot be determined. This serves as a baseline for future academic progression.`;
  } else if (useAcademicNarrative) {
    const trendSentence =
      delta > 0.15
        ? `The overall trend shows a gradual improvement of ${deltaWithUnit} across semesters, indicating stronger academic consistency.`
        : delta < -0.15
          ? `The overall trend shows a gradual decline of ${deltaWithUnit} across semesters, indicating decreasing academic consistency.`
          : "The overall trend remains stable compared to the starting semester, indicating consistent academic performance.";
    caption = `${formattedPeakLabel} records the highest ${metricLabel} with a score of ${formatMetricValue(peakPoint.value)}. ${trendSentence} The ${averageMetricLabel} of ${formatMetricValue(avgValue)} ${averagePerformanceSummary}`;
  } else {
    const changeSentence =
      delta > 0.15
        ? `The overall trend shows an increase of ${deltaWithUnit} compared to the starting point.`
        : delta < -0.15
          ? `The overall trend shows a decline of ${deltaWithUnit} compared to the starting point.`
          : "The overall trend remains stable compared to the starting point.";
    caption = `${formattedPeakLabel} records the highest ${metricLabel} at ${formatMetricValue(peakPoint.value)}. ${changeSentence} The ${averageMetricLabel} across the trend stands at ${formatMetricValue(avgValue)}.`;
  }
  if (captionVisibilityNote) caption = `${caption} ${captionVisibilityNote}`;
  const averageStoryValue = storyValueFormatter && typeof storyValueFormatter.average === "function"
    ? storyValueFormatter.average(avgValue, formatMetricValue)
    : formatMetricValue(avgValue);
  const peakStoryValue = storyValueFormatter && typeof storyValueFormatter.peak === "function"
    ? storyValueFormatter.peak(peakPoint, formattedPeakLabel, formatMetricValue)
    : `${formattedPeakLabel}${isSinglePoint ? "" : ` (Score: ${formatMetricValue(peakPoint.value)})`}`;
  const trajectoryStoryValue = storyValueFormatter && typeof storyValueFormatter.trajectory === "function"
    ? storyValueFormatter.trajectory({ points, trajectory, delta, deltaWithUnit })
    : isSinglePoint
      ? escapeHtml(singlePointStatusText)
      : points.length > 1 && trajectory !== "Stable"
        ? `${trajectory} by ${deltaWithUnit}`
        : trajectory;
  const storyItems = [
    {
      label: isSinglePoint ? singlePointStoryLabel : averageStoryLabel,
      value: averageStoryValue,
      className: "story-pill"
    },
    {
      label: isSinglePoint ? singlePointContextLabel : peakStoryLabel,
      value: peakStoryValue,
      className: "story-pill"
    },
    {
      label: isSinglePoint ? singlePointStatusLabel : trajectoryStoryLabel,
      value: trajectoryStoryValue,
      className: storyClass
    }
  ].filter((item) => String(item.label || "").trim() && String(item.value || "").trim());
  container.innerHTML = `
    <div class="trend-shell">
      <div class="chart-story">
        ${storyItems.map((item) => `
          <div class="${item.className}">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.value)}</strong>
          </div>
        `).join("")}
      </div>
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Trend chart">
        <defs>
          <linearGradient id="${gradientId}" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.36" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0.02" />
          </linearGradient>
        </defs>
        ${!isSinglePoint ? Array.from({ length: gridLines + 1 }, (_, index) => {
          const y = topPadding + (index * (baselineY - topPadding)) / gridLines;
          return `<line x1="${leftPadding}" y1="${y}" x2="${width - rightPadding}" y2="${y}" stroke="rgba(148,163,184,0.12)" />`;
        }).join("") : ""}
        ${!isSinglePoint && showAverageLine ? `<line x1="${leftPadding}" y1="${avgY}" x2="${width - rightPadding}" y2="${avgY}" stroke="rgba(226,232,240,0.28)" stroke-dasharray="6 6" />
        ${averageLabelBox ? `<text x="${averageLabelBox.x + averageLabelBox.width}" y="${averageLabelBox.y + 12}" fill="#cbd5e1" font-size="11" text-anchor="end">${escapeHtml(averageLabelText)}</text>` : ""}` : ""}
        ${!isSinglePoint ? `<path d="${areaPath}" fill="url(#${gradientId})"></path>
        <polyline fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="${polylinePoints}" />` : ""}
        ${points
          .map((point, index) => {
            const isPeak = point.label === peakPoint.label && point.value === peakPoint.value;
            const formattedPointLabel = labelFormatter(point.label);
            const showLabel = showAllPointLabels || (showPeakPointLabel && isPeak);
            const pointLabel = pointLabelFormatter(point, formattedPointLabel, formatMetricValue);
            const labelWidth = Math.max(isSinglePoint ? 114 : isPeak ? 120 : 96, Math.round(pointLabel.length * (isPeak ? 5.9 : 5.3)));
            const labelHeight = isSinglePoint ? 24 : isPeak ? 24 : 20;
            const pointRadius = isPeak ? 12 : 9;
            const offset = isPeak ? 16 : 12;
            const candidates = [
              { x: point.x - (labelWidth / 2), y: point.y - labelHeight - pointRadius - offset },
              { x: point.x - (labelWidth / 2), y: point.y + pointRadius + offset },
              { x: point.x - labelWidth - pointRadius - offset, y: point.y - (labelHeight / 2) },
              { x: point.x + pointRadius + offset, y: point.y - (labelHeight / 2) }
            ].map((candidate) => ({
              x: clamp(candidate.x, leftPadding, width - rightPadding - labelWidth),
              y: clamp(candidate.y, topPadding - 4, baselineY - labelHeight - 18),
              width: labelWidth,
              height: labelHeight
            }));
            const collidesWithPoint = (box) => (
              point.x + pointRadius + 10 > box.x &&
              point.x - pointRadius - 10 < box.x + box.width &&
              point.y + pointRadius + 10 > box.y &&
              point.y - pointRadius - 10 < box.y + box.height
            );
            let chosenBox = candidates.find((candidate) => (
              !collidesWithPoint(candidate) &&
              !labelPlacements.some((placed) => boxesOverlap(candidate, placed, isPeak ? 10 : 8))
            ));
            if (!chosenBox) {
              chosenBox = candidates
                .map((candidate) => ({
                  ...candidate,
                  score: labelPlacements.reduce((total, placed) => total + (boxesOverlap(candidate, placed, 4) ? 1 : 0), collidesWithPoint(candidate) ? 3 : 0)
                }))
                .sort((a, b) => a.score - b.score)[0];
            }
            if (showLabel && chosenBox) labelPlacements.push(chosenBox);
            const labelFill = isPeak ? "rgba(15, 23, 42, 0.96)" : "rgba(15, 23, 42, 0.88)";
            const labelStroke = isPeak ? "rgba(248,250,252,0.22)" : "rgba(148,163,184,0.2)";
            const labelTextColor = isPeak ? "#f8fafc" : "#dbeafe";
            return `
              <g class="trend-point" tabindex="0" aria-label="${escapeHtml(pointLabel)}">
                <title>${escapeHtml(pointLabel)}</title>
                ${showLabel && chosenBox ? `
                  <rect x="${chosenBox.x}" y="${chosenBox.y}" width="${chosenBox.width}" height="${chosenBox.height}" rx="10" fill="${labelFill}" stroke="${labelStroke}" />
                  <text x="${chosenBox.x + (chosenBox.width / 2)}" y="${chosenBox.y + (chosenBox.height / 2) + 3}" fill="${labelTextColor}" font-size="${isPeak ? 10.8 : 9.4}" font-weight="${isPeak ? 700 : 500}" text-anchor="middle">${escapeHtml(pointLabel)}</text>
                ` : ""}
                <circle cx="${point.x}" cy="${point.y}" r="${isPeak ? 12 : 9}" fill="${color}" opacity="${isPeak ? 0.22 : 0.14}" />
                <circle cx="${point.x}" cy="${point.y}" r="${isPeak ? 6.5 : 5}" fill="${color}" stroke="rgba(248,250,252,0.6)" stroke-width="1.5" />
              </g>
            `;
          })
          .join("")}
        ${showAxisTickLabels ? points
          .map((point) => `<text x="${point.x}" y="${height - 4}" fill="#94a3b8" font-size="12" text-anchor="middle">${escapeHtml(axisLabelFormatter(point.label))}</text>`)
          .join("") : ""}
        ${xAxisLabel ? `<text x="${width / 2}" y="${height - 20}" fill="#94a3b8" font-size="12" text-anchor="middle">${escapeHtml(xAxisLabel)}</text>` : ""}
        ${yAxisLabel ? `<text x="${yAxisX}" y="${height / 2}" fill="#94a3b8" font-size="12" text-anchor="middle" transform="rotate(-90 ${yAxisX} ${height / 2})">${escapeHtml(yAxisLabel)}</text>` : ""}
      </svg>
      ${Array.isArray(interpretationPoints) && interpretationPoints.length ? `
        <div class="chart-insight">
          <strong>Interpretation</strong>
          <ul class="chart-insight-list">
            ${interpretationPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
          </ul>
        </div>
      ` : `<p class="chart-caption">${escapeHtml(caption)}</p>`}
    </div>
  `;
}

function renderSubjectBars(containerId, items, emptyText = "No subject insights yet.") {
  const container = document.getElementById(containerId);
  if (!items.length) {
    container.innerHTML = `<p class="table-meta">${escapeHtml(emptyText)}</p>`;
    return;
  }
  const max = Math.max(...items.map((item) => item.value), 1);
  container.innerHTML = items
    .map(
      (item) => `
        <div class="subject-bar">
          <span>${escapeHtml(item.label)}</span>
          <div class="subject-bar-track"><div class="subject-bar-fill" style="width:${(item.value / max) * 100}%"></div></div>
          <strong class="mono">${item.value.toFixed(1)}</strong>
        </div>
      `
    )
    .join("");
}

function isValidProgramBenchmarkLabel(value) {
  const normalized = String(value || "").trim();
  if (!normalized || normalized.length < 3) return false;
  if (PROGRAM_OPTIONS.includes(normalized)) return true;
  if (/\d{4,}/.test(normalized) || /^[a-z]{5,}$/.test(normalized)) return false;
  return /^(B|M|MBA|MCA|BCA|BBA|B\.Sc|B\.Com|B\.Tech|M\.Sc|M\.Com|BA|MA|BE|ME)\b/i.test(normalized) ||
    /(Bachelor|Master|Technology|Engineering|Science|Commerce|Business|Arts|Computer|Media)/i.test(normalized);
}

function formatProgramBenchmarkLabel(value) {
  return String(value || "")
    .replace(/\s*\([^)]*\)\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function renderProgramBenchmark(items, emptyText = "Program comparison will appear here.") {
  const container = document.getElementById("program-comparison");
  if (!container) return;
  const rankedItems = [...items]
    .map((item) => ({
      label: formatProgramBenchmarkLabel(item.label),
      value: Number(item.value)
    }))
    .filter((item) => isValidProgramBenchmarkLabel(item.label) && Number.isFinite(item.value))
    .sort((a, b) => (b.value !== a.value ? b.value - a.value : a.label.localeCompare(b.label)));

  if (!rankedItems.length) {
    container.innerHTML = `<p class="table-meta">${escapeHtml(emptyText)}</p>`;
    return;
  }

  const getBenchmarkBand = (value) => {
    if (value >= 8.5) return { tone: "excellent", start: "#4ade80", end: "#16a34a", glow: "rgba(34, 197, 94, 0.24)", text: "#bbf7d0", tag: "Top Performer" };
    if (value >= 7) return { tone: "good", start: "#60a5fa", end: "#2563eb", glow: "rgba(59, 130, 246, 0.22)", text: "#bfdbfe", tag: "Strong" };
    if (value >= 5) return { tone: "moderate", start: "#facc15", end: "#eab308", glow: "rgba(234, 179, 8, 0.2)", text: "#fde68a", tag: "Moderate" };
    return { tone: "poor", start: "#f87171", end: "#dc2626", glow: "rgba(239, 68, 68, 0.24)", text: "#fecaca", tag: "Needs Improvement" };
  };

  const decoratedItems = rankedItems.map((item, index) => ({
    ...item,
    rank: index + 1,
    band: getBenchmarkBand(item.value)
  }));
  const topProgram = decoratedItems[0];
  const lowestProgram = decoratedItems[decoratedItems.length - 1];
  const max = Math.max(...decoratedItems.map((item) => item.value), 1);
  const interpretationPoints = [
    `${topProgram.label} leads the benchmark, indicating the strongest academic outcomes in the current dataset`,
    "Mid-tier programs show moderate consistency and have room to move into the top band",
    `${lowestProgram.label} is currently the weakest program average and should be prioritized for academic support`,
    "The spread across programs shows meaningful variation in performance and highlights where interventions are needed",
    "Improving low-performing programs will create a more balanced academic profile across the institution"
  ];

  container.innerHTML = `
    <div class="chart-shell program-benchmark-shell">
      <div class="chart-story">
        <div class="story-pill focus">
          <span>Top Performing Program</span>
          <strong>${escapeHtml(topProgram.label)} (${topProgram.value.toFixed(1)})</strong>
        </div>
        <div class="story-pill ${lowestProgram.value < 5 ? "alert" : "neutral"}">
          <span>Needs Attention</span>
          <strong>${escapeHtml(lowestProgram.label)} (${lowestProgram.value.toFixed(1)})</strong>
        </div>
        <div class="story-pill">
          <span>Programs Ranked</span>
          <strong>${decoratedItems.length}</strong>
        </div>
      </div>
      <div class="program-benchmark-head">
        <div>
          <p class="section-kicker">Program Benchmark</p>
          <h4>Top Performing Programs</h4>
        </div>
      </div>
      <div class="program-benchmark-list" role="img" aria-label="Programs ranked by average CGPA from highest to lowest">
        ${decoratedItems.map((item, index) => {
          const fillPercent = item.value === 0 ? 0 : Math.max((item.value / max) * 100, 8);
          return `
            <div class="program-benchmark-row ${index === 0 ? "is-highlight" : ""}" style="--benchmark-start:${item.band.start}; --benchmark-end:${item.band.end}; --benchmark-glow:${item.band.glow}; --benchmark-text:${item.band.text};">
              <div class="program-rank mono">${String(item.rank).padStart(2, "0")}</div>
              <div class="program-name-wrap">
                <strong class="program-name">${escapeHtml(item.label)}</strong>
                <span class="program-tag ${item.band.tone}">${index === 0 ? "Top Performer" : item.band.tag}</span>
              </div>
              <div class="program-bar-track">
                <div class="program-bar-fill" style="width:${fillPercent}%"></div>
              </div>
              <strong class="program-score mono">${item.value.toFixed(1)}</strong>
            </div>
          `;
        }).join("")}
      </div>
      <div class="chart-insight">
        <strong>Interpretation</strong>
        <ul class="chart-insight-list">
          ${interpretationPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

function renderSubjectPerformanceChart(items, emptyText = "No subject insights yet.") {
  const container = document.getElementById("subject-performance");
  if (!container) return;

  const prioritizedStudents = [...students]
    .filter((student) => Number(student.attendance) < 75 || ["At-Risk", "Critical"].includes(student.category))
    .sort((a, b) => Number(a.attendance) - Number(b.attendance) || Number(a.cgpa) - Number(b.cgpa));
  const prioritizedIds = new Set(prioritizedStudents.map((student) => student.id));
  const supportingStudents = [...students]
    .filter((student) => !prioritizedIds.has(student.id))
    .sort((a, b) => Number(a.attendance) - Number(b.attendance) || Number(a.cgpa) - Number(b.cgpa));

  const warningRows = [...prioritizedStudents, ...supportingStudents]
    .slice(0, 6)
    .map((student) => {
      const attendance = Number(student.attendance);
      let statusLabel = "Monitor";
      let statusClass = "warning-monitor";
      if (attendance < 65 || student.category === "Critical") {
        statusLabel = "Act Today";
        statusClass = "warning-act";
      } else if (attendance < 70 || student.category === "At-Risk") {
        statusLabel = "Watch Now";
        statusClass = "warning-watch";
      }
      return {
        id: student.id,
        name: student.name,
        attendance: `${attendance.toFixed(0)}%`,
        statusLabel,
        statusClass
      };
    });

  if (!warningRows.length) {
    container.innerHTML = `<div class="early-warning-empty table-meta">Records needed to show warnings.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="early-warning-panel">
      <div class="early-warning-head" aria-hidden="true">
        <span>Student</span>
        <span>Attendance</span>
        <span>Status</span>
        <span>Action</span>
      </div>
      <div class="early-warning-list">
        ${warningRows.map((row) => `
          <div class="early-warning-row">
            <strong class="early-warning-student">${escapeHtml(row.name)}</strong>
            <span class="early-warning-attendance mono">${escapeHtml(row.attendance)}</span>
            <span class="status-badge ${row.statusClass}">${escapeHtml(row.statusLabel)}</span>
            <button type="button" class="ghost-button early-warning-action" data-profile-id="${row.id}">View Details</button>
          </div>
        `).join("")}
      </div>
      <div class="early-warning-footer">
        <a href="#view-students" data-view="students">View all →</a>
      </div>
    </div>
  `;

  container.querySelectorAll("[data-profile-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedStudentId = button.dataset.profileId;
      setView("profile", { historyMode: "push" });
    });
  });
}

function getCleanSubjectLabel(rawLabel) {
  const label = String(rawLabel || "").replace(/\s+/g, " ").trim();
  if (!label) return null;
  if (/^(subject\s*\d+|overall assessment)$/i.test(label)) return null;
  const lettersOnly = label.replace(/[^a-z]/gi, "");
  if (lettersOnly.length < 3) return null;
  if (/^(.)\1{2,}$/i.test(lettersOnly)) return null;
  if (/^([a-z]{1,2})\1+$/i.test(lettersOnly)) return null;
  const uniqueRatio = new Set(lettersOnly.toLowerCase()).size / Math.max(lettersOnly.length, 1);
  const vowelCount = (lettersOnly.match(/[aeiou]/gi) || []).length;
  if (lettersOnly.length <= 5 && uniqueRatio <= 0.5) return null;
  if (!vowelCount && !/^(dbms|sql|hrm|ui|ux|ai|ml|it|cs)$/i.test(lettersOnly)) return null;
  return label;
}

function renderSubjectRiskStrengthChart(items, emptyText = "Subject performance overview will appear here.") {
  const container = document.getElementById("failure-heatmap");
  const grouped = new Map();
  items.forEach((item) => {
    const cleanLabel = getCleanSubjectLabel(item.label);
    const numericValue = Number(item.value);
    if (!cleanLabel || Number.isNaN(numericValue)) return;
    const key = cleanLabel.toLowerCase();
    if (!grouped.has(key)) grouped.set(key, { label: cleanLabel, values: [] });
    grouped.get(key).values.push(numericValue);
  });

  const rankedItems = [...grouped.values()]
    .map((entry) => ({
      label: entry.label,
      value: Number(average(entry.values, (value) => value).toFixed(1))
    }))
    .sort((a, b) => (b.value !== a.value ? b.value - a.value : a.label.localeCompare(b.label)));

  if (!rankedItems.length) {
    container.innerHTML = `<p class="table-meta">${escapeHtml(emptyText)}</p>`;
    return;
  }

  const getBand = (value) => {
    if (value >= 80) return { label: "Strong", start: "#4ade80", end: "#15803d", glow: "rgba(34, 197, 94, 0.32)", text: "#dcfce7" };
    if (value >= 70) return { label: "Good", start: "#60a5fa", end: "#2563eb", glow: "rgba(59, 130, 246, 0.28)", text: "#dbeafe" };
    if (value >= 60) return { label: "Moderate", start: "#fde047", end: "#ca8a04", glow: "rgba(250, 204, 21, 0.28)", text: "#fef3c7" };
    if (value >= 50) return { label: "Weak", start: "#fb923c", end: "#ea580c", glow: "rgba(249, 115, 22, 0.28)", text: "#ffedd5" };
    return { label: "High Risk", start: "#fb7185", end: "#dc2626", glow: "rgba(239, 68, 68, 0.3)", text: "#ffe4e6" };
  };

  const subjects = rankedItems.map((item) => ({
    ...item,
    band: getBand(item.value)
  }));
  const strongestSubject = subjects[0];
  const weakestSubject = subjects[subjects.length - 1];
  const interpretationPoints = [
    "Some subjects show strong performance with high average scores",
    "A few subjects fall into the weak and high-risk categories",
    "Performance varies significantly across subjects",
    "Weak subjects require focused academic improvement",
    "Strength areas can be used to maintain consistency"
  ];

  container.innerHTML = `
    <div class="subject-risk-shell">
      <div class="subject-risk-badges">
        <div class="subject-risk-badge">
          <span>Strongest Subject</span>
          <strong>${escapeHtml(strongestSubject.label)} | ${strongestSubject.value.toFixed(1)} (${escapeHtml(strongestSubject.band.label)})</strong>
        </div>
        <div class="subject-risk-badge">
          <span>Weakest Subject</span>
          <strong>${escapeHtml(weakestSubject.label)} | ${weakestSubject.value.toFixed(1)} (${escapeHtml(weakestSubject.band.label)})</strong>
        </div>
      </div>
      <div class="subject-risk-list" role="img" aria-label="Subject performance overview with average scores and risk levels">
        ${subjects.map((item, index) => `
          <div class="subject-risk-row">
            <div class="subject-risk-label">${escapeHtml(item.label)}</div>
            <div class="subject-risk-track">
              <div
                class="subject-risk-fill ${index === 0 ? "is-highlight" : ""}"
                style="--subject-width:${Math.max(item.value, item.value > 0 ? 10 : 0)}%; --subject-start:${item.band.start}; --subject-end:${item.band.end}; --subject-glow:${item.band.glow};"
              ></div>
            </div>
            <div class="subject-risk-meta" style="--subject-text:${item.band.text};">${item.value.toFixed(1)} ${escapeHtml(item.band.label)}</div>
          </div>
        `).join("")}
      </div>
      <div class="chart-insight subject-risk-insight">
        <strong>Interpretation</strong>
        <ul class="chart-insight-list">
          ${interpretationPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

function renderStudentsTable() {
  const wrap = document.getElementById("students-table-wrap");
  const canManage = canManageStudentRecords();
  const search = document.getElementById("search-students").value.toLowerCase();
  const semester = document.getElementById("filter-semester").value;
  const program = document.getElementById("filter-program").value;
  const category = document.getElementById("filter-category").value;
  const filtered = students.filter((student) => {
    const textMatch = `${student.name} ${student.enrollmentId} ${student.program}`.toLowerCase().includes(search);
    const semesterMatch = !semester || String(student.semester) === semester;
    const programMatch = !program || student.program === program;
    const categoryMatch = !category || student.category === category;
    return textMatch && semesterMatch && programMatch && categoryMatch;
  });
  if (!students.length) {
    wrap.innerHTML = emptyState("No students added", "The list stays empty until records are created through the form or imported from CSV.");
    return;
  }
  if (!filtered.length) {
    wrap.innerHTML = emptyState("No matching students", "Adjust the search or filter values to see results.", "Clear Filters", "students");
    return;
  }
  wrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>ID</th>
          <th>Program</th>
          <th>Semester</th>
          <th>CGPA</th>
          <th>Attendance</th>
          <th>Division</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${filtered
          .map(
            (student) => `
              <tr>
                <td class="mono">#${student.rank}</td>
                <td>${escapeHtml(student.name)}</td>
                <td>${escapeHtml(student.enrollmentId)}</td>
                <td>${escapeHtml(student.program)}</td>
                <td>${student.semester}</td>
                <td class="mono">${student.cgpa}</td>
                <td class="mono">${student.attendance}%</td>
                <td>${escapeHtml(student.division)}</td>
                <td><span class="status-badge status-${statusClass(student.category)}">${escapeHtml(student.category)}</span></td>
                <td>
                  <div class="table-actions">
                    <button type="button" class="ghost-button table-button" data-profile-id="${student.id}">View Profile</button>
                    ${canManage ? `<button type="button" class="ghost-button table-button" data-edit-id="${student.id}">Edit</button>` : ""}
                    ${canManage ? `<button type="button" class="icon-button table-button" data-delete-id="${student.id}">Delete</button>` : ""}
                  </div>
                </td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
  wrap.querySelectorAll("[data-profile-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedStudentId = button.dataset.profileId;
      setView("profile", { historyMode: "push" });
    });
  });
  wrap.querySelectorAll("[data-edit-id]").forEach((button) => {
    button.addEventListener("click", () => startEditStudent(button.dataset.editId));
  });
  wrap.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", () => openDeleteModal(button.dataset.deleteId, button));
  });
}

function buildAlerts(student) {
  const alerts = [];
  if (student.attendance < 65) {
    alerts.push({ level: "Critical", message: `Detained risk: attendance is ${student.attendance}%, below the minimum threshold.` });
  } else if (student.attendance < 75) {
    alerts.push({ level: "High", message: `Attendance is ${student.attendance}%. Intervention is needed to remain exam-eligible.` });
  }
  if (student.cgpa < 4) {
    alerts.push({ level: "Critical", message: `CGPA is ${student.cgpa}, below the minimum pass threshold.` });
  } else if (student.cgpa < 5) {
    alerts.push({ level: "Medium", message: `CGPA is ${student.cgpa}. Academic support is recommended.` });
  }
  if (student.backlogs > 0) {
    alerts.push({ level: student.backlogs > 2 ? "Critical" : "High", message: `${student.backlogs} active backlog(s) detected.` });
  }
  return alerts.length
    ? alerts
    : [{
        level: "Low Risk",
        points: [
          "No active academic alerts detected",
          "Student is in a stable and low-risk performance zone",
          "All key metrics are within acceptable limits",
          "No immediate intervention required",
          "Regular monitoring is recommended"
        ]
      }];
}

function getAttendanceBandConfig(attendance) {
  const value = clamp(safeNumber(attendance, 0), 0, 100);
  if (value >= 75) {
    return {
      label: "High Attendance",
      color: "#22c55e",
      soft: "rgba(34, 197, 94, 0.16)",
      stroke: "rgba(134, 239, 172, 0.8)"
    };
  }
  if (value >= 60) {
    return {
      label: "Moderate Attendance",
      color: "#f59e0b",
      soft: "rgba(245, 158, 11, 0.16)",
      stroke: "rgba(251, 191, 36, 0.8)"
    };
  }
  return {
    label: "Low Attendance",
    color: "#ef4444",
    soft: "rgba(239, 68, 68, 0.16)",
    stroke: "rgba(252, 165, 165, 0.8)"
  };
}

function averageSubjectScore(student) {
  return average(student.subjects, (subject) => safeNumber(subject.finalScore, 0) / 10);
}

function buildAttendanceMonitorInsights(student) {
  const averageScore = averageSubjectScore(student);
  const thresholdGap = (student.attendance - 75).toFixed(1);
  const attendanceBand = getAttendanceBandConfig(student.attendance);
  const firstSubject = student.subjects[0];
  const highAttendanceStudents = students.filter((item) => item.attendance >= 75);
  const belowThresholdStudents = students.filter((item) => item.attendance < 75);
  const highAttendanceAverage = highAttendanceStudents.length
    ? average(highAttendanceStudents, (item) => averageSubjectScore(item))
    : 0;
  const belowThresholdAverage = belowThresholdStudents.length
    ? average(belowThresholdStudents, (item) => averageSubjectScore(item))
    : 0;
  const cohortComparison =
    highAttendanceStudents.length && belowThresholdStudents.length
      ? `Students above 75% attendance average ${highAttendanceAverage.toFixed(1)} compared with ${belowThresholdAverage.toFixed(1)} below the line.`
      : `Add more student records to compare high-attendance and low-attendance performance groups.`;

  if (student.subjects.length === 1 && firstSubject) {
    return [
      `The subject "${firstSubject.subject}" has an attendance of ${student.attendance.toFixed(0)}%, which falls within the ${attendanceBand.label.toLowerCase()} range.`,
      student.attendance >= 75
        ? "The attendance level supports healthy engagement and should be maintained for continued academic performance."
        : "While acceptable, improved attendance is recommended to enhance academic performance.",
      "Subjects with attendance below 75% should be closely monitored for improvement.",
      "Improving attendance can directly contribute to better academic outcomes."
    ];
  }

  return [
    "Students with higher attendance generally show better academic performance, indicating a positive correlation.",
    student.attendance >= 75
      ? `Attendance is ${thresholdGap}% above the 75% threshold, supporting the current average subject score of ${averageScore.toFixed(1)}.`
      : `Attendance is ${Math.abs(Number(thresholdGap)).toFixed(1)}% below the 75% threshold, which places this profile in a visible risk zone.`,
    student.attendance < 75
      ? "Subjects with attendance below 75% show noticeable drops in scores, highlighting risk areas."
      : "A few cases may show moderate performance despite lower attendance, indicating inconsistent engagement.",
    "Overall attendance trends suggest the need for improved consistency in student participation.",
    "Subjects with strong attendance can be used as benchmarks for engagement strategies.",
    cohortComparison
  ];
}

function buildProfilePolylineChartSvg(data, options = {}) {
  const {
    width = 520,
    height = 220,
    minValue = 0,
    maxValue = 10,
    startColor = "#38bdf8",
    endColor = "#22d3ee",
    fill = true,
    valueFormatter = (value) => Number(value).toFixed(2),
    yLabel = "",
    areaOpacity = 0.18
  } = options;
  if (!Array.isArray(data) || !data.length) {
    return `<div class="profile-card-empty">No trend data available yet.</div>`;
  }
  const left = 44;
  const right = 20;
  const top = 18;
  const bottom = 34;
  const safeMax = Math.max(maxValue, minValue + 1);
  const stepX = data.length > 1 ? (width - left - right) / (data.length - 1) : 0;
  const baselineY = height - bottom;
  const points = data.map((item, index) => {
    const normalized = clamp((Number(item.value) - minValue) / (safeMax - minValue), 0, 1);
    return {
      x: data.length > 1 ? left + index * stepX : width / 2,
      y: baselineY - (normalized * (baselineY - top)),
      label: item.label,
      value: Number(item.value)
    };
  });
  const highestPoint = points.reduce((best, point) => (point.value > best.value ? point : best), points[0]);
  const latestPoint = points[points.length - 1];
  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPath = `M ${points[0].x} ${baselineY} L ${points.map((point) => `${point.x} ${point.y}`).join(" L ")} L ${points[points.length - 1].x} ${baselineY} Z`;
  const gradientId = `profile-chart-${Math.random().toString(36).slice(2, 9)}`;

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Profile trend chart">
      <defs>
        <linearGradient id="${gradientId}" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stop-color="${startColor}" />
          <stop offset="100%" stop-color="${endColor}" />
        </linearGradient>
      </defs>
      ${Array.from({ length: 4 }, (_, index) => {
        const y = top + (index * (baselineY - top)) / 3;
        return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" stroke="rgba(148,163,184,0.12)" />`;
      }).join("")}
      ${fill ? `<path d="${areaPath}" fill="url(#${gradientId})" opacity="${areaOpacity}"></path>` : ""}
      <polyline fill="none" stroke="url(#${gradientId})" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="${polylinePoints}"></polyline>
      ${points.map((point) => {
        const isHighest = point.label === highestPoint.label && point.value === highestPoint.value;
        const isLatest = point.label === latestPoint.label && point.value === latestPoint.value;
        const ringColor = isHighest ? "#f8fafc" : isLatest ? "#7dd3fc" : "rgba(226,232,240,0.7)";
        return `
          <g class="profile-chart-point" tabindex="0" aria-label="${escapeHtml(`${formatTrendLabel(point.label)} | ${valueFormatter(point.value)}`)}">
            <title>${escapeHtml(`${formatTrendLabel(point.label)} | ${valueFormatter(point.value)}`)}</title>
            ${isHighest || isLatest ? `<circle cx="${point.x}" cy="${point.y}" r="15" fill="url(#${gradientId})" opacity="0.16"></circle>` : ""}
            <circle cx="${point.x}" cy="${point.y}" r="${isHighest || isLatest ? 9 : 7}" fill="#0f172a" stroke="${ringColor}" stroke-width="2"></circle>
            <circle cx="${point.x}" cy="${point.y}" r="${isHighest || isLatest ? 5 : 4}" fill="url(#${gradientId})"></circle>
          </g>
        `;
      }).join("")}
      ${points.map((point) => `<text x="${point.x}" y="${height - 6}" fill="#94a3b8" font-size="11" text-anchor="middle">${escapeHtml(formatShortSemesterLabel(point.label))}</text>`).join("")}
      ${yLabel ? `<text x="16" y="${height / 2}" fill="#94a3b8" font-size="11" text-anchor="middle" transform="rotate(-90 16 ${height / 2})">${escapeHtml(yLabel)}</text>` : ""}
    </svg>
  `;
}

function buildAttendanceGaugeSvg(percentage, tone) {
  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  const normalized = clamp(Number(percentage), 0, 100);
  const offset = circumference * (1 - normalized / 100);
  return `
    <svg viewBox="0 0 180 180" role="img" aria-label="Attendance gauge">
      <defs>
        <linearGradient id="attendance-gauge-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${tone.start}" />
          <stop offset="100%" stop-color="${tone.end}" />
        </linearGradient>
        <radialGradient id="attendance-gauge-core" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.18)" />
          <stop offset="100%" stop-color="rgba(15,23,42,0)" />
        </radialGradient>
        <filter id="attendance-gauge-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur"></feGaussianBlur>
          <feMerge>
            <feMergeNode in="blur"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
      </defs>
      <circle cx="90" cy="90" r="82" fill="url(#attendance-gauge-core)" opacity="0.9"></circle>
      <circle cx="90" cy="90" r="${radius}" fill="none" stroke="rgba(148,163,184,0.12)" stroke-width="14"></circle>
      <circle cx="90" cy="90" r="${radius}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4"></circle>
      <circle cx="90" cy="90" r="${radius}" fill="none" stroke="url(#attendance-gauge-gradient)" stroke-width="14" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" transform="rotate(-90 90 90)" filter="url(#attendance-gauge-glow)"></circle>
      <circle cx="90" cy="90" r="52" fill="rgba(9,15,26,0.88)" stroke="rgba(148,163,184,0.12)" stroke-width="1.5"></circle>
    </svg>
  `;
}

function renderProfilePerformanceSnapshot(student) {
  const container = document.getElementById("profile-trend");
  if (!container) return;
  const history = buildSemesterHistory(student).map((item) => ({ ...item, value: clamp(Number(item.value), 0, 10) }));
  if (!history.length) {
    container.innerHTML = `<div class="profile-card-empty">Academic progression appears after semester data is added.</div>`;
    return;
  }
  const first = history[0];
  const latest = history[history.length - 1];
  const highest = history.reduce((best, item) => (item.value > best.value ? item : best), history[0]);
  const delta = latest.value - first.value;
  const direction = delta > 0.15 ? "rising" : delta < -0.15 ? "declining" : "stable";

  container.innerHTML = `
    <div class="profile-card-shell">
      <div class="profile-card-head">
        <div>
          <p class="profile-card-kicker">Academic Progression</p>
          <h4>Semester-wise SGPA Trend</h4>
        </div>
        <div class="profile-card-metric">
          <span>Peak SGPA</span>
          <strong>${highest.value.toFixed(2)}</strong>
        </div>
      </div>
      <div class="profile-card-chart">
        ${buildProfilePolylineChartSvg(history, {
          minValue: 0,
          maxValue: 10,
          startColor: "#2563eb",
          endColor: "#22d3ee",
          yLabel: "SGPA",
          valueFormatter: (value) => Number(value).toFixed(2)
        })}
      </div>
      <p class="profile-card-note">Academic performance shows a ${direction} trend, with the highest SGPA achieved in ${formatTrendLabel(highest.label)}, indicating overall progression direction.</p>
    </div>
  `;
}

function renderAttendanceMonitorChart(student) {
  const container = document.getElementById("profile-attendance-monitor");
  if (!container) return;
  const attendancePercent = clamp(safeNumber(student.attendance, 0), 0, 100);
  const tone = attendancePercent < 65
    ? { start: "#f97316", end: "#fb7185", status: "Below Threshold" }
    : attendancePercent < 75
      ? { start: "#f59e0b", end: "#fde047", status: "Below Threshold" }
      : { start: "#22c55e", end: "#14b8a6", status: "Above Threshold" };

  container.innerHTML = `
    <div class="profile-card-shell">
      <div class="profile-card-head">
        <div>
          <p class="profile-card-kicker">Attendance Monitor</p>
          <h4>Eligibility Status Gauge</h4>
        </div>
        <div class="profile-card-metric">
          <span>Threshold</span>
          <strong>75%</strong>
        </div>
      </div>
      <div class="profile-card-chart profile-gauge-chart">
        <div class="profile-gauge-shell">
          ${buildAttendanceGaugeSvg(attendancePercent, tone)}
          <div class="profile-gauge-center">
            <strong>${attendancePercent.toFixed(0)}%</strong>
            <span>${tone.status}</span>
          </div>
        </div>
      </div>
      <p class="profile-card-note">Current attendance is ${attendancePercent.toFixed(0)}%, which is ${attendancePercent >= 75 ? "above" : "below"} the required 75% threshold, indicating ${attendancePercent >= 75 ? "eligibility status" : "risk"}.</p>
    </div>
  `;
}

function renderProfileAcademicTimeline(student) {
  const container = document.getElementById("profile-academic-timeline");
  if (!container) return;
  if (!profileTimelineDismissBound) {
    document.addEventListener("click", (event) => {
      if (activeProfileTimelineSemester == null) return;
      const root = document.querySelector("[data-profile-timeline-root='true']");
      if (!root) return;
      if (event.target instanceof Node && root.contains(event.target)) return;
      activeProfileTimelineSemester = null;
      renderProfile();
    });
    profileTimelineDismissBound = true;
  }

  const semesterPalette = [
    { start: "#22c55e", end: "#14b8a6", glow: "rgba(34, 197, 94, 0.28)" },
    { start: "#06b6d4", end: "#3b82f6", glow: "rgba(14, 165, 233, 0.28)" },
    { start: "#6366f1", end: "#8b5cf6", glow: "rgba(99, 102, 241, 0.28)" },
    { start: "#a855f7", end: "#ec4899", glow: "rgba(168, 85, 247, 0.28)" },
    { start: "#f43f5e", end: "#fb7185", glow: "rgba(244, 63, 94, 0.28)" },
    { start: "#f97316", end: "#f59e0b", glow: "rgba(249, 115, 22, 0.28)" },
    { start: "#eab308", end: "#84cc16", glow: "rgba(234, 179, 8, 0.28)" },
    { start: "#0ea5e9", end: "#2563eb", glow: "rgba(37, 99, 235, 0.28)" }
  ];
  const semesterRecords = Array.isArray(student.semesterRecords) && student.semesterRecords.length
    ? [...student.semesterRecords].sort((a, b) => Number(a.semester) - Number(b.semester))
    : [student];
  const latestRecord = semesterRecords[semesterRecords.length - 1] || student;
  const latestSemester = clamp(safeNumber(latestRecord.semester, 1), 1, 8);
  const semesterRecordMap = new Map(semesterRecords.map((record) => [Number(record.semester), record]));
  const formatAttendance = (value) => `${Number(value).toFixed(1).replace(/\.0$/, "")}%`;
  const formatDailyStudyHours = (value) => `${(safeNumber(value, 0) / 7).toFixed(1).replace(/\.0$/, "")} hrs/day`;
  const semesterItems = Array.from({ length: 8 }, (_, index) => {
    const semester = index + 1;
    const palette = semesterPalette[index] || semesterPalette[0];
    const hasRecord = semesterRecordMap.has(semester);
    return {
      semester,
      label: `Sem ${semester}`,
      chip: `0${semester}`,
      tone: semester === latestSemester && hasRecord ? "Current" : hasRecord ? "Entered" : "Open",
      palette,
      isPast: hasRecord && semester < latestSemester,
      isCurrent: semester === latestSemester && hasRecord,
      isFuture: !hasRecord
    };
  });
  const activeSemester = activeProfileTimelineStudentId === student.enrollmentId ? activeProfileTimelineSemester : null;
  const activePalette = activeSemester ? semesterItems[activeSemester - 1]?.palette || semesterPalette[0] : null;
  const detail = activeSemester == null
    ? null
    : (() => {
      const semesterRecord = semesterRecordMap.get(activeSemester);
      if (semesterRecord) {
        const insight =
          semesterRecord.backlogs > 0 && semesterRecord.attendance < 75
            ? "Performance needs immediate attention because low attendance and backlog pressure are both active."
            : semesterRecord.backlogs > 0
              ? "Performance is being held back mainly by active backlog pressure in the current semester."
              : semesterRecord.attendance < 75
                ? "Attendance is the main risk factor in this semester and should be corrected first."
                : semesterRecord.cgpa >= 8 && semesterRecord.attendance >= 85
                  ? "This semester is strong, with solid academic standing and consistent attendance."
                  : "This semester is stable overall, with room to improve through more consistent study effort.";
        return {
          kind: "record",
          title: `Semester ${activeSemester}`,
          cgpa: Number(semesterRecord.cgpa).toFixed(2),
          attendance: formatAttendance(semesterRecord.attendance),
          backlogs: String(semesterRecord.backlogs),
          studyHours: formatDailyStudyHours(semesterRecord.studyHours),
          insight
        };
      }
      return {
        kind: "empty",
        title: `Semester ${activeSemester}`,
        semester: activeSemester,
        message: "No data has been entered for this semester.",
        note: "Please add semester details to view insights."
      };
    })();

  container.innerHTML = `
    <div class="profile-semester-timeline" data-profile-timeline-root="true">
      <div class="profile-semester-rail-wrap">
        <div class="profile-semester-rail" role="list" aria-label="Student semester timeline from Semester 1 to Semester 8">
          ${semesterItems.map((item) => `
            <button
              type="button"
              class="profile-semester-stop ${item.isCurrent ? "is-current" : ""} ${activeSemester === item.semester ? "is-active" : ""} ${item.isFuture ? "is-future" : ""}"
              data-semester="${item.semester}"
              aria-pressed="${activeSemester === item.semester ? "true" : "false"}"
              style="--semester-start:${item.palette.start}; --semester-end:${item.palette.end}; --semester-glow:${item.palette.glow};"
            >
              <span class="profile-semester-stop-chip">${escapeHtml(item.chip)}</span>
              <span class="profile-semester-stop-label">${escapeHtml(item.label)}</span>
              <span class="profile-semester-stop-dot" aria-hidden="true"></span>
              <span class="profile-semester-stop-state">${escapeHtml(item.tone)}</span>
            </button>
          `).join("")}
        </div>
      </div>
      <div
        class="profile-semester-detail ${detail ? "is-visible" : ""}"
        ${detail ? "" : "hidden"}
        aria-live="polite"
        ${detail && activePalette ? `style="--detail-start:${activePalette.start}; --detail-end:${activePalette.end}; --detail-glow:${activePalette.glow};"` : ""}
      >
        ${detail ? `
          <div class="profile-semester-detail-head">
            <span class="profile-semester-detail-kicker">Selected Semester</span>
            <strong>${escapeHtml(detail.title)}</strong>
          </div>
          ${detail.kind === "record" ? `
            <div class="profile-semester-detail-grid">
              <div class="profile-semester-detail-metric"><span>CGPA</span><strong>${escapeHtml(detail.cgpa)}</strong></div>
              <div class="profile-semester-detail-metric"><span>Attendance</span><strong>${escapeHtml(detail.attendance)}</strong></div>
              <div class="profile-semester-detail-metric"><span>Backlogs</span><strong>${escapeHtml(detail.backlogs)}</strong></div>
              <div class="profile-semester-detail-metric"><span>Study Hours</span><strong>${escapeHtml(detail.studyHours)}</strong></div>
            </div>
            <div class="profile-semester-detail-insight">
              <span>Insight</span>
              <p>${escapeHtml(detail.insight)}</p>
            </div>
          ` : `
            <div class="profile-semester-detail-empty">
              <span class="profile-semester-detail-empty-icon" aria-hidden="true">•</span>
              <strong>${escapeHtml(detail.message)}</strong>
              <p>${escapeHtml(detail.note)}</p>
              <div class="profile-semester-detail-empty-actions">
                <button type="button" class="primary-button profile-semester-detail-add" data-add-semester="${detail.semester}">
                  + Add Semester Details
                </button>
              </div>
            </div>
          `}
        ` : ""}
      </div>
    </div>
  `;

  container.querySelectorAll("[data-semester]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const semester = Number(button.dataset.semester);
      activeProfileTimelineStudentId = student.enrollmentId;
      activeProfileTimelineSemester = activeProfileTimelineSemester === semester ? null : semester;
      renderProfileAcademicTimeline(student);
    });
  });

  container.querySelectorAll("[data-add-semester]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      startSpecificSemesterEntry(student.currentRecord || student, Number(button.dataset.addSemester));
    });
  });

  const timelineRoot = container.querySelector("[data-profile-timeline-root='true']");
  if (timelineRoot) {
    timelineRoot.addEventListener("mouseleave", () => {
      if (activeProfileTimelineSemester == null) return;
      activeProfileTimelineSemester = null;
      renderProfileAcademicTimeline(student);
    });
  }
}

function renderProfileSemesterInsightBox(student) {
  const container = document.getElementById("profile-semester-insight");
  if (!container) return;
  const strongestSubject = [...student.subjects]
    .sort((a, b) => safeNumber(b.finalScore, 0) - safeNumber(a.finalScore, 0))[0];
  const weakestSubject = [...student.subjects]
    .sort((a, b) => safeNumber(a.finalScore, 0) - safeNumber(b.finalScore, 0))[0];
  const insightPoints = [
    `Semester ${student.semester} is currently classified as ${student.category}.`,
    student.attendance >= 75
      ? `Attendance at ${student.attendance}% supports regular academic continuity.`
      : `Attendance at ${student.attendance}% is below the preferred threshold and needs attention.`,
    student.backlogs > 0
      ? `${student.backlogs} backlog${student.backlogs === 1 ? "" : "s"} are shaping the current intervention priority.`
      : "No active backlogs are recorded for this student at present.",
    strongestSubject
      ? `${strongestSubject.subject} is currently the strongest subject area.`
      : "Subject-level insights will appear once marks are available."
  ];

  container.innerHTML = `
    <div class="profile-semester-insight-shell">
      <div class="profile-semester-insight-grid">
        <div class="profile-semester-insight-card">
          <span>Current Semester</span>
          <strong>Semester ${student.semester}</strong>
          <small>${escapeHtml(student.program)}</small>
        </div>
        <div class="profile-semester-insight-card">
          <span>Attendance Status</span>
          <strong>${student.attendance}%</strong>
          <small>${escapeHtml(student.attendanceStatus)}</small>
        </div>
        <div class="profile-semester-insight-card">
          <span>Strongest Subject</span>
          <strong>${escapeHtml(strongestSubject ? strongestSubject.subject : "--")}</strong>
          <small>${strongestSubject ? `${safeNumber(strongestSubject.finalScore, 0).toFixed(1)} score` : "No subject data yet"}</small>
        </div>
        <div class="profile-semester-insight-card">
          <span>Priority Focus</span>
          <strong>${escapeHtml(weakestSubject ? weakestSubject.subject : "General Support")}</strong>
          <small>${weakestSubject ? `${safeNumber(weakestSubject.finalScore, 0).toFixed(1)} score` : "Monitor current term"}</small>
        </div>
      </div>
      <div class="chart-insight">
        <strong>Dynamic Semester Insights</strong>
        <ul class="chart-insight-list">
          ${insightPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

function renderProfilePerformanceSegments(student) {
  const container = document.getElementById("profile-segmentation");
  if (!container) return;
  const semesterRecords = Array.isArray(student.semesterRecords) && student.semesterRecords.length
    ? [...student.semesterRecords]
    : [student];
  const totalSemesters = 8;
  const enteredSemesters = semesterRecords.length;
  const confidence = clamp((enteredSemesters / totalSemesters) * 100, 0, 100);
  const confidenceRounded = Math.round(confidence);
  const confidenceTone = confidenceRounded <= 30
    ? { start: "#ef4444", end: "#fb7185", level: "Low" }
    : confidenceRounded <= 60
      ? { start: "#f59e0b", end: "#fde047", level: "Moderate" }
      : { start: "#22c55e", end: "#14b8a6", level: "High" };
  const coverageMessage = enteredSemesters <= 2
    ? "Very limited data available"
    : enteredSemesters <= 5
      ? "Partial data available"
      : "Sufficient data for reliable analysis";

  container.innerHTML = `
    <div class="profile-card-shell">
      <div class="profile-card-head">
        <div>
          <p class="profile-card-kicker">Data Confidence Level</p>
          <h4>Based on available semester records</h4>
        </div>
        <div class="profile-card-metric">
          <span>Confidence</span>
          <strong>${confidenceRounded}%</strong>
        </div>
      </div>
      <div class="profile-card-chart">
        <div class="profile-confidence-shell">
          <div class="profile-confidence-stats">
            <div class="profile-confidence-stat">
              <span>Data Coverage</span>
              <strong>${enteredSemesters} / ${totalSemesters} Semesters</strong>
            </div>
            <div class="profile-confidence-stat">
              <span>Status</span>
              <strong>${escapeHtml(coverageMessage)}</strong>
            </div>
          </div>
          <div class="profile-confidence-track" aria-label="Data confidence progress">
            <div class="profile-confidence-fill" style="width:${confidenceRounded}%; --confidence-start:${confidenceTone.start}; --confidence-end:${confidenceTone.end};"></div>
          </div>
          <div class="profile-confidence-meta">
            <span class="profile-confidence-pill" style="--confidence-start:${confidenceTone.start}; --confidence-end:${confidenceTone.end};">${escapeHtml(confidenceTone.level)} Confidence</span>
            <strong>${confidenceRounded}%</strong>
          </div>
          <div class="profile-confidence-copy">
            <div class="profile-confidence-line">
              <span>System Insight</span>
              <p>Current analysis is based on limited academic data and may not fully represent long-term performance trends.</p>
            </div>
            <div class="profile-confidence-line">
              <span>Recommendation</span>
              <p>Add remaining semester data to unlock complete and reliable academic insights.</p>
            </div>
          </div>
        </div>
      </div>
      <p class="profile-card-note">${enteredSemesters} semester${enteredSemesters === 1 ? "" : "s"} entered so far. Confidence is ${confidenceTone.level.toLowerCase()}, so conclusions should be treated with appropriate caution.</p>
    </div>
  `;
}

function renderProfileAcademicBenchmark(student) {
  const container = document.getElementById("profile-benchmark");
  if (!container) return;
  const internalReadiness = student.subjects.length
    ? average(student.subjects, (subject) => (safeNumber(subject.assignments, 0) / MARK_LIMITS.assignments) * 100)
    : 0;
  const externalReadiness = student.subjects.length
    ? average(student.subjects, (subject) => (safeNumber(subject.external, 0) / MARK_LIMITS.external) * 100)
    : 0;
  const studyDiscipline = clamp((safeNumber(student.studyHours, 0) / 20) * 100, 0, 100);
  const consistency = clamp(safeNumber(student.previousCgpa, 0) * 10, 0, 100);
  const benchmarkItems = [
    { label: "Internal Readiness", value: internalReadiness },
    { label: "External Readiness", value: externalReadiness },
    { label: "Study Discipline", value: studyDiscipline },
    { label: "Consistency Base", value: consistency }
  ];
  const best = [...benchmarkItems].sort((a, b) => b.value - a.value)[0];
  const weakest = [...benchmarkItems].sort((a, b) => a.value - b.value)[0];

  container.innerHTML = `
    <div class="profile-benchmark-shell">
      <div class="profile-benchmark-list">
        ${benchmarkItems.map((item) => `
          <div class="profile-benchmark-row">
            <span>${escapeHtml(item.label)}</span>
            <div class="profile-benchmark-track">
              <div class="profile-benchmark-fill" style="width:${item.value.toFixed(1)}%"></div>
            </div>
            <strong>${item.value.toFixed(0)}%</strong>
          </div>
        `).join("")}
      </div>
      <div class="chart-insight">
        <strong>Interpretation</strong>
        <ul class="chart-insight-list">
          <li>${escapeHtml(`${best.label} is currently the strongest benchmark area.`)}</li>
          <li>${escapeHtml(`${weakest.label} has the most room for improvement in this student profile.`)}</li>
          <li>${escapeHtml("These benchmarks summarize internal marks, external marks, study effort, and academic consistency for this student alone.")}</li>
        </ul>
      </div>
    </div>
  `;
}

function renderSubjectRiskStrengthChartInto(containerId, items, emptyText = "Subject performance overview will appear here.", interpretationPoints = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const grouped = new Map();
  items.forEach((item) => {
    const cleanLabel = getCleanSubjectLabel(item.label);
    const numericValue = Number(item.value);
    if (!cleanLabel || Number.isNaN(numericValue)) return;
    const key = cleanLabel.toLowerCase();
    if (!grouped.has(key)) grouped.set(key, { label: cleanLabel, values: [] });
    grouped.get(key).values.push(numericValue);
  });

  const rankedItems = [...grouped.values()]
    .map((entry) => ({
      label: entry.label,
      value: Number(average(entry.values, (value) => value).toFixed(1))
    }))
    .sort((a, b) => (b.value !== a.value ? b.value - a.value : a.label.localeCompare(b.label)));

  if (!rankedItems.length) {
    container.innerHTML = `<p class="table-meta">${escapeHtml(emptyText)}</p>`;
    return;
  }

  const getBand = (value) => {
    if (value >= 80) return { label: "Strong", start: "#4ade80", end: "#15803d", glow: "rgba(34, 197, 94, 0.32)", text: "#dcfce7" };
    if (value >= 70) return { label: "Good", start: "#60a5fa", end: "#2563eb", glow: "rgba(59, 130, 246, 0.28)", text: "#dbeafe" };
    if (value >= 60) return { label: "Moderate", start: "#fde047", end: "#ca8a04", glow: "rgba(250, 204, 21, 0.28)", text: "#fef3c7" };
    if (value >= 50) return { label: "Weak", start: "#fb923c", end: "#ea580c", glow: "rgba(249, 115, 22, 0.28)", text: "#ffedd5" };
    return { label: "High Risk", start: "#fb7185", end: "#dc2626", glow: "rgba(239, 68, 68, 0.3)", text: "#ffe4e6" };
  };

  const subjects = rankedItems.map((item) => ({
    ...item,
    band: getBand(item.value)
  }));
  const strongestSubject = subjects[0];
  const weakestSubject = subjects[subjects.length - 1];
  const points = interpretationPoints || [
    "Some subjects show strong performance with high average scores",
    "A few subjects fall into the weak and high-risk categories",
    "Performance varies significantly across subjects",
    "Weak subjects require focused academic improvement",
    "Strength areas can be used to maintain consistency"
  ];

  container.innerHTML = `
    <div class="subject-risk-shell">
      <div class="subject-risk-badges">
        <div class="subject-risk-badge">
          <span>Strongest Subject</span>
          <strong>${escapeHtml(strongestSubject.label)} | ${strongestSubject.value.toFixed(1)} (${escapeHtml(strongestSubject.band.label)})</strong>
        </div>
        <div class="subject-risk-badge">
          <span>Weakest Subject</span>
          <strong>${escapeHtml(weakestSubject.label)} | ${weakestSubject.value.toFixed(1)} (${escapeHtml(weakestSubject.band.label)})</strong>
        </div>
      </div>
      <div class="subject-risk-list" role="img" aria-label="Subject performance overview with average scores and risk levels">
        ${subjects.map((item, index) => `
          <div class="subject-risk-row">
            <div class="subject-risk-label">${escapeHtml(item.label)}</div>
            <div class="subject-risk-track">
              <div
                class="subject-risk-fill ${index === 0 ? "is-highlight" : ""}"
                style="--subject-width:${Math.max(item.value, item.value > 0 ? 10 : 0)}%; --subject-start:${item.band.start}; --subject-end:${item.band.end}; --subject-glow:${item.band.glow};"
              ></div>
            </div>
            <div class="subject-risk-meta" style="--subject-text:${item.band.text};">${item.value.toFixed(1)} ${escapeHtml(item.band.label)}</div>
          </div>
        `).join("")}
      </div>
      <div class="chart-insight subject-risk-insight">
        <strong>Interpretation</strong>
        <ul class="chart-insight-list">
          ${points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

function renderProfileSubjectRiskStrength(student) {
  renderSubjectRiskStrengthChartInto(
    "profile-subject-risk",
    student.subjects.map((subject) => ({
      label: subject.subject,
      value: safeNumber(subject.finalScore ?? subject.total, 0)
    })),
    "Add subject scores to view this student's subject strength chart.",
    [
      "This chart reflects only the selected student's subject-level performance.",
      "The strongest subject can be used as a confidence anchor for future planning.",
      "The weakest subject should be prioritized for targeted academic improvement."
    ]
  );
}

function renderProfileRiskTrend(student) {
  const container = document.getElementById("profile-risk-trend");
  if (!container) return;
  const semesterRecords = Array.isArray(student.semesterRecords) && student.semesterRecords.length
    ? [...student.semesterRecords].sort((a, b) => Number(a.semester) - Number(b.semester))
    : [student];
  if (!semesterRecords.length) {
    container.innerHTML = `<div class="profile-card-empty">Risk history appears after semester data is added.</div>`;
    return;
  }
  const trendPoints = semesterRecords.map((record, index) => {
    const baseline = clamp(safeNumber(record.sgpa, 0), 0, 10);
    const riskValue = clamp(
      (10 - baseline) * 8 +
      Math.max(0, 75 - safeNumber(record.attendance, 0)) * 0.55 +
      safeNumber(record.backlogs, 0) * 9 +
      Math.max(0, 12 - safeNumber(record.studyHours, 0)) * 1.4 +
      (index === semesterRecords.length - 1 ? 3 : 0),
      5,
      100
    );
    return {
      label: `S${record.semester}`,
      value: Number(riskValue.toFixed(1))
    };
  });
  const highestRisk = trendPoints.reduce((best, item) => (item.value > best.value ? item : best), trendPoints[0]);
  const latestRisk = trendPoints[trendPoints.length - 1];
  const firstRisk = trendPoints[0];
  const delta = latestRisk.value - firstRisk.value;
  const direction = delta > 4 ? "increasing" : delta < -4 ? "improving" : "stable";
  container.innerHTML = `
    <div class="profile-card-shell">
      <div class="profile-card-head">
        <div>
          <p class="profile-card-kicker">At-Risk Trend</p>
          <h4>Semester Risk Trajectory</h4>
        </div>
        <div class="profile-card-metric">
          <span>Latest Risk</span>
          <strong>${latestRisk.value.toFixed(1)}</strong>
        </div>
      </div>
      <div class="profile-card-chart">
        ${buildProfilePolylineChartSvg(trendPoints, {
          minValue: 0,
          maxValue: 100,
          startColor: "#fb7185",
          endColor: "#f59e0b",
          yLabel: "Risk",
          valueFormatter: (value) => Number(value).toFixed(1),
          areaOpacity: 0.16
        })}
      </div>
      <p class="profile-card-note">Risk levels show a ${direction} trend, with peak risk in ${formatTrendLabel(highestRisk.label)}, indicating current academic risk trajectory.</p>
      <div class="profile-card-insights">
        <p class="profile-card-insights-title">Insights</p>
        <ul class="profile-card-insights-list">
          <li>Peak risk appears in ${formatTrendLabel(highestRisk.label)}.</li>
          <li>Current semester risk is ${latestRisk.value.toFixed(1)}.</li>
          <li>Use this trend to identify early support needs.</li>
        </ul>
      </div>
    </div>
  `;
}

function renderProfile() {
  const mount = document.getElementById("profile-shell");
  const anchorStudent = students.find((item) => item.id === selectedStudentId) || students[0];
  const student = buildProfileStudent(anchorStudent);
  if (!student) {
    mount.innerHTML = `
      <div class="empty-state glass-card">
        <strong>Select a student profile</strong>
        <p>Open a student from the Students table to view detailed scores, alerts, and progression data.</p>
        <button type="button" class="primary-button" data-view="students">Open Students</button>
      </div>
    `;
    return;
  }
  selectedStudentId = anchorStudent ? anchorStudent.id : student.id;
  if (activeProfileTimelineStudentId !== student.enrollmentId) {
    activeProfileTimelineStudentId = student.enrollmentId;
    activeProfileTimelineSemester = null;
  }
  const managementStudent = student.currentRecord || student;
  const semesterRecords = Array.isArray(student.semesterRecords) && student.semesterRecords.length
    ? [...student.semesterRecords].sort((a, b) => Number(a.semester) - Number(b.semester) || String(a.id).localeCompare(String(b.id)))
    : [student];
  const scoreTableRows = semesterRecords.flatMap((record) =>
    (Array.isArray(record.subjects) ? record.subjects : []).map((subject) => ({
      semester: Number(record.semester),
      subject
    }))
  );
  mount.innerHTML = `
    <div class="profile-grid">
      <article class="glass-card profile-hero">
        <div class="profile-banner">
          <div class="avatar">
            <img class="avatar-icon" src="./photos/open-enrollment.png" alt="Student profile icon">
          </div>
          <div>
            <p class="section-kicker">Student Profile</p>
            <h4>${escapeHtml(student.name)}</h4>
            <p>${escapeHtml(student.enrollmentId)} | ${escapeHtml(student.program)} | Semester ${student.semester}</p>
            <div class="inline-actions">
              <span class="status-badge status-${statusClass(student.category)}">${escapeHtml(student.category)}</span>
              <span class="status-badge status-${statusClass(student.attendanceStatus)}">${escapeHtml(student.attendanceStatus)}</span>
            </div>
          </div>
        </div>
        <div class="summary-card">
          <span>Academic Standing</span>
          <strong></strong>
          <p></p>
          <div class="inline-actions profile-actions">
            ${canManageStudentRecords() ? `<button type="button" class="primary-button" data-edit-id="${managementStudent.id}">Edit Student</button>` : ""}
            ${canManageStudentRecords() ? `<button type="button" class="icon-button" data-delete-id="${managementStudent.id}">Delete Student</button>` : ""}
          </div>
        </div>
      </article>
      <article class="glass-card profile-timeline-card">
        <p class="section-kicker">Academic Timeline</p>
        <h4>Semester-wise journey from Semester 1 to Semester 8</h4>
        <div id="profile-academic-timeline" class="profile-analytics-mount"></div>
      </article>
      <div class="profile-visual-grid">
        <article class="glass-card profile-visual-card">
          <div id="profile-trend" class="profile-analytics-mount"></div>
        </article>
        <article class="glass-card profile-visual-card">
          <div id="profile-attendance-monitor" class="profile-analytics-mount"></div>
        </article>
        <article class="glass-card profile-visual-card">
          <div id="profile-risk-trend" class="profile-analytics-mount" role="region" aria-label="Student risk trend chart"></div>
        </article>
        <article class="glass-card profile-visual-card">
          <div id="profile-segmentation" class="profile-analytics-mount"></div>
        </article>
      </div>
      <article class="glass-card">
        <p class="section-kicker">Score Table</p>
        <h4>Semester, subject, credits, marks, grade, and grade points</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Semester</th><th>Subject</th><th>Credits</th><th>Internal Assessment</th><th>External Examination</th><th>Total</th><th>Grade</th><th>GP</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${scoreTableRows
                .map(
                  ({ semester, subject }) => `
                    <tr>
                      <td class="mono">Sem ${semester}</td>
                      <td>${escapeHtml(subject.subject)}</td>
                      <td>${subject.credits}</td>
                      <td>${subject.assignments}</td>
                      <td>${subject.external}</td>
                      <td class="mono">${subject.finalScore}</td>
                      <td>${escapeHtml(subject.grade)}</td>
                      <td>${subject.points}</td>
                      <td><span class="status-badge status-${subject.grade === "F" ? "critical" : "good"}">${escapeHtml(subject.label)}</span></td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  `;
  mount.querySelectorAll("[data-edit-id]").forEach((button) => {
    button.addEventListener("click", () => startEditStudent(button.dataset.editId));
  });
  mount.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", () => openDeleteModal(button.dataset.deleteId, button));
  });
  renderProfilePerformanceSnapshot(student);
  renderAttendanceMonitorChart(student);
  renderProfileAcademicTimeline(student);
  renderProfilePerformanceSegments(student);
  renderProfileRiskTrend(student);
}

function aggregateAverage(items, key, valueKey) {
  const groups = {};
  items.forEach((item) => {
    if (!groups[item[key]]) groups[item[key]] = [];
    groups[item[key]].push(Number(item[valueKey]));
  });
  return Object.entries(groups).map(([groupKey, values]) => ({
    key: groupKey,
    value: average(values, (entry) => entry)
  }));
}

function renderAnalytics() {
  const scatter = document.getElementById("scatter-plot");
  const heatmap = document.getElementById("failure-heatmap");
  if (!students.length) {
    scatter.innerHTML = `<p class="table-meta">Performance segmentation appears after student data is added.</p>`;
    heatmap.innerHTML = `<p class="table-meta">Subject performance overview will appear here.</p>`;
    renderProgramBenchmark([], "Program comparison will appear here.");
    renderTrend("risk-trend", [], "value", "#f97316");
    return;
  }
  const avgAttendance = average(students, (student) => Number(student.attendance));
  const avgCgpa = average(students, (student) => student.cgpa);
  const quadrantGroups = {
    topPerformers: students.filter((student) => Number(student.attendance) >= avgAttendance && Number(student.cgpa) >= avgCgpa),
    needsAttention: students.filter((student) => Number(student.attendance) >= avgAttendance && Number(student.cgpa) < avgCgpa),
    inconsistent: students.filter((student) => Number(student.attendance) < avgAttendance && Number(student.cgpa) >= avgCgpa),
    atRisk: students.filter((student) => Number(student.attendance) < avgAttendance && Number(student.cgpa) < avgCgpa)
  };
  const segmentPalette = {
    topPerformers: {
      label: "High Performers",
      start: "#4ade80",
      end: "#15803d",
      glow: "rgba(34, 197, 94, 0.34)",
      text: "#dcfce7"
    },
    needsAttention: {
      label: "Needs Attention",
      start: "#facc15",
      end: "#d97706",
      glow: "rgba(250, 204, 21, 0.28)",
      text: "#fef3c7"
    },
    inconsistent: {
      label: "Inconsistent",
      start: "#fb923c",
      end: "#ea580c",
      glow: "rgba(249, 115, 22, 0.24)",
      text: "#ffedd5"
    },
    atRisk: {
      label: "At Risk",
      start: "#fb7185",
      end: "#dc2626",
      glow: "rgba(239, 68, 68, 0.28)",
      text: "#ffe4e6"
    }
  };
  const segments = [
    { key: "topPerformers", count: quadrantGroups.topPerformers.length },
    { key: "needsAttention", count: quadrantGroups.needsAttention.length },
    { key: "inconsistent", count: quadrantGroups.inconsistent.length },
    { key: "atRisk", count: quadrantGroups.atRisk.length }
  ].map((segment) => ({
    ...segment,
    ...segmentPalette[segment.key]
  }));
  const maxSegmentCount = Math.max(...segments.map((segment) => segment.count), 1);
  const featuredStudent = [...quadrantGroups.needsAttention]
    .sort((a, b) => b.cgpa - a.cgpa || b.attendance - a.attendance)[0]
    || [...students].sort((a, b) => b.cgpa - a.cgpa || b.attendance - a.attendance)[0];
  const getSegmentLabel = (student) => {
    if (!student) return "";
    if (Number(student.attendance) >= avgAttendance && Number(student.cgpa) >= avgCgpa) return "High Performers";
    if (Number(student.attendance) >= avgAttendance && Number(student.cgpa) < avgCgpa) return "Needs Attention";
    if (Number(student.attendance) < avgAttendance && Number(student.cgpa) >= avgCgpa) return "Inconsistent";
    return "At Risk";
  };
  const interpretationPoints = [
    `${quadrantGroups.topPerformers.length} student${quadrantGroups.topPerformers.length === 1 ? "" : "s"} fall under High Performers, indicating strong overall performance`,
    `${quadrantGroups.needsAttention.length} student${quadrantGroups.needsAttention.length === 1 ? "" : "s"} require attention despite good attendance`,
    `${quadrantGroups.inconsistent.length} student${quadrantGroups.inconsistent.length === 1 ? "" : "s"} show inconsistent performance patterns`,
    `${quadrantGroups.atRisk.length} student${quadrantGroups.atRisk.length === 1 ? "" : "s"} are in the at-risk category and need immediate support`,
    `Overall distribution shows variation in academic outcomes across ${students.length} student${students.length === 1 ? "" : "s"}`
  ];
  scatter.innerHTML = `
    <div class="segmentation-shell">
      <div class="segmentation-summary">
        ${segments.map((segment) => `
          <div class="segment-card">
            <span>${escapeHtml(segment.label)}</span>
            <strong>${segment.count}</strong>
          </div>
        `).join("")}
      </div>
      <div class="segmentation-bars">
        ${segments.map((segment, index) => {
          const width = `${Math.max((segment.count / maxSegmentCount) * 100, segment.count > 0 ? 10 : 0)}%`;
          return `
            <div class="segment-row">
              <div class="segment-label">
                <span class="segment-dot" style="--segment-dot:${segment.start}; --segment-glow:${segment.glow};"></span>
                <span>${escapeHtml(segment.label)}</span>
              </div>
              <div class="segment-track">
                <div
                  class="segment-fill ${index === 0 ? "is-emphasis" : ""}"
                  style="--segment-width:${width}; --segment-start:${segment.start}; --segment-end:${segment.end}; --segment-glow:${segment.glow};"
                ></div>
              </div>
              <div class="segment-value" style="--segment-text:${segment.text};">(${segment.count})</div>
            </div>
          `;
        }).join("")}
      </div>
      ${featuredStudent ? `
        <div class="segment-featured">
          <span>Key student</span>
          <strong>${escapeHtml(featuredStudent.name)}</strong>
          <span>| ${Number(featuredStudent.attendance).toFixed(0)}% | CGPA ${Number(featuredStudent.cgpa).toFixed(2)} | ${escapeHtml(getSegmentLabel(featuredStudent))}</span>
        </div>
      ` : ""}
      <div class="chart-insight segment-interpretation">
        <strong>Interpretation</strong>
        <ul class="chart-insight-list">
          ${interpretationPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
  renderProgramBenchmark(
    aggregateAverage(students, "program", "cgpa").map((item) => ({ label: item.key, value: item.value })),
    "Program comparison will appear here."
  );
  const analyticsSubjectMap = {};
  students.forEach((student) => {
    student.subjects.forEach((subject) => {
      const cleanLabel = getCleanSubjectLabel(subject.subject);
      if (!cleanLabel) return;
      if (!analyticsSubjectMap[cleanLabel]) analyticsSubjectMap[cleanLabel] = [];
      analyticsSubjectMap[cleanLabel].push(Number(subject.finalScore ?? subject.total ?? 0));
    });
  });
  renderSubjectRiskStrengthChart(
    Object.entries(analyticsSubjectMap).map(([label, values]) => ({
      label,
      value: average(values, (value) => value)
    })),
    "Subject performance overview will appear here."
  );
  const bySemester = Array.from({ length: 8 }, (_, index) => ({
    label: `S${index + 1}`,
    value: students.filter((student) => Number(student.semester) === index + 1 && ["At-Risk", "Critical"].includes(student.category)).length
  })).filter((item) => item.value > 0);
  const highestRiskSemester = bySemester.reduce((best, item) => (item.value > best.value ? item : best), bySemester[0]);
  const riskAverage = average(bySemester, (item) => item.value);
  const riskInterpretationPoints = [
    `Highest risk in ${formatTrendLabel(highestRiskSemester.label)} (${highestRiskSemester.value} student${highestRiskSemester.value === 1 ? "" : "s"})`,
    bySemester.length > 1 && bySemester[bySemester.length - 1].value < bySemester[0].value ? "Risk is decreasing over time" : "Risk remains fairly steady over time",
    `Average around ${riskAverage.toFixed(1).replace(/\.0$/, "")} student${Math.round(riskAverage) === 1 ? "" : "s"} per semester`
  ];
  renderTrend("risk-trend", bySemester, "value", "#f97316", {
    metricLabel: "at-risk students",
    averageMetricLabel: "average risk",
    averageStoryLabel: "Average Risk",
    peakStoryLabel: "",
    trajectoryStoryLabel: "",
    deltaUnit: "students",
    xAxisLabel: "Semesters",
    yAxisLabel: "At-Risk Students Count",
    labelFormatter: (label) => formatShortSemesterLabel(label),
    showAllPointLabels: false,
    showAverageLine: false,
    axisLabelFormatter: (label) => formatShortSemesterLabel(label),
    valueFormatter: (value) => Number(value).toFixed(2).replace(/\.00$/, ""),
    storyValueFormatter: {
      average: (value) => `${Number(value).toFixed(2)} students`,
      peak: () => "",
      trajectory: () => ""
    },
    interpretationPoints: riskInterpretationPoints
  });
}

function renderDashboard() {
  renderKpis();
  renderCgpaDistribution();
  renderCategoryPie();
  renderMiniTable(students.slice(0, 10), "top-performers", "Top performers appear once students are added.");
  renderBacklogBurdenPanel();
  renderTrend(
    "semester-trend",
    Array.from({ length: 8 }, (_, index) => {
      const matching = students.filter((student) => Number(student.semester) === index + 1);
      const value = matching.length ? average(matching, (student) => student.cgpa) : 0;
      return { label: `S${index + 1}`, value: Number(value.toFixed(2)) };
    }).filter((item) => item.value > 0),
    "value",
    "#6366f1",
    {
      metricLabel: "CGPA",
      averageMetricLabel: "average CGPA",
      averageStoryLabel: "Average CGPA",
      peakStoryLabel: "Peak Semester",
      trajectoryStoryLabel: "Trend Direction",
      deltaUnit: "points",
      showAllPointLabels: false,
      showPeakPointLabel: false,
      showAverageLine: false,
      showAxisTickLabels: true,
      leftPaddingOverride: 36,
      yAxisX: 6,
      xAxisLabel: "",
      yAxisLabel: "CGPA",
      axisLabelFormatter: (label) => label.replace("S", "Sem "),
      interpretationPoints: (() => {
        return [
          "Performance peaks in the middle, then gradually drops",
          "Indicates inconsistency, not low capability",
          "Later semesters need better focus",
          "Overall performance is average but unstable."
        ];
      })()
    }
  );
  const subjectMap = {};
  students.forEach((student) =>
    student.subjects.forEach((subject) => {
      if (!subjectMap[subject.subject]) subjectMap[subject.subject] = [];
      subjectMap[subject.subject].push(subject.total);
    })
  );
  renderSubjectPerformanceChart(
    Object.entries(subjectMap).map(([label, values]) => ({ label, value: average(values, (value) => value) })),
    "Subject insights will appear here."
  );
}

function populateFilters() {
  const fill = (id, values) => {
    const select = document.getElementById(id);
    const current = select.value;
    const placeholder = select.querySelector("option").outerHTML;
    select.innerHTML = placeholder + values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
    select.value = current;
  };
  fill("filter-semester", [...new Set(students.map((student) => student.semester))].sort((a, b) => a - b));
  fill("filter-program", [...new Set(students.map((student) => student.program))].sort());
  fill("filter-category", [...new Set(students.map((student) => student.category))]);
}

async function downloadText(filename, content, type) {
  const normalizedType = String(type || "text/plain;charset=utf-8");
  const blob = new Blob(["\uFEFF", content], { type: normalizedType });
  const mimeType = normalizedType.split(";")[0];

  if (typeof window.showSaveFilePicker === "function") {
    try {
      const extension = (filename.split(".").pop() || "txt").toLowerCase();
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        excludeAcceptAllOption: false,
        types: [
          {
            description: extension === "csv" ? "CSV file" : "File",
            accept: {
              [mimeType]: [`.${extension}`]
            }
          }
        ]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      if (error && error.name === "AbortError") return;
    }
  }

  if (window.navigator && typeof window.navigator.msSaveOrOpenBlob === "function") {
    window.navigator.msSaveOrOpenBlob(blob, filename);
    return;
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 1000);
}

function renderUploadPreview(rows = pendingCsvPreviewRows, candidateStudents = pendingCsvStudents) {
  const mount = document.getElementById("upload-preview");
  setCurrentCsvDownloadDisabled(!getCurrentCsvDownloadConfig());
  if (!rows.length) {
    mount.innerHTML = `<p class="table-meta">Upload a CSV file to preview rows here before import.</p>`;
    return;
  }
  const headers = Object.keys(rows[0]);
  mount.innerHTML = `
    <table>
      <thead>
        <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows
          .slice(0, 10)
          .map(
            (row) => `
              <tr>${headers.map((header) => `<td>${escapeHtml(row[header])}</td>`).join("")}</tr>
            `
          )
          .join("")}
      </tbody>
    </table>
    <p class="table-meta preview-note">${candidateStudents.length} valid row(s) prepared for import.</p>
  `;
}

function buildPreviewCsv() {
  if (pendingCsvPreviewRows.length) {
    const headers = Object.keys(pendingCsvPreviewRows[0] || {});
    if (headers.length) return rowsToCsv(headers, pendingCsvPreviewRows);
  }
  return "";
}

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let insideQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"') {
      if (insideQuotes && next === '"') {
        field += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  }
  return rows;
}

function rowsToObjects(rows) {
  if (rows.length < 2) return [];
  const headers = rows[0].map((header, index) => index === 0 ? header.replace(/^\uFEFF/, "").trim() : header.trim());
  return rows.slice(1).map((row) => {
    const object = {};
    headers.forEach((header, index) => {
      object[header] = row[index] == null ? "" : row[index];
    });
    return object;
  });
}

function normalizeColumnKey(key) {
  return String(key || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function normalizeImportedRow(row) {
  const normalized = {};
  Object.keys(row).forEach((key) => {
    normalized[normalizeColumnKey(key)] = row[key];
  });
  return normalized;
}

const IMPORT_FIELD_ALIASES = {
  name: [
    "name",
    "studentname",
    "student",
    "fullname",
    "studentfullname",
    "studentfullName"
  ],
  enrollmentId: [
    "enrollmentId",
    "enrollment",
    "enrollmentnumber",
    "enrollmentno",
    "studentId",
    "studentid",
    "rollNo",
    "rollNumber",
    "rollnumber",
    "rollno",
    "registrationnumber",
    "registrationno",
    "regno",
    "admissionnumber",
    "admissionno"
  ],
  phone: [
    "phone",
    "phonenumber",
    "phoneNumber",
    "mobile",
    "mobilenumber",
    "mobileNumber",
    "contact",
    "contactnumber",
    "studentphone",
    "studentmobile"
  ],
  email: [
    "email",
    "emailaddress",
    "mail",
    "studentemail",
    "emailid"
  ],
  program: [
    "program",
    "programme",
    "course",
    "coursename",
    "programname",
    "programmename"
  ],
  department: [
    "department",
    "dept",
    "school",
    "faculty",
    "branch"
  ],
  semester: [
    "semester",
    "sem",
    "semesternumber",
    "semesterno",
    "semno"
  ],
  attendance: [
    "attendance",
    "attendancepercent",
    "attendancepercentage",
    "attendancepct",
    "attendance%",
    "attendance rate",
    "attendancerate"
  ],
  studyHours: [
    "studyHours",
    "studyhours",
    "studyhoursweek",
    "studyhoursperweek",
    "hours",
    "hoursperweek",
    "weeklystudyhours",
    "studytime"
  ],
  backlogs: [
    "backlogs",
    "backlog",
    "activebacklogs",
    "currentbacklogs",
    "unclearedpapers",
    "pendingpapers",
    "failedsubjects"
  ],
  previousCgpa: [
    "previousCgpa",
    "previouscgpa",
    "prevcgpa",
    "cgpaprevious",
    "cgpa",
    "currentcgpa",
    "overallcgpa"
  ],
  level: [
    "level",
    "ugpg",
    "programlevel",
    "academiclevel"
  ],
  dob: [
    "dob",
    "dateofbirth",
    "birthdate"
  ]
};

function getImportAliases(fieldName, fallbacks = []) {
  const aliases = IMPORT_FIELD_ALIASES[fieldName] || [];
  return [...new Set([...aliases, ...fallbacks])];
}

function getRowField(row, aliases, fallback = "") {
  for (const alias of aliases) {
    const value = row[normalizeColumnKey(alias)];
    if (value != null && String(value).trim() !== "") return value;
  }
  return fallback;
}

function getMatchedRowField(row, aliases, fallback = "") {
  for (const alias of aliases) {
    const normalizedAlias = normalizeColumnKey(alias);
    const value = row[normalizedAlias];
    if (value != null && String(value).trim() !== "") {
      return { value, alias: normalizedAlias };
    }
  }
  return { value: fallback, alias: "" };
}

function splitTotalToMarks(total, options = {}) {
  const cleanTotal = normalizeCompositeTotal(total, options);
  const assignments = clamp(
    Number(((cleanTotal * MARK_LIMITS.assignments) / MARK_LIMITS.total).toFixed(2)),
    0,
    MARK_LIMITS.assignments
  );
  const external = clamp(Number((cleanTotal - assignments).toFixed(2)), 0, MARK_LIMITS.external);
  return { assignments, external };
}

function buildSubjectFromValues(name, credits, assignments, external, total, options = {}) {
  let cleanAssignments = assignments == null || assignments === "" ? null : safeNumber(assignments, 0);
  let cleanExternal = external == null || external === "" ? null : safeNumber(external, 0);
  const totalProvided = total !== "" && total != null;
  const expandedScheme = !options.strictValidation && !options.legacyScheme && looksLikeExpandedScheme(cleanAssignments, cleanExternal, total);
  if (options.legacyScheme) {
    if (cleanAssignments != null) cleanAssignments = scaleLegacyAssignments(cleanAssignments);
    if (cleanExternal != null) cleanExternal = scaleLegacyExternal(cleanExternal);
  } else if (expandedScheme) {
    if (cleanAssignments != null) cleanAssignments = scaleExpandedAssignments(cleanAssignments);
    if (cleanExternal != null) cleanExternal = scaleExpandedExternal(cleanExternal);
  }
  if (options.strictValidation) {
    const subjectName = String(name || "Overall Assessment").trim() || "Overall Assessment";
    if (totalProvided && safeNumber(total, 0) > MARK_LIMITS.total) {
      throw new Error(`${subjectName}: Invalid input: Internal marks must be between 0 and 40, and External marks must be between 0 and 60.`);
    }
  }
  if (cleanAssignments == null && cleanExternal == null) {
    const split = splitTotalToMarks(total, { ...options, expandedScheme });
    cleanAssignments = split.assignments;
    cleanExternal = split.external;
  } else if (cleanAssignments == null) {
    const normalizedTotal = normalizeCompositeTotal(total, { ...options, expandedScheme });
    cleanAssignments = total !== "" && total != null ? normalizedTotal - safeNumber(cleanExternal, 0) : 0;
  } else if (cleanExternal == null) {
    const normalizedTotal = normalizeCompositeTotal(total, { ...options, expandedScheme });
    cleanExternal = total !== "" && total != null ? normalizedTotal - safeNumber(cleanAssignments, 0) : 0;
  }
  if (options.strictValidation) {
    const subjectName = String(name || "Overall Assessment").trim() || "Overall Assessment";
    if (cleanAssignments != null && (cleanAssignments < 0 || cleanAssignments > MARK_LIMITS.assignments)) {
      throw new Error(`${subjectName}: Invalid input: Internal marks must be between 0 and 40, and External marks must be between 0 and 60.`);
    }
    if (cleanExternal != null && (cleanExternal < 0 || cleanExternal > MARK_LIMITS.external)) {
      throw new Error(`${subjectName}: Invalid input: Internal marks must be between 0 and 40, and External marks must be between 0 and 60.`);
    }
  }
  return {
    subject: String(name || "Overall Assessment").trim(),
    credits: clamp(safeNumber(credits, 4), MARK_LIMITS.creditsMin, MARK_LIMITS.creditsMax),
    assignments: clamp(cleanAssignments, 0, MARK_LIMITS.assignments),
    external: clamp(cleanExternal, 0, MARK_LIMITS.external)
  };
}

function extractSubjectsFromRow(row, options = {}) {
  const subjects = [];
  for (let subjectIndex = 1; subjectIndex <= 12; subjectIndex += 1) {
    const name = getRowField(row, [`subject${subjectIndex}`, `subjectname${subjectIndex}`, `paper${subjectIndex}`, `course${subjectIndex}`]);
    const total = getRowField(row, [`total${subjectIndex}`, `marks${subjectIndex}`, `score${subjectIndex}`], "");
    const assignmentsMatch = getMatchedRowField(row, [`assignments${subjectIndex}`, `assignment${subjectIndex}`, `internal${subjectIndex}`, `internalmarks${subjectIndex}`], "");
    const externalMatch = getMatchedRowField(row, [`external${subjectIndex}`, `externalmarks${subjectIndex}`], "");
    const legacyScheme = assignmentsMatch.alias.startsWith("internal");
    if (!String(name).trim() && total === "") continue;
    subjects.push(
      buildSubjectFromValues(
        name || `Subject ${subjectIndex}`,
        getRowField(row, [`credits${subjectIndex}`, `credit${subjectIndex}`], 4),
        assignmentsMatch.value,
        externalMatch.value,
        total,
        { ...options, legacyScheme }
      )
    );
  }

  if (!subjects.length) {
    const singleName = getRowField(row, ["subject", "subjectname", "paper", "course"], "");
    const singleTotal = getRowField(row, ["total", "marks", "score"], "");
    const percentageOnly = getRowField(row, ["percentage"], "");
    const assignmentsMatch = getMatchedRowField(row, ["assignments", "assignment", "internal", "internalmarks"], "");
    const externalMatch = getMatchedRowField(row, ["external", "externalmarks"], "");
    const legacyScheme = assignmentsMatch.alias.startsWith("internal");
    const resolvedTotal = singleTotal !== "" ? singleTotal : percentageOnly;
    if (String(singleName).trim() || resolvedTotal !== "") {
      subjects.push(
        buildSubjectFromValues(
          singleName || "Overall Assessment",
          getRowField(row, ["credits", "credit"], 4),
          assignmentsMatch.value,
          externalMatch.value,
          resolvedTotal,
          { ...options, legacyScheme, percentageBased: singleTotal === "" && percentageOnly !== "" }
        )
      );
    }
  }

  if (!subjects.length) {
    const percentageOnly = getRowField(row, ["percentage"], "");
    const totalMarks = getRowField(row, ["totalmarks", "marksobtained", "score"], "");
    const cgpaEstimate = getRowField(row, ["cgpa"], "");
    if (percentageOnly !== "") {
      subjects.push(buildSubjectFromValues("Overall Assessment", 4, "", "", percentageOnly, { ...options, percentageBased: true }));
    } else if (totalMarks !== "") {
      subjects.push(buildSubjectFromValues("Overall Assessment", 4, "", "", totalMarks, options));
    } else if (cgpaEstimate !== "") {
      const normalizedTotal = clamp(Math.round((safeNumber(cgpaEstimate, 0) / 10) * MARK_LIMITS.total), 0, MARK_LIMITS.total);
      subjects.push(buildSubjectFromValues("Overall Assessment", 4, "", "", normalizedTotal, options));
    }
  }

  if (!subjects.length) {
    subjects.push(buildSubjectFromValues("Overall Assessment", 4, MARK_LIMITS.assignments * 0.6, MARK_LIMITS.external * 0.6, "", options));
  }

  return subjects;
}

function getColumnLetterIndex(columnRef) {
  let result = 0;
  for (let index = 0; index < columnRef.length; index += 1) {
    result = (result * 26) + (columnRef.charCodeAt(index) - 64);
  }
  return result - 1;
}

async function unzipEntries(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  let eocdOffset = -1;
  for (let index = bytes.length - 22; index >= 0; index -= 1) {
    if (view.getUint32(index, true) === 0x06054b50) {
      eocdOffset = index;
      break;
    }
  }
  if (eocdOffset === -1) throw new Error("The XLSX file could not be read.");
  const centralDirectoryOffset = view.getUint32(eocdOffset + 16, true);
  const totalEntries = view.getUint16(eocdOffset + 10, true);
  const entries = new Map();
  let pointer = centralDirectoryOffset;
  const decoder = new TextDecoder();
  for (let entryIndex = 0; entryIndex < totalEntries; entryIndex += 1) {
    if (view.getUint32(pointer, true) !== 0x02014b50) break;
    const compression = view.getUint16(pointer + 10, true);
    const compressedSize = view.getUint32(pointer + 20, true);
    const fileNameLength = view.getUint16(pointer + 28, true);
    const extraLength = view.getUint16(pointer + 30, true);
    const commentLength = view.getUint16(pointer + 32, true);
    const localHeaderOffset = view.getUint32(pointer + 42, true);
    const fileName = decoder.decode(bytes.slice(pointer + 46, pointer + 46 + fileNameLength));
    entries.set(fileName, { compression, compressedSize, localHeaderOffset });
    pointer += 46 + fileNameLength + extraLength + commentLength;
  }
  return entries;
}

async function readZipEntry(arrayBuffer, entry) {
  const view = new DataView(arrayBuffer);
  const bytes = new Uint8Array(arrayBuffer);
  const localHeaderOffset = entry.localHeaderOffset;
  if (view.getUint32(localHeaderOffset, true) !== 0x04034b50) throw new Error("The XLSX entry could not be read.");
  const fileNameLength = view.getUint16(localHeaderOffset + 26, true);
  const extraLength = view.getUint16(localHeaderOffset + 28, true);
  const dataOffset = localHeaderOffset + 30 + fileNameLength + extraLength;
  const compressed = bytes.slice(dataOffset, dataOffset + entry.compressedSize);
  if (entry.compression === 0) return compressed;
  if (entry.compression === 8) {
    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  throw new Error("This XLSX compression method is not supported in the browser.");
}

async function parseXlsxFile(file) {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("XLSX import needs a modern browser with decompression support. CSV import will still work.");
  }
  const arrayBuffer = await file.arrayBuffer();
  const entries = await unzipEntries(arrayBuffer);
  const decoder = new TextDecoder();
  const readTextEntry = async (name) => {
    const entry = entries.get(name);
    if (!entry) return "";
    return decoder.decode(await readZipEntry(arrayBuffer, entry));
  };
  const workbookXml = await readTextEntry("xl/workbook.xml");
  const relationshipsXml = await readTextEntry("xl/_rels/workbook.xml.rels");
  if (!workbookXml || !relationshipsXml) throw new Error("The XLSX workbook is missing required worksheet data.");

  const parser = new DOMParser();
  const workbookDoc = parser.parseFromString(workbookXml, "application/xml");
  const relsDoc = parser.parseFromString(relationshipsXml, "application/xml");
  const firstSheet = workbookDoc.getElementsByTagNameNS("*", "sheet")[0];
  if (!firstSheet) throw new Error("No worksheet was found in the XLSX file.");
  const relationshipId = firstSheet.getAttribute("r:id") || firstSheet.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
  const relationship = Array.from(relsDoc.getElementsByTagNameNS("*", "Relationship")).find((item) => item.getAttribute("Id") === relationshipId);
  const target = relationship ? relationship.getAttribute("Target") : "worksheets/sheet1.xml";
  const sheetPath = target.startsWith("xl/") ? target : `xl/${target.replace(/^\//, "")}`;
  const sheetXml = await readTextEntry(sheetPath);
  if (!sheetXml) throw new Error("The first worksheet in the XLSX file could not be opened.");

  const sharedStringsXml = await readTextEntry("xl/sharedStrings.xml");
  const sharedStrings = sharedStringsXml
    ? Array.from(parser.parseFromString(sharedStringsXml, "application/xml").getElementsByTagNameNS("*", "si")).map((item) =>
        Array.from(item.getElementsByTagNameNS("*", "t")).map((node) => node.textContent || "").join("")
      )
    : [];

  const sheetDoc = parser.parseFromString(sheetXml, "application/xml");
  const rows = Array.from(sheetDoc.getElementsByTagNameNS("*", "row")).map((rowNode) => {
    const cells = [];
    Array.from(rowNode.getElementsByTagNameNS("*", "c")).forEach((cell) => {
      const ref = cell.getAttribute("r") || "";
      const columnLetters = ref.replace(/[0-9]/g, "");
      const columnIndex = getColumnLetterIndex(columnLetters);
      const type = cell.getAttribute("t");
      const valueNode = cell.getElementsByTagNameNS("*", "v")[0];
      const inlineNode = cell.getElementsByTagNameNS("*", "t")[0];
      let value = "";
      if (type === "s") {
        value = sharedStrings[safeNumber(valueNode ? valueNode.textContent : 0, 0)] || "";
      } else if (type === "inlineStr") {
        value = inlineNode ? inlineNode.textContent || "" : "";
      } else {
        value = valueNode ? valueNode.textContent || "" : "";
      }
      cells[columnIndex] = value;
    });
    return cells.map((cell) => cell == null ? "" : cell);
  });
  return rowsToObjects(rows);
}

async function parseSpreadsheetWithSheetJs(file) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) throw new Error("No worksheet was found in the Excel file.");
  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  if (!rows.length) throw new Error("The selected spreadsheet does not contain any data rows.");
  return rows;
}

function restoreStudentsFromCsvSnapshot() {
  const snapshot = localStorage.getItem(CSV_SNAPSHOT_KEY);
  if (!snapshot) return [];
  try {
    const rows = rowsToObjects(parseCsv(snapshot));
    const existingIds = new Set();
    return rows.map((row, index) => parseCsvStudent(row, index, existingIds, { strictValidation: false }));
  } catch (error) {
    return [];
  }
}

function parseCsvStudent(row, index, existingIds, options = {}) {
  const normalizedRow = normalizeImportedRow(row);
  const extracted = {
    name: getRowField(normalizedRow, getImportAliases("name")),
    enrollmentId: getRowField(normalizedRow, getImportAliases("enrollmentId")),
    phone: getRowField(normalizedRow, getImportAliases("phone"), ""),
    program: getRowField(normalizedRow, getImportAliases("program")),
    semester: getRowField(normalizedRow, getImportAliases("semester"), 1),
    attendance: getRowField(normalizedRow, getImportAliases("attendance"), 0),
    studyHours: getRowField(normalizedRow, getImportAliases("studyHours"), 0),
    backlogs: getRowField(normalizedRow, getImportAliases("backlogs"), 0)
  };
  const missing = Object.entries(extracted)
    .filter(([key, value]) => ["name", "enrollmentId", "program", ...(options.strictValidation ? ["phone"] : [])].includes(key) && !String(value).trim())
    .map(([key]) => key);
  if (missing.length) throw new Error(`Row ${index + 2} is missing required columns: ${missing.join(", ")}`);

  let subjects = [];
  try {
    subjects = extractSubjectsFromRow(normalizedRow, options);
  } catch (error) {
    if (options.strictValidation) {
      throw new Error(`Row ${index + 2}: ${error.message} Rows containing invalid values will be rejected during import.`);
    }
    throw error;
  }
  if (!subjects.length) throw new Error(`Row ${index + 2} does not include enough marks data to build a student record.`);

  const enrollmentId = String(extracted.enrollmentId).trim();
  if (existingIds.has(enrollmentId)) throw new Error(`Row ${index + 2} duplicates enrollment ID ${enrollmentId} within the uploaded file.`);
  const rawPhone = String(extracted.phone || "").trim();
  if (options.strictValidation && !isValidPhoneNumber(rawPhone)) {
    throw new Error(`Row ${index + 2}: ${phoneValidationMessage()} Any invalid entries will be rejected during import.`);
  }
  const phone = rawPhone ? (options.strictValidation ? rawPhone : normalizeStoredPhone(rawPhone)) : "";

  existingIds.add(enrollmentId);
  return {
    id: uid(),
    previousCgpa: clamp(safeNumber(getRowField(normalizedRow, getImportAliases("previousCgpa"), 0), 0), 0, 10),
    name: extracted.name,
    enrollmentId,
    email: getRowField(normalizedRow, getImportAliases("email"), ""),
    phone,
    level: getRowField(normalizedRow, getImportAliases("level"), "UG") === "PG" ? "PG" : "UG",
    dob: getRowField(normalizedRow, getImportAliases("dob"), ""),
    program: extracted.program,
    department: getRowField(normalizedRow, getImportAliases("department"), ""),
    semester: clamp(safeNumber(extracted.semester, 1), 1, 8),
    studyHours: clamp(safeNumber(extracted.studyHours, 0), 0, 80),
    attendance: clamp(safeNumber(extracted.attendance, 0), 0, 100),
    backlogs: clamp(safeNumber(extracted.backlogs, 0), 0, 20),
    subjects
  };
}

function mergeImportedStudents(importedStudents) {
  const incomingKeys = new Set(
    importedStudents.map((student) => `${student.enrollmentId}::${Number(student.semester)}`)
  );
  const retainedStudents = students.filter((student) => {
    const key = `${student.enrollmentId}::${Number(student.semester)}`;
    return !incomingKeys.has(key);
  });
  const mergedStudents = importedStudents.map((student) => {
    const existingStudent = students.find((entry) =>
      entry.enrollmentId === student.enrollmentId
      && Number(entry.semester) === Number(student.semester)
    );
    return existingStudent ? { ...student, id: existingStudent.id } : student;
  });
  return [...retainedStudents, ...mergedStudents];
}

async function handleCsvFile(file) {
  pendingCsvStudents = [];
  pendingCsvPreviewRows = [];
  pendingCsvFilename = file && file.name ? file.name.replace(/\.(xlsx|xls)$/i, ".csv") : "students-data.csv";
  if (!file) return;
  if (!/\.(csv|xlsx|xls)$/i.test(file.name)) {
    uploadFeedback.textContent = "Only .csv, .xlsx, and .xls files can be imported here. Import stays disabled until a valid file is selected.";
    importCsvButton.disabled = true;
    clearUploadButton.disabled = false;
    renderUploadPreview([]);
    return;
  }
  const isExcel = /\.(xlsx|xls)$/i.test(file.name);
  const canUseSheetJs = typeof XLSX !== "undefined" && XLSX && XLSX.read;
  let objectRows = [];
  if (/\.xls$/i.test(file.name) && !canUseSheetJs) {
    throw new Error("Legacy .xls imports need the bundled spreadsheet parser. Use CSV or .xlsx if the parser is unavailable.");
  }
  if (isExcel && canUseSheetJs) {
    objectRows = await parseSpreadsheetWithSheetJs(file);
  } else if (/\.xlsx$/i.test(file.name)) {
    objectRows = await parseXlsxFile(file);
  } else {
    objectRows = rowsToObjects(parseCsv((await file.text()).replace(/^\uFEFF/, "").trim()));
  }
  if (!objectRows.length) {
    uploadFeedback.textContent = "The file is empty or does not include data rows, so import is still disabled.";
    importCsvButton.disabled = true;
    clearUploadButton.disabled = false;
    renderUploadPreview([]);
    return;
  }
  const existingIds = new Set();
  const parsed = [];
  for (let index = 0; index < objectRows.length; index += 1) {
    parsed.push(parseCsvStudent(objectRows[index], index, existingIds, { strictValidation: true }));
  }
  pendingCsvStudents = parsed;
  pendingCsvPreviewRows = objectRows;
  uploadFeedback.textContent = `${parsed.length} row(s) ready to import from ${file.name}.`;
  importCsvButton.disabled = !parsed.length;
  clearUploadButton.disabled = false;
  setCurrentCsvDownloadDisabled(!getCurrentCsvDownloadConfig());
  renderUploadPreview(objectRows, parsed);
}

function clearUploadState() {
  pendingCsvStudents = [];
  pendingCsvPreviewRows = [];
  pendingCsvFilename = "students-data.csv";
  csvFileInput.value = "";
  uploadFeedback.textContent = uploadIdleMessage();
  importCsvButton.disabled = true;
  clearUploadButton.disabled = !hasStoredCsvSnapshot();
  renderUploadPreview([]);
}

function handlePrediction() {
  const assignments = clamp(safeNumber(document.getElementById("pred-assignments").value, 0), 0, MARK_LIMITS.assignments);
  const external = clamp(safeNumber(document.getElementById("pred-external").value, 0), 0, MARK_LIMITS.external);
  const attendance = clamp(safeNumber(document.getElementById("pred-attendance").value, 0), 0, 100);
  const previousCgpa = clamp(safeNumber(document.getElementById("pred-cgpa").value, 0), 0, 10);
  const hours = clamp(safeNumber(document.getElementById("pred-hours").value, 0), 0, 80);
  const backlogs = clamp(safeNumber(document.getElementById("pred-backlogs").value, 0), 0, 20);
  const semester = clamp(safeNumber(document.getElementById("pred-semester").value, 1), 1, 8);

  const combinedTotal = assignments + external;
  const examFinalScore = combinedTotalToFinalScore(combinedTotal);
  const academicMomentum = previousCgpa * 10;
  const studyBoost = Math.min(hours * 3, 20);
  const attendanceBoost = attendance * 0.12;
  const backlogPenalty = backlogs * 6;
  const semesterAdjustment = Math.max(0, 6 - semester) * 1.2;
  const simulatedFinalScore = Math.round(
    clamp((examFinalScore * 0.58) + (academicMomentum * 0.22) + studyBoost + attendanceBoost - backlogPenalty - semesterAdjustment, 0, MARK_LIMITS.finalScore)
  );
  const gradeMeta = getGrade(simulatedFinalScore);
  const riskValue = clamp(
    (100 - attendance) * 0.45 +
    Math.max(0, 7 - previousCgpa) * 9 +
    backlogs * 12 +
    Math.max(0, 14 - hours) * 1.6,
    5,
    100
  );
  document.getElementById("pred-score").textContent = simulatedFinalScore;
  document.getElementById("risk-fill").style.width = `${riskValue}%`;
  let performanceLevel = "Strong";
  if (simulatedFinalScore < 50) performanceLevel = "Needs Significant Support";
  else if (simulatedFinalScore < 60) performanceLevel = "Weak";
  else if (simulatedFinalScore < 75) performanceLevel = "Moderate";
  else if (simulatedFinalScore < 85) performanceLevel = "Good";
  let label = "Low";
  if (riskValue > 55) label = "High";
  else if (riskValue > 30) label = "Moderate";
  document.getElementById("risk-label").textContent = label;
  const riskDescription = document.getElementById("risk-description");
  if (riskDescription) riskDescription.textContent = "Based on current inputs, this indicates the student's academic standing.";
  document.getElementById("pred-grade").textContent = `Estimated Grade: ${gradeMeta.grade} | Performance Level: ${performanceLevel}`;
  const recommendations = [];
  const addRecommendation = (message) => {
    if (!message || recommendations.includes(message)) return;
    recommendations.push(message);
  };
  const nextGradeBand = [
    { min: 90, grade: "O" },
    { min: 80, grade: "A+" },
    { min: 70, grade: "A" },
    { min: 60, grade: "B+" },
    { min: 55, grade: "B" },
    { min: 50, grade: "C" },
    { min: 40, grade: "P" }
  ].find((band) => simulatedFinalScore < band.min);

  if (label === "High") {
    addRecommendation("High risk: improve attendance, backlogs, and exam prep first.");
  } else if (label === "Moderate") {
    addRecommendation("Moderate risk: small gains in attendance and exams will help.");
  } else {
    addRecommendation("Low risk: stay consistent and push for the next grade band.");
  }

  if (attendance < 75) {
    addRecommendation(`Attendance is ${Math.max(0, 75 - attendance).toFixed(0)}% below target; fix this first.`);
  } else if (attendance < 85) {
    addRecommendation("Attendance is acceptable; pushing it toward 85% will help.");
  } else {
    addRecommendation("Attendance is a strength; keep it steady.");
  }

  if (external < 45) {
    addRecommendation(`External marks need about ${Math.ceil(45 - external)} more marks for a clear lift.`);
  } else if (external < 55) {
    addRecommendation("Better external marks will raise the grade fastest.");
  } else {
    addRecommendation("External performance is strong; maintain revision quality.");
  }

  if (hours < 12) {
    addRecommendation(`Study time is low; raise it from ${hours} to 12-14 hours weekly.`);
  } else if (hours < 18) {
    addRecommendation("Study hours are moderate; a steadier routine will help.");
  } else {
    addRecommendation("Study effort is strong; focus on exam strategy now.");
  }

  if (backlogs > 0) {
    addRecommendation(backlogs === 1 ? "One backlog is active; clearing it will improve stability." : `${backlogs} backlogs are active; reducing them will lower risk.`);
  }

  if (previousCgpa < 6.5) {
    addRecommendation("Previous CGPA suggests core concepts need reinforcement.");
  } else if (previousCgpa >= 8) {
    addRecommendation("Previous CGPA is strong; disciplined exams can push this higher.");
  }

  if (nextGradeBand) {
    const gradeGap = nextGradeBand.min - simulatedFinalScore;
    addRecommendation(`${gradeGap} more marks can move this to the ${nextGradeBand.grade} band.`);
  } else {
    addRecommendation("This is already in the top grade band; maintain consistency.");
  }

  if (simulatedFinalScore < 60) {
    addRecommendation("Priority: improve the weakest subjects and cross 60.");
  } else if (simulatedFinalScore < 75) {
    addRecommendation("This is decent; better exam conversion can lift it further.");
  } else {
    addRecommendation("This is a good outcome; refine rather than overhaul.");
  }

  if (recommendations.length > 4) recommendations.length = 4;
  const recommendationsMount = document.getElementById("recommendations");
  recommendationsMount.innerHTML = recommendations.length
    ? recommendations
        .map(
          (item, index) => `
            <div class="recommendation-card">
              <span class="recommendation-badge">Insight ${index + 1}</span>
              <p>${escapeHtml(item)}</p>
            </div>
          `
        )
        .join("")
    : `<div class="recommendation-card"><span class="recommendation-badge">Insight</span><p>Current inputs show a stable academic pattern. Maintain the same consistency.</p></div>`;
}

function validateSimulationInputs() {
  if (!predictionForm) return false;
  const fields = Array.from(predictionForm.querySelectorAll("input"));
  for (const field of fields) {
    if (field.matches("input[data-numeric-mode]")) syncNumericInput(field);
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }
  return true;
}

function resetSimulationInputs() {
  const assignments = document.getElementById("pred-assignments");
  const external = document.getElementById("pred-external");
  const attendance = document.getElementById("pred-attendance");
  const previousCgpa = document.getElementById("pred-cgpa");
  const hours = document.getElementById("pred-hours");
  const backlogs = document.getElementById("pred-backlogs");
  const semester = document.getElementById("pred-semester");
  const assignmentsValue = document.getElementById("pred-assignments-value");
  const externalValue = document.getElementById("pred-external-value");
  const attendanceValue = document.getElementById("pred-attendance-value");

  if (assignments) assignments.value = "0";
  if (external) external.value = "0";
  if (attendance) attendance.value = "0";
  if (previousCgpa) previousCgpa.value = "0";
  if (hours) hours.value = "0";
  if (backlogs) backlogs.value = "0";
  if (semester) semester.value = "0";
  if (assignmentsValue) assignmentsValue.textContent = "0";
  if (externalValue) externalValue.textContent = "0";
  if (attendanceValue) attendanceValue.textContent = "0%";
}

function resetSimulationDisplay() {
  const score = document.getElementById("pred-score");
  const grade = document.getElementById("pred-grade");
  const riskFill = document.getElementById("risk-fill");
  const riskLabel = document.getElementById("risk-label");
  const riskDescription = document.getElementById("risk-description");
  const recommendationsMount = document.getElementById("recommendations");

  if (score) score.textContent = "0";
  if (grade) grade.textContent = "Estimated Grade: -- | Performance Level: Not Calculated";
  if (riskFill) riskFill.style.width = "0%";
  if (riskLabel) riskLabel.textContent = "Not Calculated";
  if (riskDescription) riskDescription.textContent = "Run the simulator to view the student's academic standing.";
  if (recommendationsMount) recommendationsMount.innerHTML = "";
}

function setSimulationVisibility(isVisible) {
  if (simulationResults) simulationResults.hidden = !isVisible;
  if (simulationEmptyState) simulationEmptyState.hidden = isVisible;
}

async function runSimulation() {
  if (!simulateButton) return;
  if (!validateSimulationInputs()) {
    resetSimulationDisplay();
    setSimulationVisibility(false);
    return;
  }
  const originalLabel = simulateButton.textContent;
  simulateButton.textContent = "Running...";
  simulateButton.classList.add("is-loading");
  try {
    await new Promise((resolve) => window.setTimeout(resolve, 280));
    handlePrediction();
    setSimulationVisibility(true);
  } finally {
    simulateButton.textContent = originalLabel;
    simulateButton.classList.remove("is-loading");
  }
}

function bindViewButtons() {
  document.querySelectorAll("[data-view]").forEach((control) => {
    if (control.classList.contains("nav-item")) return;
    control.onclick = (event) => {
      event.preventDefault();
      if (control.dataset.view === "students" && control.textContent.trim() === "Clear Filters") {
        document.getElementById("search-students").value = "";
        document.getElementById("filter-semester").value = "";
        document.getElementById("filter-program").value = "";
        document.getElementById("filter-category").value = "";
      }
      setView(control.dataset.view, { historyMode: "push" });
    };
  });
}

function renderAll() {
  enrichStudents();
  syncTemplateDownloadLinks();
  updateJumpAddLabel();
  applyMarkScheme();
  populateFilters();
  renderDashboard();
  renderStudentsTable();
  renderProfile();
  renderStoredCsvPreview();
  bindViewButtons();
  updateRoleBasedViewState();
  updateAuthUi();
}

function submitStudentForm(continueWithAnotherSemester = false) {
  pendingSaveAndContinue = continueWithAnotherSemester;
  if (typeof studentForm.requestSubmit === "function") {
    studentForm.requestSubmit();
    return;
  }
  studentForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
}

async function saveStudentRecord(student, options = {}) {
  const { continueWithAnotherSemester = false } = options;
  const duplicateSemester = students.find((entry) =>
    normalizeEnrollmentId(entry.enrollmentId) === normalizeEnrollmentId(student.enrollmentId)
      && Number(entry.semester) === Number(student.semester)
      && entry.id !== student.id
  );
  if (duplicateSemester) {
    formError.textContent = `Semester ${student.semester} is already entered for registration number ${student.enrollmentId}.`;
    setStep(2);
    return false;
  }

  const existingIndex = students.findIndex((entry) => entry.id === student.id);
  createRevertPoint(existingIndex >= 0 ? `edit student ${student.enrollmentId}` : `add student ${student.enrollmentId}`);
  if (existingIndex >= 0) students.splice(existingIndex, 1, student);
  else students.push(student);
  enrichStudents();
  saveStudents();
  const persistedStudent = findStudent(student.id) || student;
  let activeStudent = persistedStudent;
  if (authSession && hasSupabaseClient() && canManageStudentRecords()) {
    cloudSyncInFlight = true;
    try {
      await window.SapasSupabase.upsertStudentRecord(persistedStudent);
      await refreshStudentsFromCloud({
        preserveEnrollmentId: persistedStudent.enrollmentId,
        preserveSemester: persistedStudent.semester
      });
      activeStudent = students.find((item) =>
        item.enrollmentId === persistedStudent.enrollmentId
        && Number(item.semester) === Number(persistedStudent.semester)
      ) || persistedStudent;
    } finally {
      cloudSyncInFlight = false;
    }
  }
  selectedStudentId = activeStudent.id;

  if (continueWithAnotherSemester) {
    const continuationStudent = activeStudent && activeStudent.enrollmentId ? activeStudent : persistedStudent;
    const remainingSemesters = getRemainingSemestersForEnrollment(continuationStudent.enrollmentId);
    if (remainingSemesters.length) {
      prepareAdditionalSemesterEntry(continuationStudent);
      setView("add", { historyMode: "push" });
      return true;
    }
  }

  resetForm();
  setView("profile", { historyMode: "push" });
  return true;
}

navItems.forEach((item) => item.addEventListener("click", (event) => {
  event.preventDefault();
  setView(item.dataset.view, { historyMode: "push" });
}));
if (jumpAddLink) {
  jumpAddLink.addEventListener("click", (event) => {
    event.preventDefault();
    resetForm();
    setView("add", { historyMode: "push" });
  });
}
const downloadJsonButton = document.getElementById("download-json");
if (downloadJsonButton) {
  downloadJsonButton.addEventListener("click", async () =>
    downloadText("sapas-students.json", JSON.stringify(students, null, 2), "application/json")
  );
}
document.getElementById("download-csv").addEventListener("click", () => {
  submitCsvDownload("students.csv", studentsToCsv());
});
window.handleTemplateCsvDownload = () => {
  if ((downloadTemplateButton && (downloadTemplateButton.disabled || downloadTemplateButton.getAttribute("aria-disabled") === "true"))
    && (downloadTemplateSavedButton && (downloadTemplateSavedButton.disabled || downloadTemplateSavedButton.getAttribute("aria-disabled") === "true"))) return;
  const content = buildTemplateCsv();
  submitCsvDownload("students-template.csv", content);
};
window.handleCurrentCsvDownload = () => {
  if ((downloadStorageCsvButton && (downloadStorageCsvButton.disabled || downloadStorageCsvButton.getAttribute("aria-disabled") === "true"))
    && (downloadStorageCsvSavedButton && (downloadStorageCsvSavedButton.disabled || downloadStorageCsvSavedButton.getAttribute("aria-disabled") === "true"))) return;
  const config = getCurrentCsvDownloadConfig();
  if (!config) return;
  submitCsvDownload(config.filename, config.content);
};
[
  downloadTemplateButton,
  downloadTemplateSavedButton
].filter(Boolean).forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    syncTemplateDownloadLinks();
    if (button.getAttribute("aria-disabled") === "true") {
      return false;
    }
    const content = buildTemplateCsv();
    submitCsvDownload("students-template.csv", content);
    return true;
  });
});
[
  downloadStorageCsvButton,
  downloadStorageCsvSavedButton
].filter(Boolean).forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    handleDownloadCurrentCsv();
    if (button.getAttribute("aria-disabled") === "true") {
      return false;
    }
    const config = getCurrentCsvDownloadConfig();
    if (!config) return false;
    submitCsvDownload(config.filename, config.content);
    return true;
  });
});
document.getElementById("add-subject").addEventListener("click", () => createSubjectRow());
subjectsList.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) return;
  if (target.dataset.field !== "subject") return;
  target.dataset.preservedValue = String(target.value || "").trim();
  const selectedValues = Array.from(subjectsList.querySelectorAll('select[data-field="subject"]'))
    .map((select) => String(select.dataset.preservedValue || select.value || "").trim())
    .filter(Boolean);
  const currentValue = String(target.value || "").trim();
  if (currentValue && selectedValues.filter((value) => value === currentValue).length > 1) {
    target.value = "";
    formError.textContent = "This subject has already been added. Please select a different subject.";
  } else if (formError.textContent === "This subject has already been added. Please select a different subject.") {
    formError.textContent = "";
  }
  updateSubjectDropdownOptions();
});
nextStepButton.addEventListener("click", () => {
  if (validateStep(currentStep)) setStep(Math.min(3, currentStep + 1));
});
prevStepButton.addEventListener("click", () => setStep(Math.max(1, currentStep - 1)));
submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  submitStudentForm(false);
});
if (addAnotherSemesterButton) {
  addAnotherSemesterButton.addEventListener("click", (event) => {
    event.preventDefault();
    submitStudentForm(true);
  });
}
studentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!canManageStudentRecords()) {
    formError.textContent = "Your account can view records, but only admin and teacher roles can modify them.";
    return;
  }
  const continueWithAnotherSemester = pendingSaveAndContinue;
  pendingSaveAndContinue = false;
  const firstInvalidStep = [1, 2, 3].find((step) => !validateStep(step));
  if (firstInvalidStep) {
    setStep(firstInvalidStep);
    return;
  }

  let student;
  try {
    student = formDataToStudent();
  } catch (error) {
    formError.textContent = error instanceof Error ? error.message : "Unable to save this student record right now.";
    setStep(2);
    return;
  }
  try {
    await saveStudentRecord(student, { continueWithAnotherSemester });
  } catch (error) {
    formError.textContent = error instanceof Error ? error.message : "Unable to sync this student record right now.";
  }
});
predictionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runSimulation();
});
if (simulateButton) {
  simulateButton.addEventListener("click", (event) => {
    event.preventDefault();
    runSimulation();
  });
}
["search-students", "filter-semester", "filter-program", "filter-category"].forEach((id) => {
  const field = document.getElementById(id);
  field.addEventListener("input", renderStudentsTable);
  field.addEventListener("change", renderStudentsTable);
});
["pred-assignments", "pred-external", "pred-attendance"].forEach((id) => {
  const input = document.getElementById(id);
  const output = document.getElementById(`${id}-value`);
  input.addEventListener("input", () => {
    output.textContent = id === "pred-attendance" ? `${input.value}%` : input.value;
  });
});
["pred-cgpa", "pred-hours", "pred-backlogs", "pred-semester"].forEach((id) => {
  const input = document.getElementById(id);
  if (input && input.matches("input[data-numeric-mode]")) {
    input.addEventListener("input", () => syncNumericInput(input));
  }
});
if (programSelect) {
  programSelect.addEventListener("change", () => {
    syncProgramInput(programSelect.value);
    syncDepartmentStateFromProgram();
    updateSubjectDropdownOptions();
    updateBacklogLimit();
  });
}
if (levelSelect) {
  levelSelect.addEventListener("change", () => {
    if (programSelect) programSelect.value = "";
    syncProgramInput("");
    refreshProgramOptionsByDepartment();
    syncDepartmentStateFromProgram();
    updateSubjectDropdownOptions();
    updateBacklogLimit();
  });
}
if (departmentSelect) {
  departmentSelect.addEventListener("change", () => {
    syncDepartmentInput(departmentSelect.value);
    refreshProgramOptionsByDepartment();
    syncDepartmentStateFromProgram();
    updateSubjectDropdownOptions();
    updateBacklogLimit();
  });
}
if (programOtherInput) {
  programOtherInput.addEventListener("input", updateSubjectDropdownOptions);
}
if (departmentOtherInput) {
  departmentOtherInput.addEventListener("input", updateSubjectDropdownOptions);
}
if (enrollmentIdField) {
  ["input", "change"].forEach((eventName) => {
    enrollmentIdField.addEventListener(eventName, () => {
      const normalizedEnrollmentId = normalizeEnrollmentId(enrollmentIdField.value);
      if (permittedExistingEnrollmentId && normalizedEnrollmentId !== permittedExistingEnrollmentId) {
        permittedExistingEnrollmentId = "";
      }
      syncSemesterAvailability();
      updateAddAnotherSemesterButton();
      updateAddFormHeading();
      syncEnrollmentIdValidation();
    });
  });
}
const nameField = studentForm ? studentForm.elements.namedItem("name") : null;
if (nameField) {
  ["input", "change"].forEach((eventName) => {
    nameField.addEventListener(eventName, updateAddFormHeading);
  });
}
if (semesterSelect) {
  semesterSelect.addEventListener("change", () => {
    updateSubjectDropdownOptions();
    updateAddAnotherSemesterButton();
    updateBacklogLimit();
  });
}
if (phoneInput) {
  phoneInput.addEventListener("input", syncPhoneInput);
  phoneInput.addEventListener("blur", syncPhoneInput);
}
if (backlogsInput) {
  backlogsInput.addEventListener("input", updateBacklogLimit);
  backlogsInput.addEventListener("blur", updateBacklogLimit);
}
if (dobDisplayButton) {
  dobDisplayButton.addEventListener("click", () => {
    if (dobCalendarPopup?.hidden) openDobCalendar();
    else closeDobCalendar();
  });
}
if (dobPrevMonthButton) {
  dobPrevMonthButton.addEventListener("click", () => {
    dobCalendarViewDate = new Date(dobCalendarViewDate.getFullYear(), dobCalendarViewDate.getMonth() - 1, 1);
    renderDobCalendar();
  });
}
if (dobNextMonthButton) {
  dobNextMonthButton.addEventListener("click", () => {
    const nextDate = new Date(dobCalendarViewDate.getFullYear(), dobCalendarViewDate.getMonth() + 1, 1);
    const today = new Date();
    const latestMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    dobCalendarViewDate = nextDate > latestMonth ? latestMonth : nextDate;
    renderDobCalendar();
  });
}
if (dobMonthSelect) {
  dobMonthSelect.addEventListener("change", () => {
    dobCalendarViewDate = new Date(dobCalendarViewDate.getFullYear(), Number(dobMonthSelect.value), 1);
    renderDobCalendar();
  });
}
if (dobYearSelect) {
  dobYearSelect.addEventListener("change", () => {
    dobCalendarViewDate = new Date(Number(dobYearSelect.value), dobCalendarViewDate.getMonth(), 1);
    renderDobCalendar();
  });
}
if (dobCalendarGrid) {
  dobCalendarGrid.addEventListener("click", (event) => {
    const target = event.target.closest("[data-date]");
    if (!target) return;
    selectDobDate(target.dataset.date);
  });
}
document.addEventListener("click", (event) => {
  if (!dobCalendarPopup || dobCalendarPopup.hidden) return;
  const withinPicker = event.target.closest(".dob-picker-field");
  if (!withinPicker) closeDobCalendar();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDobCalendar();
});
applyInputRestrictions(document);

function openCsvFilePicker() {
  if (!csvFileInput) return;
  if (typeof csvFileInput.showPicker === "function") {
    csvFileInput.showPicker();
    return;
  }
  csvFileInput.click();
}

browseUploadButton.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  openCsvFilePicker();
});
uploadZone.addEventListener("click", (event) => {
  if (event.target === browseUploadButton) return;
  if (event.target === csvFileInput) return;
  openCsvFilePicker();
});
csvFileInput.addEventListener("change", async (event) => {
  try {
    await handleCsvFile(event.target.files[0]);
  } catch (error) {
    uploadFeedback.textContent = `${error.message} Import stays disabled until a valid file is selected.`;
    importCsvButton.disabled = true;
    clearUploadButton.disabled = false;
  }
});
["dragenter", "dragover"].forEach((eventName) => {
  uploadZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadZone.classList.add("drag-active");
  });
});
["dragleave", "drop"].forEach((eventName) => {
  uploadZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadZone.classList.remove("drag-active");
  });
});
uploadZone.addEventListener("drop", async (event) => {
  const file = event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files[0] : null;
  if (!file) return;
  try {
    await handleCsvFile(file);
  } catch (error) {
    uploadFeedback.textContent = `${error.message} Import stays disabled until a valid file is selected.`;
    importCsvButton.disabled = true;
    clearUploadButton.disabled = false;
  }
});
importCsvButton.addEventListener("click", async () => {
  if (!pendingCsvStudents.length) return;
  if (!canManageStudentRecords()) {
    uploadFeedback.textContent = "Only admin and teacher roles can import records.";
    return;
  }
  importCsvButton.disabled = true;
  try {
    createRevertPoint(`import ${pendingCsvStudents.length} row(s) from CSV`);
    students = mergeImportedStudents(pendingCsvStudents);
    enrichStudents();
    saveStudents();
    localStorage.setItem(CSV_SNAPSHOT_KEY, studentsToCsv());
    const importedRecords = pendingCsvStudents.map((item) =>
      students.find((student) =>
        student.enrollmentId === item.enrollmentId
        && Number(student.semester) === Number(item.semester)
      )
    ).filter(Boolean);
    let cloudSyncWarning = "";
    let importStatusMessage = `${importedRecords.length} row(s) imported successfully and saved locally.`;
    if (authSession && hasSupabaseClient()) {
      try {
        await window.SapasSupabase.importStudentRecords(importedRecords, pendingCsvFilename);
        await refreshStudentsFromCloud({
          preserveEnrollmentId: importedRecords[0]?.enrollmentId,
          preserveSemester: importedRecords[0]?.semester
        });
        importStatusMessage = `${importedRecords.length} row(s) imported successfully, saved locally, and synced to Supabase.`;
      } catch (error) {
        cloudSyncWarning = error instanceof Error ? error.message : "Import synced locally but failed to sync to Supabase.";
      }
    } else {
      importStatusMessage = `${importedRecords.length} row(s) imported successfully and saved locally. Sign in to sync future imports to Supabase automatically.`;
    }
    const firstImportedEnrollmentId = pendingCsvStudents[0].enrollmentId;
    const firstImportedSemester = Number(pendingCsvStudents[0].semester);
    const matchedStudent = students.find((student) =>
      student.enrollmentId === firstImportedEnrollmentId
      && Number(student.semester) === firstImportedSemester
    );
    selectedStudentId = matchedStudent ? matchedStudent.id : students[0]?.id || null;
    clearUploadState();
    clearUploadButton.disabled = false;
    renderAll();
    uploadFeedback.textContent = cloudSyncWarning || importStatusMessage;
    setView("students", { historyMode: "push" });
  } catch (error) {
    uploadFeedback.textContent = error instanceof Error ? error.message : "Import could not be completed.";
  } finally {
    importCsvButton.disabled = false;
  }
});
clearUploadButton.addEventListener("click", () => {
  if (!pendingCsvStudents.length && !pendingCsvPreviewRows.length && !csvFileInput.value && !hasStoredCsvSnapshot()) return;
  openClearPreviewModal(clearUploadButton);
});
if (restoreRevertPointButton) {
  restoreRevertPointButton.addEventListener("click", () => {
    restoreLatestRevertPoint();
  });
}
if (authForm) {
  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!hasSupabaseClient()) return;
    await submitAuth("signin");
  });
}
if (authSubmitButton) {
  authSubmitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!hasSupabaseClient()) return;
    await submitAuth("signin");
  });
}
if (authSignupActionButton) {
  authSignupActionButton.addEventListener("click", async () => {
    if (!hasSupabaseClient()) return;
    const shouldBlockSignup = await enforceSignupAvailability();
    if (shouldBlockSignup) {
      setAuthMessage("This email is already registered. Use Sign In instead.");
      return;
    }
    await submitAuth("signup");
  });
}
if (authGoogleButton) {
  authGoogleButton.addEventListener("click", async () => {
    if (!hasSupabaseClient()) return;
    if (authError) authError.textContent = "";
    try {
      await window.SapasSupabase.signInWithGoogle();
    } catch (error) {
      if (authError) authError.textContent = normalizeAuthMessage(error, "Google sign-in could not start.");
    }
  });
}
if (authSignoutButton) {
  authSignoutButton.addEventListener("click", async () => {
    if (!hasSupabaseClient()) return;
    await window.SapasSupabase.signOut();
  });
}

if (authEmailInput) {
  authEmailInput.addEventListener("input", () => {
    scheduleAuthSignupAvailabilityCheck();
  });
  authEmailInput.addEventListener("change", () => {
    scheduleAuthSignupAvailabilityCheck();
  });
  authEmailInput.addEventListener("blur", () => {
    scheduleAuthSignupAvailabilityCheck();
  });
}

if (deleteCancelButton) {
  deleteCancelButton.addEventListener("click", () => closeDeleteModal());
}
if (deleteConfirmButton) {
  deleteConfirmButton.addEventListener("click", async () => {
    try {
      await confirmDeleteStudent();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete this record right now.";
      if (formError) formError.textContent = message;
      if (uploadFeedback) uploadFeedback.textContent = message;
    }
  });
}
if (deleteModal) {
  deleteModal.addEventListener("click", (event) => {
    if (event.target === deleteModal) closeDeleteModal();
  });
}
if (topbarBackButton) {
  topbarBackButton.addEventListener("click", () => {
    if (document.body.dataset.view === "add" && currentStep > 1) {
      setStep(Math.max(1, currentStep - 1));
      return;
    }
    window.history.back();
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && deleteModal && !deleteModal.hidden) {
    closeDeleteModal();
  }
});

window.addEventListener("popstate", (event) => {
  const stateView = event.state && typeof event.state.view === "string" ? event.state.view : "";
  const nextView = stateView || viewNameFromHash() || "overview";
  setView(nextView);
});

window.addEventListener("hashchange", () => {
  const hashView = viewNameFromHash();
  if (hashView && document.body.dataset.view !== hashView) {
    setView(hashView, { historyMode: "replace" });
  }
});

window.addEventListener("pagehide", () => {
  if (window.SapasSupabase && window.SapasSupabase.clearSessionOnClose) {
    window.SapasSupabase.clearSessionOnClose();
  }
});

async function initializeApp() {
  removeLegacyTopbarActions();
  applyDateBounds();
  populateDobSelectors();
  syncDobDisplay();
  renderDobCalendar();
  syncPhoneInput();
  syncSemesterAvailability();
  refreshProgramOptionsByDepartment();
  syncProgramInput(programSelect ? programSelect.value : "");
  syncDepartmentInput(departmentSelect ? departmentSelect.value : "");
  syncDepartmentStateFromProgram();
  createSubjectRow();
  updateBacklogLimit();
  updateAddFormHeading();
  setStep(1);
  clearUploadState();
  renderRevertPointState();
  const initialView = viewNameFromHash() || "overview";
  setView(initialView, { historyMode: "replace" });
  await initializeSupabaseAuth();
  scheduleAuthSignupAvailabilityCheck();
  document.documentElement.classList.add("app-ready");
}

initializeApp().catch((error) => {
  console.error("SAPAS initialization failed:", error);
});

