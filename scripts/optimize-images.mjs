import sharp from "sharp";

const files = process.argv.slice(2);
if (!files.length) {
	console.log("Usage: node scripts/optimize-images.mjs siam_1 siam_2 ...");
	process.exit(1);
}

for (const name of files) {
	const input = `public/images/${name}.png`;
	const output = `public/images/${name}.webp`;
	const info = await sharp(input)
		.resize({ height: 1687 })
		.webp({ quality: 85, alphaQuality: 100 })
		.toFile(output);
	console.log(
		`✓ ${output} — ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`,
	);
}
