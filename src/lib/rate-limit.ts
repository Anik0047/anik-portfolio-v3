import { Redis } from "@upstash/redis";

type RateLimitInput = {
	key: string;
	max: number;
	windowSeconds: number;
};

type RateLimitResult = {
	limited: boolean;
	retryAfterSeconds?: number;
};

type MemoryRateLimitEntry = {
	count: number;
	windowStart: number;
};

const memoryRateLimitStore = new Map<string, MemoryRateLimitEntry>();

let redisClient: Redis | null | undefined;

function getRedisClient() {
	if (redisClient !== undefined) return redisClient;

	if (
		!process.env.UPSTASH_REDIS_REST_URL ||
		!process.env.UPSTASH_REDIS_REST_TOKEN
	) {
		redisClient = null;
		return redisClient;
	}

	redisClient = Redis.fromEnv();
	return redisClient;
}

function inMemoryRateLimit({
	key,
	max,
	windowSeconds,
}: RateLimitInput): RateLimitResult {
	const now = Date.now();
	const windowMs = windowSeconds * 1000;
	const current = memoryRateLimitStore.get(key);

	if (!current || now - current.windowStart >= windowMs) {
		memoryRateLimitStore.set(key, { count: 1, windowStart: now });
		return { limited: false };
	}

	if (current.count >= max) {
		return {
			limited: true,
			retryAfterSeconds: Math.max(
				1,
				Math.ceil((current.windowStart + windowMs - now) / 1000),
			),
		};
	}

	memoryRateLimitStore.set(key, { ...current, count: current.count + 1 });
	return { limited: false };
}

export async function checkRateLimit({
	key,
	max,
	windowSeconds,
}: RateLimitInput) {
	const redis = getRedisClient();
	if (!redis) {
		return inMemoryRateLimit({ key, max, windowSeconds });
	}

	const now = Date.now();
	const windowMs = windowSeconds * 1000;
	const bucket = Math.floor(now / windowMs);
	const redisKey = `contact_rate_limit:${key}:${bucket}`;

	try {
		const count = await redis.incr(redisKey);
		if (count === 1) {
			await redis.expire(redisKey, windowSeconds);
		}

		if (count > max) {
			const ttl = await redis.ttl(redisKey);
			return {
				limited: true,
				retryAfterSeconds: ttl > 0 ? ttl : windowSeconds,
			};
		}

		return { limited: false };
	} catch {
		return inMemoryRateLimit({ key, max, windowSeconds });
	}
}
