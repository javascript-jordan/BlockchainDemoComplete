import { AES, enc, SHA256 } from "crypto-js";

export const hash = (phrase: string): string => {
    return SHA256(phrase).toString();
}