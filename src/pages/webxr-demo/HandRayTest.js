/*
 * @Author: Peng Xiang (Email:px.i@foxmail.com QQ:245803627)
 * @Date: 2023-03-31 13:18:15
 * @LastEditTime: 2023-04-25 13:48:08
 * @LastEditors: Peng Xiang
 * @Description: 
 * @FilePath: \src\pages\webxr-demo\HandRayTest.js
 * 
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { publicPath } from './pageConfig';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
// import { Interaction, ModelTimeAnimationControls, Interactive, eventBus, VRButton } from '@packages';
// import { v4 as uuidv4 } from 'uuid';
// import HandRayController from './HandRayController';
import moment from 'moment';


export default () => {
    let container;
    let camera, scene, renderer;


    let controls, group;

    let handRayController, pmremGenerator, resultTxtMesh,
        renderMode = '3d', interactive, actionObjList = [],
        mixer, csqAnAction;

    const clock = new THREE.Clock();

    init();
    animate();

    function init() {

        container = document.createElement('div');
        document.body.appendChild(container);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x808080);

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
        camera.position.set(0, 1.6, 3);

        controls = new OrbitControls(camera, container);
        controls.target.set(0, 1.6, 0);
        controls.update();

        const room = new THREE.LineSegments(
            new BoxLineGeometry(6, 6, 6, 10, 10, 10),
            new THREE.LineBasicMaterial({ color: 0x808080 })
        );
        room.geometry.translate(0, 3, 0);
        room.visible = false;
        scene.add(room);

        // const floorGeometry = new THREE.PlaneGeometry(4, 4);
        // const floorMaterial = new THREE.MeshStandardMaterial({
        //     color: 0xeeeeee,
        //     roughness: 1.0,
        //     metalness: 0.0
        // });
        // const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        // floor.rotation.x = - Math.PI / 2;
        // floor.receiveShadow = true;
        // scene.add(floor);

        scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 6, 0);
        light.castShadow = true;
        light.shadow.camera.top = 2;
        light.shadow.camera.bottom = - 2;
        light.shadow.camera.right = 2;
        light.shadow.camera.left = - 2;
        light.shadow.mapSize.set(4096, 4096);
        scene.add(light);

        group = new THREE.Group();
        scene.add(group);

        //

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        renderer.xr.enabled = true;
        container.appendChild(renderer.domElement);

        addSkyBox();
        add5TypeMesh();
        addText(group);

        addRoomModel();
        // addAnModel();
        pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader(); //not must
        // scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
        loadEnvironment(`${publicPath}/assets/HDRI_39.hdr`).then((texture) => {
            // scene.background = texture;
            scene.environment = texture;
        });



        resultTxtMesh = makeButtonMesh(1, 0.1, 0.01, 0x000000);
        resultTxtMesh.position.set(1.3, 0.6, -0.5);
        scene.add(resultTxtMesh);
        addResultText(resultTxtMesh, '未检测到');

        // const vrButton = new VRButton(renderer, document.body);
        // // document.body.appendChild(vrButton);
        // vrButton.addEventListener('vrmodechange', (event) => {
        //     console.log(event.data);
        //     renderMode = event.data;
        //     switch (renderMode) {
        //         case '3d':
        //             document.addEventListener('pointerdown', handleInteractive);
        //             break;
        //         case 'vr':
        //             document.removeEventListener('pointerdown', handleInteractive);
        //             break;
        //     }
        // })


        // handRayController = new HandRayController(scene, renderer, group, actionObjList);
        // handRayController.addEventListener("ray_intersect_object", (event) => {
        //     console.log(event);
        //     removeChildren(resultTxtMesh);
        //     if (event.status) {
        //         addResultText(resultTxtMesh, '检测到' + event.data);
        //         if (event.data === 'playButton001') {
        //             playMAni();
        //         }
        //     } else {
        //         addResultText(resultTxtMesh, '未检测到' + event.data + moment().format('YYYYMMDD-HHmmss'));
        //     }
        // })


        // interactive = new Interactive(camera, actionObjList);
        // document.addEventListener('pointerdown', handleInteractive);


        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        renderer.setAnimationLoop(render);
    }

    function render() {
        // cleanIntersected();

        // intersectObjects(controller1);
        // intersectObjects(controller2);
        // if (renderMode === 'vr') {
        //     handRayController.update();
        // }

        const delta = clock.getDelta();
        if (mixer) { mixer.update(delta); }

        renderer.render(scene, camera);
    }

    // function handleInteractive(event) {
    //     // if (renderMode !== '3d') { return; }
    //     const res = interactive.intersectTest(event);
    //     console.log(res);
    //     if (res.status === true) {
    //         removeChildren(resultTxtMesh);
    //         addResultText(resultTxtMesh, '检测到' + res.target.name);
    //         if (res.target.name === 'playButton001') {
    //             playMAni();
    //         }
    //     } else {
    //         removeChildren(resultTxtMesh);
    //     }
    // }

    function add5TypeMesh() {
        const geometries = [
            new THREE.BoxGeometry(0.2, 0.2, 0.2),
            new THREE.ConeGeometry(0.2, 0.2, 64),
            new THREE.CylinderGeometry(0.2, 0.2, 0.2, 64),
            new THREE.IcosahedronGeometry(0.2, 8),
            new THREE.TorusGeometry(0.2, 0.04, 64, 32)
        ];

        for (let i = 0; i < 10; i++) {

            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshStandardMaterial({
                color: Math.random() * 0xffffff,
                roughness: 0.7,
                metalness: 0.0
            });

            const object = new THREE.Mesh(geometry, material);

            object.position.x = Math.random() * 4 - 2;
            object.position.y = Math.random() * 2;
            object.position.z = Math.random() * 4 - 2;

            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;

            object.scale.setScalar(Math.random() + 0.5);

            object.castShadow = true;
            object.receiveShadow = true;
            object.name = 'object' + i.toString();

            group.add(object);
            actionObjList.push(object);
        }
    }

    function removeChildren(mesh) {
        while (mesh.children.length) {
            mesh.remove(mesh.children[0]);
        }
    }
    function addResultText(group, textContent) {
        textContent = textContent || '未检测到';

        const playButtonText = createText(textContent, 0.06);
        group.add(playButtonText);
        playButtonText.position.set(0, 0, 0.0051);


        const playButtonText2 = createText(textContent, 0.06);;
        group.add(playButtonText2);
        playButtonText2.position.set(0, 0, -0.0051);
        playButtonText2.scale.set(-1, 1, 1); // 反转模型
    }
    function addText(group) {
        const menuGeometry = new THREE.PlaneGeometry(0.24, 0.5);
        const menuMaterial = new THREE.MeshStandardMaterial({
            opacity: 0,
            transparent: true,
        });
        const menuMesh = new THREE.Mesh(menuGeometry, menuMaterial);
        menuMesh.position.set(1.3, 1.1, -0.5);
        // menuMesh.rotation.y = - Math.PI / 12;
        group.add(menuMesh);

        const playButton = makeButtonMesh(1.5, 0.1, 0.01, 0x000000);
        const playButtonText = createText('播放差速器动画' + moment().format('YYYYMMDD-HHmmss'), 0.06);
        playButton.add(playButtonText);
        playButtonText.position.set(0, 0, 0.0051);
        playButton.position.set(0, - 0.06, 0);

        const playButtonText2 = createText('播放差速器动画' + moment().format('YYYYMMDD-HHmmss'), 0.06);;
        playButton.add(playButtonText2);
        playButtonText2.position.set(0, 0, -0.0051);
        playButtonText2.scale.set(-1, 1, 1); // 反转模型

        menuMesh.add(playButton);

        // menuMesh.scale.set(1, -1, 1); // 反转模型
        // menuMesh.rotation.y = THREE.MathUtils.degToRad(180);  // 旋转模型180度
        //添加鼠标事件
        playButton.name = 'playButton001';
        menuMesh.name = 'menuMesh001';
        playButtonText.name = 'playButtonText1';
        playButtonText2.name = 'playButtonText2';

        actionObjList.push(menuMesh);

        return menuMesh;
    }
    function makeButtonMesh(x, y, z, color) {

        const geometry = new THREE.BoxGeometry(x, y, z);
        const material = new THREE.MeshStandardMaterial({ color: color, }); // transparent: true, opacity: 0
        const buttonMesh = new THREE.Mesh(geometry, material);
        buttonMesh.castShadow = true;
        buttonMesh.receiveShadow = true;
        return buttonMesh;

    }

    function loadEnvironment(filename) {
        return new Promise((resolve, reject) => {
            new RGBELoader()
                // .setPath(`${publicPath}/assets/`)
                .load(filename, function (hdrEquirect) {

                    const hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(hdrEquirect);
                    hdrEquirect.dispose();

                    resolve(hdrCubeRenderTarget.texture);
                });
        })
    }

    async function addRoomModel() {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(`${publicPath}/static/js/libs/draco/`);
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        loader.setPath(`${publicPath}/assets/`);
        // loader.load('kira.glb', (gltf) => {
        //     const obj = gltf.scene
        //     scene.add(obj);
        //     // obj.position.set(0.2, 0, 0);
        //     // obj.rotation.y = THREE.MathUtils.degToRad(180);  // 旋转模型180度
        // })

        const gltf = await loader.loadAsync('kira.glb');
        const obj = gltf.scene;
        obj.receiveShadow = true;
        scene.add(obj);
        obj.traverse((node) => {
            if (!node.isMesh) return;
            node.receiveShadow = true;
        })

        // const gltf2 = await loader.loadAsync('default.glb');

        loader.load('default.glb', (gltf) => {
            const csqObj = gltf.scene;
            csqObj.scale.set(3, 3, 3);
            csqObj.position.set(0, 0.7, 0);
            scene.add(csqObj);

            csqObj.castShadow = true;
            csqObj.receiveShadow = true;
            csqObj.traverse((node) => {
                if (!node.isMesh) return;
                node.castShadow = true;
                node.receiveShadow = true;
            })


            mixer = new THREE.AnimationMixer(csqObj);
            csqAnAction = mixer.clipAction(gltf.animations[0]);
            csqAnAction.loop = THREE.LoopOnce;
            csqAnAction.clampWhenFinished = true;
            // csqAnAction.play();

            // csqAnimContr = new ModelTimeAnimationControls(gltf.scene, gltf.animations);
        }, (xhr) => {
            const progressNum = (xhr.loaded / xhr.total * 100);
            console.log('模型加载进度：', xhr.loaded, xhr.total, progressNum);
        }, (e) => {
            console.error(e);
        })
    }

    let csqAnimContr;
    // function addAnModel(loader) {
    //     loader.load('default.glb', (gltf) => {
    //         const csqObj = gltf.scene;
    //         csqObj.scale.set(3, 3, 3);
    //         csqObj.position.set(0, 0.7, 0);
    //         scene.add(csqObj);

    //         csqAnimContr = new ModelTimeAnimationControls(gltf.scene, gltf.animations);
    //     })
    // }
    function playMAni() {
        console.log('playMAni')
        if (!csqAnAction) { return; }
        csqAnAction.reset();
        csqAnAction.play();

        // if (!csqAnimContr) { return; }
        // csqAnimContr.gotoAndStop(0);
        // csqAnimContr.reset();
        // csqAnimContr.play();
    }

    function addSkyBox() {
        const loader = new THREE.CubeTextureLoader();
        loader.setPath(`${publicPath}/assets/skybox/Park2/`);

        const textureCube = loader.load([
            'posx.jpg', 'negx.jpg',
            'posy.jpg', 'negy.jpg',
            'posz.jpg', 'negz.jpg'
        ]);

        scene.background = textureCube;
    }

}


