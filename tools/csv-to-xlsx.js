#!/usr/bin/env node
/**
 * topics_list.csv → topics_list.xlsx
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const root = path.join(__dirname, '..');
const csvPath = path.join(root, 'topics_list.csv');
const outPath = path.join(root, 'topics_list.xlsx');

const csv = fs.readFileSync(csvPath, 'utf8');
const wb = XLSX.read(csv, { type: 'string' });
XLSX.writeFile(wb, outPath);
console.log('Wrote', outPath);
