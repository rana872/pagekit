<?php
header('Content-Type: application/json; charset=utf-8');

echo json_encode([
  [
    'id' => 'REC-001',
    'name' => 'Example record',
    'status' => 'Active',
    'updated_at' => date('Y-m-d')
  ],
  [
    'id' => 'REC-002',
    'name' => 'Another example',
    'status' => 'Draft',
    'updated_at' => date('Y-m-d')
  ]
], JSON_UNESCAPED_SLASHES);