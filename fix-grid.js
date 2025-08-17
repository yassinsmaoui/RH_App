const fs = require('fs');
const path = require('path');

// Fichiers à corriger
const files = [
  'frontend/src/App-backend.tsx',
  'frontend/src/App-clean.tsx',
  'frontend/src/App-complete.tsx',
  'frontend/src/App-simple.tsx'
];

function fixGridProps(content) {
  // Remplacer les patterns Grid avec xs, sm, md, etc.
  let fixed = content;
  
  // Pattern 1: <Grid xs={12} sm={6} md={3} key={...}>
  fixed = fixed.replace(
    /<Grid\s+xs=\{(\d+)\}\s*>/g,
    '<Grid size={$1}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}\s*>/g,
    '<Grid size={{ xs: $1, sm: $2 }}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}\s+md=\{(\d+)\}\s*>/g,
    '<Grid size={{ xs: $1, sm: $2, md: $3 }}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}\s+md=\{(\d+)\}\s+key=\{([^}]+)\}\s*>/g,
    '<Grid size={{ xs: $1, sm: $2, md: $3 }} key={$4}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+xs=\{(\d+)\}\s+md=\{(\d+)\}\s*>/g,
    '<Grid size={{ xs: $1, md: $2 }}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+xs=\{(\d+)\}\s+key=\{([^}]+)\}\s*>/g,
    '<Grid size={$1} key={$2}>'
  );
  
  // Pattern avec item prop (à supprimer)
  fixed = fixed.replace(
    /<Grid\s+item\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}\s+md=\{(\d+)\}\s+key=\{([^}]+)\}\s*>/g,
    '<Grid size={{ xs: $1, sm: $2, md: $3 }} key={$4}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+item\s+xs=\{(\d+)\}\s+md=\{(\d+)\}\s+key=\{([^}]+)\}\s*>/g,
    '<Grid size={{ xs: $1, md: $2 }} key={$3}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+item\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}\s+md=\{(\d+)\}\s*>/g,
    '<Grid size={{ xs: $1, sm: $2, md: $3 }}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+item\s+xs=\{(\d+)\}\s*>/g,
    '<Grid size={$1}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+item\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}\s*>/g,
    '<Grid size={{ xs: $1, sm: $2 }}>'
  );
  
  fixed = fixed.replace(
    /<Grid\s+item\s+xs=\{(\d+)\}\s+md=\{(\d+)\}\s*>/g,
    '<Grid size={{ xs: $1, md: $2 }}>'
  );
  
  return fixed;
}

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`Correcting ${file}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixGridProps(content);
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`✓ ${file} corrected`);
  } else {
    console.log(`✗ ${file} not found`);
  }
});

console.log('Grid correction completed!');
