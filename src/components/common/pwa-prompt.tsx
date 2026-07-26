// components/PWAInstallPrompt.tsx
"use client";

import { Check, Download, Share } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { usePreloaderStore } from "@/stores/preloader-store";
import { Button } from "../ui/button";
import { useNavbarStore } from "@/stores/navbar-store";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Platform = "chrome" | "ios" | "other";

const STORAGE_KEY = "pwa-install-prompt-dismissed";
const STORAGE_CONSENT_KEY = "site-storage-consent";
const AUTO_HIDE_PROMPT_MS = 12_000;
const COOKIE_PROMPT_DELAY_MS = 3_000;
const SHOW_PWA_AFTER_CONSENT_MS = 5_000;
const PWA_PROMPT_SNOOZE_MS = 24 * 60 * 60 * 1000;

type StorageConsent = "accepted";

function detectPlatform(): Platform {
	const ua = navigator.userAgent;
	const isEdge = /edg/i.test(ua);
	const isFirefox = /firefox/i.test(ua);
	const isIOS = /iphone|ipad|ipod/i.test(ua);
	const isChromium = /chrome|chromium|crios/i.test(ua);
	if (isIOS) return "ios";
	if (isEdge) return "chrome";
	if (isFirefox) return "other";
	if (isChromium) return "chrome";
	return "other";
}

function isAppInstalled(): boolean {
	return (
		window.matchMedia("(display-mode: standalone)").matches ||
		(navigator as unknown as Navigator & { standalone?: boolean })
			.standalone === true
	);
}

function hasDismissed(): boolean {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return false;
		const dismissedAt = Number(raw);
		if (!Number.isFinite(dismissedAt)) return false;
		return Date.now() - dismissedAt < PWA_PROMPT_SNOOZE_MS;
	} catch {
		return false;
	}
}

function persistDismiss(): void {
	try {
		localStorage.setItem(STORAGE_KEY, String(Date.now()));
	} catch {
		// ignore
	}
}

function getStoredConsent(): StorageConsent | null {
	try {
		const value = localStorage.getItem(STORAGE_CONSENT_KEY);
		if (value === "accepted") {
			return value;
		}
		return null;
	} catch {
		return null;
	}
}

function persistStorageConsent(value: StorageConsent): void {
	try {
		localStorage.setItem(STORAGE_CONSENT_KEY, value);
	} catch {
		// ignore
	}
}

const iosSteps = [
	{
		step: "01",
		icon: <Share className="size-4 shrink-0" />,
		label: "Tap the",
		highlight: "Share button",
		suffix: "at the bottom of Safari",
	},
	{
		step: "02",
		icon: <Download className="size-4 shrink-0" />,
		label: "Scroll down and tap",
		highlight: "Add to Home Screen",
		suffix: "",
	},
	{
		step: "03",
		icon: <Check className="size-4 shrink-0" />,
		label: "Tap",
		highlight: "Add",
		suffix: "to confirm",
	},
];

const nonIosSteps = [
	{
		step: "01",
		icon: <Share className="size-4 shrink-0" />,
		label: "Open the",
		highlight: "browser menu",
		suffix: "(top-right)",
	},
	{
		step: "02",
		icon: <Download className="size-4 shrink-0" />,
		label: "Find",
		highlight: "Install app / Apps",
		suffix: "options",
	},
	{
		step: "03",
		icon: <Check className="size-4 shrink-0" />,
		label: "Confirm with",
		highlight: "Install",
		suffix: "to add it",
	},
];

export default function PWAInstallPrompt({
	_forceIOS = false, // dev-only: test iOS flow in non-iOS browsers
}: {
	_forceIOS?: boolean;
}) {
	const isMenuOpen = useNavbarStore((s) => s.isMenuOpen);
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [platform, setPlatform] = useState<Platform | null>(null);
	const [isVisible, setIsVisible] = useState(false);
	const [isCookiePromptVisible, setIsCookiePromptVisible] = useState(false);
	const [storageConsent, setStorageConsent] = useState<StorageConsent | null>(
		null,
	);
	const [showHelpDialog, setShowHelpDialog] = useState(false);
	const [hasReachedConsentPwaDelay, setHasReachedConsentPwaDelay] =
		useState(false);
	const isPreloadComplete = usePreloaderStore((s) => s.isComplete);
	const hasNativeInstallPrompt = deferredPrompt !== null;
	const shouldShowHelpFlow = platform === "ios" || !hasNativeInstallPrompt;

	useEffect(() => {
		setStorageConsent(getStoredConsent());
	}, []);

	useEffect(() => {
		if (!isPreloadComplete) return;
		if (storageConsent !== null) {
			setIsCookiePromptVisible(false);
			return;
		}

		const timeoutId = window.setTimeout(() => {
			setIsCookiePromptVisible(true);
		}, COOKIE_PROMPT_DELAY_MS);

		return () => window.clearTimeout(timeoutId);
	}, [isPreloadComplete, storageConsent]);

	useEffect(() => {
		if (storageConsent !== "accepted") {
			setHasReachedConsentPwaDelay(false);
			return;
		}

		const timeoutId = window.setTimeout(() => {
			setHasReachedConsentPwaDelay(true);
		}, SHOW_PWA_AFTER_CONSENT_MS);

		return () => window.clearTimeout(timeoutId);
	}, [storageConsent]);

	useEffect(() => {
		// Keep listener active early so Chrome's event isn't missed while preloader runs.
		if (hasDismissed() || isAppInstalled()) return;

		const detected = _forceIOS ? "ios" : detectPlatform();
		setPlatform(detected);

		if (detected === "ios") {
			return;
		}

		const handler = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		};

		window.addEventListener("beforeinstallprompt", handler);
		return () => window.removeEventListener("beforeinstallprompt", handler);
	}, [_forceIOS]);

	useEffect(() => {
		if (!hasReachedConsentPwaDelay) return;
		if (hasDismissed() || isAppInstalled()) return;
		if (storageConsent !== "accepted") return;
		if (isCookiePromptVisible) return;

		if (platform === "other") {
			setIsVisible(true);
			return;
		}

		if (platform === "ios") {
			setIsVisible(true);
			return;
		}

		// For Chromium browsers, show prompt even without native event and fallback to manual steps.
		if (platform === "chrome") {
			setIsVisible(true);
			return;
		}

		if (deferredPrompt) {
			setIsVisible(true);
		}
	}, [
		hasReachedConsentPwaDelay,
		deferredPrompt,
		platform,
		storageConsent,
		isCookiePromptVisible,
	]);

	useEffect(() => {
		if (!isVisible || showHelpDialog) return;

		const timeoutId = window.setTimeout(() => {
			setIsVisible(false);
		}, AUTO_HIDE_PROMPT_MS);

		return () => window.clearTimeout(timeoutId);
	}, [isVisible, showHelpDialog]);

	const handleInstall = async () => {
		if (!deferredPrompt) return;
		await deferredPrompt.prompt();
		// const { outcome } = await deferredPrompt.userChoice;
		// Persist regardless of outcome — user interacted, don't pester again
		persistDismiss();
		setDeferredPrompt(null);
		setIsVisible(false);
	};

	const handleDismiss = () => {
		persistDismiss();
		setIsVisible(false);
		setShowHelpDialog(false);
	};

	const handleHelpDialogDismiss = () => {
		persistDismiss();
		setShowHelpDialog(false);
		setIsVisible(false);
	};

	const handleStorageAccept = () => {
		persistStorageConsent("accepted");
		setStorageConsent("accepted");
		setIsCookiePromptVisible(false);
	};

	return (
		<>
			{/* ── Install help dialog ── */}
			<Dialog
				open={showHelpDialog}
				onOpenChange={(open) => {
					if (!open) handleHelpDialogDismiss();
				}}
			>
				<DialogContent className="sm:max-w-sm rounded-sm lg:rounded-lg bg-background/70 dark:bg-primary/10 backdrop-blur-xl border border-primary/10">
					<DialogHeader className="space-y-1">
						<div className="flex items-center flex-col gap-3 mb-1">
							<div className="flex size-10 items-center justify-center rounded-full bg-primary text-background">
								<Download className="size-5" />
							</div>
							<DialogTitle className="text-lg font-bold">
								Install App
							</DialogTitle>
						</div>
						<DialogDescription className="text-sm typo-subtle text-center">
							{platform === "ios"
								? "Follow these steps in Safari to add the app to your home screen."
								: "Your browser may not show the native install popup. Use these manual steps."}
						</DialogDescription>
					</DialogHeader>

					<div className="mt-2 space-y-4">
						{(platform === "ios" ? iosSteps : nonIosSteps).map(
							({ step, icon, label, highlight, suffix }, i) => (
								<motion.div
									key={step}
									initial={{ opacity: 0, x: 12 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.08, duration: 0.28 }}
									className="flex items-center gap-3"
								>
									<span className="mt-0.5 font-mono text-[10px] font-bold text-muted-foreground/60 shrink-0 w-5 text-right">
										{step}
									</span>
									<div className="flex items-center gap-2">
										<div className="aspect-square rounded size-10 text-primary flex-center">
											{icon}
										</div>
										<p className="text-sm text-foreground/80 leading-relaxed">
											{label}{" "}
											<span className="font-semibold text-foreground">
												{highlight}
											</span>{" "}
											{suffix}
										</p>
									</div>
								</motion.div>
							),
						)}
					</div>

					<Button
						type="button"
						className="w-full mt-4"
						onClick={handleHelpDialogDismiss}
					>
						Got it
					</Button>
				</DialogContent>
			</Dialog>

			{/* ── Storage consent prompt ── */}
			<AnimatePresence>
				{isCookiePromptVisible && (
					<motion.div
						key="storage-consent-prompt"
						initial={{ opacity: 0, y: 36 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 24 }}
						transition={{ type: "spring", stiffness: 280, damping: 28 }}
						className="fixed left-4 sm:left-8 bottom-4 sm:bottom-8 z-80 sm:z-40 w-[min(26rem,calc(100vw-2rem))] rounded-xl border border-primary/15 bg-background/75 dark:bg-primary/10 backdrop-blur-xl p-4 shadow-lg"
					>
						<div className="space-y-3">
							<div className="space-y-1">
								<p className="text-sm font-semibold">Storage Notice</p>
								<p className="text-xs text-muted-foreground leading-relaxed">
									This site uses cookies and local storage to provide the best
									performance and remember essential settings.
								</p>
							</div>

							<div className="flex items-center justify-end gap-2">
								<Button
									type="button"
									size="sm"
									onClick={handleStorageAccept}
									className="rounded-md"
								>
									OK
								</Button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* ── Floating install bar ── */}
			<AnimatePresence>
				{isVisible && (
					<motion.div
						key="pwa-prompt"
						initial={{ opacity: 0, y: 36 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 24 }}
						transition={{ type: "spring", stiffness: 300, damping: 28 }}
						className="fixed right-4 sm:right-8 bottom-4 sm:bottom-8 bg-background/75 dark:bg-primary/10 backdrop-blur-xl border border-primary/15 z-80 sm:z-40 p-3 rounded-xl w-[min(26rem,calc(100vw-2rem))] shadow-lg"
					>
						<motion.div
							key="default-bar"
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 8 }}
							transition={{ duration: 0.25, ease: "easeOut" }}
							className="flex items-center gap-3"
						>
							<motion.div
								initial={{ scale: 0, rotate: -20 }}
								animate={{ scale: 1, rotate: 0 }}
								transition={{
									delay: 0.15,
									type: "spring",
									stiffness: 400,
									damping: 20,
								}}
								className="flex size-9 shrink-0 items-center justify-center bg-primary rounded-full text-background"
							>
								<Download className="size-5" />
							</motion.div>

							<div className="flex-1 min-w-0">
								<motion.p
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
									className="text-sm font-bold"
								>
									Install App
								</motion.p>
								<motion.p
									initial={{ y: 6 }}
									animate={{ y: 0 }}
									transition={{ delay: 0.27 }}
									className="text-xs mt-0.5 typo-subtle text-nowrap"
								>
									{platform === "ios"
										? "Add via Safari share menu"
										: hasNativeInstallPrompt
											? "Add to your home screen"
											: "Install manually from menu"}
								</motion.p>
							</div>

							<div className="flex items-center gap-1 shrink-0">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={handleDismiss}
									className="rounded-md typo-subtle"
								>
									Later
								</Button>

								<Button
									type="button"
									size="sm"
									onClick={
										shouldShowHelpFlow
											? () => setShowHelpDialog(true)
											: handleInstall
									}
									className="rounded-md"
								>
									{shouldShowHelpFlow ? "How?" : "Install"}
								</Button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
