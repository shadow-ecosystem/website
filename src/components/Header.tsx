"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Header() {
	const headerRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const headerContainer = headerRef.current?.querySelector(
			".nav-container",
		) as HTMLElement;
		if (!headerContainer) return;

		let ticking = false;

		function updateFluidScroll() {
			const scrollY = window.scrollY;

			const headerProgress = Math.min(Math.max(scrollY / 100, 0), 1);
			const alpha = headerProgress * 0.85;
			const blur = headerProgress * 24;
			const shadowOpacity = headerProgress * 0.06;
			const borderAlpha = headerProgress * 0.05;

			headerContainer.style.backgroundColor = `rgba(253, 253, 253, ${alpha})`;
			headerContainer.style.backdropFilter = `blur(${blur}px)`;
			headerContainer.style.setProperty(
				"-webkit-backdrop-filter",
				`blur(${blur}px)`,
			);
			headerContainer.style.boxShadow = `0 4px 24px rgba(0, 0, 0, ${shadowOpacity})`;
			headerContainer.style.border = `1px solid rgba(0, 0, 0, ${borderAlpha})`;

			ticking = false;
		}

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(updateFluidScroll);
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll);
		updateFluidScroll();

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<header className="glass-nav" ref={headerRef}>
			<div className="nav-container">
				<div className="brand">
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
					</Link>
				</div>

				<nav className="desktop-nav">
					<Link scroll={true} href="/#principles" className="nav-link">
						Principles
					</Link>
					<Link scroll={true} href="/#ecosystem" className="nav-link">
						Ecosystem
					</Link>
					<Link scroll={true} href="/#vision" className="nav-link">
						Vision
					</Link>
				</nav>

				<div className="nav-actions">
					<Link
						scroll={true}
						href="mailto:info@shadow.com.bd"
						className="primary-pill-btn"
					>
						Get in touch
						<span className="material-symbols-rounded">arrow_outward</span>
					</Link>
				</div>
			</div>
		</header>
	);
}
