// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create lightsaber geometry
const lightsaberGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 32);
const handleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32);
const handleDetailGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);

// Set up lightsaber material with initial color (green)
const lightsaberMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const handleMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

// Create lightsaber mesh
const lightsaber = new THREE.Mesh(lightsaberGeometry, lightsaberMaterial);
const handle = new THREE.Mesh(handleGeometry, handleMaterial);
const handleDetail1 = new THREE.Mesh(handleDetailGeometry, handleMaterial);
const handleDetail2 = new THREE.Mesh(handleDetailGeometry, handleMaterial);

// Positioning the handle and details
handle.position.y = -2;
handleDetail1.position.y = -1.75;
handleDetail1.position.x = 0.15;
handleDetail2.position.y = -1.75;
handleDetail2.position.x = -0.15;

// Grouping the lightsaber parts
const lightsaberGroup = new THREE.Group();
lightsaberGroup.add(lightsaber);
lightsaberGroup.add(handle);
lightsaberGroup.add(handleDetail1);
lightsaberGroup.add(handleDetail2);

scene.add(lightsaberGroup);

// Add event listener for mousemove event on the renderer
renderer.domElement.addEventListener('mousemove', onMouseMove);

// Handle mousemove event
function onMouseMove(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(lightsaberGroup.children, true);
    if (intersects.length > 0) {
        // Change cursor to pointer when hovering over the lightsaber
        renderer.domElement.style.cursor = 'pointer';
        // Zoom lightsaber on hover
        lightsaberGroup.scale.set(1.1, 1.1, 1.1); // Adjust the scale as needed
    } else {
        // Change cursor to default when not hovering over the lightsaber
        renderer.domElement.style.cursor = 'default';
        // Reset lightsaber scale
        lightsaberGroup.scale.set(1, 1, 1);
    }
}

// Add event listener for click event on the renderer
renderer.domElement.addEventListener('click', onClick);

// Handle click event
function onClick(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(lightsaberGroup.children, true);
    if (intersects.length > 0) {
        // Change lightsaber color to blue on click
        lightsaber.material.color.set(0x00ff00);
        // Fetch Star Wars API data and display in alert
        fetch('https://swapi.dev/api/people/1/')
            .then(response => response.json())
            .then(data => {
                alert(`Name: ${data.name}\nHeight: ${data.height}\nMass: ${data.mass}\nHair Color: ${data.hair_color}\nEye Color: ${data.eye_color}`);
          // Restore lightsaber color to green after closing the alert
          lightsaber.material.color.set(0x808080);
            })
            .catch(error => console.error('Error fetching data:', error));
    }
}

// Set camera position
camera.position.z = 5;

// Render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();