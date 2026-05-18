export interface InterviewStep {
  id: number;
  title: string;
  summary: string;
  bullets: string[];
  sample: string;
  done: boolean;
}

export interface TalkingPoint {
  title: string;
  text: string;
}
