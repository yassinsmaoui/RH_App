const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'frontend', 'src', 'pages', 'DashboardNew.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix Grid component props
  content = content.replace(/<Grid\s+item\s+xs={([^}]+)}\s+sm={([^}]+)}\s+md={([^}]+)}>/g, 
    '<Grid size={{ xs: $1, sm: $2, md: $3 }}>');
  content = content.replace(/<Grid\s+item\s+xs={([^}]+)}\s+md={([^}]+)}>/g, 
    '<Grid size={{ xs: $1, md: $2 }}>');
  content = content.replace(/<Grid\s+item\s+xs={([^}]+)}>/g, 
    '<Grid size={{ xs: $1 }}>');
  
  // Remove duplicate default exports - keep only the last one
  const lines = content.split('\n');
  let exportDefaultCount = 0;
  const processedLines = lines.map(line => {
    if (line.trim() === 'export default Dashboard;') {
      exportDefaultCount++;
      if (exportDefaultCount === 1) {
        return '// Removed duplicate export default Dashboard;';
      }
    }
    return line;
  });
  
  content = processedLines.join('\n');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ DashboardNew.tsx corrections completed');
} catch (error) {
  console.error('Error fixing DashboardNew.tsx:', error);
}
