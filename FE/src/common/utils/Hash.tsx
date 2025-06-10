
export class Hash {
    static async hashPassword(password: string) {
        const enc = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
}