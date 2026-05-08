"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        reaction: "Classy answer. Very Lexi-coded.",
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
];

function randomSpot() {
  return {
    x: Math.floor(Math.random() * 90) - 45,
    y: Math.floor(Math.random() * 80) - 40,
    rotate: Math.floor(Math.random() * 44) - 22,
  };
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

function ProgressDots({ step }) {
  const labels = ["Start", "Quiz", "Smile", "Verse"];

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

export default function Page() {
  const [screen, setScreen] = useState("intro");
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [reaction, setReaction] = useState("");
  const [noCount, setNoCount] = useState(0);
  const [noSpot, setNoSpot] = useState({ x: 0, y: 0, rotate: 0 });
  const [sparkles, setSparkles] = useState([]);

  const currentQuestion = quizQuestions[quizIndex];

  const progressStep = useMemo(() => {
    if (screen === "intro") return 0;
    if (screen === "quiz") return 1;
    if (screen === "mood") return 2;
    return 3;
  }, [screen]);

  const smileScore = useMemo(() => {
    return Math.min(100, Math.round((score / 120) * 100) + 14);
  }, [score]);

  const yesScale = useMemo(() => Math.min(1 + noCount * 0.2, 2.6), [noCount]);

  const noLabel = useMemo(() => {
    const labels = [
      "No",
      "Hmm no",
      "Not yet",
      "Still no",
      "Lexi please",
      "That button is panicking",
      "Green says yes",
      "Okay but why",
      "This is getting personal",
      "Fine, I live over here now",
    ];

    return labels[Math.min(noCount, labels.length - 1)];
  }, [noCount]);

  function makeSparkles(amount = 22) {
    const next = Array.from({ length: amount }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 10 + 5,
      delay: Math.random() * 0.25,
    }));

    setSparkles(next);

    setTimeout(() => {
      setSparkles([]);
    }, 1300);
  }

  async function handleStart() {
    await track("start_clicked");
    makeSparkles();
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
    makeSparkles(16);

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
    setNoSpot(randomSpot());
    makeSparkles(12);

    await track("no_interaction", {
      trigger,
      noCount: nextCount,
      screen,
    });
  }

  async function handleYes() {
    await track("yes_clicked", {
      noCount,
      score,
      smileScore,
      answers,
    });

    makeSparkles(34);
    setScreen("result");
  }

  async function handleFinalChoice(choice) {
    await track("final_choice_clicked", {
      choice,
      score,
      smileScore,
      noCount,
      answers,
    });

    makeSparkles(36);
    setScreen("final");
  }

  async function restart() {
    await track("restart_clicked", {
      previousScore: score,
      previousSmileScore: smileScore,
      previousNoCount: noCount,
      answers,
    });

    setScreen("intro");
    setQuizIndex(0);
    setScore(0);
    setAnswers([]);
    setReaction("");
    setNoCount(0);
    setNoSpot({ x: 0, y: 0, rotate: 0 });
    makeSparkles(20);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04140c] text-emerald-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#84cc16_0%,transparent_26%),radial-gradient(circle_at_bottom_right,#22c55e_0%,transparent_32%),radial-gradient(circle_at_50%_0%,#365314_0%,transparent_28%),linear-gradient(135deg,#03140b,#064e3b,#1a2e05)] opacity-75" />

      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#bef264_1px,transparent_1px),linear-gradient(90deg,#bef264_1px,transparent_1px)] [background-size:46px_46px]" />

      <FloatingBlob
        duration={8}
        className="absolute left-8 top-12 h-44 w-44 rounded-full bg-lime-300/20 blur-3xl"
      />

      <FloatingBlob
        duration={10}
        className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-emerald-400/20 blur-3xl"
      />

      <FloatingBlob
        duration={12}
        className="absolute bottom-1/3 left-1/3 h-40 w-40 rounded-full bg-green-200/10 blur-3xl"
      />

      <div className="pointer-events-none absolute inset-0">
        {sparkles.map((sparkle) => (
          <motion.span
            key={sparkle.id}
            className="absolute rounded-full bg-lime-200"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              width: sparkle.size,
              height: sparkle.size,
            }}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: -45,
            }}
            transition={{
              duration: 1.1,
              delay: sparkle.delay,
            }}
          />
        ))}
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
        <AnimatePresence mode="wait">
          {screen === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-3xl rounded-[2rem] border border-lime-200/20 bg-emerald-950/70 p-7 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
            >
              <ProgressDots step={progressStep} />

              <motion.div
                animate={{ rotate: [-5, 5, -5], y: [0, -4, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-lime-300 text-5xl shadow-xl shadow-lime-950/40"
              >
                🍃
              </motion.div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
                For Lexi
              </p>

              <h1 className="mb-5 text-4xl font-black tracking-tight text-lime-50 md:text-6xl">
                Lexi’s Smile Quiz
              </h1>

              <p className="mx-auto mb-8 max-w-xl text-base leading-7 text-emerald-100/90 md:text-lg">
                A tiny green quiz made for one person only. Nothing too serious.
                Just a few questions, a runaway button, and a little reminder that
                good things are still ahead.
              </p>

              <div className="mb-8 grid gap-3 md:grid-cols-3">
                {[
                  ["", ""],
                  ["", ""],
                  ["", ""],
                ].map(([number, label]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-lime-200/10 bg-lime-200/5 p-4"
                  >
                    <p className="text-2xl font-black text-lime-200 md:text-3xl">
                      {number}
                    </p>
                    <p className="text-sm text-emerald-100/75">{label}</p>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full bg-lime-300 px-8 py-4 text-lg font-extrabold text-emerald-950 shadow-xl shadow-lime-950/30 transition hover:bg-lime-200"
              >
                Start the quiz
              </motion.button>
            </motion.div>
          )}

          {screen === "quiz" && currentQuestion && (
            <motion.div
              key={`quiz-${currentQuestion.id}`}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-4xl rounded-[2rem] border border-lime-200/20 bg-[#082215]/80 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
            >
              <ProgressDots step={progressStep} />

              <div className="mb-8 text-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
                  {currentQuestion.eyebrow}
                </p>

                <h2 className="mb-4 text-3xl font-black tracking-tight text-lime-50 md:text-5xl">
                  {currentQuestion.title}
                </h2>

                <p className="mx-auto max-w-2xl text-emerald-100/85">
                  {currentQuestion.subtitle}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {currentQuestion.answers.map((answer) => (
                  <motion.button
                    key={answer.label}
                    onClick={() => handleQuizAnswer(answer)}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="group rounded-3xl border border-lime-200/15 bg-lime-200/10 p-6 text-left shadow-lg shadow-black/20 transition hover:bg-lime-200/15"
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-300 text-3xl shadow-lg shadow-black/20 transition group-hover:rotate-6">
                      {answer.emoji}
                    </div>

                    <p className="text-xl font-black text-lime-50">
                      {answer.label}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-emerald-100/75">
                      Pick this one.
                    </p>
                  </motion.button>
                ))}
              </div>

              <div className="mt-8 rounded-3xl border border-lime-200/10 bg-lime-200/5 p-4 text-center">
                <p className="text-sm text-emerald-100/80">
                  Smile score so far:{" "}
                  <span className="font-black text-lime-200">{score}</span>
                </p>
              </div>

              <AnimatePresence>
                {reaction && (
                  <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -18, scale: 0.95 }}
                    className="fixed inset-x-5 bottom-8 z-30 mx-auto max-w-xl rounded-3xl border border-lime-200/20 bg-emerald-950/95 p-5 text-center text-lg font-bold text-lime-50 shadow-2xl shadow-black/40 backdrop-blur-xl"
                  >
                    {reaction}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {screen === "mood" && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="relative w-full max-w-4xl rounded-[2rem] border border-emerald-200/20 bg-[#092315]/80 p-7 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
            >
              <ProgressDots step={progressStep} />

              <div className="mb-6 flex justify-center gap-3 text-4xl">
                {["🌿", "🫒", "🍀"].map((emoji, index) => (
                  <motion.span
                    key={emoji}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
                One last thing
              </p>

              <h2 className="mb-4 text-3xl font-black tracking-tight text-lime-50 md:text-5xl">
                Lexi, did this make you smile?
              </h2>

              <p className="mx-auto mb-10 max-w-xl text-emerald-100/85">
                Be honest. But the no button is extremely dramatic and may not stay
                where you left it.
              </p>

              <div className="relative mx-auto flex min-h-[240px] w-full max-w-xl items-center justify-center gap-5">
                <motion.button
                  onClick={handleYes}
                  animate={{
                    scale: yesScale,
                  }}
                  whileHover={{
                    scale: yesScale + 0.06,
                  }}
                  whileTap={{
                    scale: yesScale - 0.05,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 16,
                  }}
                  className="z-20 rounded-full bg-lime-300 px-8 py-4 text-lg font-black text-emerald-950 shadow-2xl shadow-lime-950/40 transition hover:bg-lime-200"
                >
                  Yes, a little :)
                </motion.button>

                <motion.button
                  onClick={() => handleNo("click")}
                  onMouseEnter={() => handleNo("hover")}
                  animate={{
                    x: noSpot.x * 3,
                    y: noSpot.y * 3,
                    rotate: noSpot.rotate,
                    scale: Math.max(1 - noCount * 0.045, 0.66),
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 14,
                  }}
                  className="z-10 rounded-full border border-emerald-200/25 bg-emerald-900 px-7 py-4 text-base font-bold text-emerald-50 shadow-xl shadow-black/25 transition hover:bg-emerald-800"
                >
                  {noLabel}
                </motion.button>
              </div>

              <div className="mt-8 rounded-3xl border border-lime-200/10 bg-lime-200/5 p-4">
                <p className="text-sm text-emerald-100/80">
                  Times Lexi tried to say no:{" "}
                  <span className="font-black text-lime-200">{noCount}</span>
                </p>
              </div>
            </motion.div>
          )}

          {screen === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-4xl rounded-[2rem] border border-lime-200/20 bg-emerald-950/75 p-7 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
            >
              <ProgressDots step={progressStep} />

              <motion.div
                className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-lime-300 text-5xl shadow-xl shadow-lime-950/40"
                animate={{
                  rotate: [0, 8, -8, 0],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                }}
              >
                ✨
              </motion.div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
                Results
              </p>

              <h2 className="mb-5 text-4xl font-black text-lime-50 md:text-6xl">
                Lexi’s Smile Score: {smileScore}%
              </h2>

              <div className="mx-auto mb-8 h-5 max-w-xl overflow-hidden rounded-full bg-emerald-900 shadow-inner shadow-black/30">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${smileScore}%` }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full bg-lime-300"
                />
              </div>

              <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-emerald-100/90">
                Final result: Lexi deserves a good day, a smile, and probably
                something green. Choose a tiny reward.
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Reward A",
                    text: "One virtual green flower, picked by pixels.",
                    button: "Accept flower 🌷",
                    choice: "flower",
                  },
                  {
                    title: "Reward B",
                    text: "A compliment wrapped in green.",
                    button: "Receive compliment 💚",
                    choice: "compliment",
                  },
                  {
                    title: "Reward C",
                    text: "A verse card made just for this page.",
                    button: "Open verse 📖",
                    choice: "verse",
                  },
                ].map((card) => (
                  <motion.button
                    key={card.choice}
                    onClick={() => handleFinalChoice(card.choice)}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-3xl border border-lime-200/15 bg-lime-200/10 p-5 text-left shadow-lg shadow-black/20 transition hover:bg-lime-200/15"
                  >
                    <p className="mb-2 text-sm font-black uppercase tracking-[0.25em] text-lime-200">
                      {card.title}
                    </p>
                    <p className="mb-5 text-emerald-100/85">{card.text}</p>
                    <span className="font-black text-lime-100">
                      {card.button}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {screen === "final" && (
            <motion.div
              key="final"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-3xl rounded-[2rem] border border-lime-200/20 bg-[#071f13]/80 p-7 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
            >
              <motion.div
                className="mb-6 text-7xl"
                animate={{
                  rotate: [0, -8, 8, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                🍀
              </motion.div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
                Romans 8:18
              </p>

              <h2 className="mb-5 text-4xl font-black text-lime-50 md:text-6xl">
                For I reckon...
              </h2>

              <div className="mx-auto mb-8 max-w-2xl rounded-[2rem] border border-lime-200/15 bg-lime-200/10 p-6 text-left shadow-xl shadow-black/20">
                <p className="text-xl font-semibold leading-9 text-lime-50 md:text-2xl">
                  “For I reckon that the sufferings of this present time are not
                  worthy to be compared with the glory which shall be revealed in
                  us.”
                </p>

                <p className="mt-5 text-right text-sm font-black uppercase tracking-[0.25em] text-lime-200">
                  Romans 8:18
                </p>
              </div>

              <p className="mx-auto mb-8 max-w-xl text-lg leading-8 text-emerald-100/90">
                Lexi, this was just a small green page, but the point is simple:
                there is more ahead, there is glory ahead, and today still has room
                for a smile.
              </p>

              <motion.button
                onClick={restart}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full bg-lime-300 px-8 py-4 text-lg font-extrabold text-emerald-950 shadow-xl shadow-lime-950/30 transition hover:bg-lime-200"
              >
                Run it again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}