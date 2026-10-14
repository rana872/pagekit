#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(packageDirectory, '..');

function usage() {
  console.log(`Usage: node page-starter/create-page.mjs --slug <url-segment> --title <title> --description <text> [--nav-label <text>] [--icon <bootstrap-icon>]

Example:
  node page-starter/create-page.mjs --slug announcements --title "Announcements" --description "Manage company announcements."`);
}

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') return { help: true };
    if (!arg.startsWith('--')) throw new Error(`Unexpected argument: ${arg}`);
    const key = arg.slice(2);
    const value = args[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`);
    options[key] = value;
    index += 1;
  }
  return options;
}

function phpString(value) {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
}

function jsString(value) {
  return JSON.stringify(value);
}

function pascalCase(slug) {
  return slug.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('');
}

function renderTemplate(name, tokens) {
  const template = readFileSync(join(packageDirectory, 'templates', name), 'utf8');
  return template.replace(/{{([A-Z_]+)}}/g, (match, key) => {
    if (!(key in tokens)) throw new Error(`No value provided for template token ${key} in ${name}`);
    return tokens[key];
  });
}

function routeSnippet({ slug, title, className, singleName }) {
  return `// Add with the other module imports near the top of assets/js/app.js:
import { ${singleName}Module } from './modules/${slug}.js';

// Add inside registerAllRoutes() in assets/js/app.js:
appRouter.addRoute('/${slug}', {
  partial: '/pages/${slug}/index.php',
  title: ${jsString(title)},
  module: ${singleName}Module,
  breadcrumbs: [
    { title: 'Dashboard', route: '/dashboard' },
    { title: ${jsString(title)}, route: null }
  ]
});
`;
}

function sidebarSnippet({ slug, title, navLabel, icon }) {
  return `<!-- Optional: add inside the relevant sidebar submenu in includes/sidebar.php -->
<li><a href="/${slug}" data-route="/${slug}" class="sidebar-submenu-link <?= $currentUri === '/${slug}' ? 'active' : '' ?>"><i class="bi ${icon} me-1"></i>${navLabel}</a></li>
`;
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    usage();
    process.exitCode = 1;
    return;
  }

  if (options.help) {
    usage();
    return;
  }

  const { slug, title, description } = options;
  if (!slug || !title || !description) {
    console.error('The --slug, --title, and --description options are required.');
    usage();
    process.exitCode = 1;
    return;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    console.error('The slug must contain lowercase letters, numbers, and single hyphens only.');
    process.exitCode = 1;
    return;
  }

  const className = pascalCase(slug);
  const singleName = `${slug.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase())}`;
  const navLabel = options['nav-label'] || title;
  const icon = options.icon || 'bi-grid';
  if (!/^[a-z0-9-]+$/.test(icon)) {
    console.error('The icon must be a Bootstrap Icons class name suffix, such as bi-grid or bi-people.');
    process.exitCode = 1;
    return;
  }

  const tokens = {
    SLUG: slug,
    TITLE_PHP: phpString(title),
    DESCRIPTION_PHP: phpString(description),
    TITLE_HTML: title.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
    CLASS_NAME: className,
    SINGLE_NAME: singleName,
  };
  const generatedDirectory = join(packageDirectory, 'generated', slug);
  const files = new Map([
    [join(projectRoot, 'pages', slug, 'index.php'), renderTemplate('page.php.tpl', tokens)],
    [join(projectRoot, 'assets', 'js', 'modules', `${slug}.js`), renderTemplate('module.js.tpl', tokens)],
    [join(projectRoot, 'assets', 'js', 'services', `${slug}-service.js`), renderTemplate('service.js.tpl', tokens)],
    [join(projectRoot, 'data', 'mock', slug, 'items.php'), renderTemplate('items.php.tpl', tokens)],
    [join(generatedDirectory, 'route-registration.js.txt'), routeSnippet({ slug, title, className, singleName })],
    [join(generatedDirectory, 'sidebar-link.php.txt'), sidebarSnippet({ slug, title, navLabel, icon })],
    [join(generatedDirectory, 'README.md'), `# ${title} Integration\n\n1. Add the import from \`route-registration.js.txt\` to \`assets/js/app.js\`.\n2. Add its route block inside \`registerAllRoutes()\` in \`assets/js/app.js\`.\n3. Optionally add the sidebar snippet from \`sidebar-link.php.txt\` to the appropriate submenu in \`includes/sidebar.php\`.\n4. Open \`/${slug}\` after registering the route. The generated mock endpoint provides sample rows.\n\nGenerated application files:\n- \`pages/${slug}/index.php\`\n- \`assets/js/modules/${slug}.js\`\n- \`assets/js/services/${slug}-service.js\`\n- \`data/mock/${slug}/items.php\`\n`],
  ]);

  const collisions = [...files.keys()].filter(existsSync);
  if (collisions.length > 0) {
    console.error('Nothing was written because these paths already exist:');
    collisions.forEach((path) => console.error(`- ${path}`));
    process.exitCode = 1;
    return;
  }

  for (const [path, content] of files) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content, { encoding: 'utf8', flag: 'wx' });
  }

  console.log(`Created page starter for /${slug}:`);
  for (const path of files.keys()) console.log(`- ${path.slice(projectRoot.length + 1).replaceAll('\\', '/')}`);
  console.log(`\nNext: follow page-starter/generated/${slug}/README.md to register the route.`);
}

main();