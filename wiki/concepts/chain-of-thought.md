---
title: Chain-of-Thought (CoT)
type: concept
tags: [prompting, reasoning, llm, inference-time]
created: 2026-05-15
updated: 2026-05-15
---

# Chain-of-Thought (CoT)

Prompting technique (Wei et al. 2022) in which the model is instructed to generate **explicit intermediate reasoning steps** before the final answer. It shifts reasoning capability from pre-training to **inference** and is the prototype of the [[inference-time-scaling]] family. It has become a *standard tool* both as a comparison baseline and as an ingredient of post-training pipelines (rejection sampling on CoT trajectories, SFT on CoT data, RL on CoT preferences) [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3].

## Key claims / Technique

- **Prototype of inference-time scaling**: giving the model "space to think" in the form of intermediate tokens is the template for the family that includes self-consistency, search-based decoding and [[arnab-2025-temporal-chain-of-thought|TCoT]] [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §1, §3].
- **Non-monotonic effect in VLMs**: in the MVBench benchmark (Li et al. 2024), CoT was tested as a prompt strategy and turned out **harmful** (Tab. 14): the model produces textual reasoning but loses grounding on the video frames [source: raw/papers/li-2024-mvbench.md §results Tab. 14]. LLoVi (Zhang 2024) also uses CoT as a comparison baseline against its multi-round summarization [source: raw/papers/zhang-2024-llovi.md §comparisons].
- **Baseline for evidence-highlighting**: SelfElicit (Liu 2025) beats CoT by **+5.0%-11.7% EM/F1** on HotpotQA/NewsQA/TriviaQA/NQ using only 1 extra token instead of a verbal reasoning chain [source: raw/papers/liu-2025-selfelicit.pdf §1, §4.2, Tab. 1].
- **Post-training component for Qwen-VL**: Qwen2.5-VL uses **rejection sampling** on CoTs generated during SFT to improve visual reasoning; Qwen3-VL splits into "instruct" and "thinking" variants, the latter with CoT extended up to 81,920 tokens (AIME-25, HMMT-25, LiveCodeBench) [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3; raw/papers/qwen3-vl-2025-tech-report.pdf §5.11].
- **Spatial → temporal generalization**: TCoT applies the CoT idea to video QA, where "visual thoughts" are selected frame IDs plus a textual justification ⇒ the model "thinks per frame" before answering [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §3.2, Fig. 3].

## Variants / Extensions

- **Self-consistency**: multiple chains are sampled and the most frequent answer is voted. TCoT shows that self-consistency CoT is **ineffective** on LVBench (≈51 vs Dynamic-Segment TCoT 61.7) [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §4.2].
- **Plan-and-solve**: decomposes into plan + execution; used as a baseline by LLoVi.
- **Multi-round summarization**: non-CoT variant that decomposes the problem with iterative summaries (LLoVi) [source: raw/papers/zhang-2024-llovi.md].
- **TCoT (Temporal CoT)**: the video version — context aggregation `G(x,q)` + answering `H(G(x,q), q)` with the same VLM [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §3.2].

## Related concepts

- [[inference-time-scaling]] — paradigm of which CoT is the historical prototype.
- [[evidence-highlighting]] — attention-based alternative that beats CoT with lower overhead.
- [[supervised-fine-tuning]] — CoT data is often the SFT target.
- [[direct-preference-optimization]] — DPO can learn preferences between CoT trajectories.

## Sources

- [[arnab-2025-temporal-chain-of-thought]] — extends CoT to the video domain with frame selection.
- [[li-2024-mvbench]] — reports that CoT hurts on MVBench tasks (Tab. 14).
- [[liu-2025-selfelicit]] — uses CoT as a baseline; SelfElicit beats it by +5-11pp.
- [[zhang-2024-llovi]] — compares multi-round summarization with CoT.
- [[qwen2-5-vl-2025-tech-report]] — CoT as an axis of post-training (rejection sampling).
- [[qwen3-vl-2025-tech-report]] — extended CoT for the "thinking" variant.
