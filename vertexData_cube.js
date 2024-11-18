var cube = (function() {
  function createVertexData() {
    var vertices = [
      -1, -1, -1,  1, -1, -1,  1,  1, -1, -1,  1, -1,
      -1, -1,  1,  1, -1,  1,  1,  1,  1, -1,  1,  1,
      -1, -1, -1, -1,  1, -1, -1,  1,  1, -1, -1,  1,
      1, -1, -1,  1,  1, -1,  1,  1,  1,  1, -1,  1,
      -1, -1, -1,  1, -1, -1,  1, -1,  1, -1, -1,  1,
      -1,  1, -1,  1,  1, -1,  1,  1,  1, -1,  1,  1
    ];

    var normals = [
      0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,
      0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,
      -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0,
      1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,
      0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,
      0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0
    ];

    var indicesLines = [
      0, 1,  1, 2,  2, 3,  3, 0,
      4, 5,  5, 6,  6, 7,  7, 4,
      0, 4,  1, 5,  2, 6,  3, 7
    ];

    var indicesTris = [
      0, 1, 2,  0, 2, 3,
      4, 5, 6,  4, 6, 7,
      0, 3, 7,  0, 7, 4,
      1, 5, 6,  1, 6, 2,
      0, 4, 5,  0, 5, 1,
      3, 2, 6,  3, 6, 7
    ];

    this.vertices = new Float32Array(vertices);
    this.normals = new Float32Array(normals);
    this.indicesLines = new Uint16Array(indicesLines);
    this.indicesTris = new Uint16Array(indicesTris);
  }

  return {
    createVertexData: createVertexData
  }
})();
