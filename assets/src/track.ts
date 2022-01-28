import { Vec2 } from "cc";

export type AdjacencyList = number[][];

export interface ITrackState {
    visited: number[];
    offset: number;
}


function redirect(al: AdjacencyList, index2position: (index: number) => Vec2, index: number, direction: Vec2): number {
    let project = 0;
    const position = index2position(index);
    const neighbors = al[index];
    let target = neighbors[0];
    neighbors.forEach(idx => {
        const vTo = index2position(idx).subtract(position);
        if (Vec2.angle(direction, vTo) < Math.PI / 2) {
            const d = direction.clone();
            const length = d.project(vTo).length();
            if (length > project) {
                project = length;
                target = idx;
            }
        }
    });
    return target;
}

export function toPosition(index2position: (index: number) => Vec2, state: ITrackState): Vec2 {
    const { visited, offset } = state;
    const posNex = index2position(visited[visited.length - 1]);
    const posCur = index2position(visited[visited.length - 2]);
    return posCur.subtract(posNex).normalize().multiplyScalar(-offset).add(posNex);
}

export function go(al: AdjacencyList, index2position: (index: number) => Vec2, state: ITrackState, touch: Vec2): ITrackState {
    let { visited, offset } = state;

    visited = visited.concat();

    let idxNex = visited.pop();
    let idxCur = visited.pop();
    let idxLas: number = undefined;

    const direction = new Vec2();
    Vec2.subtract(direction, touch, index2position(idxCur))
    if (Math.abs(offset) < 22) {
        let target = redirect(al, index2position, idxNex, direction);
        if (target != idxCur) {
            idxLas = idxCur;
            idxCur = idxNex;
            idxNex = target;
        }
    } else if (Math.abs(offset + Vec2.distance(index2position(idxCur), index2position(idxNex))) < 22) {
        let target = redirect(al, index2position, idxCur, direction);
        idxLas = visited.pop();
        if (target == idxLas) {
            idxNex = idxCur;
            idxCur = idxLas;
            idxLas = visited.pop();
        } else {
            idxNex = target;
        }
    }

    Vec2.subtract(direction, touch, index2position(idxCur));
    const vTo = new Vec2();
    Vec2.subtract(vTo, index2position(idxNex), index2position(idxCur));
    const vToL = vTo.length()
    const radians = Vec2.angle(direction, vTo)
    offset =
        radians > Math.PI / 2
            ? -vToL
            : Math.min(direction.project(vTo).length() - vToL, 0);

    idxLas != undefined && visited.push(idxLas);
    idxCur != undefined && visited.push(idxCur);
    idxNex != undefined && visited.push(idxNex);

    return {
        visited,
        offset
    };
}