"use client";

export default function NotFound() {
	return (
		<main
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				color: "var(--md-sys-color-on-surface, #111111)",
				padding: "48px clamp(48px, 5vw, 64px)",
				position: "relative",
				fontFamily:
					'var(--md-sys-typescale-font-family, "Google Sans", sans-serif)',
			}}
		>
			<div
				className="responsive-wrapper"
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					gap: "64px",
					maxWidth: "800px",
					width: "100%",
				}}
			>
				{/* Left Column: Logo, Text, Action */}
				<div
					className="not-found-text-column"
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						maxWidth: "400px",
						flex: "1 1 300px",
					}}
				>
					{/* Brand Header with top-spanning background */}
					<div
						style={{
							position: "relative",
							marginBottom: "32px",
							padding: "32px 32px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							marginLeft: "-32px", // offset padding to align logo with text
						}}
					>
						{/* Background extending upwards infinitely */}
						<div
							style={{
								position: "absolute",
								bottom: 0,
								left: 0,
								right: 0,
								height: "100vh",
								backgroundColor: "#ffffff",
								borderBottomLeftRadius: "24px",
								borderBottomRightRadius: "24px",
								zIndex: -1,
							}}
						/>

						<span className="brand-name">
							<span className="letter">S</span>
							<span className="letter">H</span>
							<span className="letter">A</span>
							<span className="letter">D</span>
							<span className="letter">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
								>
									<defs>
										<clipPath id="a">
											<rect width="24" height="24" rx="6" ry="6" />
										</clipPath>
									</defs>
									<g clipPath="url(#a)">
										<rect x="0" y="0" width="24" height="24" fill="#000000" />
										<circle
											cx="8.25"
											cy="8.25"
											r="8.25"
											stroke="#ffffff"
											strokeWidth="6"
											transform="rotate(180 12 12)"
										/>
									</g>
								</svg>
							</span>
							<span className="letter">W</span>
						</span>
					</div>

					{/* Friendly Non-Technical Copy */}
					<h1
						style={{
							margin: "0 0 16px 0",
							fontSize: "36px",
							lineHeight: 1.2,
							fontWeight: 700,
							color: "var(--md-sys-color-on-surface, #111111)",
							letterSpacing: "-0.5px",
						}}
					>
						Page not found
					</h1>

					<p
						style={{
							margin: "0",
							fontSize: "18px",
							lineHeight: 1.5,
							color: "var(--md-sys-color-outline, #757575)",
						}}
					>
						We couldn't find the page you were looking for. <br />
						It might have been moved, or it may no longer exist.
					</p>
				</div>
			</div>
		</main>
	);
}
