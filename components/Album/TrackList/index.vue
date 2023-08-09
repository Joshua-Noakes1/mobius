<script>
import { default as cardTimeFunc } from '~/assets/time/getTimeCard.ts';
import { default as getDurationMillis } from "~/assets/time/getDurationMillis.ts";

let diskNumber = 0;
let diskNumberChanged = false;

// array of currently playing audio elements
let currentlyPlaying = ref([]);

export default {
	props: {
		albumData: {
			type: Object,
			required: true
		}
	},
	methods: {
		formatTimeCard(release) {
			return cardTimeFunc(release);
		},
		getDurationMillis(duration) {
			return getDurationMillis(duration);
		},
		changeDiskNumber(diskNumberTrack) {
			if (diskNumberTrack !== diskNumber) {
				diskNumber = diskNumberTrack;
				if (diskNumberTrack !== 1) diskNumberChanged = true;
				return true;
			}
			return false;
		},
		nameAudioPlayback(id) {
			return {
				audio: `audio-${id}`,
				playPause: `playPause-${id}`
			}
		},
		playPauseTrack(id) {
			var audio = document.getElementById(`audio-${id}`);
			var playPauseBtn = document.getElementById(`playPause-${id}`);
			if (audio.paused) {
				// loop over and pause all other audio elements
				currentlyPlaying.value.forEach((audioElement) => {
					let playingAudioElement = document.getElementById(`audio-${audioElement}`);
					let playingAudioElementPlayPauseBtn = document.getElementById(`playPause-${audioElement}`);
					playingAudioElement.pause();
					playingAudioElement.currentTime = 0;
					playingAudioElementPlayPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
					playingAudioElementPlayPauseBtn.style.color = '';
					currentlyPlaying.value = currentlyPlaying.value.filter((audioElement) => {
						return audioElement !== playingAudioElement.id.split('-')[1];
					});
				});
				currentlyPlaying.value.push(id);

				// play audio
				audio.play();
				playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
				playPauseBtn.style.color = '#4383bb';

				audio.addEventListener('ended', function () {
					var playPauseBtn = document.getElementById(`playPause-${id}`);
					playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
					playPauseBtn.style.color = '';
				});
			} else {
				audio.pause();
				audio.currentTime = 0;
				playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
				playPauseBtn.style.color = '';
			}
		}
	},
	beforeRouteEnter(to, from, next) {
		// we show the disk number if it is not 1
		if (!diskNumberChanged) {
			// get all the diskNumber elements
			var diskNumberElements = document.getElementsByClassName('diskNumber');
			// delete all the diskNumber elements
			for (var i = 0; i < diskNumberElements.length; i++) {
				diskNumberElements[i].remove();
			}
		}

		// clear the playing audio elements
		currentlyPlaying.value = [];

		next(); // Call next() to proceed with entering the route
	},
	mounted() {
		// we show the disk number if it is not 1
		if (!diskNumberChanged) {
			// get all the diskNumber elements
			var diskNumberElements = document.getElementsByClassName('diskNumber');
			// delete all the diskNumber elements
			for (var i = 0; i < diskNumberElements.length; i++) {
				diskNumberElements[i].remove();
			}
		}

		// clear the playing audio elements
		currentlyPlaying.value = [];
	}
}
</script>

<template>
	<div class="card mb-3 shadow" data-bs-theme="dark">
		<div class="card-body">
			<a :href="albumData.meta.itunes.url" target="_blank">
				<h5 class="d-block d-lg-none">{{ albumData.name }} ({{ formatTimeCard(albumData.meta.releaseDate).year }})
				</h5>
				<h5 class="card-title">Track List [Tracks: {{ albumData.meta.trackCount }}]</h5>
			</a>
			<div class="container-fluid">
				<div v-for="track of albumData.tracks" :key="track.id" class="track-info">
					<span v-if="changeDiskNumber(track.meta.diskNumber)" id="diskNumber" class="diskNumber">
						<small v-if="track.meta.diskNumber.toString() !== '1'" style="color: #715bd6;">Disk Number: {{
							track.meta.diskNumber }}</small>
						<div class="mb-1"></div>
					</span>
					<!-- This is a really big mess like worse then the api -->
					<h6>
						<a :href="track.meta.itunes.url" target="_blank">
							<div class="d-none d-lg-inline-block text-wrap" style="margin-right: 0.3rem;">[ISRC: {{
								track.meta.isrc }}]</div>{{ track.track }} - {{ track.name }} <i v-if="track.meta.isExplicit" class="fa-solid fa-land-mine-on" title="Track Explicit"></i>
						</a>
						<div class="d-block d-lg-none" style="margin-top: 1rem;"></div>
						<a v-if="track.preview !== ''" :href="track.meta.itunes.url"
							style="text-decoration: none; color: #eee;" @click.prevent="function () { return false }">
							<span class="float-end-no-mob" @click="playPauseTrack(track.id)" style="margin-top: 0.3rem;">{{
								getDurationMillis(track.duration).duration }} - <span
									:id="nameAudioPlayback(track.id).playPause"><i
										class="fa-solid fa-play"></i></span></span>
						</a>
					</h6>
					<audio v-if="track.preview !== ''" :id="nameAudioPlayback(track.id).audio" class="float-end"
						:src="track.preview" hidden preload="metadata"></audio>
					<small class="d-none d-lg-block card-text">{{ track.meta.composer }}</small>
					<div v-if="track.meta.itunes.anyFeatures" class="d-none d-lg-block">
						<small class="card-text text-muted">Features: <i v-if="track.meta.itunes.hasLyrics"
								class="fa-solid fa-music" title="Has Lyrics"></i> <i
								v-if="track.meta.itunes.hasSyncedLyrics" class="fa-solid fa-clock" title="Has Synced Lyrics"
								style="margin-left: 0.2rem;"></i> <i v-if="track.meta.itunes.isMasteredForItunes"
								class="fa-solid fa-record-vinyl" title="Mastered For iTunes"
								style="margin-left: 0.2rem;"></i> <i v-if="track.meta.itunes.isSingle"
								class="fa-solid fa-user" title="Relased as Single" style="margin-left: 0.2rem;"></i> <i
								v-if="track.meta.itunes.isLossless" class="fa-solid fa-record-vinyl" title="Lossless"
								style="margin-left: 0.2rem;"></i> <i v-if="track.meta.itunes.isLossyStereo"
								class="fa-solid fa-headphones" title="Lossy Stereo" style="margin-left: 0.2rem;"></i> <i
								v-if="track.meta.itunes.isHighResLossless" class="fa-solid fa-record-vinyl"
								title="Hi-Res Lossless" style="margin-left: 0.2rem;"></i> <i
								v-if="track.meta.itunes.isAtmos" class="fa-solid fa-volume-high" title="Dolby Atmos"
								style="margin-left: 0.2rem;"></i> <i v-if="track.meta.itunes.isSpatial"
								class="fa-solid fa-headphones-simple" title="Spatial Audio"
								style="margin-left: 0.2rem;"></i></small>
					</div>
					<div style="margin-top: 0.5rem; @media(996px) { margin-top: 1rem;}"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
a {
	color: #4383bb;
	text-decoration: none;
}

.track-info {
	margin-top: 0.5rem;
}

.diskNumber {
	display: block;
}

/* Only Desktop */
@media (min-width: 996px) {
	.float-end-no-mob {
		float: right !important;
	}
}

/* Only Mobile */
@media (max-width: 996px) {
	.track-info {
		margin-top: 1.5rem;
	}
}</style>