class Song {
  constructor(title, artist, album, releaseYear) {
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.releaseYear = releaseYear;
  }
}

class Songs {
  //Compare songs based on artist
  static compareByArtist(a, b) {
    return a.artist === b.artist;
  }

  //Compare songs based on album
  static compareByAlbum(a, b) {
    return a.album === b.album;
  }

  //Compare songs based on release date
  static compareByReleaseDate(a, b) {
    return a.releaseYear - b.releaseYear;
  }

  static insertionSort(arr, compare) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      //Move elements of arr[0..i-1], that are greater than key,
      //to one position ahead of their current position
      while (j >= 0 && compare(arr[j], key) > 0) {
        arr[j + 1] = arr[j];
        j = j - 1;
      }
      arr[j + 1] = key;
    }
  }

  static main() {
    const songs = [
      new Song('Song1', 'Artist2', 'Album1', 2010),
      new Song('Song2', 'Artist1', 'Album2', 2005),
      new Song('Song3', 'Artist3', 'Album1', 2015),
      new Song('Song4', 'Artist4', 'Album3', 2008),
      new Song('Song5', 'Artist1', 'Album2', 2003),
      new Song('Song6', 'Artist3', 'Album4', 2019),
      new Song('Song7', 'Artist2', 'Album3', 2012),
      new Song('Song8', 'Artist4', 'Album4', 2017),
      new Song('Song9', 'Artist5', 'Album5', 2014),
      new Song('Song10', 'Artist5', 'Album5', 2011),
    ];

    const numSongs = songs.length;

    //Sort by artist
    Songs.insertionSort(songs, Songs.compareByArtist);
    console.log('Sorted by Artist:');
    songs.forEach(song => {
      console.log(`${song.title} from ${song.artist}`);
    });
    console.log();

    //Sort by album
    Songs.insertionSort(songs, Songs.compareByAlbum);
    console.log('Sorted by Album:');
    songs.forEach(song => {
      console.log(`${song.title} from ${song.album}`);
    });
    console.log();

    //Sort by release date
    Songs.insertionSort(songs, Songs.compareByReleaseDate);
    console.log('Sorted by Release Date:');
    songs.forEach(song => {
      console.log(`${song.title} released in ${song.releaseYear}`);
    });
  }
}

Songs.main();