var sphere = (function() {
  function createVertexData(recursionLevel) {
    var vertices = [];
    var indices = [];

    function addVertex(x, y, z) {
      var length = Math.sqrt(x*x + y*y + z*z);
      vertices.push(x / length, y / length, z / length);
      return (vertices.length / 3) - 1;
    }

    function addFace(a, b, c) {
      indices.push(a, b, c);
    }

    function midpoint(v1, v2) {
      return [
        (vertices[v1*3] + vertices[v2*3]) / 2,
        (vertices[v1*3+1] + vertices[v2*3+1]) / 2,
        (vertices[v1*3+2] + vertices[v2*3+2]) / 2
      ];
    }

    function normalize(v) {
      var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      return [v[0] / length, v[1] / length, v[2] / length];
    }

    function subdivide(v1, v2, v3, depth) {
      if (depth === 0) {
        addFace(v1, v2, v3);
        return;
      }

      var a = addVertex(...normalize(midpoint(v1, v2)));
      var b = addVertex(...normalize(midpoint(v2, v3)));
      var c = addVertex(...normalize(midpoint(v3, v1)));

      subdivide(v1, a, c, depth - 1);
      subdivide(v2, b, a, depth - 1);
      subdivide(v3, c, b, depth - 1);
      subdivide(a, b, c, depth - 1);
    }

    // Initial vertices of an octahedron
    var v0 = addVertex(1, 0, 0);
    var v1 = addVertex(-1, 0, 0);
    var v2 = addVertex(0, 1, 0);
    var v3 = addVertex(0, -1, 0);
    var v4 = addVertex(0, 0, 1);
    var v5 = addVertex(0, 0, -1);

    // Initial faces of an octahedron
    subdivide(v0, v4, v2, recursionLevel);
    subdivide(v1, v2, v4, recursionLevel);
    subdivide(v0, v3, v4, recursionLevel);
    subdivide(v1, v4, v3, recursionLevel);
    subdivide(v0, v2, v5, recursionLevel);
    subdivide(v1, v5, v2, recursionLevel);
    subdivide(v0, v5, v3, recursionLevel);
    subdivide(v1, v3, v5, recursionLevel);

    var normalsArray = [];
    for (var i = 0; i < vertices.length; i += 3) {
      var normal = normalize([vertices[i], vertices[i + 1], vertices[i + 2]]);
      normalsArray.push(normal[0], normal[1], normal[2]);
    }

    this.vertices = new Float32Array(vertices);
    this.normals = new Float32Array(normalsArray);
    this.indicesLines = new Uint16Array(indices);
    this.indicesTris = new Uint16Array(indices);
  }

  return {
    createVertexData: createVertexData
  }
})();
