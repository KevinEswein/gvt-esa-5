var cube = (function() {
  function createVertexData() {
    var vertices = [
      -1, -1, -1,  1, -1, -1,  1,  1, -1, -1,  1, -1, // Front face
      -1, -1,  1,  1, -1,  1,  1,  1,  1, -1,  1,  1, // Back face
      -1, -1, -1, -1,  1, -1, -1,  1,  1, -1, -1,  1, // Left face
      1, -1, -1,  1,  1, -1,  1,  1,  1,  1, -1,  1, // Right face
      -1, -1, -1,  1, -1, -1,  1, -1,  1, -1, -1,  1, // Bottom face
      -1,  1, -1,  1,  1, -1,  1,  1,  1, -1,  1,  1  // Top face
    ];

    var normals = [
      0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1, // Front face
      0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1, // Back face
      -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, // Left face
      1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0, // Right face
      0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0, // Bottom face
      0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0  // Top face
    ];

    var indicesLines = [
      0, 1,  1, 2,  2, 3,  3, 0, // Front face
      4, 5,  5, 6,  6, 7,  7, 4, // Back face
      0, 4,  1, 5,  2, 6,  3, 7  // Connecting lines
    ];

    var indicesTris = [
      0, 1, 2,  0, 2, 3, // Front face
      4, 5, 6,  4, 6, 7, // Back face
      8, 9, 10,  8, 10, 11, // Left face
      12, 13, 14,  12, 14, 15, // Right face
      16, 17, 18,  16, 18, 19, // Bottom face
      20, 21, 22,  20, 22, 23  // Top face
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
