import {RGBAImage} from "~/mapbox-gl-indoorequal/RGBAImage.ts";

function getImageData(img: CanvasImageSource) {
  const canvas = window.document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('failed to create canvas 2d context');
  }
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0, img.width, img.height);
  return context.getImageData(0, 0, img.width, img.height);
}

export default function(baseUrl: string) {
  const format = window.devicePixelRatio > 1 ? '@2x' : '';
  let json: { [x: string]: { width: any; height: any; x: any; y: any; sdf: any; pixelRatio: any; stretchX: any; stretchY: any; content: any; }; }, image: HTMLImageElement;

  const jsonRequest = fetch(`${baseUrl}${format}.json`)
        .then(r => r.json())
        .then(r => json = r)

  const imageRequest = fetch(`${baseUrl}${format}.png`)
        .then(r => r.blob())
        .then(r => {
          image = new Image();
          image.src = URL.createObjectURL(r);
          return new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () => reject();
          });
        });

  return Promise.all([jsonRequest, imageRequest])
    .then(() => {
      const imageData = getImageData(image);
      const result:{[x:string]: {data:RGBAImage, sdf: any; pixelRatio: any; stretchX: any; stretchY: any; content: any;}} = {};

      for (const id in json) {
        const {width, height, x, y, sdf, pixelRatio, stretchX, stretchY, content} = json[id];
        const data = new RGBAImage({width, height});
        RGBAImage.copy(imageData, data, {x, y}, {x: 0, y: 0}, {width, height});
        result[id] = {data, pixelRatio, sdf, stretchX, stretchY, content};
      }
      return result;
    });
}
