const fs = require("fs");

const pageContent = fs.readFileSync("src/app/page.tsx", "utf8");

const headerMatch = pageContent.match(
	/<header class="glass-nav">[\s\S]*?<\/header>/,
);
const footerMatch = pageContent.match(
	/<footer class="main-footer">[\s\S]*?<\/footer>/,
);
const mainMatch = pageContent.match(/<main>([\s\S]*?)<\/main>/);

if (!headerMatch || !footerMatch || !mainMatch) {
	console.error("Could not find header, footer, or main block");
	process.exit(1);
}

let headerHtml = headerMatch[0];
let footerHtml = footerMatch[0];
let mainHtml = `<main>\n${mainMatch[1]}\n    </main>`;

function htmlToJsx(html) {
	return html
		.replace(/class=/g, "className=")
		.replace(/clip-path=/g, "clipPath=")
		.replace(/stroke-width=/g, "strokeWidth=");
	// replace <a href="#"> with Next.js Link if needed, but for now just standard tags
}

const headerJsx = htmlToJsx(headerHtml).replace(
	/<a href="([^"]+)"/g,
	'<Link href="$1"',
);
const footerJsx = htmlToJsx(footerHtml)
	.replace(
		'<a href="#" className="body-small">Privacy Policy</a>',
		'<Link href="/privacy" className="body-small">Privacy Policy</Link>',
	)
	.replace(
		'<a href="#" className="body-small">Terms of Service</a>',
		'<Link href="/terms" className="body-small">Terms of Service</Link>',
	);

if (!fs.existsSync("src/components")) {
	fs.mkdirSync("src/components", { recursive: true });
}

fs.writeFileSync(
	"src/components/Header.tsx",
	`
import Link from 'next/link';

export default function Header() {
    return (
        ${headerJsx.replace(/<Link/g, "<Link scroll={true}").replace(/href="#/g, 'href="/#')}
    );
}
`,
);

fs.writeFileSync(
	"src/components/Footer.tsx",
	`
import Link from 'next/link';

export default function Footer() {
    return (
        ${footerJsx}
    );
}
`,
);

let newPageContent = pageContent.replace(
	/<header class="glass-nav">[\s\S]*?<\/footer>/,
	`
    <Header />
    <div dangerouslySetInnerHTML={{ __html: \`${mainHtml.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\` }} style={{ display: 'contents' }} />
    <Footer />
`,
);

newPageContent =
	`import Header from "@/components/Header";\nimport Footer from "@/components/Footer";\n` +
	newPageContent;

fs.writeFileSync("src/app/page.tsx", newPageContent);

// Create terms page
if (!fs.existsSync("src/app/terms"))
	fs.mkdirSync("src/app/terms", { recursive: true });
fs.writeFileSync(
	"src/app/terms/page.tsx",
	`
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Terms() {
    return (
        <>
            <Header />
            <main style={{ padding: '8rem 2rem 4rem', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
                <h1 className="display-large">Terms of Service</h1>
                <p className="body-large" style={{ marginTop: '2rem' }}>
                    Welcome to the Shadow ecosystem. These terms govern your use of our services.
                </p>
                <p className="body-medium" style={{ marginTop: '1rem' }}>
                    1. Acceptance of Terms <br />
                    By accessing or using our services, you agree to be bound by these Terms of Service.
                </p>
                <p className="body-medium" style={{ marginTop: '1rem' }}>
                    2. Privacy <br />
                    Your privacy is critically important to us. Please review our Privacy Policy.
                </p>
            </main>
            <Footer />
        </>
    );
}
`,
);

// Create privacy page
if (!fs.existsSync("src/app/privacy"))
	fs.mkdirSync("src/app/privacy", { recursive: true });
fs.writeFileSync(
	"src/app/privacy/page.tsx",
	`
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacy() {
    return (
        <>
            <Header />
            <main style={{ padding: '8rem 2rem 4rem', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
                <h1 className="display-large">Privacy Policy</h1>
                <p className="body-large" style={{ marginTop: '2rem' }}>
                    Your privacy is our priority. We collect only what we need to provide you with the best experience.
                </p>
                <p className="body-medium" style={{ marginTop: '1rem' }}>
                    1. Data Collection <br />
                    We minimize data collection. We do not sell your personal data to third parties.
                </p>
                <p className="body-medium" style={{ marginTop: '1rem' }}>
                    2. Data Security <br />
                    We implement industry-standard security measures to protect your information.
                </p>
            </main>
            <Footer />
        </>
    );
}
`,
);

console.log("Refactoring complete");
