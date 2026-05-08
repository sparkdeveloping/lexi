"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

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

function randomSpot() {
  return {
    x: Math.floor(Math.random() * 70) - 35,
    y: Math.floor(Math.random() * 60) - 30,
    rotate: Math.floor(Math.random() * 34) - 17,
  };
}

export default function Page() {
  const [step, setStep] = useState("intro");
  const [noCount, setNoCount] = useState(0);
  const [noSpot, setNoSpot] = useState({ x: 0, y: 0, rotate: 0 });
  const [sparkles, setSparkles] = useState([]);

  const yesScale = useMemo(() => Math.min(1 + noCount * 0.18, 2.35), [noCount]);

  const noLabel = useMemo(() => {
    const labels = [
      "Not really",
      "Hmm no",
      "Maybe later",
      "Still no",
      "Lexi please",
      "That button is tired",
      "Green says yes",
      "Okay but why",
    ];

    return labels[Math.min(noCount, labels.length - 1)];
  }, [noCount]);

  function makeSparkles() {
    const next = Array.from({ length: 18 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 10 + 6,
      delay: Math.random() * 0.2,
    }));

    setSparkles(next);

    setTimeout(() => {
      setSparkles([]);
    }, 1200);
  }

  async function handleStart() {
    await track("start_clicked");
    setStep("question");
  }

  async function handleNo(trigger = "click") {
    const nextCount = noCount + 1;
    setNoCount(nextCount);
    setNoSpot(randomSpot());
    makeSparkles();

    await track("no_interaction", {
      trigger,
      noCount: nextCount,
    });
  }

  async function handleYes() {
    await track("yes_clicked", {
      noCount,
    });

    makeSparkles();
    setStep("reveal");
  }

  async function handleFinalChoice(choice) {
    await track("final_choice_clicked", {
      choice,
    });

    setStep("final");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06180f] text-emerald-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#84cc16_0%,transparent_28%),radial-gradient(circle_at_bottom_right,#16a34a_0%,transparent_30%),linear-gradient(135deg,#052e16,#064e3b,#1a2e05)] opacity-70" />

      <motion.div
        className="absolute left-10 top-14 h-44 w-44 rounded-full bg-lime-300/20 blur-3xl"
        animate={{
          scale: [1, 1.25, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl"
        animate={{
          scale: [1.15, 1, 1.15],
          x: [0, -25, 0],
          y: [0, 25, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
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
            animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 0], y: -40 }}
            transition={{ duration: 1, delay: sparkle.delay }}
          />
        ))}
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-2xl rounded-[2rem] border border-lime-200/20 bg-emerald-950/70 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
            >
              <motion.div
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-lime-300 text-4xl shadow-lg shadow-lime-900/40"
              >
                🍃
              </motion.div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
                A tiny green website
              </p>

              <h1 className="mb-5 text-4xl font-black tracking-tight text-lime-50 md:text-6xl">
                Lexi’s Mood Check
              </h1>

              <p className="mx-auto mb-8 max-w-xl text-base leading-7 text-emerald-100/90 md:text-lg">
                This page has one mission: determine if Lexi is having a good day,
                and if not, aggressively deploy green nonsense until morale improves.
              </p>

              <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full bg-lime-300 px-8 py-4 text-lg font-extrabold text-emerald-950 shadow-xl shadow-lime-950/30 transition hover:bg-lime-200"
              >
                Begin the very official test
              </motion.button>
            </motion.div>
          )}

          {step === "question" && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="relative w-full max-w-3xl rounded-[2rem] border border-emerald-200/20 bg-[#092315]/80 p-7 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
            >
              <div className="mb-6 flex justify-center gap-3 text-4xl">
                <motion.span
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🌿
                </motion.span>
                <motion.span
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                >
                  🫒
                </motion.span>
                <motion.span
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                >
                  🍀
                </motion.span>
              </div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
                Question 1 of 1, probably
              </p>

              <h2 className="mb-4 text-3xl font-black tracking-tight text-lime-50 md:text-5xl">
                Lexi, are you having a good day?
              </h2>

              <p className="mx-auto mb-10 max-w-xl text-emerald-100/85">
                Choose honestly. The green committee is watching respectfully.
              </p>

              <div className="relative mx-auto flex min-h-[210px] w-full max-w-xl items-center justify-center gap-5">
                <motion.button
                  onClick={handleYes}
                  animate={{
                    scale: yesScale,
                  }}
                  whileHover={{
                    scale: yesScale + 0.06,
                  }}
                  whileTap={{ scale: yesScale - 0.05 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  className="z-20 rounded-full bg-lime-300 px-8 py-4 text-lg font-black text-emerald-950 shadow-2xl shadow-lime-950/40 transition hover:bg-lime-200"
                >
                  I am now :)
                </motion.button>

                <motion.button
                  onClick={() => handleNo("click")}
                  onMouseEnter={() => handleNo("hover")}
                  animate={{
                    x: noSpot.x * 3,
                    y: noSpot.y * 3,
                    rotate: noSpot.rotate,
                    scale: Math.max(1 - noCount * 0.04, 0.72),
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 14 }}
                  className="z-10 rounded-full border border-emerald-200/25 bg-emerald-900 px-7 py-4 text-base font-bold text-emerald-50 shadow-xl shadow-black/25 transition hover:bg-emerald-800"
                >
                  {noLabel}
                </motion.button>
              </div>

              <div className="mt-8 rounded-3xl border border-lime-200/10 bg-lime-200/5 p-4">
                <p className="text-sm text-emerald-100/80">
                  Times Lexi tried to reject the green joy agenda:{" "}
                  <span className="font-black text-lime-200">{noCount}</span>
                </p>
              </div>
            </motion.div>
          )}

          {step === "reveal" && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-3xl rounded-[2rem] border border-lime-200/20 bg-emerald-950/75 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
            >
              <motion.div
                className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-lime-300 text-5xl shadow-xl shadow-lime-950/40"
                animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                ✨
              </motion.div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-lime-200">
                Green joy unlocked
              </p>

              <h2 className="mb-5 text-4xl font-black text-lime-50 md:text-6xl">
                Excellent choice, Lexi.
              </h2>

              <p className="mx-auto mb-8 max-w-xl text-lg leading-8 text-emerald-100/90">
                Your official reward is a tiny digital leaf, a suspicious amount of
                good vibes, and the knowledge that this website was made specifically
                to make you smile.
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Option A",
                    text: "Accept one virtual green flower.",
                    button: "Accept 🌷",
                    choice: "flower",
                  },
                  {
                    title: "Option B",
                    text: "Receive a compliment approved by the forest.",
                    button: "Receive 🌲",
                    choice: "compliment",
                  },
                  {
                    title: "Option C",
                    text: "Pretend this was a normal website.",
                    button: "Impossible 🍀",
                    choice: "normal",
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
                    <span className="font-black text-lime-100">{card.button}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "final" && (
            <motion.div
              key="final"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-2xl rounded-[2rem] border border-lime-200/20 bg-[#071f13]/80 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12"
            >
              <motion.div
                className="mb-6 text-7xl"
                animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🍀
              </motion.div>

              <h2 className="mb-5 text-4xl font-black text-lime-50 md:text-6xl">
                Mood officially improved.
              </h2>

              <p className="mx-auto mb-8 max-w-lg text-lg leading-8 text-emerald-100/90">
                This page has concluded that Lexi deserves a very green, very silly,
                very specific reason to smile today.
              </p>

              <motion.button
                onClick={() => {
                  track("restart_clicked", { previousNoCount: noCount });
                  setNoCount(0);
                  setNoSpot({ x: 0, y: 0, rotate: 0 });
                  setStep("intro");
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full bg-lime-300 px-8 py-4 text-lg font-extrabold text-emerald-950 shadow-xl shadow-lime-950/30 transition hover:bg-lime-200"
              >
                Run the green test again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}