export function speakText(text: string, lang: "en" | "hi") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === "hi" ? "hi-IN" : "en-IN";
  utter.rate = 0.95;
  window.speechSynthesis.speak(utter);
}