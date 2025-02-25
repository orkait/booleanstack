def prng_xorshift(input_string: str, length: int = 32) -> str:
    seed = sum(ord(c) for c in input_string) & 0xFFFFFFFF  # Keep within 32-bit
    state = ((seed << 13) ^ seed) & 0xFFFFFFFF  # Initial state mixing

    def xorshift(n: int) -> int:
        n ^= ((n << 7) & 0xFFFFFFFF)
        n ^= ((n >> 9) & 0xFFFFFFFF)
        n ^= ((n << 8) & 0xFFFFFFFF)
        return n & 0xFFFFFFFF  # Ensure within 32-bit

    output = []
    for _ in range((length + 7) // 8):  # Generate enough 8-char hex blocks
        state = xorshift(state)
        output.append(f"{state:08x}")  # Convert to hex, ensure 8-char width

    return "".join(output)[:length]  # Trim to desired length

# Example Usage
print(prng_xorshift("HelloWorld111", 32))  # Example: "9e0360c263249a42e01e909fce550470"
