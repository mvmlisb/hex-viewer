export interface Block {
    start: number;
    count: number;
}

export function getExclusiveEnd(block: Block) {
    return block.start + block.count;
}
