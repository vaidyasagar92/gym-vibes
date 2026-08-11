/* =========================================================
   GYM VIBES - GYM RADIO
   ========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const backgroundImage =
    document.getElementById("backgroundImage");

const moodSelect =
    document.getElementById("moodSelect");

const currentVibe =
    document.getElementById("currentVibe");

const mainTitle =
    document.getElementById("mainTitle");

const songTitle =
    document.getElementById("songTitle");

const playButton =
    document.getElementById("playButton");

const playIcon =
    document.getElementById("playIcon");

const previousButton =
    document.getElementById("previousButton");

const nextButton =
    document.getElementById("nextButton");

const progressBar =
    document.getElementById("progressBar");

const currentTimeElement =
    document.getElementById("currentTime");

const durationElement =
    document.getElementById("duration");

const equalizer =
    document.getElementById("equalizer");

const fullscreenButton =
    document.getElementById("fullscreenButton");


/* =========================================================
   FIXED PLAYLIST CONFIGURATION

   IMPORTANT:
   Each vibe has its OWN fixed playlist.

   No random playlist selection is used.
========================================================= */

const playlists = {

    energetic: {
        name: "ENERGETIC WORKOUT",

        playlistId:
            "PLu0ocO48LFms5WsI1ipaeanxqRjn2fC_5",

        image:
            "images/gym-01.jpg"
    },


    hindi: {
        name: "HINDI WORKOUT",

        playlistId:
            "PLWd4gmX2j6dOUpWveHdipQ-vqlPX1A0f1",

        image:
            "images/gym-02.jpg"
    },


    english: {
        name: "ENGLISH WORKOUT",

        playlistId:
            "PLWEYu6iG-sMPzNA6ycWLrKrECLyRIZCiu",

        image:
            "images/gym-03.jpg"
    },


    sad: {
        name: "SAD HINDI",

        playlistId:
            "PLO7-VO1D0_6MnOoKQGmYNY2OoCOP3GRfm",

        image:
            "images/gym-04.jpg"
    },


    romantic: {
        name: "HINDI ROMANTIC",

        playlistId:
            "RDATmdlifodHlwZV9wbGF5bGlzdA",

        image:
            "images/gym-05.jpg"
    },


    marathi: {
        name: "MARATHI",

        playlistId:
            "PLs9OWUC0914VHSiPET56FI67yRnqtLUJP",

        image:
            "images/gym-06.jpg"
    }

};


/* =========================================================
   PLAYER VARIABLES
========================================================= */

let player = null;

let playerReady = false;

let isPlaying = false;

let progressTimer = null;

let currentMood = "energetic";

let isSeeking = false;


/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const DEFAULT_MOOD = "energetic";


/* =========================================================
   YOUTUBE API READY
========================================================= */

window.onYouTubeIframeAPIReady = function () {

    createYouTubePlayer();

};


/* =========================================================
   CREATE YOUTUBE PLAYER
========================================================= */

function createYouTubePlayer() {

    player = new YT.Player(
        "youtubePlayer",
        {

            width: "2",
            height: "2",

            playerVars: {

                autoplay: 0,

                controls: 0,

                disablekb: 1,

                fs: 0,

                iv_load_policy: 3,

                modestbranding: 1,

                playsinline: 1,

                rel: 0,

                origin: window.location.origin

            },


            events: {

                onReady:
                    handlePlayerReady,

                onStateChange:
                    handlePlayerStateChange,

                onError:
                    handlePlayerError

            }

        }
    );

}


/* =========================================================
   PLAYER READY
========================================================= */

function handlePlayerReady() {

    playerReady = true;

    player.setVolume(100);

    loadMood(
        DEFAULT_MOOD,
        false
    );

}


/* =========================================================
   LOAD MOOD
========================================================= */

function loadMood(
    mood,
    autoPlay = true
) {

    const selected =
        playlists[mood];


    if (!selected) {

        console.error(
            "Unknown mood:",
            mood
        );

        return;
    }


    currentMood = mood;


    /* -----------------------------------------
       UPDATE UI
    ----------------------------------------- */

    const displayName =
        selected.name;


    mainTitle.textContent =
        displayName;


    currentVibe.textContent =
        displayName;


    songTitle.textContent =
        "Loading playlist...";


    /* -----------------------------------------
       CHANGE BACKGROUND
    ----------------------------------------- */

    changeBackground(
        selected.image
    );


    /* -----------------------------------------
       LOAD EXACT PLAYLIST
    ----------------------------------------- */

    if (
        playerReady &&
        player
    ) {

        try {

            player.loadPlaylist({

                list:
                    selected.playlistId,

                listType:
                    "playlist",

                index: 0

            });


            if (autoPlay) {

                /*
                 * IMPORTANT:
                 * This is triggered by the user's
                 * select/change event, so browser
                 * autoplay restrictions are okay.
                 */

                setTimeout(
                    function () {

                        try {

                            player.playVideo();

                        } catch (error) {

                            console.error(
                                error
                            );

                        }

                    },
                    500
                );

            }

        } catch (error) {

            console.error(
                "Playlist loading error:",
                error
            );

        }

    }


    /* -----------------------------------------
       RESET PROGRESS
    ----------------------------------------- */

    resetProgress();


    updatePlayButton(
        autoPlay
    );

}


/* =========================================================
   CHANGE BACKGROUND
========================================================= */

function changeBackground(
    imagePath
) {

    if (!backgroundImage) {
        return;
    }


    backgroundImage.style.opacity =
        "0";


    setTimeout(
        function () {

            backgroundImage.src =
                imagePath;


            backgroundImage.onload =
                function () {

                    backgroundImage.style.opacity =
                        "1";

                };

        },
        300
    );

}


/* =========================================================
   MOOD CHANGE
========================================================= */

moodSelect.addEventListener(
    "change",
    function (event) {

        const selectedMood =
            event.target.value;


        /*
         * THIS IS THE IMPORTANT PART.
         *
         * The selected option directly maps
         * to its own fixed playlist.
         *
         * No random playlist.
         */

        loadMood(
            selectedMood,
            true
        );

    }
);


/* =========================================================
   PLAY / PAUSE
========================================================= */

playButton.addEventListener(
    "click",
    function () {

        if (!playerReady) {

            console.log(
                "YouTube player is still loading..."
            );

            return;
        }


        if (!player) {
            return;
        }


        try {

            const state =
                player.getPlayerState();


            if (
                state ===
                YT.PlayerState.PLAYING
            ) {

                player.pauseVideo();

            } else {

                player.playVideo();

            }

        } catch (error) {

            console.error(
                "Play/Pause error:",
                error
            );

        }

    }
);


/* =========================================================
   PLAYER STATE CHANGE
========================================================= */

function handlePlayerStateChange(
    event
) {

    switch (
        event.data
    ) {


        /* -------------------------------------
           PLAYING
        ------------------------------------- */

        case YT.PlayerState.PLAYING:

            isPlaying = true;

            updatePlayButton(true);

            equalizer.classList.remove(
                "paused"
            );

            startProgressUpdater();

            updateSongInformation();

            break;


        /* -------------------------------------
           PAUSED
        ------------------------------------- */

        case YT.PlayerState.PAUSED:

            isPlaying = false;

            updatePlayButton(false);

            equalizer.classList.add(
                "paused"
            );

            stopProgressUpdater();

            break;


        /* -------------------------------------
           ENDED
        ------------------------------------- */

        case YT.PlayerState.ENDED:

            isPlaying = false;

            updatePlayButton(false);

            equalizer.classList.add(
                "paused"
            );

            stopProgressUpdater();

            /*
             * YouTube playlist normally moves
             * automatically to next song.
             */

            setTimeout(
                function () {

                    updateSongInformation();

                },
                500
            );

            break;


        /* -------------------------------------
           BUFFERING
        ------------------------------------- */

        case YT.PlayerState.BUFFERING:

            songTitle.textContent =
                "Buffering...";

            break;

    }

}


/* =========================================================
   UPDATE PLAY BUTTON
========================================================= */

function updatePlayButton(
    playing
) {

    if (playing) {

        playIcon.textContent =
            "❚❚";

        playButton.title =
            "Pause";

        playButton.setAttribute(
            "aria-label",
            "Pause"
        );

    } else {

        playIcon.textContent =
            "▶";

        playButton.title =
            "Play";

        playButton.setAttribute(
            "aria-label",
            "Play"
        );

    }

}


/* =========================================================
   PREVIOUS BUTTON
========================================================= */

previousButton.addEventListener(
    "click",
    function () {

        if (
            !playerReady ||
            !player
        ) {
            return;
        }


        try {

            /*
             * YouTube's previousVideo()
             * operates on the CURRENT playlist.
             */

            player.previousVideo();


            setTimeout(
                function () {

                    updateSongInformation();

                },
                500
            );

        } catch (error) {

            console.error(
                "Previous song error:",
                error
            );

        }

    }
);


/* =========================================================
   NEXT BUTTON
========================================================= */

nextButton.addEventListener(
    "click",
    function () {

        if (
            !playerReady ||
            !player
        ) {
            return;
        }


        try {

            /*
             * YouTube's nextVideo()
             * operates on the CURRENT playlist.
             */

            player.nextVideo();


            setTimeout(
                function () {

                    updateSongInformation();

                },
                500
            );

        } catch (error) {

            console.error(
                "Next song error:",
                error
            );

        }

    }
);


/* =========================================================
   UPDATE SONG INFORMATION
========================================================= */

function updateSongInformation() {

    if (
        !playerReady ||
        !player
    ) {
        return;
    }


    try {

        const videoData =
            player.getVideoData();


        if (
            videoData &&
            videoData.title
        ) {

            songTitle.textContent =
                videoData.title;

        }

    } catch (error) {

        console.error(
            "Song information error:",
            error
        );

    }

}


/* =========================================================
   PROGRESS UPDATER
========================================================= */

function startProgressUpdater() {

    stopProgressUpdater();


    progressTimer =
        setInterval(
            updateProgress,
            500
        );

}


function stopProgressUpdater() {

    if (progressTimer) {

        clearInterval(
            progressTimer
        );

        progressTimer = null;

    }

}


/* =========================================================
   UPDATE PROGRESS
========================================================= */

function updateProgress() {

    if (
        !playerReady ||
        !player ||
        isSeeking
    ) {
        return;
    }


    try {

        const current =
            player.getCurrentTime();


        const duration =
            player.getDuration();


        if (
            !duration ||
            duration <= 0
        ) {
            return;
        }


        const percentage =
            (current / duration) * 100;


        progressBar.value =
            percentage;


        currentTimeElement.textContent =
            formatTime(current);


        durationElement.textContent =
            formatTime(duration);


        updateSongInformation();

    } catch (error) {

        console.error(
            "Progress error:",
            error
        );

    }

}


/* =========================================================
   PROGRESS BAR - START SEEK
========================================================= */

progressBar.addEventListener(
    "pointerdown",
    function () {

        isSeeking = true;

    }
);


/* =========================================================
   PROGRESS BAR - SEEK
========================================================= */

progressBar.addEventListener(
    "input",
    function () {

        if (
            !playerReady ||
            !player
        ) {
            return;
        }


        try {

            const duration =
                player.getDuration();


            if (
                !duration ||
                duration <= 0
            ) {
                return;
            }


            const percentage =
                Number(
                    progressBar.value
                );


            const newTime =
                duration *
                (
                    percentage / 100
                );


            currentTimeElement.textContent =
                formatTime(
                    newTime
                );

        } catch (error) {

            console.error(
                error
            );

        }

    }
);


/* =========================================================
   PROGRESS BAR - END SEEK
========================================================= */

function finishSeeking() {

    if (
        !playerReady ||
        !player
    ) {

        isSeeking = false;

        return;
    }


    try {

        const duration =
            player.getDuration();


        if (
            duration &&
            duration > 0
        ) {

            const percentage =
                Number(
                    progressBar.value
                );


            const newTime =
                duration *
                (
                    percentage / 100
                );


            player.seekTo(
                newTime,
                true
            );

        }

    } catch (error) {

        console.error(
            "Seek error:",
            error
        );

    }


    isSeeking = false;

}


progressBar.addEventListener(
    "pointerup",
    finishSeeking
);


progressBar.addEventListener(
    "change",
    finishSeeking
);


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(
    seconds
) {

    if (
        !seconds ||
        isNaN(seconds)
    ) {

        return "0:00";

    }


    seconds =
        Math.floor(seconds);


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        seconds % 60;


    return (
        minutes +
        ":" +
        String(
            remainingSeconds
        ).padStart(2, "0")
    );

}


/* =========================================================
   RESET PROGRESS
========================================================= */

function resetProgress() {

    progressBar.value =
        0;

    currentTimeElement.textContent =
        "0:00";

    durationElement.textContent =
        "0:00";

}


/* =========================================================
   YOUTUBE ERROR
========================================================= */

function handlePlayerError(
    event
) {

    console.error(
        "YouTube Player Error:",
        event.data
    );


    switch (
        event.data
    ) {

        case 2:

            songTitle.textContent =
                "Invalid YouTube video.";

            break;


        case 5:

            songTitle.textContent =
                "YouTube playback error.";

            break;


        case 100:

            songTitle.textContent =
                "Video not found.";

            break;


        case 101:
        case 150:

            songTitle.textContent =
                "This video cannot be played here.";

            break;


        default:

            songTitle.textContent =
                "Unable to play this song.";

    }

}


/* =========================================================
   FULLSCREEN
========================================================= */

fullscreenButton.addEventListener(
    "click",
    async function () {

        try {

            if (
                !document.fullscreenElement
            ) {

                await document.documentElement.requestFullscreen();

            } else {

                await document.exitFullscreen();

            }

        } catch (error) {

            console.error(
                "Fullscreen error:",
                error
            );

        }

    }
);


/* =========================================================
   FULLSCREEN ICON
========================================================= */

document.addEventListener(
    "fullscreenchange",
    function () {

        if (
            document.fullscreenElement
        ) {

            fullscreenButton.textContent =
                "⛶";

        } else {

            fullscreenButton.textContent =
                "⛶";

        }

    }
);


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        /*
         * Do not interfere with typing/select.
         */

        if (
            event.target.tagName ===
            "SELECT"
        ) {
            return;
        }


        /* SPACE = PLAY / PAUSE */

        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();

            playButton.click();

        }


        /* ARROW RIGHT = NEXT */

        if (
            event.code ===
            "ArrowRight"
        ) {

            nextButton.click();

        }


        /* ARROW LEFT = PREVIOUS */

        if (
            event.code ===
            "ArrowLeft"
        ) {

            previousButton.click();

        }

    }
);


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Set initial mood.
         */

        moodSelect.value =
            DEFAULT_MOOD;


        currentVibe.textContent =
            playlists[
                DEFAULT_MOOD
            ].name;


        mainTitle.textContent =
            playlists[
                DEFAULT_MOOD
            ].name;


        /*
         * Reveal page after DOM is ready.
         *
         * This removes the old page flashing
         * during refresh.
         */

        requestAnimationFrame(
            function () {

                document.body.classList.remove(
                    "loading"
                );

                document.body.classList.add(
                    "ready"
                );

            }
        );

    }
);


/* =========================================================
   IMAGE ERROR FALLBACK
========================================================= */

backgroundImage.addEventListener(
    "error",
    function () {

        console.warn(
            "Background image not found:",
            backgroundImage.src
        );

        backgroundImage.style.opacity =
            "0";

    }
);


/* =========================================================
   INITIAL STATE
========================================================= */

updatePlayButton(false);

equalizer.classList.add(
    "paused"
);