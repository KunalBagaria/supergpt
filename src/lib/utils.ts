function trimString(input: string, length: number): string {
  if (input.length <= length) {
    return input;
  }
  return input.substring(0, length) + '...';
}

export { trimString };