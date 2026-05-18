---
title: Multimodal Rotary Position Embedding (MRoPE)
type: concept
tags: [positional-encoding, multimodal, video-llm, rope, temporal]
created: 2026-05-15
updated: 2026-05-15
---

# Multimodal Rotary Position Embedding (MRoPE)

Famiglia di estensioni di [[rotary-position-embedding]] per i Vision-Language Model: invece di un singolo asse di posizione 1D (testo) si codificano congiuntamente **temporal, height, width** (e talvolta channel) come dimensioni rotary distinte, dando al modello una position-signal per ciascun asse [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1]. Introdotta da Qwen2-VL come "MRoPE chunked", è evoluta in **T-RoPE** absolute-time-aligned (Qwen2.5-VL) e in **Interleaved MRoPE** spectrally-uniform (Qwen3-VL). Adottata anche da VideoLLaMA-3 come 2D-RoPE per immagini [source: raw/papers/zhang-2025-videollama-3.pdf §3.1; raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.3].

## Claim chiave / Tecnica

- **MRoPE chunked (Qwen2-VL)**: le `d` dimensioni dell'embedding sono partizionate in tre gruppi `(t, h, w)`, ciascuno con un range di frequenze rotary distinto. La rotazione applicata al token in posizione `(t_i, h_i, w_i)` è il prodotto delle rotazioni per gruppo. Limite diagnosticato: **spectral bias** — la dimensione `t` copre solo certe frequenze, degradando long-video understanding [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1].
- **T-RoPE (Qwen2.5-VL)**: il temporal ID **non si lega più all'indice frame** ma al **timestamp reale (clock assoluto)**. Permette di apprendere "the cadence of time through the intervals between temporal dimension IDs" indipendentemente dall'FPS di campionamento, abilitando temporal grounding al secondo (Charades-STA mIoU 50.9 vs GPT-4o 35.7) [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.3].
- **Interleaved MRoPE (Qwen3-VL)**: ridistribuisce le dimensioni t/h/w *interleaved* lungo l'embedding, in modo che ogni asse copra sia low- che high-frequencies. Mitiga lo spectral bias, migliora il positional modeling video [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1].
- **Textual timestamp tokens (Qwen3-VL)**: rimpiazza T-RoPE per la dimensione temporale inserendo prima di ogni temporal patch un token testuale `<3.0 seconds>` (o formato `HH:MM:SS`). Diagnosi del T-RoPE: position IDs temporali troppo grandi/sparsi per video lunghi → degrada long temporal context; richiede sampling uniforme su tanti fps, costoso da costruire [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.3].
- **2D-RoPE per immagini singole** (VideoLLaMA-3): MRoPE usata come pura 2D-RoPE sulle dimensioni spatial — è la specializzazione image-only dell'estensione multimodale [source: raw/papers/zhang-2025-videollama-3.pdf §3.1].

## Varianti / Estensioni

- **Chunked vs Interleaved**: la differenza non è teorica ma di copertura dello spettro di frequenze; Qwen3-VL non riporta plot empirici della "spectral imbalance" — la giustificazione si appoggia a citazioni di "subsequent studies" non riprodotte [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1].
- **Absolute-time vs textual timestamp**: due strategie alternative per long-video. Qwen2.5-VL sceglie la prima (T-RoPE); Qwen3-VL la abbandona per i textual timestamp tokens, leggero aumento di context ma più flessibilità [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.3].

## Concetti correlati

- [[rotary-position-embedding]] — base architetturale di MRoPE.
- [[vision-transformer]] — ViT moderni usano 2D-RoPE (caso degenere di MRoPE).
- [[positional-encoding]] — superfamiglia.
- [[dynamic-resolution]] — MRoPE permette di codificare posizioni in immagini a risoluzione variabile senza re-interpolazione.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — introduce T-RoPE absolute-time-aligned.
- [[qwen3-vl-2025-tech-report]] — introduce Interleaved MRoPE e textual timestamp tokens.
- [[zhang-2025-videollama-3]] — usa MRoPE come 2D-RoPE per il ViT image-centric.
