defineSuite([
        'Scene/PointCloudPostProcessor',
        'Core/Cartesian3',
        'Core/Color',
        'Core/defined',
        'Core/HeadingPitchRange',
        'Core/HeadingPitchRoll',
        'Core/Math',
        'Core/Transforms',
        'Scene/PerspectiveFrustum',
        'Scene/PointCloud3DTileContent',
        'Specs/Cesium3DTilesTester',
        'Specs/createScene'
    ], function(
        PointCloudPostProcessor,
        Cartesian3,
        Color,
        defined,
        HeadingPitchRange,
        HeadingPitchRoll,
        CesiumMath,
        Transforms,
        PerspectiveFrustum,
        PointCloud3DTileContent,
        Cesium3DTilesTester,
        createScene) {
    'use strict';

    var scene;
    var centerLongitude = -1.31968;
    var centerLatitude = 0.698874;

    var pointCloudRGBUrl = './Data/Cesium3DTiles/PointCloud/PointCloudRGB';

    function setCamera(longitude, latitude) {
        // Point the camera to the center of the tile
        var center = Cartesian3.fromRadians(longitude, latitude, 5.0);
        scene.camera.lookAt(center, new HeadingPitchRange(0.0, -1.57, 5.0));
    }

    beforeAll(function() {
        scene = createScene();
        scene.frameState.passes.render = true;
    });

    afterAll(function() {
        scene.destroyForSpecs();
    });

    beforeEach(function() {
        var camera = scene.camera;
        camera.frustum = new PerspectiveFrustum();
        camera.frustum.aspectRatio = scene.drawingBufferWidth / scene.drawingBufferHeight;
        camera.frustum.fov = CesiumMath.toRadians(60.0);

        setCamera(centerLongitude, centerLatitude);
    });

    afterEach(function() {
        scene.primitives.removeAll();
    });

    it('enabling the point cloud post processor increases the number of draw calls', function() {
        return Cesium3DTilesTester.loadTileset(scene, pointCloudRGBUrl).then(function(tileset) {
            if (!tileset.pointCloudPostProcessor.processingSupported()) {
                return;
            }

            scene.renderForSpecs();
            var originalLength = scene.frameState.commandList.length;

            tileset.pointCloudPostProcessorOptions.enabled = true;
            scene.renderForSpecs();
            var newLength = scene.frameState.commandList.length;
            expect(newLength).toBeGreaterThan(originalLength);
        });
    });
}, 'WebGL');
