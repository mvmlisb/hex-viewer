export enum ByteOrder {
    LittleEndian = "LittleEndian",
    BigEndian = "BigEndian"
}

function swapByteOrder(data: DataView) {
    const buffer = new ArrayBuffer(data.byteLength);
    const view = new DataView(buffer);
    for (let i = 0; i < data.byteLength; i++) {
        view.setUint8(i, data.getUint8(data.byteLength - i - 1));
    }
    return view;
}
