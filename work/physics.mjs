import RAPIER from '@dimforge/rapier2d-compat';
import { skull, jaw, torso, limb, birthdaySign } from "data:text/javascript;base64,Ly8gRWFjaCBiaWxhdGVyYWwgZmVhdHVyZSBpcyBkcmF3biBvbmNlIGFuZCByZWZsZWN0ZWQgYWJvdXQgaXRzIGFuYXRvbWljYWwgYXhpcy4KY29uc3QgcmVmbGVjdCA9IChhcnQpID0+IGAke2FydH08ZyB0cmFuc2Zvcm09InNjYWxlKC0xIDEpIj4ke2FydH08L2c+YDsKY29uc3QgcmlicyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDQgfSwgKF8sIGkpID0+IHsKICAgIGNvbnN0IHkgPSAxNSArIGkgKiAyMDsKICAgIGNvbnN0IHdpZHRoID0gWzM3LCA0NywgNDQsIDMzXVtpXTsKICAgIHJldHVybiBgPHBhdGggZD0iTS01ICR7eX0gQy0ke3dpZHRoICogLjU1fSAke3kgKyA3fS0ke3dpZHRofSAke3kgLSA5fS0ke3dpZHRofSAke3kgKyAxfSBDLSR7d2lkdGh9ICR7eSArIDEyfS0ke3dpZHRoICogLjV9ICR7eSArIDIxfS02ICR7eSArIDl9Ii8+YDsKfSkuam9pbignJyk7CmV4cG9ydCBjb25zdCBkZWZpbml0aW9ucyA9IGA8ZGVmcz4KICA8ZyBpZD0iYm9uZSI+PHBhdGggZD0iTS02IDggQy05IDMtMTMgNS0xMy0yIEMtMTMtOS01LTExIDAtNyBDNS0xMSAxMy05IDEzLTIgQzEzIDUgOSAzIDYgOCBDMyAyNiAzIDUyIDYgNzAgQzkgNzUgMTMgNzMgMTMgODAgQzEzIDg3IDUgODkgMCA4NSBDLTUgODktMTMgODctMTMgODAgQy0xMyA3My05IDc1LTYgNzAgQy0zIDUyLTMgMjYtNiA4WiIvPjwvZz4KCiAgPGcgaWQ9ImhhbmQiPgogICAgPHBhdGggZD0iTS04IDAgUTAtNCA4IDAgTDkgMTIgUTAgMTctOSAxMloiLz4KICAgIDxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiPgogICAgICA8cGF0aCBkPSJNLTggMTUgTC0xNyAyMyBMLTIyIDMxIE0tNiAxOCBMLTkgMzIgTC0xMCA0MyBNMCAxOSBMMCAzNSBMMCA0OCBNNiAxOCBMOCAzMyBMOSA0NSBNMTEgMTcgTDE1IDI5IEwxNiAzOSIvPgogICAgPC9nPjxwYXRoIGNsYXNzPSJkZXRhaWwiIHN0cm9rZS13aWR0aD0iMiIgZD0iTS0xMyAyNiBMLTE4IDI0IE0tMTIgMzMgTC02IDM0IE0tMyAzNSBIMyBNNSAzNCBMMTEgMzMgTTEyIDMwIEwxOCAyOCIvPgogIDwvZz4KICA8ZyBpZD0iZm9vdCI+PHBhdGggZD0iTS03LTQgUTAtOCA3LTQgTDkgNyBRMTMgMTUgMjUgMTggUTM0IDIzIDI5IDI5IFEyNSAzMyAxNyAyOSBMLTkgMjEgUS0xNSAxNy0xMSA4WiIvPjxwYXRoIGNsYXNzPSJkZXRhaWwiIHN0cm9rZS13aWR0aD0iMiIgZD0iTS00IDQgTDUgNyBNLTggMTMgTDEwIDE4IE0xNCAxNyBMMTAgMjYgTTIwIDIwIEwxNyAyOSBNMjYgMjIgTDI0IDMxIi8+PC9nPgogIDxnIGlkPSJyaWJzIj4ke3JpYnN9PC9nPgo8L2RlZnM+YDsKZXhwb3J0IGNvbnN0IHNrdWxsID0gYDxwYXRoIGQ9Ik0wLTY2IEMtMjctNjYtNDMtNDctNDMtMjMgTC00MS02IFEtNDYgNi0zMyAxMiBMLTI1IDE0IEwtMjMgMjkgUTAgMzcgMjMgMjkgTDI1IDE0IEwzMyAxMiBRNDYgNiA0MS02IEw0My0yMyBDNDMtNDcgMjctNjYgMC02NloiLz4KJHtyZWZsZWN0KCc8cGF0aCBjbGFzcz0iaW5rIiBkPSJNLTM0LTE5IFEtMjYtMjctMTItMjAgTC05LTkgUS0xMiAzLTI1IDIgUS0zNyAxLTM0LTE5WiIvPicpfQo8cGF0aCBjbGFzcz0iaW5rIiBkPSJNMCAwIEMtMyA0LTEwIDE1LTcgMTkgUS00IDIyIDAgMTggUTQgMjIgNyAxOSBDMTAgMTUgMyA0IDAgMFoiLz4KPHBhdGggY2xhc3M9ImRldGFpbCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNLTE2IDI1IFYzMiBNLTggMjYgVjM0IE0wIDI2IFYzNCBNOCAyNiBWMzQgTTE2IDI1IFYzMiIvPmA7CmV4cG9ydCBjb25zdCBqYXcgPSBgPHBhdGggZD0iTS0yOS0xNyBMLTI1LTE2IEwtMjEtMyBRMCA1IDIxLTMgTDI1LTE2IEwyOS0xNyBMMjcgMyBRMjQgMTUgMCAxNiBRLTI0IDE1LTI3IDNaIi8+PHBhdGggY2xhc3M9ImRldGFpbCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNLTE2LTEgVjUgTS04IDEgVjcgTTAgMiBWOCBNOCAxIFY3IE0xNi0xIFY1Ii8+YDsKZXhwb3J0IGNvbnN0IHRvcnNvID0gYDxwYXRoIGQ9Ik0tNS0xNSBINSBWMTIzIEgtNVoiLz4KPHBhdGggY2xhc3M9ImRldGFpbCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNLTUtOSBINSBNLTUtMyBINSBNLTUgOTQgSDUgTS01IDEwMyBINSBNLTUgMTEyIEg1Ii8+CiR7cmVmbGVjdCgnPHBhdGggZD0iTS01IDQgQy0xOS01LTI5LTMtNDUgMiBRLTUxIDMtNTAgOCBRLTQ5IDEyLTQ0IDEwIEMtMjggNC0xOSA0LTYgMTJaIi8+Jyl9CjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI3Ij4ke3JlZmxlY3QoJzx1c2UgaHJlZj0iI3JpYnMiLz4nKX08L2c+CjxwYXRoIGQ9Ik0tNiA2IFEwIDIgNiA2IEw1IDUzIEwyIDY3IEwwIDcxIEwtMiA2NyBMLTUgNTNaIi8+CiR7cmVmbGVjdCgnPHBhdGggZD0iTS00IDExOSBDLTE3IDExOS0yNCAxMDEtMzkgMTA4IEMtNTAgMTE2LTQyIDEzNy0zMiAxNDEgTC0yNSAxNTYgUS0xNSAxNjctMyAxNTcgTDAgMTQ2IEwtOCAxNDAgQy0xOSAxMzctMjQgMTI5LTIyIDEyMyBMLTcgMTM1WiIvPjxwYXRoIGNsYXNzPSJpbmsiIGQ9Ik0tMjEgMTQxIFEtMTAgMTQxLTggMTUwIFEtMTAgMTYwLTE5IDE1NiBRLTI3IDE1Mi0yMSAxNDFaIi8+Jyl9CjxwYXRoIGQ9Ik0tOCAxMTkgSDggTDUgMTM0IEwwIDE0MiBMLTUgMTM0WiIvPmA7CmV4cG9ydCBmdW5jdGlvbiBsaW1iKGxlbmd0aCwgZW5kLCBtaXJyb3IgPSBmYWxzZSkgewogICAgcmV0dXJuIGA8dXNlIGhyZWY9IiNib25lIiB0cmFuc2Zvcm09InNjYWxlKDAuOSAke2xlbmd0aCAvIDc4fSkiLz4ke2VuZCA/IGA8dXNlIGhyZWY9IiMke2VuZH0iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgJHtsZW5ndGggKyA1fSkgc2NhbGUoJHttaXJyb3IgPyAtMC44IDogMC44fSAwLjgpIi8+YCA6ICcnfWA7Cn0KY29uc3QgYnVsYkNvbG9ycyA9IFsnI2ZmNjY1ZScsICcjZmZkNjZiJywgJyM3ZWRjYTEnLCAnIzhkYmZmZiddOwpjb25zdCBidWxicyA9IFsKICAgIC4uLkFycmF5LmZyb20oeyBsZW5ndGg6IDcgfSwgKF8sIGkpID0+IFstODQgKyBpICogMjgsIC03MF0pLAogICAgLi4uQXJyYXkuZnJvbSh7IGxlbmd0aDogNyB9LCAoXywgaSkgPT4gWy04NCArIGkgKiAyOCwgNzBdKSwKICAgIFstMTAyLCAtNDJdLCBbLTEwMiwgLTE0XSwgWy0xMDIsIDE0XSwgWy0xMDIsIDQyXSwKICAgIFsxMDIsIC00Ml0sIFsxMDIsIC0xNF0sIFsxMDIsIDE0XSwgWzEwMiwgNDJdLApdLm1hcCgoW3gsIHldLCBpKSA9PiBgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoJHt4fSAke3l9KSI+PGNpcmNsZSByPSI3IiBmaWxsPSIke2J1bGJDb2xvcnNbaSAlIDRdfSIgb3BhY2l0eT0iLjE4IiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIHI9IjQiIGZpbGw9IiR7YnVsYkNvbG9yc1tpICUgNF19IiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSItMSIgY3k9Ii0xIiByPSIxLjIiIGZpbGw9IiNmZmYiIHN0cm9rZT0ibm9uZSIgb3BhY2l0eT0iLjgiLz48L2c+YCkuam9pbignJyk7CmV4cG9ydCBjb25zdCBiaXJ0aGRheVNpZ24gPSBgPHJlY3QgeD0iLTEwNSIgeT0iLTczIiB3aWR0aD0iMjEwIiBoZWlnaHQ9IjE0NiIgcng9IjE4IiBmaWxsPSIjMTYxZDE5IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iNSIvPgo8cmVjdCB4PSItOTQiIHk9Ii02MiIgd2lkdGg9IjE4OCIgaGVpZ2h0PSIxMjQiIHJ4PSIxMiIgZmlsbD0iI2ZmZjRkNyIgc3Ryb2tlPSIjZTJjZmE4IiBzdHJva2Utd2lkdGg9IjIiLz4KPHJlY3QgeD0iLTEwMiIgeT0iLTcwIiB3aWR0aD0iMjA0IiBoZWlnaHQ9IjE0MCIgcng9IjE2IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NjY1NGQiIHN0cm9rZS13aWR0aD0iMiIvPgoke2J1bGJzfQo8ZyBmaWxsPSIjMjgyNTFmIiBzdHJva2U9Im5vbmUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJHcmFuZHN0YW5kZXIsIHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI2MDAiPgo8dGV4dCB5PSItMjkiIGZvbnQtc2l6ZT0iMjIiPnRoYW5rcyBmb3I8L3RleHQ+PHRleHQgeT0iMSIgZm9udC1zaXplPSIyMiI+Y29taW5nIHRvIG15PC90ZXh0Pjx0ZXh0IHk9IjM2IiBmb250LXNpemU9IjI5Ij5iaXJ0aGRheTwvdGV4dD4KPC9nPmA7Cg==";
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
        const body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(x / SCALE, y / SCALE).setRotation(angle).setLinearDamping(0.35).setAngularDamping(0.55));
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
    // The sign supports the raised hand, leaving the rest of the ragdoll free.
    const sign = part('birthday-sign', 465, 10, `<g transform="scale(1.2)">${birthdaySign}</g>`, 120, 84);
    sign.setBodyType(RAPIER.RigidBodyType.Fixed, true);
    for (const side of [-1, 1]) {
        const arm = part(`arm-${side}`, 300 + side * 49, 242, limb(85), 9, 43, 40, -side * 0.28);
        join(chest, arm, side * 49, 6, 0, 0, [-2.6, 2.6]);
        const elbow = arm.translation();
        const forearm = part(`forearm-${side}`, elbow.x * SCALE + Math.sin(side * 0.28) * 85, 242 + Math.cos(0.28) * 85, limb(77, 'hand', side < 0), 12, 55, 49);
        join(arm, forearm, 0, 85, 0, 0, [-2.3, 2.3]);
        if (side === 1)
            join(sign, forearm, -78, 84, 0, 105);
        const thigh = part(`thigh-${side}`, 300 + side * 24, 391, limb(101), 10, 50, 47, -side * 0.12);
        join(chest, thigh, side * 24, 155, 0, 0, [-1.3, 1.3]);
        const shin = part(`shin-${side}`, 300 + side * 36, 491, limb(103, 'foot', side < 0), 12, 65, 57);
        join(thigh, shin, 0, 101, 0, 0, [-1.9, 1.9]);
    }
    // Keep the lettering in front of the arm; fingers extend below the edge.
    const signElement = parts.find(p => p.body === sign).element;
    signElement.style.pointerEvents = 'none';
    layer.append(signElement);
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
            if (!body || body.isFixed())
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
            if (body.isDynamic())
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
