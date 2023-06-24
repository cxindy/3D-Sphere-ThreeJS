import * as THREE from "three"
import gsap from "gsap"
import './style.css'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

//Scene
const scene = new THREE.Scene()

//Create our geometry : https://threejs.org/docs/#api/en/geometries/IcosahedronGeometry
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: "#00ddff",
  roughness: 0.5,
})
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh)

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//Light
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 10, 10)
scene.add(light)
light.intensity = 1.5

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.z = 20
scene.add(camera)

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
renderer.setPixelRatio(1)

//Constrols
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

//Resize
window.addEventListener("resize", () => {
  //Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //Update Camera
  camera.aspect = sizes.width / sizes.height
  renderer.setSize(sizes.width, sizes.height)
  camera.updateProjectionMatrix()
})

const loop = () => {
  renderer.render(scene, camera)
  controls.update()
  window.requestAnimationFrame(loop)
}
loop()

//Timeline Magic
const tl = gsap.timeline({defaults: {duration: 1}})
tl.fromTo(mesh.scale, {z: 0, x: 0, y: 0}, {z: 1, x: 1, y: 1}) // for the sphere to popup on the screen at the beginning - from 0 to current position
tl.fromTo("nav", {y: "-100%"}, {y: "0%"}) // For the Nvigation to come down from top - going from -100% to current position
tl.fromTo(".title", {opacity: 0}, {opacity:1}) // For the site title to show up - from 0 opacity to currnt opacity

//Mouse Animation Color
let mouseDown = false
let rgb = [];
window.addEventListener("mousedown", () => mouseDown = true)
window.addEventListener("mouseup", () => mouseDown = false)

window.addEventListener('mousemove', (e) => {
  if(mouseDown){
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]
    //Let's animate
    let newColor = new THREE.Color (`rgb(${rgb.join(",")})`)
    new THREE.Color(`rgb(0, 50, 100)`)
    gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g,b: newColor.b})
  }
});