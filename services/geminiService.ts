import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StudySet, QuizQuestion, Course, SubjectOverview } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelName = 'gemini-2.5-flash';

// --- Study Material Generation ---
const studySetSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING, description: "The main topic of the study set" },
    summary: { type: Type.STRING, description: "A comprehensive summary of the topic (approx 200 words)" },
    keyConcepts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 5-7 key concepts or terms defined briefly"
    },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          front: { type: Type.STRING, description: "Question or term" },
          back: { type: Type.STRING, description: "Answer or definition" }
        },
        required: ["front", "back"]
      },
      description: "A list of 5-10 flashcards for the topic"
    }
  },
  required: ["topic", "summary", "keyConcepts", "flashcards"]
};

export const generateStudyMaterial = async (topic: string, context?: string, language: string = 'English'): Promise<StudySet> => {
  try {
    let prompt = `Generate a comprehensive study set for the topic: "${topic}" in ${language} language. Include a summary, key concepts, and flashcards.`;
    
    if (context) {
      prompt += `\n\nBase your content specifically on the following source text:\n${context.substring(0, 30000)}...`; 
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: studySetSchema,
        systemInstruction: `You are an expert educational content creator. Create accurate, concise, and helpful study materials suitable for undergraduate level students. Output strictly in ${language}.`
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const data = JSON.parse(text);
    return {
      ...data,
      createdAt: new Date()
    };
  } catch (error) {
    console.error("Error generating study material:", error);
    throw error;
  }
};

// --- Quiz Generation ---
const quizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Array of 4 possible answers"
          },
          correctAnswerIndex: { type: Type.INTEGER, description: "Index (0-3) of the correct answer" },
          explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct" }
        },
        required: ["question", "options", "correctAnswerIndex", "explanation"]
      }
    }
  },
  required: ["questions"]
};

export const generateQuiz = async (
  topic: string, 
  context?: string, 
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  count: number = 5,
  language: string = 'English'
): Promise<QuizQuestion[]> => {
  try {
    let prompt = `Create a ${difficulty} difficulty multiple-choice quiz with ${count} questions about: "${topic}" in ${language} language.`;
    
    if (context) {
      prompt += `\n\nIMPORTANT: Generate questions specifically based on the content found in the following text. Do not use outside knowledge if the answer is in the text:\n${context.substring(0, 30000)}...`;
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    return data.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

// --- Chat Tutor ---
export const getChatResponse = async (history: { role: string; parts: { text: string }[] }[], message: string, language: string = 'English') => {
  try {
    const chat = ai.chats.create({
      model: modelName,
      history: history,
      config: {
        systemInstruction: `You are a helpful, encouraging, and knowledgeable academic tutor. You explain complex topics simply and guide students to understand concepts rather than just giving answers immediately. Respond in ${language}.`
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};

// --- Course Syllabus Generation ---
const courseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    level: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    duration: { type: Type.STRING, description: "Estimated duration e.g. '4 weeks'" },
    modules: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of module titles for the course syllabus"
    }
  },
  required: ['title', 'description', 'level', 'duration', 'modules']
};

export const generateCourseSyllabus = async (topic: string, language: string = 'English'): Promise<Course> => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Create a detailed course syllabus for a course about: "${topic}" in ${language}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: courseSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    return {
      ...data,
      id: crypto.randomUUID(),
      progress: 0
    };
  } catch (error) {
    console.error("Error generating course:", error);
    throw error;
  }
};

// --- Subject Exploration ---
const subjectOverviewSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    subject: { type: Type.STRING },
    description: { type: Type.STRING },
    topics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key topics within this subject" },
    difficulty: { type: Type.STRING },
    relatedFields: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["subject", "description", "topics"]
};

export const getSubjectOverview = async (query: string, language: string = 'English'): Promise<SubjectOverview> => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Provide a structured overview for the subject or topic: "${query}". This will be used to help a student explore learning paths. Respond in ${language}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: subjectOverviewSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as SubjectOverview;
  } catch (error) {
    console.error("Error getting subject overview:", error);
    throw error;
  }
};