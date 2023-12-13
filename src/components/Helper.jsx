async function createSticky(text)
{
  const sticky = await miro.board.createStickyNote(
  {
    content: text,
    x: 0,
    y: 0
  });
}