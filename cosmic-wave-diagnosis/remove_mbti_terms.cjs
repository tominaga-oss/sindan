const fs = require('fs');
const path = '/home/ubuntu/cosmic-wave-diagnosis/client/src/data/results.json';

try {
  const data = fs.readFileSync(path, 'utf8');
  const results = JSON.parse(data);

  // Regex to match MBTI terms like (Fe), (Ni), (Te), (Si), etc.
  // Also matches terms without parentheses if they appear in specific contexts if needed,
  // but based on the file content, they are mostly in parentheses like (Ni).
  // We will remove patterns like (XX) where XX is a 2-letter MBTI function code.
  const mbtiRegex = /\s*\((?:Fe|Fi|Te|Ti|Ne|Ni|Se|Si|E|I|S|N|T|F|J|P)\)/g;
  
  // Also remove standalone terms if they are explicitly mentioned as functions
  // e.g. "内向的直観（Ni）" -> "内向的直観"
  // The regex above handles the parenthesized part.
  
  // Iterate through all results and clean content
  for (const key in results) {
    if (results[key].content) {
      results[key].content = results[key].content.replace(mbtiRegex, '');
      
      // Additional cleanup for any lingering double spaces or awkward punctuation
      results[key].content = results[key].content.replace(/  /g, ' ');
    }
  }

  fs.writeFileSync(path, JSON.stringify(results, null, 2), 'utf8');
  console.log('Successfully removed MBTI terms from results.json');

} catch (err) {
  console.error('Error processing file:', err);
}
