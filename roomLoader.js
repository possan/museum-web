import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// // import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
// import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";
// import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
// import { RenderTransitionPass } from "three/addons/postprocessing/RenderTransitionPass.js";

// import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';

const WALL_HEIGHT = 10.0;
const DOOR_DEPTH = 2;
const DOOR_OFFSET = -1.0 + 0.05;
// const WALL_HEIGHT = 10.0;
const WALL_AXIS_OFFSET = 30;
const WALL_OFFAXIS_OFFSET = 20;
const PAINTING_OFFSET = 0.3;

export function baseHorizontalWall(roomGroup, x1, z1, color) {
  const cordGeometry2 = new THREE.BoxGeometry(20, WALL_HEIGHT, 0.1, 8);

  const cordMaterial2 = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.8,
  });

  const cord4 = new THREE.Mesh(cordGeometry2, cordMaterial2);
  cord4.castShadow = true;
  cord4.receiveShadow = true;
  cord4.position.x = x1;
  cord4.position.z = z1;
  //   cord4.position.y = -3 + Math.random() * 6;
  roomGroup.add(cord4);

  // __comment: "north wall, west side",
  //   return {
  //     type: "poly",
  //     fillColor: transparent
  //       ? {
  //           r: 0,
  //           g: 0,
  //           b: 0,
  //           alpha: 0,
  //         }
  //       : {
  //           r: color.r, // + Math.random() * 50,
  //           g: color.g, // + Math.random() * 50,
  //           b: color.b, // + Math.random() * 50,
  //         },
  //     x: [x1, x2, x2, x1],
  //     y: [ceilinglevel, ceilinglevel, floorlevel, floorlevel],
  //     z: [z1, z2, z2, z1],
  //     zIndexOffset: transparent ? 500 : undefined,
  //     image,
  //   };
}

export function baseVerticalWall(roomGroup, x1, z1, color) {
  const cordGeometry2 = new THREE.BoxGeometry(0.1, WALL_HEIGHT, 20, 8);

  const cordMaterial2 = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.8,
  });

  const cord4 = new THREE.Mesh(cordGeometry2, cordMaterial2);
  cord4.castShadow = true;
  cord4.receiveShadow = true;
  cord4.position.x = x1;
  cord4.position.z = z1;
  // cord4.position.y = -3 + Math.random() * 6;
  roomGroup.add(cord4);

  // __comment: "north wall, west side",
  //   return {
  //     type: "poly",
  //     fillColor: transparent
  //       ? {
  //           r: 0,
  //           g: 0,
  //           b: 0,
  //           alpha: 0,
  //         }
  //       : {
  //           r: color.r, // + Math.random() * 50,
  //           g: color.g, // + Math.random() * 50,
  //           b: color.b, // + Math.random() * 50,
  //         },
  //     x: [x1, x2, x2, x1],
  //     y: [ceilinglevel, ceilinglevel, floorlevel, floorlevel],
  //     z: [z1, z2, z2, z1],
  //     zIndexOffset: transparent ? 500 : undefined,
  //     image,
  //   };
}

export function wallImage(roomGroup, loader, def, base, x, z) {
  const angle2 = (base.angle * Math.PI) / 180 - Math.PI / 2.0;
  const def2 = {
    ...base,
    ...def,
    px: x + 5 * Math.sin(angle2),
    pz: z + 5 * Math.cos(angle2),
  };

  console.log("wallImage", def2);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    emissive: 0x202020,
  });

  const cordGeometry2 = new THREE.BoxGeometry(1, 1, 0.1, 3);

  const sideMesh1 = new THREE.Mesh(cordGeometry2, mat);
  sideMesh1.castShadow = true;
  sideMesh1.receiveShadow = true;
  sideMesh1.position.x = x;
  sideMesh1.position.z = z;
  sideMesh1.rotation.y = ((def2.angle - 90) * Math.PI) / 180.0;
  sideMesh1.userData = def2;
  roomGroup.add(sideMesh1);

  // const src = `images/${encodeURIComponent(def2.src)}`;
  let src = `https://mindprints.org/images/${encodeURIComponent(def2.src)}`;

  src =
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHJ3NWJtYThmODRzenlzN2FqdTV4NTkwYXZkZXJwZDlyNWZ2b3FsaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MUHNdrm3vk7MoyUsCO/giphy.gif";
  src = "./wide.png";
  if (Math.random() < 0.66) {
    src =
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGJyOGZ3ajFqczc1aG12NXZwNm82YnU3Y3VjMmR0NGh3MHpwdGZzeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fCCCy9QuTtsFM9S88n/giphy-downsized-large.gif";
    src = "./tall.png";
  }
  if (Math.random() < 0.33) {
    src =
      "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzN3M2d0eXZ3YnYyc2dldXd1cHBvMXJtM3liaGk0ZmV6b2I5YXAwaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NWg7M1VlT101W/giphy.gif";
    src = "./square.png";
  }

  console.log("loading", src);
  loader.load(
    // resource URL
    src,
    // onLoad callback
    function (texture) {
      // in this example we create the material when the texture is loaded
      // console.log("loaded texture", texture, texture.source.data);

      const maxsize = 7.0 * (def2.size || 1.0);

      const img = texture.source.data;
      if (img) {
        const aspect = img.width / img.height;
        if (aspect > 1.0) {
          sideMesh1.scale.x = maxsize; // texture.width;
          sideMesh1.scale.y = maxsize / aspect; //texture.height;
        } else {
          sideMesh1.scale.x = maxsize * aspect; // texture.width;
          sideMesh1.scale.y = maxsize; //texture.height;
        }
      }

      mat.map = texture;
      mat.emissiveMap = texture;
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function (err) {
      console.error("An error happened.", err);
    }
  );

  //   return (
  //     def && {
  //       distView: 400,
  //       zoom: 1,
  //       ...base,
  //       ...def,
  //       x,
  //       y: 0,
  //       z,
  //     }
  //   );
}

export function door(roomGroup, x1, z1, angle, color, image, def) {
  const group = new THREE.Group();

  const mat = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    roughness: 0.8,
  });

  const cordGeometry2 = new THREE.BoxGeometry(7, 10, DOOR_DEPTH, 8);

  const sideMesh1 = new THREE.Mesh(cordGeometry2, mat);
  sideMesh1.castShadow = true;
  sideMesh1.receiveShadow = true;
  sideMesh1.position.x = -6.5;
  sideMesh1.position.z = 0;
  group.add(sideMesh1);

  const sideMesh2 = new THREE.Mesh(cordGeometry2, mat);
  sideMesh2.castShadow = true;
  sideMesh2.receiveShadow = true;
  sideMesh2.position.x = 6.5;
  sideMesh2.position.z = 0;
  group.add(sideMesh2);

  const topMeshGeom = new THREE.BoxGeometry(20, 2, DOOR_DEPTH, 8);

  const topMesh = new THREE.Mesh(topMeshGeom, mat);
  topMesh.castShadow = true;
  topMesh.receiveShadow = true;
  topMesh.position.x = 0;
  topMesh.position.z = 0;
  topMesh.position.y = 4;
  group.add(topMesh);

  const backGeom = new THREE.BoxGeometry(4, 3, 2, 2);

  const back = new THREE.Mesh(backGeom, mat);
  back.castShadow = true;
  back.receiveShadow = true;
  back.position.x = 0;
  back.position.z = -5;
  back.position.y = 0;
  group.add(back);

  const frontGeom = new THREE.BoxGeometry(6, 1, 2, 2);

  const front = new THREE.Mesh(frontGeom, mat);
  front.castShadow = true;
  front.receiveShadow = true;
  front.position.x = 0;
  front.position.y = -4;
  front.position.z = 10;
  group.add(front);

  const cordGeometry3 = new THREE.BoxGeometry(6, 10, 6, 2);

  const sideMesh4 = new THREE.Mesh(cordGeometry3, undefined);
  sideMesh4.visible = false;
  sideMesh4.position.x = 0;
  sideMesh4.position.y = 4;
  sideMesh4.position.z = 0;
  const angle2 = (angle * Math.PI) / 180; // - Math.PI / 2.0;
  sideMesh4.userData = {
    ...def, 
    dummyDoor: 1234,
    doorId: def.id,
    angle: angle + 90,
    px: x1 + 5 * Math.sin(angle2),
    pz: z1 + 5 * Math.cos(angle2),
  };
  group.add(sideMesh4);

  group.rotation.y = (angle * Math.PI) / 180;
  group.position.x = x1;
  group.position.z = z1;

  roomGroup.add(group);
}

export function createEastWall(roomGroup, loader, wall, room) {
  if (!wall) {
    return [];
  }

  const northPainting = wall.paintings.find((p) => p.position === "north");
  const centerPainting = wall.paintings.find((p) => p.position === "center");
  const southPainting = wall.paintings.find((p) => p.position === "south");

  baseVerticalWall(
    roomGroup,
    WALL_AXIS_OFFSET,
    -WALL_OFFAXIS_OFFSET,
    room.color
  );

  baseVerticalWall(
    roomGroup,
    WALL_AXIS_OFFSET,
    WALL_OFFAXIS_OFFSET,
    room.color
  );

  if (wall.door) {
    door(
      roomGroup,
      WALL_AXIS_OFFSET - DOOR_OFFSET,
      0,
      -90,
      room.color,
      {
        src: wall.door.preview,
        angle: 0,
        href: `/Json_geometries/${wall.door.link}.json`,
        exit: wall.door.exit,
        exitTo: "east",
      },
      wall.door,
      true
    );
  } else {
    baseVerticalWall(roomGroup, WALL_AXIS_OFFSET, 0, room.color);
  }

  if (northPainting) {
    wallImage(
      roomGroup,
      loader,
      northPainting,
      {
        angle: 0,
        paintingId: `${room.id}/e1`,
      },
      WALL_AXIS_OFFSET - PAINTING_OFFSET,
      -WALL_OFFAXIS_OFFSET
    );
  }

  if (southPainting) {
    wallImage(
      roomGroup,
      loader,
      southPainting,
      {
        angle: 0,
        paintingId: `${room.id}/e2`,
      },
      WALL_AXIS_OFFSET - PAINTING_OFFSET,
      WALL_OFFAXIS_OFFSET
    );
  }

  if (centerPainting) {
    wallImage(
      roomGroup,
      loader,
      centerPainting,
      {
        angle: 0,
        paintingId: `${room.id}/e3`,
      },
      WALL_AXIS_OFFSET - PAINTING_OFFSET,
      0
    );
  }
}

export function createWestWall(roomGroup, loader, wall, room) {
  if (!wall) {
    return [];
  }

  const northPainting = wall.paintings.find((p) => p.position === "north");
  const centerPainting = wall.paintings.find((p) => p.position === "center");
  const southPainting = wall.paintings.find((p) => p.position === "south");

  baseVerticalWall(
    roomGroup,
    -WALL_AXIS_OFFSET,
    WALL_OFFAXIS_OFFSET,
    room.color
  );

  baseVerticalWall(
    roomGroup,
    -WALL_AXIS_OFFSET,
    -WALL_OFFAXIS_OFFSET,
    room.color
  );

  if (wall.door) {
    door(
      roomGroup,
      -WALL_AXIS_OFFSET + DOOR_OFFSET,
      0,
      90,
      room.color,
      {
        src: wall.door.preview,
        angle: -180,
        href: `/Json_geometries/${wall.door.link}.json`,
        exit: wall.door.exit,
        exitTo: "north",
      },
      wall.door,
      true
    );
  } else {
    baseVerticalWall(roomGroup, -WALL_AXIS_OFFSET, 0, room.color);
  }

  if (southPainting) {
    wallImage(
      roomGroup,
      loader,

      southPainting,
      {
        angle: -180,
        paintingId: `${room.id}/w1`,
      },
      -WALL_AXIS_OFFSET + PAINTING_OFFSET,
      WALL_OFFAXIS_OFFSET
    );
  }

  if (northPainting) {
    wallImage(
      roomGroup,
      loader,
      northPainting,
      {
        angle: -180,
        paintingId: `${room.id}/w2`,
      },
      -WALL_AXIS_OFFSET + PAINTING_OFFSET,
      -WALL_OFFAXIS_OFFSET
    );
  }

  if (centerPainting) {
    wallImage(
      roomGroup,
      loader,
      centerPainting,
      {
        angle: -180,
        paintingId: `${room.id}/w3`,
      },
      -WALL_AXIS_OFFSET + PAINTING_OFFSET,
      0
    );
  }
}

export function createNorthWall(roomGroup, loader, wall, room) {
  if (!wall) {
    return [];
  }

  const westPainting = wall.paintings.find((p) => p.position === "west");
  const centerPainting = wall.paintings.find((p) => p.position === "center");
  const eastPainting = wall.paintings.find((p) => p.position === "east");

  baseHorizontalWall(
    roomGroup,
    WALL_OFFAXIS_OFFSET,
    -WALL_AXIS_OFFSET,
    room.color
  );

  baseHorizontalWall(
    roomGroup,
    -WALL_OFFAXIS_OFFSET,
    -WALL_AXIS_OFFSET,
    room.color
  );

  if (wall.door) {
    door(
      roomGroup,
      0,
      -WALL_AXIS_OFFSET + DOOR_OFFSET,
      0,
      room.color,
      {
        src: wall.door.preview,
        angle: 90,
        href: `/Json_geometries/${wall.door.link}.json`,
        exit: wall.door.exit,
        exitTo: "north",
      },
      wall.door,
      true
    );
  } else {
    baseHorizontalWall(roomGroup, 0, -WALL_AXIS_OFFSET, room.color);
  }

  if (westPainting) {
    wallImage(
      roomGroup,
      loader,
      westPainting,
      {
        angle: 90,
        paintingId: `${room.id}/n1`,
      },
      WALL_OFFAXIS_OFFSET,
      -WALL_AXIS_OFFSET + PAINTING_OFFSET
    );
  }

  if (eastPainting) {
    wallImage(
      roomGroup,
      loader,
      eastPainting,
      {
        angle: 90,
        paintingId: `${room.id}/n2`,
      },
      -WALL_OFFAXIS_OFFSET,
      -WALL_AXIS_OFFSET + PAINTING_OFFSET
    );
  }

  if (centerPainting) {
    wallImage(
      roomGroup,
      loader,
      centerPainting,
      {
        angle: 90,
        paintingId: `${room.id}/n3`,
      },
      0,
      -WALL_AXIS_OFFSET + PAINTING_OFFSET
    );
  }
}

export function createSouthWall(roomGroup, loader, wall, room) {
  if (!wall) {
    return [];
  }

  const westPainting = wall.paintings.find((p) => p.position === "west");
  const centerPainting = wall.paintings.find((p) => p.position === "center");
  const eastPainting = wall.paintings.find((p) => p.position === "east");

  baseHorizontalWall(
    roomGroup,
    -WALL_OFFAXIS_OFFSET,
    WALL_AXIS_OFFSET,
    room.color
  );

  baseHorizontalWall(
    roomGroup,
    WALL_OFFAXIS_OFFSET,
    WALL_AXIS_OFFSET,
    room.color
  );

  if (wall.door) {
    door(
      roomGroup,
      0,
      WALL_AXIS_OFFSET - DOOR_OFFSET,
      180,
      room.color,
      {
        src: wall.door.preview,
        x: 0,
        y: 0,
        z: 1700,
        angle: -90,
        href: `/Json_geometries/${wall.door.link}.json`,
        exit: wall.door.exit,
        exitTo: "south",
      },
      wall.door,
      true
    );
  } else {
    baseHorizontalWall(roomGroup, 0, WALL_AXIS_OFFSET, room.color);
  }

  if (eastPainting) {
    wallImage(
      roomGroup,
      loader,
      eastPainting,
      {
        angle: -90,
        paintingId: `${room.id}/s3`,
      },
      -WALL_OFFAXIS_OFFSET,
      WALL_AXIS_OFFSET - PAINTING_OFFSET
    );
  }

  if (westPainting) {
    wallImage(
      roomGroup,
      loader,
      westPainting,
      {
        angle: -90,
        paintingId: `${room.id}/s2`,
      },
      WALL_OFFAXIS_OFFSET,
      WALL_AXIS_OFFSET - PAINTING_OFFSET
    );
  }

  if (centerPainting) {
    wallImage(
      roomGroup,
      loader,
      centerPainting,
      {
        angle: -90,
        paintingId: `${room.id}/s3`,
      },
      0,
      WALL_AXIS_OFFSET - PAINTING_OFFSET
    );
  }
}

export function createLight(roomGroup, x, z) {
  // const cordGeometry2 = new THREE.BoxGeometry(1, 1, 1, 8);

  // const cordMaterial2 = new THREE.MeshStandardMaterial({
  //   color: 0x666666,
  //   roughness: 0.8,
  // });

  // const caseMesh = new THREE.Mesh(cordGeometry2, cordMaterial2);
  // caseMesh.castShadow = true;
  // caseMesh.receiveShadow = true;
  // caseMesh.position.x = x * WALL_OFFAXIS_OFFSET;
  // caseMesh.position.z = z * WALL_OFFAXIS_OFFSET;
  // caseMesh.position.y = 4.9;
  // roomGroup.add(caseMesh);

  // const cordGeometry3 = new THREE.BoxGeometry(2, 0.05, 2, 8);

  // const cordMaterial3 = new THREE.MeshStandardMaterial({
  //   color: 0xffffff,
  //   roughness: 0.8,
  //   emissive: 0xffffff,
  // });

  // const lightMesh = new THREE.Mesh(cordGeometry3, cordMaterial3);
  // lightMesh.castShadow = true;
  // lightMesh.receiveShadow = true;
  // lightMesh.position.x = x * WALL_OFFAXIS_OFFSET;
  // lightMesh.position.z = z * WALL_OFFAXIS_OFFSET;
  // lightMesh.position.y = 4.8;
  // roomGroup.add(lightMesh);

  const light = new THREE.PointLight(0xffffff, 50, 100);
  light.castShadow = true;
  light.shadow.mapSize.width = 256;
  light.shadow.mapSize.height = 256;
  light.position.x = x * WALL_OFFAXIS_OFFSET;
  light.position.z = z * WALL_OFFAXIS_OFFSET;
  light.position.y = 4.0;
  roomGroup.add(light);
}

export function createRoom(id, room, loader) {
  console.log("room", id, room);

  room.id = id;

  const roomGroup = new THREE.Group();

  const flatGeometry = new THREE.BoxGeometry(64, 1, 64, 8);

  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 0.9,
    emissive: 0x444444,
  });

  const ceilMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    emissive: 0x888888,
  });

  const floorMesh = new THREE.Mesh(flatGeometry, floorMaterial);
  floorMesh.castShadow = true;
  floorMesh.receiveShadow = true;
  floorMesh.position.y = -5;
  roomGroup.add(floorMesh);

  const ceilMesh = new THREE.Mesh(flatGeometry, ceilMat);
  ceilMesh.castShadow = true;
  ceilMesh.receiveShadow = true;
  ceilMesh.position.y = 5;
  roomGroup.add(ceilMesh);

  createWestWall(roomGroup, loader, room.westwall, room);
  createSouthWall(roomGroup, loader, room.southwall, room);
  createEastWall(roomGroup, loader, room.eastwall, room);
  createNorthWall(roomGroup, loader, room.northwall, room);

  createLight(roomGroup, -1, 1);
  createLight(roomGroup, -1, 0);
  createLight(roomGroup, -1, -1);
  createLight(roomGroup, 0, 1);
  createLight(roomGroup, 0, -1);
  createLight(roomGroup, 1, 1);
  createLight(roomGroup, 1, 0);
  createLight(roomGroup, 1, -1);

  // const bulbLight = new THREE.PointLight(0xffffff, 100, 200);
  // bulbLight.castShadow = true;
  // bulbLight.shadow.mapSize.width = 1024;
  // bulbLight.shadow.mapSize.height = 1024;
  // bulbLight.position.set(0, 2, 0);
  // roomGroup.add(bulbLight);

  roomGroup.position.x = 0 // room.origin.x * 64;
  roomGroup.position.z = 0 // room.origin.y * 64;

  const targetObject = new THREE.Object3D();
  targetObject.position.set(0, -10, 0);
  roomGroup.add(targetObject);

  const light = new THREE.SpotLight(0xffffff, 20);
  //   const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 21, 0);
  light.target = targetObject;
  light.castShadow = true;
  //   dirLight.shadow.camera.near = 0.5;
  //   dirLight.shadow.camera.far = 200;
  //   dirLight.shadow.camera.right = 3;
  //   dirLight.shadow.camera.left = -3;
  //   dirLight.shadow.camera.top = 3;
  //   dirLight.shadow.camera.bottom = -3;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.fov = 80;
  //   dirLight.shadow.radius = 24;
  light.shadow.bias = -0.000005;
  roomGroup.add(light);

  return roomGroup;
}
