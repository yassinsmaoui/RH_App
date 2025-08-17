const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'frontend', 'src', 'pages', 'DashboardNew.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all Grid with item prop
  content = content.replaceAll('        <Grid item xs={12} sm={6} md={3}>', '        <Grid size={{ xs: 12, sm: 6, md: 3 }}>');
  content = content.replaceAll('        <Grid item xs={12} md={6}>', '        <Grid size={{ xs: 12, md: 6 }}>');
  
  // Fix duplicate exports by removing the first one and keeping the last
  const lines = content.split('\n');
  let foundFirst = false;
  const fixedLines = lines.map(line => {
    if (line.trim() === 'export default Dashboard;') {
      if (!foundFirst) {
        foundFirst = true;
        return '// Removed duplicate export';
      }
    }
    return line;
  });
  
  content = fixedLines.join('\n');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ All Grid items fixed in DashboardNew.tsx');
} catch (error) {
  console.error('Error:', error);
}
