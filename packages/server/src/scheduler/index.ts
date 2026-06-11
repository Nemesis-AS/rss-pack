import "./worker.js";
import { scheduleAllFeeds } from "./repeatables.js";

export async function startScheduler() {
  await scheduleAllFeeds();
}

export * from "./queue.js";
export * from "./repeatables.js";
