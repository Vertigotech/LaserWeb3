// LaserWeb scope
var lw = lw || {};

(function () {
    'use strict';

    // Viewer scope
    lw.viewer = {
        $render  : null,
        size     : null,
        scene    : null,
        camera   : null,
        renderer : null,
        controls : null,
        raycaster: null,
        cursor   : null
    };

    // -------------------------------------------------------------------------

    // Rendering mode detection
    var canvasRenderer = !!window.CanvasRenderingContext2D;
    var webglRenderer  = (function() {
        try {
            return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
        }
        catch (e) {
            return false;
        }
    })();

    if (webglRenderer) {
        lw.log.print('<strong>WebGL Support found!</strong> Laserweb will work optimally on this device!', 'success', 'viewer');
    }
    else {
        var message = [
            '<strong>No WebGL Support found!</strong> Laserweb may not work optimally on this device!<br />',
            '<u>Try another device with WebGL supportor or try the following:</u><br />',
            '<ul>',
            '<li>In the Chrome address bar, type: <b>chrome://flags</b> [Enter]</li>',
            '<li>Enable the <b>Override software Rendering</b></li>',
            '<li>Restart Chrome and try again</li>',
            '</ul>',
            'Sorry! :( <hr />'
        ];

        lw.log.print(message.join('\n'), 'error', 'viewer');
    };

    // -------------------------------------------------------------------------

    // Init the viewer
    lw.viewer.init = function() {
        // Get render area element
        this.$render = $('#renderArea');

        // Create size object
        this.size = { width: null, height: null, ratio: null };

        // Create mouse (vector )object
        this.mouse = new THREE.Vector3();

        // Create raycaster object
        this.raycaster = new THREE.Raycaster();

        // Create the scene object
        this.scene = new THREE.Scene();

        // Create the camera object
        this.camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);

        // Set camera initial position
        this.camera.position.z = 295;

        // Create renderer object
        this.renderer = webglRenderer ? new THREE.WebGLRenderer({
            autoClearColor: true,
            antialias     : false
        }) : new THREE.CanvasRenderer();

        // Initialize the renderer
        this.renderer.setClearColor(0xffffff, 1);
        this.renderer.clear();

        // Add viewer main controls
        this.viewControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.viewControls.target.set(0, 0, 0); // view direction perpendicular to XY-plane

        var cncMode = $('#cncMode').val() !== 'Disable';

        this.viewControls.enableRotate = cncMode;
        this.viewControls.enableZoom   = true;
        this.viewControls.enableKeys   = false;

        // Cursor
        this.cursor = new lw.viewer.Cursor();

        // Lights
        this.lights = new lw.viewer.Lights();

        // Set initial size
        this.resize();

        // Add the renderer DOM element to target area
        this.$render.html(this.renderer.domElement);

        // Events handlers -----------------------------------------------------

        // Enable/Disable 3D view
        $('#3dview').prop('checked', cncMode);
        $('#3dview').change(function() {
            lw.viewer.viewControls.enableRotate = $(this).is(":checked");
            resetView();
        });

        // On window resize
        $(window).on('resize'   , onResize)
                 .on('mousedown', onMouseDown)
                 .on('mousemove', onMouseMove);
    };

    // -------------------------------------------------------------------------

    // Resize the viewer to match is container size
    lw.viewer.resize = function() {
        this.size.width  = this.$render.width();
        this.size.height = this.$render.height() - 15;
        this.size.ratio  = this.size.width / this.size.height;

        this.renderer.setSize(this.size.width, this.size.height);
        this.camera.aspect = this.size.ratio;
        this.camera.updateProjectionMatrix();
    };

    function onResize(event) {
        lw.viewer.resize();
    };

    // -------------------------------------------------------------------------

    // Call the provided callback on intersected objects at current mouse position
    lw.viewer.intersectObjects = function(callback) {
        // Set the ray from the camera
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Get all intersected objects
        var intersects = this.raycaster.intersectObjects(this.scene.children, true);

        for (var i = 0, il = intersects.length; i < il; i++) {
            callback.call(this, intersects[i]);
        }
    };

    // Update the mouse vector position
    lw.viewer.onMouseEvent = function(event) {
        // Update mouse position
        var offset   = this.$render.offset();
        this.mouse.x =  ((event.clientX - offset.left) / this.size.width)  * 2 - 1;
        this.mouse.y = -((event.clientY - offset.top)  / this.size.height) * 2 + 1;

        // Check if intersected objects
        // var mouseDown   = event.type === 'mousedown';
        // var coreObjects = ['cursor', 'bullseye', 'rastermesh', 'XY', 'GridHelper'];
        // var objectName;

        this.intersectObjects(function(data) {
            // // If not an core objects
            // if (coreObjects.indexOf(data.object.parent.name) === -1 && coreObjects.indexOf(data.object.name) === -1) {
            //     // Log event on "click"
            //     if (mouseDown) {
            //         objectName = [data.object.parent.name, data.object.name].join('.');
            //         lw.log.print('Clicked on : ' + objectName, 'success', "viewer")
            //         console.log('Clicked on : ' + objectName);
            //         console.log(data.object);
            //     }
            //
            //     // Attach bounding box
            //     attachBB(data.object);
            // }

            // Move cursor at intersection position
            this.cursor.moveTo(data.point);
        });
    };

    function onMouseDown(event) {
        lw.viewer.onMouseEvent(event);
    }

    function onMouseMove(event) {
        lw.viewer.onMouseEvent(event);
    }

// End viewer scope
})();
