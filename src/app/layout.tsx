import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Shadow | Always with you",
	description:
		"Shadow is a software company building Shadow with a vision to make everyone's life easy through simplicity, privacy, and user-friendly design.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css?family=Google+Sans:400,500,700|Product+Sans:400,700"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
					rel="stylesheet"
				/>
				<script
					type="importmap"
					dangerouslySetInnerHTML={{
						__html: `
            {
                "imports": {
                    "@material/web/": "https://esm.run/@material/web/"
                }
            }
          `,
					}}
				></script>
				<script
					type="module"
					dangerouslySetInnerHTML={{
						__html: `
            import '@material/web/all.js';
          `,
					}}
				></script>
			</head>
			<body className="m3-theme-light">{children}</body>
		</html>
	);
}
