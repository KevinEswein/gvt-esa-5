var sphere = (function() {
  function createVertexData(recursionLevel) {
    // Vertices of an icosahedron
    var t = (1.0 + Math.sqrt(5.0)) / 2.0;
    var vertices = [
      -1,  t,  0,  1,  t,  0, -1, -t,  0,  1, -t,  0,
      0, -1,  t,  0,  1,  t,  0, -1, -t,  0,  1, -t,
      t,  0, -1,  t,  0,  1, -t,  0, -1, -t,  0,  1
    ];

    // Faces of the icosahedron
    var indices = [
      0, 11, 5,    0, 5, 1,    0, 1, 7,    0, 7, 10,    0, 10, 11,
      1, 5, 9,     5, 11, 4,   11, 10, 2,  10, 7, 6,    7, 1, 8,
      3, 9, 4,     3, 4, 2,    3, 2, 6,    3, 6, 8,     3, 8, 9,
      4, 9, 5,     2, 4, 11,   6, 2, 10,   8, 6, 7,     9, 8, 1
    ];

    function midpoint(a, b) {
      return [
        (a[0] + b[0]) / 2,
        (a[1] + b[1]) / 2,
        (a[2] + b[2]) / 2
      ];
    }

    function normalize(v) {
      var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      return [v[0] / length, v[1] / length, v[2] / length];
    }

    function subdivide(vertices, indices, depth) {
      if (depth === 0) return;

      var newIndices = [];
      for (var i = 0; i < indices.length; i += 3) {
        var v1 = vertices.slice(indices[i] * 3, indices[i] * 3 + 3);
        var v2 = vertices.slice(indices[i + 1] * 3, indices[i + 1] * 3 + 3);
        var v3 = vertices.slice(indices[i + 2] * 3, indices[i + 2] * 3 + 3);

        var a = normalize(midpoint(v1, v2));
        var b = normalize(midpoint(v2, v3));
        var c = normalize(midpoint(v3, v1));

        var aIndex = vertices.length / 3;
        vertices.push(a[0], a[1], a[2]);
        var bIndex = vertices.length / 3;
        vertices.push(b[0], b[1], b[2]);
        var cIndex = vertices.length / 3;
        vertices.push(c[0], c[1], c[2]);

        newIndices.push(indices[i], aIndex, cIndex);
        newIndices.push(indices[i + 1], bIndex, aIndex);
        newIndices.push(indices[i + 2], cIndex, bIndex);
        newIndices.push(aIndex, bIndex, cIndex);
      }

      subdivide(vertices, newIndices, depth - 1);
      indices.length = 0;
      for (var i = 0; i < newIndices.length; i++) {
        indices.push(newIndices[i]);
      }
    }

    var verticesArray = [];
    for (var i = 0; i < vertices.length; i++) {
      verticesArray.push(vertices[i]);
    }

    var indicesArray = [];
    for (var i = 0; i < indices.length; i++) {
      indicesArray.push(indices[i]);
    }

    subdivide(verticesArray, indicesArray, recursionLevel);

    var normalsArray = [];
    for (var i = 0; i < verticesArray.length; i += 3) {
      var normal = normalize([verticesArray[i], verticesArray[i + 1], verticesArray[i + 2]]);
      normalsArray.push(normal[0], normal[1], normal[2]);
    }

    this.vertices = new Float32Array(verticesArray);
    this.normals = new Float32Array(normalsArray);
    this.indicesLines = new Uint16Array(indicesArray);
    this.indicesTris = new Uint16Array(indicesArray);
  }

  return {
    createVertexData: createVertexData
  }
})();
