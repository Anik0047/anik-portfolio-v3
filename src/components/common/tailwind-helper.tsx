export function TailwindHelper() {
	if (process.env.NODE_ENV === "production") return null;

	return (
		<div className="fixed bottom-3 right-3 z-50 flex size-6 items-center justify-center rounded-full bg-primary p-3 font-mono text-xs text-primary-foreground">
			<div className="block xs:hidden">xxs</div>
			<div className="hidden xs:block sm:hidden">xs</div>
			<div className="hidden sm:block md:hidden">sm</div>
			<div className="hidden md:block lg:hidden">md</div>
			<div className="hidden lg:block xl:hidden">lg</div>
			<div className="hidden xl:block 2xl:hidden">xl</div>
			<div className="hidden 2xl:block">2xl</div>
		</div>
	);
}
