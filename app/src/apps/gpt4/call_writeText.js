export const call_writeText = (testo) => {
  const snippet = [
    "write_text('" + testo +"')",
    "gc.collect()"
  ];

  return snippet.join('\n');
};