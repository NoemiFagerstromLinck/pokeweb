export default {
  name: 'PokemonMusicPlayer',
  data() {
    return {
      isPlaying: false,
      currentTrack: 0,
      volume: 0.3,
      tracks: [
        {
          name: 'Littleroot Town Theme',
          url: 'https://www.youtube.com/watch?v=u0G12EBW4KY&t=0s',
          embedId: 'u0G12EBW4KY'
        },
        {
          name: 'Route 101 Theme', 
          url: 'https://www.youtube.com/watch?v=O2jkV4BsN6U',
          embedId: 'O2jkV4BsN6U'
        },
        {
          name: 'Petalburg City Theme',
          url: 'https://www.youtube.com/watch?v=zJEoVKFdZ4c',
          embedId: 'zJEoVKFdZ4c'
        }
      ]
    }
  },
  methods: {
    toggleMusic() {
      this.isPlaying = !this.isPlaying
    },
    changeTrack(index) {
      this.currentTrack = index
    }
  }
}