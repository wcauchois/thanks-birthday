import RAPIER from '@dimforge/rapier2d-compat';
import { skull, jaw, torso, limb } from "data:text/javascript;base64,Ly8gTWlycm9yZWQgY3VydmVzIGFuZCBzaGFyZWQgc2lsaG91ZXR0ZXMga2VlcCB0aGUgU1ZHIHNtYWxsIGFuZCBzeW1tZXRyaWMuCmV4cG9ydCBjb25zdCBkZWZpbml0aW9ucyA9IGA8ZGVmcz4KICA8ZyBpZD0iYm9uZSI+PHBhdGggZD0iTS03IDkgQy05IDMtMTYgNC0xNi00IEMtMTYtMTMtNy0xNiAwLTEwIEM3LTE2IDE2LTEzIDE2LTQgQzE2IDQgOSAzIDcgOSBDNCAyNCA0IDU0IDcgNjkgQzkgNzUgMTYgNzQgMTYgODIgQzE2IDkxIDcgOTQgMCA4OCBDLTcgOTQtMTYgOTEtMTYgODIgQy0xNiA3NC05IDc1LTcgNjkgQy00IDU0LTQgMjQtNyA5WiIvPjwvZz4KICA8ZyBpZD0iaGFuZCI+PHBhdGggZD0iTS0xMCAwIFEwLTQgMTAgMCBMMTIgMTUgTDIwIDI1IFEyMyAzMCAxOSAzMiBRMTYgMzMgMTEgMjcgTDExIDQwIFExMSA0NSA3IDQ1IFEzIDQ1IDMgNDAgTDMgMjUgTDMgNDUgUTMgNDktMSA0OSBRLTUgNDktNSA0NSBMLTUgMjUgTC01IDQwIFEtNSA0NC05IDQ0IFEtMTMgNDQtMTMgNDAgTC0xNCAxOFoiLz48L2c+CiAgPGcgaWQ9ImZvb3QiPjxwYXRoIGQ9Ik0tOS00IFEwLTggOS00IEwxMCAxMSBDMTIgMTggMzMgMTYgMzUgMjYgQzM4IDM4IDI0IDQwIDEzIDM2IEwtOSAyOSBRLTE3IDI2LTE0IDE1WiIvPjxwYXRoIGNsYXNzPSJkZXRhaWwiIGQ9Ik0yMCAyNSBMMTggMzUgTTI4IDI3IEwyNiAzNyIvPjwvZz4KICA8ZyBpZD0icmlicyI+PHBhdGggZD0iTS01IDggQy0xOSA5LTMyIDYtNDMgMCBDLTUyLTUtNTYgNS00OSAxMiBDLTM3IDI0LTIwIDI3LTUgMjJaIE0tNiAzMiBDLTIxIDM2LTM5IDMxLTQ5IDIzIEMtNTggMzQtNDggNDQtMzcgNDggQy0yNSA1My0xNCA1MS02IDQ3WiBNLTYgNTcgQy0yMSA2My0zOSA1Ni00OSA1MCBDLTU2IDYxLTQ4IDcxLTM2IDc1IEMtMjMgNzktMTIgNzUtNiA3MFogTS02IDgxIEMtMTggOTEtMzMgODUtNDMgNzggQy00OCA4OS0zOSA5OS0yOSAxMDAgQy0xOCAxMDEtOSA5NS00IDg5WiIvPjwvZz4KPC9kZWZzPmA7CmV4cG9ydCBjb25zdCBza3VsbCA9IGA8cGF0aCBkPSJNMC02NiBDLTMyLTY2LTUyLTQyLTUyLTEzIEMtNTIgOS00MyAyMi0yNyAyNCBMLTIyIDI0IEwtMjAgMzQgUS0xOCAzOS0xMyAzNSBMLTEwIDMxIEwtNiAzNyBRMCA0MiA2IDM3IEwxMCAzMSBMMTMgMzUgUTE4IDM5IDIwIDM0IEwyMiAyNCBMMjcgMjQgQzQzIDIyIDUyIDkgNTItMTMgQzUyLTQyIDMyLTY2IDAtNjZaIi8+CjxwYXRoIGNsYXNzPSJpbmsiIGQ9Ik0tMzMtMTUgQy0yMy0yNC0xMC0xNy0xMS00IEMtMTIgOS0yOCAxMy0zNCAzIEMtMzgtMy0zOC0xMC0zMy0xNVogTTMzLTE1IEMyMy0yNCAxMC0xNyAxMS00IEMxMiA5IDI4IDEzIDM0IDMgQzM4LTMgMzgtMTAgMzMtMTVaIE0wIDExIEMtNCAxMS0xMCAyMS03IDI1IFEtNCAyOSAwIDI1IFE0IDI5IDcgMjUgQzEwIDIxIDQgMTEgMCAxMVoiLz5gOwpleHBvcnQgY29uc3QgamF3ID0gYDxwYXRoIGQ9Ik0tMjgtNCBDLTIxIDEtMTQgNSAwIDUgQzE0IDUgMjEgMSAyOC00IEwyNSA5IEMxOSAyMC0xOSAyMC0yNSA5WiIvPmA7CmV4cG9ydCBjb25zdCB0b3JzbyA9IGA8cGF0aCBkPSJNLTYgODUgTDYgODUgTDYgMTI0IEwtNiAxMjRaIi8+PHBhdGggY2xhc3M9ImRldGFpbCIgZD0iTS02IDEwMyBINiBNLTYgMTE0IEg2Ii8+Cjx1c2UgaHJlZj0iI3JpYnMiLz48dXNlIGhyZWY9IiNyaWJzIiB0cmFuc2Zvcm09InNjYWxlKC0xIDEpIi8+CjxwYXRoIGQ9Ik0tNiAyIFEwLTMgNiAyIEMxMCAxOCA4IDUyIDYgNzQgUTQgODggMCA5MiBRLTQgODgtNiA3NCBDLTggNTItMTAgMTgtNiAyWiIvPgo8cGF0aCBkPSJNMCAxMjUgQy0xNCAxMDYtMzIgMTA0LTQyIDExNyBDLTU0IDEzNC0zOSAxNTEtMjQgMTU4IFEtMTMgMTY0IDAgMTUzIFExMyAxNjQgMjQgMTU4IEMzOSAxNTEgNTQgMTM0IDQyIDExNyBDMzIgMTA0IDE0IDEwNiAwIDEyNVoiLz4KPHBhdGggY2xhc3M9ImluayIgZD0iTS0zMCAxMjYgQy0yMCAxMjEtMTIgMTMzLTE2IDE0MiBDLTIyIDE1MC0zNyAxMzItMzAgMTI2WiBNMzAgMTI2IEMyMCAxMjEgMTIgMTMzIDE2IDE0MiBDMjIgMTUwIDM3IDEzMiAzMCAxMjZaIi8+YDsKZXhwb3J0IGZ1bmN0aW9uIGxpbWIobGVuZ3RoLCBlbmQsIG1pcnJvciA9IGZhbHNlKSB7CiAgICByZXR1cm4gYDx1c2UgaHJlZj0iI2JvbmUiIHRyYW5zZm9ybT0ic2NhbGUoMC43MiAke2xlbmd0aCAvIDc4fSkiLz4ke2VuZCA/IGA8dXNlIGhyZWY9IiMke2VuZH0iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgJHtsZW5ndGggKyA1fSkgc2NhbGUoJHttaXJyb3IgPyAtMC44IDogMC44fSAwLjgpIi8+YCA6ICcnfWA7Cn0K";
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
    join(head, chin, 0, 38, 0, 0, [-0.12, 0.12]);
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
