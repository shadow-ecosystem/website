import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Terms() {
	return (
		<div
			style={{
				backgroundColor: "var(--md-sys-color-surface)",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Header />

			{/* Page Header */}
			<div
				style={{
					backgroundColor: "var(--md-sys-color-surface)",
					padding: "160px 24px 48px",
					borderBottom: "1px solid var(--md-sys-color-surface-container-high)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					textAlign: "center",
				}}
			>
				<div style={{ maxWidth: "840px", width: "100%" }}>
					<h1
						className="display-medium"
						style={{
							color: "var(--md-sys-color-on-surface)",
							fontWeight: 500,
							letterSpacing: "-0.02em",
							marginBottom: "24px",
						}}
					>
						Terms of Service
					</h1>
					<p
						className="title-medium"
						style={{ color: "var(--md-sys-color-outline)", fontWeight: 400 }}
					>
						Effective date: September 24, 2026
					</p>
				</div>
			</div>

			{/* Content Section */}
			<main
				style={{
					flex: 1,
					padding: "64px 24px",
					maxWidth: "840px",
					margin: "0 auto",
					width: "100%",
				}}
			>
				<section style={{ marginBottom: "48px" }}>
					<p
						className="body-large"
						style={{
							color: "var(--md-sys-color-on-surface)",
							marginBottom: "24px",
						}}
					>
						These Terms of Service (“Terms”) govern your access to and use of
						the Shadow Ecosystem, websites, applications, and associated
						services (collectively, the "Services"), provided by Shadow
						Ecosystem Limited (“we,” “our,” or “us”). By accessing or using the
						Services, you agree to be bound by these Terms and our Privacy
						Policy. If you do not agree to these Terms, you may not access or
						use the Services.
					</p>
				</section>

				<section style={{ marginBottom: "48px" }}>
					<h2
						className="headline-medium"
						style={{
							color: "var(--md-sys-color-on-surface)",
							marginBottom: "16px",
							fontWeight: 500,
						}}
					>
						1. Use of Services
					</h2>
					<p
						className="body-large"
						style={{
							color: "var(--md-sys-color-on-surface)",
							marginBottom: "16px",
						}}
					>
						You are permitted to use the Services only in compliance with these
						Terms and all applicable local, national, and international laws,
						rules, and regulations. You shall not misuse the Services, including
						but not limited to unauthorized access, reverse engineering,
						interfering with service infrastructure, or attempting to extract
						source code.
					</p>
					<p
						className="body-large"
						style={{ color: "var(--md-sys-color-on-surface)" }}
					>
						Shadow Ecosystem Limited reserves the right, at its sole discretion,
						to suspend or terminate your access to the Services in the event of
						suspected misconduct or material breach of these Terms.
					</p>
				</section>

				<section style={{ marginBottom: "48px" }}>
					<h2
						className="headline-medium"
						style={{
							color: "var(--md-sys-color-on-surface)",
							marginBottom: "16px",
							fontWeight: 500,
						}}
					>
						2. Privacy
					</h2>
					<p
						className="body-large"
						style={{ color: "var(--md-sys-color-on-surface)" }}
					>
						Your use of the Services is also subject to our{" "}
						<Link
							href="/privacy"
							style={{
								color: "var(--md-sys-color-primary)",
								textDecoration: "underline",
								textUnderlineOffset: "4px",
							}}
						>
							Privacy Policy
						</Link>
						, which explains how we collect, process, and safeguard your data.
						By using the Services, you consent to the data practices delineated
						in our Privacy Policy, including the strict prohibition on
						third-party data sharing, barring explicitly designated public
						information.
					</p>
				</section>

				<section style={{ marginBottom: "48px" }}>
					<h2
						className="headline-medium"
						style={{
							color: "var(--md-sys-color-on-surface)",
							marginBottom: "16px",
							fontWeight: 500,
						}}
					>
						3. Changes to Services
					</h2>
					<p
						className="body-large"
						style={{ color: "var(--md-sys-color-on-surface)" }}
					>
						We continually innovate and iterate to improve the Services.
						Consequently, Shadow Ecosystem Limited reserves the right to modify,
						suspend, or discontinue any feature, functionality, or the entirety
						of the Services at any time, with or without prior notice. You
						maintain the right to cease utilizing the Services at your
						discretion.
					</p>
				</section>

				<section style={{ marginBottom: "48px" }}>
					<h2
						className="headline-medium"
						style={{
							color: "var(--md-sys-color-on-surface)",
							marginBottom: "16px",
							fontWeight: 500,
						}}
					>
						4. Warranties and Liability
					</h2>
					<p
						className="body-large"
						style={{ color: "var(--md-sys-color-on-surface)" }}
					>
						Security and reliability are core principles of the Shadow
						Ecosystem. We are committed to providing a highly secure and robust
						platform. However, the Services are provided on an "as is" and "as
						available" basis. While we employ stringent security measures,
						Shadow Ecosystem Limited cannot guarantee absolute uninterrupted
						service or eliminate all potential risks inherent in digital
						platforms.
					</p>
				</section>

				<section
					style={{
						marginBottom: "48px",
						paddingTop: "32px",
						borderTop: "1px solid var(--md-sys-color-surface-container-high)",
					}}
				>
					<p
						className="body-medium"
						style={{ color: "var(--md-sys-color-outline)" }}
					>
						For formal inquiries or legal correspondence regarding these Terms,
						please contact us at{" "}
						<a
							href="mailto:info@shadow.com.bd"
							style={{
								color: "var(--md-sys-color-primary)",
								textDecoration: "none",
							}}
						>
							info@shadow.com.bd
						</a>
						.
					</p>
				</section>
			</main>

			<Footer />
		</div>
	);
}
