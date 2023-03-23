export const writeText = (testo) => {
  const snippet = [
    'def write_text(testo):',
    '  display.text(testo, 150, 150, 0xffa500)'
  ];

  return snippet.join('\n');
};