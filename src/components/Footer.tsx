"use client";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="main-footer">
			<div className="footer-bottom">
				<p className="body-small copyright">
					&copy; 2026 Shadow Ecosystem Limited.
				</p>

				<div className="footer-brand">
					<Link
						href="/"
						onClick={(e) => {
							if (window.location.pathname === "/") {
								e.preventDefault();
							}
							window.scrollTo({ top: 0, behavior: "smooth" });
						}}
						style={{
							textDecoration: "none",
							color: "inherit",
							display: "flex",
							alignItems: "center",
						}}
					>
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
										<clipPath id="f-clip">
											<rect width="24" height="24" rx="6" ry="6" />
										</clipPath>
									</defs>
									<g clipPath="url(#f-clip)">
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
					</Link>
				</div>

				<div className="legal-links">
					<Link href="/privacy" className="body-small">
						Privacy
					</Link>
					<Link href="/terms" className="body-small">
						Terms
					</Link>
				</div>
			</div>
		</footer>
	);
}
