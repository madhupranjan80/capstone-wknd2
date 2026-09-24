/*
 * table-factsheet — adventure fact sheet.
 * Renders label/value rows as a borderless definition-style table
 * (no header row). Based on the Block Collection table block.
 */
export default function decorate(block) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  [...block.children].forEach((row) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell, cellIdx) => {
      const td = document.createElement('td');
      td.className = cellIdx === 0 ? 'table-factsheet-label' : 'table-factsheet-value';
      td.innerHTML = cell.innerHTML;
      tr.append(td);
    });
    tbody.append(tr);
  });

  table.append(tbody);
  block.replaceChildren(table);
}
