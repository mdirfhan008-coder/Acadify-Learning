import { QuizQuestion } from '../types';
import { CLOUD_COMPUTING_RAW } from '../data/cloudComputingRaw';
import { AI_RAW } from '../data/aiRaw';

export const DOCUMENTS = {
  'cloud-computing': {
    title: 'Cloud Computing',
    raw: CLOUD_COMPUTING_RAW
  },
  'artificial-intelligence': {
    title: 'Artificial Intelligence',
    raw: AI_RAW
  }
};

export type DocumentId = keyof typeof DOCUMENTS;

interface ParsedDocument {
  title: string;
  units: {
    name: string;
    questions: QuizQuestion[];
  }[];
}

export const parsePDF = (docId: DocumentId): ParsedDocument | null => {
  const doc = DOCUMENTS[docId];
  if (!doc) return null;

  const raw = doc.raw;
  const units: { name: string; questions: QuizQuestion[] }[] = [];
  
  const unitRegex = /Unit\s+(\d+)/g;
  let match;
  
  const indices: { unit: number; index: number }[] = [];

  while ((match = unitRegex.exec(raw)) !== null) {
    indices.push({ unit: parseInt(match[1]), index: match.index });
  }

  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].index;
    const end = indices[i + 1] ? indices[i + 1].index : raw.length;
    const unitText = raw.substring(start, end);
    
    // Parse questions in this unit text
    const questions = parseQuestions(unitText);
    
    if (questions.length > 0) {
      units.push({
        name: `Unit ${indices[i].unit}`,
        questions
      });
    }
  }

  return {
    title: doc.title,
    units
  };
};

// Deprecated: Alias for backward compatibility if needed, but preferably use parsePDF('cloud-computing')
export const parseCloudComputingPDF = () => parsePDF('cloud-computing');

const parseQuestions = (text: string): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  
  const lines = text.split('\n');
  let currentQ: Partial<QuizQuestion> | null = null;
  let currentOptions: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Start of a question: "1. What is..."
    const qMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (qMatch) {
      // Save previous if valid
      if (currentQ && currentOptions.length === 4 && currentQ.correctAnswerIndex !== undefined) {
        currentQ.options = [...currentOptions];
        questions.push(currentQ as QuizQuestion);
      }

      // Start new
      currentQ = {
        question: qMatch[2],
        explanation: "From Model Question Paper",
        options: []
      };
      currentOptions = [];
      continue;
    }

    // Options: "a) ...", "b) ...", etc.
    const optMatch = line.match(/^([a-d])\)\s+(.*)/i);
    if (optMatch && currentQ) {
      currentOptions.push(optMatch[2]);
      continue;
    }

    // Answer: "Answer: B"
    const ansMatch = line.match(/^Answer:\s*([A-D])/i);
    if (ansMatch && currentQ) {
      const char = ansMatch[1].toUpperCase();
      const map: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
      currentQ.correctAnswerIndex = map[char];
      continue;
    }

    // Continuation of question text (if no match found and we are in a question but have no options yet)
    if (currentQ && currentOptions.length === 0 && !line.startsWith('Unit') && !line.startsWith('Part')) {
       currentQ.question += " " + line;
    }
  }

  // Push last one
  if (currentQ && currentOptions.length === 4 && currentQ.correctAnswerIndex !== undefined) {
    currentQ.options = [...currentOptions];
    questions.push(currentQ as QuizQuestion);
  }

  return questions;
};

export const getPDFContext = (docId: DocumentId) => {
    return DOCUMENTS[docId]?.raw || '';
};

// Deprecated
export const getCloudComputingContext = () => getPDFContext('cloud-computing');
