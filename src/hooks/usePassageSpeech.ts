import { useEffect, useState } from "react";

export function usePassageSpeech(passage: string) {
  const [audioState, setAudioState] = useState<"stopped" | "playing" | "paused">("stopped");
  const [englishVoices, setEnglishVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");

  useEffect(() => () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const voiceScore = (voice: SpeechSynthesisVoice) => {
      const name = voice.name.toLowerCase();
      let score = voice.lang.toLowerCase() === "en-us" ? 40 : voice.lang.toLowerCase().startsWith("en-") ? 25 : 0;
      if (/samantha|ava|zoe|nathan|allison|google us english|aria|jenny|guy/.test(name)) score += 30;
      if (/premium|enhanced|neural|natural/.test(name)) score += 25;
      if (voice.localService) score += 5;
      return score;
    };
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
        .filter((voice) => voice.lang.toLowerCase().startsWith("en-"))
        .sort((a, b) => voiceScore(b) - voiceScore(a) || a.name.localeCompare(b.name));
      setEnglishVoices(voices);
      setSelectedVoiceURI((current) => current || voices[0]?.voiceURI || "");
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const stop = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setAudioState("stopped");
  };
  const play = () => {
    if (!("speechSynthesis" in window)) return;
    if (audioState === "paused") {
      window.speechSynthesis.resume();
      setAudioState("playing");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(passage.replace(/\n+/g, " "));
    const voice = englishVoices.find((item) => item.voiceURI === selectedVoiceURI) ?? englishVoices[0];
    if (voice) { utterance.voice = voice; utterance.lang = voice.lang; } else utterance.lang = "en-US";
    utterance.rate = 0.88;
    utterance.onstart = () => setAudioState("playing");
    utterance.onend = () => setAudioState("stopped");
    utterance.onerror = () => setAudioState("stopped");
    window.speechSynthesis.speak(utterance);
  };
  const pause = () => {
    if ("speechSynthesis" in window && audioState === "playing") {
      window.speechSynthesis.pause();
      setAudioState("paused");
    }
  };
  const selectVoice = (voiceURI: string) => { stop(); setSelectedVoiceURI(voiceURI); };

  return { audioState, englishVoices, selectedVoiceURI, selectVoice, play, pause, stop };
}
