import { useState, useEffect } from 'react';

export interface CurriculumTopic {
  id: string;
  title: string;
  completed: boolean;
}

export interface CurriculumSubject {
  subject: string;
  color: string;
  topics: CurriculumTopic[];
}

export interface CurriculumEntry {
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
}

export interface OracleProfile {
  career: string;
  careerCategory: string;
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
}

const CURRICULUM_KEY = 'educis_curriculum';
const PROFILE_KEY = 'educis_oracle_profile';

export function saveCurriculum(entry: CurriculumEntry): void {
  try {
    localStorage.setItem(CURRICULUM_KEY, JSON.stringify(entry));
    window.dispatchEvent(new Event('educis-curriculum-update'));
  } catch {}
}

export function getCurriculum(): CurriculumEntry | null {
  try {
    const raw = localStorage.getItem(CURRICULUM_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function toggleTopicComplete(curriculumId: string, topicId: string): boolean {
  const entry = getCurriculum();
  if (!entry || entry.id !== curriculumId) return false;
  let newState = false;
  entry.curriculum = entry.curriculum.map(s => ({
    ...s,
    topics: s.topics.map(t => {
      if (t.id === topicId) {
        newState = !t.completed;
        return { ...t, completed: newState };
      }
      return t;
    }),
  }));
  saveCurriculum(entry);
  return newState;
}

export function getCurriculumProgress(): { total: number; completed: number } {
  const entry = getCurriculum();
  if (!entry) return { total: 0, completed: 0 };
  let total = 0, completed = 0;
  entry.curriculum.forEach(s => s.topics.forEach(t => {
    total++;
    if (t.completed) completed++;
  }));
  return { total, completed };
}

export function useCurriculum() {
  const [curriculum, setCurriculum] = useState<CurriculumEntry | null>(getCurriculum);
  useEffect(() => {
    const sync = () => setCurriculum(getCurriculum());
    window.addEventListener('educis-curriculum-update', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('educis-curriculum-update', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  return curriculum;
}

export function saveOracleProfile(profile: OracleProfile): void {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch {}
}

export function getOracleProfile(): OracleProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
