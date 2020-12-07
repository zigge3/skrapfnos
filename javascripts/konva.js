import Konva from "konva";

export function StartKonva(container) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  var stage = new Konva.Stage({
    container: container,
    width: width,
    height: height,
  });
  var layer1 = new Konva.Layer();
  var layer2 = new Konva.Layer();
  stage.add(layer1);
  stage.add(layer2);
  Konva.Image.fromURL("/bg1.jpg", function (node) {
    const { height, width } = node.attrs.image;
    const aspectRatio = height / width;
    node.setAttrs({
      x: 0,
      y: 0,
      height: window.innerWidth * aspectRatio,
      width: window.innerWidth,
    });
    layer1.add(node);
    layer1.batchDraw();
  });
  Konva.Image.fromURL("/bg2.png", function (node) {
    const { height, width } = node.attrs.image;
    const aspectRatio = height / width;
    node.setAttrs({
      x: 0,
      y: 0,
      height: window.innerWidth * aspectRatio,
      width: window.innerWidth,
    });
    layer2.add(node);
    layer2.batchDraw();
  });
  return { konvaFunc: (layer) => stage.add(layer), container: stage.content };
}
