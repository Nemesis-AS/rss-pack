import "./worker";
import { scheduleAllFeeds } from "./repeatables";

export async function startScheduler() {
  await scheduleAllFeeds();
}

export * from "./queue";
export * from "./repeatables";
