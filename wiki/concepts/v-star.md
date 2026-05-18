---
title: V*-Bench (V-Star)
type: concept
tags: [benchmark, vlm, vision-centric, fine-grained]
created: 2026-05-15
updated: 2026-05-15
---

# V*-Bench (V-Star)

**V***-bench (sometimes written V-Star or v-star-bench) is a vision-centric benchmark for VLMs focused on fine-grained perception: reasoning over small details, object parts, specific attributes. Often paired with HRBench as a stress test for the perceptual capabilities of VLMs.

In the wiki it appears in:

- **[[qwen3-vl-2025-tech-report]]**: tool use ("Perception with Tool") adds ~5 points on V*/HRBench [§5.6] — the purely architectural gain is stagnant without tool calling.
- **[[morini-2026-look-twice]]**: V-Star is one of the vision-centric benchmarks on which LoT shows large gains (Qwen2.5-VL-3B +2.1, Qwen3-VL-4B +11.0) [Tab. 3].

## Sources

- [[qwen3-vl-2025-tech-report]] — evaluates Qwen3-VL with/without tool use.
- [[morini-2026-look-twice]] — vision-centric evaluation benchmark.

## Related concepts

- [[vision-language-model]] — models evaluated.
- [[realworldqa]] — adjacent vision-centric benchmark.
- [[pope]], [[amber]] — adjacent hallucination benchmarks.
- [[visual-prompting]] — paradigm that motivates it.
