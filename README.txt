BOOTSTRAP 5 - PROFESSIONAL ADMIN DASHBOARD

PROJECT STRUCTURE
admin/
  index.html
  students.html
  courses.html
  attendance.html
  reports.html
  assets/
    style.css
    app.js
  README.txt

HOW TO RUN
1. Extract the ZIP file.
2. Open the admin folder in VS Code.
3. Run index.html using Live Server (recommended), or open it in a browser.
4. Internet is required to load Bootstrap 5 from the CDN.

FEATURES
- Bootstrap 5.3.3 CDN, responsive grid and components.
- Responsive desktop sidebar and mobile offcanvas navigation.
- Dashboard KPI cards, filtering and recent student table.
- Students page with add/edit/delete modal, validation, search, filters and pagination.
- Courses catalog with search.
- Attendance sample report.
- Reports page with summary cards and department/semester tables.
- Bootstrap dismissible alert messages.
- Reads/writes student data using localStorage key: studentManagementRecords.

INTEGRATING LAB 6 DATA
The previous Student Management Frontend uses the key "studentManagementRecords".
This project reads that exact key. To see the same records, open both projects from
the same origin (same protocol, hostname and port), for example by placing both
folders under one Live Server root and navigating to each folder.

IMPORTANT
- localStorage is browser- and origin-specific. Opening the projects from different
  ports or one via file:// and one via Live Server means they will not share data.
- Course and attendance information is demonstration/sample content only.
- This is a frontend-only project; it has no server, authentication or database.
