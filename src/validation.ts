/** Shared validation constants and helpers. */

/** Nametag: starts with a letter, alphanumeric + hyphens/underscores, max 32 chars. */
export const NAMETAG_REGEX = /^[a-zA-Z][a-zA-Z0-9_-]{0,31}$/;

/** Valid recipient: nametag (with optional @) or 64-char hex public key. */
export const VALID_RECIPIENT = /^@?\w[\w-]{0,31}$|^[0-9a-fA-F]{64}$/;

export function validateRecipient(recipient: string): void {
  if (!VALID_RECIPIENT.test(recipient.trim())) {
    throw new Error(
      `Invalid recipient format: "${recipient}". Expected a nametag or 64-char hex public key.`,
    );
  }
}
