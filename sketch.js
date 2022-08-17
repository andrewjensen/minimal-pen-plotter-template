import {
  PAPER_WIDTH,
  PAPER_HEIGHT,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CONTENT_PADDING,
} from './config.js';

function setup() {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'myCanvas');
  canvas.setAttribute('resize', true);
  canvas.style.setProperty('width', `${CANVAS_WIDTH}px`);
  canvas.style.setProperty('height', `${CANVAS_HEIGHT}px`);
  canvas.style.setProperty('background-color', 'white');

  const main = document.querySelector('main');
  main.append(canvas);

  paper.setup(canvas);

  draw();
}

function draw() {
  const border = new paper.Path.Rectangle({
    from: [CONTENT_PADDING, CONTENT_PADDING],
    to: [CANVAS_WIDTH - CONTENT_PADDING, CANVAS_HEIGHT - CONTENT_PADDING],
    fillColor: null,
    strokeColor: '#000000',
    strokeWidth: 0.5
  });

  paper.view.draw();
}

function saveSketchAsSVG() {
  const svgNode = paper.project.exportSVG({});
  window.svgNode = svgNode;

  svgNode.setAttribute('width', PAPER_WIDTH);
  svgNode.setAttribute('height', PAPER_HEIGHT);

  console.log('paper width:', svgNode.getAttribute('width'));
  console.log('paper height:', svgNode.getAttribute('height'));

  const serializer = new XMLSerializer();
  const svgResult = serializer.serializeToString(svgNode);

  console.log(svgResult);

  const now = new Date();
  const year = now.getFullYear();
  const monthPadded = `${now.getMonth() + 1}`.padStart(2, '0');
  const datePadded = `${now.getDate()}`.padStart(2, '0');
  const isoDate = `${year}-${monthPadded}-${datePadded}`;

  save(`sketch-${isoDate}.svg`, svgResult);
}

function save(filename, data) {
  const blob = new Blob([data], {type: 'image/svg+xml'});

  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}

window.onload = setup;

document.querySelector('#saveButton')
  .addEventListener('click', saveSketchAsSVG);
