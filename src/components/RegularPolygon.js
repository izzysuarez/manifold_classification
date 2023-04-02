import { useEffect , useState, useRef } from 'react'
import { render } from '@testing-library/react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';



export default function PolygonViz() {
    const threeJS = useRef();
    const parent = useRef();

    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xf0f0f0 );

        const camera = new THREE.PerspectiveCamera( 
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000 );
        camera.position.z = 50;
        const canvas = threeJS.current;

        const planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );
        planeGeometry.rotateX( - Math.PI / 2 );
        const planeMaterial = new THREE.ShadowMaterial( { color: 0x000000, opacity: 0.2 } );

        const plane = new THREE.Mesh( planeGeometry, planeMaterial );
        plane.position.y = - 200;
        plane.receiveShadow = true;
        scene.add( plane );

        const helper = new THREE.GridHelper( 2000, 100 );
        helper.position.y = - 199;
        helper.material.opacity = 0.25;
        helper.material.transparent = true;
        scene.add( helper );

        const stats = new Stats();
        parent.current.appendChild(stats.dom);

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        });
        renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio( window.devicePixelRatio );

        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        // ambientLight.castShadow = true;
        // scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.castShadow = true;
        spotLight.position.set(0,50,50);
        scene.add(spotLight);
            

        const render = () => {
            renderer.render(scene, camera);
            stats.update();

            // Controls
            const controls = new OrbitControls( camera, renderer.domElement );
            controls.damping = 0.2;
            controls.addEventListener( 'change', render );

            let transformControl = new TransformControls( camera, renderer.domElement );
            transformControl.addEventListener( 'change', render );
            transformControl.addEventListener( 'dragging-changed', function ( event ) {

                controls.enabled = ! event.value;

            } );
            scene.add( transformControl );
            // required if controls.enableDamping or controls.autoRotate are set to true
	        controls.update();
            setRerender(!rerender);
        }

        // controls.addEventListener( 'change', render, false );
        const boxGeometry = new THREE.BoxGeometry(20,20,20);
        const boxMaterial = new THREE.MeshNormalMaterial();
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        scene.add(boxMesh);

        render();

        

    }, [])

    
    return (
      <div ref={parent}>
        <canvas ref={threeJS} />
        <br></br>
        <button id="screenshot" type="button" onClick={console.log("Take a screenshot")}>Screenshot</button>
      </div>
    );
  }