---
title: "Doorenbos et al. (2026) — Video Panels for Long Video Understanding"
type: source
tags: [video-llm, long-video-understanding, visual-prompting, training-free, paneling, video-qa]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/doorenbos-2026-video-panels.pdf
source_kind: paper
source_date: 2026-04-20
doi: 10.48550/arXiv.2509.23724
zotero_key: Q9RHHRAT
venue: arXiv preprint (CVPR-style)
authors: [Lars Doorenbos, Federico Spurio, Juergen Gall]
year: 2026
---

# Video Panels for Long Video Understanding

## TL;DR

Doorenbos, Spurio and Gall propose a *training-free*, *parameter-free* and *model-agnostic* visual-prompting method for long videos: combine $\alpha\beta$ consecutive frames into a single "panel" image (like a comic-book page). This increases temporal resolution at the cost of some spatial resolution, within the same visual-token budget of the VLM. Across 5 benchmarks (Video-MME, TimeScope, MLVU, MF2, VNBench) and 8 VLMs (Video-LLaVA, VideoChat2-HD, LLaVA-OV, Qwen2-VL/2.5-VL, LLaVA-Video, VideoLLaMA 3, GPT-4o-mini/4.1) the method almost always improves accuracy; on TimeScope Long it reaches +7.6 points (+19.4% relative) on VideoLLaMA 3 7B [source: raw/papers/doorenbos-2026-video-panels.pdf §1, §4.2].

## Main contribution

- First *visual prompt engineering* method designed explicitly for long-video understanding; it changes neither the weights nor the architecture of the VLM [source: raw/papers/doorenbos-2026-video-panels.pdf §1].
- "Dynamic frame sampling + panel construction" strategy that activates paneling only when $\gamma C < D$ (video duration exceeds context capacity), preserving the standard pipeline otherwise [source: raw/papers/doorenbos-2026-video-panels.pdf §3.2].
- Empirical demonstration that *paneling* frames outperforms alternative *token pooling* approaches at the same token budget [source: raw/papers/doorenbos-2026-video-panels.pdf §4.4].
- Fine-tuning extension (Proj+LLM on LLaVA-OV 7B with LLaVA-Video-178K) showing that panels remain an effective representation even after training [source: raw/papers/doorenbos-2026-video-panels.pdf §4.3].

## Method

**Pipeline (§3.2)**: given a video of duration $D$ frames and a VLM with context window $C$:

1. **Dynamic frame sampling**: $T = C$ if $\gamma C \ge D$, otherwise $T = \alpha\beta C$. That is, paneling only kicks in for videos that are "long enough" (frames spaced at least $\gamma$ frames apart). Defaults: $\gamma$ = video FPS, $\alpha=\beta=2$ (2×2 grid) [source: raw/papers/doorenbos-2026-video-panels.pdf §3.2, Eq.1].
2. **Panel construction**: the $\alpha\beta C$ frames are first spatially downsampled from $H\times W$ to $H/\alpha \times W/\beta$, then grouped into $\alpha\times\beta$ panels in left-to-right top-to-bottom order. The result is a sequence of $C$ "panel images", each with the original shape $H\times W$ [source: raw/papers/doorenbos-2026-video-panels.pdf §3.2].
3. **Inference**: the paneled sequence is passed to the VLM with the standard benchmark prompt; the authors advise against explicitly describing the structure in the prompt (no wording generalises across models) [source: raw/papers/doorenbos-2026-video-panels.pdf §3.2].

**Optional fine-tuning (§3.3)**: maximise $-\log p_\theta(y|x,q)$ on training videos reformatted as panels, on LLaVA-OV 7B (LLaVA-Video-178K, 1 epoch, batch=2, grad-acc=4).

**Training-free aspect**: the "panel construction" block is purely visual pre-processing; it adds no parameters and requires no gradient pass through the VLM.

## Key results

**Zero-shot, 5 benchmarks × 8 VLMs (Tab.1)** — average accuracy in percentage points:

- Video-LLaVA 7B (8 frames): 33.8 → 34.8 (+1.0)
- LLaVA-OV 7B (32 frames): 52.8 → 56.2 (+3.4)
- LLaVA-OV 72B (32 frames): 49.4 → 52.5 (+3.1)
- Qwen-2.5VL 7B (32 frames): 51.9 → 55.3 (+3.4)
- LLaVA-Video 7B (64 frames): 56.6 → 60.7 (+4.1)
- LLaVA-Video 72B (64 frames): 55.4 → 58.2 (+2.8)
- Qwen-2VL 7B (180 frames): 54.5 → 56.7 (+2.2)
- Qwen-2.5VL 7B (180 frames): 59.7 → 60.5 (+0.8)
- VideoLLaMA 3 7B (180 frames): 58.2 → 60.9 (+2.7)

**Highlight TimeScope Long (avg. duration 27 600 s, ≈7.7 h)**: VideoLLaMA 3 7B goes from 39.1 to 46.7 (+7.6 / +19.4% relative) [source: raw/papers/doorenbos-2026-video-panels.pdf §1, §4.2].

**Commercial**: GPT-4o-mini (8 frames) on Video-MME 50.0→53.0 (+3.0), GPT-4.1 (32 frames) 68.9→72.9 (+4.0) [source: raw/papers/doorenbos-2026-video-panels.pdf §4.2].

**Fine-tuning (Tab.2, LLaVA-OV 7B)**: Proj+LLM fine-tuning with panels reaches 49.4 on Video-MME long vs. 48.2 without panels; TimeScope Long 34.4 vs. 30.9. Panels are complementary to training [source: raw/papers/doorenbos-2026-video-panels.pdf §4.3].

**Panels vs. Pooling (§4.4)**: at the same token budget (≈23k–25k), paneling beats visual-token average pooling (low-res) on LLaVA-OV 7B (TimeScope: panels 69.5 vs. low-res 68.7 vs. default 58.7) and LLaVA-Video 7B (79.2 vs. 78.4 vs. 64.8).

**Ablations**:
- $\gamma$: paneling is beneficial already at $\gamma=0.5\times$FPS; values $\ge 1\times$FPS avoid paneling on overly short videos and give the best average performance (Tab.3) [source: raw/papers/doorenbos-2026-video-panels.pdf §4.5].
- $\alpha\times\beta$: 2×2 is optimal; 3×3 helps TimeScope (76.5 vs. 69.5) but 4×4 degrades fine-detail tasks; $\alpha\ne\beta$ hurts (Tab.4) [source: raw/papers/doorenbos-2026-video-panels.pdf §4.5].
- Compute/accuracy trade-off (Fig.4): paneling achieves the same accuracy as LLaVA-OV 7B with half the frames (8 vs. 16) and therefore half the visual tokens.

## Stated limitations

- The approach "does not improve the underlying VLM's understanding capabilities" but raises the baseline (§5) [source: raw/papers/doorenbos-2026-video-panels.pdf §5].
- On ordering tasks (MLVU) panels lose slightly (−1.2%) because they do not explicitly encode the temporal order inside a panel (§4.7) [source: raw/papers/doorenbos-2026-video-panels.pdf §4.7].
- Isolated cases of degradation (e.g. VideoLLaMA 3 7B on MF2 −0.6).
- No single textual prompt improves results across all models; per-VLM calibration is needed (§3.2).

## Open questions / critiques

- How does paneling combine with frame selection/aggregation methods such as [[adaptive-keyframe-sampling]] or [[temporal-chain-of-thought]]? It looks orthogonal.
- What is the optimal textual prompt to describe the panel layout (the appendix explores NumPro-style indexing).
- How does it scale with $\alpha\beta > 4$? The paper stops at 4×4; the loss of spatial resolution could be mitigated with a vision encoder at higher native resolution.
- Effect on fine-grained OCR tasks where spatial resolution is critical.

## Cited concepts

- [[video-llm]] — backbones tested (Video-LLaVA, VideoChat2-HD, LLaVA-OV, Qwen-2VL/2.5-VL, LLaVA-Video, VideoLLaMA 3, GPT-4)
- [[long-video-understanding]] — target task
- [[visual-prompting]] / [[visual-prompt-engineering]] — method category
- [[training-free-methods]] — key property
- [[vision-language-model]]
- [[video-mme]] — benchmark
- [[timescope]] — benchmark, shows the largest gain
- [[mlvu]] — benchmark
- [[mf2]] — benchmark
- [[vnbench]] — benchmark
- [[egoschema]] — cited as reference benchmark
- [[lmms-eval]] — evaluation toolkit
- [[llava-onevision]], [[qwen2-5-vl]], [[llava-video]], [[videollama-3]] — backbone models
- [[numpro]] — visual prompt with numeric tags on frames (baseline)
- [[token-pooling]] — alternative compared against
- [[needle-in-a-haystack]] — task category where paneling shines

## Direct quotes

> "Our approach is training-free, parameter-free, and model-agnostic, and can be seamlessly integrated into existing VLMs." [source: raw/papers/doorenbos-2026-video-panels.pdf Abstract]

> "By combining multiple frames as panels into one image, we effectively trade off spatial details for temporal resolution." [source: raw/papers/doorenbos-2026-video-panels.pdf Abstract]
