# HRMS Page Starter

Generate a ready-to-integrate list page that follows this project's PHP partial, SPA route, module lifecycle, and mock-data service conventions.

## Requirements

- Node.js 18 or newer
- PHP available through the existing project runtime

## Create a page

From the project root, run:

```powershell
node page-starter/create-page.mjs --slug announcements --title "Announcements" --description "Manage company announcements."
```

The `slug` must be a lowercase URL-safe segment. `title` and `description` are required.

The generator creates:

- `pages/<slug>/index.php`: SPA page partial with a table, search field, and refresh action
- `assets/js/modules/<slug>.js`: page controller using `CommonModule` lifecycle cleanup
- `assets/js/services/<slug>-service.js`: Fetch wrapper following the app's JSON request headers
- `data/mock/<slug>/items.php`: sample JSON endpoint for the generated table
- `page-starter/generated/<slug>/`: import, route-registration, sidebar, and integration instructions

Generated files are never overwritten. Choose a different slug or remove the generated files yourself before reusing one.

## Integrate the page

Open `page-starter/generated/<slug>/README.md` and apply the snippets in `app.js` and, if the page belongs in the main sidebar, `sidebar.php`. The generator intentionally does not edit those shared files automatically.

The route snippet registers `/<slug>` and loads `/pages/<slug>/index.php`. The page can be opened directly after route registration; add the sidebar link only when it should appear in the persistent navigation.

## Customize the generated page

The sample endpoint returns generic records so the new page renders immediately. Replace the sample fields and endpoint with the feature's real data shape as the feature is built. The page partial must remain content-only; the application shell, sidebar, topbar, and global modal root are provided by the existing layout.