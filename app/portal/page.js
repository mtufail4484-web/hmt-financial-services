"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { auth, db, storage } from "../../firebase";
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  validateDateOfBirth,
  sanitizeInput,
  getPasswordStrength,
} from "../../lib/validation";
import {
  ROLES,
  getEffectiveRole,
  canManageStaff,
  canDownloadBackups,
  canManageLectures,
  canPostAnnouncements,
  canReviewAssignments,
  canReplyQuestions,
  OWNER_UID,
} from "../../lib/roles";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const HMT_LOGO = "/hmt-logo-new.png?v=30";
const WATCH_REQUIRED_RATIO = 0.6;
const ADMIN_EMAIL = "m.tufailkhan12335@gmail.com";
const ADMIN_UID = "fSJ0jUBCONXGJA7H41ChRq2ERLs1";
const BRAND_SITE = "www.hmtfinancialservices.com";
const CERTIFICATES_RELEASED = false;
const FACEBOOK_PAGE_URL = "https://www.facebook.com/HMTSuccessAcademy";
const WHATSAPP_CONTACT_NUMBER = "923422981356";
const WHATSAPP_CONTACT_URL = `https://wa.me/${WHATSAPP_CONTACT_NUMBER}?text=${encodeURIComponent("Assalam o Alaikum HMT Success Academy, I need help with the student portal.")}`;
const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029Vb8QglDIHphB2UZcLW3H";
const YOUTUBE_PLAYLIST_ID = "PL7-zXwiLK4QpTLwRwytLdvhBJplS1lnhA";
const YOUTUBE_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`;
const DEFAULT_COURSE = {
  id: "default-course",
  name: "HMT Computer Course",
  playlistId: YOUTUBE_PLAYLIST_ID,
  playlistUrl: YOUTUBE_PLAYLIST_URL,
};
const OFFICE_2021_URL = "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view";
const NEXT_COURSE = {
  title: "Artificial Intelligence Course",
  status: "Coming Soon",
  description:
    "Our next HMT Success Academy course will introduce students to AI tools, prompt writing, productivity workflows, and responsible use of artificial intelligence.",
  topics: ["AI basics", "Prompt writing", "ChatGPT workflows", "AI for study and office work"],
};

const GENERAL_LECTURE_QUIZ = {
  question: "After watching this lecture, what is your learning status?",
  options: [
    "I learned something new",
    "I understood the main topic",
    "I need to revise and watch again",
    "I did not watch carefully",
  ],
  answer: "I learned something new",
  acceptedAnswers: [
    "I learned something new",
    "I understood the main topic",
    "I need to revise and watch again",
  ],
};

const HMT_PLAYLIST = [
  {
    id: "1",
    title: "Lecture 1: Introduction to Computer Basic",
    videoId: "cPpKY2oEd2s",
    duration: 85,
    notes: "Computer basics, hardware, software, input devices and output devices.",
    assignment: "Upload handwritten or typed work: 10 input devices and 10 output devices.",
    quiz: GENERAL_LECTURE_QUIZ,
  },
  {
    id: "2",
    title: "Lecture 2: MS Word, MS Excel, and PowerPoint Basic",
    videoId: "FSQ1H1dcxYk",
    duration: 65,
    notes: "Basic use of MS Word, Excel and PowerPoint.",
    assignment: "Upload screenshot or file of one simple MS Word document.",
    quiz: GENERAL_LECTURE_QUIZ,
  },
  {
    id: "3",
    title: "Lecture 3: Professional CV Design",
    videoId: "f4xVXgFSElo",
    duration: 76,
    notes: "Professional CV design, formatting and export as PDF.",
    assignment: "Upload your completed CV in PDF or Word format.",
    quiz: GENERAL_LECTURE_QUIZ,
  },
  {
    id: "4",
    title: "Lecture 4: Student Portal Complete Guide",
    videoId: "fJZSwxy_umk",
    duration: 45,
    notes: "Complete guide for using the HMT Success Academy student portal.",
    assignment: "Upload a screenshot showing that you can open and use your student portal.",
    quiz: GENERAL_LECTURE_QUIZ,
  },
  {
    id: "5",
    title: "Lecture 5: Excel Attendance Register with Dashboard",
    videoId: "0TrUhAE-Iao",
    duration: 60,
    notes: "Create a school attendance register with dashboard in Microsoft Excel.",
    assignment: "Upload your practice attendance sheet or dashboard screenshot.",
    quiz: GENERAL_LECTURE_QUIZ,
  },
  {
    id: "6",
    title: "Lecture 6: Student Result Sheet and Dynamic Result Card",
    videoId: "Ia1hKML6oqk",
    duration: 60,
    notes: "Build a professional student result sheet and dynamic result card in Excel.",
    assignment: "Upload your result sheet or result card practice file.",
    quiz: GENERAL_LECTURE_QUIZ,
  },
  {
    id: "7",
    title: "Lecture 7: Professional Salary Sheet in Excel",
    videoId: "3VFBepUNpM0",
    duration: 60,
    notes: "Create payroll, overtime, advance, and net salary calculations in Excel.",
    assignment: "Upload your salary sheet practice file or screenshot.",
    quiz: GENERAL_LECTURE_QUIZ,
  },
  {
    id: "8",
    title: "Lecture 8: Excel Home Tab Complete Practice",
    videoId: "0Qoroiw804M",
    duration: 60,
    notes: "Practice Home tab tools including copy, paste, find, replace, and alignment.",
    assignment: "Upload an Excel practice sheet using Home tab formatting tools.",
    quiz: GENERAL_LECTURE_QUIZ,
  },
  {
    id: "9",
    title: "Lecture 9: Excel Insert Tab Masterclass",
    videoId: "HIYDIKtFubU",
    duration: 60,
    notes: "Learn Insert tab tools including SmartArt, charts, pivot table, pictures, and maps.",
    assignment: "Upload a practice file using at least three Insert tab tools.",
    quiz: GENERAL_LECTURE_QUIZ,
  },
  {
    id: "10",
    title: "Lecture 10: Excel Marks Entry in One Click",
    videoId: "RV_mOiZ9F3w",
    duration: 45,
    notes: "Learn how to manage marks entry for many students efficiently in Excel.",
    assignment: "Upload your marks entry practice sheet.",
    quiz: GENERAL_LECTURE_QUIZ,
  },
  {
    id: "11",
    title: "Lecture 11: Student ID Card Portal Guide",
    videoId: "e2m-bQ1o8mc",
    duration: 45,
    notes: "Guide for getting and using the student ID card from the HMT portal.",
    assignment: "Upload a screenshot or note confirming you checked your student ID card section.",
    quiz: GENERAL_LECTURE_QUIZ,
  },
  {
    id: "12",
    title: "Lecture 12: Excel Page Layout Masterclass",
    videoId: "nIxRnzmPUy0",
    duration: 60,
    notes: "Learn print area, orientation, scaling, headers, footers, and page layout in Excel.",
    assignment: "Upload an Excel file or screenshot showing page layout and print settings.",
    quiz: GENERAL_LECTURE_QUIZ,
  },
];

const StatusBadge = ({ done }) =>
  done ? (
    <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full">OK</span>
  ) : (
    <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded-full">Pending</span>
  );

const StudentAvatar = ({ user, size = "w-20 h-20" }) => {
  const photoSrc = user?.photoURL || user?.photoDataURL;

  if (photoSrc) {
    return (
      <img
        src={photoSrc}
        alt={user.name || "Student"}
        className={`${size} rounded-full object-cover border-4 border-white shadow-lg`}
      />
    );
  }

  return (
    <div className={`${size} rounded-full bg-gradient-to-br from-blue-100 to-amber-100 border-4 border-white shadow-lg flex items-center justify-center text-sm font-black text-blue-800`}>
      HMT
    </div>
  );
};

const YoutubeIcon = ({ className = "" }) => (
  <svg viewBox="0 0 48 34" className={className} aria-hidden="true">
    <rect width="48" height="34" rx="8" fill="#ff0000" />
    <path d="M20 9.5v15l13-7.5-13-7.5Z" fill="#fff" />
  </svg>
);

const WhatsappIcon = ({ className = "" }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <circle cx="24" cy="24" r="23" fill="#25d366" />
    <path
      d="M15.2 34.1 16.7 29A11.2 11.2 0 1 1 21 33.1l-5.8 1Zm6.1-4.9.5.3a8 8 0 1 0-2.8-2.8l.3.5-.8 2.7 2.8-.7Z"
      fill="#fff"
    />
    <path
      d="M28.7 25.6c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.3-.8.1-.4-.2-1.5-.5-2.8-1.8-1-1-1.7-2.2-1.9-2.6-.2-.4 0-.6.2-.8l.5-.6c.2-.2.2-.4.3-.6.1-.2.1-.5 0-.7-.1-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.3 3.4 1.5 3.6c.2.2 2.5 3.8 6 5.3.8.4 1.5.6 2 .8.8.3 1.6.3 2.2.2.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5Z"
      fill="#fff"
    />
  </svg>
);

const MiniIcon = ({ type }) => {
  const common = "h-3.5 w-3.5";
  if (type === "user") {
    return <svg viewBox="0 0 24 24" className={common}><circle cx="12" cy="7" r="4" fill="currentColor" /><path d="M4 21c1.2-4.8 14.8-4.8 16 0H4Z" fill="currentColor" /></svg>;
  }
  if (type === "card") {
    return <svg viewBox="0 0 24 24" className={common}><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M7 10h5M7 14h10" stroke="currentColor" strokeWidth="2" /></svg>;
  }
  if (type === "pin") {
    return <svg viewBox="0 0 24 24" className={common}><path d="M12 22s7-7.1 7-13A7 7 0 0 0 5 9c0 5.9 7 13 7 13Z" fill="currentColor" /><circle cx="12" cy="9" r="2.5" fill="#031735" /></svg>;
  }
  if (type === "book") {
    return <svg viewBox="0 0 24 24" className={common}><path d="M4 5.5c3 0 5 .4 8 2v12c-3-1.6-5-2-8-2v-12Zm16 0c-3 0-5 .4-8 2v12c3-1.6 5-2 8-2v-12Z" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
  }
  if (type === "screen") {
    return <svg viewBox="0 0 24 24" className={common}><rect x="3" y="5" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M9 21h6M12 17v4" stroke="currentColor" strokeWidth="2" /></svg>;
  }
  if (type === "check") {
    return <svg viewBox="0 0 24 24" className={common}><path d="m5 12 4 4 10-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  if (type === "chart") {
    return <svg viewBox="0 0 24 24" className={common}><path d="M4 19V9m6 10V5m6 14v-7m4-6-6 6-4-4-6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  if (type === "calendar") {
    return <svg viewBox="0 0 24 24" className={common}><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" /></svg>;
  }
  if (type === "certificate") {
    return <svg viewBox="0 0 24 24" className={common}><circle cx="12" cy="9" r="5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m9 14-2 7 5-3 5 3-2-7" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
  }
  return <span className="text-[10px] font-black">ID</span>;
};

export default function PortalPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminSubTab, setAdminSubTab] = useState("students");
  const [studentTab, setStudentTab] = useState("learn");
  const [lectureFilter, setLectureFilter] = useState("all");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [education, setEducation] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [device, setDevice] = useState("Mobile");
  const [heardAboutUs, setHeardAboutUs] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const [user, setUser] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const [allAiInterests, setAllAiInterests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalStudents, setTotalStudents] = useState(0);
  const [courseCatalog, setCourseCatalog] = useState(() => {
    const baseCatalog = [DEFAULT_COURSE];

    if (typeof window === "undefined") {
      return baseCatalog;
    }

    try {
      const storedCatalog = window.localStorage.getItem("hmt-course-catalog");
      if (storedCatalog) {
        const parsed = JSON.parse(storedCatalog);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.filter((course) => course?.id && course?.name);
          const hasDefault = normalized.some((course) => course.id === "default-course");
          return hasDefault ? normalized : [...baseCatalog, ...normalized];
        }
      }
    } catch (err) {
      console.warn("Could not restore course catalog from local storage.", err);
    }

    return baseCatalog;
  });
  const [selectedCourseId, setSelectedCourseId] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_COURSE.id;

    try {
      const storedCourse = window.localStorage.getItem("hmt-selected-course");
      if (storedCourse) return storedCourse;
    } catch (err) {
      console.warn("Could not restore selected course from local storage.", err);
    }

    return DEFAULT_COURSE.id;
  });
  const [newCourseName, setNewCourseName] = useState("");
  const [newCoursePlaylistUrl, setNewCoursePlaylistUrl] = useState("");
  const [courseSaving, setCourseSaving] = useState(false);
  const [courseVideos, setCourseVideos] = useState(() =>
    HMT_PLAYLIST.map((video, index) => ({
      ...video,
      id: `default-course:${video.videoId || index + 1}`,
      courseId: "default-course",
      courseName: "HMT Computer Course",
      playlistUrl: YOUTUBE_PLAYLIST_URL,
    }))
  );
  const [activeVideo, setActiveVideo] = useState(HMT_PLAYLIST[0]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [updatingVideo, setUpdatingVideo] = useState(false);
  const [downloadingCard, setDownloadingCard] = useState(false);

  const [showCardModal, setShowCardModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  const [studentQuestionText, setStudentQuestionText] = useState("");
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementImageFile, setAnnouncementImageFile] = useState(null);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState("");
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);
  const [readAnnouncementIds, setReadAnnouncementIds] = useState([]);
  const [announcementResponseTexts, setAnnouncementResponseTexts] = useState({});
  const [adminReplyTexts, setAdminReplyTexts] = useState({});
  const [adminFeedbackTexts, setAdminFeedbackTexts] = useState({});
  const [adminFilter, setAdminFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [adminAssignmentStudent, setAdminAssignmentStudent] = useState(null);
  const [manualCompletionSaving, setManualCompletionSaving] = useState("");
  const [aiInterestSubmitting, setAiInterestSubmitting] = useState(false);
  const [syncingVerificationRecords, setSyncingVerificationRecords] = useState(false);
  const [studentLoadError, setStudentLoadError] = useState("");
  const [editingLectureId, setEditingLectureId] = useState("");
  const [lectureSaving, setLectureSaving] = useState(false);
  const [backupGenerating, setBackupGenerating] = useState(false);
  const [backupLastGeneratedAt, setBackupLastGeneratedAt] = useState("");
  const [backupVerified, setBackupVerified] = useState(false);
  const [practiceLectureId, setPracticeLectureId] = useState(HMT_PLAYLIST[0]?.id || "");
  const [practiceFile, setPracticeFile] = useState(null);
  const [practiceUploading, setPracticeUploading] = useState(false);
  const [lectureForm, setLectureForm] = useState({
    title: "",
    videoId: "",
    duration: "",
    notes: "",
    assignment: "",
  });

  const [editName, setEditName] = useState("");
  const [editFatherName, setEditFatherName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editEducation, setEditEducation] = useState("");
  const [editDevice, setEditDevice] = useState("Mobile");
  const [editPhotoFile, setEditPhotoFile] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [profileSaveMessage, setProfileSaveMessage] = useState("");
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoDurationSeconds, setCurrentVideoDurationSeconds] = useState(0);
  const intervalRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const studentCardRef = useRef(null);
  const latestWatchSnapshotRef = useRef(null);
  const lastPlayerTimeRef = useRef(0);
  const lastProgressSavedSecondsRef = useRef(0);

  const completedVideos = user?.completedVideos || [];
  const lectureProgress = user?.lectureProgress || {};

  const getLectureProgressKeys = (lecture) => {
    const keys = [lecture?.id, lecture?.videoId];
    if (lecture?.courseId === "default-course" || String(lecture?.id || "").startsWith("default-course:")) {
      keys.push(String(lecture?.order || ""));
    }
    return [...new Set(keys.filter(Boolean).map(String))];
  };

  const getLectureProgress = (progressMap, lecture) => {
    const keys = getLectureProgressKeys(lecture);
    return keys.reduce((progress, key) => ({ ...progress, ...(progressMap?.[key] || {}) }), {});
  };

  const isLectureCompleted = (progressMap, completedIds, lecture) => {
    const keys = getLectureProgressKeys(lecture);
    return keys.some((key) => progressMap?.[key]?.completed || completedIds.includes(key));
  };

  const currentProgress = getLectureProgress(lectureProgress, activeVideo);

  const requireBackupBeforeAdminMutation = (actionLabel) => {
    if (!isAdmin) {
      alert("Only authorised administrators can perform this action.");
      return false;
    }

    return true;
  };

  const triggerDownload = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const watchSeconds = currentProgress.watchSeconds || 0;
  const fallbackVideoDurationSeconds = Math.max(1, Math.round((activeVideo.duration || 30) * 60));
  const videoTotalSeconds = currentVideoDurationSeconds || currentProgress.videoDurationSeconds || fallbackVideoDurationSeconds;
  const requiredWatchSeconds = Math.max(1, Math.ceil(videoTotalSeconds * WATCH_REQUIRED_RATIO));
  const watchDone = currentProgress.watchDone || watchSeconds >= requiredWatchSeconds;
  const watchPercent = Math.min(100, Math.round((watchSeconds / videoTotalSeconds) * 100));
  const homeworkDone = currentProgress.homeworkDone || false;
  const isLectureDone = isLectureCompleted(lectureProgress, completedVideos, activeVideo);
  const canMarkLectureDone = watchDone && !isLectureDone;

  const completedCount = courseVideos.filter((v) => {
    return isLectureCompleted(lectureProgress, completedVideos, v);
  }).length;

  const progressPercent = Math.round((completedCount / courseVideos.length) * 100);
  const incompleteCourseVideos = courseVideos.filter((video) => !isLectureCompleted(lectureProgress, completedVideos, video));
  const completedCourseVideos = courseVideos.filter((video) => isLectureCompleted(lectureProgress, completedVideos, video));
  const visibleCourseVideos = lectureFilter === "completed"
    ? completedCourseVideos
    : lectureFilter === "todo"
    ? incompleteCourseVideos
    : courseVideos;
  const isCourseFullyCompleted = completedCount >= courseVideos.length;
  const canClaimCertificate = isCourseFullyCompleted && CERTIFICATES_RELEASED;
  const isValidSubmissionUrl = (value) => typeof value === "string" && /^https?:\/\//i.test(value.trim());

  const activeUserRole = getEffectiveRole(user);
  const isOwner = activeUserRole === ROLES.OWNER;
  const isAdmin = activeUserRole === ROLES.OWNER || activeUserRole === ROLES.ADMIN;
  const isTeacher = activeUserRole === ROLES.OWNER || activeUserRole === ROLES.ADMIN || activeUserRole === ROLES.TEACHER;

  const handleAssignUserRole = async (targetStudent, newRole) => {
    if (!isOwner) {
      alert("Only the Academy Owner can assign user roles.");
      return;
    }

    const docId = targetStudent?.docId || targetStudent?.uid;
    if (!docId) {
      alert("Selected student record is missing ID.");
      return;
    }

    if (docId === OWNER_UID || targetStudent.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      alert("Master Owner account role is permanent and cannot be modified.");
      return;
    }

    try {
      const studentRef = doc(db, "students", docId);
      const now = new Date().toISOString();
      await updateDoc(studentRef, {
        role: newRole,
        accountType: newRole,
        isAdmin: newRole === ROLES.ADMIN || newRole === ROLES.OWNER,
        isTeacher: newRole === ROLES.TEACHER || newRole === ROLES.ADMIN || newRole === ROLES.OWNER,
        roleUpdatedAt: now,
        roleUpdatedBy: user?.email || ADMIN_EMAIL,
      });

      setAllStudents((prev) =>
        prev.map((item) =>
          item.docId === docId || item.uid === docId
            ? {
                ...item,
                role: newRole,
                accountType: newRole,
                isAdmin: newRole === ROLES.ADMIN || newRole === ROLES.OWNER,
                isTeacher: newRole === ROLES.TEACHER || newRole === ROLES.ADMIN || newRole === ROLES.OWNER,
              }
            : item
        )
      );

      alert(`Role for ${targetStudent.name || targetStudent.email} successfully updated to ${newRole.toUpperCase()}.`);
    } catch (err) {
      alert("Could not update role: " + err.message);
    }
  };

  useEffect(() => {
    if (!user?.uid || isAdmin || typeof window === "undefined") return;

    queueMicrotask(() => {
      try {
        const storedReadIds = JSON.parse(window.localStorage.getItem(`hmt-read-announcements-${user.uid}`) || "[]");
        setReadAnnouncementIds(Array.isArray(storedReadIds) ? storedReadIds : []);
      } catch {
        setReadAnnouncementIds([]);
      }
    });
  }, [user?.uid, isAdmin]);

  const markAnnouncementRead = (announcementId) => {
    if (!user?.uid || !announcementId) return;

    setReadAnnouncementIds((previousIds) => {
      const nextIds = previousIds.includes(announcementId) ? previousIds : [...previousIds, announcementId];
      window.localStorage.setItem(`hmt-read-announcements-${user.uid}`, JSON.stringify(nextIds));
      return nextIds;
    });
  };

  const cardVerificationUrl = getVerificationUrl(user?.rollNo);
  const cardQrUrl = `/api/qr?size=220x220&data=${encodeURIComponent(cardVerificationUrl)}`;
  const youtubeEmbedUrl =
    typeof window !== "undefined"
      ? `https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=0&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
      : `https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=0&rel=0&enablejsapi=1`;
  const portalStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "HMT Success Academy Student Portal",
    url: "https://www.hmtfinancialservices.com/portal",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description:
      "Student learning portal for HMT Success Academy computer course lectures, assignments, progress tracking, student cards, certificate status, and upcoming AI course updates.",
    provider: {
      "@type": "EducationalOrganization",
      name: "HMT Success Academy",
      url: "https://www.hmtfinancialservices.com",
      logo: "https://www.hmtfinancialservices.com/hmt-logo-new.png",
      sameAs: [
        "https://www.facebook.com/HMTSuccessAcademy",
        "https://youtube.com/@hmtsuccessacademy",
      ],
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
    },
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const formatCardDate = (value) => {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return "29-Jun-2026";
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  };

  const safeUpdateUser = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const buildAdminUser = (firebaseUser) => ({
    uid: firebaseUser.uid,
    name: "HMT Admin",
    email: firebaseUser.email || ADMIN_EMAIL,
    rollNo: "ADMIN",
    role: "admin",
    isAdmin: true,
    completedVideos: [],
    lectureProgress: {},
    watchTimeMinutes: 0,
    createdAt: new Date().toISOString(),
  });

  const extractYouTubeVideoId = useCallback((value) => {
    const input = String(value || "").trim();
    if (!input) return "";

    const patterns = [
      /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/,
      /(?:list=|playlist\?list=)([a-zA-Z0-9_-]{10,})/,
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match?.[1]) return match[1];
    }

    return input;
  }, []);

  const extractPlaylistIdFromUrl = useCallback((value) => {
    const input = String(value || "").trim();
    if (!input) return "";

    const patterns = [
      /[?&]list=([a-zA-Z0-9_-]{10,})/,
      /youtube\.com\/playlist\?list=([a-zA-Z0-9_-]{10,})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/,
      /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match?.[1]) return match[1];
    }

    return input;
  }, []);

  const makeCourseLectureId = useCallback((courseId, lectureId) => {
    const base = String(lectureId || "lecture");
    return `${courseId}:${base}`;
  }, []);

  const normalizeLectures = useCallback((lectures) =>
    lectures
      .map((lecture, index) => ({
        id: String(lecture.id || lecture.docId || `lecture-${index + 1}`),
        title: lecture.title || `Lecture ${index + 1}`,
        videoId: extractYouTubeVideoId(lecture.videoId || ""),
        duration: Number(lecture.duration) || 30,
        notes: lecture.notes || "",
        assignment: lecture.assignment || "Upload your completed practice work for this lecture.",
        quiz: lecture.quiz || GENERAL_LECTURE_QUIZ,
        order: Number.isFinite(Number(lecture.order)) ? Number(lecture.order) : index + 1,
        published: lecture.published !== false,
        practiceFileURL: lecture.practiceFileURL || "",
        practiceFileName: lecture.practiceFileName || "",
        practiceFileType: lecture.practiceFileType || "",
        practiceFileUpdatedAt: lecture.practiceFileUpdatedAt || "",
      }))
      .filter((lecture) => lecture.videoId)
      .sort((a, b) => a.order - b.order), [extractYouTubeVideoId]);

  const mergePlaylistLectures = useCallback((playlistLectures, savedLectures) => {
    const mergedLectures = [...playlistLectures];
    const seenKeys = new Set(
      playlistLectures.flatMap((lecture) => [
        `id:${lecture.id}`,
        `video:${lecture.videoId}`,
      ])
    );

    savedLectures.forEach((lecture) => {
      const idKey = `id:${lecture.id}`;
      const videoKey = `video:${lecture.videoId}`;
      const existingIndex = mergedLectures.findIndex(
        (item) => item.id === lecture.id || item.videoId === lecture.videoId
      );

      if (existingIndex >= 0) {
        mergedLectures[existingIndex] = {
          ...mergedLectures[existingIndex],
          ...lecture,
          order: mergedLectures[existingIndex].order || existingIndex + 1,
        };
        return;
      }

      if (!seenKeys.has(idKey) && !seenKeys.has(videoKey)) {
        mergedLectures.push({
          ...lecture,
          order: lecture.order || mergedLectures.length + 1,
        });
        seenKeys.add(idKey);
        seenKeys.add(videoKey);
      }
    });

    return mergedLectures.map((lecture, index) => ({
      ...lecture,
      order: index + 1,
    }));
  }, []);

  const resetLectureForm = () => {
    setEditingLectureId("");
    setLectureForm({
      title: "",
      videoId: "",
      duration: "",
      notes: "",
      assignment: "",
    });
  };

  const uploadFileAndGetURL = async (file, path) => {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const withTimeout = (promise, ms, message) =>
    Promise.race([
      promise,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error(message)), ms);
      }),
    ]);

  const resizeImageToDataURL = (file, maxSize = 700, quality = 0.82) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(image.width * ratio);
          canvas.height = Math.round(image.height * ratio);

          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        image.onerror = reject;
        image.src = reader.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const saveStudentPhoto = async (file, path) => {
    if (!file) return { photoURL: "", photoDataURL: "" };

    const photoDataURL = await resizeImageToDataURL(file);

    try {
      const photoURL = await withTimeout(
        uploadFileAndGetURL(file, path),
        12000,
        "Storage upload timed out"
      );
      return { photoURL, photoDataURL };
    } catch (err) {
      console.warn("Firebase Storage photo upload failed; saved Firestore photo fallback.", err);
      return { photoURL: "", photoDataURL };
    }
  };

  function getVerificationUrl(rollNo) {
    return `https://${BRAND_SITE}/verify/${encodeURIComponent(rollNo || "C-26-HMT000")}`;
  }

  const normalizeRollNo = (value = "") => String(value).trim().toUpperCase().replace(/\s+/g, "");

  const buildPublicStudentVerification = (student, overrides = {}) => {
    const merged = { ...student, ...overrides };
    return {
      uid: merged.uid || "",
      rollNo: normalizeRollNo(merged.rollNo),
      accountStatus: merged.accountStatus || "active",
      course: "Free Computer Course 2026",
      updatedAt: new Date().toISOString(),
    };
  };

  const upsertPublicStudentVerification = async (student, overrides = {}) => {
    const publicRecord = buildPublicStudentVerification(student, overrides);
    if (!publicRecord.rollNo) return;

    await setDoc(doc(db, "publicStudentVerifications", publicRecord.rollNo), publicRecord);
  };

  const deletePublicStudentVerification = async (rollNo) => {
    const cleanRollNo = normalizeRollNo(rollNo);
    if (!cleanRollNo) return;

    await deleteDoc(doc(db, "publicStudentVerifications", cleanRollNo));
  };

  const printStudentCard = () => {
    const cleanup = () => {
      document.body.classList.remove("printing-student-card");
      window.removeEventListener("afterprint", cleanup);
    };

    document.body.classList.add("printing-student-card");
    window.addEventListener("afterprint", cleanup);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.print();
      });
    });
  };

  const downloadStudentCard = async () => {
    if (!studentCardRef.current || downloadingCard) return;

    setDownloadingCard(true);
    let resetTimer = null;

    const downloadCanvasAsJpeg = async (canvas) => {
      const blob = await new Promise((resolve, reject) => {
        const timer = window.setTimeout(() => reject(new Error("JPEG conversion timed out")), 7000);
        canvas.toBlob(
          (result) => {
            window.clearTimeout(timer);
            if (result) resolve(result);
            else reject(new Error("JPEG conversion failed"));
          },
          "image/jpeg",
          0.96
        );
      });

      const fileName = `HMT-Student-Card-${user?.rollNo || "Student"}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "HMT Student Card",
            text: "Download or save your HMT Success Academy student card.",
          });
          return;
        } catch (shareError) {
          if (shareError?.name === "AbortError") return;
          console.warn("Mobile share failed; using link download fallback.", shareError);
        }
      }

      const link = document.createElement("a");
      link.download = fileName;
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    };

    const buildFallbackCanvas = async () => {
      const loadImage = (src) =>
        new Promise((resolve) => {
          if (!src) {
            resolve(null);
            return;
          }

          const image = new Image();
          const timer = window.setTimeout(() => resolve(null), 3500);
          image.crossOrigin = "anonymous";
          image.onload = () => {
            window.clearTimeout(timer);
            resolve(image);
          };
          image.onerror = () => {
            window.clearTimeout(timer);
            resolve(null);
          };
          image.src = src;
        });

      const roundRect = (ctx, x, y, width, height, radius) => {
        const r = Math.min(radius, width / 2, height / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + width, y, x + width, y + height, r);
        ctx.arcTo(x + width, y + height, x, y + height, r);
        ctx.arcTo(x, y + height, x, y, r);
        ctx.arcTo(x, y, x + width, y, r);
        ctx.closePath();
      };

      const drawText = (ctx, text, x, y, options = {}) => {
        ctx.save();
        ctx.fillStyle = options.color || "#07133f";
        ctx.font = `${options.weight || "800"} ${options.size || 24}px Arial, sans-serif`;
        ctx.textAlign = options.align || "left";
        ctx.textBaseline = options.baseline || "alphabetic";
        ctx.fillText(String(text || ""), x, y);
        ctx.restore();
      };

      const drawFitText = (ctx, text, x, y, maxWidth, options = {}) => {
        let size = options.size || 24;
        const minSize = options.minSize || 14;
        ctx.save();
        ctx.fillStyle = options.color || "#07133f";
        ctx.textAlign = options.align || "left";
        ctx.textBaseline = options.baseline || "alphabetic";
        do {
          ctx.font = `${options.weight || "800"} ${size}px Arial, sans-serif`;
          if (ctx.measureText(String(text || "")).width <= maxWidth || size <= minSize) break;
          size -= 1;
        } while (size >= minSize);
        ctx.fillText(String(text || ""), x, y);
        ctx.restore();
      };

      const drawImageCover = (ctx, image, x, y, width, height) => {
        if (!image) return;
        const scale = Math.max(width / image.width, height / image.height);
        const sw = width / scale;
        const sh = height / scale;
        const sx = Math.max(0, (image.width - sw) / 2);
        ctx.drawImage(image, sx, 0, sw, sh, x, y, width, height);
      };

      const canvas = document.createElement("canvas");
      canvas.width = 1480;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");
      const navy = "#031735";
      const gold = "#d99a1a";
      const brightGold = "#f4c447";
      const ink = "#07133f";

      const [logoImage, photoImage, qrImage] = await Promise.all([
        loadImage(HMT_LOGO),
        loadImage(user?.photoDataURL),
        loadImage(cardQrUrl),
      ]);

      ctx.fillStyle = "#f8f6ef";
      roundRect(ctx, 20, 20, 1440, 940, 42);
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = gold;
      ctx.stroke();

      ctx.save();
      roundRect(ctx, 20, 20, 1440, 940, 42);
      ctx.clip();
      ctx.fillStyle = navy;
      ctx.fillRect(20, 20, 1440, 300);
      ctx.fillRect(20, 780, 1440, 180);

      ctx.fillStyle = gold;
      ctx.beginPath();
      ctx.moveTo(20, 390);
      ctx.lineTo(360, 310);
      ctx.lineTo(1120, 302);
      ctx.lineTo(1460, 292);
      ctx.lineTo(1460, 330);
      ctx.lineTo(20, 410);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(20, 420);
      ctx.lineTo(360, 335);
      ctx.lineTo(1120, 325);
      ctx.lineTo(1460, 318);
      ctx.lineTo(1460, 780);
      ctx.lineTo(20, 780);
      ctx.closePath();
      ctx.fill();

      roundRect(ctx, 90, 55, 140, 120, 24);
      ctx.fillStyle = "#061d3f";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = brightGold;
      ctx.stroke();
      if (logoImage) ctx.drawImage(logoImage, 110, 70, 100, 90);

      drawText(ctx, "HMT", 600, 105, { color: "#ffffff", size: 64, weight: "900", align: "right" });
      drawText(ctx, "SUCCESS", 620, 105, { color: brightGold, size: 64, weight: "900" });
      drawText(ctx, "ACADEMY", 740, 180, { color: brightGold, size: 64, weight: "900", align: "center" });
      drawText(ctx, "LEARN  .  GROW  .  SUCCEED", 740, 245, { color: "#ffffff", size: 30, weight: "900", align: "center" });
      ctx.strokeStyle = brightGold;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(360, 230);
      ctx.lineTo(500, 230);
      ctx.moveTo(980, 230);
      ctx.lineTo(1120, 230);
      ctx.stroke();

      roundRect(ctx, 430, 275, 620, 70, 18);
      ctx.fillStyle = navy;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = gold;
      ctx.stroke();
      drawText(ctx, "OFFICIAL STUDENT ID CARD", 740, 322, { color: "#ffffff", size: 32, weight: "900", align: "center" });
      ctx.fillStyle = brightGold;
      ctx.beginPath();
      ctx.arc(460, 310, 10, 0, Math.PI * 2);
      ctx.arc(1020, 310, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(1290, 120);
      ctx.fillStyle = brightGold;
      ctx.beginPath();
      ctx.arc(0, 0, 82, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#8a5a05";
      ctx.stroke();
      drawText(ctx, "FOUNDING", 0, -25, { color: navy, size: 20, weight: "900", align: "center" });
      drawText(ctx, "BATCH", 0, 3, { color: navy, size: 20, weight: "900", align: "center" });
      drawText(ctx, "2026", 0, 52, { color: navy, size: 44, weight: "900", align: "center" });
      ctx.fillStyle = navy;
      ctx.fillRect(-18, 78, 12, 95);
      ctx.fillRect(6, 78, 12, 95);
      ctx.restore();

      roundRect(ctx, 70, 385, 290, 360, 30);
      ctx.fillStyle = navy;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = gold;
      ctx.stroke();
      ctx.save();
      roundRect(ctx, 70, 385, 290, 275, 28);
      ctx.clip();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(70, 385, 290, 275);
      if (photoImage) drawImageCover(ctx, photoImage, 70, 385, 290, 275);
      else {
        drawText(ctx, "HMT", 215, 535, { color: navy, size: 58, weight: "900", align: "center" });
        drawText(ctx, "STUDENT PHOTO", 215, 580, { color: navy, size: 18, weight: "900", align: "center" });
      }
      ctx.restore();
      drawText(ctx, "VERIFIED STUDENT PORTAL", 215, 695, { color: "#ffffff", size: 18, weight: "900", align: "center" });
      ctx.strokeStyle = brightGold;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(95, 710);
      ctx.lineTo(335, 710);
      ctx.stroke();
      drawText(ctx, "HMT SUCCESS ACADEMY", 215, 735, { color: "#ffffff", size: 18, weight: "900", align: "center" });

      roundRect(ctx, 400, 385, 640, 360, 18);
      ctx.fillStyle = "rgba(255,255,255,0.96)";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = gold;
      ctx.stroke();

      const rows = [
        ["STUDENT NAME", user?.name || "Student Name"],
        ["STUDENT ID", user?.rollNo || "C-26-HMT000"],
        ["FATHER NAME", user?.fatherName || "N/A"],
        ["CITY", user?.city || "Pakistan"],
        ["COURSE", "Free Computer Course 2026"],
        ["DOMAIN", "Computer Sciences"],
        ["STATUS", "Active Student"],
      ];

      rows.forEach(([label, value], index) => {
        const y = 430 + index * 44;
        roundRect(ctx, 420, y - 24, 28, 28, 7);
        ctx.fillStyle = navy;
        ctx.fill();
        ctx.fillStyle = brightGold;
        ctx.beginPath();
        ctx.arc(434, y - 10, 4, 0, Math.PI * 2);
        ctx.fill();
        drawText(ctx, label, 470, y, { color: ink, size: 18, weight: "900" });
        drawFitText(ctx, value, 670, y, 345, { color: index === 6 ? "#008236" : ink, size: index === 4 ? 22 : 26, minSize: 16, weight: "900" });
        if (index < rows.length - 1) {
          ctx.strokeStyle = "#cbd5e1";
          ctx.lineWidth = 2;
          ctx.setLineDash([9, 7]);
          ctx.beginPath();
          ctx.moveTo(455, y + 15);
          ctx.lineTo(1010, y + 15);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      roundRect(ctx, 1070, 385, 280, 360, 26);
      ctx.fillStyle = navy;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = gold;
      ctx.stroke();
      roundRect(ctx, 1090, 405, 240, 190, 14);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      if (qrImage) ctx.drawImage(qrImage, 1122, 412, 176, 176);
      roundRect(ctx, 1090, 612, 240, 42, 22);
      ctx.fillStyle = brightGold;
      ctx.fill();
      drawText(ctx, "SCAN TO VERIFY", 1210, 640, { color: navy, size: 20, weight: "900", align: "center" });
      drawText(ctx, "Powered By", 1210, 680, { color: "#ffffff", size: 13, weight: "700", align: "center" });
      drawText(ctx, "HMT Financial &", 1210, 710, { color: brightGold, size: 20, weight: "900", align: "center" });
      drawText(ctx, "Digital Solutions", 1210, 736, { color: brightGold, size: 20, weight: "900", align: "center" });
      drawText(ctx, BRAND_SITE, 1210, 765, { color: "#ffffff", size: 11, weight: "800", align: "center" });

      roundRect(ctx, 300, 760, 880, 72, 16);
      const statGradient = ctx.createLinearGradient(300, 760, 1180, 832);
      statGradient.addColorStop(0, "#02142f");
      statGradient.addColorStop(0.5, "#06224a");
      statGradient.addColorStop(1, "#02142f");
      ctx.fillStyle = statGradient;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#123b70";
      ctx.stroke();
      const stats = [
        ["ISSUED DATE", formatCardDate(user?.createdAt)],
        ["COURSE PROGRESS", `${progressPercent}%`],
        ["CLASSES COMPLETED", String(completedCount).padStart(2, "0")],
        ["CERTIFICATE STATUS", canClaimCertificate ? "Released" : "Locked"],
      ];
      stats.forEach(([label, value], index) => {
        const x = 330 + index * 215;
        if (index > 0) {
          ctx.strokeStyle = brightGold;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x - 25, 770);
          ctx.lineTo(x - 25, 822);
          ctx.stroke();
        }
        drawText(ctx, label, x, 786, { color: "#ffffff", size: 13, weight: "900" });
        drawText(ctx, value, x, 817, { color: brightGold, size: 28, weight: "900" });
      });

      ctx.strokeStyle = gold;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(70, 875);
      ctx.lineTo(1410, 875);
      ctx.stroke();
      roundRect(ctx, 90, 895, 44, 30, 8);
      ctx.fillStyle = "#ff0000";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(108, 903);
      ctx.lineTo(108, 917);
      ctx.lineTo(122, 910);
      ctx.closePath();
      ctx.fill();
      drawFitText(ctx, "YouTube.com/@HMTSuccessAcademy", 150, 918, 350, { color: "#ffffff", size: 17, minSize: 13, weight: "800" });
      ctx.fillStyle = "#25d366";
      ctx.beginPath();
      ctx.arc(650, 910, 22, 0, Math.PI * 2);
      ctx.fill();
      drawText(ctx, "WA", 650, 918, { color: "#ffffff", size: 15, weight: "900", align: "center" });
      drawText(ctx, "WhatsApp Channel", 690, 905, { color: "#ffffff", size: 17, weight: "900" });
      drawText(ctx, "Join for Updates", 690, 925, { color: "#ffffff", size: 12, weight: "800" });
      drawFitText(ctx, "* Training - Technology - Digital Services", 1110, 905, 420, { color: "#ffffff", size: 16, minSize: 12, weight: "800", align: "center" });
      drawFitText(ctx, "* Striving Today, Succeeding Tomorrow *", 1110, 930, 420, { color: brightGold, size: 16, minSize: 12, weight: "900", align: "center" });
      ctx.restore();

      return canvas;
    };

    try {
      resetTimer = window.setTimeout(() => {
        setDownloadingCard(false);
      }, 16000);

      let canvas;
      try {
        const html2canvas = (await import("html2canvas")).default;
        if (document.fonts?.ready) await document.fonts.ready;

        canvas = await Promise.race([
          html2canvas(studentCardRef.current, {
            backgroundColor: "#f8f6ef",
            scale: 2.5,
            useCORS: true,
            allowTaint: false,
            imageTimeout: 5000,
            onclone: (clonedDocument) => {
              const clonedCard = clonedDocument.querySelector(".student-card-print");
              const clonedPhoto = clonedCard?.querySelector('img[data-student-card-photo="true"]');
              if (clonedPhoto && user?.photoDataURL) clonedPhoto.src = user.photoDataURL;
            },
          }),
          new Promise((_, reject) => {
            window.setTimeout(() => reject(new Error("Card capture timed out")), 10000);
          }),
        ]);
      } catch (captureError) {
        console.warn("Exact card capture failed; using generated JPEG fallback.", captureError);
        canvas = await buildFallbackCanvas();
      }

      await downloadCanvasAsJpeg(canvas);
    } catch (err) {
      console.error("Card download failed:", err);
      alert("Card JPEG download failed. Please use Print Student Card and choose Save as PDF.");
    } finally {
      if (resetTimer) window.clearTimeout(resetTimer);
      setDownloadingCard(false);
    }
  };
  const saveLectureProgress = async (videoId, progressData) => {
    if (!user?.uid) return;

    const updatedLectureProgress = {
      ...(user.lectureProgress || {}),
      [videoId]: {
        ...(user.lectureProgress?.[videoId] || {}),
        ...progressData,
        updatedAt: new Date().toISOString(),
      },
    };

    await updateDoc(doc(db, "students", user.uid), {
      lectureProgress: updatedLectureProgress,
    });

    safeUpdateUser({ lectureProgress: updatedLectureProgress });
  };

  const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const getStudentSortTime = (student) => {
    const value = student?.createdAt || student?.registeredAt || student?.updatedAt || student?.lastVisitedAt || "1970-01-01T00:00:00.000Z";
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? 0 : time;
  };

  const sortStudentsNewestFirst = (students = []) =>
    [...students].sort((a, b) => getStudentSortTime(b) - getStudentSortTime(a));

  const fetchStudents = async () => {
    if (!isAdmin) {
      setAllStudents([]);
      setTotalStudents(0);
      return [];
    }

    try {
      setStudentLoadError("");
      const querySnapshot = await getDocs(collection(db, "students"));
      const legacyPasswordDocs = querySnapshot.docs.filter((studentDoc) => studentDoc.data().loginPassword);
      if (legacyPasswordDocs.length > 0) {
        await Promise.all(
          legacyPasswordDocs.map((studentDoc) =>
            updateDoc(studentDoc.ref, { loginPassword: deleteField() })
          )
        );
      }
      const students = sortStudentsNewestFirst(
        querySnapshot.docs
          .map((d) => {
            const { loginPassword, ...studentData } = d.data();
            return { docId: d.id, ...studentData };
          })
          .filter((student) => student.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase())
      );
      setAllStudents(students);
      setTotalStudents(students.length);
      return students;
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudentLoadError(err.message || "Could not load students.");
      return null;
    }
  };

  const buildSortedStudentExportRows = (students = []) => {
    const ordered = sortStudentsNewestFirst(students);

    return ordered.map((student, index) => {
      const lectureStats = getStudentLectureStats(student);
      const progressPercent = courseVideos.length ? Math.round((lectureStats.completed / courseVideos.length) * 100) : 0;
      const createdAt = student.createdAt ? new Date(student.createdAt).toLocaleString() : "N/A";
      const lastVisited = student.lastVisitedAt ? new Date(student.lastVisitedAt).toLocaleString() : "N/A";
      const status = student.accountStatus === "deactivated" ? "Deactivated" : student.accountStatus === "struckOff" ? "Struck Off" : "Active";

      return {
        no: index + 1,
        name: student.name || "N/A",
        rollNo: student.rollNo || "N/A",
        email: student.email || "N/A",
        phone: student.phoneNumber || "N/A",
        city: student.city || "N/A",
        fatherName: student.fatherName || "N/A",
        education: student.education || "N/A",
        device: student.deviceOwned || "N/A",
        progressPercent: `${progressPercent}%`,
        lecturesDone: `${lectureStats.completed}/${courseVideos.length || 0}`,
        visits: student.visitCount || 0,
        createdAt,
        lastVisited,
        status,
      };
    });
  };

  const downloadStudentCsvExport = (fileName, rows, mimeType) => {
    const headers = [
      "#",
      "Name",
      "Roll No",
      "Email",
      "Phone",
      "City",
      "Father Name",
      "Education",
      "Device",
      "Progress",
      "Lectures Done",
      "Visits",
      "Created At",
      "Last Visited",
      "Status",
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const key = header
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/[^a-z]/g, "");
            const value = row[key] ?? "";
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const getFilteredReportStudents = () => sortStudentsNewestFirst(filteredStudents.length ? filteredStudents : allStudents);

  const downloadStudentReportCsv = () => {
    const selectedStudents = getFilteredReportStudents();
    if (!selectedStudents.length) {
      alert("There are no students matching the current filters.");
      return;
    }

    const rows = buildSortedStudentExportRows(selectedStudents);
    downloadStudentCsvExport(
      `hmt-students-report-${new Date().toISOString().slice(0, 10)}.csv`,
      rows,
      "text/csv;charset=utf-8;"
    );
  };

  const downloadStudentReportExcel = () => {
    const selectedStudents = getFilteredReportStudents();
    if (!selectedStudents.length) {
      alert("There are no students matching the current filters.");
      return;
    }

    const rows = buildSortedStudentExportRows(selectedStudents);
    downloadStudentCsvExport(
      `hmt-students-report-${new Date().toISOString().slice(0, 10)}.xls`,
      rows,
      "application/vnd.ms-excel;charset=utf-8;"
    );
  };

  const downloadStudentReportPdf = () => {
    const selectedStudents = getFilteredReportStudents();
    if (!selectedStudents.length) {
      alert("There are no students matching the current filters.");
      return;
    }

    const reportWindow = window.open("", "_blank", "width=1400,height=1000");
    if (!reportWindow) {
      alert("Please allow pop-ups to download the student PDF report.");
      return;
    }

    const rows = selectedStudents
      .map((student, index) => {
        const lectureStats = getStudentLectureStats(student);
        const progressPercent = courseVideos.length ? Math.round((lectureStats.completed / courseVideos.length) * 100) : 0;
        const createdAt = student.createdAt ? new Date(student.createdAt).toLocaleString() : "N/A";
        const lastVisited = student.lastVisitedAt ? new Date(student.lastVisitedAt).toLocaleString() : "N/A";
        const status = student.accountStatus === "deactivated" ? "Deactivated" : student.accountStatus === "struckOff" ? "Struck Off" : "Active";
        return `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(student.name || "N/A")}</td>
            <td>${escapeHtml(student.rollNo || "N/A")}</td>
            <td>${escapeHtml(student.email || "N/A")}</td>
            <td>${escapeHtml(student.phoneNumber || "N/A")}</td>
            <td>${escapeHtml(student.city || "N/A")}</td>
            <td>${escapeHtml(student.fatherName || "N/A")}</td>
            <td>${escapeHtml(student.education || "N/A")}</td>
            <td>${escapeHtml(student.deviceOwned || "N/A")}</td>
            <td>${progressPercent}%</td>
            <td>${lectureStats.completed}/${courseVideos.length}</td>
            <td>${student.visitCount || 0}</td>
            <td>${createdAt}</td>
            <td>${lastVisited}</td>
            <td>${status}</td>
          </tr>
        `;
      })
      .join("");

    reportWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>HMT Student Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
            h1 { font-size: 24px; margin-bottom: 8px; }
            .meta { font-size: 12px; color: #475569; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; vertical-align: top; }
            th { background: #0f172a; color: white; }
            tr:nth-child(even) td { background: #f8fafc; }
            @media print {
              body { margin: 12px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>HMT Success Academy - Student Report</h1>
          <div class="meta">Generated: ${new Date().toLocaleString()} | Total Students: ${selectedStudents.length} | Sorted: Latest to Oldest | Filter: ${adminFilter === "all" ? "All" : adminFilter} / ${cityFilter === "all" ? "All Cities" : cityFilter} / Search: ${searchQuery || "None"}</div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Roll No</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Father</th>
                <th>Education</th>
                <th>Device</th>
                <th>Progress</th>
                <th>Lectures Done</th>
                <th>Visits</th>
                <th>Created At</th>
                <th>Last Visited</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `);

    reportWindow.document.close();
    reportWindow.focus();
    setTimeout(() => {
      reportWindow.print();
    }, 400);
  };

  useEffect(() => {
    let cancelled = false;

    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn("Could not set Firebase auth persistence.", err);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (cancelled) return;

      if (!firebaseUser) {
        setUser(null);
        setAuthChecking(false);
        return;
      }

      try {
        await firebaseUser.getIdToken(true).catch((err) => {
          console.warn("Could not refresh Firebase auth token.", err);
        });

        if (firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          if (!cancelled) {
            setUser(buildAdminUser(firebaseUser));
            setActiveTab("admin");
            setAuthChecking(false);
          }
          return;
        }

        const docRef = doc(db, "students", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists() || cancelled) {
          if (!cancelled) setAuthChecking(false);
          return;
        }

        const data = docSnap.data();
        if (data.accountStatus === "deactivated" || data.accountStatus === "struckOff") {
          await auth.signOut();
          if (!cancelled) {
            setUser(null);
            setError(data.accountStatus === "struckOff" ? "Your account has been struck off by academy admin." : "Your account has been deactivated by academy admin.");
            setAuthChecking(false);
          }
          return;
        }

        const now = new Date().toISOString();
        const visitSessionKey = `hmt-portal-visit-${firebaseUser.uid}`;
        const shouldCountVisit = typeof window !== "undefined" && !window.sessionStorage.getItem(visitSessionKey);
        const visitCount = (data.visitCount || 0) + (shouldCountVisit ? 1 : 0);

        if (shouldCountVisit) {
          await updateDoc(docRef, { visitCount, lastVisitedAt: now });
          window.sessionStorage.setItem(visitSessionKey, "1");
        }

        if (!cancelled) {
          setUser({
            ...data,
            visitCount,
            lastVisitedAt: data.lastVisitedAt || now,
            completedVideos: data.completedVideos || [],
            lectureProgress: data.lectureProgress || {},
            rollNo: data.rollNo || "C-26-HMT000",
          });

          if (firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            setActiveTab("admin");
          }
          setAuthChecking(false);
        }
      } catch (err) {
        console.warn("Could not restore saved portal session.", err);
        if (!cancelled) setAuthChecking(false);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [normalizeLectures]);

  useEffect(() => {
    if (!user?.uid) return undefined;

    if (isAdmin) {
      queueMicrotask(() => {
        fetchStudents();
      });
    }

    const questionsRef = isAdmin
      ? collection(db, "questions")
      : query(collection(db, "questions"), where("studentId", "==", user.uid));
    const qUnsub = onSnapshot(questionsRef, (snapshot) => {
      const questionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      questionsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllQuestions(questionsData);
    });

    const announcementUnsub = onSnapshot(collection(db, "announcements"), (snapshot) => {
      const announcements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllAnnouncements(announcements);
    });

    const aiInterestUnsub =
      user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
        ? onSnapshot(
            collection(db, "aiCourseInterest"),
            (snapshot) => {
              const interests = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
              interests.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0));
              setAllAiInterests(interests);
            },
            (err) => {
              console.warn("Could not load AI course interest list.", err);
              setAllAiInterests([]);
            }
          )
        : onSnapshot(
            doc(db, "aiCourseInterest", user.uid),
            (snapshot) => {
              setAllAiInterests(snapshot.exists() ? [{ id: snapshot.id, ...snapshot.data() }] : []);
            },
            (err) => {
              console.warn("Could not load student AI course interest.", err);
              setAllAiInterests([]);
            }
          );

    return () => {
      qUnsub();
      announcementUnsub();
      aiInterestUnsub();
    };
  }, [user?.email, user?.uid]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("Could not register HMT portal service worker.", err);
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("hmt-course-catalog", JSON.stringify(courseCatalog));
      if (selectedCourseId) {
        window.localStorage.setItem("hmt-selected-course", selectedCourseId);
      }
    }
  }, [courseCatalog, selectedCourseId]);

  const loadCourseVideosForSelection = useCallback(
    async (courseId) => {
      const selectedCourse = courseCatalog.find((course) => course.id === courseId) || courseCatalog[0];
      if (!selectedCourse) return;

      if (courseId === "default-course") {
        const defaultVideos = normalizeLectures(HMT_PLAYLIST).map((video, index) => ({
          ...video,
          id: makeCourseLectureId(courseId, video.videoId || index + 1),
          courseId,
          courseName: selectedCourse.name,
          playlistUrl: selectedCourse.playlistUrl,
        }));
        setCourseVideos(defaultVideos);
        setActiveVideo(defaultVideos[0] || HMT_PLAYLIST[0]);
        return;
      }

      try {
        const response = await fetch(`/api/youtube-playlist?playlistId=${encodeURIComponent(selectedCourse.playlistId)}`, { cache: "no-store" });
        const data = response.ok ? await response.json() : null;
        const fetchedVideos = Array.isArray(data?.videos) ? data.videos : [];
        const baseVideos = fetchedVideos.length > 0 ? normalizeLectures(fetchedVideos) : normalizeLectures(HMT_PLAYLIST);
        const selectedVideos = baseVideos.map((video, index) => ({
          ...video,
          id: makeCourseLectureId(courseId, video.videoId || index + 1),
          courseId,
          courseName: selectedCourse.name,
          playlistUrl: selectedCourse.playlistUrl,
        }));

        setCourseVideos(selectedVideos);
        setActiveVideo(selectedVideos[0] || HMT_PLAYLIST[0]);
      } catch (err) {
        console.warn("Could not load the selected course playlist.", err);
        const fallbackVideos = normalizeLectures(HMT_PLAYLIST).map((video, index) => ({
          ...video,
          id: makeCourseLectureId(courseId, video.videoId || index + 1),
          courseId,
          courseName: selectedCourse.name,
          playlistUrl: selectedCourse.playlistUrl,
        }));
        setCourseVideos(fallbackVideos);
        setActiveVideo(fallbackVideos[0] || HMT_PLAYLIST[0]);
      }
    },
    [courseCatalog, makeCourseLectureId, normalizeLectures]
  );

  useEffect(() => {
    let isMounted = true;

    const loadPlaylistFallback = async (savedLectures = []) => {
      if (!selectedCourseId) return;

      const selectedCourse = courseCatalog.find((course) => course.id === selectedCourseId) || courseCatalog[0];
      if (!selectedCourse) return;

      const courseScopedLectures = savedLectures.filter((lecture) => {
        const lectureCourseId = lecture.courseId || "default-course";
        return lectureCourseId === selectedCourse.id;
      });

      try {
        const response = await fetch(`/api/youtube-playlist?playlistId=${encodeURIComponent(selectedCourse.playlistId)}`, { cache: "no-store" });
        const data = response.ok ? await response.json() : null;
        if (!isMounted) return;

        const youtubeLectures = Array.isArray(data?.videos) ? normalizeLectures(data.videos) : [];
        const defaultBaseLectures = normalizeLectures(HMT_PLAYLIST);
        const baseLectures = selectedCourse.id === "default-course"
          ? youtubeLectures.length > 0
            ? mergePlaylistLectures(youtubeLectures, defaultBaseLectures)
            : mergePlaylistLectures(defaultBaseLectures, courseScopedLectures)
          : youtubeLectures.length > 0
            ? youtubeLectures
            : [];
        const playlistLectures = baseLectures.map((video, index) => ({
          ...video,
          id: makeCourseLectureId(selectedCourse.id, video.videoId || index + 1),
          courseId: selectedCourse.id,
          courseName: selectedCourse.name,
          playlistUrl: selectedCourse.playlistUrl,
        }));

        const mergedLectures = mergePlaylistLectures(playlistLectures, courseScopedLectures.map((lecture) => ({
          ...lecture,
          courseId: selectedCourse.id,
          courseName: selectedCourse.name,
          playlistUrl: selectedCourse.playlistUrl,
          id: lecture.id || makeCourseLectureId(selectedCourse.id, lecture.videoId || lecture.title),
        })));

        if (!mergedLectures.length) return;
        setCourseVideos(mergedLectures);
        setActiveVideo((current) => mergedLectures.find((video) => video.id === current.id) || mergedLectures[0]);
      } catch (err) {
        console.warn("Could not load selected course playlist; using fallback lectures.", err);
        const fallbackLectures = selectedCourse.id === "default-course"
          ? mergePlaylistLectures(normalizeLectures(HMT_PLAYLIST), courseScopedLectures)
          : [];
        const mergedLectures = mergePlaylistLectures(
          fallbackLectures.map((video, index) => ({
            ...video,
            id: makeCourseLectureId(selectedCourse.id, video.videoId || index + 1),
            courseId: selectedCourse.id,
            courseName: selectedCourse.name,
            playlistUrl: selectedCourse.playlistUrl,
          })),
          courseScopedLectures.map((lecture) => ({
            ...lecture,
            courseId: selectedCourse.id,
            courseName: selectedCourse.name,
            playlistUrl: selectedCourse.playlistUrl,
            id: lecture.id || makeCourseLectureId(selectedCourse.id, lecture.videoId || lecture.title),
          }))
        );
        if (!isMounted || mergedLectures.length === 0) return;
        setCourseVideos(mergedLectures);
        setActiveVideo((current) => mergedLectures.find((video) => video.id === current.id) || mergedLectures[0]);
      }
    };

    const unsubscribe = onSnapshot(
      collection(db, "courseLectures"),
      (snapshot) => {
        if (!isMounted) return;
        const savedLectures = normalizeLectures(
          snapshot.docs
            .map((item) => ({ docId: item.id, ...item.data() }))
            .filter((lecture) => lecture.courseId === selectedCourseId || (!lecture.courseId && selectedCourseId === "default-course"))
        );
        loadPlaylistFallback(savedLectures);
      },
      (err) => {
        console.warn("Could not load admin course lectures; using playlist fallback.", err);
        loadPlaylistFallback();
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [courseCatalog, makeCourseLectureId, mergePlaylistLectures, normalizeLectures, selectedCourseId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedFile(null);
    setIsPlaying(false);
    setCurrentVideoDurationSeconds(0);
    lastPlayerTimeRef.current = 0;
    lastProgressSavedSecondsRef.current = 0;
  }, [activeVideo.id]);

  useEffect(() => {
    if (!user || !activeVideo?.videoId) return;

    let cancelled = false;

    const createPlayer = () => {
      if (cancelled || !window.YT?.Player || !document.getElementById("hmt-youtube-player")) return;

      if (youtubePlayerRef.current?.destroy) {
        youtubePlayerRef.current.destroy();
      }

      youtubePlayerRef.current = new window.YT.Player("hmt-youtube-player", {
        events: {
          onReady: (event) => {
            const readDuration = () => {
              const duration = Math.floor(event.target?.getDuration?.() || 0);
              if (duration > 0) {
                setCurrentVideoDurationSeconds(duration);
                saveLectureProgress(activeVideo.id, { videoDurationSeconds: duration }).catch(console.error);
              }
            };

            readDuration();
            window.setTimeout(readDuration, 1200);
          },
          onStateChange: (event) => {
            const playing = event.data === window.YT.PlayerState.PLAYING;
            setIsPlaying(playing);
            if (playing) {
              lastPlayerTimeRef.current = Math.floor(event.target?.getCurrentTime?.() || 0);
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
      }

      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previousReady === "function") previousReady();
        createPlayer();
      };
    }

    return () => {
      cancelled = true;
      setIsPlaying(false);
      if (youtubePlayerRef.current?.destroy) {
        youtubePlayerRef.current.destroy();
        youtubePlayerRef.current = null;
      }
    };
  }, [activeVideo.id, activeVideo.videoId, user?.uid]);

  useEffect(() => {
    if (!user || isLectureDone) return;

    intervalRef.current = setInterval(async () => {
      const player = youtubePlayerRef.current;
      const playerState = player?.getPlayerState?.();
      const playerTime = Math.floor(player?.getCurrentTime?.() || 0);
      const playerIsPlaying =
        playerState === window.YT?.PlayerState?.PLAYING ||
        isPlaying ||
        (playerTime > 0 && playerTime >= lastPlayerTimeRef.current);

      const elapsedSeconds =
        playerTime > lastPlayerTimeRef.current
          ? Math.min(3, playerTime - lastPlayerTimeRef.current)
          : playerIsPlaying
          ? 1
          : 0;

      if (playerTime > 0) {
        lastPlayerTimeRef.current = playerTime;
      }

      if (elapsedSeconds <= 0) return;

      setUser((prev) => {
        if (!prev) return null;
        const existingProgress = getLectureProgress(prev.lectureProgress, activeVideo);
        const existingWatch = existingProgress.watchSeconds || 0;
        const previousKeyWatch = prev.lectureProgress?.[activeVideo.id]?.watchSeconds || 0;
        const baseWatchSeconds = Math.max(existingWatch, previousKeyWatch);

        if (baseWatchSeconds >= videoTotalSeconds && (existingProgress.watchDone || previousKeyWatch >= requiredWatchSeconds)) {
          return prev;
        }

        const currentSeconds = Math.min(videoTotalSeconds, baseWatchSeconds + elapsedSeconds);
        const dynamicWatchDone = currentSeconds >= requiredWatchSeconds || existingProgress.watchDone === true;

        const updatedProgress = {
          ...(prev.lectureProgress || {}),
          [activeVideo.id]: {
            ...existingProgress,
            ...(prev.lectureProgress?.[activeVideo.id] || {}),
            watchSeconds: currentSeconds,
            watchDone: dynamicWatchDone,
            requiredWatchSeconds,
            videoDurationSeconds: videoTotalSeconds,
            watchPercent: Math.min(100, Math.round((currentSeconds / videoTotalSeconds) * 100)),
            updatedAt: new Date().toISOString(),
          },
        };

        if (currentSeconds - lastProgressSavedSecondsRef.current >= 5 || dynamicWatchDone) {
          lastProgressSavedSecondsRef.current = currentSeconds;
          updateDoc(doc(db, "students", prev.uid), {
            [`lectureProgress.${activeVideo.id}`]: updatedProgress[activeVideo.id],
          }).catch(console.error);
        }

        return { ...prev, lectureProgress: updatedProgress };
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
      [`lectureProgress.${activeVideo.id}.watchDone`]: true,
      [`lectureProgress.${activeVideo.id}.requiredWatchSeconds`]: requiredWatchSeconds,
      [`lectureProgress.${activeVideo.id}.videoDurationSeconds`]: videoTotalSeconds,
      [`lectureProgress.${activeVideo.id}.watchPercent`]: 100,
      [`lectureProgress.${activeVideo.id}.updatedAt`]: new Date().toISOString(),
    }).catch(console.error);
  }, [activeVideo.id, currentProgress.watchDone, isLectureDone, requiredWatchSeconds, user?.uid, videoTotalSeconds, watchSeconds]);

  useEffect(() => {
    if (!user?.uid) {
      latestWatchSnapshotRef.current = null;
      return;
    }

    latestWatchSnapshotRef.current = {
      uid: user.uid,
      lectureProgress: {
        ...(user.lectureProgress || {}),
        [activeVideo.id]: {
          ...currentProgress,
          watchSeconds,
          watchDone,
          requiredWatchSeconds,
          videoDurationSeconds: videoTotalSeconds,
          watchPercent,
          updatedAt: new Date().toISOString(),
        },
      },
    };
  });

  useEffect(() => {
    const flushWatchProgress = () => {
      const snapshot = latestWatchSnapshotRef.current;
      if (!snapshot?.uid) return;

      updateDoc(doc(db, "students", snapshot.uid), {
        lectureProgress: snapshot.lectureProgress,
      }).catch(console.error);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushWatchProgress();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", flushWatchProgress);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", flushWatchProgress);
    };
  }, []);

  const openYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${activeVideo.videoId}`, "_blank");
  };

  const openFacebook = () => {
    window.open(FACEBOOK_PAGE_URL, "_blank");
  };

  const openWhatsAppChannel = () => {
    window.open(WHATSAPP_CHANNEL_URL, "_blank");
  };

  const openWhatsAppContact = () => {
    window.open(WHATSAPP_CONTACT_URL, "_blank");
  };

  const handleDownloadFullBackup = async () => {
    if (!isAdmin) {
      alert("Only authorised administrators can download the full portal backup.");
      return;
    }

    if (backupGenerating) return;

    try {
      setBackupGenerating(true);
      console.log("🔄 Starting backup generation...");
      console.log("Current user:", {
        uid: user?.uid,
        email: user?.email,
        isAdmin: isAdmin,
      });

      // Refresh auth token to ensure valid credentials
      if (auth.currentUser) {
        console.log("🔑 Refreshing auth token...");
        await auth.currentUser.getIdToken(true);
        console.log("✅ Auth token refreshed");
      } else {
        throw new Error("User is not authenticated - auth.currentUser is null");
      }

      // Test Firestore connectivity with a simple read
      console.log("🧪 Testing Firestore connection...");
      try {
        await getDoc(doc(db, "metadata", "student_counter"));
        console.log("✅ Firestore connection successful");
      } catch (connErr) {
        console.error("⚠️ Firestore connection issue:", connErr?.message);
      }

      // Add a small delay to ensure connection is stable
      await new Promise(resolve => setTimeout(resolve, 500));

      let students = [];
      let lectures = [];
      let questions = [];
      let announcements = [];
      let aiInterests = [];
      let counterData = {};
      let counterSnapshot = null;
      let publicVerifications = [];

      // Try to read students - continue on error
      try {
        console.log("📥 Reading students collection...");
        const studentsSnapshot = await getDocs(collection(db, "students"));
        students = studentsSnapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
        console.log(`✅ Students read: ${students.length} records`);
      } catch (err) {
        console.error("⚠️ Students read failed (continuing):", err?.message);
        students = [];
      }

      // Try to read lectures - continue on error
      try {
        console.log("📥 Reading courseLectures collection...");
        const lecturesSnapshot = await getDocs(collection(db, "courseLectures"));
        lectures = lecturesSnapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
        console.log(`✅ Lectures read: ${lectures.length} records`);
      } catch (err) {
        console.error("⚠️ Lectures read failed (continuing):", err?.message);
        lectures = [];
      }

      // Try to read questions - continue on error
      try {
        console.log("📥 Reading questions collection...");
        const questionsSnapshot = await getDocs(collection(db, "questions"));
        questions = questionsSnapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
        console.log(`✅ Questions read: ${questions.length} records`);
      } catch (err) {
        console.error("⚠️ Questions read failed (continuing):", err?.message);
        questions = [];
      }

      // Try to read announcements - continue on error
      try {
        console.log("📥 Reading announcements collection...");
        const announcementsSnapshot = await getDocs(collection(db, "announcements"));
        announcements = announcementsSnapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
        console.log(`✅ Announcements read: ${announcements.length} records`);
      } catch (err) {
        console.error("⚠️ Announcements read failed (continuing):", err?.message);
        announcements = [];
      }

      // Try to read AI interests - continue on error
      try {
        console.log("📥 Reading aiCourseInterest collection...");
        const aiInterestsSnapshot = await getDocs(collection(db, "aiCourseInterest"));
        aiInterests = aiInterestsSnapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
        console.log(`✅ AI Interests read: ${aiInterests.length} records`);
      } catch (err) {
        console.error("⚠️ AI Interests read failed (continuing):", err?.message);
        aiInterests = [];
      }

      // Try to read metadata - continue on error
      try {
        console.log("📥 Reading metadata/student_counter...");
        counterSnapshot = await getDoc(doc(db, "metadata", "student_counter"));
        counterData = counterSnapshot.exists() ? counterSnapshot.data() : {};
        console.log(`✅ Metadata read`);
      } catch (err) {
        console.error("⚠️ Metadata read failed (continuing):", err?.message);
        counterSnapshot = null;
        counterData = {};
      }



      // Try to read public verifications - continue on error
      try {
        console.log("📥 Reading publicStudentVerifications (first 10 students)...");
        publicVerifications = await Promise.all(
          students.slice(0, 10).map(async (student) => {
            const rollNo = normalizeRollNo(student.rollNo || student.id || "");
            if (!rollNo) return null;
            try {
              const verificationSnap = await getDoc(doc(db, "publicStudentVerifications", rollNo));
              return verificationSnap.exists() ? { id: verificationSnap.id, ...verificationSnap.data() } : null;
            } catch (err) {
              return null;
            }
          })
        ).then((items) => items.filter(Boolean));
        console.log(`✅ Public Verifications read: ${publicVerifications.length} records`);
      } catch (err) {
        console.error("⚠️ Public Verifications read failed (continuing):", err?.message);
        publicVerifications = [];
      }

      console.log("📊 Creating backup payload...");
      const studentRecords = students.map((student) => ({
        ...student,
        profileInformation: {
          fullName: student.name || "",
          fatherName: student.fatherName || "",
          dateOfBirth: student.dateOfBirth || student.dob || "",
          education: student.education || "",
          deviceOwned: student.deviceOwned || "",
          heardFrom: student.heardFrom || "",
        },
        contactInformation: {
          email: student.email || "",
          phoneNumber: student.phoneNumber || "",
          city: student.city || "",
          rollNo: student.rollNo || "",
        },
        guardianInformation: {
          fatherName: student.fatherName || "",
          guardianName: student.guardianName || "",
          guardianPhone: student.guardianPhone || "",
        },
        feeRecords: student.feeRecords || [],
        attendance: student.attendance || [],
        progressReports: student.progressReports || [],
        marksResults: student.marksResults || [],
        assignments: student.assignments || [],
        uploadedDocuments: student.uploadedDocuments || [],
        courseInformation: {
          courseTitle: student.courseTitle || "Free Computer Course 2026",
          courseStatus: student.courseStatus || "",
          className: student.className || "",
        },
        relatedRecords: {
          questions: questions.filter((question) => question.studentId === student.uid || question.studentId === student.id),
          announcements: announcements.filter((announcement) => Array.isArray(announcement.responses) && announcement.responses.some((response) => response.studentId === student.uid || response.studentId === student.id)),
          aiInterest: aiInterests.find((interest) => interest.studentId === student.uid || interest.id === student.uid || interest.id === student.id) || null,
          publicVerification: publicVerifications.find((verification) => verification.rollNo === student.rollNo) || null,
        },
      }));

      const backupPayload = {
        backupType: "full-portal-export",
        exportedAt: new Date().toISOString(),
        exportedBy: user?.email || user?.uid || "admin",
        portalVersion: "portal-v1",
        collections: {
          students: {
            count: studentRecords.length,
            records: studentRecords,
          },
          courseLectures: {
            count: lectures.length,
            records: lectures,
          },
          questions: {
            count: questions.length,
            records: questions,
          },
          announcements: {
            count: announcements.length,
            records: announcements,
          },
          aiCourseInterest: {
            count: aiInterests.length,
            records: aiInterests,
          },
          publicStudentVerifications: {
            count: publicVerifications.length,
            records: publicVerifications,
          },
          metadata: {
            count: counterSnapshot?.exists?.() ? 1 : 0,
            records: counterSnapshot?.exists?.() ? [{ id: counterSnapshot.id, ...counterData }] : [],
          },
        },
      };

      const backupStamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupFileName = `hmt-portal-full-backup-${backupStamp}.json`;
      const studentsCsvHeader = [
        "uid",
        "rollNo",
        "name",
        "email",
        "phoneNumber",
        "city",
        "fatherName",
        "education",
        "deviceOwned",
        "accountStatus",
        "createdAt",
        "updatedAt",
        "lectureProgress",
        "completedVideos",
      ];
      const studentsCsvRows = studentRecords.map((student) => [
        student.uid || "",
        student.rollNo || "",
        student.name || "",
        student.email || "",
        student.phoneNumber || "",
        student.city || "",
        student.fatherName || "",
        student.education || "",
        student.deviceOwned || "",
        student.accountStatus || "",
        student.createdAt || "",
        student.profileUpdatedAt || student.updatedAt || "",
        JSON.stringify(student.lectureProgress || {}),
        JSON.stringify(student.completedVideos || []),
      ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","));
      const studentsCsvContent = [studentsCsvHeader.join(","), ...studentsCsvRows].join("\n");
      const studentsCsvFileName = `hmt-portal-students-${backupStamp}.csv`;

      console.log("💾 Triggering downloads...");
      triggerDownload(JSON.stringify(backupPayload, null, 2), backupFileName, "application/json");
      triggerDownload(studentsCsvContent, studentsCsvFileName, "text/csv;charset=utf-8;");

      console.log("✅ Backup completed successfully!");
      setBackupLastGeneratedAt(new Date().toLocaleString());
      setBackupVerified(true);
      alert("Full backup generated successfully. The JSON and CSV exports have been downloaded.");
    } catch (err) {
      console.error("❌ BACKUP GENERATION ERROR:", {
        message: err?.message,
        code: err?.code,
        name: err?.name,
        fullError: err,
        stack: err?.stack,
      });
      setBackupVerified(false);
      alert(`Backup generation failed: ${err.message || "Unknown error"}. No data updates were performed.`);
    } finally {
      setBackupGenerating(false);
    }
  };

  const handleRegisterAiInterest = async () => {
    if (!user?.uid || aiInterestSubmitting) return;

    const existingInterest = allAiInterests.find((item) => item.studentId === user.uid || item.id === user.uid);
    if (existingInterest) {
      alert("Your AI course interest is already registered. Academy admin will contact you.");
      return;
    }

    try {
      setAiInterestSubmitting(true);
      const now = new Date().toISOString();
      await setDoc(doc(db, "aiCourseInterest", user.uid), {
        studentId: user.uid,
        studentName: user.name || "Student",
        studentRollNo: user.rollNo || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        city: user.city || "",
        education: user.education || "",
        courseTitle: NEXT_COURSE.title,
        contacted: false,
        createdAt: now,
        updatedAt: now,
      });
      alert("Your interest for the AI course has been registered.");
    } catch (err) {
      alert("Could not register AI course interest: " + err.message);
    } finally {
      setAiInterestSubmitting(false);
    }
  };

  const handleAiInterestContacted = async (interest, contacted) => {
    if (!isAdmin || !interest?.id) return;

    try {
      await updateDoc(doc(db, "aiCourseInterest", interest.id), {
        contacted,
        contactedAt: contacted ? new Date().toISOString() : "",
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      alert("Could not update AI course interest: " + err.message);
    }
  };

  const getAuthErrorMessage = (err) => {
    const errorMessages = {
      "auth/email-already-in-use": "An account already exists with this email address. Please sign in instead or use Forgot Password.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/invalid-credential": "The email address or password is incorrect. Please try again or use Forgot Password.",
      "auth/user-not-found": "No account was found with this email address. Please create an account first.",
      "auth/wrong-password": "The password is incorrect. Please try again or use Forgot Password.",
      "auth/weak-password": "Your password is too weak. Use at least 8 characters with uppercase, lowercase, and a number.",
      "auth/too-many-requests": "Too many attempts were made. Please wait a few minutes, then try again or reset your password.",
      "auth/network-request-failed": "We could not connect to the internet. Please check your connection and try again.",
    };

    return errorMessages[err?.code] || "We could not complete your request. Please try again. If the problem continues, contact HMT Success Academy.";
  };

  const showAuthError = (message) => {
    setError(message);
    if (typeof window !== "undefined") window.alert(message);
  };

  const handleResetPassword = async () => {
    if (!email) {
      showAuthError("Please enter your email first, then click Forgot Password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Please check your inbox.");
    } catch (err) {
      showAuthError(getAuthErrorMessage(err));
    }
  };

  const handleSubmit = async (e, submitMode = isSignUp) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (submitMode) {
        // === VALIDATION FOR SIGN UP ===
        // Validate email format
        if (!validateEmail(email)) {
          showAuthError("Please enter a valid email address (e.g., student@example.com)");
          setLoading(false);
          return;
        }

        // Validate name
        if (!validateName(fullName)) {
          showAuthError("Full name must be at least 3 characters long");
          setLoading(false);
          return;
        }

        // Validate father's name
        if (!validateName(fatherName)) {
          showAuthError("Father's name must be at least 3 characters long");
          setLoading(false);
          return;
        }

        // Validate phone number
        if (!validatePhone(phone)) {
          showAuthError("Please enter a valid phone number (at least 10 digits)");
          setLoading(false);
          return;
        }

        // Validate city
        if (!city || city.trim().length < 2) {
          showAuthError("Please select or enter a valid city name");
          setLoading(false);
          return;
        }

        // Validate date of birth
        if (dob && !validateDateOfBirth(dob)) {
          showAuthError("Please enter a valid date of birth (you must be at least 10 years old)");
          setLoading(false);
          return;
        }

        // Validate education level
        if (!education || education.trim().length === 0) {
          showAuthError("Please select your education level");
          setLoading(false);
          return;
        }

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
          showAuthError(passwordValidation.errors.join("\n"));
          setLoading(false);
          return;
        }

        // === PROCEED WITH ACCOUNT CREATION ===
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const currentUser = userCredential.user;

        let emailVerificationNotice = `A verification email has been sent to ${email}. Please verify your email before signing in.`;

        // Send email verification after signup
        try {
          await sendEmailVerification(currentUser);
        } catch (verifyErr) {
          console.warn("Could not send verification email:", verifyErr);
          emailVerificationNotice = "Your account was created, but we could not send the verification email. Please use Forgot Password to request an email, or contact HMT Success Academy for help.";
        }

        const counterRef = doc(db, "metadata", "student_counter");
        let nextSequence = 1;

        await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          if (counterDoc.exists()) {
            nextSequence = counterDoc.data().currentCount + 1;
            transaction.update(counterRef, { currentCount: nextSequence });
          } else {
            transaction.set(counterRef, { currentCount: 1 });
          }
        });

        const rollNo = `C-26-HMT${String(nextSequence).padStart(3, "0")}`;

        let photoURL = "";
        let photoDataURL = "";
        if (profilePhotoFile) {
          const savedPhoto = await saveStudentPhoto(
            profilePhotoFile,
            `profilePhotos/${currentUser.uid}/${Date.now()}-${profilePhotoFile.name}`
          );
          photoURL = savedPhoto.photoURL;
          photoDataURL = savedPhoto.photoDataURL;
        }

        const studentData = {
          uid: currentUser.uid,
          rollNo,
          name: fullName,
          fatherName,
          email,
          dateOfBirth: dob,
          education,
          phoneNumber: phone,
          city,
          deviceOwned: device,
          heardFrom: heardAboutUs,
          photoURL,
          photoDataURL,
          watchTimeMinutes: 0,
          completedVideos: [],
          lectureProgress: {},
          emailVerified: false,
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "students", currentUser.uid), studentData);
        await upsertPublicStudentVerification(studentData);

        alert(`Account created successfully! Roll No: ${rollNo}\n\n${emailVerificationNotice}`);
        setIsSignUp(false);
        setEmail("");
        setPassword("");
        setFullName("");
        setFatherName("");
        setDob("");
        setEducation("");
        setPhone("");
        setCity("");
        setHeardAboutUs("");
        setProfilePhotoFile(null);
      } else {
        // === SIGN IN FLOW ===
        if (!validateEmail(email)) {
          showAuthError("Please enter a valid email address");
          setLoading(false);
          return;
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const currentUser = userCredential.user;

        // Reload user to get latest email verification status
        await currentUser.reload().catch((reloadErr) => {
          console.warn("Could not reload user auth state:", reloadErr);
        });

        // Check if email is verified (skip for admin)
        if (currentUser.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase() && !currentUser.emailVerified) {
          await auth.signOut();
          showAuthError(`Your email (${currentUser.email}) has not been verified yet.\n\nPlease check your inbox for a verification email. If you don't see it, check your spam folder.\n\nA new verification email will be sent automatically.`);
          setEmail(currentUser.email);
          setLoading(false);

          // Create a way to resend verification email
          try {
            await sendEmailVerification(currentUser);
            console.log("Verification email sent to:", currentUser.email);
          } catch (err) {
            console.warn("Could not send verification email:", err);
          }

          return;
        }

        await currentUser.getIdToken(true).catch((tokenErr) => {
          console.warn("Could not refresh Firebase auth token after login.", tokenErr);
        });

        if (currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          setUser(buildAdminUser(currentUser));
          setActiveTab("admin");
          setAuthChecking(false);
          return;
        }

        const docRef = doc(db, "students", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.accountStatus === "deactivated" || data.accountStatus === "struckOff") {
            await auth.signOut();
            showAuthError(data.accountStatus === "struckOff" ? "Your account has been struck off by academy admin." : "Your account has been deactivated by academy admin.");
            return;
          }
          const now = new Date().toISOString();
          const visitSessionKey = `hmt-portal-visit-${currentUser.uid}`;
          const shouldCountVisit = typeof window !== "undefined" && !window.sessionStorage.getItem(visitSessionKey);
          const visitCount = (data.visitCount || 0) + (shouldCountVisit ? 1 : 0);
          if (shouldCountVisit) {
            await updateDoc(docRef, {
              visitCount,
              lastVisitedAt: now,
            });
            window.sessionStorage.setItem(visitSessionKey, "1");
          }
          setUser({
            ...data,
            visitCount,
            lastVisitedAt: shouldCountVisit ? now : data.lastVisitedAt,
            completedVideos: data.completedVideos || [],
            lectureProgress: data.lectureProgress || {},
            rollNo: data.rollNo || "C-26-HMT000",
          });
          if (currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            setActiveTab("admin");
          }
          setAuthChecking(false);
        } else {
          showAuthError("Your student profile could not be found. Please contact HMT Success Academy for help.");
          setAuthChecking(false);
        }
      }
    } catch (err) {
      showAuthError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const openProfileEditor = () => {
    if (isAdmin) return;
    setEditName(user?.name || "");
    setEditFatherName(user?.fatherName || "");
    setEditPhone(user?.phoneNumber || "");
    setEditCity(user?.city || "");
    setEditEducation(user?.education || "");
    setEditDevice(user?.deviceOwned || "Mobile");
    setEditPhotoFile(null);
    setNewPassword("");
    setShowProfileModal(true);
  };

  const handleUpdateProfile = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (!user?.uid || isAdmin) return;
    setLoading(true);
    setProfileSaveMessage("Saving profile...");

    try {
      let newPhotoURL = user.photoURL || "";
      let newPhotoDataURL = user.photoDataURL || "";
      if (editPhotoFile) {
        setProfileSaveMessage("Saving selected photo...");
        const savedPhoto = await saveStudentPhoto(
          editPhotoFile,
          `profilePhotos/${user.uid}/${Date.now()}-${editPhotoFile.name}`
        );
        newPhotoURL = savedPhoto.photoURL || newPhotoURL;
        newPhotoDataURL = savedPhoto.photoDataURL || newPhotoDataURL;
        setProfileSaveMessage(savedPhoto.photoURL ? "Photo uploaded and saved." : "Photo saved to profile.");
      }

      const updates = {
        name: editName,
        fatherName: editFatherName,
        phoneNumber: editPhone,
        city: editCity,
        education: editEducation,
        deviceOwned: editDevice,
        photoURL: newPhotoURL,
        photoDataURL: newPhotoDataURL,
        profileUpdatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, "students", user.uid), updates);
      await upsertPublicStudentVerification(user, updates);
      safeUpdateUser(updates);
      setProfileSaveMessage("Saved successfully.");
      setShowProfileModal(false);
      fetchStudents();
    } catch (err) {
      setProfileSaveMessage("");
      alert("Profile update error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (isAdmin) {
      alert("The HMT Admin profile is locked. Use Firebase Authentication administration to change this account.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setNewPassword("");
        alert("Password changed successfully.");
      }
    } catch (err) {
      alert("Please logout and login again before changing password. Error: " + err.message);
    }
  };

  const handleUploadWork = async () => {
    if (!selectedFile) {
      alert("Please select your homework file.");
      return;
    }

    setUploading(true);
    try {
      const filePath = `assignments/${user.uid}/lecture-${activeVideo.id}/${Date.now()}-${selectedFile.name}`;
      let downloadURL = "";
      let uploadError = "";

      try {
        downloadURL = await withTimeout(
          uploadFileAndGetURL(selectedFile, filePath),
          15000,
          "Storage upload timed out"
        );
      } catch (err) {
        uploadError = err.message || "Storage upload failed";
        console.warn("Homework file upload failed; saving homework submission record.", err);
      }

      await saveLectureProgress(activeVideo.id, {
        homeworkDone: true,
        homeworkApproved: false,
        homeworkRejected: false,
        homeworkFeedback: "",
        homeworkReviewedAt: "",
        homeworkFileName: selectedFile.name,
        homeworkFileURL: downloadURL,
        homeworkUploadError: uploadError,
        homeworkNeedsManualReview: Boolean(uploadError),
        homeworkUploadedAt: new Date().toISOString(),
      });

      alert(downloadURL ? "Homework uploaded successfully! Pending admin evaluation." : "Homework submission saved. File upload needs manual review.");
      setSelectedFile(null);
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!watchDone || isLectureDone) return;
    setUpdatingVideo(true);

    try {
      const newMinutes = (user.watchTimeMinutes || 0) + Math.ceil(videoTotalSeconds / 60);
      const updatedLectureProgress = {
        ...(user.lectureProgress || {}),
        [activeVideo.id]: {
          ...(user.lectureProgress?.[activeVideo.id] || {}),
          watchDone: true,
          completed: true,
          completedAt: new Date().toISOString(),
        },
      };

      await updateDoc(doc(db, "students", user.uid), {
        watchTimeMinutes: newMinutes,
        completedVideos: arrayUnion(activeVideo.id),
        lectureProgress: updatedLectureProgress,
      });

      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          watchTimeMinutes: newMinutes,
          completedVideos: [...new Set([...(prev.completedVideos || []), activeVideo.id])],
          lectureProgress: updatedLectureProgress,
        };
      });

      alert("Lecture marked as completed successfully.");
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingVideo(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!studentQuestionText.trim()) return;
    try {
      // Sanitize question text to prevent XSS attacks
      const sanitizedQuestion = sanitizeInput(studentQuestionText);

      await addDoc(collection(db, "questions"), {
        studentId: user.uid,
        studentName: user.name,
        studentRollNo: user.rollNo,
        lectureTitle: activeVideo.title,
        question: sanitizedQuestion,
        reply: "",
        createdAt: new Date().toISOString(),
      });
      setStudentQuestionText("");
      setShowQuestionModal(false);
      alert("Your question has been sent to the admin panel!");
    } catch (err) {
      alert("Error sending question: " + err.message);
    }
  };

  const handlePostAnnouncement = async () => {
    if (!requireBackupBeforeAdminMutation("post announcements")) return;

    if (!isAdmin) {
      alert("Only academy admin can post announcements.");
      return;
    }

    if (postingAnnouncement) return;

    if (!announcementTitle.trim() || !announcementText.trim()) {
      alert("Please add both announcement title and message.");
      return;
    }

    try {
      setPostingAnnouncement(true);
      let imageURL = "";
      let imageDataURL = "";
      let imageFileName = "";
      let imageUploadError = "";

      if (announcementImageFile) {
        imageFileName = announcementImageFile.name;
        imageDataURL = await resizeImageToDataURL(announcementImageFile, 1200, 0.82);

        try {
          imageURL = await withTimeout(
            uploadFileAndGetURL(
              announcementImageFile,
              `announcements/${Date.now()}-${announcementImageFile.name}`
            ),
            12000,
            "Storage upload timed out"
          );
        } catch (uploadErr) {
          imageUploadError = uploadErr.message || "Storage upload failed";
          console.warn("Announcement image Storage upload failed; saved Firestore image fallback.", uploadErr);
        }
      }

      // Sanitize announcement title and message to prevent XSS attacks
      const sanitizedTitle = sanitizeInput(announcementTitle.trim());
      const sanitizedMessage = sanitizeInput(announcementText.trim());

      const announcementData = {
        title: sanitizedTitle,
        message: sanitizedMessage,
        imageURL,
        imageDataURL,
        imageFileName,
        imageUploadError,
        authorName: user?.name || "HMT Admin",
        authorEmail: user?.email || ADMIN_EMAIL,
        createdAt: new Date().toISOString(),
      };

      if (editingAnnouncementId) {
        const existingAnnouncement = allAnnouncements.find((item) => item.id === editingAnnouncementId);
        await updateDoc(doc(db, "announcements", editingAnnouncementId), {
          title: sanitizedTitle,
          message: sanitizedMessage,
          ...(announcementImageFile
            ? {
                imageURL,
                imageDataURL,
                imageFileName,
                imageUploadError,
              }
            : {
                imageURL: existingAnnouncement?.imageURL || "",
                imageDataURL: existingAnnouncement?.imageDataURL || "",
                imageFileName: existingAnnouncement?.imageFileName || "",
                imageUploadError: existingAnnouncement?.imageUploadError || "",
              }),
          updatedAt: new Date().toISOString(),
        });
      } else {
        await addDoc(collection(db, "announcements"), announcementData);
      }

      setAnnouncementTitle("");
      setAnnouncementText("");
      setAnnouncementImageFile(null);
      setEditingAnnouncementId("");
      setShowAnnouncementModal(false);
      alert(editingAnnouncementId ? "Announcement updated for students." : imageUploadError ? "Announcement posted. Image was saved with local fallback because Storage upload failed." : "Announcement posted to student portal.");
    } catch (err) {
      alert("Could not post announcement: " + err.message);
    } finally {
      setPostingAnnouncement(false);
    }
  };

  const handleEditAnnouncement = (announcement) => {
    if (!isAdmin) return;
    setEditingAnnouncementId(announcement.id);
    setAnnouncementTitle(announcement.title || "");
    setAnnouncementText(announcement.message || "");
    setAnnouncementImageFile(null);
    setShowAnnouncementModal(true);
  };

  const handleDeleteAnnouncement = async (announcement) => {
    if (!isAdmin || !announcement?.id) return;
    if (!requireBackupBeforeAdminMutation("delete announcements")) return;
    if (!window.confirm(`Delete "${announcement.title || "this announcement"}" for all students?`)) return;

    try {
      await deleteDoc(doc(db, "announcements", announcement.id));
      alert("Announcement deleted for all students.");
    } catch (err) {
      alert("Could not delete announcement: " + err.message);
    }
  };

  const handleAnnouncementResponse = async (announcementId) => {
    const responseText = (announcementResponseTexts[announcementId] || "").trim();
    if (!responseText) return;

    try {
      // Sanitize response text to prevent XSS attacks
      const sanitizedResponse = sanitizeInput(responseText);

      await updateDoc(doc(db, "announcements", announcementId), {
        responses: arrayUnion({
          studentId: user.uid,
          studentName: user.name || "Student",
          studentRollNo: user.rollNo || "",
          text: sanitizedResponse,
          createdAt: new Date().toISOString(),
        }),
      });
      setAnnouncementResponseTexts((prev) => ({ ...prev, [announcementId]: "" }));
    } catch (err) {
      alert("Could not post response: " + err.message);
    }
  };

  const handleEditLecture = (lecture) => {
    setEditingLectureId(lecture.id);
    setLectureForm({
      title: lecture.title || "",
      videoId: lecture.videoId || "",
      duration: String(lecture.duration || ""),
      notes: lecture.notes || "",
      assignment: lecture.assignment || "",
    });
    setAdminSubTab("lectures");
  };

  const handleSaveLecture = async () => {
    if (!requireBackupBeforeAdminMutation("save lectures")) return;

    if (!isAdmin) {
      alert("Only academy admin can manage lectures.");
      return;
    }

    const title = lectureForm.title.trim();
    const videoId = extractYouTubeVideoId(lectureForm.videoId);
    const duration = Number(lectureForm.duration);

    if (!title || !videoId || !duration) {
      alert("Please add lecture title, YouTube video id/link, and duration in minutes.");
      return;
    }

    try {
      setLectureSaving(true);
      const lectureId = editingLectureId || `lecture-${Date.now()}`;
      const currentLecture = courseVideos.find((lecture) => lecture.id === lectureId);
      const maxOrder = courseVideos.reduce((max, lecture) => Math.max(max, Number(lecture.order) || 0), 0);

      await setDoc(doc(db, "courseLectures", lectureId), {
        id: lectureId,
        title,
        videoId,
        duration,
        notes: lectureForm.notes.trim(),
        assignment: lectureForm.assignment.trim() || "Upload your completed practice work for this lecture.",
        quiz: currentLecture?.quiz || GENERAL_LECTURE_QUIZ,
        order: currentLecture?.order || maxOrder + 1,
        published: true,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || ADMIN_EMAIL,
      });

      resetLectureForm();
      alert(editingLectureId ? "Lecture updated successfully." : "Lecture added successfully.");
    } catch (err) {
      alert("Could not save lecture: " + err.message);
    } finally {
      setLectureSaving(false);
    }
  };

  const handleUploadPracticeFile = async () => {
    if (!requireBackupBeforeAdminMutation("upload practice materials")) return;

    if (!isAdmin) {
      alert("Only academy admin can distribute practice materials.");
      return;
    }

    if (!practiceLectureId || !practiceFile) {
      alert("Please select a target lecture and choose a practice file.");
      return;
    }

    const targetLecture = courseVideos.find((lecture) => lecture.id === practiceLectureId);
    if (!targetLecture) {
      alert("Selected lecture could not be found.");
      return;
    }

    try {
      setPracticeUploading(true);
      const safeName = practiceFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const fileRef = ref(storage, `practice-materials/${practiceLectureId}/${Date.now()}-${safeName}`);
      await uploadBytes(fileRef, practiceFile);
      const downloadURL = await getDownloadURL(fileRef);
      const now = new Date().toISOString();

      await setDoc(
        doc(db, "courseLectures", practiceLectureId),
        {
          ...targetLecture,
          id: practiceLectureId,
          videoId: extractYouTubeVideoId(targetLecture.videoId),
          duration: Number(targetLecture.duration) || 30,
          quiz: targetLecture.quiz || GENERAL_LECTURE_QUIZ,
          practiceFileURL: downloadURL,
          practiceFileName: practiceFile.name,
          practiceFileType: practiceFile.type || "application/octet-stream",
          practiceFileUpdatedAt: now,
          practiceFileUpdatedBy: user?.email || ADMIN_EMAIL,
          published: targetLecture.published !== false,
          updatedAt: now,
          updatedBy: user?.email || ADMIN_EMAIL,
        },
        { merge: true }
      );

      setPracticeFile(null);
      alert("Practice material uploaded. Students will now see the download alert on this lecture.");
    } catch (err) {
      alert("Could not upload practice material: " + err.message);
    } finally {
      setPracticeUploading(false);
    }
  };

  const handleAddCoursePlaylist = async () => {
    if (!isAdmin) {
      alert("Only academy admin can add course playlists.");
      return;
    }

    const trimmedName = newCourseName.trim();
    const trimmedUrl = newCoursePlaylistUrl.trim();
    if (!trimmedName || !trimmedUrl) {
      alert("Please add a course name and YouTube playlist link.");
      return;
    }

    const playlistId = extractPlaylistIdFromUrl(trimmedUrl);
    if (!playlistId) {
      alert("Please use a valid YouTube playlist URL.");
      return;
    }

    try {
      setCourseSaving(true);
      const response = await fetch(`/api/youtube-playlist?playlistId=${encodeURIComponent(playlistId)}`, { cache: "no-store" });
      const data = await response.json();
      const fetchedVideos = Array.isArray(data?.videos) ? data.videos : [];

      if (!fetchedVideos.length) {
        alert("No videos were found for that playlist. Please check the YouTube link.");
        return;
      }

      const courseId = `course-${Date.now()}`;
      const courseEntry = {
        id: courseId,
        name: trimmedName,
        playlistId,
        playlistUrl: trimmedUrl,
        createdAt: new Date().toISOString(),
      };

      const normalizedCourseVideos = normalizeLectures(fetchedVideos).map((video, index) => ({
        ...video,
        id: makeCourseLectureId(courseId, video.videoId || index + 1),
        courseId,
        courseName: trimmedName,
        playlistUrl: trimmedUrl,
      }));

      setCourseCatalog((prev) => {
        const existingDefault = prev.some((course) => course.id === "default-course");
        const nextCatalog = [...prev, courseEntry];
        return existingDefault ? nextCatalog : [DEFAULT_COURSE, ...nextCatalog];
      });
      setSelectedCourseId((current) => current || DEFAULT_COURSE.id);
      setCourseVideos((prev) => prev.length ? prev : normalizedCourseVideos);
      setActiveVideo((current) => current || normalizedCourseVideos[0] || HMT_PLAYLIST[0]);
      setNewCourseName("");
      setNewCoursePlaylistUrl("");
      alert(`${trimmedName} course added successfully.`);
    } catch (err) {
      alert("Could not load playlist for this course: " + err.message);
    } finally {
      setCourseSaving(false);
    }
  };

  const handleImportCurrentLectures = async () => {
    if (!requireBackupBeforeAdminMutation("import lectures")) return;

    if (!isAdmin) {
      alert("Only academy admin can import lectures.");
      return;
    }

    if (!confirm("Import the current course playlist into the editable lecture manager?")) return;

    try {
      setLectureSaving(true);
      await Promise.all(
        courseVideos.map((lecture, index) =>
          setDoc(doc(db, "courseLectures", lecture.id), {
            ...lecture,
            id: lecture.id,
            videoId: extractYouTubeVideoId(lecture.videoId),
            duration: Number(lecture.duration) || 30,
            assignment: lecture.assignment || "Upload your completed practice work for this lecture.",
            quiz: lecture.quiz || GENERAL_LECTURE_QUIZ,
            order: Number(lecture.order) || index + 1,
            published: lecture.published !== false,
            updatedAt: new Date().toISOString(),
            updatedBy: user?.email || ADMIN_EMAIL,
          })
        )
      );
      alert("Current playlist imported. You can edit these lectures now.");
    } catch (err) {
      alert("Could not import lectures: " + err.message);
    } finally {
      setLectureSaving(false);
    }
  };

  const handleDeleteLecture = async (lecture) => {
    if (!requireBackupBeforeAdminMutation("delete lectures")) return;

    if (!isAdmin) {
      alert("Only academy admin can delete lectures.");
      return;
    }

    if (!confirm(`Delete "${lecture.title}" from the course? Student progress for this lecture will no longer show in the active course list.`)) return;

    try {
      await deleteDoc(doc(db, "courseLectures", lecture.id));
      if (editingLectureId === lecture.id) resetLectureForm();
      alert("Lecture deleted successfully.");
    } catch (err) {
      alert("Could not delete lecture: " + err.message);
    }
  };

  const handleInstallPortal = async () => {
    if (!deferredInstallPrompt) {
      setShowInstallHelp(true);
      return;
    }

    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    setDeferredInstallPrompt(null);
  };

  const handleEvaluateAssignment = async (studentId, videoId, status) => {
    if (!requireBackupBeforeAdminMutation("evaluate assignments")) return;

    try {
      const studentRef = doc(db, "students", studentId);
      const docSnap = await getDoc(studentRef);
      if (!docSnap.exists()) return;

      const currentProgress = docSnap.data().lectureProgress || {};
      const targetLecture = currentProgress[videoId] || {};
      const feedbackKey = `${studentId}-${videoId}`;
      const feedback = (adminFeedbackTexts[feedbackKey] || "").trim();
      const now = new Date().toISOString();

      if (status === "approve") {
        targetLecture.homeworkApproved = true;
        targetLecture.homeworkRejected = false;
        targetLecture.homeworkFeedback = feedback || "Approved by academy instructor.";
      } else {
        targetLecture.homeworkApproved = false;
        targetLecture.homeworkRejected = true;
        targetLecture.homeworkDone = false;
        targetLecture.homeworkFeedback = feedback || "Please review the assignment instructions and upload the corrected file.";
      }
      targetLecture.homeworkReviewedAt = now;

      currentProgress[videoId] = targetLecture;
      await updateDoc(studentRef, { lectureProgress: currentProgress });
      setAdminAssignmentStudent((prev) => prev && prev.uid === studentId
        ? { ...prev, lectureProgress: currentProgress }
        : prev);
      setAdminFeedbackTexts((prev) => ({ ...prev, [feedbackKey]: "" }));
      alert(`Assignment successfully ${status === "approve" ? "Approved" : "Rejected and sent back"}.`);
      fetchStudents();
    } catch (err) {
      alert("Error checking assignment: " + err.message);
    }
  };

  const handleManualLectureCompletion = async (studentId, lecture) => {
    if (!requireBackupBeforeAdminMutation("manually mark lectures complete")) return;

    const savingKey = `${studentId}-${lecture.id}`;
    setManualCompletionSaving(savingKey);

    try {
      const studentRef = doc(db, "students", studentId);
      const docSnap = await getDoc(studentRef);
      if (!docSnap.exists()) return;

      const studentData = docSnap.data();
      const currentProgress = studentData.lectureProgress || {};
      const existingProgress = getLectureProgress(currentProgress, lecture);
      const now = new Date().toISOString();
      const updatedLectureProgress = {
        ...currentProgress,
        [lecture.id]: {
          ...existingProgress,
          watchDone: true,
          completed: true,
          completedAt: existingProgress.completedAt || now,
          manuallyCompleted: true,
          manuallyCompletedAt: now,
          manuallyCompletedBy: user?.email || ADMIN_EMAIL,
        },
      };

      await updateDoc(studentRef, {
        completedVideos: arrayUnion(lecture.id),
        lectureProgress: updatedLectureProgress,
      });

      setAdminAssignmentStudent((prev) => prev ? {
        ...prev,
        completedVideos: [...new Set([...(prev.completedVideos || []), lecture.id])],
        lectureProgress: updatedLectureProgress,
      } : prev);
      await fetchStudents();
      alert(`${lecture.title} was manually marked complete for ${studentData.name || "the student"}.`);
    } catch (err) {
      alert("Could not mark lecture complete: " + err.message);
    } finally {
      setManualCompletionSaving("");
    }
  };

  const handleAdminPasswordReset = async (studentEmail) => {
    if (!studentEmail) {
      alert("This student does not have an email saved.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, studentEmail);
      alert(`Password reset email sent to ${studentEmail}.`);
    } catch (err) {
      alert("Could not send password reset: " + err.message);
    }
  };

  const handleAdminReply = async (qId) => {
    if (!requireBackupBeforeAdminMutation("reply to forum questions")) return;

    const replyText = adminReplyTexts[qId];
    if (!replyText || !replyText.trim()) return;

    try {
      await updateDoc(doc(db, "questions", qId), {
        reply: replyText,
        repliedAt: new Date().toISOString(),
      });
      alert("Reply posted successfully!");
      setAdminReplyTexts(prev => ({ ...prev, [qId]: "" }));
    } catch (err) {
      alert("Error updating question reply: " + err.message);
    }
  };

  const handleStudentStatus = async (student, status) => {
    if (!requireBackupBeforeAdminMutation("update student status")) return;
    if (!student?.uid) return;

    try {
      const statusLabels = {
        active: "Active",
        deactivated: "Deactivated",
        struckOff: "Struck off",
      };
      const updated = {
        accountStatus: status,
        statusUpdatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, "students", student.uid), updated);
      await upsertPublicStudentVerification(student, updated);
      setAllStudents((prev) => prev.map((item) => (item.uid === student.uid ? { ...item, ...updated } : item)));
      alert(`${student.name || "Student"} marked as ${statusLabels[status] || status}.`);
    } catch (err) {
      alert("Could not update student status: " + err.message);
    }
  };

  const handleDeleteStudent = async (student) => {
    if (!requireBackupBeforeAdminMutation("delete student records")) return;
    if (!student?.uid) return;
    const confirmed = window.confirm(`Delete ${student.name || "this student"} from the portal database? This will remove their Firestore student record.`);
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "students", student.uid));
      await deletePublicStudentVerification(student.rollNo);
      setAllStudents((prev) => prev.filter((item) => item.uid !== student.uid));
      setTotalStudents((prev) => Math.max(0, prev - 1));
      alert("Student record deleted from portal database.");
    } catch (err) {
      alert("Could not delete student: " + err.message);
    }
  };

  const handleSyncVerificationRecords = async () => {
    if (!requireBackupBeforeAdminMutation("sync verification records")) return;
    if (!isAdmin || syncingVerificationRecords) return;

    try {
      setSyncingVerificationRecords(true);
      const freshStudents = await fetchStudents();
      if (!freshStudents) {
        alert("Student list could not load. Please check the admin permission message on the dashboard.");
        return;
      }
      const studentsToSync = freshStudents.filter((student) => student.uid && student.rollNo);
      await Promise.all(studentsToSync.map((student) => upsertPublicStudentVerification(student)));
      alert(`Verification records synced for ${studentsToSync.length} students.`);
    } catch (err) {
      alert("Could not sync verification records: " + err.message);
    } finally {
      setSyncingVerificationRecords(false);
    }
  };

  const getStudentLectureStats = (student) => {
    const lp = student?.lectureProgress || {};
    const completed = courseVideos.filter((video) => {
      return isLectureCompleted(lp, student?.completedVideos || [], video);
    }).length;
    const submitted = courseVideos.filter((video) => {
      const progress = lp[video.id] || {};
      return progress.homeworkDone || progress.homeworkFileURL || progress.homeworkNeedsManualReview;
    }).length;
    const pendingReview = courseVideos.filter((video) => {
      const progress = lp[video.id] || {};
      return (progress.homeworkDone || progress.homeworkFileURL || progress.homeworkNeedsManualReview) && !progress.homeworkApproved && !progress.homeworkRejected;
    }).length;
    const approved = courseVideos.filter((video) => lp[video.id]?.homeworkApproved).length;
    const rejected = courseVideos.filter((video) => lp[video.id]?.homeworkRejected).length;

    return { completed, submitted, pendingReview, approved, rejected };
  };

  const adminStats = allStudents.reduce(
    (stats, student) => {
      const studentStats = getStudentLectureStats(student);
      const progressRate = courseVideos.length ? Math.round((studentStats.completed / courseVideos.length) * 100) : 0;

      return {
        totalStudents: stats.totalStudents + 1,
        activeStudents: stats.activeStudents + (studentStats.completed > 0 || studentStats.submitted > 0 ? 1 : 0),
        completedStudents: stats.completedStudents + (studentStats.completed >= courseVideos.length && courseVideos.length > 0 ? 1 : 0),
        pendingAssignments: stats.pendingAssignments + studentStats.pendingReview,
        approvedAssignments: stats.approvedAssignments + studentStats.approved,
        rejectedAssignments: stats.rejectedAssignments + studentStats.rejected,
        totalProgress: stats.totalProgress + progressRate,
      };
    },
    {
      totalStudents: 0,
      activeStudents: 0,
      completedStudents: 0,
      pendingAssignments: 0,
      approvedAssignments: 0,
      rejectedAssignments: 0,
      totalProgress: 0,
    }
  );
  const averageProgress = adminStats.totalStudents ? Math.round(adminStats.totalProgress / adminStats.totalStudents) : 0;
  const unansweredQuestions = allQuestions.filter((q) => !q.reply).length;

  const normalizeCityName = (city) => (city || "").trim().replace(/\s+/g, " ");
  const formatCityName = (city) => {
    const trimmed = normalizeCityName(city);
    if (!trimmed) return "";
    return trimmed
      .toLowerCase()
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const cityMap = new Map();
  allStudents.forEach((student) => {
    const rawCity = normalizeCityName(student.city);
    if (!rawCity) return;

    const key = rawCity.toLowerCase();
    const formattedCity = formatCityName(rawCity);

    if (!cityMap.has(key)) {
      cityMap.set(key, { city: formattedCity, count: 0 });
    }

    cityMap.get(key).count += 1;
  });

  const uniqueCities = [...cityMap.values()].map((item) => item.city).sort((a, b) => a.localeCompare(b));
  const cityStats = [...cityMap.values()].sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));
  const inactiveStudents = allStudents.filter((student) => student.accountStatus === "deactivated").length;
  const struckOffStudents = allStudents.filter((student) => student.accountStatus === "struckOff").length;
  const studentQuestions = allQuestions.filter((q) => q.studentId === user?.uid);
  const currentAiInterest = allAiInterests.find((item) => item.studentId === user?.uid || item.id === user?.uid);
  const pendingAiInterests = allAiInterests.filter((item) => !item.contacted).length;
  const unreadAnnouncements = allAnnouncements.filter((announcement) => !readAnnouncementIds.includes(announcement.id));
  const studentNotifications = [
    ...unreadAnnouncements.slice(0, 3).map((announcement) => ({
      id: announcement.id,
      tone: "amber",
      title: announcement.title || "New academy announcement",
      text: announcement.message || "A new update has been posted by HMT Success Academy.",
    })),
    currentProgress.homeworkRejected && {
      tone: "red",
      title: "Assignment needs revision",
      text: currentProgress.homeworkFeedback || "Please upload the corrected assignment file.",
    },
    currentProgress.homeworkApproved && {
      tone: "green",
      title: "Assignment approved",
      text: currentProgress.homeworkFeedback || "Your instructor has approved this lecture assignment.",
    },
    studentQuestions.some((q) => q.reply) && {
      tone: "blue",
      title: "Admin replied",
      text: "A response is available in your forum questions section.",
    },
    canMarkLectureDone && {
      tone: "green",
      title: "Ready to finalize",
      text: "You watched the required 60%. You can now mark this lecture as completed.",
    },
    !canClaimCertificate && !CERTIFICATES_RELEASED && isCourseFullyCompleted && {
      tone: "amber",
      title: "Certificate waiting for release",
      text: "Your course is complete. Certificate release is controlled by academy admin.",
    },
  ].filter(Boolean);

  const filteredStudents = allStudents
    .filter((s) => {
      const query = searchQuery.toLowerCase();
      const studentStats = getStudentLectureStats(s);
      const matchesFilter =
        adminFilter === "all" ||
        (adminFilter === "pending" && studentStats.pendingReview > 0) ||
        (adminFilter === "completed" && studentStats.completed >= courseVideos.length && courseVideos.length > 0) ||
        (adminFilter === "rejected" && studentStats.rejected > 0) ||
        (adminFilter === "active" && (studentStats.completed > 0 || studentStats.submitted > 0)) ||
        (adminFilter === "deactivated" && s.accountStatus === "deactivated") ||
        (adminFilter === "struckOff" && s.accountStatus === "struckOff");
      const matchesCity = cityFilter === "all" || normalizeCityName(s.city).toLowerCase() === normalizeCityName(cityFilter).toLowerCase();

      return matchesFilter && matchesCity && (
        (s.name || "").toLowerCase().includes(query) ||
        (s.rollNo || "").toLowerCase().includes(query) ||
        (s.city || "").toLowerCase().includes(query) ||
        (s.email || "").toLowerCase().includes(query) ||
        (s.phoneNumber || "").toLowerCase().includes(query)
      );
    })
    .sort((a, b) => getStudentSortTime(b) - getStudentSortTime(a));


  // ==================== VIEW 1: LOGGED IN PORTAL VIEW ====================
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#eef6ff_0%,#f8fbff_45%,#fff7ed_100%)] flex items-center justify-center p-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(portalStructuredData) }}
        />
        <div className="w-full max-w-sm rounded-3xl border border-white/80 bg-white/90 p-6 text-center shadow-2xl shadow-blue-950/10 backdrop-blur">
          <img src={HMT_LOGO} alt="HMT Success Academy" className="mx-auto h-20 w-20 object-contain" />
          <h1 className="mt-4 text-2xl font-black text-slate-950">HMT Success Academy</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">Restoring your saved portal session...</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-amber-400" />
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#eef6ff_0%,#f8fbff_42%,#fff7ed_100%)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(portalStructuredData) }}
        />
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white px-4 py-5 shadow-xl shadow-blue-950/20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={HMT_LOGO} alt="HMT" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
              <div>
                <h1 className="text-lg md:text-2xl font-black">HMT Success Academy</h1>
                <p className="text-xs text-blue-100">{isAdmin ? "Professional Student Learning Portal" : `Welcome back, ${user.name || "Student"}`}</p>
              </div>
            </div>

            <div className="portal-action-grid">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "admin" ? "dashboard" : "admin")}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] md:text-xs font-black px-3 py-2 rounded-xl transition"
                >
                  {activeTab === "admin" ? "◀ Portal View" : "🛠️ Admin Panel"}
                </button>
              )}

              {isAdmin ? (
                <span className="inline-flex items-center justify-center rounded-xl border border-amber-300/40 bg-amber-400/15 px-3 py-2 text-[11px] font-black text-amber-200 md:text-xs">
                  {isOwner ? "👑 Master Owner Account" : "🛡️ Verified Admin Account"}
                </span>
              ) : (
                <button type="button" onClick={openProfileEditor} className="bg-white/10 hover:bg-white/20 text-white text-[11px] md:text-xs font-bold px-3 py-2 rounded-xl transition">
                  Edit Profile
                </button>
              )}

              {isAdmin && (
                <button
                  type="button"
                  onClick={handleDownloadFullBackup}
                  disabled={backupGenerating}
                  className="bg-violet-600 hover:bg-violet-700 text-white text-[11px] md:text-xs font-bold px-3 py-2 rounded-xl transition disabled:bg-slate-200 disabled:text-slate-500"
                >
                  {backupGenerating ? "Preparing Backup..." : "Download Backup"}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  auth.signOut();
                  setUser(null);
                }}
                className="bg-white/10 hover:bg-white/20 text-white text-[11px] md:text-xs font-bold px-3 py-2 rounded-xl transition sm:col-span-2 md:col-span-1"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {activeTab !== "admin" && (
          <div className="lg:hidden sticky top-0 z-30 border-b border-white/70 bg-white/90 px-3 py-2 backdrop-blur">
            <div className="grid grid-cols-4 gap-1 rounded-2xl bg-slate-100 p-1">
              {[
                ["learn", "Learn"],
                ["community", "Community"],
                ["resources", "Resources"],
                ["help", "Help & Links"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStudentTab(value)}
                  className={`rounded-xl px-2 py-2 text-[11px] font-black transition ${
                    studentTab === value ? "bg-slate-950 text-white shadow" : "text-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab !== "admin" && (
          <section className="mx-auto max-w-7xl px-3 pt-4 md:px-6 md:pt-6">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0b1f3a] via-[#123c66] to-[#176b70] px-5 py-5 text-white shadow-xl shadow-cyan-950/10 md:px-7 md:py-6">
              <div className="absolute -right-12 -top-20 h-48 w-48 rounded-full border-[22px] border-amber-300/15" />
              <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">Your learning space</p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">Keep your momentum, {user.name?.split(" ")[0] || "student"}.</h2>
                  <p className="mt-1 max-w-xl text-xs font-semibold leading-relaxed text-slate-200 md:text-sm">Continue your current lecture, complete the watch requirement, and build your course progress one lesson at a time.</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex">
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                    <p className="text-[10px] font-black uppercase text-cyan-200">Progress</p>
                    <p className="mt-1 text-xl font-black text-amber-300">{progressPercent}%</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                    <p className="text-[10px] font-black uppercase text-cyan-200">Lessons done</p>
                    <p className="mt-1 text-xl font-black text-white">{completedCount}/{courseVideos.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="max-w-7xl mx-auto p-3 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          <aside className={`lg:col-span-1 space-y-4 ${activeTab !== "admin" && !["resources", "help"].includes(studentTab) ? "hidden lg:block" : ""}`}>
            <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 pb-4 pt-5 md:px-5">
              <div className="text-center flex flex-col items-center">
                <StudentAvatar user={user} size="w-20 h-20 md:w-24 md:h-24" />
                <h2 className="font-black text-gray-900 mt-3 text-base md:text-lg">{user.name}</h2>
                <p className="text-xs text-gray-500">{user.education || "Registered Student"}</p>
                <p className="text-xs font-mono text-blue-700 font-bold mt-1">{user.rollNo}</p>
              </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 p-4 sm:grid-cols-3 lg:grid-cols-1 md:p-5">
                <div className="rounded-2xl bg-blue-50 p-3">
                  <p className="text-[10px] uppercase font-bold text-blue-500">Learning Hours</p>
                  <p className="text-lg md:text-xl font-black text-blue-900">{user.watchTimeMinutes || 0} mins</p>
                </div>

                <div className="rounded-2xl bg-green-50 p-3">
                  <p className="text-[10px] uppercase font-bold text-green-600">Course Progress</p>
                  <p className="text-lg md:text-xl font-black text-green-800">{progressPercent}%</p>
                  <div className="w-full h-1.5 bg-green-200 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-green-600" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900 p-3 text-white">
                  <p className="text-[10px] uppercase font-bold text-slate-300">Total Students</p>
                  <p className="text-lg md:text-xl font-black">{totalStudents}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600 via-red-500 to-slate-950 text-white rounded-3xl shadow-md p-4 space-y-3">
              <h4 className="font-black text-xs md:text-sm tracking-wide uppercase">🎁 Complete Tasks & Win!</h4>
              <p className="text-[11px] leading-relaxed text-amber-50 opacity-95">
                Get lecture updates, practice tasks, and course announcements directly from the academy.
              </p>
              <button onClick={openYouTube} className="w-full bg-slate-950 text-white font-black py-2 rounded-xl text-xs hover:bg-slate-900 transition">
                🔔 Subscribe Channel Now
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-wide text-blue-600">Help & Links</p>
              <h3 className="mt-1 text-base font-black text-slate-900">Stay connected with HMT</h3>
              <div className="mt-3 grid gap-2">
                <button type="button" onClick={openYouTube} className="w-full rounded-xl bg-red-600 py-2.5 text-xs font-black text-white transition hover:bg-red-700">
                  YouTube Channel
                </button>
                <button type="button" onClick={openFacebook} className="w-full rounded-xl bg-blue-700 py-2.5 text-xs font-black text-white transition hover:bg-blue-800">
                  Facebook Page
                </button>
                <button type="button" onClick={openWhatsAppContact} className="w-full rounded-xl bg-green-600 py-2.5 text-xs font-black text-white transition hover:bg-green-700">
                  Contact Admin on WhatsApp
                </button>
                <button type="button" onClick={openWhatsAppChannel} className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-black text-white transition hover:bg-emerald-700">
                  WhatsApp Channel
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-200 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 p-4 text-white shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wide text-cyan-200">Next Course</p>
                  <h3 className="mt-1 text-base font-black">{NEXT_COURSE.title}</h3>
                </div>
                <span className="rounded-full bg-cyan-300 px-2.5 py-1 text-[10px] font-black text-slate-950">
                  {NEXT_COURSE.status}
                </span>
              </div>
              <p className="mt-3 text-[11px] font-semibold leading-relaxed text-slate-200">{NEXT_COURSE.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {NEXT_COURSE.topics.map((topic) => (
                  <span key={topic} className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-cyan-100">
                    {topic}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={handleRegisterAiInterest}
                disabled={Boolean(currentAiInterest) || aiInterestSubmitting}
                className="mt-4 w-full rounded-2xl bg-cyan-300 py-2.5 text-xs font-black text-slate-950 transition hover:bg-cyan-200 disabled:bg-white/20 disabled:text-cyan-100"
              >
                {aiInterestSubmitting ? "Registering..." : currentAiInterest ? "Interest Registered" : "Register Interest"}
              </button>
              {currentAiInterest && (
                <p className="mt-2 text-center text-[10px] font-bold text-cyan-100">
                  Status: {currentAiInterest.contacted ? "Admin contacted you" : "Waiting for admin contact"}
                </p>
              )}
              <button
                type="button"
                onClick={openWhatsAppContact}
                className="mt-2 w-full rounded-2xl bg-white/10 py-2 text-xs font-black text-cyan-100 transition hover:bg-white/15"
              >
                Ask on WhatsApp
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border p-4 md:p-5 space-y-2">
              <h3 className="text-xs md:text-sm font-black text-gray-800">Academic Documents</h3>

              <button type="button" onClick={() => setShowCardModal(true)} className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-2.5 text-xs font-bold transition">
                Student ID Card
              </button>

              <button
                type="button"
                onClick={() => canClaimCertificate && setShowCertModal(true)}
                disabled={!canClaimCertificate}
                className={`w-full rounded-2xl py-2.5 text-xs font-bold transition ${
                  canClaimCertificate
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {canClaimCertificate ? "Claim Certificate" : "Certificate Locked"}
              </button>

              <button
                type="button"
                onClick={handleInstallPortal}
                className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white transition"
              >
                Add Portal to Mobile
              </button>

              <a
                href="/tools"
                className="block w-full rounded-2xl bg-cyan-600 hover:bg-cyan-700 py-2.5 text-center text-xs font-bold text-white transition"
              >
                Free Student Tools
              </a>

              <a
                href={OFFICE_2021_URL}
                target="_blank"
                rel="noreferrer"
                className="block w-full rounded-2xl bg-blue-600 hover:bg-blue-700 py-2.5 text-center text-xs font-bold text-white transition"
              >
                Download Office 2021
              </a>
            </div>
          </aside>

          {activeTab === "admin" && isAdmin ? (
            <main className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-3xl shadow-sm border p-4 md:p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900">🛡️ Protected Admin Panel</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Control hub parameters for academy databases.</p>
                    <p className="mt-1 text-[10px] font-mono text-slate-400">Admin UID: {user.uid}</p>
                  </div>
                  <div className="flex gap-1.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleDownloadFullBackup}
                      disabled={backupGenerating}
                      className="flex-1 sm:flex-initial px-3 py-2 text-xs font-bold rounded-xl border bg-violet-600 text-white border-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-500"
                    >
                      {backupGenerating ? "Preparing Backup..." : "Download Full Backup"}
                    </button>
                    <button
                      type="button"
                      onClick={handleSyncVerificationRecords}
                      disabled={syncingVerificationRecords}
                      className="flex-1 sm:flex-initial px-3 py-2 text-xs font-bold rounded-xl border bg-amber-500 text-slate-950 border-amber-500 hover:bg-amber-400 disabled:bg-slate-200 disabled:text-slate-500"
                    >
                      {syncingVerificationRecords ? "Syncing..." : "Sync Verify"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAnnouncementModal(true)}
                      className="flex-1 sm:flex-initial px-3 py-2 text-xs font-bold rounded-xl border bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                    >
                      New Announcement
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminSubTab("announcements")}
                      className={`flex-1 sm:flex-initial px-3 py-2 text-xs font-bold rounded-xl border ${adminSubTab === "announcements" ? "bg-amber-500 text-slate-950 border-amber-500" : "bg-slate-50 text-slate-700"}`}
                    >
                      Announcements ({allAnnouncements.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminSubTab("students")}
                      className={`flex-1 sm:flex-initial px-3 py-2 text-xs font-bold rounded-xl border ${adminSubTab === "students" ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 text-slate-700"}`}
                    >
                      Students List
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminSubTab("lectures")}
                      className={`flex-1 sm:flex-initial px-3 py-2 text-xs font-bold rounded-xl border ${adminSubTab === "lectures" ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 text-slate-700"}`}
                    >
                      Lectures ({courseVideos.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminSubTab("ai")}
                      className={`flex-1 sm:flex-initial px-3 py-2 text-xs font-bold rounded-xl border ${adminSubTab === "ai" ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 text-slate-700"}`}
                    >
                      AI Interest ({pendingAiInterests})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminSubTab("questions")}
                      className={`flex-1 sm:flex-initial px-3 py-2 text-xs font-bold rounded-xl border relative ${adminSubTab === "questions" ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 text-slate-700"}`}
                    >
                      Forum Board ({allQuestions.filter(q => !q.reply).length})
                    </button>
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => setAdminSubTab("staff")}
                        className={`flex-1 sm:flex-initial px-3 py-2 text-xs font-bold rounded-xl border ${adminSubTab === "staff" ? "bg-amber-500 text-slate-950 border-amber-500 font-black" : "bg-slate-50 text-slate-700"}`}
                      >
                        👑 Staff & Roles
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-end">
                  <div className="flex-1">
                    <label className="mb-1 block text-[11px] font-black uppercase text-slate-600">Active Course</label>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => {
                        const nextCourseId = e.target.value;
                        if (!nextCourseId) return;
                        setSelectedCourseId(nextCourseId);
                        loadCourseVideosForSelection(nextCourseId);
                      }}
                      className="input bg-white"
                    >
                      {courseCatalog.map((course) => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="mb-1 block text-[11px] font-black uppercase text-slate-600">Course Name</label>
                    <input
                      type="text"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      className="input bg-white"
                      placeholder="Excel Course"
                    />
                  </div>

                  <div className="flex-[1.4]">
                    <label className="mb-1 block text-[11px] font-black uppercase text-slate-600">YouTube Playlist Link</label>
                    <input
                      type="url"
                      value={newCoursePlaylistUrl}
                      onChange={(e) => setNewCoursePlaylistUrl(e.target.value)}
                      className="input bg-white"
                      placeholder="https://www.youtube.com/playlist?list=..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCoursePlaylist}
                    disabled={courseSaving}
                    className="rounded-2xl bg-blue-600 px-4 py-3 text-[10px] font-black text-white hover:bg-blue-700 disabled:bg-slate-300"
                  >
                    {courseSaving ? "Loading..." : "Add Course Playlist"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {[
                  ["Total Students", adminStats.totalStudents, "bg-slate-900 text-white", "Registered accounts"],
                  ["Active Learners", adminStats.activeStudents, "bg-blue-50 text-blue-900 border-blue-100", `${averageProgress}% average progress`],
                  ["Pending Reviews", adminStats.pendingAssignments, "bg-amber-50 text-amber-900 border-amber-100", "Assignments waiting"],
                  ["Course Completed", adminStats.completedStudents, "bg-emerald-50 text-emerald-900 border-emerald-100", "Ready for certificate"],
                  ["Portal Visits", allStudents.reduce((sum, student) => sum + (student.visitCount || 0), 0), "bg-indigo-50 text-indigo-900 border-indigo-100", "Total student logins"],
                  ["Cities Covered", uniqueCities.length, "bg-cyan-50 text-cyan-900 border-cyan-100", "Student locations"],
                  ["Deactivated", inactiveStudents, "bg-slate-100 text-slate-800 border-slate-200", "Temporarily disabled"],
                  ["Struck Off", struckOffStudents, "bg-red-50 text-red-900 border-red-100", "Removed from active list"],
                ].map(([label, value, tone, detail]) => (
                  <div key={label} className={`rounded-3xl border p-4 shadow-sm ${tone}`}>
                    <p className="text-[10px] font-black uppercase opacity-75">{label}</p>
                    <p className="mt-1 text-2xl font-black">{value}</p>
                    <p className="mt-1 text-[11px] font-bold opacity-75">{detail}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-3xl border p-4 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-slate-500">Assignment Quality</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-2xl bg-green-50 p-3">
                      <p className="text-xl font-black text-green-700">{adminStats.approvedAssignments}</p>
                      <p className="text-[10px] font-bold text-green-700">Approved</p>
                    </div>
                    <div className="rounded-2xl bg-red-50 p-3">
                      <p className="text-xl font-black text-red-700">{adminStats.rejectedAssignments}</p>
                      <p className="text-[10px] font-bold text-red-700">Rejected</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border p-4 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-slate-500">Support Queue</p>
                  <p className="mt-2 text-3xl font-black text-indigo-700">{unansweredQuestions}</p>
                  <p className="text-[11px] font-bold text-slate-500">Forum questions awaiting admin reply</p>
                </div>

                <div className="bg-white rounded-3xl border p-4 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-slate-500">Quick Filters</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[
                      ["all", "All"],
                      ["active", "Active"],
                      ["pending", "Pending Review"],
                      ["rejected", "Needs Fix"],
                      ["completed", "Completed"],
                      ["deactivated", "Deactivated"],
                      ["struckOff", "Struck Off"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAdminFilter(value)}
                        className={`rounded-xl px-2.5 py-1.5 text-[10px] font-black transition ${
                          adminFilter === value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border p-4 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-500">City Wise Students</p>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">Filter the database by student city.</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCityFilter("all")}
                      className={`rounded-xl px-2.5 py-1.5 text-[10px] font-black transition ${cityFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                      All Cities
                    </button>
                    {cityStats.map((item) => (
                      <button
                        key={item.city}
                        type="button"
                        onClick={() => setCityFilter(item.city)}
                        className={`rounded-xl px-2.5 py-1.5 text-[10px] font-black transition ${cityFilter === item.city ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
                      >
                        {item.city} ({item.count})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {studentLoadError && (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                  Student database could not load: {studentLoadError}
                </div>
              )}

              {adminSubTab === "announcements" ? (
                <div className="rounded-3xl border bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Manage Announcements</h3>
                      <p className="mt-0.5 text-xs font-semibold text-slate-500">Edit or remove updates shown to all students.</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black text-amber-700">{allAnnouncements.length} total</span>
                  </div>
                  {allAnnouncements.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {allAnnouncements.map((announcement) => (
                        <div key={announcement.id} className="flex flex-col gap-2 rounded-2xl border bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-900">{announcement.title || "Untitled announcement"}</p>
                            <p className="mt-0.5 line-clamp-1 text-xs font-medium text-slate-500">{announcement.message}</p>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <button type="button" onClick={() => handleEditAnnouncement(announcement)} className="rounded-xl bg-blue-100 px-3 py-2 text-xs font-black text-blue-700 hover:bg-blue-200">Edit</button>
                            <button type="button" onClick={() => handleDeleteAnnouncement(announcement)} className="rounded-xl bg-red-100 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-200">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-center text-xs font-semibold text-slate-400">No announcements posted yet.</p>
                  )}
                </div>
              ) : adminSubTab === "students" ? (
                <>
                  <div className="bg-white rounded-3xl shadow-sm border p-4">
                    <div className="relative">
                      <label htmlFor="student-record-search" className="sr-only">Search student records</label>
                      <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
                      <input
                        id="student-record-search"
                        type="text"
                        placeholder="Search student records dynamically by Name, Roll No, or City..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input pl-10 w-full"
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-sm border p-4 overflow-hidden">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
                      <h3 className="font-black text-gray-900 text-sm">Complete Student Database ({filteredStudents.length})</h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={downloadStudentReportPdf}
                          className="bg-slate-900 hover:bg-black text-white text-[10px] font-black px-3 py-2 rounded-xl transition"
                        >
                          PDF Report
                        </button>
                        <button
                          type="button"
                          onClick={downloadStudentReportCsv}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-3 py-2 rounded-xl transition"
                        >
                          CSV Report
                        </button>
                        <button
                          type="button"
                          onClick={downloadStudentReportExcel}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black px-3 py-2 rounded-xl transition"
                        >
                          Excel Report
                        </button>
                      </div>
                    </div>
                    <div className="table-scroll-container">
                      <table className="w-full text-xs min-w-[1320px] text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold">
                            <th className="p-3 rounded-l-xl">Student Name</th>
                            <th className="p-3">Roll No</th>
                            <th className="p-3">Login Details</th>
                            <th className="p-3">City</th>
                            <th className="p-3">Phone / WhatsApp</th>
                            <th className="p-3">Lectures Done</th>
                            <th className="p-3">Visits</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">System Role</th>
                            <th className="p-3">Assignments</th>
                            <th className="p-3 rounded-r-xl">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((s) => {
                            const lp = s.lectureProgress || {};
                            const studentStats = getStudentLectureStats(s);
                            const studentProgressPercent = courseVideos.length ? Math.round((studentStats.completed / courseVideos.length) * 100) : 0;
                            const firstSubmittedWork = courseVideos
                              .map((lecture) => lp[lecture.id])
                              .find((progress) => isValidSubmissionUrl(progress?.homeworkFileURL));
                            return (
                              <tr key={s.uid} className="border-b hover:bg-slate-50 transition">
                                <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                                  {s.photoURL || s.photoDataURL ? (
                                    <img src={s.photoURL || s.photoDataURL} alt="" className="w-6 h-6 rounded-full object-cover" />
                                  ) : (
                                    <span className="text-sm">🎓</span>
                                  )}
                                  {s.name}
                                </td>
                                <td className="p-3 font-mono text-blue-700 font-bold">{s.rollNo}</td>
                                <td className="p-3">
                                  <div className="space-y-1.5">
                                    <div className="font-mono text-[11px] text-slate-800">{s.email || "No email saved"}</div>
                                    <div className="flex flex-wrap gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleAdminPasswordReset(s.email)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[9px] px-2 py-1 rounded transition"
                                      >
                                        Reset Email
                                      </button>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3 text-gray-700">{s.city || "N/A"}</td>
                                <td className="p-3 text-gray-700">{s.phoneNumber || "N/A"}</td>
                                <td className="p-3">
                                  <div className="space-y-1">
                                    <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-full">
                                      {studentStats.completed} / {courseVideos.length}
                                    </span>
                                    <div className="h-1.5 w-24 rounded-full bg-slate-200 overflow-hidden">
                                      <div className="h-full bg-blue-600" style={{ width: `${studentProgressPercent}%` }} />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500">{studentProgressPercent}% progress</p>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="font-black text-slate-900">{s.visitCount || 0}</div>
                                  <div className="text-[10px] font-semibold text-slate-400">{s.lastVisitedAt ? s.lastVisitedAt.split("T")[0] : "No visit"}</div>
                                </td>
                                <td className="p-3">
                                  <span className={`rounded-full px-2 py-1 text-[10px] font-black ${
                                    s.accountStatus === "deactivated"
                                      ? "bg-slate-100 text-slate-700"
                                      : s.accountStatus === "struckOff"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-green-100 text-green-700"
                                  }`}>
                                    {s.accountStatus === "deactivated" ? "Deactivated" : s.accountStatus === "struckOff" ? "Struck Off" : "Active"}
                                  </span>
                                </td>
                                 <td className="p-3">
                                   {isOwner && s.uid !== OWNER_UID && s.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase() ? (
                                     <select
                                       aria-label={`Change role for ${s.name || "student"}`}
                                       value={getEffectiveRole(s)}
                                       onChange={(e) => handleAssignUserRole(s, e.target.value)}
                                       className="input bg-white text-[11px] py-1 px-2 font-bold border-amber-300 rounded-lg shadow-xs"
                                     >
                                       <option value={ROLES.STUDENT}>📚 Student</option>
                                       <option value={ROLES.TEACHER}>🎓 Teacher</option>
                                       <option value={ROLES.ADMIN}>🛠️ Admin</option>
                                     </select>
                                   ) : (
                                     <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                                       getEffectiveRole(s) === ROLES.OWNER
                                         ? "bg-amber-100 text-amber-900 border border-amber-300"
                                         : getEffectiveRole(s) === ROLES.ADMIN
                                         ? "bg-purple-100 text-purple-800"
                                         : getEffectiveRole(s) === ROLES.TEACHER
                                         ? "bg-blue-100 text-blue-800"
                                         : "bg-slate-100 text-slate-700"
                                     }`}>
                                       {getEffectiveRole(s) === ROLES.OWNER ? "👑 Owner" : getEffectiveRole(s) === ROLES.ADMIN ? "🛠️ Admin" : getEffectiveRole(s) === ROLES.TEACHER ? "🎓 Teacher" : "📚 Student"}
                                     </span>
                                   )}
                                 </td>
                                <td className="p-3">
                                  <div className="flex flex-col gap-2">
                                    {firstSubmittedWork ? (
                                      <a
                                        href={firstSubmittedWork.homeworkFileURL}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-700 text-center"
                                      >
                                        👁️ View Work
                                      </a>
                                    ) : (
                                      <span className="text-gray-400 text-sm">Pending Submission</span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => setAdminAssignmentStudent(s)}
                                      className={`rounded-xl px-3 py-2 text-[10px] font-black transition ${
                                        studentStats.submitted > 0
                                          ? "bg-slate-900 text-white hover:bg-black"
                                          : "bg-slate-100 text-slate-500"
                                      }`}
                                    >
                                      Check Assignments ({studentStats.submitted})
                                    </button>
                                  </div>
                                  {studentStats.pendingReview > 0 && (
                                    <p className="mt-1 text-[10px] font-black text-amber-600">{studentStats.pendingReview} pending review</p>
                                  )}
                                </td>
                                <td className="p-3">
                                  <div className="flex flex-wrap gap-1">
                                    <button type="button" onClick={() => handleStudentStatus(s, "active")} className="rounded-lg bg-green-50 px-2 py-1 text-[9px] font-black text-green-700">Active</button>
                                    <button type="button" onClick={() => handleStudentStatus(s, "deactivated")} className="rounded-lg bg-slate-100 px-2 py-1 text-[9px] font-black text-slate-700">Deactivate</button>
                                    <button type="button" onClick={() => handleStudentStatus(s, "struckOff")} className="rounded-lg bg-red-50 px-2 py-1 text-[9px] font-black text-red-700">Struck Off</button>
                                    <button type="button" onClick={() => handleDeleteStudent(s)} className="rounded-lg bg-red-600 px-2 py-1 text-[9px] font-black text-white">Delete</button>
                                  </div>
                                </td>
                                <td className="hidden">
                                  {courseVideos.map((lec) => {
                                    const progress = lp[lec.id] || {};
                                    const hasSubmission = progress.homeworkDone || progress.homeworkFileURL || progress.homeworkNeedsManualReview;
                                    const feedbackKey = `${s.uid}-${lec.id}`;
                                    if (!hasSubmission) return null;
                                    return (
                                      <div key={lec.id} className="bg-slate-50 p-2 rounded-xl border flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center">
                                          <span className="font-bold text-[10px] text-slate-600">Lec {lec.id} Upload:</span>
                                          {progress.homeworkApproved && <span className="text-green-600 font-black text-[9px] bg-green-50 px-1.5 rounded">APPROVED</span>}
                                          {progress.homeworkRejected && <span className="text-red-600 font-black text-[9px] bg-red-50 px-1.5 rounded">REJECTED</span>}
                                          {!progress.homeworkApproved && !progress.homeworkRejected && <span className="text-amber-600 font-black text-[9px] bg-amber-50 px-1.5 rounded">PENDING REVIEWS</span>}
                                        </div>
                                        {isValidSubmissionUrl(progress.homeworkFileURL) ? (
                                          <a
                                            href={progress.homeworkFileURL}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-700 text-center"
                                          >
                                            👁️ View Work
                                          </a>
                                        ) : (
                                          <span className="text-gray-400 text-sm">Pending Submission</span>
                                        )}
                                        {progress.homeworkFeedback && (
                                          <p className="rounded-lg bg-white border px-2 py-1 text-[10px] font-semibold text-slate-600">
                                            Feedback: {progress.homeworkFeedback}
                                          </p>
                                        )}
                                        <input
                                          type="text"
                                          placeholder="Optional feedback for student..."
                                          value={adminFeedbackTexts[feedbackKey] || ""}
                                          onChange={(e) => setAdminFeedbackTexts((prev) => ({ ...prev, [feedbackKey]: e.target.value }))}
                                          className="input py-1.5 text-[11px] bg-white"
                                        />
                                        <div className="flex gap-1 mt-0.5">
                                          <button
                                            type="button"
                                            onClick={() => handleEvaluateAssignment(s.uid, lec.id, "approve")}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold text-[9px] px-2 py-1 rounded transition"
                                          >
                                            Approve ✅
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleEvaluateAssignment(s.uid, lec.id, "reject")}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-[9px] px-2 py-1 rounded transition"
                                          >
                                            Reject ❌
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                  {studentStats.submitted === 0 && (
                                    <span className="text-gray-400 italic text-[11px]">No uploads submitted</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : adminSubTab === "lectures" ? (
                <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.4fr] gap-4">
                  <div className="bg-white rounded-3xl shadow-sm border p-4 md:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black text-gray-900 text-base">{editingLectureId ? "Edit Lecture" : "Add New Lecture"}</h3>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">Paste a YouTube link or video id. Students will see it in the course player.</p>
                      </div>
                      {editingLectureId && (
                        <button type="button" onClick={resetLectureForm} className="rounded-xl bg-slate-100 px-3 py-1.5 text-[10px] font-black text-slate-600">
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="mt-4 space-y-3">
                      <input
                        type="text"
                        placeholder="Lecture title"
                        value={lectureForm.title}
                        onChange={(e) => setLectureForm((prev) => ({ ...prev, title: e.target.value }))}
                        className="input"
                      />
                      <input
                        type="text"
                        placeholder="YouTube video id or link"
                        value={lectureForm.videoId}
                        onChange={(e) => setLectureForm((prev) => ({ ...prev, videoId: e.target.value }))}
                        className="input"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Duration in minutes"
                        value={lectureForm.duration}
                        onChange={(e) => setLectureForm((prev) => ({ ...prev, duration: e.target.value }))}
                        className="input"
                      />
                      <textarea
                        placeholder="Lecture notes / topics"
                        value={lectureForm.notes}
                        onChange={(e) => setLectureForm((prev) => ({ ...prev, notes: e.target.value }))}
                        className="input min-h-24 resize-none"
                      />
                      <textarea
                        placeholder="Assignment instructions"
                        value={lectureForm.assignment}
                        onChange={(e) => setLectureForm((prev) => ({ ...prev, assignment: e.target.value }))}
                        className="input min-h-24 resize-none"
                      />

                      <button
                        type="button"
                        onClick={handleSaveLecture}
                        disabled={lectureSaving}
                        className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-xs font-black text-white shadow-sm transition hover:bg-blue-700 disabled:bg-slate-300"
                      >
                        {lectureSaving ? "Saving..." : editingLectureId ? "Update Lecture" : "Add Lecture"}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
                    <div>
                      <h3 className="text-base font-black text-slate-900">📁 Distribute Class Practice Materials</h3>
                      <p className="mt-0.5 text-xs font-semibold text-orange-800">
                        Upload Excel, Word, or PDF practice files for a selected lecture module. Students will see a download alert on that lecture.
                      </p>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-black uppercase text-slate-600">
                          Select Target Lecture Module
                        </label>
                        <select
                          value={practiceLectureId}
                          onChange={(e) => setPracticeLectureId(e.target.value)}
                          className="input bg-white"
                        >
                          {courseVideos.map((lecture, index) => (
                            <option key={lecture.id} value={lecture.id}>
                              Lecture {index + 1}: {lecture.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-black uppercase text-slate-600">
                          Upload Excel/Word/PDF File
                        </label>
                        <input
                          type="file"
                          accept=".xlsx,.xls,.doc,.docx,.pdf,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={(e) => setPracticeFile(e.target.files?.[0] || null)}
                          className="input bg-white"
                        />
                        {practiceFile && (
                          <p className="mt-1 text-[11px] font-bold text-orange-800">
                            Selected: {practiceFile.name}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleUploadPracticeFile}
                        disabled={practiceUploading || !practiceFile || !practiceLectureId}
                        className="w-full rounded-2xl bg-orange-500 px-4 py-3 text-xs font-black text-slate-950 shadow-sm transition hover:bg-orange-400 disabled:bg-orange-100 disabled:text-orange-300"
                      >
                        {practiceUploading ? "Uploading Practice File..." : "Upload & Notify Students"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-sm border p-4 md:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="font-black text-gray-900 text-base">Course Lecture Manager</h3>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">Firestore lectures override the coded playlist after import or first save.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleImportCurrentLectures}
                        disabled={lectureSaving}
                        className="rounded-xl bg-slate-900 px-3 py-2 text-[10px] font-black text-white hover:bg-black disabled:bg-slate-300"
                      >
                        Import Current Playlist
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {courseVideos.map((lecture, index) => (
                        <div key={lecture.id} className="rounded-2xl border bg-slate-50 p-3">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-700">Lecture {index + 1}</span>
                                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-700">{lecture.duration} min</span>
                              </div>
                              <h4 className="mt-2 text-sm font-black text-slate-900">{lecture.title}</h4>
                              <p className="mt-1 text-[11px] font-mono text-blue-700">{lecture.videoId}</p>
                              {lecture.notes && <p className="mt-2 text-xs font-semibold text-slate-600">{lecture.notes}</p>}
                              {lecture.assignment && <p className="mt-1 text-[11px] font-semibold text-amber-700">Assignment: {lecture.assignment}</p>}
                            </div>
                            <div className="flex shrink-0 gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleEditLecture(lecture)}
                                className="rounded-xl bg-amber-500 px-3 py-2 text-[10px] font-black text-slate-950 hover:bg-amber-600"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLecture(lecture)}
                                className="rounded-xl bg-red-600 px-3 py-2 text-[10px] font-black text-white hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : adminSubTab === "ai" ? (
                <div className="bg-white rounded-3xl shadow-sm border p-4 md:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="font-black text-gray-900 text-base">AI Course Interest List</h3>
                      <p className="mt-0.5 text-xs font-semibold text-slate-500">
                        Students who registered interest for the upcoming Artificial Intelligence course.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-2xl bg-cyan-50 px-4 py-2">
                        <p className="text-lg font-black text-cyan-800">{allAiInterests.length}</p>
                        <p className="text-[10px] font-bold text-cyan-700">Total</p>
                      </div>
                      <div className="rounded-2xl bg-amber-50 px-4 py-2">
                        <p className="text-lg font-black text-amber-800">{pendingAiInterests}</p>
                        <p className="text-[10px] font-bold text-amber-700">Pending</p>
                      </div>
                    </div>
                  </div>

                  {allAiInterests.length === 0 ? (
                    <p className="rounded-2xl bg-slate-50 py-8 text-center text-xs font-semibold text-slate-400">
                      No students have registered interest for the AI course yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[980px] text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700">
                            <th className="rounded-l-xl p-3">Student</th>
                            <th className="p-3">Roll No</th>
                            <th className="p-3">City</th>
                            <th className="p-3">Phone / WhatsApp</th>
                            <th className="p-3">Education</th>
                            <th className="p-3">Registered</th>
                            <th className="rounded-r-xl p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allAiInterests.map((interest) => (
                            <tr key={interest.id} className="border-b hover:bg-slate-50">
                              <td className="p-3">
                                <div className="font-black text-slate-900">{interest.studentName || "Student"}</div>
                                <div className="mt-0.5 font-mono text-[10px] text-blue-700">{interest.email || "No email"}</div>
                              </td>
                              <td className="p-3 font-mono font-bold text-blue-700">{interest.studentRollNo || "N/A"}</td>
                              <td className="p-3 font-semibold text-slate-600">{interest.city || "N/A"}</td>
                              <td className="p-3">
                                {interest.phoneNumber ? (
                                  <a
                                    href={`https://wa.me/${String(interest.phoneNumber).replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-bold text-emerald-700 underline"
                                  >
                                    {interest.phoneNumber}
                                  </a>
                                ) : (
                                  <span className="text-slate-400">No phone</span>
                                )}
                              </td>
                              <td className="p-3 text-slate-600">{interest.education || "N/A"}</td>
                              <td className="p-3 text-slate-500">{interest.createdAt ? interest.createdAt.split("T")[0] : "N/A"}</td>
                              <td className="p-3">
                                <button
                                  type="button"
                                  onClick={() => handleAiInterestContacted(interest, !interest.contacted)}
                                  className={`rounded-xl px-3 py-2 text-[10px] font-black transition ${
                                    interest.contacted
                                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                                      : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                  }`}
                                >
                                  {interest.contacted ? "Contacted" : "Mark Contacted"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : adminSubTab === "staff" && isOwner ? (
                <div className="bg-white rounded-3xl shadow-sm border p-4 md:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="font-black text-slate-900 text-base">👑 Academy Staff & Role Management</h3>
                      <p className="mt-0.5 text-xs font-semibold text-slate-500">
                        Assign system permissions to staff members. Changes update Firestore security rules instantly.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-3 py-1.5 rounded-xl">
                        👑 1 Owner
                      </span>
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-3 py-1.5 rounded-xl">
                        🛠️ {allStudents.filter(s => getEffectiveRole(s) === ROLES.ADMIN).length} Admins
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-3 py-1.5 rounded-xl">
                        🎓 {allStudents.filter(s => getEffectiveRole(s) === ROLES.TEACHER).length} Teachers
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-[800px] text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold">
                          <th className="p-3 rounded-l-xl">User / Staff Name</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Roll No</th>
                          <th className="p-3">Current Role</th>
                          <th className="p-3 rounded-r-xl">Assign Permission Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allStudents.map((staffMember) => {
                          const role = getEffectiveRole(staffMember);
                          return (
                            <tr key={staffMember.uid || staffMember.docId} className="border-b hover:bg-slate-50">
                              <td className="p-3 font-bold text-slate-900">{staffMember.name || "N/A"}</td>
                              <td className="p-3 font-mono text-blue-700">{staffMember.email || "No email"}</td>
                              <td className="p-3 font-mono font-bold text-slate-700">{staffMember.rollNo || "N/A"}</td>
                              <td className="p-3">
                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                                  role === ROLES.OWNER
                                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                                    : role === ROLES.ADMIN
                                    ? "bg-purple-100 text-purple-800"
                                    : role === ROLES.TEACHER
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}>
                                  {role === ROLES.OWNER ? "👑 Owner" : role === ROLES.ADMIN ? "🛠️ Admin" : role === ROLES.TEACHER ? "🎓 Teacher" : "📚 Student"}
                                </span>
                              </td>
                              <td className="p-3">
                                {staffMember.uid === OWNER_UID || staffMember.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? (
                                  <span className="text-[10px] font-bold text-amber-800">Master Owner Locked</span>
                                ) : (
                                  <select
                                    aria-label={`Assign role to ${staffMember.name || "user"}`}
                                    value={role}
                                    onChange={(e) => handleAssignUserRole(staffMember, e.target.value)}
                                    className="input bg-white text-xs font-bold border-amber-300 rounded-xl py-1.5 px-3"
                                  >
                                    <option value={ROLES.STUDENT}>📚 Student (Level 1)</option>
                                    <option value={ROLES.TEACHER}>🎓 Teacher (Level 2 - Homework & Forum)</option>
                                    <option value={ROLES.ADMIN}>🛠️ Admin (Level 3 - Lectures & Posts)</option>
                                  </select>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-sm border p-4 md:p-5 space-y-4">
                  <h3 className="font-black text-gray-900 text-base">Student Forum Inquiries</h3>
                  {allQuestions.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-6 text-center">No questions submitted to the board yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {allQuestions.map((q) => (
                        <div key={q.id} className="border p-4 rounded-2xl bg-slate-50 space-y-2">
                          <div className="flex justify-between items-start flex-wrap gap-1">
                            <div>
                              <span className="font-black text-xs text-slate-900">{q.studentName} </span>
                              <span className="text-[10px] font-mono text-blue-700 font-bold">({q.studentRollNo})</span>
                            </div>
                            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{q.lectureTitle}</span>
                          </div>
                          <p className="text-xs text-gray-700 font-medium bg-white p-2.5 rounded-xl border">❓ {q.question}</p>

                          {q.reply ? (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl text-xs">
                              <span className="font-bold block text-[10px] text-emerald-700 uppercase tracking-wide">✓ Academy Official Answer:</span>
                              <p className="mt-0.5 font-medium">{q.reply}</p>
                            </div>
                          ) : (
                            <div className="pt-2 flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Type answer response..."
                                value={adminReplyTexts[q.id] || ""}
                                onChange={(e) => setAdminReplyTexts(prev => ({ ...prev, [q.id]: e.target.value }))}
                                className="input py-2 text-xs flex-1 bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => handleAdminReply(q.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition whitespace-nowrap"
                              >
                                Post Reply
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </main>
          ) : (
            <>
              <main className="lg:col-span-2 space-y-4">
                <div className={`space-y-4 ${studentTab === "learn" ? "block" : "hidden lg:block"}`}>
                <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-md shadow-slate-200/60">
                  <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-amber-50 p-4 md:p-6">
                    <span className="inline-flex rounded-full border border-blue-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wide text-blue-700 shadow-sm">
                      Current lesson | 60% required
                    </span>
                    <h2 className="mt-3 text-lg font-black leading-tight text-slate-950 md:text-2xl">{activeVideo.title}</h2>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Watch the lesson, then complete the quick check below to unlock completion.</p>
                    {activeVideo.practiceFileURL && (
                      <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-orange-900">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-xs font-black">🆕 New Practice Materials available for this lecture!</p>
                          <a
                            href={activeVideo.practiceFileURL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-3 py-2 text-[11px] font-black text-slate-950 transition hover:bg-orange-400"
                          >
                            📥 Download Practice File
                          </a>
                        </div>
                        {activeVideo.practiceFileName && (
                          <p className="mt-1 text-[11px] font-semibold text-orange-800">{activeVideo.practiceFileName}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="video-wrapper portal-video-container">
                    <iframe
                      key={activeVideo.id}
                      id="hmt-youtube-player"
                      src={youtubeEmbedUrl}
                      title={activeVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="portal-lecture-actions p-4">
                    <button type="button" onClick={openYouTube} className="bg-red-600 hover:bg-red-700 text-white rounded-2xl py-2.5 text-xs font-black transition">
                      ▶ Open YouTube
                    </button>


                    <button type="button" onClick={() => window.open(YOUTUBE_PLAYLIST_URL, "_blank")} className="bg-slate-900 hover:bg-black text-white rounded-2xl py-2.5 text-xs font-black transition">
                      Full Playlist
                    </button>
                    <button type="button" onClick={() => setShowQuestionModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-2.5 text-xs font-black transition">
                      Ask Question 🗣️
                    </button>

                    <button type="button" onClick={openFacebook} className="bg-blue-800 hover:bg-blue-900 text-white rounded-2xl py-2.5 text-xs font-black transition">
                      Join Facebook Page
                    </button>

                    <button type="button" onClick={openWhatsAppContact} className="bg-green-600 hover:bg-green-700 text-white rounded-2xl py-2.5 text-xs font-black transition">
                      Contact Admin
                    </button>

                    <button type="button" onClick={openWhatsAppChannel} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-2.5 text-xs font-black transition">
                      WhatsApp Channel
                    </button>
                  </div>
                </div>

                {studentNotifications.length > 0 && (
                  <div className="bg-white rounded-3xl shadow-sm border p-4 md:p-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <h3 className="font-black text-gray-900 text-sm">Student Notifications</h3>
                      <span className="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-[10px] font-black">
                        {studentNotifications.length} update{studentNotifications.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {studentNotifications.slice(0, 3).map((item) => (
                        <div
                          key={`${item.id || item.title}-${item.text}`}
                          className={`rounded-2xl border p-3 ${
                            item.tone === "green"
                              ? "bg-green-50 border-green-100 text-green-800"
                              : item.tone === "red"
                              ? "bg-red-50 border-red-100 text-red-800"
                              : item.tone === "amber"
                              ? "bg-amber-50 border-amber-100 text-amber-800"
                              : "bg-blue-50 border-blue-100 text-blue-800"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-black">{item.title}</p>
                              <p className="mt-0.5 text-xs font-semibold opacity-85">{item.text}</p>
                            </div>
                            {item.id && (
                              <button
                                type="button"
                                onClick={() => markAnnouncementRead(item.id)}
                                className="shrink-0 rounded-lg bg-white/70 px-2 py-1 text-[11px] font-black text-slate-700 hover:bg-white"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-3xl shadow-sm border p-4 md:p-5">
                  <div className="mb-4 rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 p-4 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase text-blue-200">Completion Requirement</p>
                        <h3 className="mt-1 text-lg md:text-xl font-black">Watch 60% to complete this lecture</h3>
                        <p className="mt-1 text-xs font-semibold text-slate-300">Assignment upload is optional practice and does not block lecture completion.</p>
                      </div>
                      <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
                        <p className="text-3xl font-black text-amber-300">{watchPercent}%</p>
                        <p className="text-[10px] font-bold text-slate-200">Watched</p>
                      </div>
                    </div>
                    <div className="mt-4 h-3 rounded-full bg-white/15 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-green-400" style={{ width: `${Math.min(100, watchPercent)}%` }} />
                    </div>
                    <div className="mt-2 flex flex-wrap justify-between gap-2 text-[11px] font-bold text-slate-300">
                      <span>{formatTime(watchSeconds)} watched</span>
                      <span>Required: {formatTime(requiredWatchSeconds)}</span>
                      <span>{watchDone ? "Completion unlocked" : "Keep watching"}</span>
                    </div>
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-3">Live Lecture Core Status</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-blue-50/70 rounded-2xl p-3 border">
                      <div className="flex justify-between items-center">
                        <p className="font-black text-blue-800 text-xs">Video Watch</p>
                        <StatusBadge done={watchDone} />
                      </div>
                      <p className="text-xs text-gray-600 mt-1.5 font-bold">
                        {formatTime(watchSeconds)} watched - {watchPercent}% of video - target {formatTime(requiredWatchSeconds)}
                      </p>
                    </div>

                    <div className="bg-amber-50/70 rounded-2xl p-3 border">
                      <div className="flex justify-between items-center">
                        <p className="font-black text-amber-800 text-xs">Assignment</p>
                        <StatusBadge done={homeworkDone} />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1.5 font-medium">
                        {currentProgress.homeworkApproved ? "Approved ✅" : currentProgress.homeworkRejected ? "Rejected ❌ (Fix)" : homeworkDone ? "Pending Review" : "Upload file"}
                      </p>
                    </div>
                  </div>
                </div>
                </div>

                <div className={`space-y-4 ${studentTab === "community" ? "block" : "hidden lg:block"}`}>
                {allQuestions.filter(q => q.studentId === user.uid).length > 0 && (
                  <div className="bg-white rounded-3xl shadow-sm border p-4 md:p-5 space-y-3">
                    <h3 className="font-black text-gray-900 text-sm">Your Forum Questions & Responses</h3>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {allQuestions.filter(q => q.studentId === user.uid).map((q) => (
                        <div key={q.id} className="p-3 bg-slate-50 border rounded-2xl text-xs space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-500">
                            <span>{q.lectureTitle}</span>
                            <span>{q.createdAt ? q.createdAt.split("T")[0] : ""}</span>
                          </div>
                          <p className="font-medium text-gray-800">❓ {q.question}</p>
                          {q.reply ? (
                            <div className="mt-2 p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                              <span className="font-bold text-[9px] text-emerald-600 block">ADMIN REPLY:</span>
                              <p className="font-medium">{q.reply}</p>
                            </div>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-bold block pt-1">⏳ Awaiting Response...</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-3xl shadow-sm border p-4 md:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase text-blue-600">Community</p>
                      <h3 className="mt-1 font-black text-gray-900 text-base">Academy Feed</h3>
                      <p className="mt-1 text-xs font-semibold text-slate-500">Announcements, quiz pictures, and student responses from HMT Success Academy.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowQuestionModal(true)}
                      className="rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white hover:bg-slate-800"
                    >
                      Ask Admin
                    </button>
                  </div>

                  <div className="mt-3 rounded-2xl border bg-slate-50 p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-black uppercase text-slate-600">Academy Announcements</p>
                      {isAdmin && (
                        <button type="button" onClick={() => setShowAnnouncementModal(true)} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-[10px] font-black text-white">
                          Post
                        </button>
                      )}
                    </div>
                    {allAnnouncements.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        {allAnnouncements.slice(0, 3).map((post) => (
                          <div key={post.id} className="rounded-xl bg-white border p-3">
                            {(post.imageURL || post.imageDataURL) && (
                              <img
                                src={post.imageURL || post.imageDataURL}
                                alt={post.title || "Academy announcement"}
                                className="mb-3 max-h-56 w-full rounded-xl object-cover"
                              />
                            )}
                            <div className="flex justify-between gap-2">
                              <p className="text-xs font-black text-slate-900">{post.title}</p>
                              <span className="text-[10px] font-bold text-slate-400">{post.createdAt ? post.createdAt.split("T")[0] : ""}</span>
                            </div>
                            <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-600">{post.message}</p>
                            <div className="mt-3 rounded-xl bg-slate-50 border p-2">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[10px] font-black uppercase text-slate-500">
                                  Responses ({post.responses?.filter((response) => response.studentId === user.uid).length || 0})
                                </p>
                              </div>
                              {post.responses?.filter((response) => response.studentId === user.uid).length > 0 && (
                                <div className="mt-2 space-y-1.5">
                                  {post.responses.filter((response) => response.studentId === user.uid).slice(-3).map((response, index) => (
                                    <div key={`${response.studentId}-${response.createdAt}-${index}`} className="rounded-lg bg-white border px-2 py-1.5">
                                      <p className="text-[10px] font-black text-slate-700">{response.studentName} <span className="font-mono text-blue-600">{response.studentRollNo}</span></p>
                                      <p className="text-[11px] font-medium text-slate-600">{response.text}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="mt-2 flex gap-2">
                                <input
                                  type="text"
                                  aria-label={`Reply to ${post.title || "announcement"}`}
                                  value={announcementResponseTexts[post.id] || ""}
                                  onChange={(e) => setAnnouncementResponseTexts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                  placeholder="Write your answer..."
                                  className="input py-2 text-xs bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAnnouncementResponse(post.id)}
                                  disabled={!announcementResponseTexts[post.id]?.trim()}
                                  className="rounded-xl bg-blue-600 px-3 py-2 text-[10px] font-black text-white disabled:bg-slate-300"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-xs font-semibold text-slate-500">No academy announcements yet.</p>
                    )}
                  </div>
                </div>
                </div>

                <div className={`space-y-4 ${studentTab === "learn" ? "block" : "hidden lg:block"}`}>
                <div className="bg-white rounded-3xl shadow-sm border p-4 md:p-5">
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <h3 className="font-black text-gray-900 text-sm">Assignment Deliverables</h3>
                    <span className="bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2.5 py-1 text-[10px] font-black">Optional</span>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-950 rounded-2xl p-3.5 border border-amber-200 mb-4 text-xs font-medium leading-relaxed">
                    {activeVideo.assignment}
                  </div>

                  {currentProgress.homeworkRejected && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl mb-3 text-xs font-bold">
                      ⚠️ Your previous homework submission was rejected by the instructor. Please review and re-upload the correct work.
                    </div>
                  )}

                  {currentProgress.homeworkFeedback && (
                    <div className={`border p-3 rounded-2xl mb-3 text-xs font-bold ${
                      currentProgress.homeworkApproved
                        ? "bg-green-50 border-green-200 text-green-700"
                        : currentProgress.homeworkRejected
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-blue-50 border-blue-200 text-blue-700"
                    }`}>
                      Instructor feedback: {currentProgress.homeworkFeedback}
                    </div>
                  )}

                  <label
                    className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-xs font-black transition ${
                        homeworkDone
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    }`}
                  >
                    <span>Select File</span>
                    <span className="sr-only">PDF, Word Document, JPG, or PNG File</span>
                    <input
                        type="file"
                        disabled={homeworkDone}
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>

                  {selectedFile && (
                    <p className="mt-2.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 inline-block">Selected File: {selectedFile.name}</p>
                  )}

                  <div className="flex flex-col gap-2.5 mt-4">
                    <button
                      type="button"
                      onClick={handleUploadWork}
                      disabled={homeworkDone || uploading}
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl px-5 py-2.5 text-xs font-black shadow-sm shadow-amber-900/10 disabled:bg-gray-300 transition"
                    >
                      {uploading ? "Submitting..." : homeworkDone ? "Assignment Submitted" : "Submit Assignment"}
                    </button>

                    <button
                      type="button"
                      onClick={handleMarkAsCompleted}
                      disabled={!canMarkLectureDone || updatingVideo}
                      className={`w-full rounded-2xl py-3.5 text-xs font-black transition ${
                        isLectureDone
                          ? "bg-green-100 text-green-600 cursor-not-allowed"
                          : canMarkLectureDone
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {updatingVideo ? "Saving Completion..." : isLectureDone ? "Lecture Completed" : watchDone ? "Complete Lecture Now" : "Watch 60% to Complete"}
                    </button>
                  </div>
                </div>
                </div>
              </main>

              <aside className={`lg:col-span-1 ${studentTab === "learn" ? "block" : "hidden lg:block"}`}>
                <div className="bg-white rounded-3xl shadow-sm border p-4 md:p-5 sticky top-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wide text-blue-600">Your roadmap</p>
                      <h3 className="mt-1 text-sm font-black text-gray-900">Find a lesson fast</h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600">{completedCount}/{courseVideos.length}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1">
                    {[
                      ["all", "All", courseVideos.length],
                      ["todo", "To do", incompleteCourseVideos.length],
                      ["completed", "Done", completedCourseVideos.length],
                    ].map(([value, label, count]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setLectureFilter(value)}
                        className={`rounded-xl px-1.5 py-2 text-[10px] font-black transition ${
                          lectureFilter === value ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-white"
                        }`}
                      >
                        {label} <span className="opacity-70">({count})</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 space-y-2">
                    {visibleCourseVideos.map((video) => {
                      const lp = getLectureProgress(lectureProgress, video);
                      const done = isLectureCompleted(lectureProgress, completedVideos, video);
                      const lectureNumber = courseVideos.findIndex((courseVideo) => courseVideo.id === video.id) + 1;

                      return (
                        <button
                          key={video.id}
                          type="button"
                          onClick={() => setActiveVideo(video)}
                          className={`w-full text-left rounded-2xl p-3.5 border transition shadow-sm ${
                            activeVideo.id === video.id
                              ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-600 shadow-blue-900/20"
                              : done
                              ? "bg-gradient-to-br from-emerald-50 to-white hover:bg-emerald-50 text-gray-700 border-emerald-100"
                              : "bg-gradient-to-br from-white to-amber-50 hover:from-blue-50 hover:to-white text-gray-700 border-slate-200"
                          }`}
                        >
                          <div className="flex justify-between gap-2">
                            <span className="text-[11px] font-black">Lecture {lectureNumber}</span>
                            <span className="text-[10px] opacity-90">{done ? "Complete" : `${video.duration || 30} mins`}</span>
                          </div>
                          <p className="text-xs mt-1 font-bold line-clamp-2">{video.title}</p>

                          <div className="grid grid-cols-2 gap-1 mt-2.5 text-[9px] font-bold text-center">
                            <span className={`rounded-full py-0.5 ${lp.watchDone ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>Watch</span>
                            <span className={`rounded-full py-0.5 ${lp.homeworkDone ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>Work</span>
                          </div>
                        </button>
                      );
                    })}
                    {visibleCourseVideos.length === 0 && (
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-center">
                        <p className="text-xs font-black text-emerald-800">Every lesson is complete.</p>
                        <button type="button" onClick={() => setLectureFilter("all")} className="mt-2 text-[11px] font-black text-emerald-700 underline underline-offset-2">Show all lessons</button>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </>
          )}
        </div>

        {/* MODAL WRAPPERS */}
        {showAnnouncementModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">{editingAnnouncementId ? "Edit Announcement" : "Post Announcement"}</h2>
                <p className="text-xs text-slate-500 mt-0.5">This message will appear inside every student portal.</p>
              </div>
              <input
                type="text"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="Announcement title"
                className="input"
              />
              <textarea
                rows={5}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Write message for students..."
                className="input w-full resize-none"
              />
              <div>
                <label className="block text-[11px] font-black text-slate-700 mb-1 pl-1">Announcement Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => setAnnouncementImageFile(e.target.files?.[0] || null)}
                  className="input"
                />
                {announcementImageFile && (
                  <p className="mt-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 inline-block">
                    Selected Image: {announcementImageFile.name}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePostAnnouncement}
                  disabled={postingAnnouncement}
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-black text-white hover:bg-emerald-700 disabled:bg-slate-300"
                >
                  {postingAnnouncement ? "Saving..." : editingAnnouncementId ? "Save Changes" : "Publish Post"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAnnouncementModal(false);
                    setAnnouncementImageFile(null);
                    setEditingAnnouncementId("");
                  }}
                  className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showInstallHelp && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Add Portal to Mobile</h2>
                <p className="text-xs text-slate-500 mt-0.5">Use your browser menu to create an HMT Success Academy shortcut.</p>
              </div>
              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <p className="rounded-2xl bg-blue-50 border border-blue-100 p-3">Android Chrome: open menu, then tap Add to Home screen.</p>
                <p className="rounded-2xl bg-slate-50 border p-3">iPhone Safari: tap Share, then Add to Home Screen.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallHelp(false)}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-black text-white hover:bg-slate-800"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {adminAssignmentStudent && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-4 md:p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b pb-3">
                <div>
                  <h2 className="text-lg md:text-xl font-black text-slate-900">Assignment Review</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {adminAssignmentStudent.name} - {adminAssignmentStudent.rollNo}
                  </p>
                  <p className="text-[11px] font-mono text-blue-700 mt-1">{adminAssignmentStudent.email || "No email saved"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminAssignmentStudent(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-2 text-xs font-black transition"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {courseVideos.map((lecture) => {
                  const progress = getLectureProgress(adminAssignmentStudent.lectureProgress || {}, lecture);
                  const lectureCompleted = isLectureCompleted(
                    adminAssignmentStudent.lectureProgress || {},
                    adminAssignmentStudent.completedVideos || [],
                    lecture
                  );
                  const hasSubmission = progress.homeworkDone || progress.homeworkFileURL || progress.homeworkNeedsManualReview;
                  const feedbackKey = `${adminAssignmentStudent.uid}-${lecture.id}`;

                  return (
                    <div key={lecture.id} className="rounded-2xl border bg-slate-50 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-500">Lecture {lecture.id}</p>
                          <h3 className="mt-1 text-xs font-black text-slate-900 line-clamp-2">{lecture.title}</h3>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-[9px] font-black ${
                          lectureCompleted
                            ? "bg-green-100 text-green-700"
                            : progress.homeworkApproved
                            ? "bg-green-100 text-green-700"
                            : progress.homeworkRejected
                            ? "bg-red-100 text-red-700"
                            : hasSubmission
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-200 text-slate-500"
                        }`}>
                          {lectureCompleted ? "Lecture Complete" : progress.homeworkApproved ? "Approved" : progress.homeworkRejected ? "Rejected" : hasSubmission ? "Pending" : "No Upload"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleManualLectureCompletion(adminAssignmentStudent.uid, lecture)}
                        disabled={lectureCompleted || manualCompletionSaving === `${adminAssignmentStudent.uid}-${lecture.id}`}
                        className={`mt-3 w-full rounded-xl px-3 py-2 text-[10px] font-black transition ${
                          lectureCompleted
                            ? "cursor-not-allowed bg-green-100 text-green-700"
                            : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300"
                        }`}
                      >
                        {manualCompletionSaving === `${adminAssignmentStudent.uid}-${lecture.id}`
                          ? "Saving..."
                          : lectureCompleted
                          ? "Lecture Already Complete"
                          : "Mark Lecture Complete Manually"}
                      </button>

                      {hasSubmission ? (
                        <div className="mt-3 space-y-2">
                          {isValidSubmissionUrl(progress.homeworkFileURL) ? (
                            <a
                              href={progress.homeworkFileURL}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-700 inline-flex"
                            >
                              👁️ View Work
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">Pending Submission</span>
                          )}

                          {progress.homeworkFeedback && (
                            <p className="rounded-xl bg-white border p-2 text-[11px] font-semibold text-slate-600">
                              Previous feedback: {progress.homeworkFeedback}
                            </p>
                          )}

                          <input
                            type="text"
                            placeholder="Feedback for student..."
                            value={adminFeedbackTexts[feedbackKey] || ""}
                            onChange={(e) => setAdminFeedbackTexts((prev) => ({ ...prev, [feedbackKey]: e.target.value }))}
                            className="input py-2 text-xs bg-white"
                          />

                          {progress.homeworkApproved ? (
                            <p className="rounded-xl bg-green-100 px-3 py-2 text-center text-[10px] font-black text-green-700">
                              Assignment Approved
                            </p>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleEvaluateAssignment(adminAssignmentStudent.uid, lecture.id, "approve")}
                                className="flex-1 rounded-xl bg-green-600 px-3 py-2 text-[10px] font-black text-white hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEvaluateAssignment(adminAssignmentStudent.uid, lecture.id, "reject")}
                                className="flex-1 rounded-xl bg-red-600 px-3 py-2 text-[10px] font-black text-white hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="mt-3 rounded-xl bg-white border p-3 text-xs font-semibold text-slate-500">No assignment uploaded for this lecture.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {showQuestionModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Submit Inquiry to Admin Forum</h2>
                <p className="text-xs text-gray-500 mt-0.5">Your inquiry will post instantly to the academy admin panel.</p>
              </div>
              <div className="bg-slate-50 border p-3 rounded-xl text-xs font-bold text-indigo-700">
                Course: {activeVideo.title}
              </div>
              <textarea
                rows={4}
                value={studentQuestionText}
                onChange={(e) => setStudentQuestionText(e.target.value)}
                placeholder="Type your academic or technical question here in detail..."
                className="input w-full resize-none font-medium text-xs md:text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAskQuestion}
                  disabled={!studentQuestionText.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-xs font-black disabled:bg-gray-300 transition"
                >
                  Send Question
                </button>
                <button
                  type="button"
                  onClick={() => { setShowQuestionModal(false); setStudentQuestionText(""); }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-2.5 text-xs font-black transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showProfileModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-4 md:p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
              <div>
                <h2 className="text-lg md:text-xl font-black text-slate-900">Modify Account Profile</h2>
                <p className="text-xs text-slate-500 mt-0.5">Keep your parameters updated for certificate print logs.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Full Name" className="input" />
                <input value={editFatherName} onChange={(e) => setEditFatherName(e.target.value)} placeholder="Father Name" className="input" />
                <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="WhatsApp Number" className="input" />
                <input value={editCity} onChange={(e) => setEditCity(e.target.value)} placeholder="City Location" className="input" />
                <input value={editEducation} onChange={(e) => setEditEducation(e.target.value)} placeholder="Education Tier" className="input" />
                <select value={editDevice} onChange={(e) => setEditDevice(e.target.value)} className="input bg-white">
                  <option value="Mobile">Mobile</option>
                  <option value="Laptop/PC">Laptop / PC</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 mb-1.5">Change Avatar Image File (Optional)</label>
                <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setEditPhotoFile(e.target.files?.[0] || null)} className="input" />
                {profileSaveMessage && (
                  <p className="mt-2 text-[11px] font-black text-blue-700">{profileSaveMessage}</p>
                )}
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
                <h3 className="text-xs md:text-sm font-black text-slate-800">Update Account Password</h3>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password (Min 6 Characters)" className="input bg-white" />
                <button type="button" onClick={handleChangePassword} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2 text-xs font-bold transition">
                  Execute Password Swap
                </button>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={handleUpdateProfile} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-xs font-black disabled:bg-gray-400 transition">
                  {loading ? "Saving Records..." : "Save Profile Config"}
                </button>
                <button type="button" onClick={() => setShowProfileModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-2.5 text-xs font-black transition">
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}

        {showCardModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-start overflow-auto p-3 md:items-center md:justify-center md:p-5">
            <div className="student-card-shell w-[960px] min-w-[960px] md:w-full md:min-w-0 md:max-w-[960px]">
              <div className="mb-2 rounded-xl bg-white/90 px-3 py-2 text-center text-[11px] font-black text-slate-700 shadow md:hidden no-print">
                Swipe left/right to view the full student card.
              </div>
              <div ref={studentCardRef} className="student-card-print relative overflow-hidden rounded-[28px] border-[3px] border-[#d99a1a] bg-[#f8f6ef] shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-[30%] bg-[#031735]" />
                <div className="absolute left-0 top-[30%] h-[12%] w-full bg-[#d99a1a] [clip-path:polygon(0_78%,25%_8%,76%_6%,89%_0,100%_0,100%_100%,0_100%)]" />
                <div className="absolute left-0 top-[32%] h-[11%] w-full bg-white [clip-path:polygon(0_78%,25%_8%,76%_6%,89%_0,100%_0,100%_100%,0_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[#031735]" />

                <div className="absolute inset-0 p-4 md:p-5">
                  <div className="grid grid-cols-[15%_1fr_14%] gap-4 items-start text-white">
                    <div className="flex justify-center">
                      <div className="h-24 w-24 rounded-[22px] border-[3px] border-[#f0c04d] bg-[#061d3f] p-2 shadow-xl">
                        <img src={HMT_LOGO} alt="HMT Logo" className="h-full w-full object-contain" />
                      </div>
                    </div>
                    <div className="pt-3 text-center">
                      <h2 className="text-3xl md:text-5xl font-black tracking-wide leading-none">
                        <span className="text-white">HMT</span>{" "}
                        <span className="text-[#f4c447]">SUCCESS ACADEMY</span>
                      </h2>
                      <div className="mt-2 flex items-center justify-center gap-4 text-base md:text-lg font-black tracking-[0.32em]">
                        <span className="h-0.5 w-20 bg-[#f4c447]" />
                        <span>LEARN</span>
                        <span className="text-[#f4c447]">.</span>
                        <span>GROW</span>
                        <span className="text-[#f4c447]">.</span>
                        <span>SUCCEED</span>
                        <span className="h-0.5 w-20 bg-[#f4c447]" />
                      </div>
                      <div className="relative z-20 mx-auto mt-3 flex max-w-lg items-center justify-center gap-4 rounded-2xl border-2 border-[#d99a1a] bg-[#031735] px-6 py-2 text-lg font-black tracking-[0.16em] text-white shadow-inner">
                        <span className="h-3 w-3 rounded-full bg-[#f4c447]" />
                        OFFICIAL STUDENT ID CARD
                        <span className="h-3 w-3 rounded-full bg-[#f4c447]" />
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="relative h-32 w-32 rounded-full border-[3px] border-[#8a5a05] bg-[repeating-conic-gradient(from_0deg,#f8d96a_0deg,#f8d96a_8deg,#c98b12_8deg,#c98b12_12deg)] p-1 text-[#031735] shadow-xl">
                        <div className="absolute -bottom-11 left-10 h-16 w-5 bg-[#031735] border-x border-[#d99a1a]" />
                        <div className="absolute -bottom-11 right-10 h-16 w-5 bg-[#031735] border-x border-[#d99a1a]" />
                        <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full border-2 border-[#8a5a05] bg-gradient-to-br from-[#fff7bd] via-[#f6c94a] to-[#d59a1e] text-center font-black">
                          <span className="text-xs leading-none">*</span>
                          <span className="text-xs leading-tight">FOUNDING</span>
                          <span className="text-xs leading-tight">BATCH</span>
                          <span className="text-4xl leading-none">2026</span>
                          <span className="text-[10px] leading-none">* * *</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-[25%_1fr_22%] gap-4 items-start">
                    <div className="overflow-hidden rounded-[28px] border-[3px] border-[#d99a1a] bg-[#031735] shadow-xl">
                      <div className="h-[210px] bg-white">
                        {user.photoURL || user.photoDataURL ? (
                          <img data-student-card-photo="true" crossOrigin="anonymous" src={user.photoDataURL || user.photoURL} alt={user.name || "Student"} className="h-full w-full object-cover object-top bg-white" />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 text-[#031735]">
                            <div className="text-6xl font-black">HMT</div>
                            <div className="mt-2 text-sm font-black uppercase tracking-[0.25em]">Student Photo</div>
                          </div>
                        )}
                      </div>
                      <div className="p-1.5 text-center text-white">
                        <div className="text-xs font-black tracking-wide">VERIFIED STUDENT PORTAL</div>
                        <div className="mt-0.5 border-t border-[#f4c447] pt-0.5 text-xs font-black">HMT SUCCESS ACADEMY</div>
                      </div>
                    </div>

                    <div>
                      <div className="rounded-2xl border-2 border-[#d99a1a] bg-white/95 p-3 shadow-sm">
                        {[
                          ["STUDENT NAME", user.name || "Student Name", "user"],
                          ["STUDENT ID", user.rollNo || "C-26-HMT000", "card"],
                          ["FATHER NAME", user.fatherName || "N/A", "user"],
                          ["CITY", user.city || "Pakistan", "pin"],
                          ["COURSE", "Free Computer Course 2026", "book"],
                          ["DOMAIN", "Computer Sciences", "screen"],
                        ].map(([label, value, icon]) => (
                          <div key={label} className="grid grid-cols-[34px_145px_1fr] items-center border-b border-dashed border-slate-300 py-1 last:border-b-0">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#031735] text-[#f4c447]">
                              <MiniIcon type={icon} />
                            </div>
                            <div className="text-xs font-black text-[#07133f]">{label}</div>
                            <div className="text-base font-black leading-tight text-[#07133f]">{value}</div>
                          </div>
                        ))}
                        <div className="grid grid-cols-[34px_145px_1fr] items-center pt-1">
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#031735] text-[#f4c447]">
                            <MiniIcon type="check" />
                          </div>
                          <div className="text-xs font-black text-[#07133f]">STATUS</div>
                          <div className="text-base font-black text-green-700">Active Student</div>
                        </div>
                      </div>

                    </div>

                    <div className="rounded-[22px] border-[3px] border-[#d99a1a] bg-[#031735] p-2.5 text-center text-white shadow-xl">
                      <a href={cardVerificationUrl} target="_blank" rel="noreferrer" className="block rounded-xl bg-white p-2">
                        <img crossOrigin="anonymous" src={cardQrUrl} alt={`Verify ${user.rollNo}`} className="mx-auto h-28 w-28 object-contain" />
                      </a>
                      <a href={cardVerificationUrl} target="_blank" rel="noreferrer" className="mt-2 block rounded-full bg-[#f4c447] px-4 py-1 text-sm font-black text-[#031735]">
                        SCAN TO VERIFY
                      </a>
                      <div className="mt-1 text-[10px]">Powered By</div>
                      <div className="mt-0.5 text-sm font-black leading-tight text-[#f4c447]">HMT Financial &amp;<br />Digital Solutions</div>
                      <div className="mt-1 break-all text-[10px]">{BRAND_SITE}</div>
                    </div>
                  </div>

                  <div className="absolute bottom-[64px] left-1/2 z-20 grid w-[76%] -translate-x-1/2 grid-cols-[1.1fr_1fr_1fr_1.15fr] overflow-hidden rounded-2xl border border-[#123b70] bg-gradient-to-r from-[#02142f] via-[#06224a] to-[#02142f] text-white shadow-2xl shadow-black/25">
                    <div className="flex items-center gap-2 border-r border-[#f4c447]/80 p-1.5">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4c447] text-[#031735] [&_svg]:h-5 [&_svg]:w-5">
                        <MiniIcon type="calendar" />
                      </span>
                      <div>
                        <div className="text-[9px] font-black uppercase">Issued Date</div>
                        <div className="text-sm font-black">{formatCardDate(user.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border-r border-[#f4c447]/80 p-1.5">
                      <span className="flex h-10 w-10 items-center justify-center text-[#f4c447] [&_svg]:h-6 [&_svg]:w-6">
                        <MiniIcon type="chart" />
                      </span>
                      <div>
                        <div className="text-[9px] font-black uppercase">Course Progress</div>
                        <div className="text-xl font-black text-[#f4c447]">{progressPercent}%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border-r border-[#f4c447]/80 p-1.5">
                      <span className="flex h-10 w-10 items-center justify-center text-[#f4c447] [&_svg]:h-6 [&_svg]:w-6">
                        <MiniIcon type="book" />
                      </span>
                      <div>
                        <div className="text-[9px] font-black uppercase">Classes Completed</div>
                        <div className="text-xl font-black text-[#f4c447]">{String(completedCount).padStart(2, "0")}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-1.5">
                      <span className="flex h-10 w-10 items-center justify-center text-[#f4c447] [&_svg]:h-6 [&_svg]:w-6">
                        <MiniIcon type="certificate" />
                      </span>
                      <div>
                        <div className="text-[9px] font-black uppercase">Certificate Status</div>
                        <div className="text-lg font-black text-[#f4c447]">{canClaimCertificate ? "Released" : "Locked"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-x-5 bottom-3 z-20 grid grid-cols-[1.05fr_0.9fr_1.45fr] items-center gap-4 border-t-2 border-[#d99a1a] pt-2 text-white">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <YoutubeIcon className="h-6 w-9 shrink-0" />
                      <span>YouTube.com/@HMTSuccessAcademy</span>
                    </div>
                    <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border-x border-[#f4c447] text-center text-xs font-bold hover:text-[#f4c447]">
                      <WhatsappIcon className="h-8 w-8 shrink-0" />
                      <span>WhatsApp Channel<br /><span className="text-[10px]">Join for Updates</span></span>
                    </a>
                    <div className="text-center text-xs font-bold">
                      <span className="text-[#f4c447]">*</span> Training - Technology - Digital Services<br />
                      <span className="text-[#f4c447] italic">* Striving Today, Succeeding Tomorrow *</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2 no-print">
                <button type="button" onClick={downloadStudentCard} disabled={downloadingCard} className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-black text-white shadow disabled:bg-slate-400">
                  {downloadingCard ? "Preparing JPEG..." : "Download JPEG"}
                </button>
                <button type="button" onClick={printStudentCard} className="rounded-xl bg-[#d99a1a] px-5 py-2 text-xs font-black text-[#031735] shadow">
                  Print Student Card
                </button>
                <button type="button" onClick={() => setShowCardModal(false)} className="rounded-xl bg-white px-5 py-2 text-xs font-black text-slate-700 shadow">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {showCertModal && canClaimCertificate && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-2 overflow-auto">
            <div className="certificate-landscape bg-white rounded-2xl shadow-2xl overflow-hidden border-[6px] border-amber-700">
              <div className="m-2 border-2 border-double border-amber-500 bg-gradient-to-br from-amber-50/50 via-white to-blue-50/50 p-4 sm:p-8 text-center relative min-h-[500px] flex flex-col justify-center">
                <img src={HMT_LOGO} alt="HMT" className="w-16 h-16 sm:w-24 sm:h-24 object-contain mx-auto" />
                <h1 className="text-xl sm:text-3xl font-serif font-black text-amber-900 mt-2">Certificate of Completion</h1>
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mt-1">HMT Success Academy</p>
                <p className="text-xs text-gray-600 mt-4">This document affirms that</p>
                <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-950 mt-2 underline decoration-amber-600 underline-offset-4">{user.name}</h2>
                <p className="text-xs sm:text-sm text-gray-700 mt-5 max-w-xl mx-auto leading-relaxed">
                  Has comprehensively completed the <span className="font-black text-slate-900">Free Professional Computer Application Course</span> modules with validated watch durations, verified learning check responses, and practical project operations.
                </p>
                <div className="mt-4 inline-block bg-blue-50 border text-blue-700 font-mono font-black rounded-full px-4 py-1 text-xs mx-auto">ID: {user.rollNo}</div>
                <div className="mt-2 inline-block bg-amber-50 border border-amber-200 text-amber-800 font-mono font-black rounded-full px-4 py-1 text-xs mx-auto">Issued: {formatCardDate(user.createdAt)}</div>
                <div className="grid grid-cols-2 gap-10 mt-8 max-w-xl mx-auto w-full border-t pt-4 text-[10px] font-black text-slate-700">
                  <div><span>Portal Status Dashboard: Verified</span></div>
                  <div><span>Director Academy Authorization Sign</span></div>
                </div>

                <div className="mt-6 flex justify-center gap-2 no-print">
                  <button type="button" onClick={() => window.print()} className="bg-amber-700 text-white rounded-xl px-4 py-2 text-xs font-bold">Print Certificate</button>
                  <button type="button" onClick={() => setShowCertModal(false)} className="bg-gray-200 rounded-xl px-4 py-2 text-xs font-bold">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          .input {
            width: 100%;
            border: 1px solid #d1d5db;
            border-radius: 1rem;
            padding: 0.75rem 1rem;
            font-size: 0.85rem;
            font-weight: 500;
            outline: none;
            color: #1f2937;
          }
          .input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
          }
          .certificate-landscape {
            width: min(100vw - 12px, 1000px);
            aspect-ratio: 1.5 / 1;
          }
          .student-card-print {
            aspect-ratio: 1.48 / 1;
            width: 100%;
            max-height: calc(100vh - 96px);
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .portal-action-grid,
          .portal-lecture-actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 0.5rem;
            width: 100%;
            text-align: center;
          }
          .portal-action-grid > *,
          .portal-lecture-actions > * {
            min-width: 0;
            width: 100%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            white-space: normal;
            line-height: 1.2;
          }
          .video-wrapper,
          .portal-video-container {
            position: relative;
            width: 100%;
            max-width: 800px;
            height: 0;
            margin: 0 auto;
            padding-bottom: 56.25%;
            overflow: hidden;
            background: #000;
          }
          .video-wrapper iframe,
          .portal-video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            width: 100%;
            height: 100%;
            border: 0;
            border-radius: 8px;
          }
          .table-scroll-container {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            border-radius: 8px;
            margin-top: 15px;
          }
          .table-scroll-container table {
            width: 100%;
            white-space: nowrap;
            border-collapse: collapse;
          }
          @media (max-width: 480px) {
            .portal-action-grid,
            .portal-lecture-actions {
              grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
            }
          }
          @media (max-width: 640px) {
            .certificate-landscape {
              width: 900px;
              min-width: 900px;
              transform: scale(0.36);
              transform-origin: center;
            }
          }
          @media print {
            @page { size: A4 landscape; margin: 0; }
            html, body {
              width: 297mm;
              height: 210mm;
              margin: 0 !important;
              overflow: hidden !important;
              background: white !important;
            }
            body.printing-student-card * { visibility: hidden !important; }
            body.printing-student-card .student-card-shell,
            body.printing-student-card .student-card-shell *,
            body.printing-student-card .student-card-print,
            body.printing-student-card .student-card-print * {
              visibility: visible !important;
            }
            body.printing-student-card .student-card-shell {
              position: fixed !important;
              inset: 0 !important;
              width: 297mm !important;
              height: 210mm !important;
              max-width: none !important;
              margin: 0 !important;
              padding: 4mm !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              overflow: hidden !important;
            }
            body.printing-student-card .student-card-print {
              position: relative !important;
              left: auto !important;
              top: auto !important;
              width: 285mm !important;
              height: 192mm !important;
              max-width: none !important;
              max-height: none !important;
              aspect-ratio: auto !important;
              border: 3px solid #d99a1a !important;
              box-shadow: none !important;
              transform: none !important;
              transform-origin: center center !important;
              overflow: hidden !important;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            body:not(.printing-student-card) * { visibility: hidden !important; }
            body:not(.printing-student-card) .certificate-landscape,
            body:not(.printing-student-card) .certificate-landscape * { visibility: visible !important; }
            body:not(.printing-student-card) .certificate-landscape { position: fixed; inset: 0; width: 100%; height: auto; border: none; box-shadow: none; transform: none !important; }
            .no-print { display: none !important; }
          }
        `}} />
      </div>
    );
  }

  // ==================== VIEW 2: LOGGED OUT LOGIN/SIGNUP UI ====================
  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 selection:bg-amber-400 selection:text-slate-950 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portalStructuredData) }}
      />
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-black/30">
        <div className="relative overflow-hidden bg-[#10233b] px-6 py-8 text-white md:px-10">
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[28px] border-amber-400/20" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img src={HMT_LOGO} alt="HMT Logo" className="h-16 w-16 rounded-2xl bg-white object-contain p-1 shadow-lg" />
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Student portal</p>
                <h2 className="text-2xl font-black tracking-tight md:text-3xl">HMT Success Academy</h2>
                <p className="mt-1 text-sm text-slate-300">Learn confidently. Track every milestone.</p>
              </div>
            </div>
            <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">One secure place</p>
              <p className="mt-1 text-sm font-bold text-white">Courses | Progress | Certificates</p>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-8">
          {error && (
            <div className="mb-6 whitespace-pre-line rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold leading-relaxed text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <form onSubmit={(e) => handleSubmit(e, false)} className="auth-panel order-1 space-y-4 border-blue-100 bg-blue-50/60">
              <div>
                <p className="auth-kicker text-blue-600">Welcome back</p>
                <h3 className="auth-title">Sign in to continue</h3>
                <p className="auth-copy">Open your lessons, assignments, and student dashboard.</p>
              </div>
              <input type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input pr-16" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-xs font-black text-blue-600 hover:text-blue-800">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="text-[11px] font-semibold text-slate-500">Email verification required</span>
                <button type="button" onClick={handleResetPassword} className="text-xs font-black text-blue-600 hover:underline">Forgot password?</button>
              </div>
              <button type="submit" disabled={loading} className="auth-button bg-blue-600 hover:bg-blue-700 shadow-blue-600/20">
                {loading ? "Signing in..." : "Sign in securely"}
              </button>
              <button type="button" onClick={() => { document.getElementById("signup-form")?.scrollIntoView({ behavior: "smooth", block: "center" }); setIsSignUp(true); setError(""); }} className="w-full pt-1 text-xs font-black text-slate-600 hover:text-blue-700">
                New student? Create an account
              </button>
            </form>

            <form id="signup-form" onSubmit={(e) => handleSubmit(e, true)} className="auth-panel order-2 space-y-4 border-amber-200 bg-amber-50/60">
              <div>
                <p className="auth-kicker text-amber-700">Start learning</p>
                <h3 className="auth-title">Create your account</h3>
                <p className="auth-copy">Register once and receive your student roll number.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="text" placeholder="Full name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
                <input type="text" placeholder="Father&apos;s name" required value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="input" />
                <input type="date" aria-label="Date of birth" required value={dob} onChange={(e) => setDob(e.target.value)} className="input" />
                <input type="text" placeholder="Education level" required value={education} onChange={(e) => setEducation(e.target.value)} className="input" />
                <input type="tel" placeholder="WhatsApp / phone" required value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
                <input type="text" placeholder="City" required value={city} onChange={(e) => setCity(e.target.value)} className="input" />
              </div>
              <select value={device} onChange={(e) => setDevice(e.target.value)} className="input bg-white">
                <option value="Mobile">Device: Mobile</option>
                <option value="Laptop/PC">Device: Laptop / PC</option>
              </select>
              <input type="text" placeholder="How did you hear about us? (optional)" value={heardAboutUs} onChange={(e) => setHeardAboutUs(e.target.value)} className="input" />
              <input type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Create a strong password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input pr-16" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-xs font-black text-amber-700 hover:text-amber-900">{showPassword ? "Hide" : "Show"}</button>
              </div>
              <label className="block">
                <span className="mb-1 block pl-1 text-[11px] font-black text-slate-700">Profile picture (optional)</span>
                <input type="file" accept="image/*,.jpg,.jpeg,.png" aria-label="Choose a profile picture" onChange={(e) => setProfilePhotoFile(e.target.files?.[0] || null)} className="input bg-white text-xs" />
              </label>
              <button type="submit" disabled={loading} className="auth-button bg-amber-500 hover:bg-amber-600 shadow-amber-500/20">
                {loading ? "Creating account..." : "Create student account"}
              </button>
              <p className="text-center text-[11px] font-semibold text-slate-500">A verification email will be sent after registration.</p>
            </form>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .auth-panel { border-width: 1px; border-radius: 1.5rem; padding: 1.25rem; }
        .auth-kicker { font-size: 0.65rem; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase; }
        .auth-title { margin-top: 0.25rem; color: #0f172a; font-size: 1.35rem; font-weight: 900; letter-spacing: -0.02em; }
        .auth-copy { margin-top: 0.25rem; color: #64748b; font-size: 0.75rem; font-weight: 600; line-height: 1.5; }
        .auth-button { width: 100%; border-radius: 0.9rem; padding: 0.8rem 1rem; color: white; font-size: 0.8rem; font-weight: 900; box-shadow: 0 10px 20px -12px; transition: background-color 0.2s; }
        .input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.85rem;
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          font-weight: 500;
          outline: none;
          color: #1e293b;
          transition: all 0.2s;
        }
        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
      `}} />
    </div>
  );
}
