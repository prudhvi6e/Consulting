---
name: Reading zip files
description: How to extract zip archives in this Replit environment where unzip/python are missing
---

This environment has **no `unzip` and no `python3`** on PATH (`jar` exists but produced empty output on a user zip).

To read/extract a `.zip`, use Node to parse the ZIP structure directly:
- Find the End of Central Directory record (signature `0x06054b50`) by scanning backward from EOF.
- Walk central-directory entries (signature `0x02014b50`) to get names, local-header offsets, compression method, and **compressed size**.
- **Use the compressed size + method from the central directory, NOT the local file header.** Many zips set general-purpose bit 3 (data descriptor), which leaves the local header's compressed/uncompressed sizes as 0 — inflating with those gives `Z_BUF_ERROR: unexpected end of file`.
- Decompress with `zlib.inflateRawSync` (method 8) or copy raw bytes (method 0).

**Why:** Took several attempts — `unzip`/`python3` both 127, and the first Node attempt failed because it read sizes from the local header instead of the central directory.
