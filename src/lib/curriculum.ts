import { useEffect, useState } from "react";

export type CurriculumEntry = {
  id: string;
  career: string;
  learningStyle: string;
  country: string;
  countryCode: string;
  language: string;
  grade: string;
  knowledgeLevel: string;
  strengths: string[];
  gaps: string[];
  curriculum: CurriculumSubject[];
  createdAt: number;
};
export type CurriculumSubject = {
  subject: string;
  color: string;
  topics: CurriculumTopic[];
};
export type CurriculumTopic = {
  id: string;
  title: string;
  completed: boolean;
};
export type OracleProfile = {
  career: string;
  learningStyle: string;
  country: string;
  countryCode: string;
  language: string;
  languageName: string;
  grade: string;
  knowledgeLevel: string;
  strengths: string[];
  gaps: string[];
  curriculum: CurriculumSubject[];
};
export type YouTubeVideo = {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channelTitle: string;
  url: string;
};
export type FreeCourse = {
  title: string;
  platform: string;
  url: string;
  description: string;
};
const KEY_CURRICULUM = "educis_curriculum";
const KEY_ORACLE = "educis_oracle_profile";
const EVT = "educis-curriculum-update";
function readCurriculum(): CurriculumEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY_CURRICULUM);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function writeCurriculum(entry: CurriculumEntry) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY_CURRICULUM, JSON.stringify(entry));
    window.dispatchEvent(new Event(EVT));
  } catch (e) {
    console.error("Curriculum save failed", e);
  }
}
export function saveCurriculum(entry: CurriculumEntry) {
  writeCurriculum(entry);
}
export function getCurriculum(): CurriculumEntry | null {
  return readCurriculum();
}
export function toggleTopicComplete(curriculumId: string, topicId: string): boolean {
  const entry = readCurriculum();
  if (!entry) return false;
  for (const subj of entry.curriculum) {
    for (const topic of subj.topics) {
      if (topic.id === topicId) {
        topic.completed = !topic.completed;
        writeCurriculum(entry);
        return topic.completed;
      }
    }
  }
  return false;
}
export function getCurriculumProgress(): { total: number; completed: number } {
  const entry = readCurriculum();
  if (!entry) return { total: 0, completed: 0 };
  let total = 0;
  let completed = 0;
  for (const subj of entry.curriculum) {
    for (const topic of subj.topics) {
      total++;
      if (topic.completed) completed++;
    }
  }
  return { total, completed };
}
export function useCurriculum() {
  const [entry, setEntry] = useState<CurriculumEntry | null>(() => readCurriculum());
  useEffect(() => {
    const sync = () => setEntry(readCurriculum());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return entry;
}
export function saveOracleProfile(profile: OracleProfile) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY_ORACLE, JSON.stringify(profile));
  } catch (e) {
    console.error("Oracle profile save failed", e);
  }
}
export function getOracleProfile(): OracleProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY_ORACLE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
