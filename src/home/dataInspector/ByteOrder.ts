export enum ByteOrder {
    LittleEndian = "LittleEndian",
    BigEndian = "BigEndian"
}

export const ByteOrderLabels: Record<ByteOrder, string> = {
    [ByteOrder.LittleEndian]: "Little Endian",
    [ByteOrder.BigEndian]: "Big Endian"
};
