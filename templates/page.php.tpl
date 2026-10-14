<?php
$pageTitle = '{{TITLE_PHP}}';
$pageDescription = '{{DESCRIPTION_PHP}}';
$pageActions = '<button class="btn btn-outline-secondary btn-sm" id="{{SLUG}}-refresh" type="button" title="Refresh records"><i class="bi bi-arrow-clockwise me-1"></i>Refresh</button>';
include __DIR__ . '/../../includes/components/page-header.php';
?>

<section id="page-starter-{{SLUG}}" aria-labelledby="{{SLUG}}-table-title">
  <div class="card border shadow-none">
    <div class="card-header bg-body py-2 px-3 border-bottom d-flex align-items-center justify-content-between gap-2 flex-wrap">
      <h2 class="fs-6 fw-semibold mb-0" id="{{SLUG}}-table-title">{{TITLE_HTML}} records</h2>
      <label class="visually-hidden" for="{{SLUG}}-search">Search records</label>
      <div class="input-group input-group-sm" style="max-width: 280px;">
        <span class="input-group-text"><i class="bi bi-search" aria-hidden="true"></i></span>
        <input class="form-control" id="{{SLUG}}-search" type="search" placeholder="Search records" autocomplete="off">
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-sm table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col" class="ps-3">Record</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col" class="pe-3">Updated</th>
          </tr>
        </thead>
        <tbody id="{{SLUG}}-table-body">
          <tr><td colspan="4" class="text-center py-4 text-muted">Loading records...</td></tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer bg-body py-2 px-3 text-muted small" id="{{SLUG}}-status" role="status" aria-live="polite">Loading records...</div>
  </div>
</section>