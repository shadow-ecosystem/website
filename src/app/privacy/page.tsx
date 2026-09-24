import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacy() {
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
						Privacy Policy
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
						This Privacy Policy outlines the practices of Shadow Ecosystem
						Limited (“we,” “our,” or “us”) regarding the collection, use, and
						protection of your information when you access or use the Shadow
						Ecosystem, websites, and associated services (collectively, the
						"Services"). By utilizing our Services, you consent to the data
						practices described in this policy.
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
						1. Data Collection
					</h2>
					<p
						className="body-large"
						style={{ color: "var(--md-sys-color-on-surface)" }}
					>
						We strictly limit the collection of personal information to the
						minimum necessary for the effective operation of our Services. Data
						collected primarily consists of anonymized technical usage metrics
						required for performance optimization, security monitoring, and
						service stability.
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
						2. Data Usage
					</h2>
					<p
						className="body-large"
						style={{
							color: "var(--md-sys-color-on-surface)",
							marginBottom: "16px",
						}}
					>
						The information collected is utilized exclusively for the following
						operational purposes:
					</p>
					<ul
						className="body-large"
						style={{
							color: "var(--md-sys-color-on-surface)",
							paddingLeft: "24px",
							display: "flex",
							flexDirection: "column",
							gap: "8px",
						}}
					>
						<li>
							<strong>Service Delivery:</strong> To provision, maintain, and
							ensure the core functionality of the Shadow Ecosystem.
						</li>
						<li>
							<strong>System Security:</strong> To monitor for vulnerabilities,
							mitigate security risks, and protect the integrity of our
							infrastructure.
						</li>
						<li>
							<strong>Platform Enhancement:</strong> To analyze aggregate usage
							patterns for the continuous improvement of the user experience.
						</li>
					</ul>
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
						3. Data Sharing
					</h2>
					<p
						className="body-large"
						style={{ color: "var(--md-sys-color-on-surface)" }}
					>
						Shadow Ecosystem Limited expressly prohibits the sale, rental, or
						unauthorized distribution of your personal information to third
						parties. Data is not shared with any external entity, with the sole
						exception of information that you have deliberately designated as
						public, or inherently public content—such as publicly accessible
						website data—which may be indexed by third-party search engines or
						platforms (e.g., Google).
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
						4. Security
					</h2>
					<p
						className="body-large"
						style={{ color: "var(--md-sys-color-on-surface)" }}
					>
						We implement industry-standard administrative, technical, and
						physical security measures designed to safeguard your information
						against unauthorized access, alteration, disclosure, or destruction.
						Access to infrastructure and sensitive systems is strictly limited
						to authorized Shadow Ecosystem Limited personnel who require such
						access to fulfill their professional obligations.
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
						For formal inquiries regarding our data practices or this Privacy
						Policy, please direct correspondence to{" "}
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
