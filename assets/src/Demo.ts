
import { Component, EventTouch, Node, UITransform, Vec2, Vec3, _decorator } from 'cc';
import { AdjacencyList, go, ITrackState, toPosition } from './track';
const { ccclass, property } = _decorator;

const adjacency: AdjacencyList = [
    /* 0  */[3],
    /* 1  */[5],
    /* 2  */[3],
    /* 3  */[0, 2, 4, 8],
    /* 4  */[3, 5, 9],
    /* 5  */[1, 4, 6, 10],
    /* 6  */[5],
    /* 7  */[8],
    /* 8  */[3, 7, 9, 13],
    /* 9  */[4, 8, 10, 14],
    /* 10 */[5, 9, 11, 15],
    /* 11 */[10],
    /* 12 */[13],
    /* 13 */[8, 12, 14],
    /* 14 */[9, 13, 15, 16],
    /* 15 */[10, 14],
    /* 16 */[14],
]

@ccclass('Demo')
export class Demo extends Component {
    @property(Node)
    target: Node = null;

    start() {
        let state: ITrackState = {
            visited: [0, 3],
            offset: -Vec2.distance(this.index2position(0), this.index2position(3))
        }

        const { x, y } = toPosition(this.index2position.bind(this), state);
        this.target.position = new Vec3(x, y)

        this.node.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
            let { x, y } = event.getUILocation();
            ({ x, y } = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(x, y)));
            console.log('x, y', x, y);
            const res = go(adjacency, this.index2position.bind(this), state, new Vec2(x, y));
            console.log('res', res)
            state = res;

            ({ x, y } = toPosition(this.index2position.bind(this), state));
            this.target.position = new Vec3(x, y)
        })
    }

    index2position(index: number): Vec2 {
        const { x, y } = this.node.children[index].position;
        return new Vec2(x, y);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}