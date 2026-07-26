import {
	Body,
	Container,
	Font,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	pixelBasedPreset,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface ContactThankYouEmailProps {
	name: string;
}
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "siamparvez.com";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://siamparvez.com";

const sansStack = "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";

export const ContactThankYouEmail = ({
	name = "there",
}: ContactThankYouEmailProps) => {
	return (
		<Html>
			<Head>
				<Font
					fontFamily="DM Sans"
					fallbackFontFamily={["Helvetica", "Arial"]}
					webFont={{
						url: "https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmsqA.woff2",
						format: "woff2",
					}}
					fontWeight={400}
					fontStyle="normal"
				/>
				<Font
					fontFamily="DM Sans"
					fallbackFontFamily={["Helvetica", "Arial"]}
					webFont={{
						url: "https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8Cm8qA.woff2",
						format: "woff2",
					}}
					fontWeight={600}
					fontStyle="normal"
				/>
			</Head>
			<Tailwind config={{ presets: [pixelBasedPreset] }}>
				<Body
					style={{
						margin: "0",
						paddingTop: "40px",
						paddingBottom: "40px",
						paddingLeft: "16px",
						paddingRight: "16px",
						fontFamily: sansStack,
					}}
				>
					<Preview>
						I've received your message and will get back to you within 1
						business day.
					</Preview>

					<Container
						style={{
							margin: "0 auto",
							maxWidth: "480px",
							border: "1px solid",
							borderColor: "#e2e2e2",
						}}
					>
						{/* ── Hero ── */}
						<Section
							style={{
								paddingTop: "32px",
								paddingBottom: "28px",
								paddingLeft: "36px",
								paddingRight: "36px",
								borderBottom: "1px solid",
								borderColor: "#e8e8e8",
							}}
						>
							{/* <Img
								// TODO: Priority ( High ) siamparvez 031620261548
								src="https://res.cloudinary.com/daiec0a1x/image/upload/v1773771470/icon-128x128_x9ewb4.png"
								width="32"
								height="32"
								alt="Siam Parvez"
								style={{ display: "block", marginBottom: "24px" }}
							/> */}
							<Text
								style={{
									margin: "0 0 12px 0",
									fontSize: "10px",
									letterSpacing: "0.12em",
									textTransform: "uppercase",
									color: "#aaaaaa",
									fontFamily: sansStack,
								}}
							>
								Message Received
							</Text>
							<Heading
								style={{
									margin: "0",
									fontSize: "20px",
									fontWeight: 600,
									lineHeight: "1.3",
									letterSpacing: "-0.015em",
									fontFamily: sansStack,
								}}
							>
								Thanks for reaching out — I'll be in touch soon.
							</Heading>
						</Section>

						{/* ── Body copy ── */}
						<Section
							style={{
								paddingTop: "24px",
								paddingBottom: "24px",
								paddingLeft: "36px",
								paddingRight: "36px",
								borderBottom: "1px solid",
								borderColor: "#e8e8e8",
							}}
						>
							<Text
								style={{
									margin: "0 0 6px 0",
									fontSize: "13px",
									lineHeight: "1.8",
									fontFamily: sansStack,
								}}
							>
								Hello <strong>{name}</strong>,
							</Text>
							<Text
								style={{
									margin: "0 0 14px 0",
									fontSize: "13px",
									lineHeight: "1.8",
									fontFamily: sansStack,
								}}
							>
								Your message has been successfully received, and I appreciate
								your interest in working together. I will review the details of
								your inquiry and respond as soon as possible.
							</Text>
							<Text
								style={{
									margin: "0 0 20px 0",
									fontSize: "13px",
									lineHeight: "1.8",
									fontFamily: sansStack,
								}}
							>
								You can generally expect a response{" "}
								<strong>within 1 business day</strong>.
							</Text>

							{/* ── Callout ── */}
							<Section
								style={{
									borderLeft: "2px solid",
									borderColor: "#cccccc",
									paddingLeft: "14px",
								}}
							>
								<Text
									style={{
										margin: "0",
										fontSize: "12px",
										lineHeight: "1.65",
										fontFamily: sansStack,
									}}
								>
									In the meantime, feel free to review my work at{" "}
									<Link
										href={appUrl}
										style={{
											textDecoration: "underline",
											fontFamily: sansStack,
										}}
									>
										{baseUrl}
									</Link>
									.
								</Text>
							</Section>
						</Section>

						{/* ── Signature + footer ── */}
						<Section
							style={{
								paddingTop: "20px",
								paddingBottom: "24px",
								paddingLeft: "36px",
								paddingRight: "36px",
							}}
						>
							<Text
								style={{
									margin: "0 0 2px 0",
									fontSize: "13px",
									fontWeight: 600,
									fontFamily: sansStack,
								}}
							>
								Siam Parvez
							</Text>
							<Text
								style={{
									margin: "0 0 20px 0",
									fontSize: "11px",
									color: "#999999",
									fontFamily: sansStack,
								}}
							>
								Full-Stack Engineer
							</Text>
							<Hr
								style={{
									margin: "0 0 16px 0",
									borderColor: "#e8e8e8",
								}}
							/>
							<Text
								style={{
									margin: "0",
									fontSize: "10px",
									color: "#bbbbbb",
									lineHeight: "1.6",
									fontFamily: sansStack,
								}}
							>
								You're receiving this because you contacted via{" "}
								<Link
									href={appUrl}
									style={{
										color: "#888888",
										textDecoration: "underline",
										fontFamily: sansStack,
									}}
								>
									{baseUrl}
								</Link>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default ContactThankYouEmail;
