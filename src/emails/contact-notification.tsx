import {
	Body,
	Column,
	Container,
	Font,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	pixelBasedPreset,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface ContactNotificationEmailProps {
	name: string;
	email: string;
	subject: string;
	message: string;
}

const sansStack = "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "siamparvez.com";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://siamparvez.com";

export const ContactNotificationEmail = ({
	name,
	email,
	subject,
	message,
}: ContactNotificationEmailProps) => {
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
					<Preview>{subject}</Preview>

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
								New Form Submission
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
								You have a new message from {name}.
							</Heading>
						</Section>

						{/* ── Field: Name ── */}
						<Section
							style={{
								borderBottom: "1px solid",
								borderColor: "#eeeeee",
							}}
						>
							<Row>
								<Column
									style={{
										width: "100px",
										paddingTop: "14px",
										paddingBottom: "14px",
										paddingLeft: "36px",
										paddingRight: "16px",
										verticalAlign: "top",
										borderRight: "1px solid",
										borderColor: "#eeeeee",
									}}
								>
									<Text
										style={{
											margin: "0",
											fontSize: "10px",
											letterSpacing: "0.08em",
											textTransform: "uppercase",
											color: "#aaaaaa",
											fontFamily: sansStack,
										}}
									>
										Name
									</Text>

									<Text
										style={{
											margin: "0",
											fontSize: "13px",
											fontWeight: 600,
											fontFamily: sansStack,
										}}
									>
										{name}
									</Text>
								</Column>
							</Row>
						</Section>

						{/* ── Field: Email ── */}
						<Section
							style={{
								borderBottom: "1px solid",
								borderColor: "#eeeeee",
							}}
						>
							<Row>
								<Column
									style={{
										width: "100px",
										paddingTop: "14px",
										paddingBottom: "14px",
										paddingLeft: "36px",
										paddingRight: "16px",
										verticalAlign: "top",
										borderRight: "1px solid",
										borderColor: "#eeeeee",
									}}
								>
									<Text
										style={{
											margin: "0",
											fontSize: "10px",
											letterSpacing: "0.08em",
											textTransform: "uppercase",
											color: "#aaaaaa",
											fontFamily: sansStack,
										}}
									>
										Email
									</Text>

									<Text
										style={{
											margin: "0",
											fontSize: "13px",
											fontWeight: 600,
											fontFamily: sansStack,
										}}
									>
										{email}
									</Text>
								</Column>
							</Row>
						</Section>

						<Section
							style={{
								borderBottom: "1px solid",
								borderColor: "#eeeeee",
							}}
						>
							<Row>
								<Column
									style={{
										width: "100px",
										paddingTop: "14px",
										paddingBottom: "14px",
										paddingLeft: "36px",
										paddingRight: "16px",
										verticalAlign: "top",
										borderRight: "1px solid",
										borderColor: "#eeeeee",
									}}
								>
									<Text
										style={{
											margin: "0",
											fontSize: "10px",
											letterSpacing: "0.08em",
											textTransform: "uppercase",
											color: "#aaaaaa",
											fontFamily: sansStack,
										}}
									>
										Subject
									</Text>

									<Text
										style={{
											margin: "0",
											fontSize: "13px",
											fontWeight: 600,
											fontFamily: sansStack,
										}}
									>
										{subject}
									</Text>
								</Column>
							</Row>
						</Section>
						<Section
							style={{
								borderBottom: "1px solid",
								borderColor: "#eeeeee",
							}}
						>
							<Row>
								<Column
									style={{
										width: "100px",
										paddingTop: "14px",
										paddingBottom: "14px",
										paddingLeft: "36px",
										paddingRight: "16px",
										verticalAlign: "top",
										borderRight: "1px solid",
										borderColor: "#eeeeee",
									}}
								>
									<Text
										style={{
											margin: "0",
											fontSize: "10px",
											letterSpacing: "0.08em",
											textTransform: "uppercase",
											color: "#aaaaaa",
											fontFamily: sansStack,
										}}
									>
										Message
									</Text>

									<Text
										style={{
											margin: "0",
											fontSize: "13px",
											fontFamily: sansStack,
										}}
									>
										{message}
									</Text>
								</Column>
							</Row>
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
									margin: "0",
									fontSize: "10px",
									color: "#bbbbbb",
									lineHeight: "1.6",
									fontFamily: sansStack,
								}}
							>
								You're receiving this from{" "}
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
export default ContactNotificationEmail;
