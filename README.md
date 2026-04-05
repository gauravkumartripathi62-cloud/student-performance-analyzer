# Student Academic Performance Analyzer

A polished static web application for the SAPAS specification with:

- dark SaaS-style UI aligned to the spec design system
- CSV-first and zero-preloaded-data workflow messaging
- dashboard, students list, add student flow, profile, analytics, prediction, and upload views
- browser-local persistence with `localStorage`
- exportable JSON and CSV outputs

## Run

Open `index.html` directly in a browser, or serve the folder with Python:

```powershell
cd "C:\Users\Lenovo\OneDrive\Documents\FIFA 23"
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Notes

- The app starts with zero student records.
- Added students are stored only in the browser's local storage.
- The prediction panel is a frontend simulation of the SAPAS ML and risk workflow.
