export function prngXorShift(inputString, length = 32) {
    let seed = [...inputString].reduce((acc, char) => (acc + char.charCodeAt(0)) & 0xFFFFFFFF, 0);
    let state = ((seed << 13) ^ seed) >>> 0;  // Ensure unsigned 32-bit

    function xorshift(n) {
        n ^= ((n << 7) & 0xFFFFFFFF);
        n ^= ((n >>> 9) & 0xFFFFFFFF);  // JS uses >>> for unsigned shift
        n ^= ((n << 8) & 0xFFFFFFFF);
        return n >>> 0;  // Ensure unsigned 32-bit integer
    }

    let output: string[] = [];
    for (let i = 0; i < Math.ceil(length / 8); i++) {
        state = xorshift(state);
        output.push(state.toString(16).padStart(8, '0')); // Ensure 8-char hex
    }

    return output.join("").slice(0, length);
}
