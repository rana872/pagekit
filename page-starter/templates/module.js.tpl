import { CommonModule } from './common.js';
import { {{CLASS_NAME}}Service } from '../services/{{SLUG}}-service.js';

const service = new {{CLASS_NAME}}Service();

export class {{CLASS_NAME}}Module extends CommonModule {
  constructor() {
    super('{{CLASS_NAME}}Module');
    this.items = [];
    this.query = '';
  }

  async init(ctx) {
    super.init(ctx);
    const root = document.getElementById('page-starter-{{SLUG}}');
    if (!root) return;

    const search = root.querySelector('#{{SLUG}}-search');
    const refresh = document.getElementById('{{SLUG}}-refresh');
    if (search) {
      this.addListener(search, 'input', () => {
        this.query = search.value.trim().toLowerCase();
        this.render(root);
      });
    }
    if (refresh) this.addListener(refresh, 'click', () => this.load(root));

    await this.load(root);
  }

  async load(root) {
    const status = root.querySelector('#{{SLUG}}-status');
    const body = root.querySelector('#{{SLUG}}-table-body');
    if (status) status.textContent = 'Loading records...';

    try {
      this.items = await service.getAll();
      if (!Array.isArray(this.items)) throw new Error('Expected the endpoint to return a JSON array.');
      this.render(root);
    } catch (error) {
      console.error('[{{CLASS_NAME}}Module] Could not load records:', error);
      if (body) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.className = 'text-center py-4 text-danger';
        cell.textContent = 'Records could not be loaded. Use Refresh to try again.';
        row.append(cell);
        body.replaceChildren(row);
      }
      if (status) status.textContent = 'Unable to load records.';
    }
  }

  render(root) {
    const body = root.querySelector('#{{SLUG}}-table-body');
    const status = root.querySelector('#{{SLUG}}-status');
    if (!body) return;

    const visibleItems = this.items.filter((item) =>
      [item.id, item.name, item.status, item.updated_at]
        .some((value) => String(value ?? '').toLowerCase().includes(this.query))
    );

    if (visibleItems.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 4;
      cell.className = 'text-center py-4 text-muted';
      cell.textContent = this.query ? 'No matching records.' : 'No records found.';
      row.append(cell);
      body.replaceChildren(row);
    } else {
      body.replaceChildren(...visibleItems.map((item) => {
        const row = document.createElement('tr');
        [item.id, item.name, item.status, item.updated_at].forEach((value, index) => {
          const cell = document.createElement('td');
          cell.textContent = String(value ?? '—');
          if (index === 0) cell.className = 'ps-3 font-monospace';
          if (index === 3) cell.className = 'pe-3';
          row.append(cell);
        });
        return row;
      }));
    }

    if (status) status.textContent = `${visibleItems.length} record${visibleItems.length === 1 ? '' : 's'}`;
  }
}

export const {{SINGLE_NAME}}Module = new {{CLASS_NAME}}Module();