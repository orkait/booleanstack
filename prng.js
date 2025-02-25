function prngXorShift(inputString, length = 32) {
	let seed = [...inputString].reduce((acc, char) => (acc + char.charCodeAt(0)) & 0xffffffff, 0);
	let state = ((seed << 13) ^ seed) >>> 0; // Ensure unsigned 32-bit

	function xorshift(n) {
		n ^= (n << 7) & 0xffffffff;
		n ^= (n >>> 9) & 0xffffffff; // JS uses >>> for unsigned shift
		n ^= (n << 8) & 0xffffffff;
		return n >>> 0; // Ensure unsigned 32-bit integer
	}

	let output = [];
	for (let i = 0; i < Math.ceil(length / 8); i++) {
		state = xorshift(state);
		output.push(state.toString(16).padStart(8, "0")); // Ensure 8-char hex
	}

	return output.join("").slice(0, length);
}
