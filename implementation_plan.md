# Implementation Plan - YouTube Playlist Import

## Goal
Add a feature to allow admins to import an entire YouTube playlist into a course. This will automatically create a new Module (Bab) and populate it with Lessons for each video in the playlist.

## User Review Required

> [!IMPORTANT]
> **YouTube API Key Required**: This feature uses the YouTube Data API v3. 
> You will need to:
> 1. Go to [Google Cloud Console](https://console.cloud.google.com/).
> 2. Enable "YouTube Data API v3".
> 3. Create an API Key.
> 4. Add `YOUTUBE_API_KEY=your_api_key_here` to your `.env.local` file.

## Proposed Changes

### Backend: YouTube API Integration

#### [NEW] [youtube/playlist/route.ts](file:///c:/Users/kadeks/Documents/learnflow/src/app/api/admin/youtube/playlist/route.ts)
- Create a GET handler that:
    - Parses `playlistId` from query params.
    - Fetches playlist items (snippets) from `https://www.googleapis.com/youtube/v3/playlistItems`.
    - Returns a JSON array of `{ title, video_id }`.

### Course Builder UI

#### [MODIFY] [CourseBuilderClient.tsx](file:///c:/Users/kadeks/Documents/learnflow/src/app/admin/courses/%5BcourseId%5D/CourseBuilderClient.tsx)
- Add a state for `showPlaylistModal`.
- Implement a modal (or simple inline input) that accepts a YouTube playlist URL.
- Add a function `handleImportPlaylist`:
    - Extract `list` parameter from the URL.
    - Call the new server-side API.
    - Create a new module in Supabase.
    - Bulk insert lessons into the new module.
- Add a button "Import Playlist YouTube" next to "Tambah Bab Baru".

## Verification Plan

### Manual Verification
1. Open the Course Builder for any course.
2. Click "Import Playlist YouTube".
3. Paste a link like `https://www.youtube.com/playlist?list=PL...`.
4. Observe that a new Bab is created with all videos from the playlist as lessons.
5. Check if video URLs and titles match.
