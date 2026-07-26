// app/serwist/[path]/route.ts
import { spawnSync } from "node:child_process";
import { createSerwistRoute } from "@serwist/turbopack";

const revision =
	spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout ??
	crypto.randomUUID();

export const { GET } = createSerwistRoute({
	swSrc: "./src/app/sw.ts",
	additionalPrecacheEntries: [{ url: "/~offline", revision }],
});
