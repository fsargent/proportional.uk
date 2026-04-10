#!/usr/bin/env bun

/**
 * Export GSAP glitch animations to MP4 video files.
 *
 * Usage:
 *   bun scripts/export-video.js              # export both variants
 *   bun scripts/export-video.js --variant a  # export variant A only
 *   bun scripts/export-video.js --variant b  # export variant B only
 *   bun scripts/export-video.js --info       # dry-run: show timeline info
 *
 * Requires a running dev server (bun run dev) on port 5173.
 * Videos are written to static/video/ with a timestamp and a manifest.json
 * so the site can reference the latest exports.
 */

import { videoExport } from 'gsap-video-export';
import { parseArgs } from 'node:util';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const { values: flags } = parseArgs({
	options: {
		variant: { type: 'string', short: 'v', default: 'all' },
		info: { type: 'boolean', short: 'i', default: false },
		fps: { type: 'string', short: 'f', default: '30' },
		port: { type: 'string', short: 'p', default: '5173' }
	}
});

const BASE = `http://localhost:${flags.port}`;
const OUT_DIR = path.resolve(import.meta.dirname, '..', 'static', 'video');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
mkdirSync(OUT_DIR, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:]/g, '-').replace(/\.\d+Z$/, 'Z');

const variants = {
	a: {
		key: 'a',
		name: 'glitch-variant-a',
		url: `${BASE}/glitch-poc/a/export`,
		filename: `glitch-a-${timestamp}.mp4`
	},
	b: {
		key: 'b',
		name: 'glitch-variant-b',
		url: `${BASE}/glitch-poc/b/export`,
		filename: `glitch-b-${timestamp}.mp4`
	}
};

const selected =
	flags.variant === 'all'
		? Object.values(variants)
		: [variants[flags.variant]];

if (!selected[0]) {
	console.error(`Unknown variant "${flags.variant}". Use "a", "b", or "all".`);
	process.exit(1);
}

const fps = parseInt(flags.fps, 10);

async function exportVariant(v) {
	console.log(`\n--- ${v.name} ---`);
	console.log(`URL: ${v.url}`);

	const outputPath = path.join(OUT_DIR, v.filename);

	if (flags.info) {
		const info = await videoExport({
			url: v.url,
			timeline: 'tl',
			info: true,
			viewport: '1080x1920',
			verbose: true
		});
		console.log('Timeline info:', info);
		return null;
	}

	const result = await videoExport({
		url: v.url,
		timeline: 'tl',
		selector: '.export-capture',
		viewport: '1080x1920',
		resolution: '1080x1920',
		fps,
		output: outputPath,
		codec: 'libx264',
		format: 'mp4',
		outputOptions: '-pix_fmt yuv420p -crf 18',
		verbose: true,
		chrome: true,
		headless: true,
		preparePage: async () => {
			await document.fonts.ready;
		}
	});

	console.log(`Exported: ${result.file}`);
	console.log(`Export time: ${result.exportTime}s | Render time: ${result.renderTime}s`);

	return {
		key: v.key,
		file: `/video/${v.filename}`,
		exportedAt: new Date().toISOString(),
		fps,
		exportTime: result.exportTime,
		renderTime: result.renderTime
	};
}

let manifest = {};
if (existsSync(MANIFEST_PATH)) {
	try {
		manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
	} catch {
		manifest = {};
	}
}

for (const v of selected) {
	try {
		const entry = await exportVariant(v);
		if (entry) manifest[entry.key] = entry;
	} catch (err) {
		console.error(`Failed to export ${v.name}:`, err.message || err);
	}
}

writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, '\t') + '\n');
console.log(`\nManifest written to ${MANIFEST_PATH}`);
console.log('Done.');
process.exit(0);
