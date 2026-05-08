"use client";

import { useEffect, useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasFirebase =
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId;

let db = null;

if (hasFirebase && typeof window !== "undefined") {
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  db = getFirestore(app);
}

async function track(eventName, data = {}) {
  try {
    if (!db) return;

    await addDoc(collection(db, "lexi_clicks"), {
      eventName,
      ...data,
      createdAt: serverTimestamp(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
  } catch (error) {
    console.warn("Firebase tracking failed:", error);
  }
}

const quizQuestions = [
  {
    id: "green",
    eyebrow: "Question 1",
    title: "What is the most powerful color in the universe?",
    subtitle: "A very important question with a very obvious answer.",
    answers: [
      {
        label: "Green",
        reaction: "Correct. The leaves approve.",
        points: 30,
        emoji: "🌿",
      },
      {
        label: "Olive green",
        reaction: "Classy answer. Very Lexi-like.",
        points: 35,
        emoji: "🫒",
      },
      {
        label: "Literally any green",
        reaction: "Acceptable. The green council allows it.",
        points: 30,
        emoji: "🍀",
      },
    ],
  },
  {
    id: "day",
    eyebrow: "Question 2",
    title: "If Lexi’s day had a reset button, what should it do?",
    subtitle: "Choose wisely. This button has emotional responsibilities.",
    answers: [
      {
        label: "Make her smile",
        reaction: "Simple. Correct. Powerful.",
        points: 35,
        emoji: "😊",
      },
      {
        label: "Give her peace",
        reaction: "That one is special.",
        points: 40,
        emoji: "🕊️",
      },
      {
        label: "Add more green",
        reaction: "A practical solution to most problems.",
        points: 30,
        emoji: "💚",
      },
    ],
  },
  {
    id: "verse",
    eyebrow: "Question 3",
    title: "Which verse belongs on Lexi’s little green page?",
    subtitle: "This one was not random.",
    answers: [
      {
        label: "Romans 8:18",
        reaction: "Exactly. For I reckon...",
        points: 45,
        emoji: "📖",
      },
      {
        label: "The one about glory coming",
        reaction: "Yes. That is the one.",
        points: 40,
        emoji: "✨",
      },
      {
        label: "The one Lexi loves",
        reaction: "Correct because this quiz is clearly biased toward Lexi.",
        points: 40,
        emoji: "🌱",
      },
    ],
  },
  {
    id: "lexi",
    eyebrow: "Question 4",
    title: "What should this page quietly hope for Lexi today?",
    subtitle: "No wrong answers. Some answers are just greener.",
    answers: [
      {
        label: "A softer day",
        reaction: "That one feels peaceful.",
        points: 40,
        emoji: "🕊️",
      },
      {
        label: "A random smile",
        reaction: "Perfect. That was the whole plan.",
        points: 45,
        emoji: "😊",
      },
      {
        label: "A little more hope",
        reaction: "That answer gets extra leaves.",
        points: 45,
        emoji: "🌱",
      },
    ],
  },
];

const desktopNotes = [
  {
    text: "smile check pending",
    top: "13%",
    left: "8%",
    rotate: -9,
    delay: 0,
  },
  {
    text: "green levels rising",
    top: "16%",
    right: "7%",
    rotate: 8,
    delay: 0.3,
  },
  {
    text: "lexiiiii!iiiii",
    bottom: "18%",
    left: "10%",
    rotate: 7,
    delay: 0.6,
  },
  {
    text: "romans 8:18",
    bottom: "14%",
    right: "8%",
    rotate: -7,
    delay: 0.9,
  },
];

const wordSearchTargets = [
  {
    key: "BOIIIIII",
    label: "BOIIIIII",
    letters: ["B", "O", "I", "I", "I", "I", "I", "I"],
  },
  {
    key: "MURRAY",
    label: "MURRAY",
    letters: ["M", "U", "R", "R", "A", "Y"],
  },
  {
    key: "WINSTON",
    label: "WINSTON",
    letters: ["W", "I", "N", "S", "T", "O", "N"],
  },
  {
    key: "PORCUPINE",
    label: "Porcupine",
    letters: ["P", "O", "R", "C", "U", "P", "I", "N", "E"],
  },
  {
    key: "BEARDEDDRAGON",
    label: "BEARDED DRAGON",
    letters: [
      "B",
      "E",
      "A",
      "R",
      "D",
      "E",
      "D",
      "D",
      "R",
      "A",
      "G",
      "O",
      "N",
    ],
  },
  {
    key: "JESUS",
    label: "Jesus",
    letters: ["J", "E", "S", "U", "S"],
  },
  {
    key: "CRYING",
    label: "😭",
    letters: ["😭"],
  },
  {
    key: "PASSIVEAGGRESSIVE",
    label: "PASSIVE AGGRESSIVE",
    letters: [
      "P",
      "A",
      "S",
      "S",
      "I",
      "V",
      "E",
      "A",
      "G",
      "G",
      "R",
      "E",
      "S",
      "S",
      "I",
      "V",
      "E",
    ],
  },
  {
    key: "ANYWAYS",
    label: "ANYWAYS",
    letters: ["A", "N", "Y", "W", "A", "Y", "S"],
  },
];

const wordSearchAlphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "Y",
];

const wordSearchDirections = [
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
  { row: -1, col: 1 },
];

const verseWords = [
  "For",
  "I",
  "reckon",
  "that",
  "the",
  "sufferings",
  "of",
  "this",
  "present",
  "time",
  "are",
  "not",
  "worthy",
  "to",
  "be",
  "compared",
  "with",
  "the",
  "glory",
  "which",
  "shall",
  "be",
  "revealed",
  "in",
  "us",
];

function shuffleArray(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function randomSpot(power = 1) {
  return {
    x: (Math.floor(Math.random() * 110) - 55) * power,
    y: (Math.floor(Math.random() * 95) - 47) * power,
    rotate: Math.floor(Math.random() * 70) - 35,
  };
}

function randomLetter() {
  return wordSearchAlphabet[Math.floor(Math.random() * wordSearchAlphabet.length)];
}

function makeEmptyGrid(size) {
  return Array.from({ length: size }).map((_, row) =>
    Array.from({ length: size }).map((_, col) => ({
      id: `${row}-${col}`,
      row,
      col,
      letter: "",
      wordKeys: [],
    }))
  );
}

function canPlaceWord(grid, word, startRow, startCol, direction) {
  const size = grid.length;

  for (let i = 0; i < word.letters.length; i += 1) {
    const row = startRow + direction.row * i;
    const col = startCol + direction.col * i;

    if (row < 0 || row >= size || col < 0 || col >= size) return false;

    const cell = grid[row][col];

    if (cell.letter && cell.letter !== word.letters[i]) return false;
  }

  return true;
}

function placeWord(grid, word, startRow, startCol, direction) {
  const path = [];

  for (let i = 0; i < word.letters.length; i += 1) {
    const row = startRow + direction.row * i;
    const col = startCol + direction.col * i;

    grid[row][col] = {
      ...grid[row][col],
      letter: word.letters[i],
      wordKeys: [...grid[row][col].wordKeys, word.key],
    };

    path.push(`${row}-${col}`);
  }

  return path;
}

function buildWordSearchGrid() {
  const size = 18;
  const grid = makeEmptyGrid(size);
  const placedWords = [];

  const sortedWords = [...wordSearchTargets].sort(
    (a, b) => b.letters.length - a.letters.length
  );

  for (const word of sortedWords) {
    let placed = false;

    for (let attempt = 0; attempt < 500 && !placed; attempt += 1) {
      const direction =
        wordSearchDirections[
          Math.floor(Math.random() * wordSearchDirections.length)
        ];

      const startRow = Math.floor(Math.random() * size);
      const startCol = Math.floor(Math.random() * size);

      if (canPlaceWord(grid, word, startRow, startCol, direction)) {
        const path = placeWord(grid, word, startRow, startCol, direction);

        placedWords.push({
          ...word,
          path,
          found: false,
        });

        placed = true;
      }
    }
  }

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (!grid[row][col].letter) {
        grid[row][col] = {
          ...grid[row][col],
          letter: randomLetter(),
        };
      }
    }
  }

  return {
    grid,
    words: placedWords,
  };
}

function buildVerseTiles() {
  return shuffleArray(
    verseWords.map((word, index) => ({
      id: `${word}-${index}-${Date.now()}-${Math.random()}`,
      word,
      index,
      rotate: Math.floor(Math.random() * 24) - 12,
    }))
  );
}

function FloatingBlob({ className, duration = 8 }) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 28, 0],
        y: [0, -24, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function FloatingNote({ note }) {
  return (
    <motion.div
      className="pointer-events-none absolute hidden rounded-3xl border border-lime-200/15 bg-lime-200/10 px-5 py-3 text-xs font-black uppercase tracking-[0.24em] text-lime-100 shadow-2xl shadow-black/20 backdrop-blur-xl lg:block"
      style={{
        top: note.top,
        bottom: note.bottom,
        left: note.left,
        right: note.right,
        rotate: note.rotate,
      }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: [0, -12, 0],
        rotate: [note.rotate, note.rotate + 4, note.rotate],
      }}
      transition={{
        opacity: { duration: 0.6, delay: note.delay },
        y: {
          duration: 4.5,
          delay: note.delay,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: {
          duration: 5,
          delay: note.delay,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      {note.text}
    </motion.div>
  );
}

function ProgressDots({ step }) {
  const labels = ["Start", "Quiz", "Smile", "Games"];

  return (
    <div className="mx-auto mb-7 flex w-full max-w-md items-center justify-center gap-2">
      {labels.map((label, index) => {
        const active = index <= step;

        return (
          <div key={label} className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: active ? 1 : 0.86,
                opacity: active ? 1 : 0.45,
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                active
                  ? "bg-lime-300 text-emerald-950 shadow-lg shadow-lime-950/30"
                  : "bg-emerald-900 text-emerald-200"
              }`}
            >
              {index + 1}
            </motion.div>

            {index < labels.length - 1 && (
              <div
                className={`h-1 w-8 rounded-full ${
                  index < step ? "bg-lime-300" : "bg-emerald-900"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function MagneticCard({ children, className = "" }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 180,
    damping: 18,
  });

  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 180,
    damping: 18,
  });

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Page() {
  const [screen, setScreen] = useState("intro");
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [reaction, setReaction] = useState("");
  const [noCount, setNoCount] = useState(0);
  const [noSpot, setNoSpot] = useState({ x: 0, y: 0, rotate: 0 });
  const [sparkles, setSparkles] = useState([]);
  const [splashes, setSplashes] = useState([]);
  const [cursor, setCursor] = useState({ x: -400, y: -400 });
  const [desktopChaos, setDesktopChaos] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const [wordGrid, setWordGrid] = useState([]);
  const [wordList, setWordList] = useState([]);
  const [wordSelected, setWordSelected] = useState([]);
  const [wordStarted, setWordStarted] = useState(false);
  const [wordOver, setWordOver] = useState(false);
  const [wordTime, setWordTime] = useState(60);
  const [wordMistakes, setWordMistakes] = useState(0);
  const [badSelection, setBadSelection] = useState([]);

  const [verseTiles, setVerseTiles] = useState([]);
  const [versePicked, setVersePicked] = useState([]);
  const [verseStarted, setVerseStarted] = useState(false);
  const [verseOver, setVerseOver] = useState(false);
  const [verseTime, setVerseTime] = useState(55);
  const [verseMistakes, setVerseMistakes] = useState(0);
  const [wrongVerseId, setWrongVerseId] = useState(null);

  const currentQuestion = quizQuestions[quizIndex];

  useEffect(() => {
    function checkDesktop() {
      setIsDesktop(window.innerWidth >= 1024);
    }

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    return () => {
      window.removeEventListener("resize", checkDesktop);
    };
  }, []);

  useEffect(() => {
    if (!wordStarted || wordOver || screen !== "wordSearch") return;

    const timer = setInterval(() => {
      setWordTime((current) => {
        if (current <= 1) {
          clearInterval(timer);

          const nextBoard = buildWordSearchGrid();

          setWordStarted(false);
          setWordOver(true);
          setWordGrid(nextBoard.grid);
          setWordList(nextBoard.words);
          setWordSelected([]);
          setBadSelection([]);

          track("word_search_finished", {
            found: wordList.filter((word) => word.found).length,
            mistakes: wordMistakes,
            passed: false,
          });

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [wordStarted, wordOver, screen, wordList, wordMistakes]);

  useEffect(() => {
    if (!verseStarted || verseOver || screen !== "verseBuild") return;

    const timer = setInterval(() => {
      setVerseTime((current) => {
        if (current <= 1) {
          clearInterval(timer);
          setVerseOver(true);
          setVerseStarted(false);
          setVerseTiles(buildVerseTiles());
          setVersePicked([]);
          track("verse_build_finished", {
            picked: versePicked.length,
            mistakes: verseMistakes,
            passed: false,
          });
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [verseStarted, verseOver, screen, versePicked.length, verseMistakes]);

  const progressStep = useMemo(() => {
    if (screen === "intro") return 0;
    if (screen === "quiz") return 1;
    if (screen === "mood") return 2;
    return 3;
  }, [screen]);

  const smileScore = useMemo(() => {
    return Math.min(100, Math.round((score / 160) * 100) + 14);
  }, [score]);

  const yesScale = useMemo(() => Math.min(1 + noCount * 0.14, 2.25), [noCount]);

  const yesPadding = useMemo(() => {
    const x = Math.min(32 + noCount * 5, 72);
    const y = Math.min(16 + noCount * 2, 30);

    return {
      paddingLeft: x,
      paddingRight: x,
      paddingTop: y,
      paddingBottom: y,
    };
  }, [noCount]);

  const yesFontSize = useMemo(() => {
    return Math.min(18 + noCount * 1.2, 30);
  }, [noCount]);

  const noLabel = useMemo(() => {
    const labels = [
      "No",
      "Hmm no",
      "Not yet",
      "Still no",
      "Lexi please",
      "That button is panicking",
      "Green says pick the other one",
      "Okay but why",
      "This is getting personal",
      "Fine, I live over here now",
    ];

    return labels[Math.min(noCount, labels.length - 1)];
  }, [noCount]);

  const wordPassed =
    wordList.length > 0 && wordList.every((word) => word.found);

  const versePassed = versePicked.length >= verseWords.length;

  function makeSparkles(amount = 22, wild = false) {
    const next = Array.from({ length: amount }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * (wild ? 16 : 10) + 5,
      delay: Math.random() * 0.25,
      drift: Math.floor(Math.random() * 90) - 45,
    }));

    setSparkles(next);

    setTimeout(() => {
      setSparkles([]);
    }, wild ? 1700 : 1300);
  }

  function makeSplash(amount = 4) {
    const next = Array.from({ length: amount }).map((_, i) => ({
      id: `${Date.now()}-splash-${i}`,
      left: Math.random() * 92,
      top: Math.random() * 88,
      size: Math.random() * 180 + 80,
      rotate: Math.floor(Math.random() * 120) - 60,
      delay: Math.random() * 0.15,
    }));

    setSplashes(next);

    setTimeout(() => {
      setSplashes([]);
    }, 1200);
  }

  function handleMouseMove(event) {
    setCursor({
      x: event.clientX,
      y: event.clientY,
    });
  }

  async function handleStart() {
    await track("start_clicked");
    makeSparkles(32, true);
    makeSplash(3);
    setDesktopChaos((current) => current + 1);
    setScreen("quiz");
  }

  async function handleQuizAnswer(answer) {
    const nextAnswers = [
      ...answers,
      {
        questionId: currentQuestion.id,
        answer: answer.label,
        points: answer.points,
      },
    ];

    setAnswers(nextAnswers);
    setScore((current) => current + answer.points);
    setReaction(`${answer.emoji} ${answer.reaction}`);
    setDesktopChaos((current) => current + 1);
    makeSparkles(28, true);
    makeSplash(3);

    await track("quiz_answer_clicked", {
      questionId: currentQuestion.id,
      answer: answer.label,
      points: answer.points,
      quizIndex,
    });

    setTimeout(() => {
      setReaction("");

      if (quizIndex < quizQuestions.length - 1) {
        setQuizIndex((current) => current + 1);
      } else {
        setScreen("mood");
      }
    }, 950);
  }

  async function handleNo(trigger = "click") {
    const nextCount = noCount + 1;

    setNoCount(nextCount);
    setNoSpot(randomSpot(trigger === "hover" && isDesktop ? 1.75 : 1.1));
    setDesktopChaos((current) => current + 1);
    makeSparkles(trigger === "hover" ? 24 : 16, trigger === "hover");
    makeSplash(trigger === "hover" && isDesktop ? 3 : 1);

    await track("no_interaction", {
      trigger,
      noCount: nextCount,
      screen,
      isDesktop,
    });
  }

  async function handleYes() {
    await track("yes_clicked", {
      noCount,
      score,
      smileScore,
      answers,
      isDesktop,
    });

    setDesktopChaos((current) => current + 2);
    makeSparkles(48, true);
    makeSplash(5);

    if (isDesktop) {
      setScreen("gameHub");
    } else {
      setScreen("phoneSuspense");
    }
  }

  async function startWordSearch() {
    const board = buildWordSearchGrid();

    setWordGrid(board.grid);
    setWordList(board.words);
    setWordSelected([]);
    setWordStarted(true);
    setWordOver(false);
    setWordTime(60);
    setWordMistakes(0);
    setBadSelection([]);
    setDesktopChaos((current) => current + 1);
    makeSparkles(30, true);
    makeSplash(4);
    setScreen("wordSearch");

    await track("word_search_started");
  }

  async function pickWordCell(cell) {
    if (!wordStarted || wordOver) return;

    const cellId = `${cell.row}-${cell.col}`;

    if (wordSelected.includes(cellId)) return;

    const nextSelection = [...wordSelected, cellId];
    const remainingWords = wordList.filter((word) => !word.found);

    const isPrefix = remainingWords.some((word) =>
      nextSelection.every((id, index) => word.path[index] === id)
    );

    const completedWord = remainingWords.find(
      (word) =>
        word.path.length === nextSelection.length &&
        word.path.every((id, index) => id === nextSelection[index])
    );

    if (!isPrefix) {
      setBadSelection(nextSelection);
      setWordMistakes((current) => current + 1);
      setDesktopChaos((current) => current + 1);
      makeSplash(3);

      setTimeout(() => {
        setBadSelection([]);
        setWordSelected([]);
      }, 450);

      await track("word_search_wrong_letter", {
        cell: cellId,
        mistakes: wordMistakes + 1,
      });

      return;
    }

    setWordSelected(nextSelection);

    if (completedWord) {
      const nextWords = wordList.map((word) =>
        word.key === completedWord.key ? { ...word, found: true } : word
      );

      setWordList(nextWords);
      setWordSelected([]);
      makeSparkles(30, true);
      makeSplash(3);

      await track("word_search_found", {
        word: completedWord.label,
        found: nextWords.filter((word) => word.found).length,
      });

      if (nextWords.every((word) => word.found)) {
        setWordStarted(false);
        setWordOver(true);
        makeSparkles(70, true);
        makeSplash(7);

        await track("word_search_completed", {
          mistakes: wordMistakes,
          timeLeft: wordTime,
        });
      }
    }
  }

  async function retryWordSearch() {
    const board = buildWordSearchGrid();

    setWordGrid(board.grid);
    setWordList(board.words);
    setWordSelected([]);
    setWordStarted(true);
    setWordOver(false);
    setWordTime(60);
    setWordMistakes(0);
    setBadSelection([]);
    makeSparkles(24, true);
    makeSplash(3);

    await track("word_search_retried");
  }

  async function startVerseBuild() {
    setVerseTiles(buildVerseTiles());
    setVersePicked([]);
    setVerseStarted(true);
    setVerseOver(false);
    setVerseTime(55);
    setVerseMistakes(0);
    setWrongVerseId(null);
    setDesktopChaos((current) => current + 1);
    makeSparkles(34, true);
    makeSplash(4);
    setScreen("verseBuild");

    await track("verse_build_started");
  }

  async function pickVerseWord(tile) {
    if (!verseStarted || verseOver) return;

    const expectedIndex = versePicked.length;

    if (tile.index !== expectedIndex) {
      setWrongVerseId(tile.id);
      setVerseMistakes((current) => current + 1);
      setVerseTiles(buildVerseTiles());
      setVersePicked([]);
      setDesktopChaos((current) => current + 1);
      makeSplash(3);

      setTimeout(() => {
        setWrongVerseId(null);
      }, 450);

      await track("verse_build_wrong", {
        word: tile.word,
        expected: verseWords[expectedIndex],
        mistakes: verseMistakes + 1,
      });

      return;
    }

    const nextPicked = [...versePicked, tile];

    setVersePicked(nextPicked);
    setVerseTiles((current) => current.filter((item) => item.id !== tile.id));
    makeSparkles(12, true);

    await track("verse_build_correct", {
      word: tile.word,
      position: expectedIndex,
      progress: nextPicked.length,
    });

    if (nextPicked.length >= verseWords.length) {
      setVerseStarted(false);
      setVerseOver(true);
      makeSparkles(70, true);
      makeSplash(7);

      await track("verse_build_completed", {
        mistakes: verseMistakes,
        timeLeft: verseTime,
      });
    }
  }

  async function retryVerseBuild() {
    setVerseTiles(buildVerseTiles());
    setVersePicked([]);
    setVerseStarted(true);
    setVerseOver(false);
    setVerseTime(55);
    setVerseMistakes(0);
    setWrongVerseId(null);
    makeSparkles(24, true);
    makeSplash(3);

    await track("verse_build_retried");
  }

  async function unlockVerse() {
    await track("verse_unlocked", {
      wordMistakes,
      verseMistakes,
      score,
      smileScore,
    });

    makeSparkles(60, true);
    makeSplash(6);
    setScreen("final");
  }

  async function restart() {
    await track("restart_clicked", {
      previousScore: score,
      previousSmileScore: smileScore,
      previousNoCount: noCount,
      answers,
      wordMistakes,
      verseMistakes,
    });

    setScreen("intro");
    setQuizIndex(0);
    setScore(0);
    setAnswers([]);
    setReaction("");
    setNoCount(0);
    setNoSpot({ x: 0, y: 0, rotate: 0 });
    setDesktopChaos(0);
    setWordGrid([]);
    setWordList([]);
    setWordSelected([]);
    setWordStarted(false);
    setWordOver(false);
    setWordTime(60);
    setWordMistakes(0);
    setBadSelection([]);
    setVerseTiles([]);
    setVersePicked([]);
    setVerseStarted(false);
    setVerseOver(false);
    setVerseTime(55);
    setVerseMistakes(0);
    setWrongVerseId(null);
    makeSparkles(28, true);
    makeSplash(3);
  }

  return (
    <main>Mmmmm, i wonder what youre looking for</main>
    // <main
    //   onMouseMove={handleMouseMove}
    //   className="relative min-h-screen overflow-hidden bg-[#04140c] text-emerald-50"
    // >
    //   <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#84cc16_0%,transparent_26%),radial-gradient(circle_at_bottom_right,#22c55e_0%,transparent_32%),radial-gradient(circle_at_50%_0%,#365314_0%,transparent_28%),linear-gradient(135deg,#03140b,#064e3b,#1a2e05)] opacity-75" />

    //   <motion.div
    //     className="pointer-events-none fixed z-0 hidden h-80 w-80 rounded-full bg-lime-300/20 blur-3xl lg:block"
    //     animate={{
    //       x: cursor.x - 160,
    //       y: cursor.y - 160,
    //       scale: 1 + desktopChaos * 0.015,
    //     }}
    //     transition={{
    //       type: "spring",
    //       stiffness: 80,
    //       damping: 22,
    //     }}
    //   />

    //   <motion.div
    //     className="pointer-events-none fixed z-0 hidden h-28 w-28 rounded-full border border-lime-200/25 lg:block"
    //     animate={{
    //       x: cursor.x - 56,
    //       y: cursor.y - 56,
    //       rotate: desktopChaos * 18,
    //     }}
    //     transition={{
    //       type: "spring",
    //       stiffness: 120,
    //       damping: 18,
    //     }}
    //   />

    //   <motion.div
    //     className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#bef264_1px,transparent_1px),linear-gradient(90deg,#bef264_1px,transparent_1px)] [background-size:46px_46px]"
    //     animate={{
    //       backgroundPosition: `${desktopChaos * 18}px ${desktopChaos * 10}px`,
    //     }}
    //     transition={{
    //       duration: 0.8,
    //       ease: "easeOut",
    //     }}
    //   />

    //   <FloatingBlob
    //     duration={8}
    //     className="absolute left-8 top-12 h-44 w-44 rounded-full bg-lime-300/20 blur-3xl"
    //   />

    //   <FloatingBlob
    //     duration={10}
    //     className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-emerald-400/20 blur-3xl"
    //   />

    //   <FloatingBlob
    //     duration={12}
    //     className="absolute bottom-1/3 left-1/3 h-40 w-40 rounded-full bg-green-200/10 blur-3xl"
    //   />

    //   {desktopNotes.map((note) => (
    //     <FloatingNote key={note.text} note={note} />
    //   ))}

    //   <div className="pointer-events-none absolute inset-0">
    //     {splashes.map((splash) => (
    //       <motion.div
    //         key={splash.id}
    //         className="absolute hidden rounded-[48%_52%_58%_42%] bg-lime-300/20 blur-xl lg:block"
    //         style={{
    //           left: `${splash.left}%`,
    //           top: `${splash.top}%`,
    //           width: splash.size,
    //           height: splash.size * 0.75,
    //           rotate: splash.rotate,
    //         }}
    //         initial={{ opacity: 0, scale: 0 }}
    //         animate={{ opacity: [0, 0.9, 0], scale: [0, 1.1, 1.8] }}
    //         transition={{
    //           duration: 1.1,
    //           delay: splash.delay,
    //           ease: "easeOut",
    //         }}
    //       />
    //     ))}

    //     {sparkles.map((sparkle) => (
    //       <motion.span
    //         key={sparkle.id}
    //         className="absolute rounded-full bg-lime-200"
    //         style={{
    //           left: `${sparkle.left}%`,
    //           top: `${sparkle.top}%`,
    //           width: sparkle.size,
    //           height: sparkle.size,
    //         }}
    //         initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
    //         animate={{
    //           opacity: [0, 1, 0],
    //           scale: [0, 1.7, 0],
    //           x: sparkle.drift,
    //           y: -70,
    //         }}
    //         transition={{
    //           duration: 1.3,
    //           delay: sparkle.delay,
    //         }}
    //       />
    //     ))}
    //   </div>

    //   <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
    //     <AnimatePresence mode="wait">
    //       {screen === "intro" && (
    //         <MagneticCard
    //           key="intro"
    //           className="w-full max-w-3xl rounded-[2rem] border border-lime-200/20 bg-emerald-950/70 p-7 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
    //         >
    //           <motion.div
    //             initial={{ opacity: 0, y: 24, scale: 0.98 }}
    //             animate={{
    //               opacity: 1,
    //               y: 0,
    //               scale: 1,
    //               rotate: desktopChaos % 2 === 0 ? 0 : 1.2,
    //             }}
    //             exit={{ opacity: 0, y: -24, scale: 0.98 }}
    //             transition={{ duration: 0.45 }}
    //           >
    //             <ProgressDots step={progressStep} />

    //             <motion.div
    //               animate={{ rotate: [-5, 5, -5], y: [0, -4, 0] }}
    //               transition={{
    //                 duration: 3,
    //                 repeat: Infinity,
    //                 ease: "easeInOut",
    //               }}
    //               className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-lime-300 text-5xl shadow-xl shadow-lime-950/40"
    //             >
    //               🍃
    //             </motion.div>

    //             <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
    //               For Lexi
    //             </p>

    //             <h1 className="mb-5 text-4xl font-black tracking-tight text-lime-50 md:text-6xl">
    //               Lexi’s Smile Quiz
    //             </h1>

    //             <p className="mx-auto mb-8 max-w-xl text-base leading-7 text-emerald-100/90 md:text-lg">
    //               A tiny green quiz made for one person only. Nothing too serious.
    //               Just a few questions, a runaway button, and a little reminder that
    //               good things are still ahead.
    //             </p>

    //             <div className="mb-8 rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-5 lg:hidden">
    //               <p className="text-sm font-black uppercase tracking-[0.25em] text-lime-200">
    //                 Tiny phone preview
    //               </p>
    //               <p className="mt-3 text-emerald-100/85">
    //                 This works here, but the full chaotic green version unlocks on a
    //                 computer.
    //               </p>
    //             </div>

    //             <div className="mb-8 hidden gap-3 lg:grid lg:grid-cols-3">
    //               {[
                   
    //               ].map(([number, label], index) => (
    //                 <motion.div
    //                   key={`${number}-${label}-${index}`}
    //                   whileHover={{
    //                     y: -8,
    //                     rotate: index === 1 ? 3 : -3,
    //                     scale: 1.04,
    //                   }}
    //                   transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //                   className="rounded-3xl border border-lime-200/10 bg-lime-200/5 p-4"
    //                 >
    //                   <p className="text-2xl font-black text-lime-200 md:text-3xl">
    //                     {number}
    //                   </p>
    //                   <p className="text-sm text-emerald-100/75">{label}</p>
    //                 </motion.div>
    //               ))}
    //             </div>

    //             <motion.button
    //               onClick={handleStart}
    //               whileHover={{
    //                 scale: 1.06,
    //                 rotate: -1,
    //                 boxShadow: "0 24px 80px rgba(190, 242, 100, 0.25)",
    //               }}
    //               transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //               whileTap={{ scale: 0.97 }}
    //               className="rounded-full bg-lime-300 px-8 py-4 text-lg font-extrabold text-emerald-950 shadow-xl shadow-lime-950/30 transition hover:bg-lime-200"
    //             >
    //               Start the quiz
    //             </motion.button>
    //           </motion.div>
    //         </MagneticCard>
    //       )}

    //       {screen === "quiz" && currentQuestion && (
    //         <MagneticCard
    //           key={`quiz-${currentQuestion.id}`}
    //           className="w-full max-w-4xl rounded-[2rem] border border-lime-200/20 bg-[#082215]/80 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
    //         >
    //           <motion.div
    //             initial={{ opacity: 0, y: 24, scale: 0.98 }}
    //             animate={{ opacity: 1, y: 0, scale: 1 }}
    //             exit={{ opacity: 0, y: -24, scale: 0.98 }}
    //             transition={{ duration: 0.45 }}
    //           >
    //             <ProgressDots step={progressStep} />

    //             <div className="mb-8 text-center">
    //               <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
    //                 {currentQuestion.eyebrow}
    //               </p>

    //               <h2 className="mb-4 text-3xl font-black tracking-tight text-lime-50 md:text-5xl">
    //                 {currentQuestion.title}
    //               </h2>

    //               <p className="mx-auto max-w-2xl text-emerald-100/85">
    //                 {currentQuestion.subtitle}
    //               </p>
    //             </div>

    //             <div className="grid gap-4 md:grid-cols-3">
    //               {currentQuestion.answers.map((answer, index) => (
    //                 <motion.button
    //                   key={answer.label}
    //                   onClick={() => handleQuizAnswer(answer)}
    //                   whileHover={{
    //                     y: -14,
    //                     scale: 1.04,
    //                     rotate: index === 1 ? 2 : -2,
    //                   }}
    //                   transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //                   whileTap={{ scale: 0.96 }}
    //                   className="group rounded-3xl border border-lime-200/15 bg-lime-200/10 p-6 text-left shadow-lg shadow-black/20 transition hover:bg-lime-200/15"
    //                 >
    //                   <motion.div
    //                     className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-300 text-3xl shadow-lg shadow-black/20"
    //                     whileHover={{
    //                       rotate: 18,
    //                       scale: 1.15,
    //                     }}
    //                     transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //                   >
    //                     {answer.emoji}
    //                   </motion.div>

    //                   <p className="text-xl font-black text-lime-50">
    //                     {answer.label}
    //                   </p>

    //                   <p className="mt-3 text-sm leading-6 text-emerald-100/75">
    //                     Pick this one.
    //                   </p>
    //                 </motion.button>
    //               ))}
    //             </div>

    //             <div className="mt-8 rounded-3xl border border-lime-200/10 bg-lime-200/5 p-4 text-center">
    //               <p className="text-sm text-emerald-100/80">
    //                 Smile score so far:{" "}
    //                 <span className="font-black text-lime-200">{score}</span>
    //               </p>
    //             </div>

    //             <AnimatePresence>
    //               {reaction && (
    //                 <motion.div
    //                   initial={{ opacity: 0, y: 18, scale: 0.95 }}
    //                   animate={{
    //                     opacity: 1,
    //                     y: 0,
    //                     scale: [1, 1.04, 1],
    //                     rotate: [0, -1.5, 1.5, 0],
    //                   }}
    //                   exit={{ opacity: 0, y: -18, scale: 0.95 }}
    //                   transition={{ duration: 0.45, ease: "easeOut" }}
    //                   className="fixed inset-x-5 bottom-8 z-30 mx-auto max-w-xl rounded-3xl border border-lime-200/20 bg-emerald-950/95 p-5 text-center text-lg font-bold text-lime-50 shadow-2xl shadow-black/40 backdrop-blur-xl"
    //                 >
    //                   {reaction}
    //                 </motion.div>
    //               )}
    //             </AnimatePresence>
    //           </motion.div>
    //         </MagneticCard>
    //       )}

    //       {screen === "mood" && (
    //         <MagneticCard
    //           key="mood"
    //           className="relative w-full max-w-4xl rounded-[2rem] border border-emerald-200/20 bg-[#092315]/80 p-7 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
    //         >
    //           <motion.div
    //             initial={{ opacity: 0, y: 24, scale: 0.98 }}
    //             animate={{ opacity: 1, y: 0, scale: 1 }}
    //             exit={{ opacity: 0, y: -24, scale: 0.98 }}
    //             transition={{ duration: 0.45 }}
    //           >
    //             <ProgressDots step={progressStep} />

    //             <div className="mb-6 flex justify-center gap-3 text-4xl">
    //               {["🌿", "🫒", "🍀"].map((emoji, index) => (
    //                 <motion.span
    //                   key={emoji}
    //                   animate={{
    //                     y: [0, -8, 0],
    //                     rotate: [0, index === 1 ? 10 : -10, 0],
    //                   }}
    //                   transition={{
    //                     duration: 1.5,
    //                     repeat: Infinity,
    //                     delay: index * 0.2,
    //                   }}
    //                 >
    //                   {emoji}
    //                 </motion.span>
    //               ))}
    //             </div>

    //             <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
    //               One last thing
    //             </p>

    //             <h2 className="mb-4 text-3xl font-black tracking-tight text-lime-50 md:text-5xl">
    //               Lexi, did this make you smile?
    //             </h2>

    //             <p className="mx-auto mb-10 max-w-xl text-emerald-100/85">
    //               Be honest. But the other button is extremely dramatic and may not
    //               stay where you left it.
    //             </p>

    //             <div className="relative mx-auto flex min-h-[300px] w-full max-w-2xl items-center justify-center gap-5">
    //               <motion.button
    //                 onClick={handleYes}
    //                 animate={{
    //                   scale: yesScale,
    //                 }}
    //                 style={{
    //                   ...yesPadding,
    //                   fontSize: yesFontSize,
    //                 }}
    //                 whileHover={{
    //                   scale: yesScale + 0.08,
    //                   rotate: -1,
    //                 }}
    //                 transition={{
    //                   type: "spring",
    //                   stiffness: 220,
    //                   damping: 16,
    //                 }}
    //                 whileTap={{
    //                   scale: Math.max(yesScale - 0.05, 0.95),
    //                 }}
    //                 className="z-20 rounded-full bg-lime-300 font-black text-emerald-950 shadow-2xl shadow-lime-950/40 transition hover:bg-lime-200"
    //               >
    //                 I smiled
    //               </motion.button>

    //               <motion.button
    //                 onClick={() => handleNo("click")}
    //                 onMouseEnter={() => handleNo("hover")}
    //                 animate={{
    //                   x: noSpot.x * (isDesktop ? 3.8 : 2.4),
    //                   y: noSpot.y * (isDesktop ? 3.8 : 2.4),
    //                   rotate: noSpot.rotate,
    //                   scale: Math.max(1 - noCount * 0.045, 0.66),
    //                 }}
    //                 transition={{
    //                   type: "spring",
    //                   stiffness: 260,
    //                   damping: 14,
    //                 }}
    //                 className="z-10 rounded-full border border-emerald-200/25 bg-emerald-900 px-7 py-4 text-base font-bold text-emerald-50 shadow-xl shadow-black/25 transition hover:bg-emerald-800"
    //               >
    //                 {noLabel}
    //               </motion.button>
    //             </div>

    //             <div className="mt-8 rounded-3xl border border-lime-200/10 bg-lime-200/5 p-4">
    //               <p className="text-sm text-emerald-100/80">
    //                 Times Lexi tried to say no:{" "}
    //                 <span className="font-black text-lime-200">{noCount}</span>
    //               </p>
    //             </div>
    //           </motion.div>
    //         </MagneticCard>
    //       )}

    //       {screen === "phoneSuspense" && (
    //         <motion.div
    //           key="phoneSuspense"
    //           initial={{ opacity: 0, y: 24, scale: 0.98 }}
    //           animate={{ opacity: 1, y: 0, scale: 1 }}
    //           exit={{ opacity: 0, y: -24, scale: 0.98 }}
    //           transition={{ duration: 0.45 }}
    //           className="w-full max-w-3xl rounded-[2rem] border border-lime-200/20 bg-emerald-950/75 p-7 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
    //         >
    //           <motion.div
    //             className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-lime-300 text-5xl shadow-xl shadow-lime-950/40"
    //             animate={{
    //               rotate: [0, 8, -8, 0],
    //               scale: [1, 1.08, 1],
    //             }}
    //             transition={{
    //               duration: 1.8,
    //               repeat: Infinity,
    //             }}
    //           >
    //             👀
    //           </motion.div>

    //           <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
    //             Suspiciously locked
    //           </p>

    //           <h2 className="mb-5 text-4xl font-black text-lime-50 md:text-6xl">
    //             Lexi, this is not the full thing.
    //           </h2>

    //           <p className="mx-auto mb-8 max-w-xl text-lg leading-8 text-emerald-100/90">
    //             The phone version is only the preview. The chaotic green games,
    //             the hidden words, and the Romans 8:18 unlock are waiting on a
    //             computer.
    //           </p>

    //           <div className="mx-auto mb-8 max-w-xl rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-6 text-left">
    //             <p className="mb-2 text-sm font-black uppercase tracking-[0.25em] text-lime-200">
    //               What is waiting
    //             </p>
    //             <p className="text-emerald-100/85">
    //               A real word search made out of things you say, then a timed
    //               puzzle where you rebuild your favorite verse from scratch.
    //             </p>
    //           </div>

    //           <motion.button
    //             onClick={unlockVerse}
    //             whileHover={{ scale: 1.04, rotate: -1 }}
    //             whileTap={{ scale: 0.97 }}
    //             transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //             className="rounded-full bg-lime-300 px-8 py-4 text-lg font-black text-emerald-950 shadow-xl shadow-lime-950/30"
    //           >
    //             Fine, show me the verse preview
    //           </motion.button>
    //         </motion.div>
    //       )}

    //       {screen === "gameHub" && (
    //         <motion.div
    //           key="gameHub"
    //           initial={{ opacity: 0, y: 24, scale: 0.98 }}
    //           animate={{ opacity: 1, y: 0, scale: 1 }}
    //           exit={{ opacity: 0, y: -24, scale: 0.98 }}
    //           transition={{ duration: 0.45 }}
    //           className="w-full max-w-5xl rounded-[2rem] border border-lime-200/20 bg-emerald-950/75 p-7 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
    //         >
    //           <ProgressDots step={progressStep} />

    //           <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
    //             Desktop unlocked
    //           </p>

    //           <h2 className="mb-5 text-4xl font-black text-lime-50 md:text-6xl">
    //             Two green challenges.
    //           </h2>

    //           <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-emerald-100/90">
    //             They are both mysteries
    //           </p>

    //           <div className="grid gap-5 md:grid-cols-2">
    //             <motion.button
    //               onClick={startWordSearch}
    //               whileHover={{ y: -12, scale: 1.03, rotate: -1 }}
    //               whileTap={{ scale: 0.97 }}
    //               transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //               className="rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-7 text-left shadow-xl shadow-black/20"
    //             >
    //               <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-lime-200">
    //                 Game 1
    //               </p>
    //               <h3 className="mb-3 text-3xl font-black text-lime-50">
    //                 Mystery Game 1
    //               </h3>
    //               <p className="mb-5 text-emerald-100/80">
                   
    //               </p>
    //               <span className="font-black text-lime-100">
    //                 Start Game
    //               </span>
    //             </motion.button>

    //             <motion.button
    //               onClick={wordPassed ? startVerseBuild : undefined}
    //               disabled={!wordPassed}
    //               whileHover={{
    //                 y: wordPassed ? -12 : 0,
    //                 scale: wordPassed ? 1.03 : 1,
    //                 rotate: wordPassed ? 1 : 0,
    //               }}
    //               whileTap={{ scale: wordPassed ? 0.97 : 1 }}
    //               transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //               className={`rounded-[2rem] border p-7 text-left shadow-xl shadow-black/20 ${
    //                 wordPassed
    //                   ? "border-lime-200/15 bg-lime-200/10"
    //                   : "border-emerald-800 bg-emerald-950/60 opacity-60"
    //               }`}
    //             >
    //               <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-lime-200">
    //                 Game 2
    //               </p>
    //               <h3 className="mb-3 text-3xl font-black text-lime-50">
    //                 Mystery Game 2
    //               </h3>
    //               <p className="mb-5 text-emerald-100/80">
          
    //               </p>
    //               <span className="font-black text-lime-100">
    //                 {wordPassed ? "Start Game" : "Locked until Game 1"}
    //               </span>
    //             </motion.button>
    //           </div>
    //         </motion.div>
    //       )}

    //       {screen === "wordSearch" && (
    //         <motion.div
    //           key="wordSearch"
    //           initial={{ opacity: 0, y: 24, scale: 0.98 }}
    //           animate={{ opacity: 1, y: 0, scale: 1 }}
    //           exit={{ opacity: 0, y: -24, scale: 0.98 }}
    //           transition={{ duration: 0.45 }}
    //           className="w-full max-w-7xl rounded-[2rem] border border-lime-200/20 bg-[#071f13]/80 p-7 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
    //         >
    //           <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
    //             Game 1
    //           </p>

    //           <h2 className="mb-4 text-4xl font-black tracking-tight text-lime-50 md:text-6xl">
    //             Find Lexi’s words
    //           </h2>

    //           <p className="mx-auto mb-8 max-w-2xl text-emerald-100/85">
    //             Click the letters in order to find each hidden word. Wrong letter,
    //             the selection resets.
    //           </p>

    //           <div className="mb-5 grid gap-3 md:grid-cols-3">
    //             <div className="rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-5 text-left">
    //               <p className="text-sm font-black uppercase tracking-[0.25em] text-lime-200">
    //                 Time
    //               </p>
    //               <p className="text-4xl font-black text-lime-50">{wordTime}s</p>
    //             </div>

    //             <div className="rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-5 text-left">
    //               <p className="text-sm font-black uppercase tracking-[0.25em] text-lime-200">
    //                 Found
    //               </p>
    //               <p className="text-4xl font-black text-lime-50">
    //                 {wordList.filter((word) => word.found).length}/
    //                 {wordSearchTargets.length}
    //               </p>
    //             </div>

    //             <div className="rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-5 text-left">
    //               <p className="text-sm font-black uppercase tracking-[0.25em] text-lime-200">
    //                 Mistakes
    //               </p>
    //               <p className="text-4xl font-black text-lime-50">
    //                 {wordMistakes}
    //               </p>
    //             </div>
    //           </div>

    //           {!wordStarted && !wordOver && (
    //             <motion.button
    //               onClick={retryWordSearch}
    //               whileHover={{ scale: 1.05, rotate: -1 }}
    //               whileTap={{ scale: 0.97 }}
    //               transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //               className="mb-8 rounded-full bg-lime-300 px-8 py-4 text-lg font-black text-emerald-950 shadow-xl shadow-lime-950/30"
    //             >
    //               Start word search
    //             </motion.button>
    //           )}

    //           <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
    //             <motion.div
    //               animate={
    //                 badSelection.length > 0
    //                   ? { x: [0, -10, 10, -8, 8, 0] }
    //                   : { x: 0 }
    //               }
    //               transition={{ duration: 0.35 }}
    //               className="relative overflow-hidden rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-4"
    //             >
    //               <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#bef264_1px,transparent_1px),linear-gradient(90deg,#bef264_1px,transparent_1px)] [background-size:34px_34px]" />

    //               <div
    //                 className="relative z-10 mx-auto grid max-w-[720px] gap-1"
    //                 style={{
    //                   gridTemplateColumns: `repeat(${
    //                     wordGrid.length || 18
    //                   }, minmax(0, 1fr))`,
    //                 }}
    //               >
    //                 {wordGrid.flat().map((cell) => {
    //                   const id = `${cell.row}-${cell.col}`;
    //                   const isSelected = wordSelected.includes(id);
    //                   const isBad = badSelection.includes(id);
    //                   const isFound = wordList.some(
    //                     (word) => word.found && word.path.includes(id)
    //                   );

    //                   return (
    //                     <motion.button
    //                       key={cell.id}
    //                       onClick={() => pickWordCell(cell)}
    //                       whileHover={{
    //                         scale: wordStarted && !wordOver ? 1.16 : 1,
    //                         zIndex: 20,
    //                       }}
    //                       whileTap={{
    //                         scale: wordStarted && !wordOver ? 0.9 : 1,
    //                       }}
    //                       className={`aspect-square rounded-lg border text-xs font-black shadow-sm transition md:text-sm ${
    //                         isBad
    //                           ? "border-red-300 bg-red-700 text-white"
    //                           : isFound
    //                           ? "border-lime-200 bg-lime-300 text-emerald-950"
    //                           : isSelected
    //                           ? "border-lime-200 bg-lime-100 text-emerald-950"
    //                           : "border-lime-200/10 bg-emerald-950/80 text-lime-50 hover:bg-emerald-900"
    //                       }`}
    //                     >
    //                       {cell.letter}
    //                     </motion.button>
    //                   );
    //                 })}
    //               </div>
    //             </motion.div>

    //             <div className="rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-5 text-left">
    //               <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-lime-200">
    //                 Words to find
    //               </p>

    //               <div className="grid gap-3">
    //                 {wordList.map((word) => (
    //                   <div
    //                     key={word.key}
    //                     className={`rounded-2xl border px-4 py-3 font-black ${
    //                       word.found
    //                         ? "border-lime-200 bg-lime-300 text-emerald-950"
    //                         : "border-lime-200/10 bg-emerald-950/70 text-emerald-100"
    //                     }`}
    //                   >
    //                     {word.found ? "✓ " : ""}
    //                     {word.label}
    //                   </div>
    //                 ))}
    //               </div>
    //             </div>
    //           </div>

    //           <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
    //             {wordOver && wordPassed && (
    //               <motion.button
    //                 onClick={startVerseBuild}
    //                 whileHover={{ scale: 1.05, rotate: -1 }}
    //                 whileTap={{ scale: 0.97 }}
    //                 transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //                 className="rounded-full bg-lime-300 px-8 py-4 text-lg font-black text-emerald-950 shadow-xl shadow-lime-950/30"
    //               >
    //                 Start Romans 8:18 puzzle
    //               </motion.button>
    //             )}

    //             {wordOver && !wordPassed && (
    //               <motion.button
    //                 onClick={retryWordSearch}
    //                 whileHover={{ scale: 1.05, rotate: -1 }}
    //                 whileTap={{ scale: 0.97 }}
    //                 transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //                 className="rounded-full bg-lime-300 px-8 py-4 text-lg font-black text-emerald-950 shadow-xl shadow-lime-950/30"
    //               >
    //                 Try a new board
    //               </motion.button>
    //             )}
    //           </div>
    //         </motion.div>
    //       )}

    //       {screen === "verseBuild" && (
    //         <motion.div
    //           key="verseBuild"
    //           initial={{ opacity: 0, y: 24, scale: 0.98 }}
    //           animate={{ opacity: 1, y: 0, scale: 1 }}
    //           exit={{ opacity: 0, y: -24, scale: 0.98 }}
    //           transition={{ duration: 0.45 }}
    //           className="w-full max-w-6xl rounded-[2rem] border border-lime-200/20 bg-[#071f13]/80 p-7 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
    //         >
    //           <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
    //             Game 2
    //           </p>

    //           <h2 className="mb-4 text-4xl font-black tracking-tight text-lime-50 md:text-6xl">
    //             Rebuild Romans 8:18
    //           </h2>

    //           <p className="mx-auto mb-8 max-w-2xl text-emerald-100/85">
    //             Pick the words in order. One wrong word reshuffles everything.
    //           </p>

    //           <div className="mb-5 grid gap-3 md:grid-cols-3">
    //             <div className="rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-5 text-left">
    //               <p className="text-sm font-black uppercase tracking-[0.25em] text-lime-200">
    //                 Time
    //               </p>
    //               <p className="text-4xl font-black text-lime-50">
    //                 {verseTime}s
    //               </p>
    //             </div>

    //             <div className="rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-5 text-left">
    //               <p className="text-sm font-black uppercase tracking-[0.25em] text-lime-200">
    //                 Progress
    //               </p>
    //               <p className="text-4xl font-black text-lime-50">
    //                 {versePicked.length}/{verseWords.length}
    //               </p>
    //             </div>

    //             <div className="rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-5 text-left">
    //               <p className="text-sm font-black uppercase tracking-[0.25em] text-lime-200">
    //                 Mistakes
    //               </p>
    //               <p className="text-4xl font-black text-lime-50">
    //                 {verseMistakes}
    //               </p>
    //             </div>
    //           </div>

    //           {!verseStarted && !verseOver && (
    //             <motion.button
    //               onClick={retryVerseBuild}
    //               whileHover={{ scale: 1.05, rotate: -1 }}
    //               whileTap={{ scale: 0.97 }}
    //               transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //               className="mb-8 rounded-full bg-lime-300 px-8 py-4 text-lg font-black text-emerald-950 shadow-xl shadow-lime-950/30"
    //             >
    //               Start verse puzzle
    //             </motion.button>
    //           )}

    //           <div className="mb-5 min-h-[120px] rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-5 text-left">
    //             <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-lime-200">
    //               Built verse
    //             </p>

    //             <p className="text-xl font-semibold leading-9 text-lime-50">
    //               {versePicked.map((item) => item.word).join(" ")}
    //               {versePicked.length > 0 ? " " : ""}
    //               <span className="text-emerald-400">
    //                 {versePicked.length < verseWords.length ? "..." : ""}
    //               </span>
    //             </p>
    //           </div>

    //           <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-5">
    //             <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#bef264_1px,transparent_1px),linear-gradient(90deg,#bef264_1px,transparent_1px)] [background-size:34px_34px]" />

    //             <div className="relative z-10 flex flex-wrap justify-center gap-3">
    //               {verseTiles.map((tile) => (
    //                 <motion.button
    //                   key={tile.id}
    //                   onClick={() => pickVerseWord(tile)}
    //                   animate={
    //                     wrongVerseId === tile.id
    //                       ? {
    //                           x: [0, -12, 12, -8, 8, 0],
    //                           backgroundColor: [
    //                             "rgba(127, 29, 29, 0.9)",
    //                             "rgba(127, 29, 29, 0.9)",
    //                           ],
    //                         }
    //                       : {
    //                           x: 0,
    //                         }
    //                   }
    //                   transition={{
    //                     duration: wrongVerseId === tile.id ? 0.35 : 0.2,
    //                   }}
    //                   whileHover={{
    //                     y: verseOver ? 0 : -8,
    //                     scale: verseOver ? 1 : 1.05,
    //                     rotate: verseOver ? 0 : tile.rotate,
    //                   }}
    //                   whileTap={{ scale: verseOver ? 1 : 0.95 }}
    //                   disabled={verseOver}
    //                   className="rounded-full border border-lime-200/15 bg-emerald-950 px-5 py-3 text-sm font-black text-lime-50 shadow-lg shadow-black/20 transition hover:bg-emerald-900"
    //                 >
    //                   {tile.word}
    //                 </motion.button>
    //               ))}
    //             </div>
    //           </div>

    //           <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
    //             {verseOver && versePassed && (
    //               <motion.button
    //                 onClick={unlockVerse}
    //                 whileHover={{ scale: 1.05, rotate: -1 }}
    //                 whileTap={{ scale: 0.97 }}
    //                 transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //                 className="rounded-full bg-lime-300 px-8 py-4 text-lg font-black text-emerald-950 shadow-xl shadow-lime-950/30"
    //               >
    //                 Open Romans 8:18
    //               </motion.button>
    //             )}

    //             {verseOver && !versePassed && (
    //               <motion.button
    //                 onClick={retryVerseBuild}
    //                 whileHover={{ scale: 1.05, rotate: -1 }}
    //                 whileTap={{ scale: 0.97 }}
    //                 transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //                 className="rounded-full bg-lime-300 px-8 py-4 text-lg font-black text-emerald-950 shadow-xl shadow-lime-950/30"
    //               >
    //                 Try again
    //               </motion.button>
    //             )}
    //           </div>
    //         </motion.div>
    //       )}

    //       {screen === "final" && (
    //         <MagneticCard
    //           key="final"
    //           className="w-full max-w-3xl rounded-[2rem] border border-lime-200/20 bg-[#071f13]/80 p-7 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
    //         >
    //           <motion.div
    //             initial={{ opacity: 0, y: 24, scale: 0.98 }}
    //             animate={{ opacity: 1, y: 0, scale: 1 }}
    //             exit={{ opacity: 0, y: -24, scale: 0.98 }}
    //             transition={{ duration: 0.45 }}
    //           >
    //             <motion.div
    //               className="mb-6 text-7xl"
    //               animate={{
    //                 rotate: [0, -8, 8, 0],
    //                 scale: [1, 1.1, 1],
    //               }}
    //               transition={{
    //                 duration: 2,
    //                 repeat: Infinity,
    //               }}
    //             >
    //               🍀
    //             </motion.div>

    //             <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
    //               Romans 8:18
    //             </p>

    //             <h2 className="mb-5 text-4xl font-black text-lime-50 md:text-6xl">
    //               For I reckon...
    //             </h2>

    //             <motion.div
    //               whileHover={{
    //                 scale: 1.02,
    //                 rotate: -1,
    //               }}
    //               transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //               className="mx-auto mb-8 max-w-2xl rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-6 text-left shadow-xl shadow-black/20"
    //             >
    //               <p className="text-xl font-semibold leading-9 text-lime-50 md:text-2xl">
    //                 “For I reckon that the sufferings of this present time are not
    //                 worthy to be compared with the glory which shall be revealed in
    //                 us.”
    //               </p>

    //               <p className="mt-5 text-right text-sm font-black uppercase tracking-[0.25em] text-lime-200">
    //                 Romans 8:18
    //               </p>
    //             </motion.div>

    //             <p className="mx-auto mb-8 max-w-xl text-lg leading-8 text-emerald-100/90">
    //               Lexi, this was just a small green page, but the point is simple:
    //               there is more ahead, there is glory ahead, and today still has room
    //               for a smile.
    //             </p>

    //             <motion.button
    //               onClick={restart}
    //               whileHover={{
    //                 scale: 1.06,
    //                 rotate: -1,
    //               }}
    //               transition={{ type: "spring", stiffness: 220, damping: 16 }}
    //               whileTap={{ scale: 0.97 }}
    //               className="rounded-full bg-lime-300 px-8 py-4 text-lg font-extrabold text-emerald-950 shadow-xl shadow-lime-950/30 transition hover:bg-lime-200"
    //             >
    //               Run it again
    //             </motion.button>
    //           </motion.div>
    //         </MagneticCard>
    //       )}
    //     </AnimatePresence>
    //   </section>
    // </main>
  );
}