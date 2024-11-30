export const ComputersBySignType: Record<string, Computers> = {
    Signed: {
        get8Bit: (data: DataView) => data.getInt8(0).toString(),
        get16Bit: (data: DataView) => data.getInt16(0).toString(),
        get32Bit: (data: DataView) => data.getInt32(0).toString(),
        get64Bit: (data: DataView) => data.getBigInt64(0).toString()
    },
    Unsigned: {
        get8Bit: (data: DataView) => data.getUint8(0).toString(),
        get16Bit: (data: DataView) => data.getUint16(0).toString(),
        get32Bit: (data: DataView) => data.getUint32(0).toString(),
        get64Bit: (data: DataView) => data.getBigUint64(0).toString()
    }
};

export interface Computers {
    get8Bit: (data: DataView) => string;
    get16Bit: (data: DataView) => string;
    get32Bit: (data: DataView) => string;
    get64Bit: (data: DataView) => string;
}

export type ComputerType = keyof Computers;
