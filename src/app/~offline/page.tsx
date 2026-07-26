export default function OfflinePage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-2xl font-bold">You're offline</h1>
			<p className="text-muted-foreground mt-2">
				Check your connection and try again.
			</p>
		</div>
	);
}
