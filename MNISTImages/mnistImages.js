const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

class Image {
  constructor(data, id) {
    this.data = new Uint8Array(data); //Using Uint8Array to mimic byte array behavior
    this.id = id;
  }

  print() {
    for (let i = 0; i < this.data.length; i++) {
      process.stdout.write(this.data[i] === 0 ? " " : "*");
      if ((i + 1) % 28 === 0) {
        process.stdout.write("\n");
      }
    }
  }

  euclideanDistance(img) {
    let distance = 0.0;
    for (let i = 0; i < this.data.length; i++) {
      distance += Math.sqrt(Math.pow((this.data[i] - img.data[i]), 2));
    }
    return Math.sqrt(distance);
  }
}

async function main() {
  const ImageSize = 784;
  const MetaDataSize = 15;
  const images = [];

  try {
    const data = await readFileAsync('input.dat');
    let offset = MetaDataSize;

    while (offset < data.length) {
      const pixels = data.slice(offset, offset + ImageSize);
      images.push(new Image(pixels, images.length));
      offset += ImageSize;
    }
  } catch (err) {
    console.error('Error reading file:', err);
    return;
  }

  console.log(`Total images: ${images.length}`);

  //Example: Find the closest image to a randomly selected image
  const rand = () => Math.floor(Math.random() * images.length);

  //Generate a random index within the range of the list length
  const randomIndex = rand();
  console.log(`Random index: ${randomIndex}`);

  const randomImage = images[randomIndex];
  randomImage.print();

  let closestImage = null;
  let minDistance = Number.POSITIVE_INFINITY;
  let minIndex = 0;

  for (let i = 0; i < images.length; i++) {
    const distance = randomImage.euclideanDistance(images[i]);
    if (distance !== 0 && distance < minDistance) {
      minDistance = distance;
      minIndex = i;
      closestImage = images[i];
    }
  }

  //Output the label of the closest image
  console.log(`\nClosest image (distance=${minDistance}, index=${minIndex})\n`);

  //Print closest image
  closestImage.print();
}

main();
