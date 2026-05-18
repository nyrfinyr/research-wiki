---
title: ViT Registers
type: concept
tags: [method, vision-transformer, attention-sink]
created: 2026-05-16
updated: 2026-05-16
---

# ViT Registers

ViT registers (Darcet et al. 2023) sono token aggiuntivi senza significato semantico inseriti nell'input di un Vision Transformer durante il training, con la funzione di assorbire l'attenzione "di scarto" che altrimenti finirebbe su token di background producendo artefatti nelle feature map. Sono parenti stretti dei sink token osservati negli LLM.

Nel wiki sono il riferimento concettuale del paper Kim 2026, che ipotizza i sink token nei video-LLM come l'oggetto che dei registers "vorrebbero" assorbire — e che SToP rimuove training-free.

## Sources

- [[kim-2026-sink-token-aware-pruning]] — riferimento per la connessione concettuale
