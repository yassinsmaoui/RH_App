const fs = require('fs');
const path = require('path');

// Fichiers à corriger
const files = [
  'frontend/src/pages/Dashboard.tsx',
  'frontend/src/pages/DashboardNew.tsx',
  'frontend/src/pages/DashboardNew_fixed.tsx'
];

function fixGridProps(content) {
  let fixed = content;
  
  // Remplacer les patterns Grid avec xs, sm, md, etc.
  // Pattern avec item prop (à supprimer)
  fixed = fixed.replace(
    /<Grid\s+item\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}\s+md=\{(\d+)\}\s*>/g,
    '<Grid size={{ xs: $1, sm: $2, md: $3 }}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+item\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}\s+md=\{(\d+)\}\s+key=\{([^}]+)\}\s*>/g,
    '<Grid size={{ xs: $1, sm: $2, md: $3 }} key={$4}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+item\s+xs=\{(\d+)\}\s+md=\{(\d+)\}\s+key=\{([^}]+)\}\s*>/g,
    '<Grid size={{ xs: $1, md: $2 }} key={$3}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+item\s+xs=\{(\d+)\}\s+md=\{(\d+)\}\s*>/g,
    '<Grid size={{ xs: $1, md: $2 }}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+item\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}\s*>/g,
    '<Grid size={{ xs: $1, sm: $2 }}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+item\s+xs=\{(\d+)\}\s*>/g,
    '<Grid size={$1}>'
  );
  
  return fixed;
}

function fixOtherIssues(content) {
  let fixed = content;
  
  // Supprimer les exports par défaut en double
  const exportLines = fixed.split('\n');
  let foundFirstExport = false;
  const filteredLines = exportLines.filter(line => {
    if (line.trim().startsWith('export default')) {
      if (foundFirstExport) {
        return false; // Supprimer les exports en double
      }
      foundFirstExport = true;
    }
    return true;
  });
  
  fixed = filteredLines.join('\n');
  
  return fixed;
}

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`Correcting ${file}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    let fixed = fixGridProps(content);
    fixed = fixOtherIssues(fixed);
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`✓ ${file} corrected`);
  } else {
    console.log(`✗ ${file} not found`);
  }
});

console.log('All files correction completed!');
