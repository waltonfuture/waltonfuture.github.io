# Lai Wei's personal homepage

A static academic homepage for [waltonfuture.github.io](https://waltonfuture.github.io/).
No build step or package installation is required.

## Preview

Run `python3 -m http.server 8765 --bind 127.0.0.1` from this directory,
then open `http://127.0.0.1:8765`.

## Editing

- Update biography, publications, experience, and awards directly in `index.html`.
- Edit colors and typography in `assets/css/site.css`; shared values are in `:root`.
- Publication filters, navigation highlighting, and legacy anchors are in `assets/js/site.js`.
- Each publication's `data-year` and `data-first` attributes control filtering.
  Counts are calculated automatically. All publications remain readable without JavaScript.
- Newsreader and Inter are served locally from `assets/fonts/`; their OFL licenses are included.
- The profile photograph and favicon are local assets in `assets/images/`.

The October 2026 content refresh adds CLBench-V, Attend to Evidence,
The Illusion of Visual Tool-Use, and the 2026 National Scholarship.
MM-LIMA uses its published title and DOI, with the earlier InstructionGPT-4
version retained as a link. Author lists for CLBench-V and MM-LIMA follow
their public arXiv and publisher records, respectively. Venue and award
details follow the owner's supplied résumé.
