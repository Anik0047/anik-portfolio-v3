"use client";

import { FastForward, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface RecordPlayerProps {
	src: string;
	cover?: string;
	showBracketsOnHover?: boolean;
	className?: string;
}

const DEFAULT_COVER =
	"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop";

export default function RecordPlayer({
	src,
	cover = DEFAULT_COVER,
	showBracketsOnHover = true,
	className,
}: RecordPlayerProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(70);
	const [prevVolume, setPrevVolume] = useState(70);
	const [offset, setOffset] = useState(0);
	const [jolting, setJolting] = useState(false);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isDragging, setIsDragging] = useState(false);

	const [audioSrc, setAudioSrc] = useState<string | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const joltTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const progressBarRef = useRef<HTMLDivElement | null>(null);
	const lastScrubXRef = useRef<number | null>(null);

	useEffect(() => {
		if (audioRef.current) audioRef.current.volume = volume / 100;
	}, [volume]);

	useEffect(() => {
		if (!audioRef.current) return;
		if (isPlaying) {
			audioRef.current.play().catch(() => setIsPlaying(false));
		} else {
			audioRef.current.pause();
		}
	}, [isPlaying]);

	useEffect(() => {
		setIsPlaying(false);
		setProgress(0);
		setDuration(0);
		setAudioSrc(null);
		if (audioRef.current) audioRef.current.load();
	}, [src]);

	useEffect(() => {
		return () => {
			if (joltTimerRef.current) clearTimeout(joltTimerRef.current);
		};
	}, []);

	// Proportional jolt: MIN_JOLT for tiny seeks, MAX_JOLT for full-track jumps
	const MIN_JOLT = 15;
	const MAX_JOLT = 340;

	const triggerJolt = useCallback(
		(timeDelta: number, totalDuration: number) => {
			if (totalDuration === 0) return;
			const ratio = Math.min(1, Math.abs(timeDelta) / totalDuration);
			const deg = MIN_JOLT + ratio * (MAX_JOLT - MIN_JOLT);
			const signed = timeDelta >= 0 ? deg : -deg;

			if (joltTimerRef.current) clearTimeout(joltTimerRef.current);
			setJolting(true);
			setOffset((prev) => prev + signed);
			joltTimerRef.current = setTimeout(() => setJolting(false), 150);
		},
		[],
	);

	const seek = (seconds: number) => {
		if (!audioRef.current) return;
		const dur = audioRef.current.duration || 0;
		if (!dur) return;

		const nextTime = Math.min(
			dur,
			Math.max(0, audioRef.current.currentTime + seconds),
		);
		const delta = nextTime - audioRef.current.currentTime;
		if (Math.abs(delta) < 0.01) return;

		audioRef.current.currentTime = nextTime;
		setProgress(nextTime);
		triggerJolt(delta, dur);
	};

	const scrubToRatio = useCallback(
		(clientX: number, isInitialClick = false) => {
			if (!audioRef.current || !duration || !progressBarRef.current) return;
			const rect = progressBarRef.current.getBoundingClientRect();
			const clampedX = Math.min(rect.right, Math.max(rect.left, clientX));
			const ratio = (clampedX - rect.left) / rect.width;
			const newTime = ratio * duration;

			if (isInitialClick) {
				const timeDelta = newTime - audioRef.current.currentTime;
				if (Math.abs(timeDelta) > 0.1) triggerJolt(timeDelta, duration);
				lastScrubXRef.current = clampedX; // ← sync ref on click too
			} else if (lastScrubXRef.current !== null) {
				const pxDelta = clampedX - lastScrubXRef.current;
				if (Math.abs(pxDelta) > 4) {
					const timeDelta = (pxDelta / rect.width) * duration;
					triggerJolt(timeDelta, duration);
					lastScrubXRef.current = clampedX;
				}
				// removed the `else` branch entirely — it was the dead frame
			}

			audioRef.current.currentTime = newTime;
			setProgress(newTime);
		},
		[duration, triggerJolt],
	);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		e.currentTarget.setPointerCapture(e.pointerId);
		lastScrubXRef.current = e.clientX;
		setIsDragging(true);
		scrubToRatio(e.clientX, true);
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDragging) return;
		scrubToRatio(e.clientX, false);
	};

	const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
		e.currentTarget.releasePointerCapture(e.pointerId);
		lastScrubXRef.current = null;
		setIsDragging(false);
	};

	const formatTime = (s: number) => {
		const m = Math.floor(s / 60);
		const sec = Math.floor(s % 60);
		return `${m}:${sec.toString().padStart(2, "0")}`;
	};

	const VolumeIcon = volume === 0 ? VolumeX : Volume2;

	const toggleMute = () => {
		if (volume === 0) {
			setVolume(prevVolume);
		} else {
			setPrevVolume(volume);
			setVolume(0);
		}
	};

	const progressPercent = duration ? (progress / duration) * 100 : 0;

	// ✅ Play handler with lazy load
	const handlePlayToggle = () => {
		if (!audioSrc) {
			setAudioSrc(src);
		}
		setIsPlaying((p) => !p);
	};

	return (
		<Card
			showBracketsOnHover={showBracketsOnHover}
			className={cn(
				"border flex-col xs:flex-row md:flex-col items-center relative p-0 sm:p-0 md:p-0 gap-0 lg:min-w-74 min-w-64",
				className,
			)}
		>
			<audio
				ref={audioRef}
				src={audioSrc ?? undefined}
				onEnded={() => setIsPlaying(false)}
				onTimeUpdate={(e) => {
					if (!isDragging) setProgress(e.currentTarget.currentTime);
				}}
				onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
				preload="metadata"
			>
				<track
					kind="captions"
					src="/audio/thousand_years.vtt"
					label="English"
					default
				/>
			</audio>

			{/* Volume */}
			<div className="flex w-full items-center gap-3 absolute top-4 left-4 z-10">
				<Button
					variant="ghost"
					size="icon"
					onClick={toggleMute}
					aria-label={volume === 0 ? "Unmute audio" : "Mute audio"}
					className="size-9 text-foreground/50 hover:text-foreground"
				>
					<VolumeIcon className="size-5" aria-hidden="true" />
				</Button>
			</div>

			{/* CD */}
			<div className="grow flex-center">
				<div className="relative size-[clamp(160px,40vw,220px)] aspect-square">
					<div
						className="size-full p-6"
						style={{
							transform: `rotate(${offset}deg)`,
							transition: jolting
								? "transform 0.12s cubic-bezier(0.25, 0, 0.5, 1)"
								: "none",
						}}
					>
						<div
							className={cn(
								"relative w-full h-full rounded-full bg-[#0a0a0a] overflow-hidden animate-cd-spin border",
								isPlaying ? "running" : "paused",
							)}
						>
							<div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle_at_50%,#0a0a0a_0px,#0a0a0a_3px,#161616_3.5px,#0a0a0a_4px)]" />
							<div className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,transparent,rgba(255,255,255,0.55)_18deg,rgba(255,255,255,0.12)_36deg,transparent_60deg)]" />
							<div
								className="absolute top-1/2 left-1/2 size-[36%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-fit bg-center"
								style={{ backgroundImage: `url(${cover})` }}
							/>
							<div className="absolute top-1/2 left-1/2 h-[6.5%] w-[6.5%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-background" />
						</div>
					</div>
				</div>
			</div>

			<div className="w-full  self-stretch md:self-auto md:h-auto px-6 py-6 text-center flex-center flex-col gap-6">
				<div>
					<h3 className="text-lg typo-heading uppercase">A Thousand Years</h3>
					<small className="text-xs typo-mono typo-caption block mt-1 uppercase typo-ghost">
						By John Michael Howell
					</small>
				</div>

				{/* Progress Bar — draggable */}

				{/* Controls */}
				<div className="flex flex-col w-full items-center">
					<div className="w-full flex flex-col gap-1.5">
						<div
							ref={progressBarRef}
							role="slider"
							aria-label="Audio progress"
							aria-valuemin={0}
							aria-valuemax={duration}
							aria-valuenow={progress}
							aria-valuetext={`${formatTime(progress)} of ${
								duration ? formatTime(duration) : "0:00"
							}`}
							tabIndex={0}
							className={cn(
								"w-full h-3 flex items-center cursor-pointer group relative",
								isDragging && "cursor-grabbing",
							)}
							style={{ touchAction: "none" }} // ← ADD THIS
							onPointerDown={handlePointerDown}
							onPointerMove={handlePointerMove}
							onPointerUp={handlePointerUp}
							onPointerCancel={handlePointerUp}
							onKeyDown={(e) => {
								if (e.key === "ArrowRight") seek(5);
								if (e.key === "ArrowLeft") seek(-5);
							}}
						>
							<div className="w-full h-1 bg-foreground/10 rounded-full relative">
								<motion.div
									className="h-full bg-lemon rounded-full relative"
									style={{ width: `${progressPercent}%` }}
									transition={{ duration: isDragging ? 0 : 0.05 }}
								>
									{/* Scrub thumb */}
									<motion.div
										className="absolute -right-1.5 top-1/2 -translate-y-1/2 size-3 rounded-full bg-lemon"
										initial={{ scale: 0, opacity: 0 }}
										animate={{
											scale: isDragging ? 1.3 : 1,
											opacity: isDragging ? 1 : 0,
										}}
										whileHover={{ scale: 1, opacity: 1 }}
										transition={{ type: "spring", stiffness: 400, damping: 25 }}
										style={{
											opacity: isDragging ? 1 : undefined,
										}}
									/>
								</motion.div>
							</div>
						</div>
						<div className="flex justify-between text-[10px] typo-ghost font-mono tabular-nums">
							<span>{formatTime(progress)}</span>
							<span>{duration ? formatTime(duration) : "--:--"}</span>
						</div>
					</div>
					<div className="flex items-center">
						{/* Skip back */}
						<motion.div
							whileTap={{ scale: 0.82, x: -3 }}
							transition={{ type: "spring", stiffness: 500, damping: 20 }}
						>
							<Button
								variant="ghost"
								size="icon"
								className="size-12 typo-ghost"
								onClick={() => seek(-5)}
								aria-label="Rewind 5 seconds"
							>
								<FastForward className="size-6 rotate-180" aria-hidden="true" />
							</Button>
						</motion.div>

						{/* Play / Pause */}
						<motion.div
							whileTap={{ scale: 0.88 }}
							transition={{ type: "spring", stiffness: 500, damping: 22 }}
						>
							<Button
								variant="ghost"
								size="icon"
								onClick={handlePlayToggle}
								className="size-14 typo-ghost"
								aria-label={isPlaying ? "Pause audio" : "Play audio"}
							>
								<AnimatePresence mode="wait" initial={false}>
									{isPlaying ? (
										<motion.span
											key="pause"
											initial={{ scale: 0.7 }}
											animate={{ scale: 1 }}
											exit={{ scale: 0.7 }}
											transition={{ duration: 0.12, ease: "easeInOut" }}
										>
											<Pause className="size-7" />
										</motion.span>
									) : (
										<motion.span
											key="play"
											initial={{ scale: 0.7 }}
											animate={{ scale: 1 }}
											exit={{ scale: 0.7 }}
											transition={{ duration: 0.12, ease: "easeInOut" }}
										>
											<Play className="ml-1 size-7" />
										</motion.span>
									)}
								</AnimatePresence>
							</Button>
						</motion.div>

						{/* Skip forward */}
						<motion.div
							whileTap={{ scale: 0.82, x: 3 }}
							transition={{ type: "spring", stiffness: 500, damping: 20 }}
						>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => seek(5)}
								className="size-12 typo-ghost"
								aria-label="Forward 5 seconds"
							>
								<FastForward className="size-6" aria-hidden="true" />
							</Button>
						</motion.div>
					</div>
				</div>
			</div>
		</Card>
	);
}
