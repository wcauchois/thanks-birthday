import RAPIER from '@dimforge/rapier2d-compat';
import { skull, jaw, torso, limb } from "data:text/javascript;base64,Ly8gQWxsIGFydHdvcmsgdXNlcyBsb2NhbCBjb29yZGluYXRlcyBtZWFzdXJlZCBpbiBTVkcgdW5pdHMuCmV4cG9ydCBjb25zdCBkZWZpbml0aW9ucyA9IGA8ZGVmcz4KICA8ZyBpZD0iYm9uZSI+PHBhdGggZD0iTS04IDggQy0yMCAxLTIwLTEyLTEwLTE0IFEwLTIwIDEwLTE0IEMyMC0xMiAyMCAxIDggOCBMOCA2NCBDMjAgNzIgMTcgODYgNyA4NSBRMCA5MS03IDg1IEMtMTcgODYtMjAgNzItOCA2NFoiLz48L2c+CiAgPGcgaWQ9ImhhbmQiPjxwYXRoIGQ9Ik0tMTEgMCBMLTE3IDE5IFEtMjIgMjctMTYgMjkgTC05IDI0IEwtOCAzOSBRLTUgNDggMCA0MCBRNiA0OCAxMCAzOSBRMTggNDIgMTkgMzMgTDE3IDExIFExNSAxIDggMFoiLz48cGF0aCBjbGFzcz0iZGV0YWlsIiBkPSJNMCAyMiAxIDM4IE05IDIxIDEwIDM3Ii8+PC9nPgogIDxnIGlkPSJmb290Ij48cGF0aCBkPSJNLTEwLTUgUTAtMTAgMTAtNSBMMTMgMTMgUTM3IDIwIDM0IDMyIFEzMCA0MiAxMyAzNyBMLTExIDI4IFEtMjAgMjItMTMgOVoiLz48cGF0aCBjbGFzcz0iZGV0YWlsIiBkPSJNMjAgMjMgMTcgMzQgTTI4IDI2IDI1IDM2Ii8+PC9nPgo8L2RlZnM+YDsKZXhwb3J0IGNvbnN0IHNrdWxsID0gYDxwYXRoIGQ9Ik0tNDkgMyBDLTU3LTI1LTM5LTYyLTgtNjYgQzI4LTczIDU3LTQ2IDU1LTEwIFE1NSAxOCAzMiAyNSBMMjAgMjUgTDE2IDM4IEw2IDM0IEwwIDQwIEwtOCAzMyBMLTE3IDM3IEwtMjIgMjUgTC0zNyAyMyBRLTU1IDIxLTQ5IDNaIi8+CjxwYXRoIGNsYXNzPSJpbmsiIGQ9Ik0tMzAtMTggQy00NC0xMi0zOSAxMC0yNiA5IEMtMTEgOC0xMy0xOC0yNS0xOVogTTE4LTE3IEMzLTE2IDQgMTAgMTkgMTIgQzM0IDEzIDM3LTExIDI0LTE2WiBNLTQgMTUgUS0xMyAxNi01IDI5IFEwIDMzIDYgMjEgUTggMTUtNCAxNVoiLz5gOwpleHBvcnQgY29uc3QgamF3ID0gYDxwYXRoIGQ9Ik0tMjktNiBRMCAxMSAyOS02IEwyNSA5IFEwIDI4LTI1IDlaIi8+YDsKZXhwb3J0IGNvbnN0IHRvcnNvID0gYDxwYXRoIGNsYXNzPSJkZXRhaWwiIHN0cm9rZS13aWR0aD0iMTMiIGQ9Ik0wIDAgTDAgMTIyIi8+CjxwYXRoIGQ9Ik0tNiA4IFEtMjUgMTEtNDQtMSBRLTU3IDgtNDUgMTkgUS0yOSAzMS04IDI1IE02IDggUTI1IDExIDQ0LTEgUTU3IDggNDUgMTkgUTI5IDMxIDggMjUKTS04IDM0IFEtMzMgMzctNDkgMjMgUS02MCAzNi00NCA0NyBRLTI1IDU2LTggNDkgTTggMzQgUTMzIDM3IDQ5IDIzIFE2MCAzNiA0NCA0NyBRMjUgNTYgOCA0OQpNLTggNTggUS0zMSA2Mi00OSA0OSBRLTU5IDY1LTQzIDc0IFEtMjIgODYtOCA3MyBNOCA1OCBRMzEgNjIgNDkgNDkgUTU5IDY1IDQzIDc0IFEyMiA4NiA4IDczCk0tOCA4MyBRLTI5IDkxLTQzIDc4IFEtNTEgOTUtMzIgMTAyIFEtMTkgMTA1LTUgOTAgTTggODMgUTI5IDkxIDQzIDc4IFE1MSA5NSAzMiAxMDIgUTE5IDEwNSA1IDkwIi8+CjxwYXRoIGQ9Ik0tNyAzIFEwLTMgNyAzIEw4IDcyIFE2IDkxIDAgOTMgUS05IDg3LTggNzNaIi8+CjxwYXRoIGQ9Ik0wIDEyNSBDLTM2IDgyLTYyIDEyMy0zNyAxNTAgUS0yMSAxNzQgMCAxNTQgUTIxIDE3NCAzNyAxNTAgQzYyIDEyMyAzNiA4MiAwIDEyNVoiLz4KPHBhdGggY2xhc3M9ImluayIgZD0iTS0yOSAxMjggUS0xNSAxMjEtMTMgMTQwIFEtMTggMTUxLTI3IDE0MFogTTI5IDEyOCBRMTUgMTIxIDEzIDE0MCBRMTggMTUxIDI3IDE0MFoiLz5gOwpleHBvcnQgZnVuY3Rpb24gbGltYihsZW5ndGgsIGVuZCwgbWlycm9yID0gZmFsc2UpIHsKICAgIHJldHVybiBgPHVzZSBocmVmPSIjYm9uZSIgdHJhbnNmb3JtPSJzY2FsZSgwLjcyICR7bGVuZ3RoIC8gNzh9KSIvPiR7ZW5kID8gYDx1c2UgaHJlZj0iIyR7ZW5kfSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAke2xlbmd0aCArIDV9KSBzY2FsZSgke21pcnJvciA/IC0wLjggOiAwLjh9IDAuOCkiLz5gIDogJyd9YDsKfQo=";
const SCALE = 100;
export const WIDTH = 600;
export const HEIGHT = 780;
export async function createSkeleton(layer) {
    await RAPIER.init();
    const world = new RAPIER.World({ x: 0, y: 9.81 });
    world.timestep = 1 / 60;
    const parts = [];
    const point = (x, y) => ({ x: x / SCALE, y: y / SCALE });
    function part(name, x, y, art, halfWidth, halfHeight, cy = 0, angle = 0) {
        const body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(x / SCALE, y / SCALE).setRotation(angle).setLinearDamping(0.8).setAngularDamping(1.6));
        // Skeleton pieces collide with the enclosure, but not with each other.
        world.createCollider(RAPIER.ColliderDesc.cuboid(halfWidth / SCALE, halfHeight / SCALE).setTranslation(0, cy / SCALE).setCollisionGroups(0x00010002).setDensity(1), body);
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        element.innerHTML = art;
        element.dataset.part = name;
        element.classList.add('body-part');
        layer.append(element);
        parts.push({ body, element, x, y, angle });
        return body;
    }
    function join(a, b, ax, ay, bx, by, limits) {
        const joint = world.createImpulseJoint(RAPIER.JointData.revolute(point(ax, ay), point(bx, by)), a, b, true);
        if (limits)
            joint.setLimits(...limits);
    }
    const anchor = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(3, 1.12));
    const head = part('skull', 300, 178, skull, 43, 45, -16);
    join(anchor, head, 0, 0, 0, -66, [-0.7, 0.7]);
    const chest = part('torso', 300, 236, torso, 43, 77, 75);
    join(head, chest, 0, 48, 0, -10, [-0.65, 0.65]);
    const chin = part('jaw', 300, 216, jaw, 24, 10, 4);
    join(head, chin, -27, 34, -27, -4, [-0.12, 0.22]);
    for (const side of [-1, 1]) {
        const arm = part(`arm-${side}`, 300 + side * 49, 242, limb(85), 9, 43, 40, -side * 0.28);
        join(chest, arm, side * 49, 6, 0, 0, [-2.6, 2.6]);
        const elbow = arm.translation();
        const forearm = part(`forearm-${side}`, elbow.x * SCALE + Math.sin(side * 0.28) * 85, 242 + Math.cos(0.28) * 85, limb(77, 'hand', side < 0), 12, 55, 49);
        join(arm, forearm, 0, 85, 0, 0, [-2.3, 2.3]);
        const thigh = part(`thigh-${side}`, 300 + side * 24, 391, limb(101), 10, 50, 47, -side * 0.12);
        join(chest, thigh, side * 24, 155, 0, 0, [-1.3, 1.3]);
        const shin = part(`shin-${side}`, 300 + side * 36, 491, limb(103, 'foot', side < 0), 12, 65, 57);
        join(thigh, shin, 0, 101, 0, 0, [-1.9, 1.9]);
    }
    for (const [x, y, hx, hy] of [[-10, 390, 10, 390], [610, 390, 10, 390], [300, 790, 300, 10], [300, -10, 300, 10]]) {
        world.createCollider(RAPIER.ColliderDesc.cuboid(hx / SCALE, hy / SCALE).setTranslation(x / SCALE, y / SCALE).setCollisionGroups(0x00020001));
    }
    const cursor = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased());
    let dragJoint;
    function release() {
        if (dragJoint)
            world.removeImpulseJoint(dragJoint, true);
        dragJoint = undefined;
    }
    return {
        world,
        step() { world.step(); },
        render() {
            for (const { body, element } of parts) {
                const p = body.translation();
                element.setAttribute('transform', `translate(${p.x * SCALE} ${p.y * SCALE}) rotate(${body.rotation() * 180 / Math.PI})`);
            }
        },
        drag(name, x, y) {
            release();
            const body = parts.find(p => p.element.dataset.part === name)?.body;
            if (!body)
                return;
            const p = body.translation(), a = body.rotation();
            const dx = x / SCALE - p.x, dy = y / SCALE - p.y;
            cursor.setTranslation(point(x, y), true);
            cursor.setNextKinematicTranslation(point(x, y));
            dragJoint = world.createImpulseJoint(RAPIER.JointData.spring(0, 90, 9, { x: 0, y: 0 }, { x: dx * Math.cos(a) + dy * Math.sin(a), y: -dx * Math.sin(a) + dy * Math.cos(a) }), cursor, body, true);
        },
        move(x, y) { cursor.setNextKinematicTranslation(point(x, y)); },
        release,
        gravity(x, y) { world.gravity = { x, y }; for (const p of parts)
            p.body.wakeUp(); },
        kick(x, y) { for (const { body } of parts)
            body.applyImpulse({ x: x * body.mass(), y: y * body.mass() }, true); },
        reset() {
            release();
            for (const { body, x, y, angle } of parts) {
                body.setTranslation(point(x, y), true);
                body.setRotation(angle, true);
                body.setLinvel({ x: 0, y: 0 }, true);
                body.setAngvel(0, true);
            }
        },
        dispose() { world.free(); },
    };
}
