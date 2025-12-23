import { ModelConfig, StepOutputs } from "./types";

export const DEFAULT_MODEL_CONFIG: ModelConfig = {
  re: { model_name: "re_svm_phobert", model_version: "1" },
};

export const MODEL_CONFIG_STORAGE_KEY = "ie_model_config_v1";

export const STEPS = [
  { key: "normalize", label: "Normalize", endpoint: "/api/ie/normalize" },
  { key: "ner", label: "NER", endpoint: "/api/ie/ner" },
  { key: "predict", label: "RE Predict", endpoint: "/api/ie/run" },
] as const;


export const INITIAL_OUTPUTS: StepOutputs = {
  normalize: null,
  ner: null,
  predict: null,
};


export const AVAILABLE_MODELS = {
  re: [
    { name: "re_svm_phobert", versions: ["1", "2"] },
    { name: "re_logreg_phobert", versions: ["1"] },
    { name: "re_rf_phobert", versions: ["1"] },
    { name: "re_mlp_phobert", versions: ["1"] },
  ],
} as const;
