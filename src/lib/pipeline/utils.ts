/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ModelConfig,
  NerSentenceEntities,
  PredictOutput,
  StepKey,
  StepOutputs,
  IeUiCard,
} from "./types";

export function safeParseModelConfig(raw: string | null): ModelConfig | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    if (obj?.re?.model_name && obj?.re?.model_version) return obj as ModelConfig;
    return null;
  } catch {
    return null;
  }
}

export function getNormalizedText(input: string, outputs: StepOutputs): string {
  const norm = outputs.normalize?.message?.normalized;

  if (typeof norm === "string") return norm;

  if (Array.isArray(norm)) return norm.filter(Boolean).join(" ");

  return input;
}


export function buildPayload(
  key: StepKey,
  input: string,
  outputs: StepOutputs,
  modelConfig: ModelConfig
): Record<string, unknown> {
  const normText = getNormalizedText(input, outputs);

  switch (key) {
    case "normalize":
      return { text: input };

    case "ner":
      return { text: input };

    case "predict":
      return {
        text: normText,
        model_name: modelConfig.re.model_name,
        model_version: modelConfig.re.model_version,
      };
  }
}

export async function fetchStepData(endpoint: string, payload: Record<string, unknown>) {
  const r = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  try {
    return await r.json();
  } catch {
    return { error: "Non-JSON response" };
  }
}


export function pickCards(predict: PredictOutput | null | undefined): IeUiCard[] {
  if (!predict) return [];

  const data: any = (predict as any).data ?? predict;

  // case chuẩn: data.ui.cards
  const cards1 = data?.ui?.cards;
  if (Array.isArray(cards1)) return cards1 as IeUiCard[];

  // case bạn đang trả: data.ui = {type, cards} hoặc data.ui = cards[]
  const ui = data?.ui;
  if (Array.isArray(ui)) return ui as IeUiCard[];
  if (Array.isArray(ui?.cards)) return ui.cards as IeUiCard[];

  // case bạn trả nhầm: data.cards = {type, cards}
  const cardsObj = data?.cards;
  if (Array.isArray(cardsObj)) return cardsObj as IeUiCard[];
  if (Array.isArray(cardsObj?.cards)) return cardsObj.cards as IeUiCard[];

  return [];
}

export function pickPredictRelations(predict: PredictOutput | null | undefined): unknown {
  if (!predict) return null;
  const data: any = (predict as any).data ?? predict;

  // ưu tiên ui.cards để render
  const cards = data?.ui?.cards;
  if (cards) return cards;

  return data?.raw ?? data ?? null;
}

export function buildSaveCorrectionsPayload(args: {
  input: string;
  editedEntitiesOutput: NerSentenceEntities[];
  modelConfig: ModelConfig;
}) {
  const { input, editedEntitiesOutput, modelConfig } = args;

  return {
    text: input, // 
    model_name: modelConfig.re.model_name,  
    model_version: modelConfig.re.model_version,
    entities_output: editedEntitiesOutput,       
  };
}
