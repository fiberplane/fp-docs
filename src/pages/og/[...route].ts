import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

// Get all documentation pages
const docsEntries = await getCollection("docs");

// Create a pages object mapping route paths to page data
const pages = Object.fromEntries(
	docsEntries.map(({ id, data }) => {
		// Convert file path to URL path (e.g., "mcp-lite/index" -> "mcp-lite")
		const route = id.replace(/\/index$/, "") || "index";
		return [
			route,
			{
				title: data.title,
				description: data.description || "Fiberplane Documentation",
			},
		];
	}),
);

export const { getStaticPaths, GET } = OGImageRoute({
	param: "route",
	pages,
	getImageOptions: (_, page) => ({
		title: page.title,
		description: page.description,
		bgImage: {
			path: "./src/assets/og-bg.png",
			position: "center",
			fit: "cover",
		},
		logo: {
			path: "./src/assets/fp-logo.png",
		},
		font: {
			title: {
				size: 72,
				family: "Geist Sans",
				weight: "Bold",
			},
			description: {
				size: 48,
				family: "Geist Sans",
				weight: "Normal",
				color: [138, 143, 152],
			},
		},
		fonts: [
			"./node_modules/@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff2",
			"./node_modules/@fontsource/geist-sans/files/geist-sans-latin-700-normal.woff2",
		],
		padding: 80,
	}),
});
