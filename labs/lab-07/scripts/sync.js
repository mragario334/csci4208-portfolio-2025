// scripts/sync.js — explicit, user-triggered sync helpers

/**
 * Sync Up: Local → Remote (e.g., LocalStorage → JSONBin)
 * Reads from the source adapter, deep clones the doc, writes to the destination adapter.
 */
export async function syncUp(readAdapter, writeAdapter) {
    const doc = await readAdapter.load();
    const copy = typeof structuredClone === "function"
      ? structuredClone(doc)
      : JSON.parse(JSON.stringify(doc));
  
    await writeAdapter.save(copy); // May throw if remote is newer
  }
  
  /**
   * Sync Down: Remote → Local (e.g., JSONBin → LocalStorage)
   * Reads from the source adapter, deep clones the doc, writes to the destination adapter.
   */
  export async function syncDown(readAdapter, writeAdapter) {
    const doc = await readAdapter.load();
    const copy = typeof structuredClone === "function"
      ? structuredClone(doc)
      : JSON.parse(JSON.stringify(doc));
  
    await writeAdapter.save(copy);
  }
  