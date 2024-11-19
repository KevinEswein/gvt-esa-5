var app = (function() {
	var gl;
	var prog;
	var models = [];
	var recursionLevel = 3; // Initial recursion level

	var camera = {
		eye: [0, 1, 4],
		center: [0, 0, 0],
		up: [0, 1, 0],
		fovy: 60.0 * Math.PI / 180,
		lrtb: 2.0,
		vMatrix: mat4.create(),
		pMatrix: mat4.create(),
		projectionType: "perspective",
		zAngle: 0,
		distance: 4,
	};

	function start() {
		init();
		render();
	}

	function init() {
		initWebGL();
		initShaderProgram();
		initUniforms();
		initModels();
		initEventHandler();
		initPipline();
	}

	function initWebGL() {
		canvas = document.getElementById('canvas');
		gl = canvas.getContext('experimental-webgl');
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	}

	function initPipline() {
		gl.clearColor(.95, .95, .95, 1);
		gl.frontFace(gl.CCW);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.POLYGON_OFFSET_FILL);
		gl.polygonOffset(0.5, 0);
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		camera.aspect = gl.viewportWidth / gl.viewportHeight;
	}

	function initShaderProgram() {
		var vs = initShader(gl.VERTEX_SHADER, "vertexshader");
		var fs = initShader(gl.FRAGMENT_SHADER, "fragmentshader");
		prog = gl.createProgram();
		gl.attachShader(prog, vs);
		gl.attachShader(prog, fs);
		gl.bindAttribLocation(prog, 0, "aPosition");
		gl.linkProgram(prog);
		gl.useProgram(prog);
	}

	function initShader(shaderType, SourceTagId) {
		var shader = gl.createShader(shaderType);
		var shaderSource = document.getElementById(SourceTagId).text;
		gl.shaderSource(shader, shaderSource);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.log(SourceTagId + ": " + gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}

	function initUniforms() {
		prog.pMatrixUniform = gl.getUniformLocation(prog, "uPMatrix");
		prog.mvMatrixUniform = gl.getUniformLocation(prog, "uMVMatrix");
	}

	function initModels() {
		var fs = "fillwireframe";
		createModel("plane", "wireframe");
		createModel("cube", fs, [-2, 0, 0]);
		createModel("sphere", fs, [2, 0, 0], recursionLevel);
	}

	function createModel(geometryname, fillstyle, translate, recursionLevel) {
		var model = {};
		model.fillstyle = fillstyle;
		model.translate = translate || [0, 0, 0];
		initDataAndBuffers(model, geometryname, recursionLevel);
		model.mvMatrix = mat4.create();
		models.push(model);
	}

	function initDataAndBuffers(model, geometryname, recursionLevel) {
		if (geometryname === "sphere") {
			this[geometryname]['createVertexData'].apply(model, [recursionLevel]);
		} else {
			this[geometryname]['createVertexData'].apply(model);
		}
		model.vboPos = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
		gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW);
		prog.positionAttrib = gl.getAttribLocation(prog, 'aPosition');
		gl.enableVertexAttribArray(prog.positionAttrib);
		model.vboNormal = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
		gl.bufferData(gl.ARRAY_BUFFER, model.normals, gl.STATIC_DRAW);
		prog.normalAttrib = gl.getAttribLocation(prog, 'aNormal');
		gl.enableVertexAttribArray(prog.normalAttrib);
		model.iboLines = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesLines, gl.STATIC_DRAW);
		model.iboLines.numberOfElements = model.indicesLines.length;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		model.iboTris = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesTris, gl.STATIC_DRAW);
		model.iboTris.numberOfElements = model.indicesTris.length;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}

	function initEventHandler() {
		var deltaRotate = Math.PI / 36;
		var deltaTranslate = 0.05;

		window.onkeydown = function(evt) {
			var key = evt.which ? evt.which : evt.keyCode;
			var c = String.fromCharCode(key);
			var sign = evt.shiftKey ? -1 : 1;

			switch (c) {
				case ('O'):
					camera.projectionType = "ortho";
					camera.lrtb = 2;
					break;
				case ('C'):
					camera.zAngle += sign * deltaRotate;
					break;
				case ('F'):
					camera.projectionType = "frustum";
					camera.lrtb = 1.2;
					break;
				case ('P'):
					camera.projectionType = "perspective";
					break;
				case ('H'):
					camera.eye[1] += sign * deltaTranslate;
					break;
				case ('D'):
					camera.distance += sign * deltaTranslate;
					break;
				case ('V'):
					camera.fovy += sign * 5 * Math.PI / 180;
					break;
				case ('B'):
					camera.lrtb += sign * 0.1;
					break;
				case ('N'):
					camera.distance += sign * deltaTranslate;
					break;
				case ('K'):
					changeRecursionDepth(sign);
					break;
			}

			render();
		};
	}

	function changeRecursionDepth(sign) {
		recursionLevel += sign;
		recursionLevel = Math.max(0, recursionLevel); // Ensure non-negative
		initModels();
		render();
	}

	window.changeRecursionDepth = changeRecursionDepth;

	function render() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		setProjection();
		calculateCameraOrbit();
		mat4.lookAt(camera.vMatrix, camera.eye, camera.center, camera.up);

		for (var i = 0; i < models.length; i++) {
			mat4.copy(models[i].mvMatrix, camera.vMatrix);
			mat4.translate(models[i].mvMatrix, models[i].mvMatrix, models[i].translate);
			gl.uniformMatrix4fv(prog.mvMatrixUniform, false, models[i].mvMatrix);
			draw(models[i]);
		}
	}

	function calculateCameraOrbit() {
		var x = 0, z = 2;
		camera.eye[x] = camera.center[x];
		camera.eye[z] = camera.center[z];
		camera.eye[x] += camera.distance * Math.sin(camera.zAngle);
		camera.eye[z] += camera.distance * Math.cos(camera.zAngle);
	}

	function setProjection() {
		switch (camera.projectionType) {
			case ("ortho"):
				var v0 = camera.lrtb;
				mat4.ortho(camera.pMatrix, -v0, v0, -v0, v0, -10, 10);
				break;
			case ("frustum"):
				var v = camera.lrtb;
				mat4.frustum(camera.pMatrix, -v / 2, v / 2, -v / 2, v / 2, 1, 10);
				break;
			case ("perspective"):
				mat4.perspective(camera.pMatrix, camera.fovy, camera.aspect, 1, 10);
				break;
		}
		gl.uniformMatrix4fv(prog.pMatrixUniform, false, camera.pMatrix);
	}

	function draw(model) {
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
		gl.vertexAttribPointer(prog.positionAttrib, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
		gl.vertexAttribPointer(prog.normalAttrib, 3, gl.FLOAT, false, 0, 0);

		var fill = (model.fillstyle.search(/fill/) !== -1);
		if (fill) {
			gl.enableVertexAttribArray(prog.normalAttrib);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
			gl.drawElements(gl.TRIANGLES, model.iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);
		}

		var wireframe = (model.fillstyle.search(/wireframe/) !== -1);
		if (wireframe) {
			gl.disableVertexAttribArray(prog.normalAttrib);
			gl.vertexAttrib3f(prog.normalAttrib, 0, 0, 0);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
			gl.drawElements(gl.LINES, model.iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);
		}
	}

// App interface.
return {
	start: start
}
}());