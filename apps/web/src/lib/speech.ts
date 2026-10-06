let keepAlive: SpeechSynthesisUtterance | null = null; // évite un bug de Chrome qui coupe la lecture

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const now = synth.getVoices();
    if (now.length) return resolve(now);
    const done = () => resolve(synth.getVoices());
    synth.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, 1500);
  });
}

function pickSpanishVoice(voices: SpeechSynthesisVoice[]) {
  const es = voices.filter((v) => v.lang.toLowerCase().startsWith("es"));
  return (
    es.find((v) => v.lang === "es-ES" && /natural|online/i.test(v.name)) ??
    es.find((v) => /natural|online/i.test(v.name)) ??
    es.find((v) => v.lang === "es-ES") ??
    es[0] ??
    null
  );
}

export type SpeakStatus = "ok" | "no-voice" | "unsupported";

export async function speakSpanish(text: string, slow: boolean): Promise<SpeakStatus> {
  if (!("speechSynthesis" in window)) return "unsupported";
  const synth = window.speechSynthesis;
  const voice = pickSpanishVoice(await loadVoices());
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = voice?.lang ?? "es-ES";
  if (voice) u.voice = voice;
  u.rate = slow ? 0.7 : 0.95;
  u.volume = 1;
  keepAlive = u;
  setTimeout(() => { synth.resume(); synth.speak(u); }, 80);
  return voice ? "ok" : "no-voice";
}