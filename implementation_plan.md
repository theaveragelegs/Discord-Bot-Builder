# Implementation Plan for Music Playback Fixes and Code Generator Enhancements

## Goal Description

Stabilize the music playback functionality of the generated Discord bot and improve the robustness of the `codeGenerator.js` utility. This includes addressing the repeated YouTube signature decipher errors, ensuring reliable extractors, and adding better error handling and logging.

## User Review Required

- **Dependency Changes**: Adding `@vookav2/play-dl`, `@distube/ytdl-core`, and updating `discord-player` extractors. Confirm you are okay with these new dependencies.
- **Auto‑Installer Behavior**: The generated bot will now auto‑install missing dependencies on start. Ensure this is acceptable for your deployment workflow.
- **Optional FFmpeg Requirement**: The solution relies on `ffmpeg` being available on the system. Please confirm you have it installed or prefer an alternative.

## Open Questions

> [!IMPORTANT]
> - Do you want to keep the existing `youtube-dl-exec` extractor fallback, or remove it entirely?
> - Should we expose a configuration option to toggle the use of `ytdl-core` vs `play-dl`?
> - Are there any additional music‑related blocks you plan to use that are not covered here?

## Proposed Changes

---
### Backend – `codeGenerator.js`
- **Import Updates**: Add imports for `ButtonBuilder`, `StringSelectMenuBuilder`, `ModalBuilder`, `TextInputBuilder`, etc., based on used node types.
- **Music Block Enhancements**:
  - Replace default extractor usage with explicit loading of `DefaultExtractors` and custom `ytdl-core` stream bridge (`globalOnBeforeCreateStream`).
  - Silence noisy `YOUTUBEJS` warnings via `process.on('warning')`.
  - Add detailed error handling for player events (`error`, `playerError`).
  - Ensure voice channel validation and defer replies to avoid interaction timeouts.
- **Auto‑Dependency Installer**: Insert code at start of `index.js` that checks `package.json` for missing deps and runs `npm install` automatically, then restarts the process.
- **Variable Persistence Utility**: Generate `utils/variables.js` with file‑system based JSON storage for global, guild, user, and channel vars.
- **Slash Command Registration**: Ensure global slash commands are registered on `clientReady` with proper permission handling.
- **Logging Improvements**: Central `debugLog` function writes to `bot-debug.log` and prefixes logs.
- **Update Event Generation**: Refactor event handler construction to include proper prefix filtering, interaction checks, and error guards.

---
### Export Controller – `exportController.js`
- Update `deps` object to include the new music‑related packages only when music blocks are detected.
- Ensure `package.json` generated in the zip contains the correct dependency versions.

---
### Frontend (Optional)
- No changes required for the immediate bug fix, but consider adding UI hints for missing FFmpeg or dependency install failures.

## Verification Plan

### Automated Tests
- Run `npm run dev` on the generated bot and trigger a YouTube music command.
- Verify the bot joins the voice channel, streams audio, and logs no `YOUTUBEJS` signature errors.
- Check that missing dependencies are auto‑installed on first run.
- Confirm that `bot-debug.log` captures player errors and other debug info.

### Manual Verification
- Use a test Discord server to execute `/play <YouTube URL>` and other music commands (`/stop`, `/skip`).
- Observe console output for any warnings or errors.
- Verify that the bot resumes playback after a network hiccup (error handling).

---
**Next Steps**
- Apply the code changes in `codeGenerator.js` and `exportController.js`.
- Run the generator, export a zip, and test the bot locally.
- Gather feedback on any remaining issues.
