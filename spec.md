# Bangladesh Free Fire Tournament

## Current State
- Tournament CRUD with title, date, prizePool, totalSlots, format, rules, status fields
- Registration system with bKash payment and transaction ID
- Leaderboard system
- Admin dashboard
- No announcements feature
- No entry fee tiers
- No PDF upload for tournaments

## Requested Changes (Diff)

### Add
- Announcements section (admin can post, users can view)
- Entry fee field on tournaments with preset tiers: 100, 500, 1000, 5000, 25000 Taka
- PDF upload capability for tournaments (rules/schedule PDFs) using blob-storage
- PDF download button on tournament detail page

### Modify
- Tournament creation form to include entryFee selection and optional PDF upload
- Tournament display cards to show entry fee badge
- Admin dashboard to manage announcements

### Remove
- Nothing removed

## Implementation Plan
1. Add blob-storage component for PDF file handling
2. Add Announcement type + CRUD to backend (id, title, content, createdAt)
3. Add entryFee field (Text) to Tournament type
4. Add addAnnouncement, getAnnouncements, deleteAnnouncement functions
5. Frontend: Announcements section on Home page (public view) and Admin panel for managing them
6. Frontend: Entry fee selector (100/500/1000/5000/25000 Taka) in tournament create/edit form
7. Frontend: PDF upload in tournament form, download button on TournamentDetail page
