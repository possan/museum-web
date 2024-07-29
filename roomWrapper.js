import * as THREE from "three";
import { createRoom } from "./roomLoader.js";

export class RoomWrapper {
  root = undefined;
  parentScene = undefined;
  raycaster = undefined;
  isAnimating = false;
  animPhase = 0;
  animLength = 0;
  cameraPositionKeyframes = [];
  cameraRotationKeyframes = [];
  opacityKeyframes = [];
  cameraPositionInterpolator = undefined;
  cameraRotationInterpolator = undefined;
  opacityInterpolator = undefined;
  exitDoor = undefined;
  mouseDelta = new THREE.Vector2();
  paintingMeta = {};
  doorMeta = {};
  onExit = undefined;
  currentPlayerBaseRotation = undefined;
  currentPlayerLocation = undefined;
  currentPlayerRotation = undefined;
  targetPlayerLocation = undefined;
  targetPlayerRotation = undefined;
  dummyPlayer = undefined;
  dummyPlayerTarget = undefined;
  playerCamera = undefined;

  constructor(parentScene, exitFunction) {
    this.parentScene = parentScene;
    this.raycaster = new THREE.Raycaster();
    this.root = new THREE.Group();
    this.onExit = exitFunction;
    this.currentPlayerLocation = new THREE.Vector3();
    this.currentPlayerBaseRotation = 0;
    this.currentPlayerRotation = 0;
    this.targetPlayerLocation = new THREE.Vector3();
    this.targetPlayerRotation = 0;
  }

  remove() {
    this.parentScene.remove(this.root);
  }

  async load(id, loader) {
    const url = `rooms/room-${id}.json`;
    const r = await fetch(url);
    const roomdef = await r.json();

    this.isAnimating = false;

    this.playerCamera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.dummyPlayer = new THREE.Group();
    // const dummyGeom = new THREE.CylinderGeometry(0.1, 2, 3, 10, 2);
    // const dummyMat = new THREE.MeshStandardMaterial({
    //   color: 0xff00ff,
    //   roughness: 0.8,
    // });
    // const innerDummyPlayer = new THREE.Mesh(dummyGeom, dummyMat);
    // innerDummyPlayer.castShadow = true;
    // innerDummyPlayer.receiveShadow = true;
    // innerDummyPlayer.position.y = 0;
    // innerDummyPlayer.rotation.x = Math.PI / 2;
    // dummyPlayer.add(innerDummyPlayer);
    this.root.add(this.dummyPlayer);

    // const dummyGeom2 = new THREE.BoxGeometry(1, 1, 1);
    // const dummyMat2 = new THREE.MeshStandardMaterial({
    //   color: 0xffff00,
    //   roughness: 0.8,
    // });
    this.dummyPlayerTarget = new THREE.Group();
    // dummyPlayerTarget = new THREE.Mesh(dummyGeom2, dummyMat2);
    // dummyPlayerTarget.castShadow = true;
    // dummyPlayerTarget.receiveShadow = true;
    this.dummyPlayerTarget.position.x = 3;
    this.root.add(this.dummyPlayerTarget);

    this.parentScene.add(this.root);

    const roomGroup = createRoom(id, roomdef, loader);

    this.root.add(roomGroup);
  }

  _resetRoute(dur) {
    this.cameraPositionKeyframes = [];
    this.cameraRotationKeyframes = [];
    this.opacityKeyframes = [];
    this.animLength = dur * 1000;
  }

  _startRoute() {
    // console.log("position keyframes", this.cameraPositionKeyframes);

    // update interpolators
    const positionTimes = this.cameraPositionKeyframes.map((kf) => kf[0]);
    const positionValues = this.cameraPositionKeyframes
      .map((kf) => kf[1])
      .flat();
    // console.log("position times", positionTimes);
    // console.log("position values", positionValues);
    const positionTrack = new THREE.VectorKeyframeTrack(
      "",
      positionTimes,
      positionValues,
      THREE.InterpolateSmooth
    );
    this.cameraPositionInterpolator = positionTrack.createInterpolant();
    // console.log(
    //   "this.cameraPositionInterpolator",
    //   this.cameraPositionInterpolator
    // );

    const rotationTimes = this.cameraRotationKeyframes.map((kf) => kf[0]);
    const rotationValues = this.cameraRotationKeyframes
      .map((kf) => kf[1])
      .flat();
    // console.log("rotation times", rotationTimes);
    // console.log("rotation values", rotationValues);
    const rotationTrack = new THREE.VectorKeyframeTrack(
      "",
      rotationTimes,
      rotationValues,
      THREE.InterpolateSmooth
    );
    this.cameraRotationInterpolator = rotationTrack.createInterpolant();
    // console.log(
    //   "this.cameraRotationInterpolator",
    //   this.cameraRotationInterpolator
    // );

    const opacityTimes = this.opacityKeyframes.map((kf) => kf[0]);
    const opacityValues = this.opacityKeyframes.map((kf) => kf[1]).flat();
    // console.log("opacity times", opacityTimes);
    // console.log("opacity values", opacityValues);
    const opacityTrack = new THREE.VectorKeyframeTrack(
      "",
      opacityTimes,
      opacityValues,
      THREE.InterpolateSmooth
    );
    this.opacityInterpolator = opacityTrack.createInterpolant();
    // console.log("this.opacityInterpolator", this.opacityInterpolator);

    this.isAnimating = true;
    this.animPhase = 0;
  }

  enterFromDirection(enterFrom) {
    if (this.isAnimating) {
      console.warn("already animating");
      return;
    }

    // plan route
    this._resetRoute(2.0);

    let sx = 0;
    let sz = 20;
    let dir = Math.PI;
    // if (enterFrom === 'south') {
    //   sx =
    //   sy =
    // }
    if (enterFrom === "west") {
      sx = -20;
      sz = 0;
      dir = Math.PI / 2;
    }
    if (enterFrom === "east") {
      sx = 20;
      sz = 0;
      dir = -Math.PI / 2;
    }
    if (enterFrom === "north") {
      sx = 0;
      sz = 20;
      dir = -Math.PI;
    }

    this.cameraPositionKeyframes.push([0, [sx, 1, sz]]);
    // this.cameraPositionKeyframes.push([1, [-1, -1, 3]]);
    this.cameraPositionKeyframes.push([2, [0, 0, 0]]);

    this.cameraRotationKeyframes.push([0, [dir + -0.1, 0.2, 0]]);
    this.cameraRotationKeyframes.push([1, [dir + 0.1, -0.1, 0]]);
    this.cameraRotationKeyframes.push([2, [dir + 0, 0, 0]]);

    this.opacityKeyframes.push([0, [0, 0, 0]]);
    this.opacityKeyframes.push([2, [1, 0, 0]]);

    // start.
    this._startRoute();
  }

  enterFromDoor(doorId) {
    if (this.isAnimating) {
      console.warn("already animating");
      return;
    }

    // plan route
    this._resetRoute(2.0);

    // start.
    this._startRoute();
  }

  _zoomTo(tx, tz, angle, targetalpha) {
    console.log("zoomTo", tx, tz, angle);

    this.targetPlayerLocation.x = tx;
    this.targetPlayerLocation.z = tz;

    console.log("current player base rotation", this.currentPlayerBaseRotation);
    console.log("current player rotation", this.currentPlayerRotation);

    while (this.currentPlayerRotation > Math.PI) {
      this.currentPlayerRotation -= Math.PI * 2;
    }
    while (this.currentPlayerRotation < -Math.PI) {
      this.currentPlayerRotation += Math.PI * 2;
    }

    let newangle = (angle * Math.PI) / 180 + Math.PI / 2.0;
    console.log("newangle", newangle);
    while (newangle < -Math.PI) {
      newangle += Math.PI * 2;
    }
    while (newangle > Math.PI) {
      newangle -= Math.PI * 2;
    }
    console.log("newangle", newangle);

    let deltaAngle = newangle - this.currentPlayerRotation;
    while (deltaAngle < -Math.PI) {
      deltaAngle += Math.PI * 2;
    }
    while (deltaAngle > Math.PI) {
      deltaAngle -= Math.PI * 2;
    }
    console.log("delta angle", deltaAngle);

    this.targetPlayerRotation = this.currentPlayerRotation + deltaAngle;

    // plan route
    this._resetRoute(1.0);

    const avgx =
      (this.targetPlayerLocation.x + this.currentPlayerLocation.x) / 2.5;
    const avgy =
      (this.targetPlayerLocation.y + this.currentPlayerLocation.y) / 2.5;
    const avgz =
      (this.targetPlayerLocation.z + this.currentPlayerLocation.z) / 2.5;

    this.cameraPositionKeyframes.push([
      0,
      [
        this.currentPlayerLocation.x,
        this.currentPlayerLocation.y,
        this.currentPlayerLocation.z,
      ],
    ]);
    this.cameraPositionKeyframes.push([0.5, [avgx, avgy, avgz]]);
    this.cameraPositionKeyframes.push([
      1,
      [
        this.targetPlayerLocation.x,
        this.targetPlayerLocation.y,
        this.targetPlayerLocation.z,
      ],
    ]);

    this.cameraRotationKeyframes.push([0, [this.currentPlayerRotation, 2, 0]]);
    this.cameraRotationKeyframes.push([1, [this.targetPlayerRotation, -1, 0]]);

    this.opacityKeyframes.push([0, [1, 0, 0]]);
    this.opacityKeyframes.push([1, [targetalpha, 0, 0]]);

    // start.
    this._startRoute();
  }

  resize(width, height) {
    this.playerCamera.aspect = width / height;
    this.playerCamera.updateProjectionMatrix();
    // camera.aspect = width / height;
    // camera.updateProjectionMatrix();
    // renderer.setSize(width, height);
  }

  zoomPainting(paintingId) {
    console.log("zoomPainting", paintingId);

    if (this.isAnimating) {
      console.warn("already animating");
      return;
    }

    const link = this.paintingMeta[paintingId];
    console.log("zoomPainting", link);

    this._zoomTo(link.px, link.pz, link.angle, 1.0);
  }

  exitPainting() {
    if (this.isAnimating) {
      console.warn("already animating");
      return;
    }

    // plan route
    this._resetRoute(1.0);

    // start.
    this._startRoute();
  }

  exitThroughDoor(doorId) {
    console.log("exitThroughDoor", doorId);

    if (this.isAnimating) {
      console.warn("already animating");
      return;
    }

    const link = this.doorMeta[doorId];
    console.log("exitThroughDoor", link);

    this.exitDoor = link.id;

    this._zoomTo(link.px, link.pz, link.angle, 0.0);
  }

  linkAtPointer(pointer) {
    console.log("linkAtPointer", pointer);
    this.raycaster.setFromCamera(pointer, this.playerCamera);
    const rayIntersects = this.raycaster.intersectObjects(
      this.parentScene.children
    );

    for (let i = 0; i < rayIntersects.length; i++) {
      console.log("click intersect", i, rayIntersects[i].object.userData);

      if (rayIntersects[i].object.userData?.paintingId) {
        console.log("clicked on painting", rayIntersects[i].object.userData);

        const meta = {
          type: "painting",
          id: rayIntersects[i].object.userData?.paintingId,
          ...rayIntersects[i].object.userData,
        };

        this.paintingMeta[meta.id] = meta;

        return meta;
      }

      if (rayIntersects[i].object.userData?.doorId) {
        console.log("clicked on door", rayIntersects[i].object.userData);

        const meta = {
          type: "exit",
          id: rayIntersects[i].object.userData?.doorId,
          ...rayIntersects[i].object.userData,
        };

        this.doorMeta[meta.id] = meta;

        return meta;
      }
    }

    return undefined;
  }

  setMouseDelta(mouseDelta) {
    this.mouseDelta.x = mouseDelta.x;
    this.mouseDelta.y = mouseDelta.y;
  }

  animate(deltaTime) {
    const mult = deltaTime / 1000.0;

    if (!this.dummyPlayer) {
        return
    }

    if (this.isAnimating) {
      const pos = this.cameraPositionInterpolator.evaluate(
        this.animPhase / 1000.0
      );

      const rot = this.cameraRotationInterpolator.evaluate(
        this.animPhase / 1000.0
      );

      const opa = this.opacityInterpolator.evaluate(this.animPhase / 1000.0);

      // console.log(
      //   "anim eval",
      //   this.animPhase,
      //   this.animLength,
      //   [...pos],
      //   [...rot],
      //   [...opa]
      // );

      this.currentPlayerLocation.x = pos[0];
      this.currentPlayerLocation.y = pos[1];
      this.currentPlayerLocation.z = pos[2];

      this.currentPlayerBaseRotation = rot[0];
      this.currentPlayerRotation = this.currentPlayerBaseRotation;

      this.targetPlayerLocation.x = this.currentPlayerLocation.x;
      this.targetPlayerLocation.y = this.currentPlayerLocation.y;
      this.targetPlayerLocation.z = this.currentPlayerLocation.z;

      this.targetPlayerRotation = this.currentPlayerRotation;

      this.dummyPlayer.position.x = this.currentPlayerLocation.x;
      this.dummyPlayer.position.y = this.currentPlayerLocation.y;
      this.dummyPlayer.position.z = this.currentPlayerLocation.z;

      this.playerCamera.position.x = this.dummyPlayer.position.x;
      this.playerCamera.position.y = this.dummyPlayer.position.y;
      this.playerCamera.position.z = this.dummyPlayer.position.z;

      this.dummyPlayerTarget.position.x =
        this.dummyPlayer.position.x +
        15.0 * Math.sin(this.currentPlayerRotation);
      this.dummyPlayerTarget.position.z =
        this.dummyPlayer.position.z +
        15.0 * Math.cos(this.currentPlayerRotation);
      this.dummyPlayerTarget.position.y = this.mouseDelta.y * 6.0;

      // playerCamera.rotation.z = currentPlayerFade * Math.PI //  (latePointer.y * Math.PI) / 20;

      document.getElementById("view").style.opacity = `${Math.round(
        opa[0] * 100
      )}%`;

      this.playerCamera.lookAt(this.dummyPlayerTarget.position);

      this.animPhase += deltaTime;
      if (this.animPhase >= this.animLength) {
        console.log("stop animation.");

        // reset camera and pointer
        // this.mouseOffset.x = this.mouseDelta.x;
        // this.mouseOffset.y = this.mouseDelta.y;

        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;

        // this.latePointer.x = 0;
        // this.latePointer.y = 0;

        this.animPhase = 0;
        this.isAnimating = false;

        if (this.exitDoor) {
          const link = this.doorMeta[this.exitDoor];
          if (this.onExit) {
            this.onExit(link);
          }
        }
      }
    } else {
      // console.log("user", this.mouseDelta);

      this.currentPlayerRotation =
        this.currentPlayerBaseRotation - this.mouseDelta.x * Math.PI; //   + Math.PI;

      this.dummyPlayer.position.x = this.currentPlayerLocation.x;
      this.dummyPlayer.position.y = this.currentPlayerLocation.y;
      this.dummyPlayer.position.z = this.currentPlayerLocation.z;

      this.dummyPlayerTarget.position.x =
        this.dummyPlayer.position.x +
        15.0 * Math.sin(this.currentPlayerRotation);
      this.dummyPlayerTarget.position.z =
        this.dummyPlayer.position.z +
        15.0 * Math.cos(this.currentPlayerRotation);
      this.dummyPlayerTarget.position.y = this.mouseDelta.y * 6.0;

      // this.playerCamera.lookAt(this.dummyPlayerTarget.position);

      this.playerCamera.position.x = this.dummyPlayer.position.x;
      this.playerCamera.position.y = this.dummyPlayer.position.y;
      this.playerCamera.position.z = this.dummyPlayer.position.z;

      this.playerCamera.lookAt(this.dummyPlayerTarget.position);
    }
  }
}
