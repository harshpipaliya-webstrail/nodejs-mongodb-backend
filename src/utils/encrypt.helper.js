import { encrypt, decrypt } from "text-encrypter";

const shift = 13; // Default is 1

export const encryptString = (input) => {
    if (!input || !input.length) {
        return
    }
    const encrypted = input.split("").map((char) => {
        if (char === ".") {
            return "-"
        }
        if (isNaN(char)) {
            return encrypt(char, shift);
        } else {
            return char;
        }
    });

    return encrypted.join('');
}

export const decryptString = (input) => {
    if (!input || !input.length) {
        return
    }
    const decrypted = input.split("").map((char) => {
        if (char === "-") {
            return "."
        }
        if (isNaN(char)) {
            return decrypt(char, shift);
        } else {
            return char;
        }
    });

    return decrypted.join('');
}

export default { encryptString, decryptString };