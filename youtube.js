class YouTubePlayerManager {
	constructor() {
		this.players = new Map();
		this.trackingIntervals = new Map();
		this.trackedTimes = new Set();
		this.vtrTime = 0;
		this.readyCallbacks = new Map();
		this.volumeMuteState = true; // Start muted

		// Initialize YouTube API
		this.loadYouTubeAPI();

		// Initialize volume control
		this.volumeControlElem = document.querySelector(".video-volume-control");
		if (this.volumeControlElem) {
			this.volumeControlElem.addEventListener("click", () => this.handleVolumeClick());
		}
	}

	loadYouTubeAPI() {
		const tag = document.createElement("script");
		tag.src = "https://www.youtube.com/iframe_api";
		const firstScriptTag = document.getElementsByTagName("script")[0];
		firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
	}

	createPlayer(config, callback) {
		const {
			elementId,
			videoId,
			options = {
				autoplay: 1,
				controls: 0,
				rel: 0,
				showinfo: 0,
				loop: 1,
				playlist: videoId, // Required for looping
				playsinline: 1,
				fs: 0,
				vq: "medium",
			},
		} = config;

		// Store callback to be called when player is ready
		this.readyCallbacks.set(elementId, callback);

		try {
			const player = new YT.Player(elementId, {
				videoId,
				playerVars: options,
				events: {
					onReady: (event) => this.handlePlayerReady(event, elementId),
					onStateChange: (event) => this.handlePlayerStateChange(event, elementId),
					onError: (event) => console.error("YouTube player error:", event.data),
				},
			});

			this.players.set(elementId, player);
		} catch (error) {
			console.error("Error creating YouTube player:", error);
		}
	}

	handlePlayerReady(event, playerId) {
		const player = event.target;

		// Initial mute state
		player.mute();
		this.volumeMuteState = true;
		if (this.volumeControlElem) {
			this.volumeControlElem.classList.remove("mute");
		}

		player.playVideo();

		// Calculate VTR time segments
		const videoDuration = player.getDuration();
		this.vtrTime = Math.round(videoDuration / 4);

		// Execute callback if exists
		const callback = this.readyCallbacks.get(playerId);
		if (callback) {
			callback(player);
			this.readyCallbacks.delete(playerId);
		}
	}

	handlePlayerStateChange(event, playerId) {
		const player = this.players.get(playerId);
		if (!player) return;

		switch (event.data) {
			case YT.PlayerState.PLAYING:
				// Start tracking view time
				const interval = setInterval(() => {
					this.trackViewTime(playerId);
				}, 1000);
				this.trackingIntervals.set(playerId, interval);
				break;

			case YT.PlayerState.PAUSED:
			case -1: // Unstarted
				// Clear tracking interval
				clearInterval(this.trackingIntervals.get(playerId));
				this.trackingIntervals.delete(playerId);
				break;

			case YT.PlayerState.ENDED:
				// Ensure loop works
				player.playVideo();
				break;
		}
	}

	handleVolumeClick() {
		const player = this.players.get("YouTubeVideoPlayer");
		if (!player) return;

		if (this.volumeMuteState) {
			player.unMute();
			this.volumeMuteState = false;
			this.volumeControlElem?.classList.add("mute");
		} else {
			player.mute();
			this.volumeMuteState = true;
			this.volumeControlElem?.classList.remove("mute");
		}
	}

	trackViewTime(playerId) {
		const player = this.players.get(playerId);
		if (!player) return;

		const currentTime = player.getCurrentTime();
		const lastTrackedTime = Array.from(this.trackedTimes).pop() || 0;

		// Reset tracking if video restarted
		if (currentTime < lastTrackedTime) {
			this.trackedTimes.clear();
		}

		// Track time in VTR segments
		const trackTime = Math.floor(currentTime / this.vtrTime) * this.vtrTime;
		if (trackTime !== 0 && lastTrackedTime !== trackTime) {
			this.trackedTimes.add(trackTime);
		}
	}

	destroy(playerId) {
		const player = this.players.get(playerId);
		if (player) {
			clearInterval(this.trackingIntervals.get(playerId));
			this.trackingIntervals.delete(playerId);
			this.players.delete(playerId);
			player.destroy();
		}

		// Remove event listeners
		if (this.volumeControlElem) {
			this.volumeControlElem.removeEventListener("click", this.handleVolumeClick);
		}
	}
}

// Make it globally available
window.YouTubePlayerManager = YouTubePlayerManager;
