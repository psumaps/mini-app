import indoorEqualsJSON from 'psumaps-frontend/shared/assets/sprite/indoorequal.json';
import indoorEqualsJSON2X from 'psumaps-frontend/shared/assets/sprite/indoorequal@2x.json';
import indoorEqualsPNG from 'psumaps-frontend/shared/assets/sprite/indoorequal.png?url';
import indoorEqualsPNG2X from 'psumaps-frontend/shared/assets/sprite/indoorequal@2x.png?url';
import RGBAImage from '~/mapbox-gl-indoorequal/RGBAImage.ts';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */

function getImageData(img: CanvasImageSource) {
  const canvas = window.document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('failed to create canvas 2d context');
  }
  if (img instanceof VideoFrame) throw new Error('VideoFrame is not supported');
  if (img instanceof SVGImageElement) throw new Error('SVGImageElement is not supported');
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0, img.width, img.height);
  return context.getImageData(0, 0, img.width, img.height);
}

export default async function () {
  let json: {
    [x: string]: {
      width: any;
      height: any;
      x: any;
      y: any;
      sdf: any;
      pixelRatio: any;
      stretchX: any;
      stretchY: any;
      content: any;
    };
  };
  let image: HTMLImageElement;
  let imgUrl;

  image = new Image();
  if (window.devicePixelRatio > 1) {
    json = indoorEqualsJSON2X;
    imgUrl = indoorEqualsPNG2X;
  } else {
    json = indoorEqualsJSON;
    imgUrl = indoorEqualsPNG;
  }

  const imageRequest = fetch(`${imgUrl}`)
    .then((r) => r.blob())
    .then((r) => {
      image = new Image();
      image.src = URL.createObjectURL(r);
      return new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject();
      });
    });

  return Promise.all([imageRequest]).then(() => {
    const imageData = getImageData(image);
    const result: {
      [x: string]: {
        data: RGBAImage;
        sdf: any;
        pixelRatio: any;
        stretchX: any;
        stretchY: any;
        content: any;
      };
    } = {};

    Object.keys(json).forEach((id) => {
      const { width, height, x, y, sdf, pixelRatio, stretchX, stretchY, content } = json[id];
      const data = new RGBAImage({ width, height });
      RGBAImage.copy(imageData, data, { x, y }, { x: 0, y: 0 }, { width, height });
      result[id] = { data, pixelRatio, sdf, stretchX, stretchY, content };
    });
    return result;
  });
}
