import qrcode from "qrcode-generator";
import QRCanvas from "./core/QRCanvas";
import getMode from "./tools/getMode";

const workerCtx: Worker = self as any;

console.log(self.location);

// Respond to message from parent thread
workerCtx.addEventListener("message", async ({ data }) => {
  if (data.key === "initCanvas") {
    console.log("init Canvas", data.id);
    const { options, frameImage, id } = data;

    const canvas = new QRCanvas(data.options, data.canvas, frameImage);

    const qr = qrcode(options.qrOptions.typeNumber, options.qrOptions.errorCorrectionLevel);
    qr.addData(options.data, options.qrOptions.mode || getMode(options.data));
    qr.make();

    await canvas.drawQR(qr);

    setTimeout(() => {
      workerCtx.postMessage({ key: "drawingEnded", id });
    }, 500);
  }
});

export default {} as typeof Worker & { new (): Worker };
