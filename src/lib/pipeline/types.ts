export type StepKey = "normalize" | "ner" | "predict";
export type TabKey = StepKey | "result";

export interface StepConfig {
  key: StepKey;
  label: string;
  endpoint: string;
}

export interface NormalizeOutput {
  status: number;
  message: {
    original: string;
    normalized: string | string[];
  };
}


// ===== NER (raw + ui) =====
export type NerEntityType = string;

export interface NerSentenceEntities {
  text: string;
  entities: Array<{
    start: number;
    end: number;
    text: string;
    type: NerEntityType;
  }>;
}

export type NerSegment =
  | { kind: "text"; text: string }
  | {
      kind: "entity";
      text: string;
      type: NerEntityType;
      start: number;
      end: number;
    };

export interface NerUiSentence {
  sentence_id: number;
  text: string;
  segments: NerSegment[];
  legend?: Record<string, number>;
}

export interface NerModelInfo {
  name: string;
  version: string;
}

export interface NerOutput {
  status: number;
  model?: NerModelInfo;
  entities: NerSentenceEntities[];
  ui?: NerUiSentence[];
}

export interface ValidateOutput {
  entities: unknown[];
}
export interface PairsOutput {
  pairs: unknown[];
}

// ===== RE (cards) =====
export interface IeUiSection {
  id: string;
  title: string;
  relation: string;
  items: string[];
  order?: number;
  display?: string;
}
export interface IeUiCard {
  id: string;
  title: string;
  tag?: string;
  subtitle?: string;
  source?: { sentence_id: string; sentence: string };
  sections: IeUiSection[];
}
export interface IeResultData {
  model_name: string;
  model_version: string;
  raw?: unknown;
  ui?: { type?: string; cards: IeUiCard[] };
}
export interface PredictOutput {
  status: number;
  step?: string;
  message?: string;
  data: IeResultData;
}


export interface StepOutputs {
  normalize: NormalizeOutput | null;
  ner: NerOutput | null;
  validate?: ValidateOutput | null; 
  predict: PredictOutput | null;
}

export interface PipelineResult {
  input: string;
  normalized_text: string;
  entities: unknown[];
  cards: IeUiCard[];
  model?: { name: string; version: string };
  raw_outputs: StepOutputs;
}

export interface ModelConfig {
  re: { model_name: string; model_version: string };
}
