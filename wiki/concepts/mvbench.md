---
title: MVBench
type: concept
tags: [benchmark, video-qa, mllm, temporal-understanding, multiple-choice-qa]
created: 2026-05-15
updated: 2026-05-15
---

# MVBench

MVBench (Multi-modal Video understanding Benchmark) è un benchmark di video-QA per MLLM introdotto da [[li-2024-mvbench]]. Si distingue per il metodo di costruzione **static-to-dynamic**: per ognuno dei 9 task statici dei benchmark immagine (Action, Object, Position, Scene, Count, Attribute, Pose, Character, Cognition) gli autori derivano versioni dinamiche che richiedono comprensione temporale e non possono essere risolte con un singolo frame. Le 4.000 QA multiple-choice (200 per task) sono generate automaticamente da 11 dataset video pubblici via ChatGPT, mantenendo la ground-truth originale. Domina le valutazioni "short-clip temporal" (5–35 s) di tutti i tech report MLLM.

## Composizione / Protocollo

- **20 task** derivati da 9 task spatial statici (Fig. 1), in 9 famiglie [source: raw/papers/li-2024-mvbench.pdf §3.1]:
  - Action: Sequence, Prediction, Antonym, Fine-grained, Unexpected.
  - Object: Existence, Interaction, Shuffle.
  - Position: Moving Direction, Action Localization.
  - Scene: Scene Transition.
  - Count: Action Count, Moving Count.
  - Attribute: Moving Attribute, State Change.
  - Pose: Fine-grained Pose.
  - Character: Character Order.
  - Cognition: Egocentric Navigation, Episodic Reasoning, Counterfactual Inference.
- **200 QA per task × 20 task = 4.000 QA totali**, formato multiple-choice (random baseline 27.3).
- Clip di durata **5–35 s** (filtrate per temporal sensitivity).
- Generate via pipeline automatica da 11 dataset: [[star-benchmark]], PAXION, Moments in Time, FunQA, [[clevrer]], [[perception-test]], [[charades-sta]], MoVQA, NTU RGB+D, VLN-CE, [[tvqa]].
- Prompt design "Best Option: (" → option-extraction 100 %, accuracy diretta senza LLM judge (Tab. 9).

## Numeri di riferimento

Dal paper originale [source: raw/papers/li-2024-mvbench.pdf Tab. 2]:

| Modello | LLM | Avg |
|---|---|---|
| Random | — | 27.3 |
| MiniGPT-4 | Vicuna-7B | 18.8 |
| VideoLLaMA | Vicuna-7B | 34.1 |
| VideoChat | Vicuna-7B | 35.5 |
| VideoChatGPT | Vicuna-7B | 32.7 |
| GPT-4V (16 frame) | GPT-4 | 43.5 |
| **VideoChat2** | Vicuna-7B | 51.1 |
| **VideoChat2 + Mistral-7B** | Mistral-7B | **60.4** |

Risultati da source pages successivi del wiki:

| Modello | MVBench | Fonte |
|---|---|---|
| Qwen2.5-VL-3B | 67.0 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 69.6 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | **70.4** | [[qwen2-5-vl-2025-tech-report]] |
| Gemini 1.5 Pro | 60.5 | [[qwen2-5-vl-2025-tech-report]] |
| GPT-4o | 64.6 | [[qwen2-5-vl-2025-tech-report]] |
| VideoLLaMA 3-2B | 65.5 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | 69.7 | [[zhang-2025-videollama-3]] |
| InternVL2.5-8B | 72.0 | [[zhang-2025-videollama-3]] |
| Qwen3-VL-8B inst | — | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-32B inst | — | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-235B-A22B thinking | 75.2 | [[qwen3-vl-2025-tech-report]] |

VideoChat2 è forte su action/object/scene/attribute/pose, ma debole su position/count/character — counting è un "joint bottleneck" condiviso con [[video-mme]].

## Sources

- [[li-2024-mvbench]] — introduce il benchmark e VideoChat2.
- [[qwen2-5-vl-2025-tech-report]] — valuta la famiglia Qwen2.5-VL.
- [[qwen3-vl-2025-tech-report]] — valuta la famiglia Qwen3-VL.
- [[zhang-2025-videollama-3]] — valuta VideoLLaMA 3.
- [[mangalam-2023-egoschema]] — confronto certificate length (~5 s vs ~100 s di EgoSchema).
- [[fu-2025-video-mme]] — confronto in Tab. 1.
- [[wang-2025-lvbench]] — confronto in Tab. 1.
- [[kim-2026-sink-token-aware-pruning]] — usa MVBench come benchmark.
- [[tang-2025-adaptive-keyframe-sampling]] — non valuta direttamente ma cita.

## Concetti correlati

- [[multimodal-large-language-model]] — oggetto di valutazione.
- [[video-llm]] — sub-famiglia tipica.
- [[video-question-answering]] — paradigma.
- [[multiple-choice-qa]] — formato.
- [[star-benchmark]] — sorgente di 3 task.
- [[clevrer]] — sorgente di 4 task.
- [[charades-sta]] — sorgente di Action Localization.
- [[perception-test]] — sorgente di 4 task.
- [[tvqa]] — sorgente di Episodic Reasoning.
- [[egoschema]] — confronto certificate length.
- [[video-mme]] — benchmark successivo.
- [[lvbench]] — benchmark long-video.
