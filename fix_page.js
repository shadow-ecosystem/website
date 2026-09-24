const fs = require("fs");

const pageContent = fs.readFileSync("src/app/page.tsx", "utf8");

const mainMatch = pageContent.match(/<main>([\s\S]*?)<\/main>/);
if (!mainMatch) {
	console.error("Could not find main block");
	process.exit(1);
}

let mainHtml = `<main>\n${mainMatch[1]}\n</main>`;

const imports = `import Header from "@/components/Header";\nimport Footer from "@/components/Footer";\n`;

// Extract the script logic part (from imports to useEffect ending)
const scriptEndMatch = pageContent.match(/(\s*}, \[\]\);\s*return \()/);
const scriptPart = pageContent.substring(
	0,
	scriptEndMatch.index + scriptEndMatch[0].length,
);

// Now construct the final file
const newPageContent =
	imports +
	scriptPart.replace(
		'import Header from "@/components/Header";\nimport Footer from "@/components/Footer";\n',
		"",
	) +
	`
        <>
            <Header />
            <div dangerouslySetInnerHTML={{ __html: \`${mainHtml.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\` }} style={{ display: 'contents' }} />
            <Footer />
        </>
    );
}
`;

fs.writeFileSync("src/app/page.tsx", newPageContent);
console.log("Fixed page.tsx");
