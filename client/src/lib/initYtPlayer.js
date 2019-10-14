/* global YT */
/* eslint no-undef: "error" */

const initYtPlayer = new Promise((res, rej) => {
  // load yt iframe api
  const script = document.createElement('script')
  const firstScriptTag = document.getElementsByTagName('script')[0]
  script.src = 'https://www.youtube.com/iframe_api'
  firstScriptTag.parentNode.insertBefore(script, firstScriptTag)

  // create player when yt api has loaded
  window.onYouTubeIframeAPIReady = () => {
    res(
      new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'l0vrsO3_HpU',
        playerVars: {
          controls: 0,
          autohide: 1,
          showinfo: 0,
          wmode: 'opaque',
          rel: 0,
        },
        events: {
          // sometimes blocked by browser
          onReady: event => event.target.playVideo(),
        },
      }),
    )
  }
})

export default initYtPlayer
