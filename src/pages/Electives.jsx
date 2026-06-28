import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";

const DEFAULT_REVIEWS = [
  {
    "course": "Econometrics-1",
    "course_id": "HS5708",
    "professor": "Sabuj Kumar Mandal",
    "review": "Professor is very unpredictable and affects grades pretty often.",
    "rating": 3
  },
  {
    "course": "Fundamentals of Operations Research",
    "course_id": "MS3510",
    "professor": "Srinivasan G",
    "review": "Overall it is a usual SAB course, but you have to put more effort into practicing theoretical problems to get a good score in exams. Strict attendance.",
    "rating": 4
  },
  {
    "course": "Literature and Values",
    "course_id": "HS4210",
    "professor": "Swarnlata",
    "review": "Interesting for those who enjoy philosophy, with lots of discussions and presentations requiring strong writing skills. Grading is tough; answers must be 150-200 words with clear grammar."
  },
  {
    "course": "Principles of Economics",
    "course_id": "",
    "professor": "Subash Kumar Sahu",
    "review": "Quizzes are MCQs; endsem is descriptive with short answers and fill-in-the-blanks. Grading seems manageable, and good grades are possible."
  },
  {
    "course": "War and Peace in West Asia",
    "course_id": "",
    "professor": "Tabraz",
    "review": "Attend class and take notes; getting S, A, or B is manageable."
  },
  {
    "course": "Climate Economics",
    "course_id": "HS5760",
    "professor": "Santosh Kumar Sahu",
    "review": "Endsem is 60 marks, attempt any 6 out of 10 questions. Easy if you study slides. Overall an easy SAB course; submit assignments on time for a safe B grade."
  },
  {
    "course": "Technology and Sustainable Development",
    "course_id": "HS5060",
    "professor": "Krishna Malakar",
    "review": "Good course. Midsem, endsem, and presentation. Easy grading."
  },
  {
    "course": "Fostering Enriching Relationships",
    "course_id": "GN6109",
    "professor": "",
    "review": "Sometimes boring, but you can still get an S. Grading depends on the TA."
  },
  {
    "course": "Flow of Performance",
    "course_id": "GN61200",
    "professor": "Prasana",
    "review": "You need to attend every class. S is possible; worst case A."
  },
  {
    "course": "Leadership Lessons from IKS",
    "course_id": "GN5008",
    "professor": "",
    "review": "Very chill course. Easy S."
  },
  {
    "course": "Principles of Economics",
    "course_id": "HS3002A",
    "professor": "Krishna Malakar",
    "review": "Chill course. Slides are enough to score well; quizzes are easy, endsem needs a day of prep, and grading is lenient though teaching is basic."
  },
  {
    "course": "Modern Science in India",
    "course_id": "HS3410",
    "professor": "John Bosco Lourdusamy",
    "review": "Extremely boring, aand absolyoutely youseless"
  },
  {
    "course": "Principles of Economics (Section A)",
    "course_id": "HS3002A",
    "professor": "Santhosh kumar sahu",
    "review": "Jyoust basic, entirely based on Gregory mankiw."
  },
  {
    "course": "Literature and Life",
    "course_id": "HS4030",
    "professor": "Dhanvel",
    "review": "Peace coyoyourse with great content."
  },
  {
    "course": "Science Fiction : An appreciation",
    "course_id": "HS2050",
    "professor": "Mohan",
    "review": "Some short stories were too good aand some were boring byout overall the content is good"
  },
  {
    "course": "social psychology",
    "course_id": "HS4370",
    "professor": "Prema",
    "review": "Course is not very interesting, but you can study from the book before exams and score decent grades. Evaluation includes survey, midsem, and endsem, and with some effort getting a B grade is manageable."
  },
  {
    "course": "Energy Economics",
    "course_id": "ID5070",
    "professor": "Professor Santosh Kumar",
    "review": "Excellent course with online exams and engaging lectures by the professor. Taking notes, focusing on important topics discussed in class, and reading the provided materials helps in scoring well."
  },
  {
    "course": "Maths in India",
    "course_id": "HS4860",
    "professor": "Aditya Kochalna",
    "review": "Course mainly focuses on old mathematical problem-solving methods, and regular practice is important to score well. Evaluation has 2 quizzes and an endsem, and practicing the methods properly makes scoring good marks easier."
  },
  {
    "course": "Advanced Topics in Economics",
    "course_id": null,
    "professor": "Professor Murahleed",
    "review": "Excellent course with sitting exams and very good teaching. Attending lectures, taking notes, participating in discussions, and reading the provided materials helps in scoring well."
  },
  {
    "course": "Introduction to Contemporary Tibet",
    "course_id": "HS6560",
    "professor": "Sonika Gupta",
    "review": "Peace course with lite attendance and easy evaluation through assignments, book review, and endsem. Even with low effort passing is manageable, and putting proper effort can help you get an S grade."
  },
  {
    "course": "Astronomy in India",
    "course_id": "HS4850",
    "professor": "Prof. Aditya Kolachana",
    "review": "Great course covering basics of astronomy and advanced techniques used by ancient Indians. Evaluation includes quizzes, project, and endsem, and consistent effort is needed to score good grades."
  },
  {
    "course": "French I",
    "course_id": "HS1110",
    "professor": "Jayanthi C",
    "review": "Good course if you are genuinely interested in learning French, but beginners may find the pace fast and need to put extra effort. Attendance is strict, and grading can be tough because many students already know French and score high."
  },
  {
    "course": "Intro to Sociology",
    "course_id": "HS2370",
    "professor": "Dr. Shakthi (A post-doc at HS dept.)",
    "review": "Course content is understandable and well covered, with evaluation based on essay writing in midsem and endsem. No attendance policy, and scoring good grades is quite easy when Dr. Shakthi handles the course."
  },
  {
    "course": "History of english language and literature",
    "course_id": null,
    "professor": "Mr Jyotirmay Tripaathi",
    "review": "Take this course only if you are deeply interested in philosophy, as the professor is very strict and grading can be harsh. Evaluation includes 2 quizzes and an endsem, and scoring good grades is quite tough."
  },
  {
    "course": "Korean 1",
    "course_id": "HS1080",
    "professor": "Dr. Shim Soo Jin",
    "review": "Excellent Korean course with very helpful teaching and strong focus on speaking, writing, listening, and pronunciation practice. Evaluation includes quizzes, presentation, and endsem, and consistent daily practice is necessary to score good grades."
  },
  {
    "course": "China in contemporary global politics",
    "course_id": "HS3420",
    "professor": "Joe Thomas",
    "review": "Interesting course covering China’s history, politics, global relations, and topics like Tibet, Hong Kong, Taiwan, and the South China Sea. Evaluation includes viva and essay-based exams, attendance is strict, and scoring good grades can be tough."
  },
  {
    "course": "Social History of Medicine in Colonial India",
    "course_id": "HS3060",
    "professor": "John Bosco Laudrswamy (JBL)",
    "review": "Course is a history-based study of medicine and diseases in colonial India, covering topics like cholera, plague, malaria, and IMS. Prof is strict about attendance and punctuality, but regular reading and class attention can help you get an S grade."
  },
  {
    "course": "Indian National Movement",
    "course_id": "HS2040",
    "professor": "Prof. Santosh Abraham",
    "review": "Interesting course for students interested in Indian history, British rule, and the independence struggle. Evaluation includes class tests, term paper, and endsem, and studying with genuine interest can help in getting an A or S grade."
  },
  {
    "course": "Sanskrit For Yoga",
    "course_id": null,
    "professor": "Prof. KS Kannan",
    "review": "Course focuses on learning Sanskrit and yoga-related texts, with good teaching and a strong theoretical approach. Attendance is strict, and regular study is important for getting good grades, especially for beginners in Sanskrit."
  },
  {
    "course": "Ancient Civilizations",
    "course_id": "HS4580",
    "professor": "Santosh Abraham",
    "review": "Great course for students interested in ancient global history and mysterious cultures like pyramids. Evaluation is fully descriptive with long essay writing, and scoring is not very easy due to the subjective nature of the course."
  },
  {
    "course": "Introduction to Linguistics",
    "course_id": null,
    "professor": "Rajesh Kumar",
    "review": "Interesting course about language structure, language learning, and its relation to society, with very good teaching by the professor. Attendance and regularity are important, evaluation includes write-ups and endsem, and the grading difficulty is moderate."
  },
  {
    "course": "Principles of Economics (Section C)",
    "course_id": "HS3002C",
    "professor": "Sandeep kumar",
    "review": "Good course for learning economics with an easy textbook and useful concepts, though lectures may feel boring for some. Attendance is fully strict and punctuality matters, but spending decent effort can help you get an A grade."
  },
  {
    "course": "Principles of Economics (Section D)",
    "course_id": "HS3002D",
    "professor": "Shalinta Mathews",
    "review": "Course is not as easy as it initially seems, with evaluation having both MCQs and subjective exams. Attendance is strict, and grading difficulty depends a lot on the professor handling the course."
  },
  {
    "course": "Money,banking and financial markets",
    "course_id": "ID5070",
    "professor": "Pramod naik",
    "review": "Good course for students interested in stock markets, banking, and money flow concepts. Evaluation includes surprise tests, midsem, and endsem, attendance is moderately strict, and grading depends a lot on the competition in the class."
  },
  {
    "course": "Industrial Economics",
    "course_id": "HS5753",
    "professor": "Sandeep Kumar KUjur",
    "review": "Course was expected to focus on macroeconomics and the manufacturing sector, but the teaching mostly felt similar to Principles of Economics. Evaluation includes objective quizzes and an endsem, and although attendance is taken daily, the 75% rule is not very strict."
  },
  {
    "course": "Developmental Alternatives",
    "course_id": "HS4290",
    "professor": "Jyothirmaya tripathi",
    "review": "Good course overall with quizzes and endsem as evaluation components. Professor is strict, and getting even a B grade requires consistent hard work."
  },
  {
    "course": "Climate Economics",
    "course_id": "HS5760",
    "professor": "Santosh Kumar Sahu",
    "review": "Covers the relationship between economics, climate change, and environmental policy. Evaluation is usually assignment and exam based, and students who follow the lecture slides and current examples generally find the course manageable. (IIT Madras)"
  },
  {
    "course": "Introduction to International Organisations",
    "course_id": "HS5115",
    "professor": "Tabraz S. S.",
    "review": "Focuses on the United Nations, WTO, IMF, World Bank, and other international institutions. The course is discussion-oriented with analytical writing, and students interested in international relations generally enjoy it."
  },
  {
    "course": "Introduction to Linguistics",
    "course_id": null,
    "professor": "Prof. Anindita Sahoo",
    "review": "Introduces language structure, phonetics, syntax, and language acquisition. Regular attendance and completing write-ups help in understanding the concepts, while evaluation is generally based on assignments and exams."
  },
  {
    "course": "German I",
    "course_id": "HS1090",
    "professor": "Milind Brahme",
    "review": "Beginner-friendly language course focusing on speaking, listening, reading, and writing. Regular practice is important, attendance is usually expected, and students who keep up with weekly exercises generally perform well. (IIT Madras)"
  },
  {
    "course": "Japanese II",
    "course_id": "ED1092",
    "professor": "Norie Kobayashi",
    "review": "Continues Japanese I with more grammar, vocabulary, conversation, and reading practice. Daily revision is recommended, and students with a genuine interest in learning Japanese generally find the course rewarding."
  },
  {
    "course": "German II",
    "course_id": "HS1100",
    "professor": "Milind Brahme",
    "review": "Continues German I with stronger emphasis on grammar, reading, writing, and conversation. Regular practice is essential, and students interested in learning German generally find it rewarding."
  },
  {
    "course": "French II",
    "course_id": "HS1120",
    "professor": "Jayashree C",
    "review": "Intermediate French covering communication, grammar, and vocabulary. Best suited for students who enjoyed French I and are willing to practice consistently."
  },
  {
    "course": "Modern Governments and Comparative Constitutions",
    "course_id": "HS2030",
    "professor": "Joe Thomas Karackattu",
    "review": "Covers political systems and constitutions across countries. Reading-intensive with discussion and analytical writing. Good for students interested in politics and governance."
  },
  {
    "course": "Women in India: Problems and Prospects",
    "course_id": "HS3007",
    "professor": "Binitha V. Thampi",
    "review": "Focuses on gender, society, development, and public policy in India. Includes case studies and critical discussions with essay-oriented evaluation."
  },
  {
    "course": "Language and Society in India",
    "course_id": "HS3028",
    "professor": "Rajesh Kumar",
    "review": "Explores multilingualism, language variation, and social aspects of language. Suitable for students interested in linguistics and communication."
  },
  {
    "course": "Principles and Parameters in Natural Language",
    "course_id": "HS3029",
    "professor": "Rajesh Kumar",
    "review": "Introduces theoretical linguistics and language structure. More conceptual than HS3028 and suited for students interested in language theory."
  },
  {
    "course": "Technology and Public Policy",
    "course_id": "HS3031",
    "professor": "Christoph Woiwode",
    "review": "Examines the relationship between technology, ethics, governance, and society. Encourages critical thinking through discussions and written assignments."
  },
  {
    "course": "Short Story Classics",
    "course_id": "HS3090",
    "professor": "Avishek Parui",
    "review": "Covers classic short stories from world literature with emphasis on literary analysis. Ideal for students who enjoy reading and discussions."
  },
  {
    "course": "Introduction to Cultural Anthropology",
    "course_id": "HS3280",
    "professor": "Santhosh Abraham",
    "review": "Introduces human cultures, traditions, and societies from an anthropological perspective. Reading and descriptive answers are important."
  },
  {
    "course": "Decision Modelling",
    "course_id": "HS4001",
    "professor": "Anup Kumar Bhandari",
    "review": "Focuses on structured decision-making and analytical reasoning. Includes conceptual and application-oriented problems."
  },
  {
    "course": "Introduction to Indian Philosophy",
    "course_id": "HS4002",
    "professor": "Anup Kumar Bhandari",
    "review": "Introduces major Indian philosophical traditions and schools of thought. Reading and conceptual understanding are more important than memorization."
  },
  {
    "course": "Cultural Studies",
    "course_id": "HS4005",
    "professor": "Avishek Parui",
    "review": "Explores media, popular culture, identity, and society. Discussion-based with analytical writing and presentations."
  },
  {
    "course": "Indian Fiction in English",
    "course_id": "HS4010",
    "professor": "Aysha Viswamohan",
    "review": "Studies novels and short stories by Indian English authors. Suitable for students interested in literature and literary analysis."
  },
  {
    "course": "Symbolic Logic",
    "course_id": "HS4031",
    "professor": "Rajesh Kumar",
    "review": "Covers formal logic, arguments, proofs, and logical reasoning. More analytical than descriptive and useful for students who enjoy structured thinking."
  },
  {
    "course": "Humanities in Technological Age",
    "course_id": "HS4060",
    "professor": "Solomon Benjamin",
    "review": "Discusses the interaction between technology, society, ethics, and development. Encourages critical thinking about contemporary issues."
  },
  {
    "course": "Applied Economics",
    "course_id": "HS4300",
    "professor": "Sandeep Kumar Kujur",
    "review": "Introduces practical applications of economic principles to business and public policy. Includes numerical and conceptual components."
  },
  {
    "course": "Contemporary Issues in Development",
    "course_id": "HS4350",
    "professor": "Kalpana K",
    "review": "Covers poverty, inequality, sustainability, and development policy using current examples and case studies."
  },
  {
    "course": "Introduction to European Philosophy",
    "course_id": "HS4450",
    "professor": "Christoph Woiwode",
    "review": "Surveys major European philosophers and philosophical traditions. Reading-intensive with emphasis on interpretation and argument."
  },
  {
    "course": "Introduction to Chinese Language",
    "course_id": "HS4571",
    "professor": "Hasiao-Hui Yuvan",
    "review": "Beginner-friendly course covering basic Mandarin speaking, listening, reading, and writing. Consistent practice helps throughout the semester."
  },
  {
    "course": "Contexts, Politics, and Ideas: An Introduction to Ideologies",
    "course_id": "HS5612",
    "professor": "Joe Thomas Karackattu",
    "review": "Introduces political ideologies such as liberalism, socialism, nationalism, and conservatism with emphasis on historical context and debate."
  },
  {
    "course": "Indian Art",
    "course_id": "HS5920",
    "professor": "Aditya K",
    "review": "Covers Indian art history, architecture, and aesthetics through lectures and visual analysis. Suitable for students interested in history and culture."
  },
  {
    "course": "History of Science and the Public",
    "course_id": "HS6017",
    "professor": "John Bosco Lourdusamy",
    "review": "Explores the historical development of science and its interaction with society. Reading-based course with emphasis on historical interpretation."
  },
  {
    "course": "European Union Studies",
    "course_id": "HS6940",
    "professor": "Christoph Woiwode",
    "review": "Covers the history, institutions, policies, and politics of the European Union. Best suited for students interested in international relations and global affairs."
  }
];

export default function Electives() {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);

  // Form states
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [professor, setProfessor] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(5);

  const isMockMode = !!localStorage.getItem("mockSession");

  const loadReviews = async () => {
    setLoading(true);
    if (isMockMode) {
      const stored = sessionStorage.getItem("mockReviews");
      if (stored) {
        setReviews(JSON.parse(stored));
      } else {
        setReviews(DEFAULT_REVIEWS);
        sessionStorage.setItem("mockReviews", JSON.stringify(DEFAULT_REVIEWS));
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Precomputed search index matching exactly what app-v2.js had
  const filteredReviews = useMemo(() => {
    const normQuery = searchQuery.toLowerCase().trim();
    if (!normQuery) return reviews;

    const compactQuery = normQuery.replace(/[^a-z0-9]/g, "");
    const terms = normQuery.match(/[a-z0-9]+/g) || [];

    return reviews.filter((review) => {
      const searchableValues = [review.course, review.course_id, review.professor].filter(Boolean);
      const searchableText = searchableValues.join(" ").toLowerCase();
      const compactText = searchableValues.join("").toLowerCase().replace(/[^a-z0-9]/g, "");

      return (
        terms.every((term) => searchableText.includes(term)) ||
        (compactQuery.length > 0 && compactText.includes(compactQuery))
      );
    });
  }, [reviews, searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      course: courseName,
      course_id: courseId || null,
      professor: professor || null,
      review: description,
      rating: rating ? Number(rating) : null,
    };

    if (isMockMode) {
      const updated = [payload, ...reviews];
      setReviews(updated);
      sessionStorage.setItem("mockReviews", JSON.stringify(updated));
      setIsModalOpen(false);
      resetForm();
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        loadReviews();
      } else {
        alert("Failed to submit review.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const resetForm = () => {
    setCourseName("");
    setCourseId("");
    setProfessor("");
    setDescription("");
    setRating(5);
  };

  // Extract unique course titles/codes for search autocomplete datalist
  const suggestions = useMemo(() => {
    const set = new Set();
    reviews.forEach((r) => {
      if (r.course) {
        set.add(r.course_id ? `${r.course} (${r.course_id})` : r.course);
      }
    });
    return Array.from(set);
  }, [reviews]);

  const filteredSuggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return suggestions.filter(item => item.toLowerCase().includes(q)).slice(0, 5);
  }, [suggestions, searchQuery]);

  return (
    <Layout>
      <article className="feature-panel is-visible">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Elective reviews</p>
            <h1>"An investment in knowledge pays the best interest." — Benjamin Franklin</h1>
          </div>
          <button className="ghost-button" type="button" onClick={() => setIsModalOpen(true)}>
            Add Review
          </button>
        </div>

        <div className="review-layout">
          <aside className="filters" aria-label="Elective filters">
            <div className="search-suggestions-container">
              <label>
                Course name or ID
                <input
                  id="courseSearch"
                  type="search"
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => {
                    // Delay slightly to allow click handlers on suggestions to fire
                    setTimeout(() => setSearchFocused(false), 200);
                  }}
                  placeholder="Search HS5708, economics..."
                  autoComplete="off"
                />
              </label>
              {searchFocused && filteredSuggestions.length > 0 && (
                <div className="search-suggestions-dropdown">
                  {filteredSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="suggestion-item"
                      onClick={() => {
                        setSearchQuery(item);
                        setSearchFocused(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="result-count" aria-live="polite">
              {loading ? "Loading reviews..." : `${filteredReviews.length} course${filteredReviews.length === 1 ? "" : "s"} found`}
            </p>
          </aside>

          <div className="review-list" id="reviewList">
            {filteredReviews.length === 0 && !loading ? (
              <p className="empty-state">No matching elective found.</p>
            ) : (
              filteredReviews.map((rev, index) => (
                <article key={rev.id || index} className="review-card">
                  <div className="review-body">
                    <h3>{rev.course}</h3>
                    <div className="review-meta">
                      <span className={!rev.course_id ? "is-muted" : ""}>
                        <strong>Course ID: </strong>
                        {rev.course_id || "Not provided"}
                      </span>
                      <span className={!rev.professor ? "is-muted" : ""}>
                        <strong>Professor: </strong>
                        {rev.professor || "Not provided"}
                      </span>
                      {rev.rating && (
                        <span>
                          <strong>Rating: </strong>
                          <span style={{ color: "var(--gold)" }}>
                            {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                          </span>{" "}
                          ({rev.rating}/5)
                        </span>
                      )}
                    </div>
                    <p>{rev.review}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </article>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="modal-overlay is-active" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Add Elective Review</h2>
              <button className="modal-close" type="button" aria-label="Close modal" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </header>
            <main className="modal-body">
              <form id="reviewForm" onSubmit={handleSubmit}>
                <label>
                  Course Name
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g. Econometrics-1"
                    required
                  />
                </label>
                <label>
                  Course ID (Optional)
                  <input
                    type="text"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    placeholder="e.g. HS5708"
                  />
                </label>
                 <label>
                  Professor Name (Optional)
                  <input
                    type="text"
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    placeholder="e.g. Sabuj Kumar Mandal"
                  />
                </label>
                <label>
                  Course Rating
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    required
                    style={{
                      width: "100%",
                      minHeight: "44px",
                      borderRadius: "8px",
                      background: "rgba(8, 9, 8, 0.72)",
                      border: "1px solid rgba(244, 240, 232, 0.13)",
                      color: "var(--ink)",
                      padding: "0 12px",
                      fontFamily: "inherit"
                    }}
                  >
                    <option value="5">★★★★★ (5/5) - Excellent</option>
                    <option value="4">★★★★☆ (4/5) - Very Good</option>
                    <option value="3">★★★☆☆ (3/5) - Average</option>
                    <option value="2">★★☆☆☆ (2/5) - Below Average</option>
                    <option value="1">★☆☆☆☆ (1/5) - Poor</option>
                  </select>
                </label>
                <label>
                  Review Description
                  <textarea
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write your review here..."
                    required
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      background: "rgba(8, 9, 8, 0.72)",
                      border: "1px solid rgba(244, 240, 232, 0.13)",
                      color: "var(--ink)",
                      padding: "10px",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                </label>
              </form>
            </main>
            <footer className="modal-footer">
              <button className="ghost-button secondary" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="primary-button" form="reviewForm" type="submit">
                Submit Review
              </button>
            </footer>
          </div>
        </div>
      )}
    </Layout>
  );
}
