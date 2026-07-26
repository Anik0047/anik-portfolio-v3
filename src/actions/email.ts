"use server";
// ⚠️ DEPLOYMENT CAVEAT — read before deploying to Vercel ⚠️
// nodemailer sends email by opening a direct SMTP TCP connection (ports 25/465/587).
// Vercel serverless functions BLOCK outbound SMTP connections, so this works in
// `next dev` but will time out / fail silently in production on Vercel. To send
// mail from Vercel, use an HTTP-based provider (Resend, SendGrid, Brevo API) or
// self-host on a VPS/Docker/Node server where SMTP is allowed. See the plan in
// the original commit that introduced this file for context.
import { render } from "@react-email/render";
import { headers } from "next/headers";
import nodemailer from "nodemailer";
import * as z from "zod";
import ContactNotificationEmail from "@/emails/contact-notification";
import ContactThankYouEmail from "@/emails/contact-template";
import { checkRateLimit } from "@/lib/rate-limit";

// SMTP transporter is created lazily and reused across invocations. In a
// serverless context each warm instance gets its own transporter; in a
// long-running server (e.g. `next start` on a VPS) this keeps one connection.
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
	if (transporter) return transporter;

	const port = Number(process.env.SMTP_PORT ?? 587);
	transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port,
		secure: port === 465,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});
	return transporter;
}

function getFromAddress(): string {
	const name = process.env.SMTP_FROM_NAME ?? "Portfolio";
	const address = process.env.EMAIL_FROM;
	return `"${name}" <${address}>`;
}

const DEFAULT_RATE_LIMIT_MAX = 5;
const DEFAULT_RATE_LIMIT_WINDOW_SECONDS = 60;
const RECAPTCHA_MIN_SCORE = 0.5;
const RECAPTCHA_ACTION = "contact_form_submit";

function getRateLimitConfig() {
	const maxRaw = Number(process.env.RATE_LIMIT_MAX);
	const windowRaw = Number(process.env.RATE_LIMIT_WINDOW);

	const max =
		Number.isFinite(maxRaw) && maxRaw > 0 ? maxRaw : DEFAULT_RATE_LIMIT_MAX;
	const windowSeconds =
		Number.isFinite(windowRaw) && windowRaw > 0
			? windowRaw
			: DEFAULT_RATE_LIMIT_WINDOW_SECONDS;

	return {
		max,
		windowSeconds,
	};
}

async function getRequesterKey() {
	const h = await headers();
	const xForwardedFor = h.get("x-forwarded-for");
	if (xForwardedFor) {
		const firstIp = xForwardedFor.split(",")[0]?.trim();
		if (firstIp) return `ip:${firstIp}`;
	}

	const realIp = h.get("x-real-ip");
	if (realIp) return `ip:${realIp}`;

	return "ip:unknown";
}

type RecaptchaVerifyResponse = {
	success: boolean;
	score?: number;
	action?: string;
	"error-codes"?: string[];
};

async function verifyRecaptchaToken(token: string, ip?: string) {
	const secretKey = process.env.RECAPTCHA_SECRET_KEY;
	if (!secretKey) {
		console.warn(
			"[contact form] RECAPTCHA_SECRET_KEY is missing; skipping captcha verification.",
		);
		return true;
	}

	const params = new URLSearchParams();
	params.set("secret", secretKey);
	params.set("response", token);
	if (ip && ip !== "unknown") {
		params.set("remoteip", ip);
	}

	try {
		const response = await fetch(
			"https://www.google.com/recaptcha/api/siteverify",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: params.toString(),
				cache: "no-store",
			},
		);

		if (!response.ok) return false;

		const data = (await response.json()) as RecaptchaVerifyResponse;
		if (!data.success) return false;
		if (data.action && data.action !== RECAPTCHA_ACTION) return false;
		if (typeof data.score === "number" && data.score < RECAPTCHA_MIN_SCORE)
			return false;

		return true;
	} catch {
		return false;
	}
}

export type FormState = {
	success?: boolean;
	message?: string;
	error?: string;
	values?: {
		name?: string;
		email?: string;
		subject?: string;
		message?: string;
	};
	fieldErrors?: {
		name?: string;
		email?: string;
		subject?: string;
		message?: string;
	};
};

const formSchema = z.object({
	name: z.string().min(1, "Name is required."),
	email: z.email("Enter a valid email address."),
	subject: z.string().min(1, "Subject is required."),
	message: z.string().min(20, "Message must be at least 20 characters."),
});

export async function submitContactForm(
	_prevState: FormState,
	formData: FormData,
): Promise<FormState> {
	const requesterKey = await getRequesterKey();
	const { max, windowSeconds } = getRateLimitConfig();
	const limitStatus = await checkRateLimit({
		key: requesterKey,
		max,
		windowSeconds,
	});
	const requesterIp = requesterKey.replace("ip:", "");

	const submittedValues = {
		name: String(formData.get("name") ?? ""),
		email: String(formData.get("email") ?? ""),
		subject: String(formData.get("subject") ?? ""),
		message: String(formData.get("message") ?? ""),
	};

	if (limitStatus.limited) {
		return {
			success: false,
			error: `Too many attempts. Please wait ${limitStatus.retryAfterSeconds}s and try again.`,
			values: submittedValues,
		};
	}

	// ── Validate ───────────────────────────────────────────────────────────────
	const parsed = formSchema.safeParse(Object.fromEntries(formData.entries()));

	if (!parsed.success) {
		const fieldErrors: FormState["fieldErrors"] = {};
		for (const [field, issues] of Object.entries(
			parsed.error.flatten().fieldErrors,
		)) {
			fieldErrors[field as keyof typeof fieldErrors] = issues?.[0];
		}
		return { success: false, fieldErrors, values: submittedValues };
	}

	const { name, email, subject, message } = parsed.data;
	const shouldEnforceCaptcha = Boolean(process.env.RECAPTCHA_SECRET_KEY);
	if (shouldEnforceCaptcha) {
		const captchaToken = String(formData.get("captchaToken") ?? "").trim();
		if (!captchaToken) {
			return {
				success: false,
				error: "Spam protection failed. Please refresh and try again.",
				values: submittedValues,
			};
		}
		// TODO: Priority ( High ) siamparvez 033020261413 issue with spam protechtion
		const isCaptchaValid = await verifyRecaptchaToken(
			captchaToken,
			requesterIp,
		);
		if (!isCaptchaValid) {
			return {
				success: false,
				error: "Spam protection check failed. Please try again.",
				values: submittedValues,
			};
		}
	}

	// ── 1. Notify you ──────────────────────────────────────────────────────────
	const notifyHtml = await render(
		ContactNotificationEmail({ name, email, subject, message }),
	);
	const notifyText = `New form submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n`;

	try {
		await getTransporter().sendMail({
			from: getFromAddress(),
			to: process.env.CONTACT_EMAIL,
			replyTo: email,
			subject: `[Portfolio] ${subject}`,
			text: notifyText,
			html: notifyHtml,
		});
	} catch (notifyError) {
		console.error("[contact form] notify error:", notifyError);
		return {
			success: false,
			error: "Something went wrong. Please try again or email me directly.",
			values: submittedValues,
		};
	}

	// ── 2. Thank-you to visitor ────────────────────────────────────────────────
	// Fire-and-forget: a failure here shouldn't surface to the submitter.
	void render(ContactThankYouEmail({ name }))
		.then((thankYouHtml) =>
			getTransporter().sendMail({
				from: getFromAddress(),
				to: email,
				subject: "Thanks for reaching out!",
				text: `Hello ${name},\n\nThanks for reaching out — I'll be in touch soon.\n`,
				html: thankYouHtml,
			}),
		)
		.catch((error) => console.error("[contact form] thank-you error:", error));

	return {
		success: true,
		message: "Message sent. I'll get back to you soon.",
		values: {},
	};
}
