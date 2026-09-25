"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useEffect, useRef } from "react";

export default function Home() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const headerContainer = document.querySelector(
			".nav-container",
		) as HTMLElement | null;
		const revealElements = document.querySelectorAll(
			".scroll-reveal",
		) as NodeListOf<HTMLElement>;
		let ticking = false;

		function updateFluidScroll() {
			const scrollY = window.scrollY;
			const windowHeight = window.innerHeight;

			const headerProgress = Math.min(Math.max(scrollY / 100, 0), 1);
			const alpha = headerProgress * 0.85;
			const blur = headerProgress * 24;
			const shadowOpacity = headerProgress * 0.06;
			const borderAlpha = headerProgress * 0.05;

			if (headerContainer) {
				headerContainer.style.backgroundColor = `rgba(253, 253, 253, ${alpha})`;
				headerContainer.style.backdropFilter = `blur(${blur}px)`;
				headerContainer.style.setProperty(
					"-webkit-backdrop-filter",
					`blur(${blur}px)`,
				);
				headerContainer.style.boxShadow = `0 4px 24px rgba(0, 0, 0, ${shadowOpacity})`;
				headerContainer.style.border = `1px solid rgba(0, 0, 0, ${borderAlpha})`;
			}

			revealElements.forEach((el) => {
				if (!el.dataset.absoluteTop) {
					let top = 0;
					let obj: HTMLElement | null = el;
					while (obj) {
						top += obj.offsetTop;
						obj = obj.offsetParent as HTMLElement | null;
					}
					el.dataset.absoluteTop = top.toString();
				}

				const absoluteTop = parseFloat(el.dataset.absoluteTop || "0");
				const rectTop = absoluteTop - scrollY;

				const elementTopFromBottom = windowHeight - rectTop;

				const fadeDistance = 300;
				let progress = elementTopFromBottom / fadeDistance;
				progress = Math.min(Math.max(progress, 0), 1);

				const yOffset = 60 * (1 - progress);

				el.style.opacity = progress.toString();
				el.style.transform = `translateY(${yOffset}px)`;
			});

			const staggeredContainers = document.querySelectorAll(
				".staggered-reveal-container",
			) as NodeListOf<HTMLElement>;
			staggeredContainers.forEach((container) => {
				if (!container.dataset.absoluteTop) {
					let top = 0;
					let obj: HTMLElement | null = container;
					while (obj) {
						top += obj.offsetTop;
						obj = obj.offsetParent as HTMLElement | null;
					}
					container.dataset.absoluteTop = top.toString();
				}
				const rectTop =
					parseFloat(container.dataset.absoluteTop || "0") - scrollY;
				const elementTopFromBottom = windowHeight - rectTop;
				const fadeDistance = 400;

				const items = container.querySelectorAll(
					".staggered-item",
				) as NodeListOf<HTMLElement>;
				items.forEach((item, index) => {
					const itemScrollOffset = index * 80;
					let progress =
						(elementTopFromBottom - itemScrollOffset) /
						(fadeDistance - itemScrollOffset);
					progress = Math.min(Math.max(progress, 0), 1);

					const yOffset = 80 * (1 - progress);
					item.style.opacity = progress.toString();
					item.style.transform = `translateY(${yOffset}px)`;
				});
			});

			const ecoShowcase = document.querySelector(
				".ecosystem-visuals",
			) as HTMLElement | null;
			if (ecoShowcase) {
				if (!ecoShowcase.dataset.absoluteTop) {
					let top = 0;
					let obj: HTMLElement | null = ecoShowcase;
					while (obj) {
						top += obj.offsetTop;
						obj = obj.offsetParent as HTMLElement | null;
					}
					ecoShowcase.dataset.absoluteTop = top.toString();
				}
				const rectTop =
					parseFloat(ecoShowcase.dataset.absoluteTop || "0") - scrollY;
				const elementTopFromBottom = windowHeight - rectTop;

				const startOffset = 200;
				const spreadDistance = 400;
				let progress = (elementTopFromBottom - startOffset) / spreadDistance;
				progress = Math.min(Math.max(progress, 0), 1);

				const eco1 = ecoShowcase.querySelector(".eco-1") as HTMLElement | null;
				const eco2 = ecoShowcase.querySelector(".eco-2") as HTMLElement | null;
				const eco3 = ecoShowcase.querySelector(".eco-3") as HTMLElement | null;

				if (eco1 && eco2 && eco3) {
					eco1.style.transform = `scale(${1 + 0.05 * progress})`;
					eco2.style.transform = `translateX(${-120 - 40 * progress}px) scale(${0.9 + 0.05 * progress})`;
					eco3.style.transform = `translateX(${120 + 40 * progress}px) scale(${0.9 + 0.05 * progress})`;
				}
			}

			ticking = false;
		}

		window.addEventListener("scroll", () => {
			if (!ticking) {
				window.requestAnimationFrame(updateFluidScroll);
				ticking = true;
			}
		});

		updateFluidScroll();

		const heroSection = document.getElementById("hero-section");
		const parallaxShapes = document.querySelectorAll(
			".eco-shape",
		) as NodeListOf<HTMLElement>;

		if (heroSection && parallaxShapes.length > 0) {
			heroSection.addEventListener("mousemove", (e) => {
				if (window.innerWidth <= 768) return;

				const x = e.clientX / window.innerWidth - 0.5;
				const y = e.clientY / window.innerHeight - 0.5;

				parallaxShapes.forEach((shape) => {
					const speedStr = shape.getAttribute("data-speed");
					const speed = speedStr ? parseFloat(speedStr) : 0;
					const xOffset = x * speed * 1000;
					const yOffset = y * speed * 1000;
					shape.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px))`;
				});
			});

			heroSection.addEventListener("mouseleave", () => {
				parallaxShapes.forEach((shape) => {
					shape.style.transform = `translate(-50%, -50%)`;
				});
			});
		}
	}, []);

	return (
		<>
			<Header />
			<main>
				<section className="hero expressive-hero" id="hero-section">
					<div className="hero-interactive-background" id="parallax-bg">
						<div className="eco-shape shape-1" data-speed="0.05"></div>
						<div className="eco-shape shape-2" data-speed="-0.03"></div>
						<div className="eco-shape shape-3" data-speed="0.08"></div>
						<div className="eco-shape shape-4" data-speed="-0.06"></div>
						<div className="eco-shape shape-5" data-speed="0.04"></div>
						<div className="eco-shape shape-6" data-speed="-0.07"></div>
					</div>

					<div className="hero-content">
						<h1 className="display-large hero-title">
							<span className="word-mask">
								<span className="word">Always</span>
							</span>
							<span className="word-mask">
								<span className="word">with</span>
							</span>
							<span className="word-mask">
								<span className="word">you</span>
							</span>
						</h1>
						<p className="headline-medium hero-subtitle">
							Simple, private, and designed for a seamless{" "}
							<br className="desktop-br" /> software ecosystem experience
						</p>
					</div>
				</section>

				<section className="principles" id="principles">
					<h2 className="display-medium section-title scroll-reveal">
						Our Core Principles
					</h2>
					<div className="cards-grid staggered-reveal-container">
						<div className="m3-card staggered-item">
							<div className="card-icon-wrapper">
								<span className="material-symbols-rounded">app_shortcut</span>
							</div>
							<div className="card-text-wrapper">
								<h3 className="title-large">Simple</h3>
								<p className="body-large">
									We believe software should get out of your way. Clean
									interfaces, zero clutter.
								</p>
							</div>
						</div>

						<div className="m3-card staggered-item">
							<div className="card-icon-wrapper">
								<span className="material-symbols-rounded">shield_locked</span>
							</div>
							<div className="card-text-wrapper">
								<h3 className="title-large">Secure</h3>
								<p className="body-large">
									Your data is yours. We build privacy into the core, never as
									an afterthought.
								</p>
							</div>
						</div>

						<div className="m3-card staggered-item">
							<div className="card-icon-wrapper">
								<span className="material-symbols-rounded">auto_awesome</span>
							</div>
							<div className="card-text-wrapper">
								<h3 className="title-large">Intuitive</h3>
								<p className="body-large">
									The most user-friendly experience, prioritizing empathy at
									every step.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className="ecosystem-showcase scroll-reveal" id="ecosystem">
					<div className="ecosystem-content">
						<h2 className="display-medium">Shadow</h2>
						<p className="headline-medium">
							All your applications syncing in perfect harmony.
						</p>
						<div className="ecosystem-visuals">
							<div className="eco-card eco-2">
								<span className="material-symbols-rounded eco-icon">
									smartphone
								</span>
							</div>
							<div className="eco-card eco-3">
								<span className="material-symbols-rounded eco-icon">
									laptop_mac
								</span>
							</div>
							<div className="eco-card eco-1">
								<span className="material-symbols-rounded eco-icon">
									cloud_sync
								</span>
							</div>
						</div>
					</div>
				</section>

				<section className="vision-statement scroll-reveal" id="vision">
					<div className="vision-card">
						<div className="vision-content">
							<span className="material-symbols-rounded huge-icon">
								format_quote
							</span>
							<h2 className="display-small">
								“Our ultimate goal is technology that becomes entirely
								invisible, letting you focus only on what matters most.”
							</h2>
							<div
								className="founder-attribution"
								style={{
									marginTop: "40px",
									display: "inline-flex",
									alignItems: "center",
									gap: "16px",
									textAlign: "left",
								}}
							>
								<div
									style={{
										width: "56px",
										height: "56px",
										borderRadius: "50%",
										background: "rgba(255, 255, 255, 0.1)",
										color: "#ffffff",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontWeight: "600",
										fontSize: "24px",
										border: "1px solid rgba(255, 255, 255, 0.2)",
									}}
								>
									R
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "2px",
									}}
								>
									<span
										className="title-large"
										style={{
											color: "#ffffff",
											fontWeight: "700",
											letterSpacing: "0.2px",
										}}
									>
										Ridz
									</span>
									<span
										className="body-large"
										style={{ color: "rgba(255, 255, 255, 0.7)" }}
									>
										Founder
									</span>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
