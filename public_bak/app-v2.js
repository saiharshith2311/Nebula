// Elements
const homeScreen = document.querySelector("#home");
const portal = document.querySelector("#portal");
const enterPortalButton = document.querySelector("#enterPortal");
const dummySubmitButton = document.querySelector("#dummySubmit");
const authTitle = document.querySelector("#authTitle");
const authHint = document.querySelector("#authHint");
const authActions = document.querySelectorAll("[data-auth-action]");

// Default Seeding Data
const defaultReviews = [
  {
    course: "Econometrics-1",
    course_id: "HS5708",
    professor: "Sabuj Kumar Mandal",
    review: "Professor is very unpredictable and affects grades pretty often.",
  },
  {
    course: "Fundamentals of Operations Research",
    course_id: "MS3510",
    professor: "Srinivasan G",
    review: "Overall it is a usual SAB course, but you have to put more effort into practicing theoretical problems to get a good score in exams. Strict attendance.",
  },
  {
    course: "Literature and Values",
    course_id: "HS4210",
    professor: "Swarnlata",
    review: "Interesting for those who enjoy philosophy, with lots of discussions and presentations requiring strong writing skills. Grading is tough; answers must be 150-200 words with clear grammar.",
  },
  {
    course: "Principles of Economics",
    course_id: "",
    professor: "Subash Kumar Sahu",
    review: "Quizzes are MCQs; endsem is descriptive with short answers and fill-in-the-blanks. Grading seems manageable, and good grades are possible.",
  },
  {
    course: "War and Peace in West Asia",
    course_id: "",
    professor: "Tabraz",
    review: "Attend class and take notes; getting S, A, or B is manageable.",
  },
  {
    course: "Climate Economics",
    course_id: "HS5760",
    professor: "Santosh Kumar Sahu",
    review: "Endsem is 60 marks, attempt any 6 out of 10 questions. Easy if you study slides. Overall an easy SAB course; submit assignments on time for a safe B grade.",
  },
  {
    course: "Technology and Sustainable Development",
    course_id: "HS5060",
    professor: "Krishna Malakar",
    review: "Good course. Midsem, endsem, and presentation. Easy grading.",
  },
  {
    course: "Fostering Enriching Relationships",
    course_id: "GN6109",
    professor: "",
    review: "Sometimes boring, but you can still get an S. Grading depends on the TA.",
  },
  {
    course: "Flow of Performance",
    course_id: "GN61200",
    professor: "Prasana",
    review: "You need to attend every class. S is possible; worst case A.",
  },
  {
    course: "Leadership Lessons from IKS",
    course_id: "GN5008",
    professor: "",
    review: "Very chill course. Easy S.",
  },
  {
    course: "Principles of Economics",
    course_id: "HS3002A",
    professor: "Krishna Malakar",
    review: "Chill course. Slides are enough to score well; quizzes are easy, endsem needs a day of prep, and grading is lenient though teaching is basic.",
  },
];

const defaultEvents = [
  {
    category: "Academic",
    title: "Course registration window",
    description: "Placeholder item for registration, add/drop, exam, and fee deadline tracking.",
  },
  {
    category: "Career",
    title: "Placement preparation sprint",
    description: "Dummy schedule block for resume reviews, mock interviews, and test practice.",
  },
  {
    category: "Campus Life",
    title: "Club meetups and seminars",
    description: "Use this space for department talks, workshops, fests, and society events.",
  },
];

const defaultPlacements = [
  {
    category: "Non Core",
    title: "Verbal",
    description: "Reading comprehension, grammar, and vocabulary exercises.\n\n[Open Verbal Prep Folder](https://drive.google.com/drive/folders/1ewAZ3ZvjIdS0rd8ZYZFvoRRWPdrJDmq6?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Puzzles",
    description: "Common placement puzzles, brain teasers, and interview riddles.\n\n[Open Puzzles Prep Folder](https://drive.google.com/drive/folders/1OhMuO4mEYYqbomTkLduA3ZZm9YfJEe4N?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Product Management",
    description: "Case studies, product design, root cause analysis, and metrics questions.\n\n[Open Product Management Prep Folder](https://drive.google.com/drive/folders/1D0gKrNvPDyKW5a21lIn849w4EaCsjfBQ?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Logic Reasoning",
    description: "Data interpretation and logical reasoning practice papers.\n\n[Open Logic Reasoning Prep Folder](https://drive.google.com/drive/folders/1vu7UKNR25QTrHdAQE2Erj41C1b_DtDAk?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "HR",
    description: "Sample HR questions, self-introduction templates, and behavioural preparation.\n\n[Open HR Prep Folder](https://drive.google.com/drive/folders/1GJQcyQgi_BhLCOIo5jQKLF9LHv65j1ra?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Guesstimates",
    description: "Structured framework notes and common guesstimate problems for consult rounds.\n\n[Open Guesstimates Prep Folder](https://drive.google.com/drive/folders/1U6UsogEZAHXZocDYJmZYQCdQf0mSouRd?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Finance",
    description: "Basic accounting, corporate finance notes, and quant trading questions.\n\n[Open Finance Prep Folder](https://drive.google.com/drive/folders/1yQvQ-pW8oaDLuvo3yI6x-rizo3OVJsUE?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Consult",
    description: "Case interview booklets, frameworks (profitability, market entry), and transcript logs.\n\n[Open Consult Prep Folder](https://drive.google.com/drive/folders/1qmvWfNelF_6nXPpKJwbyhBvw0dkDucyx?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Coding",
    description: "Data Structures & Algorithms sheets, interview bits, and contest archives.\n\n[Open Coding Prep Folder](https://drive.google.com/drive/folders/1gWVVMc6j5VzE8dLkCTl_3ithIytSYvf5?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Aptitude",
    description: "Topic-wise practice sets for quantitative aptitude and logic.\n\n[Open Aptitude Prep Folder](https://drive.google.com/drive/folders/1gzDWHFTCveEBmK4NPoEFSRZ5hc840QoX?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Analytics",
    description: "SQL query sets, machine learning prep, probability, and statistics sets.\n\n[Open Analytics Prep Folder](https://drive.google.com/drive/folders/1vcb1PwAd6wg6dinnblxnB4E1jQT6zW8f?usp=drive_link)"
  }
];

// Active state for local caching & Mode checking
const isMockMode = false;
const electiveReviews = [];
const gradeScales = {
  campus10: {
    max: 10,
    grades: [
      ["S", 10],
      ["A", 9],
      ["B", 8],
      ["C", 7],
      ["D", 6],
      ["E", 5],
      ["F", 0],
    ],
  },
  fourPoint: {
    max: 4,
    grades: [
      ["A", 4],
      ["A-", 3.7],
      ["B+", 3.3],
      ["B", 3],
      ["B-", 2.7],
      ["C+", 2.3],
      ["C", 2],
      ["C-", 1.7],
      ["D", 1],
      ["F", 0],
      ["W", 0],
      ["WP", 0],
      ["WF", 0],
    ],
  },
};

let nextCourseId = 1;

// Navigation & Auth Visual flows
function showPortal() {
  if (!homeScreen || !portal) return;

  homeScreen.style.opacity = "0";
  setTimeout(() => {
    homeScreen.classList.add("is-hidden");
    portal.classList.remove("is-hidden");
    portal.style.opacity = "0";
    setTimeout(() => {
      portal.style.opacity = "1";
      portal.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 50);
  }, 350);
}

function setAuthMode(mode) {
  if (!authTitle || !authHint) return;

  const copy = {
    login: {
      title: "Log in with Google",
      hint: "Access the campus compass secure area.",
    },
    signin: {
      title: "IIT Madras Login",
      hint: "Use your official university smail account.",
    },
    signup: {
      title: "Student Registration",
      hint: "Authorized access via Google accounts.",
    },
  };
  const activeCopy = copy[mode] || copy.signin;

  authTitle.textContent = activeCopy.title;
  authHint.textContent = activeCopy.hint;
}

authActions.forEach((button) => {
  button.addEventListener("click", () => setAuthMode(button.dataset.authAction));
});

// Dynamic User Menu Injection
function injectUserMenu(user) {
  const topbar = document.querySelector(".topbar");
  if (!topbar || document.querySelector("#userMenu")) return;

  const userMenu = document.createElement("div");
  userMenu.id = "userMenu";
  userMenu.style.cssText = "display: flex; align-items: center; gap: 14px; margin-left: auto;";

  const avatar = document.createElement("img");
  avatar.id = "userAvatar";
  // Fallback avatar if google hasn't loaded
  avatar.src = user.user_metadata.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
  avatar.style.cssText = "width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--line);";

  const name = document.createElement("span");
  name.id = "userName";
  name.textContent = user.user_metadata.full_name || "Student";
  name.style.cssText = "font-weight: 800; font-size: 0.9rem; color: var(--body); display: inline-flex;";

  const signOutBtn = document.createElement("button");
  signOutBtn.id = "signOutBtn";
  signOutBtn.className = "ghost-button secondary compact";
  signOutBtn.type = "button";
  signOutBtn.textContent = "Sign Out";
  signOutBtn.style.cssText = "min-height: 32px; padding: 0 12px; font-size: 0.82rem; border-radius: 6px; cursor: pointer;";

  signOutBtn.addEventListener("click", async () => {
    localStorage.removeItem("mockSession");
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    window.location.href = "./index.html";
  });

  userMenu.append(avatar, name, signOutBtn);
  topbar.append(userMenu);
}

// Supabase Google OAuth Engine
let supabaseClient = null;

async function initSupabaseAuth() {
  console.log("initSupabaseAuth: Initialization started...");
  try {
    const res = await fetch("/api/config");
    console.log("initSupabaseAuth: Config response received:", res.status);
    const config = await res.json();
    console.log("initSupabaseAuth: Config variables parsed:", !!config.supabaseUrl, !!config.supabaseAnonKey);
    
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      console.warn("initSupabaseAuth: Supabase keys are missing in config.");
      return;
    }

    const supabaseLib = window.Supabase || window.supabase;
    console.log("initSupabaseAuth: Supabase global class found:", !!supabaseLib);
    if (!supabaseLib) {
      console.error("initSupabaseAuth: Supabase library class not found on window.");
      return;
    }
    supabaseClient = supabaseLib.createClient(config.supabaseUrl, config.supabaseAnonKey);
    console.log("initSupabaseAuth: Supabase client created successfully.");

    // Check if there is an active local bypass session
    const mockSessionStr = localStorage.getItem("mockSession");
    const isHome = !!document.querySelector("#home");

    if (mockSessionStr) {
      const mockUser = JSON.parse(mockSessionStr);
      injectUserMenu(mockUser);
      if (isHome) {
        showPortal();
      }
      return;
    }

    // Listen for Auth State Changes (Resolves OAuth Redirect Race Condition)
    console.log("initSupabaseAuth: Registering onAuthStateChange listener...");
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log("initSupabaseAuth: Auth state changed:", event, !!session);
      if (session) {
        injectUserMenu(session.user);
        if (isHome) {
          showPortal();
        }
      } else {
        // Direct access check
        const urlParams = new URLSearchParams(window.location.search);
        if (!isHome && urlParams.get("view") !== "portal") {
          window.location.href = "./index.html";
        }
      }
    });

    // Google Sign-In Binding
    const googleSignInBtn = document.querySelector("#googleSignInBtn");
    console.log("initSupabaseAuth: Google button queried:", !!googleSignInBtn);
    if (googleSignInBtn) {
      googleSignInBtn.addEventListener("click", async () => {
        console.log("initSupabaseAuth: googleSignInBtn clicked. Triggering signInWithOAuth...");
        const { error } = await supabaseClient.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin + "/index.html?view=portal",
          },
        });

        if (error) {
          console.error("initSupabaseAuth: OAuth sign in error:", error);
          const authError = document.querySelector("#authError");
          if (authError) {
            authError.textContent = "Sign in failed: " + error.message;
            authError.style.display = "block";
          }
        }
      });
    }
  } catch (err) {
    console.error("Failed to initialize Supabase Auth client:", err);
  }
}

// Start Auth Checking
initSupabaseAuth();


// Global Modal Helpers
function openModal(modalEl) {
  modalEl.classList.add("is-active");
}

function closeModal(modalEl) {
  modalEl.classList.remove("is-active");
  const form = modalEl.querySelector("form");
  if (form) form.reset();
}

function setupModal(modalId, btnId, formId, onSubmitSuccess) {
  const modal = document.querySelector(`#${modalId}`);
  const btn = document.querySelector(`#${btnId}`);
  const form = document.querySelector(`#${formId}`);

  if (!modal) return;

  if (btn) {
    btn.addEventListener("click", () => openModal(modal));
  }

  modal.addEventListener("click", (e) => {
    if (
      e.target === modal ||
      e.target.classList.contains("modal-close") ||
      e.target.classList.contains("modal-cancel")
    ) {
      closeModal(modal);
    }
  });

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {};
      let fileToUpload = null;

      if (modalId === "reviewModal") {
        payload.course = document.querySelector("#modalCourse").value;
        payload.course_id = document.querySelector("#modalCourseId").value || null;
        payload.professor = document.querySelector("#modalProfessor").value || null;
        payload.review = document.querySelector("#modalReview").value;
      } else if (modalId === "eventModal") {
        payload.category = document.querySelector("#modalEventCategory").value;
        payload.title = document.querySelector("#modalEventTitle").value;
        payload.description = document.querySelector("#modalEventDesc").value;
        const fileInput = document.querySelector("#modalEventFile");
        if (fileInput && fileInput.files.length > 0) {
           fileToUpload = fileInput.files[0];
        }
      } else if (modalId === "resourceModal") {
        payload.category = document.querySelector("#modalResourceCategory").value;
        payload.title = document.querySelector("#modalResourceTitle").value;
        payload.description = document.querySelector("#modalResourceDesc").value;
        const fileInput = document.querySelector("#modalResourceFile");
        if (fileInput && fileInput.files.length > 0) {
           fileToUpload = fileInput.files[0];
        }
      }

      const processForm = async () => {
        if (isMockMode) {
          // Dummy Mode local in-memory addition
          if (fileToUpload) {
            payload.description += `\n[Attached File: ${fileToUpload.name} - Saved Locally]`;
          }
          if (modalId === "reviewModal") {
            defaultReviews.unshift(payload);
          } else if (modalId === "eventModal") {
            defaultEvents.unshift(payload);
          } else if (modalId === "resourceModal") {
            defaultPlacements.unshift(payload);
          }
          closeModal(modal);
          if (onSubmitSuccess) await onSubmitSuccess();
          return;
        }

        const endpoint =
          formId === "reviewForm"
            ? "/api/reviews"
            : formId === "eventForm"
              ? "/api/events"
              : "/api/placements";

        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            closeModal(modal);
            if (onSubmitSuccess) await onSubmitSuccess();
          } else {
            console.error("Database submission failed");
          }
        } catch (err) {
          console.error("Error submitting form:", err);
        }
      };

      if (fileToUpload && !isMockMode) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          payload.file_name = fileToUpload.name;
          payload.file_data = e.target.result;
          await processForm();
        };
        reader.readAsDataURL(fileToUpload);
      } else {
        await processForm();
      }
    });
  }
}

// Performance Optimization: Debounce helper for Search Box
function debounce(fn, delay = 150) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Database Seeding Gateway
async function seedTableIfEmpty(endpoint, defaultData) {
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    if (data.length === 0) {
      console.log(`Dynamic seeding initiated for ${endpoint}...`);
      for (const item of defaultData) {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
      }
      return true;
    }
  } catch (err) {
    console.error(`Seeding error on ${endpoint}:`, err);
  }
  return false;
}

// ----------------------------------------------------
// MODULE 1: ELECTIVES REVIEWS
// ----------------------------------------------------
const reviewList = document.querySelector("#reviewList");
const courseSearch = document.querySelector("#courseSearch");
const reviewCount = document.querySelector("#reviewCount");
const reviewTotal = document.querySelector("#reviewTotal");
const homeReviewTotal = document.querySelector("#homeReviewTotal");
const courseSuggestions = document.querySelector("#courseSuggestions");

function normalizeSearch(value) {
  return value.toLowerCase().trim();
}

function compactSearch(value) {
  return normalizeSearch(value).replace(/[^a-z0-9]/g, "");
}

function createMetaItem(label, value) {
  const item = document.createElement("span");
  const strong = document.createElement("strong");
  const text = document.createTextNode(value || "Not provided");

  strong.textContent = `${label}: `;
  item.append(strong, text);

  if (!value) {
    item.classList.add("is-muted");
  }

  return item;
}

function createReviewCard(review) {
  const card = document.createElement("article");
  const body = document.createElement("div");
  const title = document.createElement("h3");
  const meta = document.createElement("div");
  const text = document.createElement("p");

  card.className = "review-card";
  body.className = "review-body";
  meta.className = "review-meta";
  title.textContent = review.course;
  text.textContent = review.review;

  meta.append(
    createMetaItem("Course ID", review.course_id),
    createMetaItem("Professor", review.professor),
  );
  body.append(title, meta, text);
  card.append(body);

  return card;
}

// Performance Optimized Search Match (Precomputed outer values)
function renderReviews() {
  if (!reviewList) return;

  const query = courseSearch.value;
  const normalizedQuery = normalizeSearch(query);
  const compactQuery = compactSearch(query);
  const terms = normalizedQuery.match(/[a-z0-9]+/g) || [];

  const filteredReviews = electiveReviews.filter((review) => {
    if (!normalizedQuery) return true;

    const searchableValues = [review.course, review.course_id, review.professor].filter(Boolean);
    const searchableText = normalizeSearch(searchableValues.join(" "));
    const compactText = compactSearch(searchableValues.join(""));

    return (
      terms.every((term) => searchableText.includes(term)) ||
      (compactQuery.length > 0 && compactText.includes(compactQuery))
    );
  });

  reviewList.replaceChildren();

  if (filteredReviews.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No matching elective found.";
    reviewList.append(emptyState);
  } else {
    reviewList.append(...filteredReviews.map(createReviewCard));
  }

  const label = filteredReviews.length === 1 ? "course" : "courses";
  if (reviewCount) {
    reviewCount.textContent = `${filteredReviews.length} ${label} found`;
  }
}

function populateCourseSuggestions() {
  if (!courseSuggestions) return;
  const suggestions = electiveReviews.map((review) => {
    const option = document.createElement("option");
    option.value = review.course_id ? `${review.course} (${review.course_id})` : review.course;
    return option;
  });

  courseSuggestions.replaceChildren(...suggestions);
}

async function fetchAndRenderReviews() {
  if (isMockMode) {
    // Dummy mode: render only the 11 dummy reviews
    electiveReviews.length = 0;
    electiveReviews.push(...defaultReviews);

    if (reviewTotal) reviewTotal.textContent = String(electiveReviews.length);
    if (homeReviewTotal && electiveReviews.length > 0) homeReviewTotal.textContent = String(electiveReviews.length);

    if (reviewList) {
      populateCourseSuggestions();
      renderReviews();
    }
    return;
  }

  // Supabase Database Mode
  try {
    const res = await fetch("/api/reviews");
    const databaseReviews = await res.json();

    electiveReviews.length = 0;
    electiveReviews.push(...databaseReviews);

    if (reviewTotal) reviewTotal.textContent = String(electiveReviews.length);
    if (homeReviewTotal && electiveReviews.length > 0) homeReviewTotal.textContent = String(electiveReviews.length);

    if (reviewList) {
      populateCourseSuggestions();
      renderReviews();
    }
  } catch (err) {
    console.error("Failed to load reviews:", err);
  }
}

// Initialise Review Modals & Loading
if (reviewList || reviewTotal || homeReviewTotal) {
  setupModal("reviewModal", "addReviewBtn", "reviewForm", fetchAndRenderReviews);
  if (courseSearch) {
    courseSearch.addEventListener("input", debounce(renderReviews, 150));
  }
  fetchAndRenderReviews();
}
// Helper to parse Markdown links and format URLs in descriptions securely
function formatDescriptionWithLinks(text) {
  if (!text) {
    return document.createElement("span");
  }

  const container = document.createElement("div");
  container.className = "description-container";

  // Split description into paragraphs by double-newline
  const paragraphs = text.split("\n\n");
  
  paragraphs.forEach((para) => {
    const p = document.createElement("p");
    
    // Regexp to match Markdown link syntax: [Link Text](url)
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let tempIndex = 0;
    let match;
    let matchCount = 0;

    while ((match = mdLinkRegex.exec(para)) !== null) {
      matchCount++;
      // Append text preceding the markdown link
      if (match.index > tempIndex) {
        p.appendChild(document.createTextNode(para.substring(tempIndex, match.index)));
      }

      const linkText = match[1];
      const linkUrl = match[2];

      const a = document.createElement("a");
      a.href = linkUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = linkText;

      // Premium button styling for download or Drive attachments
      if (
        linkText.startsWith("Download") || 
        linkText.includes("Drive") || 
        linkText.includes("Folder") ||
        linkText.includes("File:") ||
        linkUrl.includes("drive.google.com")
      ) {
        a.className = "resource-link-btn";
        
        // Add a nice download icon svg before text
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "14");
        svg.setAttribute("height", "14");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.style.marginRight = "6px";
        svg.style.display = "inline-block";
        svg.style.verticalAlign = "text-bottom";
        
        if (linkUrl.includes("drive.google.com")) {
          // Google Drive folder/file icon
          svg.innerHTML = '<path d="M22 19H2L12 2l10 17z"/>';
        } else {
          // Download file icon
          svg.innerHTML = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>';
        }
        
        a.prepend(svg);
      } else {
        a.className = "inline-link";
      }

      p.appendChild(a);
      tempIndex = mdLinkRegex.lastIndex;
    }

    if (tempIndex < para.length) {
      const remainingText = para.substring(tempIndex);
      
      // Auto-detect non-markdown raw URLs in remaining text
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      let urlTempIndex = 0;
      let urlMatch;
      
      while ((urlMatch = urlRegex.exec(remainingText)) !== null) {
        if (urlMatch.index > urlTempIndex) {
          p.appendChild(document.createTextNode(remainingText.substring(urlTempIndex, urlMatch.index)));
        }
        
        const rawUrl = urlMatch[0];
        const a = document.createElement("a");
        a.href = rawUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "inline-link";
        a.textContent = "Open Link";
        p.appendChild(a);
        
        urlTempIndex = urlRegex.lastIndex;
      }
      
      if (urlTempIndex < remainingText.length) {
        p.appendChild(document.createTextNode(remainingText.substring(urlTempIndex)));
      }
    }

    container.appendChild(p);
  });

  return container;
}

// ----------------------------------------------------
// MODULE 2: EVENT TRACKER
// ----------------------------------------------------
const eventGrid = document.querySelector("#eventGrid");

function createEventCard(event) {
  const card = document.createElement("article");
  card.className = "event-card";

  const category = document.createElement("span");
  category.textContent = event.category;

  const title = document.createElement("strong");
  title.textContent = event.title;

  const desc = formatDescriptionWithLinks(event.description);

  card.append(category, title, desc);
  return card;
}

async function fetchAndRenderEvents() {
  if (!eventGrid) return;

  if (isMockMode) {
    // Dummy mode: render default mock events
    eventGrid.replaceChildren(...defaultEvents.map(createEventCard));
    return;
  }

  // Supabase Database Mode
  try {
    const res = await fetch("/api/events");
    const data = await res.json();
    eventGrid.replaceChildren(...data.map(createEventCard));
  } catch (err) {
    console.error("Failed to load events:", err);
  }
}

if (eventGrid) {
  setupModal("eventModal", "addEventBtn", "eventForm", fetchAndRenderEvents);
  fetchAndRenderEvents();
}

// ----------------------------------------------------
// MODULE 3: PLACEMENT RESOURCES
// ----------------------------------------------------
const resourceGrid = document.querySelector("#resourceGrid");

let activePlacementTab = "Non Core"; // Default Tab
let activePlacements = [];

function createResourceCard(res) {
  const card = document.createElement("article");
  card.className = "resource-card";

  // Check if this item is featured (either by category or description flag)
  const isFeatured = (res.category === "Featured Resource") || (res.description || "").includes("Featured:");
  if (isFeatured) {
    card.classList.add("is-featured");
  }

  // Extract the first link from description for entire card clickability
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
  const match = mdLinkRegex.exec(res.description || "");
  let cardLink = null;
  let cleanDescText = res.description || "";

  if (match) {
    cardLink = match[2];
    // Strip the markdown link from the description text to avoid duplicate buttons
    cleanDescText = (res.description || "").replace(mdLinkRegex, "").trim();
  }

  // Make the entire card clickable if there is a link
  if (cardLink) {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      window.open(cardLink, "_blank");
    });
  }

  const category = document.createElement("span");
  category.textContent = res.category || "Resource";

  const title = document.createElement("strong");
  title.textContent = res.title;

  // Render clean description text as structured paragraphs
  const desc = document.createElement("div");
  desc.className = "description-container";
  const paragraphs = cleanDescText.split("\n\n");
  paragraphs.forEach((para) => {
    const p = document.createElement("p");
    p.textContent = para;
    desc.appendChild(p);
  });

  card.append(category, title);

  // If there is a link, append exactly one clean "Open Drive Folder" button at the bottom
  if (cardLink) {
    const btn = document.createElement("a");
    btn.href = cardLink;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
    btn.className = "resource-link-btn";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "14");
    svg.setAttribute("height", "14");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.style.marginRight = "6px";
    svg.style.display = "inline-block";
    svg.style.verticalAlign = "text-bottom";

    svg.innerHTML = '<path d="M22 19H2L12 2l10 17z"/>';
    btn.appendChild(svg);
    btn.appendChild(document.createTextNode("Open Drive Folder"));

    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent double opening when clicking button specifically
    });

    card.appendChild(btn);
  }

  return card;
}

function renderFilteredPlacements() {
  if (!resourceGrid) return;

  const filtered = activePlacements.filter((res) => {
    // Filter out the Drive Navigator card if it exists in the fetched list
    if ((res.title || "").trim() === "Drive Navigator (All Departments)") {
      return false;
    }
    const cat = (res.category || "").trim().toLowerCase();
    if (activePlacementTab === "Non Core") {
      // Non Core matches "non core", empty category, "featured resource", or old categories for backwards compatibility
      return cat === "non core" || cat === "featured resource" || cat === "" || !cat || ["aptitude", "coding", "interviews"].includes(cat);
    } else {
      // Core matches "core"
      return cat === "core";
    }
  });

  resourceGrid.replaceChildren();

  if (filtered.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-tab-state";

    const h3 = document.createElement("h3");
    const p = document.createElement("p");

    if (activePlacementTab === "Core") {
      h3.textContent = "Core Resources Coming Soon!";
      p.textContent = "We are currently curating premium preparation materials for Core Engineering branches. Check back shortly!";
    } else {
      h3.textContent = "No Non-Core Resources";
      p.textContent = "Click 'Upload Resource' above to add a new preparation sheet or folder.";
    }

    emptyState.append(h3, p);
    resourceGrid.appendChild(emptyState);
  } else {
    // Sort so featured item is always on top/first
    const sorted = [...filtered].sort((a, b) => {
      const aFeatured = (a.category === "Featured Resource") || (a.description || "").includes("Featured:");
      const bFeatured = (b.category === "Featured Resource") || (b.description || "").includes("Featured:");
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      return 0;
    });

    resourceGrid.append(...sorted.map(createResourceCard));
  }
}

async function fetchAndRenderPlacements() {
  if (!resourceGrid) return;

  if (isMockMode) {
    activePlacements = [...defaultPlacements];
    renderFilteredPlacements();
    return;
  }

  // Supabase Database Mode
  try {
    const res = await fetch("/api/placements");
    let data = await res.json();

    // Auto-seed if database placements table is empty
    if (data.length === 0) {
      console.log("Seeding placements table in Supabase...");
      for (const item of defaultPlacements) {
        await fetch("/api/placements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
      }
      const refetch = await fetch("/api/placements");
      data = await refetch.json();
    }

    activePlacements = data;
    renderFilteredPlacements();
  } catch (err) {
    console.error("Failed to load placements:", err);
  }
}

// Bind active tab switching event listeners
const tabNonCore = document.querySelector("#tabNonCore");
const tabCore = document.querySelector("#tabCore");

if (tabNonCore && tabCore) {
  tabNonCore.addEventListener("click", () => {
    tabNonCore.classList.add("active");
    tabCore.classList.remove("active");
    activePlacementTab = "Non Core";
    renderFilteredPlacements();
  });

  tabCore.addEventListener("click", () => {
    tabCore.classList.add("active");
    tabNonCore.classList.remove("active");
    activePlacementTab = "Core";
    renderFilteredPlacements();
  });
}

if (resourceGrid) {
  setupModal("resourceModal", "uploadResourceBtn", "resourceForm", fetchAndRenderPlacements);
  fetchAndRenderPlacements();
}

// ----------------------------------------------------
// MODULE 4: CGPA CALCULATOR
// ----------------------------------------------------
const currentCgpaInput = document.querySelector("#currentCgpaInput");
const earnedCreditsInput = document.querySelector("#earnedCreditsInput");
const gradeScaleInput = document.querySelector("#gradeScaleInput");
const courseRows = document.querySelector("#courseRows");
const addCourseRowButton = document.querySelector("#addCourseRow");
const resetCgpaButton = document.querySelector("#resetCgpa");
const cgpaValue = document.querySelector("#cgpaValue");
const semesterGpaValue = document.querySelector("#semesterGpaValue");
const semesterCreditsValue = document.querySelector("#semesterCreditsValue");
const projectedCgpaValue = document.querySelector("#projectedCgpaValue");

function getActiveScale() {
  return gradeScales[gradeScaleInput.value] || gradeScales.campus10;
}

function getGradePoints(grade) {
  const scale = getActiveScale();
  const match = scale.grades.find(([value]) => value === grade);
  return match ? match[1] : 0;
}

function getCourseEntries() {
  return Array.from(courseRows.querySelectorAll(".course-row")).map((row) => ({
    courseCode: row.querySelector(".course-code").value.trim(),
    creditHours: Number(row.querySelector(".course-credit").value),
    grade: row.querySelector(".course-grade").value,
  }));
}

function calculateSemesterGpa(courses) {
  let totalCredits = 0;
  let weightedScore = 0;

  courses.forEach((course) => {
    if (!Number.isFinite(course.creditHours) || course.creditHours <= 0 || !course.grade) {
      return;
    }
    totalCredits += course.creditHours;
    weightedScore += course.creditHours * getGradePoints(course.grade);
  });

  return {
    totalCredits,
    gpa: totalCredits > 0 ? weightedScore / totalCredits : 0,
  };
}

function calculateCgpa(courses, currentCgpa, earnedCredits) {
  const scale = getActiveScale();
  const semester = calculateSemesterGpa(courses);
  const current = Number(currentCgpa);
  const earned = Number(earnedCredits);

  if (
    Number.isFinite(current) &&
    Number.isFinite(earned) &&
    current > 0 &&
    earned > 0 &&
    semester.totalCredits > 0
  ) {
    const projected =
      (current * earned + semester.gpa * semester.totalCredits) /
      (earned + semester.totalCredits);

    return {
      ...semester,
      cgpa: Math.min(projected, scale.max),
    };
  }

  if (Number.isFinite(current) && current > 0 && semester.totalCredits === 0) {
    return {
      ...semester,
      cgpa: Math.min(current, scale.max),
    };
  }

  return {
    ...semester,
    cgpa: semester.gpa,
  };
}

function updateCgpa() {
  const result = calculateCgpa(
    getCourseEntries(),
    currentCgpaInput.value,
    earnedCreditsInput.value,
  );

  semesterGpaValue.textContent = result.gpa.toFixed(2);
  semesterCreditsValue.textContent = String(result.totalCredits);
  projectedCgpaValue.textContent = result.cgpa.toFixed(2);
  cgpaValue.textContent = result.cgpa.toFixed(2);
}

function populateGradeSelect(select) {
  const gradeOptions = getActiveScale().grades.map(([grade, points]) => {
    const option = document.createElement("option");
    option.value = grade;
    option.textContent = `${grade} (${points})`;
    return option;
  });

  select.replaceChildren(new Option("--", ""), ...gradeOptions);
}

function updateGradeSelects() {
  courseRows.querySelectorAll(".course-grade").forEach((select) => {
    const previousValue = select.value;
    populateGradeSelect(select);

    if (Array.from(select.options).some((option) => option.value === previousValue)) {
      select.value = previousValue;
    }
  });

  const max = getActiveScale().max;
  currentCgpaInput.max = String(max);
  currentCgpaInput.placeholder = gradeScaleInput.value === "campus10" ? "8.20" : "3.50";
  updateCgpa();
}

function createCourseRow(course = {}) {
  const row = document.createElement("div");
  const codeLabel = document.createElement("label");
  const creditLabel = document.createElement("label");
  const gradeLabel = document.createElement("label");
  const codeInput = document.createElement("input");
  const creditInput = document.createElement("input");
  const gradeSelect = document.createElement("select");
  const removeButton = document.createElement("button");

  row.className = "course-row";
  row.dataset.courseId = String(nextCourseId);
  nextCourseId += 1;

  codeLabel.textContent = "Course";
  creditLabel.textContent = "Credits";
  gradeLabel.textContent = "Grade";

  codeInput.className = "course-code";
  codeInput.type = "text";
  codeInput.placeholder = "CS101";
  codeInput.value = course.courseCode || "";

  creditInput.className = "course-credit";
  creditInput.type = "number";
  creditInput.min = "0";
  creditInput.max = "6";
  creditInput.step = "1";
  creditInput.placeholder = "3";
  creditInput.value = course.creditHours || "";

  gradeSelect.className = "course-grade";
  populateGradeSelect(gradeSelect);
  gradeSelect.value = course.grade || "";

  removeButton.className = "remove-course";
  removeButton.type = "button";
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    row.remove();
    if (courseRows.children.length === 0) {
      addCourseRow();
    }
    updateCgpa();
  });

  codeLabel.append(codeInput);
  creditLabel.append(creditInput);
  gradeLabel.append(gradeSelect);
  row.append(codeLabel, creditLabel, gradeLabel, removeButton);

  return row;
}

function addCourseRow(course) {
  courseRows.append(createCourseRow(course));
  updateCgpa();
}

function resetCgpaCalculator() {
  currentCgpaInput.value = "";
  earnedCreditsInput.value = "";
  gradeScaleInput.value = "campus10";
  courseRows.replaceChildren();
  updateGradeSelects();
  addCourseRow({ courseCode: "", creditHours: 3, grade: "" });
  addCourseRow({ courseCode: "", creditHours: 3, grade: "" });
  addCourseRow({ courseCode: "", creditHours: 3, grade: "" });
}

// Performance Optimization: Event Delegation on CGPA calculator container
if (
  currentCgpaInput &&
  earnedCreditsInput &&
  gradeScaleInput &&
  courseRows &&
  addCourseRowButton &&
  resetCgpaButton &&
  cgpaValue &&
  semesterGpaValue &&
  semesterCreditsValue &&
  projectedCgpaValue
) {
  [currentCgpaInput, earnedCreditsInput].forEach((input) => {
    input.addEventListener("input", updateCgpa);
  });

  gradeScaleInput.addEventListener("change", updateGradeSelects);
  addCourseRowButton.addEventListener("click", () => addCourseRow());
  resetCgpaButton.addEventListener("click", resetCgpaCalculator);

  // Attach dynamic Event Delegation
  courseRows.addEventListener("input", (e) => {
    if (e.target.matches(".course-code, .course-credit, .course-grade")) {
      updateCgpa();
    }
  });

  courseRows.addEventListener("change", (e) => {
    if (e.target.matches(".course-grade")) {
      updateCgpa();
    }
  });

  resetCgpaCalculator();
}
