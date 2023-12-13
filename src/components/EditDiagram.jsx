'use client';

const colors = ["#6DA843","#9DBA82","#F5D685","#F69790"];
const datasetName = 'data';
var diagramShapes = [];

async function getDiagramShapes(){
  //get board name
  const boardInfo = await miro.board.getInfo();
  const boardId = `${boardInfo.id}`;

  var diagramShapes = [];

  // Filter te kapehu diagram from the selected items
  const shapes = await miro.board.get({
    type: ['shape'],
  });

  for(var shape of shapes)
  {
    try {
      const shapeData = await shape.getMetadata(datasetName);
      if(shapeData.boardId === boardId)
      {
        diagramShapes.push(shape);
      }
    }
    catch(err){
    }
  }

  return diagramShapes;
}

const editEvent = async (event) => {
    //get selectioninfo
    try{
      const selection = event.items[0];
      var data = await selection.getMetadata(datasetName);
    }
    catch(err)
    {
      return;
    }  

    const rowSel = data.rowIdx;
    const columnSel = data.columnIdx;

    await miro.board.notifications.showInfo('Selection: R' + rowSel + ' C' + columnSel);

    // Change the fill color in selection
    for(var shape of diagramShapes)
    {
      const shapeData = await shape.getMetadata(datasetName);
      const columnIdx = shapeData.columnIdx;

      if(columnIdx === columnSel)
      {
        const rowIdx = shapeData.rowIdx;
        if(rowIdx >= rowSel)
        {
          shape.style.fillColor = colors[rowSel];
        }
        else
        {
          shape.style.fillColor = 'transparent';
        }
        await shape.sync();
      }
    }
};

async function toggleSubscribeToDiagramEvents() {
  const toggle = document.getElementById("event-toggle");

  if(toggle.checked === true)
  {
    miro.board.ui.on('selection:update',editEvent);
    diagramShapes = await getDiagramShapes();
  }
  else
  {
    miro.board.ui.off('selection:update', editEvent);
    diagramShapes = [];
  }
}

export const EditDiagram = () => {
  return (
      <label className="toggle">
	      <input type="checkbox" tabIndex="0" id="event-toggle" onClick={toggleSubscribeToDiagramEvents}/>
	      <span>Edit diagram</span>
      </label>
  );
};
