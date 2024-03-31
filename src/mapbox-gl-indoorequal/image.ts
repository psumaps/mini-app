import {RGBAImage} from "~/mapbox-gl-indoorequal/RGBAImage.ts";

export function createImage(image: RGBAImage, {width, height}: RGBAImage, channels: number, data: Uint8Array | Uint8ClampedArray | undefined) {
    if (!data) {
        data = new Uint8Array(width * height * channels);
    } else if (data instanceof Uint8ClampedArray) {
        data = new Uint8Array(data.buffer);
    } else if (data.length !== width * height * channels) {
        throw new RangeError('mismatched image size');
    }
    image.width = width;
    image.height = height;
    image.data = data;
    return image;
}

export function resizeImage(image: RGBAImage, {width, height}: RGBAImage, channels) {
    if (width === image.width && height === image.height) {
        return;
    }

    const newImage = createImage({}, {width, height}, channels);

    copyImage(image, newImage, {x: 0, y: 0}, {x: 0, y: 0}, {
        width: Math.min(image.width, width),
        height: Math.min(image.height, height)
    }, channels);

    image.width = width;
    image.height = height;
    image.data = newImage.data;
}

export function copyImage(srcImg: { width: number; height: number; data: any; },
                   dstImg: {
    width: number;
    height: number;
    data: any;
}, srcPt: { x: any; y: any; }, dstPt: { x: any; y: any; }, size: { width: any; height: any; }, channels: number) {
    if (size.width === 0 || size.height === 0) {
        return dstImg;
    }

    if (size.width > srcImg.width ||
        size.height > srcImg.height ||
        srcPt.x > srcImg.width - size.width ||
        srcPt.y > srcImg.height - size.height) {
        throw new RangeError('out of range source coordinates for image copy');
    }

    if (size.width > dstImg.width ||
        size.height > dstImg.height ||
        dstPt.x > dstImg.width - size.width ||
        dstPt.y > dstImg.height - size.height) {
        throw new RangeError('out of range destination coordinates for image copy');
    }

    const srcData = srcImg.data;
    const dstData = dstImg.data;

    for (let y = 0; y < size.height; y++) {
        const srcOffset = ((srcPt.y + y) * srcImg.width + srcPt.x) * channels;
        const dstOffset = ((dstPt.y + y) * dstImg.width + dstPt.x) * channels;
        for (let i = 0; i < size.width * channels; i++) {
            dstData[dstOffset + i] = srcData[srcOffset + i];
        }
    }
    return dstImg;
}

