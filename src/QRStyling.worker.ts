import qrcode from "qrcode-generator";
import QRCanvas from "./core/QRCanvas";
import getMode from "./tools/getMode";

const workerCtx: Worker = self as any;

workerCtx.addEventListener("message", async ({ data }) => {
  if (data.key === "initCanvas") {
    const { options, frameImage, id } = data;

    const canvas = new QRCanvas(data.options, data.canvas, frameImage);

    const qr = qrcode(options.qrOptions.typeNumber, options.qrOptions.errorCorrectionLevel);
    qr.addData(options.data, options.qrOptions.mode || getMode(options.data));
    qr.make();

    await canvas.drawQR(qr);

    // this delay is for waiting dom canvas sync
    setTimeout(() => {
      workerCtx.postMessage({ key: "drawingEnded", id });
    }, 100);
  }
});

export default {} as typeof Worker & { new (): Worker };
