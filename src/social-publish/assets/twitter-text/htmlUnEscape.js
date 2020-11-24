const HTML_NON_ENTITIES = {amp: '&', lt: '<', le: '≤', gt: '>', ge: '≥', quot: '"', '#039': "'"} 

export default function(text) {
  return (
    text &&
    text.replace(/&([^;]+);/g, (m, c) => HTML_NON_ENTITIES[c]|| '') 
  );
}
