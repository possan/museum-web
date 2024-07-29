import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
// import { RenderTransitionPass } from "three/addons/postprocessing/RenderTransitionPass.js";
import { createRoom } from "./roomLoader.js";
import { RoomWrapper } from "./roomWrapper.js";

const DEFAULT_ROOM_ID = "0";
const DEFAULT_PAINTING_ID = "";
const DEFAULT_ENTER_FROM = "south";

// state

let currentRoomId = "";
let currentEnterFrom = "";
let currentPaintingId = "";

let loader;
let renderer;
let scene;
let dummyObj;
let composer;
let lateMouseDelta;
let mousePosition;
let mouseResetPosition;
let currentRoom;
let renderPass;
let ssaoPass;

async function parseLocation() {
  const u = new URL("http://dummy/?" + (location.hash?.substring(1) ?? ""));
  console.log("u", u, u.searchParams);

  currentRoomId = u.searchParams.get("r") || DEFAULT_ROOM_ID;
  currentPaintingId = u.searchParams.get("p") || DEFAULT_PAINTING_ID;
  currentEnterFrom = u.searchParams.get("e") || DEFAULT_ENTER_FROM;

  console.log("current room id", currentRoomId);
  console.log("current enter from", currentEnterFrom);
  console.log("current painting id", currentPaintingId);
}

async function updateLocation() {
  console.log("update location");

  console.log("current room id", currentRoomId);
  console.log("current enter from", currentEnterFrom);
  console.log("current painting id", currentPaintingId);

  const queryString  = `#r=${currentRoomId}&p=${currentPaintingId}&e=${currentEnterFrom}`
  console.log("new query string", queryString);

  history.pushState(undefined, undefined, queryString);
}

function hideLoadingScreen() {
  document.getElementById("loading").classList.add("hidden");
}

function onWindowResize() {
  if (currentRoom) {
    currentRoom.resize(window.innerWidth, window.innerHeight);
  }
  // if (currentRoom) {
  //   currentRoom.resize(window.innerWidth, window.innerHeight);
  // }

  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove(event) {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (mouseResetPosition === undefined) {
    mouseResetPosition = new THREE.Vector2(x, y);
  }

  mousePosition.x = x;
  mousePosition.y = y;
}

function resetPointerDelta() {
  mouseResetPosition.x = mousePosition.x;
  mouseResetPosition.y = mousePosition.y;

  lateMouseDelta.x = 0;
  lateMouseDelta.y = 0;
}

function onPointerClick(event) {
  console.log("click", event);

  let link = undefined;
  if (currentRoom) {
    link = currentRoom.linkAtPointer(mousePosition);
    // } else if (currentRoom) {
    //   link = currentRoom.linkAtPointer(mousePosition);
  }

  console.log("clicked at link", link);

  if (link) {
    if (link.type === "painting") {
      resetPointerDelta();

      if (currentRoom) {
        currentRoom.zoomPainting(link.paintingId);
        // } else if (currentRoom) {
        //   currentRoom.zoomPainting(link.paintingId);
      }
    } else if (link.type === "exit") {
      resetPointerDelta();

      if (currentRoom) {
        currentRoom.exitThroughDoor(link.doorId);
        // } else if (currentRoom) {
        //   currentRoom.exitThroughDoor(link.doorId);
      }
    }
  }
}

async function createEmptyWorld() {
  loader = new THREE.TextureLoader();

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.005);

  mousePosition = new THREE.Vector2();
  lateMouseDelta = new THREE.Vector2();
  mouseResetPosition = undefined;

  const dummyCamera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  document.getElementById("view").appendChild(renderer.domElement);

  composer = new EffectComposer(renderer);

  renderPass = new RenderPass(scene, undefined);
  composer.addPass(renderPass);

  ssaoPass = new SSAOPass(
    scene,
    dummyCamera,
    window.innerWidth,
    window.innerHeight
  );
  composer.addPass(ssaoPass);

  // renderTransitionPass = new RenderTransitionPass(
  //   scene,
  //   playerCamera,
  //   undefined,
  //   undefined
  // );
  // // renderTransitionPass.setTexture(textures[0]);
  // composer.addPass(renderTransitionPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  // cameracontrols = new OrbitControls(camera, renderer.domElement);
  // cameracontrols.target.set(0, 1, 0);
  //   cameracontrols.keys = {
  //     LEFT: "ArrowLeft", //left arrow
  //     UP: "ArrowUp", // up arrow
  //     RIGHT: "ArrowRight", // right arrow
  //     BOTTOM: "ArrowDown", // down arrow
  //   };
  // cameracontrols.update();
  // cameracontrols.listenToKeyEvents(window);

  // const ambientLight = new THREE.AmbientLight(0xdddddd);
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const cordGeometry = new THREE.TorusGeometry(2.5, 1.0, 16, 48);
  const cordMaterial = new THREE.MeshStandardMaterial({
    color: 0xff33aa,
    roughness: 0.2,
  });
  dummyObj = new THREE.Mesh(cordGeometry, cordMaterial);
  dummyObj.position.y = 0;
  dummyObj.castShadow = true;
  dummyObj.receiveShadow = true;
  scene.add(dummyObj);

  //   const dirLight = new THREE.DirectionalLight(0xffffff, 3);
  //   dirLight.position.set(0, 2, 0);
  //   dirLight.castShadow = true;
  //   dirLight.shadow.camera.near = 0.1;
  //   dirLight.shadow.camera.far = 500;
  //   dirLight.shadow.camera.right = 17;
  //   dirLight.shadow.camera.left = -17;
  //   dirLight.shadow.camera.top = 17;
  //   dirLight.shadow.camera.bottom = -17;
  //   dirLight.shadow.mapSize.width = 2048;
  //   dirLight.shadow.mapSize.height = 2048;
  //   dirLight.shadow.radius = 4;
  //   dirLight.shadow.bias = -0.0005;

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("click", onPointerClick);

  // const dummyGeom3 = new THREE.BoxGeometry(1, 1, 1);
  // const dummyMat3 = new THREE.MeshStandardMaterial({
  //   color: 0x00ffff,
  //   roughness: 0.8,
  // });
  // paintingTarget = new THREE.Mesh(dummyGeom3, dummyMat3);
  // paintingTarget.castShadow = true;
  // paintingTarget.receiveShadow = true;
  // paintingTarget.position.x = -4;
  // scene.add(paintingTarget);
}

function animate() {
  // requestAnimationFrame(animate);

  const deltaTime = 16;
  setTimeout(animate, deltaTime);

  const mult = deltaTime / 1000.0;

  if (mouseResetPosition) {
    const mouseDelta = new THREE.Vector2(
      mousePosition.x - mouseResetPosition.x,
      mousePosition.y - mouseResetPosition.y
    );

    lateMouseDelta.x += (mouseDelta.x - lateMouseDelta.x) * 5.0 * mult;
    lateMouseDelta.y += (mouseDelta.y - lateMouseDelta.y) * 5.0 * mult;
  }

  if (currentRoom) {
    currentRoom.setMouseDelta(lateMouseDelta);
    currentRoom.animate(deltaTime);
  }

  // if (currentRoom) {
  //   currentRoom.setMouseDelta(lateMouseDelta);
  //   currentRoom.animate(deltaTime);
  // }

  const time = Date.now() * 0.001;
  dummyObj.rotation.x = Math.sin(time * 0.3) * 3.5;
  dummyObj.rotation.y = Math.cos(time * 0.4) * 2.5;
  dummyObj.position.z = 0 + 30 * Math.cos(time * 0.8);
  dummyObj.position.x = 0 + 30 * Math.sin(time * 0.3);

  // cameracontrols.update();

  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
  renderer.setScissorTest(true);

  if (renderPass.camera && ssaoPass.camera) {
    composer.render();
  }
}

async function exitRoom(data) {
  console.log("exitRoom called", data);

  // unload nextroom
  renderPass.camera = undefined;
  ssaoPass.camera = undefined;
  let oldId = "";
  let oldDoorId = data.id;
  if (currentRoom) {
    oldId = currentRoom.id;
    currentRoom.remove();
  }
  currentRoom = undefined;

  await loadNextRoom(data.linkedRoom, oldId, data.enterDoor, data.enterFrom);
}

async function loadNextRoom(id, previousRoom, previousDoorId, enterFrom) {
  currentRoom = new RoomWrapper(scene, exitRoom);
  await currentRoom.load(id, loader);
  renderPass.camera = currentRoom.playerCamera;
  ssaoPass.camera = currentRoom.playerCamera;
  currentRoom.resize(window.innerWidth, window.innerHeight);
  // trigger enter animation...
  currentRoomId = id;
  currentEnterFrom = enterFrom;
  currentRoom.enterFromDirection(enterFrom);
  updateLocation();
}

async function init() {
  console.log("load.");

  currentRoom = undefined;

  await createEmptyWorld();
  await parseLocation();
  await loadNextRoom(currentRoomId, undefined, undefined, currentEnterFrom);

  hideLoadingScreen();
  animate();
}

window.addEventListener("load", init);
