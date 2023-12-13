'use client';

//Globals
const topics = [
    "Landuse","Energy","Safety & Security", 
    "Social connections", "Cultural Identity", "Subjective wellbeing", 
    "Community collaboration", "Matauranga Maori", "Team diversity",
    "Working in the overlap", "Shop local", "Value proposition",
    "Emissions", "Te Mauri o te wai", "Biodiversity", "Pollution & Waste"
];
const datasetName = 'data';

//Diagram dimensions
const radii = [400,300,200,100];
const textRadius = 900;
const rowValue = [1,1,1,-1];

function degrToRad(num){return Math.PI * num / 180;}

async function createTriangleShape(width, height, rotation){
  return await miro.board.createShape({
    content: '',
    shape: 'triangle',
    style: {
      fillColor: 'transparent', // Default shape fill color: transparent (no fill)
      fillOpacity: 0.8, // Default fill color opacity: no opacity
      borderOpacity: 1.0, // Default border color opacity: no opacity
      borderWidth: 1, // Default border width
    },
    x: -Math.sin(degrToRad(rotation))*height/2, // Default value: center of the board
    y: Math.cos(degrToRad(rotation))*height/2, // Default value: center of the board
    width: width,
    height: height,
    rotation: rotation,
  });
}

async function createPolarShapeArray(segmentCount, radius, row, boardId){
  const angle = 2*Math.PI/segmentCount;
  const width = 2*radius*Math.sin(angle/2);
  const height = radius*Math.cos(angle/2);

  for(var i=0; i< segmentCount; i++)
  {
    const rotAngle =(360/segmentCount)*i;
    const shape = await createTriangleShape(width, height, rotAngle);
    await shape.setMetadata(datasetName,
    {
      columnIdx: i,
      rowIdx: row,
      boardId: boardId
    });
    shape.sync();
  }
}

async function createTextLabel(text, width, height, rotation){
  var textRot = rotation;
  if(textRot > 90 && textRot < 270)
  {
    textRot -= 180;
  }

  return await miro.board.createText({
    content: text,
    style: {
      color: '#1a1a1a', // Default value: #1a1a1a (black)
      fontSize: 14, // Default font size
      textAlign: 'center', // Default alignment: left
    },
    x: -Math.sin(degrToRad(rotation))*height/2, // Default value: center of the board
    y: Math.cos(degrToRad(rotation))*height/2, // Default value: center of the board
    width: 240,
    // 'height' is calculated automatically, based on 'width'
    rotation: textRot
  });
}

async function createPolarTextArray(segmentCount, radius, row, boardId){
  const angle = 2*Math.PI/segmentCount;
  const width = 2*textRadius*Math.sin(angle/2);
  const height = textRadius*Math.cos(angle/2);

  for(var i=0; i< segmentCount; i++)
  {
    var rotAngle=(360/segmentCount)*i;
    const text = await createTextLabel(topics[i],width,height,rotAngle);
    await text.setMetadata(datasetName,
    {
      columnIdx: i,
      rowIdx: null,
      boardId: boardId
    });
  }
}

async function createTeKapehuDiagram(){
  //get board name
  const boardInfo = await miro.board.getInfo();
  const boardId = `${boardInfo.id}`;

  //Check if a diagram already exists
  const boardShapes = await miro.board.get({type: ['shape']});
  
  for(var boardShape of boardShapes)
  {
    const data = await boardShape.getMetadata(datasetName);
    if(data.boardId === boardId)
    {
      await miro.board.notifications.showInfo('Te Kapehu diagram already exists.');
      return; //stop creating anything
    }
  } 

  await miro.board.notifications.showInfo('Building Te Kapehu Diagram...');

  //create shapes
  for(var i=0; i < radii.length; i++)
  {
    const radius = radii[i];
    var ring = createPolarShapeArray(topics.length, radius, i, boardId);
  }

  var text = createPolarTextArray(topics.length, textRadius, boardId);
}

export const CreateTeKapehuDiagram = () => {
  return (
    <div>
      <button
        type="button"
        onClick={createTeKapehuDiagram}
        className="button button-primary"
      >
        Create Te Kapehu Diagram
      </button>
    </div>
  );
};