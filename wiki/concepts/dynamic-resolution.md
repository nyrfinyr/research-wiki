---
title: Dynamic Resolution
type: concept
tags: [vision-encoder, multimodal, tokenization]
created: 2026-05-15
updated: 2026-05-15
---

# Dynamic Resolution

Visual tokenization paradigm in which the vision encoder **processes images at their native resolution** instead of resizing them to a fixed size (e.g. CLIP's 336×336). This results in a **variable number of patches / visual tokens** as a function of input size, and is one of the central architectural innovations of modern VLMs (Qwen2.5-VL, VideoLLaMA-3, Qwen3-VL). It contrasts with the fixed-resolution patch-counting regime of "vintage" VLMs (LLaVA-1.5, BLIP-2), which required resize/center-crop and lost details, especially on documents, OCR and high-resolution images [source: raw/papers/zhang-2025-videollama-3.pdf §3.1; raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1].

## Key claims / Technique

- **Native spatial dynamic resolution** (Qwen2.5-VL): no coordinate normalization; bounding boxes and points live in the real input dimensions. The model intrinsically learns the physical scale. Regions smaller than the attention window (112×112) are processed **without padding**, preserving the original resolution [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.1, §2.1.2].
- **Dynamic FPS sampling** (Qwen2.5-VL): extends the concept to the temporal dimension — the ViT groups two consecutive frames as a 3D temporal unit, halving the visual tokens. During training FPS is **dynamically sampled** to cover a broad distribution of video speeds. Inference: max 768 frames and ≤24,576 visual tokens for videos up to hours long [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.2, §2.2.1, §3.3.4].
- **AVT — Any-resolution Vision Tokenization** (VideoLLaMA-3): SigLIP fine-tuned to accept images at arbitrary resolution, removing the fixed-resolution bottleneck. Combined with the Differential Frame Pruner to reduce temporal redundancy [source: raw/papers/zhang-2025-videollama-3.pdf §3.1, Tab. 8].
- **Compatible position embedding**: dynamic resolution is enabled by flexible position encodings — 2D-RoPE / [[mrope]] or bilinear interpolation of the 1D learnable position embeddings of the original [[vision-transformer]].
- **Cross-task impact**: VideoLLaMA-3 outperforms VideoLLaMA2.1-7B by +11.3 points on VideoMME (w/o sub), +15.6 on MLVU, +17.9 on PerceptionTest, attributing the jump in part to "AVT + dynamic resolution" [source: raw/papers/zhang-2025-videollama-3.pdf §4.2 Tab. 8].

## Variants / Extensions

- **AnyRes (LLaVA-Next)**: splits large images into multiple fixed-resolution sub-images + global view — a "patch-of-patches" intermediate between fixed-resolution and dynamic-resolution.
- **MLP merger** (Qwen2.5-VL): groups 4 adjacent ViT patches via MLP before projection into the LLM space; balances the trade-off between visual fidelity and token budget.
- **DeepStack** (Qwen3-VL): injects features from 3 ViT layers into as many LLM layers via residual — preserves multi-level information without extending context length even at high resolution [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.2].

## Related concepts

- [[vision-transformer]] — architecture that allows dynamic resolution (unlike fixed-stride CNNs).
- [[mrope]] — position embedding that natively adapts to variable-size sequences.
- [[patch-embedding]] — constituent primitive; dynamic resolution = variable number of applications of the same linear projection.

## Sources

- [[zhang-2025-videollama-3]] — introduces AVT + DiffFP in the vision-centric recipe.
- [[qwen2-5-vl-2025-tech-report]] — spatial dynamic resolution + temporal dynamic FPS.
- [[qwen3-vl-2025-tech-report]] — combines dynamic resolution with DeepStack injection.
