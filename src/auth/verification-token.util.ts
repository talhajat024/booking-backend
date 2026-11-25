import { randomBytes,createHash } from "crypto";

export function hashToken(token:string): string {
    return createHash('sha256').update(token).digest('hex');
}

export function generateVerificationToken(ttlMs = 24 * 60 * 60 * 1000){
    const token= randomBytes(32).toString('hex');
    return {
        token,
        hash:hashToken(token),
        expiresAt:new Date(Date.now() + ttlMs),
    }
}

// export function generateResetToken(){
//     const token = randomBytes(32).toString('hex');
//     const hash= hashToken(token);
//     const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
//     return {token,hash,expiresAt};
// }