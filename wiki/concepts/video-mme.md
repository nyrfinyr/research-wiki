---
title: Video-MME
type: concept
tags: [benchmark, video-qa, mllm, long-video, multimodal, subtitles, audio]
created: 2026-05-15
updated: 2026-05-15
---

# Video-MME

Video-MME is a "full-spectrum" video question-answering benchmark for [[multimodal-large-language-model]], introduced by [[fu-2025-video-mme]]. It combines domain diversity, a wide duration range (11 s – 1 h), multi-modal inputs (frames + subtitles + audio) and fully manual annotation: 900 hand-curated YouTube videos, 2,700 multiple-choice questions (3 per video, 4 options), distributed in a balanced manner across three duration bands. It is the de facto standard for comparing modern video MLLMs in w/o vs w/ subtitles mode.

## Composition / Protocol

- **900 videos** total (300 short < 2 min / 300 medium 4–15 min / 300 long 30–60 min), 744 with subtitles, **all** with audio. Average duration 1017.9 s (~17 min) [source: raw/papers/fu-2025-video-mme.pdf §3.2].
- **2,700 QA** (3 per video, 4 options → random baseline 25%). Option distribution A/B/C/D ≈ 25.1 / 27.2 / 25.3 / 22.4% [source: raw/papers/fu-2025-video-mme.pdf §3.2].
- **Video taxonomy**: 6 domains × 30 subcategories (Knowledge, Film & Television, Sports Competition, Artistic Performance, Life Record, Multilingual).
- **Task taxonomy**: 12 task types grouped into *perception* (OCR, action/attribute/object recognition, counting, spatial/temporal perception) and *reasoning* (spatial/action/temporal reasoning, information synopsis).
- **Quality filter**: Gemini 1.5 Pro text-only blind test → QA correctly answered are discarded; reaches < 15% accuracy in the blind setting, confirming dependence on video content [source: raw/papers/fu-2025-video-mme.pdf §3.1].
- **Certificate length** (concept from [[egoschema]]): median 26 s / 164.7 s / 890.7 s for short/medium/long.
- **Protocol**: prompt `subtitles + question + 4 options`; letter-only output; accuracy via regex match (no LLM judge). Modes tested: *w/o subs*, *w/ subs*, *w/ audio*.

## Reference numbers

From the original paper [source: raw/papers/fu-2025-video-mme.pdf §4.2, Tab. 4]:

| Model | Short w/o | Medium w/o | Long w/o | Overall w/o | Overall w/ subs |
|---|---|---|---|---|---|
| Random | 25.0 | 25.0 | 25.0 | 25.0 | 25.0 |
| GPT-4V | 70.5 | 55.8 | 53.5 | 59.9 | 63.3 |
| GPT-4o | 80.0 | 70.3 | 65.3 | 71.9 | 77.2 |
| Gemini 1.5 Flash | 78.8 | 68.8 | 61.1 | 70.3 | 75.0 |
| **Gemini 1.5 Pro** | 81.7 | 74.3 | 67.4 | **75.0** | **81.3** |
| VILA-1.5 34B (best OS) | 68.1 | 58.1 | 50.8 | 59.0 | 59.4 |
| Video-LLaVA 7B | 45.3 | 38.0 | 36.2 | 39.9 | 41.6 |

From later source pages in the wiki:

| Model | w/o subs | w/ subs | Source |
|---|---|---|---|
| Qwen2.5-VL-3B | 61.5 | 67.6 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 65.1 | 71.6 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | 73.3 | 79.1 | [[qwen2-5-vl-2025-tech-report]] |
| VideoLLaMA 3-2B | 59.6 | 63.4 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | 66.2 | 70.3 | [[zhang-2025-videollama-3]] |
| Qwen3-VL-2B inst | 61.9 | — | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-8B inst | 71.4 | — | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-32B inst | 76.6 | — | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-235B-A22B thinking | 79.0 | — | [[qwen3-vl-2025-tech-report]] |
| Gemini 2.5 Pro (thinking) | **85.1** | — | [[qwen3-vl-2025-tech-report]] |
| GPT-5 high | 84.7 | — | [[qwen3-vl-2025-tech-report]] |

Accuracy decays monotonically with duration; subtitles always help, with growing gain on long videos (+10.1 points for Gemini 1.5 Pro).

## Sources

- [[fu-2025-video-mme]] — introduces the benchmark and defines the pipeline.
- [[qwen2-5-vl-2025-tech-report]] — evaluates the Qwen2.5-VL family.
- [[qwen3-vl-2025-tech-report]] — evaluates the Qwen3-VL family.
- [[zhang-2025-videollama-3]] — evaluates VideoLLaMA 3 (2B and 7B).
- [[wang-2025-lvbench]] — comparison in Tab. 1.
- [[tang-2025-adaptive-keyframe-sampling]] — uses Video-MME as primary benchmark.
- [[arnab-2025-temporal-chain-of-thought]] — does not evaluate directly but cites it.
- [[doorenbos-2026-video-panels]] — evaluates paneling on Video-MME.
- [[kim-2026-sink-token-aware-pruning]] — evaluates SToP on Video-MME.

## Related concepts

- [[multimodal-large-language-model]] — object of evaluation.
- [[video-llm]] — sub-family typically evaluated.
- [[long-video-understanding]] — task.
- [[multiple-choice-qa]] — format.
- [[certificate-length]] — adopted by papers as a difficulty measure.
- [[egoschema]] — long-form predecessor.
- [[lvbench]] — contemporary extreme long-video benchmark.
- [[mvbench]] — short-clip temporal predecessor.
