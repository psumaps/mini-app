// Not premultiplied, because ImageData is not premultiplied.
// UNPACK_PREMULTIPLY_ALPHA_WEBGL must be used when uploading to a texture.
import {copyImage, createImage, resizeImage} from "~/mapbox-gl-indoorequal/image.ts";

export class RGBAImage {
    data: any;
    width: number;
    height: number;

    constructor(size: { width?: number; height?: number; }, data: Uint8Array | undefined) {
        createImage(this, size, 4, data);
    }

    resize(size: { width: any; height: any; }) {
        resizeImage(this, size, 4);
    }

    replace(data: { buffer: ArrayBufferLike | ArrayLike<number>; }, copy: any) {
        if (copy) {
            this.data.set(data);
        } else if (data instanceof Uint8ClampedArray) {
            this.data = new Uint8Array(data.buffer);
        } else {
            this.data = data;
        }
    }

    clone() {
        return new RGBAImage({width: this.width, height: this.height}, new Uint8Array(this.data));
    }

    static copy(srcImg: ImageData, dstImg: ImageData, srcPt: { x: any; y: any; }, dstPt: { x: any; y: any; }, size: {
        width: any;
        height: any;
    }) {
        copyImage(srcImg, dstImg, srcPt, dstPt, size, 4);
    }
}
