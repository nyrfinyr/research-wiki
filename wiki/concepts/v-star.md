---
title: V*-Bench (V-Star)
type: concept
tags: [benchmark, vlm, vision-centric, fine-grained]
created: 2026-05-15
updated: 2026-05-15
---

# V*-Bench (V-Star)

**V***-bench (talvolta scritto V-Star o v-star-bench) è un benchmark vision-centric per VLM focalizzato su perception fine-grained: ragionare su piccoli dettagli, parti di oggetti, attributi specifici. Spesso usato in coppia con HRBench come stress-test sulle capacità percettive dei VLM.

Nel wiki appare in:

- **[[qwen3-vl-2025-tech-report]]**: tool use ("Perception with Tool") aggiunge ~5 punti su V*/HRBench [§5.6] — il guadagno puramente architetturale è stagnante senza tool calling.
- **[[morini-2026-look-twice]]**: V-Star è uno dei benchmark vision-centric su cui LoT mostra guadagni grandi (Qwen2.5-VL-3B +2.1, Qwen3-VL-4B +11.0) [Tab. 3].

## Sources

- [[qwen3-vl-2025-tech-report]] — valuta Qwen3-VL con/senza tool use.
- [[morini-2026-look-twice]] — benchmark di valutazione vision-centric.

## Concetti correlati

- [[vision-language-model]] — modelli valutati.
- [[realworldqa]] — benchmark vision-centric adiacente.
- [[pope]], [[amber]] — benchmark di hallucination adiacenti.
- [[visual-prompting]] — paradigma che lo motiva.
