'use strict';

Physijs.scripts.ammo = '../../js/ammo.js';
Physijs.scripts.worker = '../../js/physijs_worker.js';

// Some shared materials for performance.
var materials = {
	wire: new THREE.MeshBasicMaterial({
					color: 0xff0000,
					wireframe: true 
				})
};

// Share cubes in scene for performance.
var cube_geometry = (function (){
	var boxes = {};
	return function box(x,y,z) {
		var key = [x,y,z].join(',');
		if (!boxes[key])
			boxes[key] = new THREE.CubeGeometry(x,y,z);
		return boxes[key];
	}
})();

function create_floor() {
	var height = 50;
	var width = 1000;
	var mass = 0; // static object
	var geometry = cube_geometry(width,height,width);
	var mat = window.materials.wire;
	var floor = new Physijs.BoxMesh(geometry,mat,mass);
	floor.position.y = -height;
	return floor;
}

function create_boxes() {
	var boxes = [];
	var size = 200;
	var geometry = cube_geometry( size, size, size );
	var pad = 1;
	for (var i = 1; i < 6; i++) {
		var box = new Physijs.BoxMesh(
			geometry,
			window.materials.wire
		);
		box.position.set( 0, i * (size + pad), 0 );
		boxes.push( box );
	}
	return boxes;
}

function create_objects(scene) {
	var bodies = create_boxes(scene);
	bodies.push( create_floor(scene) );
	for(var i=0; i<bodies.length; i++)
		scene.add(bodies[i]);
	return bodies;
}

function create_camera() {
	var fovy = 75;
	var near = 1;
	var far  = 10000;
	var aspect = window.innerWidth / window.innerHeight;
	var camera = new THREE.PerspectiveCamera(
		fovy, aspect, near, far);
	camera.position.set(0,1000,2000);
	camera.lookAt(new THREE.Vector3(0,0,0));
	return camera;
}

function setup_renderer(renderer) {
	var renderer = new THREE.CanvasRenderer();
	//var renderer = new THREE.WebGLRenderer();
	var height = window.innerHeight;
	renderer.setSize(window.innerWidth, height);
	document.body.appendChild(renderer.domElement);
	return renderer;
}

function create_scene() {
	var scene = new Physijs.Scene();
	scene.setGravity(new THREE.Vector3(0,-10000,0));
	return scene;
}

function init() {
	return {
		camera:      create_camera(),
		scene:       create_scene(),
		renderer:    setup_renderer(),
	};
}

$(document).ready(function () {
	var state = init();
	var bodies = create_objects(state.scene);
	var main_loop = function () {
		requestAnimationFrame(main_loop);
		state.scene.simulate();
		state.renderer.render( state.scene, state.camera );
	}
	main_loop();
});
