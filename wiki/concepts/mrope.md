---
title: Multimodal Rotary Position Embedding (MRoPE)
type: concept
tags: [positional-encoding, multimodal, video-llm, rope, temporal]
created: 2026-05-15
updated: 2026-05-15
---

# Multimodal Rotary Position Embedding (MRoPE)

Family of extensions of [[rotary-position-embedding]] for Vision-Language Models: instead of a single 1D position axis (text), **temporal, height, width** (and sometimes channel) are jointly encoded as distinct rotary dimensions, giving the model a position-signal for each axis [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1]. Introduced by Qwen2-VL as "chunked MRoPE", it evolved into **T-RoPE** absolute-time-aligned (Qwen2.5-VL) and **Interleaved MRoPE** spectrally-uniform (Qwen3-VL). Also adopted by VideoLLaMA-3 as 2D-RoPE for images [source: raw/papers/zhang-2025-videollama-3.pdf §3.1; raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.3].

## Key claims / Technique

- **Chunked MRoPE (Qwen2-VL)**: the `d` dimensions of the embedding are partitioned into three groups `(t, h, w)`, each with a distinct rotary frequency range. The rotation applied to the token at position `(t_i, h_i, w_i)` is the product of the per-group rotations. Diagnosed limitation: **spectral bias** — the `t` dimension only covers certain frequencies, degrading long-video understanding [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1].
- **T-RoPE (Qwen2.5-VL)**: the temporal ID is **no longer tied to the frame index** but to the **real timestamp (absolute clock)**. Allows learning "the cadence of time through the intervals between temporal dimension IDs" independently of sampling FPS, enabling temporal grounding at the second (Charades-STA mIoU 50.9 vs GPT-4o 35.7) [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.3].
- **Interleaved MRoPE (Qwen3-VL)**: redistributes the t/h/w dimensions *interleaved* along the embedding, so that each axis covers both low- and high-frequencies. Mitigates spectral bias, improves video positional modeling [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1].
- **Textual timestamp tokens (Qwen3-VL)**: replaces T-RoPE for the temporal dimension by inserting before each temporal patch a textual token `<3.0 seconds>` (or `HH:MM:SS` format). T-RoPE diagnosis: temporal position IDs too large/sparse for long videos → degrades long temporal context; requires uniform sampling over many fps, expensive to construct [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.3].
- **2D-RoPE for single images** (VideoLLaMA-3): MRoPE used as pure 2D-RoPE on the spatial dimensions — it is the image-only specialization of the multimodal extension [source: raw/papers/zhang-2025-videollama-3.pdf §3.1].

## Variants / Extensions

- **Chunked vs Interleaved**: the difference is not theoretical but in frequency-spectrum coverage; Qwen3-VL does not report empirical plots of the "spectral imbalance" — the justification rests on citations of "subsequent studies" not reproduced [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1].
- **Absolute-time vs textual timestamp**: two alternative strategies for long-video. Qwen2.5-VL picks the first (T-RoPE); Qwen3-VL abandons it in favor of textual timestamp tokens, a slight context increase but more flexibility [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.3].

## Related concepts

- [[rotary-position-embedding]] — architectural base of MRoPE.
- [[vision-transformer]] — modern ViTs use 2D-RoPE (degenerate case of MRoPE).
- [[positional-encoding]] — super-family.
- [[dynamic-resolution]] — MRoPE allows encoding positions in variable-resolution images without re-interpolation.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — introduces absolute-time-aligned T-RoPE.
- [[qwen3-vl-2025-tech-report]] — introduces Interleaved MRoPE and textual timestamp tokens.
- [[zhang-2025-videollama-3]] — uses MRoPE as 2D-RoPE for the image-centric ViT.
