# Mock Database Adapters

> Flexible, persistent database adapters for local and cloud storage with JavaScript.

---

## Overview
This project provides a set of database adapters and helper functions for managing application data.  
It supports **in-memory**, **LocalStorage**, and **JSONBin cloud storage**, all via a **unified adapter interface**.  
You can swap storage backends without changing your CRUD or DB logic.

---

## Goals / Features
- **Unified Adapter Contract:** All adapters implement `load()`, `save(next)`, `reset()`, and `snapshot()`.  
- **Persistent Storage:** LocalStorage adapter saves data across page reloads.  
- **Cloud Backup:** JSONBin adapter stores documents on a public JSONBin.  
- **Optimistic Concurrency:** Tracks revisions (`rev`) and timestamps (`updatedAt`) to prevent overwriting newer data.  
- **Manual Sync:** Explicit `syncUp` (local → cloud) and `syncDown` (cloud → local) for controlled backups and restores.  
- **CRUD Helpers:** `insertOne`, `findMany`, `findOne`, `updateOneOps`, `deleteOne`, `upsertOne`, `transact`.  
- **Seeding:** Automatically generates a fresh document if storage is empty or corrupted.  
- **Demo Schema:** Includes users, projects, todos, comments, and tags for testing and development.

---

## How to Run
1. Clone or download the repository.  
2. Install a simple HTTP server (if you don’t have one):  
   ```
   npm install --global http-server
   ```
3. Start a secure local server:
    ```
    npx http-server . --ssl --cert cert.pem --key key.pem -p 8443
    ```

4. Open your browser and navigate to: https://localhost:8443.